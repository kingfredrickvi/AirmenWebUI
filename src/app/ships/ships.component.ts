import { Component, OnInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { ShipsService } from '../ships.service';
import { PlayersService } from '../players.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-ships',
  templateUrl: './ships.component.html',
  styleUrls: ['./ships.component.css']
})
export class ShipsComponent implements OnInit {

  constructor(private playerService: PlayersService, private shipsService: ShipsService, private mapService: MapService) { }

  private ships = [];
  private _ships = [];
  private players = [];
  private shipIds = {};
  private showing = {};
  private showingInput: any = false;
  private inputData = "";
  private showingInputId = 0;
  private selectedPoint = undefined;

  ngOnInit() {
    this.shipsService.getShipsAsync().subscribe((ships: any) => {
      const newShipIds = {};

      for (const ship of ships) {
        const sid = ship.uid;

        newShipIds[sid] = true;

        if (!this.shipIds[sid]) {
          this._ships.push(ship);
        } else {
          const ind = this._ships.findIndex(s => s.uid == sid);
          this._ships[ind] = Object.assign(this._ships[ind], ship);
        }
      }

      this._ships = this._ships.filter(s => newShipIds[s.uid]);
      this.shipIds = newShipIds;
    });

    this.playerService.getPlayersAsync().subscribe((players: any) => {
      this.players = players;
    });

    this.mapService.getSelectedPoint().subscribe(point => {
      this.selectedPoint = point;
    });
  }

  getAlias(steamId) {
    const player = this.players.find(p => p.steamId == +steamId);

    if (player) {
      return player.name;
    } else {
      return "???";
    }
  }

  changeInput(name, shipId) {
    if (this.showingInput == name && shipId == this.showingInputId) {
      this.showingInput = false;
      this.showingInputId = 0;
    } else {
      this.showingInputId = shipId;
      this.showingInput = name;
    }

    this.inputData = "";
  }

  submitInput(shipId) {
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
      this.shipsService.teleport(shipId, ps[0], ps[1], ps[2]).subscribe(data => {
        console.log(data);
      });
    }
  }

  repair(shipId) {
    this.shipsService.repairShip(shipId).subscribe(data => {
      console.log(data);
    });
  }

  refillTools(shipId) {
    this.shipsService.refillTools(shipId).subscribe(data => {
      console.log(data);
    });
  }

  refillScrap(shipId) {
    this.shipsService.refillScrap(shipId).subscribe(data => {
      console.log(data);
    });
  }

  teleportAll(shipId) {
    this.shipsService.teleportAll(shipId).subscribe(data => {
      console.log(data);
    });
  }

  teleport(shipId) {
    if (this.selectedPoint) {
      this.shipsService.teleport(shipId, this.selectedPoint[0], 400, this.selectedPoint[1]).subscribe(data => {
        console.log(data);
      });
    }
  }

  toggle(shipId) {
    this.showing[shipId] = !this.showing[shipId];
  }

  destroy(shipId) {

  }
}
