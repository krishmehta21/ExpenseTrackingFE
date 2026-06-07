import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpenseService } from '../../services/expense';
import { ToastService } from '../../services/toast';
import { Expense } from '../../models/expense';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.css']
})
export class ExpenseForm implements OnInit {
  expenseForm!: FormGroup;
  isEditMode = false;
  expenseId!: number;
  isSubmitting = false;
  isLoading = false;

  categories = ['Food', 'Transport', 'Office', 'Travel', 'Utilities', 'Entertainment', 'Health', 'Education', 'Other'];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      expenseDate: ['', Validators.required],
      notes: ['', Validators.maxLength(500)]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.expenseId = +params['id'];
        this.loadExpense(this.expenseId);
      }
    });
  }

  loadExpense(id: number): void {
    this.isLoading = true;
    this.expenseService.getExpenseById(id).subscribe({
      next: (expense) => {
        this.expenseForm.patchValue(expense);
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Expense not found');
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      this.toastService.warning('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;
    const expense: Expense = this.expenseForm.value;

    if (this.isEditMode) {
      this.expenseService.updateExpense(this.expenseId, expense).subscribe({
        next: () => {
          this.toastService.success('Expense updated successfully');
          this.router.navigate(['/']);
        },
        error: () => {
          this.toastService.error('Failed to update expense');
          this.isSubmitting = false;
        }
      });
    } else {
      this.expenseService.createExpense(expense).subscribe({
        next: () => {
          this.toastService.success('Expense created successfully');
          this.router.navigate(['/']);
        },
        error: () => {
          this.toastService.error('Failed to create expense');
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.expenseForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getError(field: string): string {
    const control = this.expenseForm.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required';
    if (control.errors['min']) return 'Amount must be greater than zero';
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    return '';
  }
}
