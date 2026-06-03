export interface Expense {
  id?: number;
  title: string;
  category: string;
  amount: number;
  expenseDate: string;
  notes: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ExpenseStats {
  totalCount: number;
  totalAmount: number;
  averageAmount: number;
  highestAmount: number;
}
