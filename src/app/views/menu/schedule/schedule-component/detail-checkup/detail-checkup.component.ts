import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-detail-checkup',
  templateUrl: './detail-checkup.component.html'
})

export class DetailCheckUpComponent implements OnInit {
    
    @Input() scheduleCheckUp : any;

    constructor(public modal: NgbActiveModal) {
    }
    
    ngOnInit() {  }

    closeModal(){
      this.modal.close();
    }

}
