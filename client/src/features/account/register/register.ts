import { Component, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { TextInput } from "../../../shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  protected accountSvc = inject(AccountService);
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentFormStep = signal(0);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public cancelRegister = output<boolean>();
  protected validationErrors = signal<string[]>([]);

  constructor(){
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });

    this.credentialsForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
      }
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control?.parent;
      if(!parent) return null;

      const matchToControl = parent.get(matchTo)?.value;

      return control?.value === matchToControl
        ? null : { passwordMismatch: true }
    }
  }

  nextStep() {
    if(this.credentialsForm.valid) {
      this.currentFormStep.update(n => n+1);
    }
  }

  prevStep() {
    this.currentFormStep.update(n => n-1);
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {

    if(this.credentialsForm.valid && this.profileForm.valid) {
      const formData = {
        ...this.credentialsForm.value,
        ...this.profileForm.value
      }
      this.accountSvc.register(formData).subscribe({
        next: _ => {
          this.router.navigateByUrl('/members');
        },
        error: (error: any) => { 
          this.validationErrors.set(error);
         }
      })
    }

  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
