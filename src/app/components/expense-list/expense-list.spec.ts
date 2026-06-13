import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ExpenseListComponent } from './expense-list';

describe('ExpenseListComponent', () => {
  let component: ExpenseListComponent;
  let fixture: ComponentFixture<ExpenseListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in loading state', () => {
    expect(component.isLoading()).toBe(true);
  });

  it('should load data on init', () => {
    fixture.detectChanges();

    // Respond to stats request
    const statsReq = httpMock.expectOne(r => r.url.includes('/stats'));
    statsReq.flush({ totalCount: 5, totalAmount: 250, averageAmount: 50, highestAmount: 100 });

    // Respond to categories request
    const catReq = httpMock.expectOne(r => r.url.includes('/categories'));
    catReq.flush(['Food', 'Transport']);

    // Respond to paginated request
    const pageReq = httpMock.expectOne(r => r.url.includes('/paginated'));
    pageReq.flush({
      content: [{ id: 1, title: 'Lunch', category: 'Food', amount: 50, expenseDate: '2025-06-01', notes: '' }],
      totalElements: 1, totalPages: 1, size: 10, number: 0, first: true, last: true
    });

    expect(component.stats().totalCount).toBe(5);
    expect(component.categories()).toEqual(['Food', 'Transport']);
    expect(component.expenses().length).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should get correct pill class for category', () => {
    const pillClass = component.getCategoryPillClass('Food');
    expect(pillClass).toMatch(/^pill-/);
  });

  it('should calculate page numbers', () => {
    component.currentPage.set(0);
    component.totalPages.set(5);
    const pages = component.getPageNumbers();
    expect(pages.length).toBeGreaterThan(0);
    expect(pages).toContain(0);
  });

  it('should filter by category and reset search', () => {
    component.selectedCategory = '';
    component.searchQuery = 'test';
    component.onCategoryFilter('Food');

    expect(component.selectedCategory).toBe('Food');
    expect(component.searchQuery).toBe('');

    // Flush the category request triggered by onCategoryFilter
    const catReq = httpMock.expectOne(r => r.url.includes('/category/Food'));
    catReq.flush({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 0, first: true, last: true });
  });

  it('should toggle category filter off when clicking same category', () => {
    component.selectedCategory = 'Food';
    component.onCategoryFilter('Food');

    expect(component.selectedCategory).toBe('');

    // Flush the paginated request triggered by clearing category
    const pageReq = httpMock.expectOne(r => r.url.includes('/paginated'));
    pageReq.flush({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 0, first: true, last: true });
  });

  it('should clear all filters and reload', () => {
    component.searchQuery = 'test';
    component.selectedCategory = 'Food';
    component.clearFilters();

    expect(component.searchQuery).toBe('');
    expect(component.selectedCategory).toBe('');
    expect(component.currentPage()).toBe(0);

    // Flush the paginated request triggered by clearFilters
    const pageReq = httpMock.expectOne(r => r.url.includes('/paginated'));
    pageReq.flush({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 0, first: true, last: true });
  });

  afterEach(() => {
    httpMock.verify({ ignoreCancelled: true });
  });
});
