import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { User } from '../../types/user';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';
import { BusyService } from '../../core/services/busy-service';
import { HasRole } from '../../shared/directives/has-role';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, HasRole],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {

  protected accountSvc = inject(AccountService);
  protected toastSvc = inject(ToastService);
  protected router = inject(Router);
  protected creds: any = {};
  protected selectedTheme = signal(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected busySvc = inject(BusyService);
  protected loading = signal(false);

  ngOnInit() {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLElement;
    elem?.blur();
  }

  handleSelectUserItem() {
    const elem = document.activeElement as HTMLElement;
    elem?.blur();
  }

  login() {
    this.loading.set(true);
    this.accountSvc.login(this.creds).subscribe({
      next: (response: User) => {
        this.accountSvc.currentUser.set(response);
        this.router.navigateByUrl('/members');
        this.toastSvc.showSuccess("Login successful!");
        this.creds = {};
      },
      error: (error: any) => {
        this.toastSvc.showError(error.error || "Login failed. Please check your credentials.");
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  logout() {
    this.accountSvc.logout();
    this.router.navigateByUrl('/');
  }

}
