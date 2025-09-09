import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { User } from '../../types/user';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

  protected accountSvc = inject(AccountService);
  protected creds: any = {};

  login() {
    this.accountSvc.login(this.creds).subscribe(
      (response: User) => {
        this.accountSvc.currentUser.set(response);
        this.creds = {};
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  logout() {
    this.accountSvc.logout();
  }

}
