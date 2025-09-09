import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../types/error';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css'
})
export class ServerError {

  protected error: ApiError;
  private router = inject(Router);
  protected showDetails = false;
  
  constructor() {

    const navigation = this.router.currentNavigation();
    if(navigation?.extras && navigation.extras.state && navigation.extras.state['error']) {
      this.error = navigation.extras.state['error'] as ApiError;
    } else {
      this.error = { message: 'Something went wrong', statusCode: 500 };
    }
    
  }

  detailsToggle() {
    this.showDetails = !this.showDetails;
  }

}
