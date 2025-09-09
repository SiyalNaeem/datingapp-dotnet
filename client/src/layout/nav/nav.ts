import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { User } from '../../types/user';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

  protected accountSvc = inject(AccountService);
  protected toastSvc = inject(ToastService);
  protected router = inject(Router);
  protected creds: any = {};

  login() {
    this.accountSvc.login(this.creds).subscribe(
      (response: User) => {
        this.accountSvc.currentUser.set(response);
        this.router.navigateByUrl('/members');
        this.toastSvc.showSuccess("Login successful!");
        this.creds = {};
      },
      (error: any) => {
        this.toastSvc.showError(error.error || "Login failed. Please check your credentials.");
      }
    );
  }

  logout() {
    this.accountSvc.logout();
    this.router.navigateByUrl('/');
  }

}
