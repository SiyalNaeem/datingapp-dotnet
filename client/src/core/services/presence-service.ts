import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast-service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../../types/user';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private hubUrl = environment.hubUrl;
  private toastSvc = inject(ToastService);
  hubConnection?: HubConnection;
  onlineUsers = signal<string[]>([]);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(err => this.toastSvc.showError(err));
    
    this.hubConnection.on('UserOnline', (userId) => {
      console.log("UserOnline ", userId);
      
      this.onlineUsers.update(users => [...users, userId]);
      console.log("UserOnline ", this.onlineUsers());
      
    })

    this.hubConnection.on('UserOffline', (userId) => {
      console.log("UserOffline ", userId);
      this.onlineUsers.update(users => users.filter(u => u !== userId));
      console.log("UserOffline ", this.onlineUsers());
    })

    this.hubConnection.on('GetOnlineUsers', (userIds) => {
      console.log("GetOnlineUsers ", userIds);
      this.onlineUsers.set(userIds);
      console.log("GetOnlineUsers ", this.onlineUsers());
    })

    this.hubConnection.on('NewMessageReceived', (message: Message) => {
      this.toastSvc.showInfo(message.senderDisplayName + ' has sent you a new message!', 10000, message.senderImageUrl, '/members/' + message.senderId + '/messages');
    });
  }

  stopHubConnection() {
    if(this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(err => this.toastSvc.showError(err));
    }
  }

  
}
