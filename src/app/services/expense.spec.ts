import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ExpenseService } from './expense';
import { Expense } from '../models/expense';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let httpMock: HttpTestingController;

  const mockExpense: Expense = {
    id: 1,
    title: 'Team Lunch',
    category: 'Food',
    amount: 85.5,
    expenseDate: '2025-06-01',
    notes: 'Monthly lunch'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ExpenseService
      ]
    });
    service = TestBed.inject(ExpenseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all expenses', () => {
    service.getAllExpenses().subscribe(expenses => {
      expect(expenses.length).toBe(2);
      expect(expenses[0].title).toBe('Team Lunch');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/expenses');
    expect(req.request.method).toBe('GET');
    req.flush([mockExpense, { ...mockExpense, id: 2, title: 'Taxi' }]);
  });

  it('should fetch expense by ID', () => {
    service.getExpenseById(1).subscribe(expense => {
      expect(expense.title).toBe('Team Lunch');
      expect(expense.amount).toBe(85.5);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/expenses/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockExpense);
  });

  it('should create an expense', () => {
    const newExpense: Expense = { title: 'Coffee', category: 'Food', amount: 5, expenseDate: '2025-06-05', notes: '' };

    service.createExpense(newExpense).subscribe(expense => {
      expect(expense.id).toBe(3);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/expenses');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newExpense);
    req.flush({ ...newExpense, id: 3 });
  });

  it('should update an expense', () => {
    service.updateExpense(1, mockExpense).subscribe(expense => {
      expect(expense.title).toBe('Team Lunch');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/expenses/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockExpense);
  });

  it('should delete an expense', () => {
    service.deleteExpense(1).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/expenses/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch paginated expenses', () => {
    service.getExpensesPaginated(0, 10, 'expenseDate', 'desc').subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.totalElements).toBe(1);
    });

    const req = httpMock.expectOne(r => r.url.includes('/paginated'));
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    req.flush({ content: [mockExpense], totalElements: 1, totalPages: 1, size: 10, number: 0, first: true, last: true });
  });

  it('should search expenses', () => {
    service.searchExpenses('lunch', 0, 10).subscribe(page => {
      expect(page.content[0].title).toBe('Team Lunch');
    });

    const req = httpMock.expectOne(r => r.url.includes('/search'));
    expect(req.request.params.get('query')).toBe('lunch');
    req.flush({ content: [mockExpense], totalElements: 1, totalPages: 1, size: 10, number: 0, first: true, last: true });
  });

  it('should fetch categories', () => {
    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(['Food', 'Transport']);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/expenses/categories');
    req.flush(['Food', 'Transport']);
  });

  it('should fetch stats', () => {
    service.getStats().subscribe(stats => {
      expect(stats.totalCount).toBe(10);
      expect(stats.totalAmount).toBe(500);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/expenses/stats');
    req.flush({ totalCount: 10, totalAmount: 500, averageAmount: 50, highestAmount: 150 });
  });
});
