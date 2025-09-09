import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { Nav } from "../layout/nav/nav";
import { AccountService } from '../core/services/account-service';
import { User } from '../types/user';
import { Home } from "../features/home/home";

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private accountSvc = inject(AccountService);
  private http: HttpClient = inject(HttpClient);
  
  protected title = signal('Dating App');
  protected members = signal<User[]>([]);
  protected unsubscriber = new Subject<void>();

  async ngOnInit() {
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.accountSvc.currentUser.set(user);
    }
  }

  async getMembers() {
    try {
      return await lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));
    }catch(error) {
      console.log(error);
      throw error;
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
