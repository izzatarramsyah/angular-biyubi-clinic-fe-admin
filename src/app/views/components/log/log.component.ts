import { OnInit, Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditTrail } from "../../../entity/auditTrail";
import { UserAdmin } from "../../../entity/userAdmin";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html'
})

export class LogComponent implements OnInit {
    
    @Input() auditTrail : AuditTrail [] ;
    userAdmin : UserAdmin;  
    showTable = false;
    dtOptions : any;

    constructor(public modal: NgbActiveModal,
                public datepipe: DatePipe) {
    }
    
    ngOnInit() {  
      if (this.auditTrail.length > 0) {
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 4,
            lengthMenu : [4,8,16,32,64,128],
            processing: true
          };
         this.showTable = true;
      }
    }

    closeModal(){
      this.modal.close();
    }

}
