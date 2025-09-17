import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { User } from '../../types/user';
import { Observable, of, tap } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private accountSvc = inject(AccountService);
  private likeSvc = inject(LikesService);

  init(): Observable<User> {
    return this.accountSvc.refreshToken().pipe(
      tap(user => {
        this.accountSvc.setCurrentUser(user);
        this.accountSvc.startRefreshTokenInterval();
      })
    )
    // const userJson = localStorage.getItem("user");
    // if (userJson) {
    //   const user: User = JSON.parse(userJson);
    // }

    // return of(null);
  }
  
}
