import { Component, OnInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { PlayersService } from '../players.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  constructor(private playerService: PlayersService) {
  }

  private _players = [];
  private showing = {};
  private steamIds = {};
  private showingInput: any = false;
  private inputData = "";
  private showingInputId = 0;

  ngOnInit() {
    this.playerService.getPlayersAsync().subscribe((players: any) => {
      const newSteamIds = {};

      for (const player of players) {
        const steamId = player.steamId;
        newSteamIds[steamId] = true;

        if (!this.steamIds[steamId]) {
          this._players.push(player);
        } else {
          const ind = this._players.findIndex(p => p.steamId == steamId);
          this._players[ind] = Object.assign(this._players[ind], player);
        }
      }

      this._players = this._players.filter(p => newSteamIds[p.steamId]);
      this.steamIds = newSteamIds;
    });
  }

  changeInput(name, steamId) {
    if (this.showingInput == name && this.showingInputId == steamId) {
      this.showingInput = false;
      this.showingInputId = 0;
    } else {
      this.showingInput = name;
      this.showingInputId = steamId;
    }
  }

  submitInput(steamId) {
    const data = this.inputData.trim();

    console.log(data);

    if (data == "") {
      return;
    }
    
    if (this.showingInput == "Teleport") {
      var ps = data.split(",").map(p => +p.trim());
      if (ps.length <= 2) {
        console.log(ps);
        return;
      }
      this.playerService.teleport(steamId, ps[0], ps[1], ps[2]).subscribe(data => {
        console.log(data);
      });
    }

    this.inputData = "";
    this.showingInput = false;
  }

  toggle(steamId) {
    this.showing[steamId] = !this.showing[steamId];
  }

  kick(steamId) {
    console.log("Kicking", steamId);

    this.playerService.kick(steamId).subscribe(data => {
      console.log(data);
    });

    this._players = this._players.filter((p) => p.steamId !== steamId);
  }

  kill(steamId) {
    console.log("Killing", steamId);

    this.playerService.kill(steamId).subscribe(data => {
      console.log(data);
    });
  }

  heal(steamId) {
    console.log("Healing", steamId);

    this.playerService.heal(steamId).subscribe(data => {
      console.log(data);
    });
  }

  teleportAll(steamId) {
    this.playerService.teleportAll(steamId).subscribe(data => {
      console.log(data);
    });
  }
}
