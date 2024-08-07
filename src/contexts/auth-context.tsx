import React, { FC, ReactNode, createContext, useContext, useEffect, useReducer, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { serverUrl } from '@/config/development';
import { AuthContextType } from '@/interfaces/user';

interface HandlerType {
  INITIALIZE: string;
  SIGN_IN: string;
  SIGN_IN_WITH_WALLET: string;
  SIGN_OUT: string;
  SIGN_OUT_WALLET: string;
}
const HANDLERS: HandlerType = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_IN_WITH_WALLET: 'SIGN_IN_WITH_WALLET',
  SIGN_OUT: 'SIGN_OUT',
  SIGN_OUT_WALLET: 'SIGN_OUT_WALLET'
};

interface stateType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
}

const initialState: stateType = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

interface AuthProviderProps {
  children: ReactNode;
}

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
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state: stateType, action: any) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state: stateType) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  },
};

const reducer = (state: stateType, action: any) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {

      const user = {
        id: '5e86809283e28b96d2d38537',
        avatar: '/assets/avatars/avatar-anika-visser.png',
        name: 'Anika Visser',
        email: 'anika.visser@devias.io'
      };

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
      const user: any = localStorage.getItem('teachAssist')
      const data = JSON.parse(user)
      if (data) {
        console.log('auth provider')
        setUser(data)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (email: string, password: string) => {
    // if (email !== 'demo@devias.io' || password !== 'Password123!') {
    //   throw new Error('Please check your email and password');
    // }
    let res = null
    try {
      res = await axios.post(`${serverUrl}/api/v1/auth/login`, { email, password })
    } catch (err) {
      throw new Error('Please check your email and password');
    }

    try {
      window.sessionStorage.setItem('authenticated', 'true');
      localStorage.setItem('teachAssist', res.data.result.token)
    } catch (err) {
      console.error(err);
    }

    // console.log(res.data.user.name, " ", res.data.user.email)

    const _user = res.data.result.user

    const user = {
      id: '947958739485739288725',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      // name: res.data.user.name,
      name: _user.name,
      // email: res.data.user.email
      email: _user.email
    };

    localStorage.setItem('teachAssist', JSON.stringify(user))

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const setUser = (user: any) => {
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  }

  const signUp = async (email: string, name: string, password: string, addr: string, phone: string) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/auth/register`, { email, name, password, addr, phone });
    } catch (err) {
      throw new Error('Please check your email and password');
    }
  };

  const signOut = () => {
    window.sessionStorage.removeItem('authenticated');
    localStorage.removeItem('teachAssist')
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      user: state.user,
      signIn,
      signUp,
      signOut,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
