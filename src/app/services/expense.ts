import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, PagedResponse, ExpenseStats } from '../models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private baseUrl = 'https://expensetrackingbe.onrender.com/api/expenses';

  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.baseUrl);
  }

  getExpensesPaginated(page = 0, size = 10, sortBy = 'expenseDate', direction = 'desc'): Observable<PagedResponse<Expense>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);
    return this.http.get<PagedResponse<Expense>>(`${this.baseUrl}/paginated`, { params });
  }

  searchExpenses(query: string, page = 0, size = 10): Observable<PagedResponse<Expense>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<Expense>>(`${this.baseUrl}/search`, { params });
  }

  getByCategory(category: string, page = 0, size = 10): Observable<PagedResponse<Expense>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<Expense>>(`${this.baseUrl}/category/${category}`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }

  getStats(): Observable<ExpenseStats> {
    return this.http.get<ExpenseStats>(`${this.baseUrl}/stats`);
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/${id}`);
  }

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.baseUrl, expense);
  }

  updateExpense(id: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseUrl}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
