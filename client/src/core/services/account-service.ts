import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  protected http = inject(HttpClient);

  currentUser = signal<User | null>(null);

  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(tap(user => this.setCurrentUser(user)));
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(tap(user => this.setCurrentUser(user)));
  }

  setCurrentUser(user: User) {
    if(user) {
      localStorage.setItem("user", JSON.stringify(user));
      this.currentUser.set(user);
    }
  }

  logout() {
    localStorage.removeItem("user");
    this.currentUser.set(null);
  }
  
}
