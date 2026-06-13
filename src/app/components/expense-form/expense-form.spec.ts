import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ExpenseForm } from './expense-form';

describe('ExpenseForm', () => {
  let component: ExpenseForm;
  let fixture: ComponentFixture<ExpenseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in create mode', () => {
    expect(component.isEditMode).toBe(false);
    expect(component.expenseForm).toBeDefined();
  });

  it('should have required validators on title', () => {
    const title = component.expenseForm.get('title');
    title?.setValue('');
    expect(title?.hasError('required')).toBe(true);
  });

  it('should have required validators on category', () => {
    const category = component.expenseForm.get('category');
    category?.setValue('');
    expect(category?.hasError('required')).toBe(true);
  });

  it('should validate minimum amount', () => {
    const amount = component.expenseForm.get('amount');
    amount?.setValue(-5);
    expect(amount?.hasError('min')).toBe(true);

    amount?.setValue(10);
    expect(amount?.valid).toBe(true);
  });

  it('should have required validator on date', () => {
    const date = component.expenseForm.get('expenseDate');
    date?.setValue('');
    expect(date?.hasError('required')).toBe(true);
  });

  it('should validate notes max length', () => {
    const notes = component.expenseForm.get('notes');
    notes?.setValue('a'.repeat(501));
    expect(notes?.hasError('maxlength')).toBe(true);

    notes?.setValue('short note');
    expect(notes?.valid).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(component.isSubmitting).toBe(false);
    // markAllAsTouched marks the form and all controls as touched
    expect(component.expenseForm.get('title')?.touched).toBe(true);
  });

  it('should detect invalid field state', () => {
    const title = component.expenseForm.get('title');
    title?.markAsTouched();
    expect(component.isFieldInvalid('title')).toBe(true);
  });

  it('should return correct error message', () => {
    const title = component.expenseForm.get('title');
    title?.markAsTouched();
    expect(component.getError('title')).toBe('This field is required');
  });

  it('should have predefined categories', () => {
    expect(component.categories.length).toBeGreaterThan(0);
    expect(component.categories).toContain('Food');
    expect(component.categories).toContain('Transport');
  });
});
