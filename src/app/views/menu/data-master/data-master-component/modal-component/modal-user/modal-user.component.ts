import { OnInit, Component, Input, ViewChild, ElementRef } from "@angular/core";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { UserAdminService } from '../../../../../../integration/service/userAdminService';
import { UserService } from '../../../../../../integration/service/userService';
import { User } from "../../../../../../entity/user";
import { AlertComponent } from "../../../../components/alert/alert.component";
import { UserAdmin } from "../../../../../../entity/userAdmin";
import { LoadingComponent } from "../../../../components/loading/loading.component";

@Component({
  selector: "app-modal-user",
  templateUrl: "./modal-user.component.html",
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
  
    @Input() user : User ;
    
    id : number;
    name : string;
    address : string;
    phoneNo : string;
    email : string;

    addressEmpty : boolean;
    phoneNoEmpty : boolean;
    emailEmpty : boolean;
  
    userAdmin : UserAdmin;

    message = [];

    ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };
  
    constructor(private modal: NgbActiveModal,
               private modalService: NgbModal,
               private userService: UserService,
               private userAdminService : UserAdminService ) {
        this.userAdmin = this.userAdminService.userAdminValue;
    }

  
    ngOnInit() {
      this.setUser();
    }

    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
    
    setUser(){
      this.id = this.user.id;
      this.name = this.user.fullname;
      this.address = this.user.address;
      this.phoneNo = this.user.phone_no;
      this.email = this.user.email;
    }

    process () {
      this.addressEmpty = false;
      this.emailEmpty = false;
      this.phoneNoEmpty = false;

      if (this.address == null || this.address == '') {
        this.addressEmpty = true;
      }

      if (this.email == null || this.email == '') {
        this.emailEmpty = true;
      }

      if (this.phoneNo == null || this.phoneNo == '') {
        this.phoneNoEmpty = true;
      }

      if ( this.addressEmpty == false && this.emailEmpty == false 
          && this.phoneNoEmpty == false ) {
          
          this.modal.close();
          this.modalService.open(LoadingComponent, this.ngbModalOptions);
          let payload = {
            header : {
              uName : this.userAdmin.username,
              session : this.userAdmin.sessionId,
              command : 'user-update',
              channel : 'WEB'
            },
            payload : {
                id : this.id,
                fullname : this.name,
                address : this.address,
                email : this.email,
                phone_no : this.phoneNo
            }
          };
          this.userService.userProcess(JSON.stringify(payload))
          .pipe(first()).subscribe(
            (data) => {
              let header = 'Gagal';
              if (data.header.responseCode == '00') {
                header = 'Sukses'
              }
              this.modalService.dismissAll(LoadingComponent);
              const modalRef = this.modalService.open(AlertComponent, this.ngbModalOptions);
              modalRef.componentInstance.header = header;
              this.message = [];
              this.message.push(data.header.responseMessage);
              modalRef.componentInstance.wording = this.message;
            },
            (error) => {
              console.log("error : ", error);
            }  
          );
      }
      
    }



}
