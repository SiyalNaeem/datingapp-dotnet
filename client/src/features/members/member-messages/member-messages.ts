import { HttpClient } from '@angular/common/http';
import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../../core/services/message-service';
import { Message } from '../../../types/message';
import { MemberService } from '../../../core/services/member-service';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit, OnDestroy {

  @ViewChild('messageEndRef') messageEndRef!: ElementRef<HTMLDivElement>;

  protected messageSvc = inject(MessageService);
  private memberSvc = inject(MemberService);
  protected presenceSvc = inject(PresenceService);
  private route = inject(ActivatedRoute);

  // protected messages = signal<Message[]>([]);

  protected newMessageContent = '';

  constructor() {
    effect(() => {
      // const currentMessages = this.messages();
      const currentMessages = this.messageSvc.messageThread();
      if (currentMessages.length)
        this.scrollToBottom();
    });
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(paramMap => {
      // setTimeout(() => {
      // }, 50);
        const otherUserId = paramMap.get('id');
        if (!otherUserId) throw new Error('No user id found in route, cannot load messages from hub');
        this.messageSvc.createHubConnection(otherUserId);
    });
  }

  // loadMessages() {
  //   const memberId = this.memberSvc.member()?.id;
  //   if (!memberId) return;
  //   this.messageSvc.getMessageThread(memberId).subscribe({
  //     next: messages => this.messages.set(messages.map(m => ({ ...m, currentMemberSender: m.senderId !== memberId }))),
  //     error: err => console.log(err)
  //   });
  // }

  sendMessage() {
    const memberId = this.memberSvc.member()?.id;
    if (!memberId || !this.newMessageContent) return;
    this.messageSvc.sendMessage(memberId, this.newMessageContent)?.then(() => this.newMessageContent = '').catch(err => console.log(err));
    // .subscribe({
    //   next: message => {
    //     this.messages.update(messages => [...messages, { ...message, currentMemberSender: true }]);
    //     this.newMessageContent = '';
    //   },
    //   error: err => console.log(err)
    // });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messageEndRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    });
  }

  ngOnDestroy(): void {
    this.messageSvc.stopHubConnection();
  }

}
