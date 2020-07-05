import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { PlayersService } from '../players.service';
import { ShipsService } from '../ships.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private shipsService: ShipsService, private playersService: PlayersService) { }

  ngOnInit() {
  }

  healAll() {
    this.playersService.healAll().subscribe(data => {
      console.log(data);
    });
  }

  repairAllShips() {
    this.shipsService.repairAllShips().subscribe(data => {
      console.log(data);
    });
  }

  refillAllScrap() {
    this.shipsService.refillAllScrap().subscribe(data => {
      console.log(data);
    });
  }

  refillAllTools() {
    this.shipsService.refillAllTools().subscribe(data => {
      console.log(data);
    });
  }

}
