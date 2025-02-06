import { createContext } from 'react';

export type AdminContextType = {
  loggedInAdmin: boolean;  
  setLoggedInAdmin: (value: boolean) => void;  
};

export const AdminContext = createContext<AdminContextType>({
  loggedInAdmin: false,  
  setLoggedInAdmin: () => {}, 
});