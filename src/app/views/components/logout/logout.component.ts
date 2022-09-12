import { OnInit, Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { UserAdminService } from '../../../integration/service/userAdminService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})

export class LogoutComponent implements OnInit {
   
    constructor(public modal: NgbActiveModal,
                private router: Router,
                private userAdminService: UserAdminService) {
    }
    
    ngOnInit() {  }

    closeModal(){
        const user = this.userAdminService.userAdminValue;
        let payload = { 
          "payload": { 
            "username": user.username
          },
          "header": { 
            "uName":user.username, 
            "session" : user.sessionId 
          }
        };
        this.userAdminService.logout(JSON.stringify(payload)).
        pipe(first()).subscribe(data => {
          if (data.header.responseCode == '00' ){
            this.router.navigate(['/login']);
          }
        },error => {
          console.log('error : ', error);
        });
        this.modal.close();
    }

  

}
