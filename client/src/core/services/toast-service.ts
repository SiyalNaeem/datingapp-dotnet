import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private router = inject(Router);

  constructor(){
    this.createToastContainer();
  }

  private createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end z-50';
      // container.style.position = 'fixed';
      // container.style.top = '20px';
      // container.style.right = '20px';
      // container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
  }


  private createToastElement(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number,
    avatar?: string, route?: string
  ) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `alert alert-${type} shadow-lg mb-2 flex items-center gap-3 cursor-pointer`;
    toast.style.minWidth = '200px';

    if(route){
      toast.addEventListener('click', () => {
        this.router.navigateByUrl(route || '/');
        toastContainer.removeChild(toast);
      });
    }
    
    toast.innerHTML = `
      ${avatar ? `
        <img src="${avatar || './user.png'}" class='w-10 h-10 rounded' 
        ` : ''}
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

  showSuccess(message: string, duration: number = 3000, avatar?: string, route?: string) {
    this.createToastElement(message, 'success', duration, avatar, route);
  }

  showError(message: string, duration: number = 3000, avatar?: string, route?: string) {
    this.createToastElement(message, 'error', duration, avatar, route);
  }

  showInfo(message: string, duration: number = 3000, avatar?: string, route?: string) {
    this.createToastElement(message, 'info', duration, avatar, route);
  }

  showWarning(message: string, duration: number = 3000, avatar?: string, route?: string) {
    this.createToastElement(message, 'warning', duration, avatar, route);
  }
  
}
