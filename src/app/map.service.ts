import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _selectedPoint = new BehaviorSubject<any>(undefined);
  private selectedPoint = this._selectedPoint.asObservable();

  constructor() { }

  getSelectedPoint() {
    return this.selectedPoint;
  }

  selectPoint(point) {
    this._selectedPoint.next(point);
  }
}
