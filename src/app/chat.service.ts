import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _messages = new BehaviorSubject<any>([]);
  private messages = this._messages.asObservable();
  private settings: any = {};
  private targetIp = "";

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.settingsService.getSettings().subscribe(settings => {
      this.settings = settings;
      if (settings.servers[settings.currentServer]) {
        this.targetIp = settings.servers[settings.currentServer].ip;
        
        this.refreshData();
      } else {
        this.targetIp = "";
      }
    });

    interval(3000).subscribe(() => {
      if (!this.targetIp) return;
      this.refreshData();
    });
  }

  refreshData() {
    this.getMessages().subscribe((data: any) => {
      this._messages.next(data);
    });
  }

  getMessagesAsync() {
    return this.messages;
  }

  getMessages() {
    return this.http.get(`http://${this.targetIp}/api/chat_messages`);
  }

  sendChat(message) {
    const options: any = {headers: {'Content-Type': 'application/json'}};

    return this.http.post(`http://${this.targetIp}/api/send_chat_message`, JSON.stringify({
      message
    }, options));
  }
}
