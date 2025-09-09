import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected accountSvc = inject(AccountService);

  public cancelRegister = output<boolean>();

  protected creds = {} as RegisterCreds;

  register() {
    this.accountSvc.register(this.creds).subscribe({
      next: (user: User) => {
        console.log(user);
        this.cancel();
      },
      error: (error: any) => { console.log(error); }
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
