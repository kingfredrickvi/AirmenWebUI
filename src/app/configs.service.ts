import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  private _configs = new BehaviorSubject<any>({});
  private configs = this._configs.asObservable();
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
    this.getConfigs().subscribe((data: any) => {
      this._configs.next(data);
    });
  }

  getConfigsAsync() {
    return this.configs;
  }

  getConfigs() {
    return this.http.get(`http://${this.targetIp}/api/settings`);
  }
  
  unbanSteam(name) {
    return this.http.get(`http://${this.targetIp}/api/remove_steam_ban/${name}`);
  }

  unmodSteam(name) {
    return this.http.get(`http://${this.targetIp}/api/remove_steam_moderator/${name}`);
  }
  
  unadminSteam(name) {
    return this.http.get(`http://${this.targetIp}/api/remove_steam_admin/${name}`);
  }
  
  unbanIp(name) {
    return this.http.get(`http://${this.targetIp}/api/remove_ip_ban/${name}`);
  }
  
  unmodIp(name) {
    return this.http.get(`http://${this.targetIp}/api/remove_ip_moderator/${name}`);
  }
  
  unadminIp(name) {
    return this.http.get(`http://${this.targetIp}/api/remove_ip_admin/${name}`);
  }
  
  banSteam(name) {
    return this.http.get(`http://${this.targetIp}/api/add_steam_ban/${name}`);
  }

  modSteam(name) {
    return this.http.get(`http://${this.targetIp}/api/add_steam_moderator/${name}`);
  }
  
  adminSteam(name) {
    return this.http.get(`http://${this.targetIp}/api/add_steam_admin/${name}`);
  }
  
  banIp(name) {
    return this.http.get(`http://${this.targetIp}/api/add_ip_ban/${name}`);
  }
  
  modIp(name) {
    return this.http.get(`http://${this.targetIp}/api/add_ip_moderator/${name}`);
  }
  
  adminIp(name) {
    return this.http.get(`http://${this.targetIp}/api/add_ip_admin/${name}`);
  }

  banPart(name) {
    return this.http.get(`http://${this.targetIp}/api/add_banned_part/${name}`);
  }

  unbanPart(name) {
    return this.http.get(`http://${this.targetIp}/api/remove_banned_part/${name}`);
  }
}
