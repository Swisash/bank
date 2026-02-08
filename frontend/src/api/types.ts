export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// חשבון
export interface Account {
  balance: number;
  currency: string;
  status: string;
}

// פעולה אחרונה
export interface Transaction {
  _id: string;
  id: number;
  fromEmail: string;
  toEmail: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// תגובת השרת המלאה
export interface GetCurrentUserResponse {
  success: boolean;
  data: {
    user: CurrentUser;
    account: Account;
    recentTransactions: Transaction[];
  };
}


