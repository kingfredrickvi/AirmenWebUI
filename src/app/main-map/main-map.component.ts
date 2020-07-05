import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ShipsService } from '../ships.service';
import { PlayersService } from '../players.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.css']
})
export class MainMapComponent implements OnInit {

  @ViewChild('canvas', {static: false}) private canvas: ElementRef;

  constructor(private playerService: PlayersService, private shipsService: ShipsService, private mapService: MapService) {
    this.canvasBackground.onload = function() {
      this._ready = true;
    }
    this.canvasBackground.src = "/assets/Sobel_Map.png";
  }

  private canvasBackground: any = new Image();
  private ships = [];
  private players = [];
  private hoverShip = false;
  private cursor: any = {};
  private cursorPoint: any = {};

  ngOnInit() {
    this.shipsService.getShipsAsync().subscribe((ships: any) => {
      this.ships = ships;

      this.updateCanvas();
    });

    this.playerService.getPlayersAsync().subscribe((players: any) => {
      this.players = players;
    });
  }

  mouseEnter(ship) {
    this.hoverShip = ship;
    this.updateCanvas();
  }
  
  mouseLeave() {
    this.hoverShip = false;
  }
  
  private bLeft = -1000;
  private bRight = 12200;
  private bBottom = -1000;
  private bTop = 12250;

  convertPosToXYZ(pos) {
    const canvas = this.canvas.nativeElement;

    pos = pos.substr(1, pos.length-2);
    pos = pos.split(", ").map((e) => +e);

    pos[0] = ((pos[0] + -this.bLeft) / (this.bRight+-this.bLeft)) * canvas.width;
    pos[2] = ((pos[2] + -this.bBottom) / (this.bTop+-this.bBottom)) * canvas.height;

    return pos;
  }
  
  convertRot(pos) {
    const canvas = this.canvas.nativeElement;

    pos = pos.substr(1, pos.length-2);
    pos = pos.split(", ").map((e) => +e);

    return pos
  }

  getAlias(steamId) {
    const player = this.players.find(p => p.steamId == +steamId);

    if (player) {
      return player.name;
    } else {
      return "???";
    }
  }

  mouseMove(e) {
    var cursor = {
        x: e.offsetX || (e.originalEvent && e.originalEvent.layerX),
        y: e.offsetY || (e.originalEvent && e.originalEvent.layerY)
    };
    this.cursor = cursor;
    this.updateCanvas();
  }

  mouseClick(e) {
    var cursor = {
      x: e.offsetX || (e.originalEvent && e.originalEvent.layerX),
      y: e.offsetY || (e.originalEvent && e.originalEvent.layerY)
    };
    this.cursorPoint = cursor;

    const canvas = this.canvas.nativeElement;
    this.mapService.selectPoint(this.convertXYToPosXY(cursor, canvas.width, canvas.height))

    console.log(cursor);
    this.updateCanvas();
  }

  updateCanvas() {
    if (!this.canvas) {
      return;
    }

    const canvas = this.canvas.nativeElement;
    const ctx = this.canvas.nativeElement.getContext("2d");

    if (!canvas._mouseMove) {
      canvas.addEventListener("mousemove", (e) => {
        this.mouseMove(e);
      }, false);
      canvas.addEventListener("click", (e) => {
        this.mouseClick(e);
      }, false);
      canvas._mouseMove = true;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (this.canvasBackground._ready) {
      ctx.globalAlpha = 0.4;
      ctx.drawImage(this.canvasBackground, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }

    for (var ship of this.ships) {
      const xyz = this.convertPosToXYZ(ship.position);
      const dir = this.convertRot(ship.rotation)[1];

      var color = "#c0392b";
      var radisBonus = 0;

      if (this.hoverShip == ship.uid) {
        color = "#27ae60";
        radisBonus = 7;
      } else if (ship.isAi == "True") {
        color = "#8e44ad";
      }

      if (ship.isAirship == "True") {
        this.drawPolygon(ctx, xyz[0], canvas.height-xyz[2], 3, 4+radisBonus, 2, color, color, dir-90);
        this.drawPolygon(ctx, xyz[0], canvas.height-xyz[2], 2, 7+radisBonus, 2, color, color, dir-90);
      } else {
        this.drawPolygon(ctx, xyz[0], canvas.height-xyz[2], 5, 4+radisBonus, 2, color, color, dir-90);
        this.drawPolygon(ctx, xyz[0], canvas.height-xyz[2], 2, 7+radisBonus, 2, color, color, dir-90);
      }

      // ctx.beginPath();
      // ctx.arc(xyz[0], canvas.height-xyz[2], 5, 0, Math.PI*2, true);
      // ctx.closePath();
      // ctx.fill();
    }

    if (this.cursor.x !== undefined) {
      ctx.fillStyle = "#222222";
      ctx.font = "16px 'Roboto Mono'";
      ctx.textAlign = "end";
      
      ctx.fillText(
        this.convertXYToPos(this.cursor, canvas.width, canvas.height),
        canvas.width-10, canvas.height-10);
    }

    if (this.cursorPoint.x !== undefined) {
      ctx.fillStyle = "#222222";
      ctx.font = "16px 'Roboto Mono'";
      ctx.textAlign = "start";
      
      ctx.fillText(
        this.convertXYToPos(this.cursorPoint, canvas.width, canvas.height),
        10, canvas.height-10);

      ctx.beginPath();
      ctx.arc(this.cursorPoint.x, this.cursorPoint.y, 3, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
    }
  }

  convertXYToPos(point, width, height) {
    var x = ((point.x/width) * (this.bRight+-this.bLeft)) - -this.bLeft;
    var y = (((height-point.y)/height) * (this.bTop+-this.bBottom)) - -this.bBottom;
    return `${Math.floor(x)}, ${Math.floor(y)}`;
  }

  convertXYToPosXY(point, width, height) {
    var x = ((point.x/width) * (this.bRight+-this.bLeft)) - -this.bLeft;
    var y = (((height-point.y)/height) * (this.bTop+-this.bBottom)) - -this.bBottom;
    return [x, y];
  }

  drawPolygon(ctx, centerX, centerY, sideCount, size, strokeWidth, strokeColor, fillColor, rotationDegrees) {
    var radians = rotationDegrees * Math.PI/180;
    ctx.translate(centerX, centerY);
    ctx.rotate(radians);
    ctx.beginPath();

    ctx.moveTo (size * Math.cos(0), size * Math.sin(0)); 

    for (var i = 1; i <= sideCount;i += 1) {
      ctx.lineTo(size * Math.cos(i * 2 * Math.PI / sideCount),
                  size * Math.sin(i * 2 * Math.PI / sideCount));
    }

    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
    ctx.fill();
    ctx.rotate(-radians);
    ctx.translate(-centerX,-centerY);
  }

  ngAfterViewChecked() {
  }

}
