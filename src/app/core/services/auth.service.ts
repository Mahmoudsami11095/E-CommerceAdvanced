import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private readonly USER_STORAGE_KEY = 'currentUser';
  private readonly TOKEN_STORAGE_KEY = 'authToken';

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    // Load user from storage on init
    this.loadUserFromStorage();
  }

  login(email: string, password: string): boolean {
    // TODO: Replace with actual API call
    // For now, simulate successful login
    // In production, this should call your backend API
    
    // Mock user data - replace with actual API response
    const mockUser: User = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      role: UserRole.STUDENT,
      createdAt: new Date()
    };

    // Simulate API delay and validation
    // In real implementation:
    // return this.apiService.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
    //   .pipe(
    //     map((response: any) => {
    //       this.setUser(response.user);
    //       this.storageService.setItem(this.TOKEN_STORAGE_KEY, response.token);
    //       return true;
    //     }),
    //     catchError(() => {
    //       return of(false);
    //     })
    //   );

    // For demo purposes - accept any email/password
    if (email && password.length >= 6) {
      this.setUser(mockUser);
      this.storageService.setItem(this.TOKEN_STORAGE_KEY, 'mock-token-' + Date.now());
      return true;
    }

    return false;
  }

  register(name: string, email: string, password: string): boolean {
    // TODO: Replace with actual API call
    // Mock registration
    const mockUser: User = {
      id: Date.now().toString(),
      email: email,
      name: name,
      role: UserRole.STUDENT,
      createdAt: new Date()
    };

    if (name && email && password.length >= 6) {
      this.setUser(mockUser);
      this.storageService.setItem(this.TOKEN_STORAGE_KEY, 'mock-token-' + Date.now());
      return true;
    }

    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.storageService.removeItem(this.USER_STORAGE_KEY);
    this.storageService.removeItem(this.TOKEN_STORAGE_KEY);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return this.storageService.getItem<string>(this.TOKEN_STORAGE_KEY);
  }

  private setUser(user: User): void {
    this.currentUser.set(user);
    this.storageService.setItem(this.USER_STORAGE_KEY, user);
  }

  private loadUserFromStorage(): void {
    const storedUser = this.storageService.getItem<User>(this.USER_STORAGE_KEY);
    if (storedUser) {
      this.currentUser.set(storedUser);
    }
  }
}

