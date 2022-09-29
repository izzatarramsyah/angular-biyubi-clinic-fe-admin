import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { QRCodeService } from '../../../integration/service/qrCodeService';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})

export class QRCodeComponent implements OnInit {
    
  message : string;
  imagePath : any;

  constructor(public modal: NgbActiveModal, 
              private qRCodeService: QRCodeService,
              private sanitizer:DomSanitizer) { 
  }
    
  ngOnInit() {  
    this.qRCodeService.getMessage().subscribe((msg: string) => {
      if (msg && msg.trim()) {
        this.message = msg
      } else {
        this.message = 'Please Wait ...';
      }
    })
    this.qRCodeService.getQR().subscribe((qr: string) => {
      this.imagePath = qr;
      this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(this.imagePath);
    })
  }

  closeModal(){
    this.modal.close();
  }

}
