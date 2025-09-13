import { JsonPipe } from '@angular/common';
import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css'
})
export class TextInput implements ControlValueAccessor {

  label = input<string>('');
  type = input<string>('text');
  maxDate = input<string>('');

  constructor(@Self() private ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(value: any): void {
    // Write the value to the input
  }

  registerOnChange(fn: any): void {
    // Register the change handler
  }

  registerOnTouched(fn: any): void {
    // Register the touched handler
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

}
