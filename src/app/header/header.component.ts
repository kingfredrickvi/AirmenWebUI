import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private settings;

  constructor(private settingsService: SettingsService) {
    this.settingsService.getSettings().subscribe(settings => {
      this.settings = settings;
    });
  }

  ngOnInit() {
  }

  setServer(id) {
    if (id != this.settings.currentServer) {
      this.settingsService.setServer(id);
    }
  }

}
