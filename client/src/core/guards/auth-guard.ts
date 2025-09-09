import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';

export const authGuard: CanActivateFn = (route, state) => {

  const accountSvc = inject(AccountService);
  const toastSvc = inject(ToastService);

  if (!accountSvc.currentUser()) {
    toastSvc.showError("You must be logged in to access this page.");
    return false;
  }

  return true;
};
