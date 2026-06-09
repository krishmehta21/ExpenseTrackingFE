import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense';
import { ToastService } from '../../services/toast';
import { Expense, ExpenseStats } from '../../models/expense';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.css']
})
export class ExpenseListComponent implements OnInit {
  expenses = signal<Expense[]>([]);
  stats = signal<ExpenseStats>({ totalCount: 0, totalAmount: 0, averageAmount: 0, highestAmount: 0 });
  categories = signal<string[]>([]);
  isLoading = signal(true);
  searchQuery = '';
  selectedCategory = '';
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 10;

  constructor(
    private expenseService: ExpenseService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.expenseService.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => this.toastService.error('Failed to load statistics')
    });
    this.expenseService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => {}
    });
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.isLoading.set(true);

    if (this.searchQuery.trim()) {
      this.expenseService.searchExpenses(this.searchQuery, this.currentPage(), this.pageSize).subscribe({
        next: (page) => {
          this.expenses.set(page.content);
          this.totalPages.set(page.totalPages);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastService.error('Search failed');
          this.isLoading.set(false);
        }
      });
    } else if (this.selectedCategory) {
      this.expenseService.getByCategory(this.selectedCategory, this.currentPage(), this.pageSize).subscribe({
        next: (page) => {
          this.expenses.set(page.content);
          this.totalPages.set(page.totalPages);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastService.error('Filter failed');
          this.isLoading.set(false);
        }
      });
    } else {
      this.expenseService.getExpensesPaginated(this.currentPage(), this.pageSize).subscribe({
        next: (page) => {
          this.expenses.set(page.content);
          this.totalPages.set(page.totalPages);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastService.error('Failed to load expenses');
          this.isLoading.set(false);
        }
      });
    }
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.selectedCategory = '';
    this.loadExpenses();
  }

  onCategoryFilter(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.searchQuery = '';
    this.currentPage.set(0);
    this.loadExpenses();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.currentPage.set(0);
    this.loadExpenses();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadExpenses();
    }
  }

  addExpense(): void {
    this.router.navigate(['/add']);
  }

  editExpense(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  deleteExpense(id: number): void {
    if (confirm('Delete this expense permanently?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.toastService.success('Expense deleted successfully');
          this.loadData();
        },
        error: () => this.toastService.error('Failed to delete expense')
      });
    }
  }

  getCategoryPillClass(category: string): string {
    const hash = category.toLowerCase().split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const classes = ['pill-primary', 'pill-success', 'pill-warning', 'pill-danger', 'pill-info'];
    return classes[hash % classes.length];
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
