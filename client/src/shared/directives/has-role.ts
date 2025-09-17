import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../core/services/account-service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRole implements OnInit {
  
  @Input() appHasRole: string[] = [];
  private accountSvc = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  
  ngOnInit(): void {
    if(this.accountSvc.currentUser()?.roles.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
