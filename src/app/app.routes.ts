import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/expense-list/expense-list').then(m => m.ExpenseListComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./components/expense-form/expense-form').then(m => m.ExpenseForm)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/expense-form/expense-form').then(m => m.ExpenseForm)
  },
  { path: '**', redirectTo: '' }
];
