import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private _players = new BehaviorSubject<any>([]);
  private players = this._players.asObservable();
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
    this.getPlayers().subscribe((data: any) => {
      this._players.next(data.players);
    });
  }

  getPlayersAsync() {
    return this.players;
  }

  getPlayers() {
    return this.http.get(`http://${this.targetIp}/api/players`);
  }

  kick(steamId) {
    return this.http.get(`http://${this.targetIp}/api/kick/${steamId}`)
  }

  kill(steamId) {
    return this.http.get(`http://${this.targetIp}/api/kill/${steamId}`)
  }

  heal(steamId) {
    return this.http.get(`http://${this.targetIp}/api/heal/${steamId}`)
  }
  
  healAll() {
    return this.http.get(`http://${this.targetIp}/api/heal_all`)
  }
  
  teleportAll(steamId) {
    return this.http.get(`http://${this.targetIp}/api/teleport_all_players/${steamId}`)
  }
  
  teleport(steamId, x, y, z) {
    const options: any = {headers: {'Content-Type': 'application/json'}};

    return this.http.post(`http://${this.targetIp}/api/pteleport/${steamId}`, JSON.stringify({
      x, y, z
    }, options));
  }
}
