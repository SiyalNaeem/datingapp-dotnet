import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMemberFields, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule, TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent) {
    if(this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

  protected memberSvc = inject(MemberService);
  protected editableFields: EditableMemberFields = {
    displayName: '',
    city: '',
    country: '',
    description: '',
  };
  private toastSvc = inject(ToastService);

  @ViewChild('editForm')
  editForm?: NgForm;

  private accountSvc = inject(AccountService);

  ngOnInit(): void {

    this.editableFields = {
      displayName: this.memberSvc.member()?.displayName || '',
      city: this.memberSvc.member()?.city || '',
      country: this.memberSvc.member()?.country || '',
      description: this.memberSvc.member()?.description || '',
    }

  }

  updateProfile() {
    if(!this.memberSvc.member()) return;
    const updatedMember = {
      ...this.memberSvc.member(),
      ...this.editableFields
    } as Member;

    this.memberSvc.updateMember(this.editableFields).subscribe({
      next: () => {
        this.toastSvc.showSuccess('Profile updated successfully');
        this.memberSvc.editMode.set(false);
        this.memberSvc.member.set(updatedMember);
        this.editForm?.reset(updatedMember);
        let currentUser = this.accountSvc.currentUser();
        if(currentUser) {
          currentUser = {
            ...currentUser,
            displayName: updatedMember.displayName
          };
          this.accountSvc.setCurrentUser(currentUser);
        }

      }
    })

  }

  ngOnDestroy(): void {
    if(this.memberSvc.editMode()) {
      this.memberSvc.editMode.set(false);
    }
  }

}
