import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../types/member';
import { Location } from '@angular/common';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';
import { PresenceService } from '../../../core/services/presence-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private accountSvc = inject(AccountService);
  protected memberSvc = inject(MemberService);
  protected presenceSvc = inject(PresenceService);
  private router = inject(Router);
  protected title = signal<string|undefined>("Profile");
  protected isCurrentUser = computed(() => {
    return this.accountSvc.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  })

  ngOnInit(): void {

    this.title.set(this.route.snapshot.firstChild?.title);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.title.set(this.route.snapshot.firstChild?.title);
      });
    
  }


  goBack() {
    this.location.back();
  }
  

}
