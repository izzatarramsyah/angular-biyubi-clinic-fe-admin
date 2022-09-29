import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class QRCodeService {
    
    public qr$: BehaviorSubject<String> = new BehaviorSubject('');
    public message$: BehaviorSubject<String> = new BehaviorSubject('');
    socket = io(environment.socketUrl);

    constructor() { }

    public getMessage = () => {
      this.socket.on('message', (message) =>{
        this.message$.next(message);
      });
      return this.message$.asObservable();
    };

    public getQR = () => {
      this.socket.on('qr', (qr) =>{
        this.qr$.next(qr);
      });
      return this.qr$.asObservable();
    };

}
