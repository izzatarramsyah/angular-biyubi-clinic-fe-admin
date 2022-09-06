import { OnInit, Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal, ModalDismissReasons, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { UserAdminService } from '../../../../../integration/service/userAdminService';
import { UserService } from '../../../../../integration/service/userService';
import { UserAdmin } from "../../../../../entity/userAdmin";
import { ListChild, ListUser } from "../../../../../entity/listUser";
import { AlertComponent } from "../../../components/alert/alert.component";
import { LoadingComponent } from "../../../components/loading/loading.component";

@Component({
  selector: 'app-child-registration',
  templateUrl: './child-registration.component.html',
  styleUrls: ['./child-registration.component.css']
})

export class ChildRegistrationComponent implements OnInit {

  userAdmin : UserAdmin;
  resultOflistUser : ListUser [];
  tempUser : ListUser;
  tempListChild : ListChild [] ;

  childName : string;
  birthDate : string;
  gender : string;
  weight : number;
  lenght : number
  headDiameter : number;
  notes : string;
  
  childNameEmpty : boolean;
  birthDateEmpty : boolean;
  genderEmpty : boolean;
  weightEmpty : boolean;
  lenghtEmpty : boolean
  headDiameterEmpty : boolean;
  parentNameValid : boolean;

  keyword = 'fullname';

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

  ngOnInit() {
    this.getListUser();
  }

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

  getListUser() {
    this.resultOflistUser = [];
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command:'info-all-simple-user'
      }
    };
    this.userService.getUser(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.resultOflistUser = data.payload.object;
        }
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }

  selectEvent(object) {
    this.tempUser = object;
    this.tempListChild = this.tempUser.listChild;
  }

  onChangeSearch(name: string) {
    this.tempUser = null;
    this.tempListChild = [];
    for (const i in this.resultOflistUser) {
      if (name == this.resultOflistUser[i].fullname) {
        this.tempUser = this.resultOflistUser[i];
        this.tempListChild = this.tempUser.listChild;
      }
    }
  }

  registration () {
    this.childNameEmpty = false;
    this.birthDateEmpty = false;
    this.genderEmpty = false;
    this.weightEmpty = false;
    this.lenghtEmpty = false;
    this.headDiameterEmpty = false;
    this.parentNameValid = true;

    if (this.childName == null) {
      this.childNameEmpty = true;
    }
    if (this.birthDate == null) {
      this.birthDateEmpty = true;
    }
    if (this.gender == null) {
      this.genderEmpty = true;
    }
    if (this.weight == null) {
      this.weightEmpty = true;
    }
    if (this.lenght == null) {
      this.lenghtEmpty = true;
    }
    if (this.headDiameter == null) {
      this.headDiameterEmpty = true;
    }
    if (this.tempUser == null) {
      this.parentNameValid = false;
    }
    if (this.childNameEmpty == false && this.birthDateEmpty == false && this.weightEmpty == false 
      && this.lenghtEmpty == false && this.lenghtEmpty == false && this.headDiameterEmpty == false && this.parentNameValid == true) {
        const modalRef = this.modalService.open(AlertComponent);
        modalRef.componentInstance.header = 'Konfrimasi';
        modalRef.componentInstance.wording = 'Apakah anda yakin untuk menyimpan data ini ? ';
        modalRef.componentInstance.emitData.subscribe(($e) => {
          this.recive($e);
        })
    } 
  }

  recive(event){
    if (event) {
      this.modalService.open(LoadingComponent,this.ngbModalOptions);
      let payload = {
        header : {
            uName: this.userAdmin.username,
            session: this.userAdmin.sessionId,
            command: 'save'
        },
        payload : {
            userId: this.tempUser.id,
            fullname: this.childName,
            gender: this.gender,
            notes: this.notes,
            weight : this.weight,
            length : this.lenght,
            headDiameter : this.headDiameter,
            birthDate : this.birthDate
        }
      };
      this.userService.childProcess(JSON.stringify(payload))
      .pipe(first()).subscribe(
          (data) => {
            let header = 'Gagal';
            if (data.header.responseCode == '00') {
              header = 'Sukses'
            }
            this.modalService.dismissAll(LoadingComponent);
            const modalRef = this.modalService.open(AlertComponent,this.ngbModalOptions);
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
