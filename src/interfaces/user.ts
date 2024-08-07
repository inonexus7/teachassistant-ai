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
  signIn: (email: string, password: string) => void;
  signUp: (email: string, name: string, password: string, addr: string, phone: string) => void;
  signOut: () => void;
  setUser: (user: any) => void;
}