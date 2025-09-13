import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  imports: [],
  templateUrl: './delete-button.html',
  styleUrl: './delete-button.css'
})
export class DeleteButton {

  clickEvent = output<Event>();
  selected = input<boolean>(false);

  onClick(event: Event){
    this.clickEvent.emit(event);
  }

}
