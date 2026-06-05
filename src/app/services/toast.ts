import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  removing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private nextId = 0;

  toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: Toast['type'] = 'info', duration = 3500): void {
    const toast: Toast = { id: this.nextId++, type, message };
    this.toasts = [...this.toasts, toast];
    this.toastsSubject.next(this.toasts);

    setTimeout(() => this.startRemoval(toast.id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 5000);
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning', 4000);
  }

  private startRemoval(id: number): void {
    this.toasts = this.toasts.map(t =>
      t.id === id ? { ...t, removing: true } : t
    );
    this.toastsSubject.next(this.toasts);

    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.toastsSubject.next(this.toasts);
    }, 300);
  }
}
