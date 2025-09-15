import { HttpClient } from '@angular/common/http';
import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../../core/services/message-service';
import { Message } from '../../../types/message';
import { MemberService } from '../../../core/services/member-service';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit {

  @ViewChild('messageEndRef') messageEndRef!: ElementRef<HTMLDivElement>;

  private messageSvc = inject(MessageService);
  private memberSvc = inject(MemberService);

  protected messages = signal<Message[]>([]);

  protected newMessageContent = '';

  constructor() {
    effect(() => {
      const currentMessages = this.messages();
      if (currentMessages.length)
        this.scrollToBottom();
    });
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    const memberId = this.memberSvc.member()?.id;
    if (!memberId) return;
    this.messageSvc.getMessageThread(memberId).subscribe({
      next: messages => this.messages.set(messages.map(m => ({ ...m, currentMemberSender: m.senderId !== memberId }))),
      error: err => console.log(err)
    });
  }

  sendMessage() {
    const memberId = this.memberSvc.member()?.id;
    if (!memberId || !this.newMessageContent) return;
    this.messageSvc.sendMessage(memberId, this.newMessageContent).subscribe({
      next: message => {
        this.messages.update(messages => [...messages, { ...message, currentMemberSender: true }]);
        this.newMessageContent = '';
      },
      error: err => console.log(err)
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messageEndRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    });
  }

}
