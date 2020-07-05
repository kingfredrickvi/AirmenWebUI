import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { PlayersService } from '../players.service';
import { ConfigsService } from '../configs.service';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.css']
})
export class ConfigsComponent implements OnInit {

  private _players = [];
  private _configs = {};
  private _configsInputs = {};
  private steamLists = [
    {"title": "Steam Bans", "value": "steamBans"},
    {"title": "Steam Moderators", "value": "steamModerators"},
    {"title": "Steam Admins", "value": "steamAdmins"}
  ];
  private ipLists = [
    {"title": "IP Bans", "value": "ipBans"},
    {"title": "IP Moderators", "value": "moderators"},
    {"title": "IP Admins", "value": "admins"}
  ];
  private miscLists = [
    {"title": "Banned Parts", "value": "bannedParts"}
  ];
  private lists = [
    this.steamLists, this.ipLists, this.miscLists
  ]

  constructor(private playerService: PlayersService, private configsService: ConfigsService) {}

  ngOnInit() {
    this.playerService.getPlayersAsync().subscribe((players: any) => {
      this._players = players;
    });

    this.configsService.getConfigsAsync().subscribe((configs: any) => {
      this._configs = configs;
    });
  }

  remove(list, name) {
    if (!this._configs) {
      return;
    }

    console.log(list, name);

    this._configs[list] = this._configs[list].filter(v => v != name);

    if (list == "steamBans") {
      this.configsService.unbanSteam(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "steamModerators") {
      this.configsService.unmodSteam(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "steamAdmins") {
      this.configsService.unadminSteam(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "ipBans") {
      this.configsService.unbanIp(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "moderators") {
      this.configsService.unmodIp(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "admins") {
      this.configsService.unadminIp(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "bannedParts") {
      this.configsService.unbanPart(name).subscribe(data => {
        console.log(data);
      });
    }
  }

  add(list) {
    if (!this._configs) {
      return;
    }

    const name = this._configsInputs[list].trim();
    this._configsInputs[list] = "";

    console.log(list, name);

    this._configs[list].push(name);

    if (list == "steamBans") {
      this.configsService.banSteam(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "steamModerators") {
      this.configsService.modSteam(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "steamAdmins") {
      this.configsService.adminSteam(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "ipBans") {
      this.configsService.banIp(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "moderators") {
      this.configsService.modIp(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "admins") {
      this.configsService.adminIp(name).subscribe(data => {
        console.log(data);
      });
    } else if (list == "bannedParts") {
      this.configsService.banPart(name).subscribe(data => {
        console.log(data);
      });
    }
  }

}
