import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { User } from '../../types/user';
import { Observable, of } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private accountSvc = inject(AccountService);
  private likeSvc = inject(LikesService);

  init(): Observable<null> {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.accountSvc.currentUser.set(user);
      this.likeSvc.getLikedIds();
    }

    return of(null);
  }
  
}
