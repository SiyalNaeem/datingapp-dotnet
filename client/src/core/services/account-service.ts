import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  protected http = inject(HttpClient);
  protected likesSvc = inject(LikesService);

  currentUser = signal<User | null>(null);

  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds, {withCredentials: true})
      .pipe(tap(user => {
        this.setCurrentUser(user);
        this.startRefreshTokenInterval();
      }));
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds, {withCredentials: true})
      .pipe(tap(user => {
        this.setCurrentUser(user)
        this.startRefreshTokenInterval();
      }));
  }

  refreshToken() {
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true})
  }

  startRefreshTokenInterval() {
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true})
      .subscribe({
        next: user => this.setCurrentUser(user),
        error: error => this.logout()
      })
    }, 5 * 60 * 1000) // every 5 minutes;
  }

  setCurrentUser(user: User) {
    if(user) {
      user.roles = this.getRolesForToken(user);
      this.currentUser.set(user);
      this.likesSvc.getLikedIds()
    }
  }

  logout() {
    localStorage.removeItem("filters");
    this.currentUser.set(null);
    this.likesSvc.clearLikedIds();
    this.likesSvc.clearLikedIds();
  }

  getRolesForToken(user: User): string[] {

    const payload = user.token.split('.')[1];
    const decodedPayload = atob(payload);
    const tokenData = JSON.parse(decodedPayload);
    const roles = tokenData['role'];
    return Array.isArray(roles) ? roles : [roles];

  }
  
}
