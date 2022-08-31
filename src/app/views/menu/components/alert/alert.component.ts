import { OnInit, Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})

export class AlertComponent implements OnInit {
    
    @Input() header : string;
    @Input() wording : string;
    @Output() emitData = new EventEmitter();

    constructor(public modal: NgbActiveModal,
                private modalService: NgbModal) {
                  
    }
    
    ngOnInit() {  }

    closeModal(){
      this.modal.close();
      window.location.reload();
    }

    closeModalWithoutRefresh(){
      this.modal.close();
    }

    no(){
      this.emitData.emit(false);
      this.modal.close();
    }

    yes(){
      this.emitData.emit(true);
      this.modal.close();
    }

}
