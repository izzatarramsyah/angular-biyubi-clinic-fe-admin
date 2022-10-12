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
  parentNameEmpty : boolean;
  phoneNoEmpty : boolean
  addressEmpty : boolean
  emailEmpty : boolean
  emailValid : boolean;
  parentNameValid : boolean;

  message = [] ;

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
  
  isEmail(email:string):boolean {
      var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      return regexp.test(email);
  }
  
  registration () {
    this.isEmail(this.email);

    this.parentNameEmpty = false;
    this.phoneNoEmpty = false;
    this.addressEmpty = false;
    this.emailEmpty = false;
    this.emailValid = false;

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
      this.emailValid = true;
    } else {
      if (this.isEmail(this.email) == true) {
        this.emailValid = true;
      }
    }
    
    if ( this.parentNameEmpty == false && this.phoneNoEmpty == false 
      && this.addressEmpty == false && this.emailEmpty == false && this.emailValid == true ) { 
        const modalRef = this.modalService.open(AlertComponent);
        modalRef.componentInstance.header = 'Konfrimasi';
        this.message = [];
        this.message.push('Apakah anda yakin untuk menyimpan data ini ? ');
        modalRef.componentInstance.wording = this.message;
        modalRef.componentInstance.emitData.subscribe(($e) => {
          this.recive($e);
        })
    }
  }

  recive(event) {
    if (event) {
      this.modalService.open(LoadingComponent, this.ngbModalOptions); 
      let payload = {
        header : {
          uName : this.userAdmin.username,
          session : this.userAdmin.sessionId,
          command : 'user-registration',
          channel : "WEB"
        },
        payload : {
            fullname: this.parentName,
            phone_no: this.phoneNo,
            address: this.address,
            email: this.email
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
