import { Injectable } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'airmen';
  
  private bottomHeaders = [
    "General", "Configs", "Events"
  ]
  private bottomHeaderId = 0;

  constructor() { }

  ngOnInit() {
  }

  setBottomHeader(id) {
    this.bottomHeaderId = id;
  }
}
