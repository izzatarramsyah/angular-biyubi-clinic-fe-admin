import { OnInit, Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {
    
    @Input() username : string ;
    @Input() lastActivity : string ;
    @Input() joinDate : string ;

    constructor(public modal: NgbActiveModal) {
    }
    
    ngOnInit() {  
    }

    closeModal(){
      this.modal.close();
    }


}
