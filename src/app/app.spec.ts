import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { ToastService } from './services/toast';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        ToastService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme', () => {
    const initial = component.isDark;
    component.toggleTheme();
    expect(component.isDark).toBe(!initial);
  });

  it('should persist theme to localStorage', () => {
    component.toggleTheme();
    const stored = localStorage.getItem('theme');
    expect(stored).toBeTruthy();
  });

  it('should apply dark theme attribute', () => {
    component.isDark = false;
    component.toggleTheme();
    const attr = document.documentElement.getAttribute('data-theme');
    expect(attr).toBe('dark');
  });

  it('should track toasts by id', () => {
    const result = component.trackToast(0, { id: 42, type: 'success', message: 'test' });
    expect(result).toBe(42);
  });
});
