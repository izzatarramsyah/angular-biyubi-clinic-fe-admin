import { OnInit, Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal, ModalDismissReasons, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { UserAdminService } from '../../../../../integration/service/userAdminService';
import { UserService } from '../../../../../integration/service/userService';
import { RecordService } from '../../../../../integration/service/recordService';
import { MasterService } from '../../../../../integration/service/masterService';
import { UserAdmin } from "../../../../../entity/userAdmin";
import { CheckUpMaster } from "../../../../../entity/checkUpMaster";
import { ListChild, ListUser } from "../../../../../entity/listUser";
import { AlertComponent } from "../../../components/alert/alert.component";
import { LoadingComponent } from "../../../components/loading/loading.component";

@Component({
  selector: 'app-checkup-record',
  templateUrl: './checkup-record.component.html',
  styleUrls: ['./checkup-record.component.css']
})

export class CheckUpRecordComponent implements OnInit {

  userAdmin : UserAdmin;
  resultOflistUser : ListUser [];
  tempUser : ListUser;
  tempListChild : ListChild [] ;
  checkUpMaster : CheckUpMaster[];
  selectedIdChild = 0;
  selectedBatch = 0;

  //-- --//
  mstCode : string;
  description : string;
  weight : number;
  length : number;
  headDiameter : number;
  notes : string;  
  checkUpDate : string;

  //-- --//
  weightEmpty : boolean;
  lengthEmpty : boolean;
  headDiameterEmpty : boolean;
  parentNameValid : boolean;
  selectedBatchEmpty : boolean;
  selectedIdChildEmpty : boolean;
  checkUpDateEmpty : boolean;
  notesEmpty : boolean;

  isReadOnly = false;
  isDisabled = false;
  isDate = true;

  keyword = 'fullname';

  message = [];

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService: NgbModal,
              private userService: UserService,
              private userAdminService: UserAdminService,
              private recordService: RecordService,
              private masterService : MasterService,
              public datepipe: DatePipe) {
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() { 
    this.getListUser();
    this.getListCheckUp();
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

  reset(){
    this.selectedIdChild = 0;
    this.selectedBatch = 0;
    this.description = null;
    this.checkUpDate = null;
    this.weight = null;
    this.length = null;
    this.headDiameter = null;
    this.isDate = true;
    this.isReadOnly = false;
    this.isDisabled = false;
  }

  getListUser() {
    this.resultOflistUser = [];
    let payload = {
      header : {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command :'info-all-simple-user',
        channel : "WEB"
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

  getListCheckUp() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    this.checkUpMaster = [];
    let payload = {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command : 'info-list-checkup',
        channel : "WEB"
    };
    this.masterService.getListMst(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        this.modalService.dismissAll(LoadingComponent);
        if (data.header.responseCode == '00') {
          this.checkUpMaster = data.payload.object;
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
    this.reset();
  }

  onChangeSearch(name) {
    this.tempUser = null;
    this.tempListChild = [];
    this.reset();
    for (const i in this.resultOflistUser) {
      if (name == this.resultOflistUser[i].fullname) {
        this.tempUser = this.resultOflistUser[i];
        this.tempListChild = this.tempUser.listChild;
      }
    }
  }

  changeChildName(e){
    this.reset();
    this.selectedIdChild = e.target.value;
  }

  changeBatch(e){
    this.selectedBatch = e.target.value;
    this.description = null;
    this.isReadOnly = false;
    this.isDisabled = false;
    this.isDate = true;
    for (const i in this.checkUpMaster) {
      if ( this.selectedBatch == this.checkUpMaster[i].batch ) {
        this.mstCode = this.checkUpMaster[i].code;
        this.description = this.checkUpMaster[i].description;
        break;
      }
    }
  }

  saveCheckUpRecord(){
    this.parentNameValid = true;
    this.weightEmpty = false;
    this.lengthEmpty = false;
    this.headDiameterEmpty = false;
    this.selectedBatchEmpty = false;
    this.selectedIdChildEmpty = false;
    this.checkUpDateEmpty = false;
    this.notesEmpty = false;

    if (this.tempUser == null) {
      this.parentNameValid = false;
    }
    if (this.weight == null){
      this.weightEmpty = true;
    }
    if (this.length == null){
      this.lengthEmpty = true;
    }
    if (this.headDiameter == null){
      this.headDiameterEmpty = true;
    }
    if (this.selectedBatch == null) {
      this.selectedBatchEmpty = true;
    }
    if (this.selectedIdChild == 0) {
      this.selectedIdChildEmpty = true;
    }
    if (this.checkUpDate == null) {
      this.checkUpDateEmpty = true;
    }
    if (this.notes == null) {
      this.notesEmpty = true;
    }
    if (this.parentNameValid == true && this.lengthEmpty == false && this.weightEmpty == false
      && this.headDiameterEmpty == false && this.selectedBatchEmpty == false 
        && this.selectedIdChildEmpty == false && this.checkUpDateEmpty == false && this.notesEmpty == false) {
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
          channel : "WEB",
          command : "save-checkup-record"
        },
        payload : {
          userId : this.tempUser.id,
          childId : this.selectedIdChild,
          mstCode : this.mstCode,
          weight: this.weight,
          length: this.length,
          headDiameter: this.headDiameter,
          batch : this.selectedBatch,
          notes: this.notes,
          checkUpDate: this.checkUpDate
        }
      };
      this.recordService.checkUpRecord(JSON.stringify(payload))
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
