import { OnInit, Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbNavChangeEvent, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { UserAdminService } from '../../../../../integration/service/userAdminService';
import { UserService } from '../../../../../integration/service/userService';
import { UserAdmin } from "../../../../../entity/userAdmin";
import { AlertComponent } from "../../../components/alert/alert.component";
import { LoadingComponent } from "../../../components/loading/loading.component";

@Component({
  selector: 'app-parent-registration',
  templateUrl: './parent-registration.component.html',
  styleUrls: ['./parent-registration.component.css']
})

export class ParentRegistrationComponent implements OnInit {

  userAdmin : UserAdmin;
  parentId : number;
  parentName : string;
  phoneNo : string;
  address : string;
  email : string;
  domain : string;
  parentNameEmpty : boolean;
  phoneNoEmpty : boolean
  addressEmpty : boolean
  emailEmpty : boolean
  parentNameValid : boolean;
  domainEmpty : boolean;

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService: NgbModal,
              private userService: UserService,
              private userAdminService: UserAdminService,
              public datepipe: DatePipe) {
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() { }

  numberOnly(event): boolean {
    if(event.keyCode == 46){
      return true;
    }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  
  registration () {
    this.parentNameEmpty = false;
    this.phoneNoEmpty = false;
    this.addressEmpty = false;
    this.emailEmpty = false;
    this.domainEmpty = false;

    if (this.parentName == null) {
      this.parentNameEmpty = true;
    }
    if (this.phoneNo == null) {
      this.phoneNoEmpty = true;
    }
    if (this.address == null) {
      this.addressEmpty = true;
    }
    if (this.email == null) {
      this.emailEmpty = true;
    }
    if (this.domain == null) {
      this.domainEmpty = true;
    }
    
    if ( this.parentNameEmpty == false && this.phoneNoEmpty == false 
      && this.addressEmpty == false && this.emailEmpty == false && this.domainEmpty == false) { 
        const modalRef = this.modalService.open(AlertComponent);
        modalRef.componentInstance.header = 'Konfrimasi';
        modalRef.componentInstance.wording = 'Apakah anda yakin untuk menyimpan data ini ? ';
        modalRef.componentInstance.emitData.subscribe(($e) => {
          this.recive($e);
        })
    }
  }

  recive(event) {
    if (event) {
      this.modalService.open(LoadingComponent, this.ngbModalOptions);
      const mail = this.email + "@" + this.domain;
      let payload = {
        header : {
          uName: this.userAdmin.username,
          session: this.userAdmin.sessionId,
          command: 'save'
        },
        payload : {
            fullname: this.parentName,
            phone_no: this.phoneNo,
            address: this.address,
            email: mail
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
            modalRef.componentInstance.wording = data.header.responseMessage;
          },
          (error) => {
              console.log("error : ", error);
          }  
      );
    }
  }
  
}
