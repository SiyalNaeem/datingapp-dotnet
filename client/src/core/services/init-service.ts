import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { User } from '../../types/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private accountSvc = inject(AccountService);

  init(): Observable<null> {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.accountSvc.currentUser.set(user);
    }

    return of(null);
  }
  
}
