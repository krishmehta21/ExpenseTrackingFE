import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a success toast', () => {
    let toasts: any[] = [];
    service.toasts$.subscribe(t => toasts = t);

    service.success('Expense created');

    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Expense created');
  });

  it('should add an error toast', () => {
    let toasts: any[] = [];
    service.toasts$.subscribe(t => toasts = t);

    service.error('Something went wrong');

    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('error');
    expect(toasts[0].message).toBe('Something went wrong');
  });

  it('should add multiple toasts', () => {
    let toasts: any[] = [];
    service.toasts$.subscribe(t => toasts = t);

    service.success('First');
    service.info('Second');
    service.warning('Third');

    expect(toasts.length).toBe(3);
  });

  it('should assign unique ids to each toast', () => {
    let toasts: any[] = [];
    service.toasts$.subscribe(t => toasts = t);

    service.success('First');
    service.info('Second');

    expect(toasts[0].id).not.toBe(toasts[1].id);
  });

  it('should set correct type for warning', () => {
    let toasts: any[] = [];
    service.toasts$.subscribe(t => toasts = t);

    service.warning('Watch out');

    expect(toasts[0].type).toBe('warning');
  });
});
