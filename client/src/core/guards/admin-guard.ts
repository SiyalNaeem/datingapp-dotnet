import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateFn = (route, state) => {

  const accountSvc = inject(AccountService);
  const toastSvc = inject(ToastService);

  if(accountSvc.currentUser()?.roles?.includes("Admin") || accountSvc.currentUser()?.roles?.includes("Moderator")) {
    return true;
  }

  toastSvc.showError("You do not have permission to access this area");
  return false;
};
