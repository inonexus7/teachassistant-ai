import React, { FC, ReactNode, createContext, useContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { serverUrl } from '@/config/development';
import { AuthContextType } from '@/interfaces/user';
import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material';
import { useRouter } from 'next/router';
import { axiosApi } from '@/config/development';

interface HandlerType {
  INITIALIZE: string;
  SIGN_IN: string;
  SIGN_IN_WITH_WALLET: string;
  SIGN_OUT: string;
  SIGN_OUT_WALLET: string;
  BUILDING_QUIZ: string;
  UPGRADING_PLAN: string;
}
const HANDLERS: HandlerType = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_IN_WITH_WALLET: 'SIGN_IN_WITH_WALLET',
  SIGN_OUT: 'SIGN_OUT',
  SIGN_OUT_WALLET: 'SIGN_OUT_WALLET',
  BUILDING_QUIZ: "BUILDING_QUIZ",
  UPGRADING_PLAN: "UPGRADING_PLAN"
};

interface stateType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  bot: any;
  plan: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const initialState: stateType = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  bot: {
    current: 0,
    limit: 5
  },
  plan: "Free"
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state: stateType, action: any) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user,
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state: stateType, action: any) => {
    const user = action.payload.user;
    const plan = action.payload.plan;
    const chat = action.payload.chat;

    return {
      ...state,
      isAuthenticated: true,
      user,
      bot: {
        current: chat.current,
        limit: chat.limit
      },
      plan
    };
  },
  [HANDLERS.SIGN_OUT]: (state: stateType) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  },
  [HANDLERS.BUILDING_QUIZ]: (state: stateType) => {
    return {
      ...state,
      bot: {
        ...state.bot,
        current: state.bot.current + 1 <= state.bot.limit ? state.bot.current + 1 : state.bot.limit
      }
    }
  },
  [HANDLERS.UPGRADING_PLAN]: (state: stateType, action: any) => {
    switch (action.payload) {
      case 0:
        return {
          ...state,
          bot: {
            current: 0,
            limit: 5
          },
          plan: "Free"
        }
      case 1:
        return {
          ...state,
          bot: {
            current: 0,
            limit: 20
          },
          plan: "Starter"
        }
      case 2:
        return {
          ...state,
          bot: {
            current: 0,
            limit: 50
          },
          plan: "Professional"
        }
      default:
        return state
    }
  }
};

const reducer = (state: stateType, action: any) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // const { children } = props;
  const [toast, setToast] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [state, dispatch] = useReducer(reducer, initialState);
  // const initialized = useRef(false);
  const router = useRouter();

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    // if (initialized.current) {
    //   return;
    // }

    // initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
      const user: any = localStorage.getItem('teachAssist')
      const data = JSON.parse(user)
      if (data) {
        console.log('auth provider')
        const token = localStorage.getItem('teachai_token')
        axiosApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // getting plan state.
        const res = await axiosApi.post("/getUserState", { token });
        console.log(res.data)
        setUser(data, res.data.plan, res.data.chat)
      }
    } catch (err) {
      console.error(err);
    }

    if (!isAuthenticated) {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setToast(false);
  }

  const signIn = async (email: string, password: string, remember: boolean) => {
    // if (email !== 'demo@devias.io' || password !== 'Password123!') {
    //   throw new Error('Please check your email and password');
    // }
    let res = null;

    try {
      res = await axiosApi.post(`${serverUrl}/api/v1/auth/login`, { email, password })
    } catch (err) {
      setToast(true)
      setMsg('Please check your email and password');
    }

    if (!res) return false;

    const _user = res.data.result.user

    const user = {
      id: '947958739485739288725',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      // name: res.data.user.name,
      name: _user.name,
      // email: res.data.user.email
      email: _user.email
    };

    if (remember) {
      window.sessionStorage.setItem('authenticated', 'true');
      localStorage.setItem('teachai_token', res.data.result.token)

      localStorage.setItem('teachAssist', JSON.stringify(user))
    }
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${res.data.result.token}`;

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: {
        user,
        plan: res.data.result.plan,
        chat: {
          current: res.data.result.current,
          limit: res.data.result.limit
        }
      }
    });

    router.push("/")
  };

  const setUser = (user: any, plan: any, chat: any) => {
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: {
        user,
        plan,
        chat
      }
    });
  }

  const signUp = async (email: string, name: string, password: string, addr: string, phone: string) => {
    try {
      const res = await axiosApi.post(`${serverUrl}/api/v1/auth/register`, { email, name, password, addr, phone });
      router.push("/signin")
    } catch (err) {
      setToast(true)
      setMsg('Please try again to register!');
    }
  };

  const signOut = () => {
    window.sessionStorage.removeItem('authenticated');
    localStorage.removeItem('teachAssist')
    localStorage.removeItem('teachai_token')
    axiosApi.defaults.headers.common['Authorization'] = null;
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  const makingQuiz = (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedResult = await axiosApi.post("/updatingChatHistory", { email: state.user.email })
        console.log("updated!");
        dispatch({
          type: HANDLERS.BUILDING_QUIZ,
        })
        resolve(true);
      } catch (err) {
        console.log("updating chat history got error!")
        reject(false);
      }
    })
  }

  const upgradingPlan = (plan: number) => {
    dispatch({
      type: HANDLERS.UPGRADING_PLAN,
      payload: plan
    })
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      user: state.user,
      bot: state.bot,
      plan: state.plan,
      signIn,
      signUp,
      signOut,
      setUser,
      makingQuiz,
      upgradingPlan
    }}>
      {children}
      <Snackbar open={toast} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
