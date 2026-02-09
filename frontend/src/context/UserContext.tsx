import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Account, CurrentUser, GetCurrentUserResponse, Transaction } from '../api/types';

interface UserContextType {
  user: any | null; // תחליפי בטיפוס האמיתי שלך
  account: any | null;
  transactions: any[] | null;
  setUserData: (data: GetCurrentUserResponse) => void; // פונקציה לעדכון הסטייט
  clearUser: () => void; // להתנתקות
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
const [user, setUser] = useState<CurrentUser | null>(null);
const [account, setAccount] = useState<Account | null>(null);
const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  const setUserData = (response: GetCurrentUserResponse) => {
    setUser(response.data.user);
    setAccount(response.data.account);
    setTransactions(response.data.recentTransactions);
  };

  const clearUser = () => {
    setUser(null);
    setAccount(null);
    setTransactions(null);
  };

  return (
    <UserContext.Provider value={{ user, account, transactions, setUserData, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};