import { createContext } from 'react';

export type UserContextType = {
  loggedInUser: string | null;
  setLoggedInUser: (user: string | null) => void;
};

export const UserContext = createContext<UserContextType>({
  loggedInUser: null,
  setLoggedInUser: () => {},
});
