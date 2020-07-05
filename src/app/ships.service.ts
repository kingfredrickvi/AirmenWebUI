import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ShipsService {

  private _ships = new BehaviorSubject<any>([]);
  private ships = this._ships.asObservable();
  private settings = {};
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
    this.getShips().subscribe((data: any) => {
      this._ships.next(data.ships);
    });
  }

  getShipsAsync() {
    return this.ships;
  }

  getShips() {
    return this.http.get(`http://${this.targetIp}/api/ships`);
  }
  
  teleport(shipId, x, y, z) {
    const options: any = {headers: {'Content-Type': 'application/json'}};

    return this.http.post(`http://${this.targetIp}/api/steleport/${shipId}`, JSON.stringify({
      x, y, z
    }, options));
  }

  repairShip(shipId) {
    return this.http.get(`http://${this.targetIp}/api/repair_ship/${shipId}`);
  }

  refillTools(shipId) {
    return this.http.get(`http://${this.targetIp}/api/refill_tools/${shipId}`);
  }

  refillScrap(shipId) {
    return this.http.get(`http://${this.targetIp}/api/refill_scrap/${shipId}`);
  }

  teleportAll(shipId) {
    return this.http.get(`http://${this.targetIp}/api/teleport_all_ships/${shipId}`);
  }

  repairAllShips() {
    return this.http.get(`http://${this.targetIp}/api/repair_all`);
  }

  refillAllTools() {
    return this.http.get(`http://${this.targetIp}/api/refill_all_tools`);
  }

  refillAllScrap() {
    return this.http.get(`http://${this.targetIp}/api/refill_all_scrap`);
  }
}
