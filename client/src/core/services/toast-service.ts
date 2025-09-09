import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(){
    this.createToastContainer();
  }

  private createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end';
      // container.style.position = 'fixed';
      // container.style.top = '20px';
      // container.style.right = '20px';
      // container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
  }


  private createToastElement(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `alert alert-${type} shadow-lg mb-2`;
    toast.style.minWidth = '200px';
    toast.innerHTML = `
      <span>${message}</span>
      <button class="btn btn-sm btn-ghost" style="margin-left: 10px;">&times;</button>
    `;

    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if(toastContainer.contains(toast)){
        toastContainer.removeChild(toast);
      }
    }, duration);
  }

  showSuccess(message: string, duration: number = 3000) {
    this.createToastElement(message, 'success', duration);
  }

  showError(message: string, duration: number = 3000) {
    this.createToastElement(message, 'error', duration);
  }

  showInfo(message: string, duration: number = 3000) {
    this.createToastElement(message, 'info', duration);
  }

  showWarning(message: string, duration: number = 3000) {
    this.createToastElement(message, 'warning', duration);
  }
  
}
