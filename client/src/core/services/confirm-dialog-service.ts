import { Injectable } from '@angular/core';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private dialogComponent?: ConfirmDialog;

  registerDialog(dialog: ConfirmDialog) {
    this.dialogComponent = dialog;
  }

  confirm(message = 'Are you sure?'): Promise<boolean> {
    if (!this.dialogComponent) {
      return Promise.reject('No dialog component registered.');
    }
    return this.dialogComponent.open(message);
  }
  
}
