import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  private http: HttpClient = inject(HttpClient);
  
  protected title = signal('Dating App');
  protected members: any = signal([]);
  protected unsubscriber = new Subject<void>();

  ngOnInit() {
    this.http.get('https://localhost:5001/api/members').pipe(takeUntil(this.unsubscriber)).subscribe({
      next: response => this.members.set(response as []),
      error: error => console.log(error),
      complete: () => console.log('Request complete')
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
