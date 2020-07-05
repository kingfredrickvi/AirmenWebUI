import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { ChatService } from '../chat.service';
import { SettingsService } from '../settings.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private settings: any = {}
  private messages = {};
  @Input() players;
  private chatInput = "";
  @ViewChild('chatbox', {static: false}) private myScrollContainer: ElementRef;

  constructor(private chatService: ChatService, private settingsService: SettingsService) {
    this.settingsService.getSettings().subscribe(settings => {
      this.settings = settings;
    });

    this.chatService.getMessagesAsync().subscribe((messages: any) => {
      if (this.settings.currentServer === undefined) {
        return;
      }

      var i = this.settings.currentServer;

      if (this.messages[i] === undefined) {
        this.messages[i] = [];
      }

      var currentUid = -1;
      
      if (this.messages[i].length > 0) {
        currentUid = this.messages[i][this.messages[i].length-1].uid;
      }

      for (var message of messages) {
        if (message.uid <= currentUid) {
          continue;
        }

        if (!message.leave && !message.join && message.alias == undefined) {
          message.alias = this.getAlias(message.steamId, i);
        }

        message.timestamp = this.parseTime(String(message.timestamp));

        this.messages[i].push(message);
      }
    });
  }

  parseTime(t) {
    return `${t.substr(0, 4)}-${t.substr(4, 2)}-${t.substr(6, 2)} ` + 
              `${t.substr(8, 2)}:${t.substr(10, 2)}:${t.substr(12, 2)}`;
  }
  
  ngAfterViewChecked() {        
    this.scrollToBottom();
  } 

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) {
        console.log(err);
      }
  }

  sendChat() {
    this.chatInput = this.chatInput.trim();

    if (this.chatInput != "") {
      this.chatService.sendChat(this.chatInput).subscribe(data => {
        console.log(data);
      });
      this.chatInput = "";
    }
  }

  getAlias(steamId, i) {
    const player = this.players.find(p => p.steamId == steamId);

    if (player) {
      return player.name;
    } else {
      for (var message of this.messages[i]) {
        if (message.steamId == steamId) {
          return message.alias;
        }
      }

      return steamId;
    }
  }

  ngOnInit() {
  }

}
