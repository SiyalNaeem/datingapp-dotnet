import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../types/member';
import { Location } from '@angular/common';
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private router = inject(Router);
  protected title = signal<string|undefined>("Profile");

  protected member = signal<Member|null>(null);

  ngOnInit(): void {

    this.route.data.subscribe({
      next: data => {
        this.member.set(data['member']);
      }
    })


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
