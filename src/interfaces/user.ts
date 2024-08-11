export interface User {
  id: number | string
  name: string
  photo?: string
  professional?: string
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  bot: any;
  plan: string;
  signIn: (email: string, password: string, remember: boolean) => void;
  signUp: (email: string, name: string, password: string, addr: string, phone: string) => void;
  signOut: () => void;
  setUser: (user: any, plan: any, chat: any) => void;
  makingQuiz: () => Promise<boolean>;
  upgradingPlan: (plan: number) => void;
}