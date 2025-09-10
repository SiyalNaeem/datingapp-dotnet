import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../core/services/member-service';
import { Member } from '../../types/member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {

  const memberSvc = inject(MemberService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  
  if(!id) {
    router.navigateByUrl("/not-found");
    return EMPTY;
  };
  
  return memberSvc.getMember(id);
};
