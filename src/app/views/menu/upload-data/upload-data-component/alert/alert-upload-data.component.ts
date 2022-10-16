import { OnInit, Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-alert-upload-data',
  templateUrl: './alert-upload-data.component.html'
})

export class AlertUploadDataComponent implements OnInit {
    
    @Input() wording : string [];
    @Input() object : any [];
    dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 4,
      lengthMenu : [4,8,16,32,64,128],
      processing: true
    };

    constructor(public modal: NgbActiveModal) { }
    
    ngOnInit() {}

    closeModal(){
      this.modal.close();
      window.location.reload();
    }

}
