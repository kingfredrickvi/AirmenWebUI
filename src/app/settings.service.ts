import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _settingsData = {
    currentServer: 0,
    servers: [],
  };

  private _settings = new BehaviorSubject<any>(this._settingsData);
  private settings = this._settings.asObservable();

  constructor(private http: HttpClient) {
    this.http.get(`assets/settings.json`).subscribe(data => {
      this._settingsData = Object.assign(this._settingsData, data);
      this._settings.next(this._settingsData);
    });
  }

  getSettings() {
    return this.settings;
  }

  setServer(id) {
    this._settingsData.currentServer = id;
    this._settings.next(this._settingsData);
  }
}
