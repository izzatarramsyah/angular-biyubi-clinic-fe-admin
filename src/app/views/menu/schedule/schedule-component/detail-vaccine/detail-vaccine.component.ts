import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-detail-vaccine',
  templateUrl: './detail-vaccine.component.html'
})

export class DetailVaccineComponent implements OnInit {
    
    @Input() scheduleVaccine : any;

    constructor(public modal: NgbActiveModal) {
    }
    
    ngOnInit() {  }

    closeModal(){
      this.modal.close();
    }

}
