import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AdminService } from '../../../core/services/admin-service';
import { User } from '../../../types/user';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {

  private adminSvc = inject(AdminService);
  protected users = signal<User[]>([]);

  @ViewChild('rolesModal') rolesModal!: ElementRef<HTMLDialogElement>;
  protected avaiableRoles = ['Admin', 'Moderator', 'Member'];
  protected selectedUser: User | null = null;
  protected selectedRoles: string[] = [];

  ngOnInit(): void {
    this.loadUsersWithRoles();
  }

  private loadUsersWithRoles() {
    this.adminSvc.getUserWithRoles().subscribe({
      next: (users) => this.users.set(users),
      error: (err) => console.log(err)
    });
  }

  openRolesModal(user: User) {
    this.selectedUser = user;
    this.selectedRoles = [...user.roles];
    this.rolesModal.nativeElement.showModal();
  }

  toggleRole(event: Event, role: string) {
    if(!this.selectedUser) return;

    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedRoles.push(role);
    } else {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    }
  }

  updateUserRoles() {
    if (!this.selectedUser) return;
    this.adminSvc.updateUserRoles(this.selectedUser.id, this.selectedRoles).subscribe({
      next: (roles) => {
        this.users.update(users => users.map(user => {
          if(user.id === this.selectedUser?.id) user.roles = roles;
          return user;
        }));

        this.rolesModal.nativeElement.close();
        this.selectedUser = null;
        this.selectedRoles = [];
      },
      error: (err) => console.log(err)
    });
  }
}
