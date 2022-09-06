import { OnInit, Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal, ModalDismissReasons, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { UserAdminService } from '../../../../../integration/service/userAdminService';
import { UserService } from '../../../../../integration/service/userService';
import { RecordService } from '../../../../../integration/service/recordService';
import { UserAdmin } from "../../../../../entity/userAdmin";
import { ListChild, ListUser } from "../../../../../entity/listUser";
import { AlertComponent } from "../../../components/alert/alert.component";
import { LoadingComponent } from "../../../components/loading/loading.component";
import { VaccineSchedule } from "../../../../../entity/vaccineSchedule";

@Component({
  selector: 'app-vaccine-record',
  templateUrl: './vaccine-record.component.html',
  styleUrls: ['./vaccine-record.component.css']
})

export class VaccineRecordComponent implements OnInit {

  userAdmin : UserAdmin;
  vaccineSchedule : VaccineSchedule [];
  resultOflistUser : ListUser [];
  tempUser : ListUser;
  tempListChild : ListChild [] ;
  listBatch = [];
  listVaccine = [];

  isReadOnly = false;
  isDisabled = false;
  
  selectedIdChild : number;
  selectedBatch : number;
  vaccineCode : string;
  vaccineName : string;
  vaccineDate : string;
  expiredDate : string;
  notes : string;
  expiredDays : number;

  vaccineDateEmpty : boolean;
  parentNameValid : boolean;
  vaccineNameEmpty : boolean;
  selectedBatchEmpty : boolean;
  selectedIdChildEmpty : boolean;

  keyword = 'fullname';

  isDate = true;

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService: NgbModal,
              private userService: UserService,
              private userAdminService: UserAdminService,
              private recordService: RecordService,
              public datepipe: DatePipe) {
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() { 
    this.selectedIdChild = 0;
    this.selectedBatch = 0;
    this.vaccineName = '0';
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
  
  reset(){
    this.listBatch = [];
    this.listVaccine = [];
    this.selectedIdChild = 0;
    this.vaccineName = '0';
    this.selectedBatch = 0;
    this.isDate = true;
    this.expiredDate = null;
    this.vaccineDate = null;
    this.isReadOnly = false;
    this.isDisabled = false;
  }

  changeVaccineDate(e) {
    this.vaccineDate = null;
    if (this.vaccineName == '' || this.vaccineName == null) {
      const modalRef = this.modalService.open(AlertComponent);
      modalRef.componentInstance.header = "Informasi";
      modalRef.componentInstance.wording = "Mohon Pilih Nama Imunisasi Terlebih Dahulu";
    } else if (this.selectedBatch == null || this.selectedBatch == 0) {
      const modalRef = this.modalService.open(AlertComponent);
      modalRef.componentInstance.header = "Informasi";
      modalRef.componentInstance.wording = "Mohon Pilih Bulan Imunisasi";
    } else {
      this.expiredDate = '';
      this.vaccineDate = e.target.value;
      let vDate = this.datepipe.transform(this.vaccineDate, "MM/dd/yyyy");
      let date = new Date(vDate);
      date.setDate(date.getDate() + this.expiredDays);
      this.expiredDate = this.datepipe.transform(date, "MM / dd / yyyy");
    }
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
    this.reset();
  }

  onChangeSearch(name: string) {
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
    this.getSchedule();
  }

  getSchedule(){
    this.modalService.open(LoadingComponent,this.ngbModalOptions);
    this.vaccineSchedule = [];
    let payload = {
      header : {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command : 'info-schedule-vaccine'
      },
      payload : {
        parentId : this.tempUser.id,
        childId : this.selectedIdChild,
      }
    };
    this.recordService.getSchedule(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.vaccineSchedule = data.payload.object;
          for (var i in this.vaccineSchedule) {
            const name = this.vaccineSchedule[i].vaccineName;
            const existing = this.listVaccine.find(({vaccineName}) => name === vaccineName);
            if (!existing) {
              this.listVaccine.push({
                vaccineCode : this.vaccineSchedule[i].vaccineCode,
                vaccineName : this.vaccineSchedule[i].vaccineName
              });
            }
          }
        } 
        this.modalService.dismissAll(LoadingComponent);
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }
  
  changeVaccineName(e) {
    this.vaccineCode = e.target.value;
    this.listBatch = [];
    this.selectedBatch = 0;
    this.isReadOnly = false;
    this.isDisabled = false;
    this.isDate = true;
    this.expiredDate = null;
    this.vaccineDate = null;
    for (const i in this.vaccineSchedule) {
      if (this.vaccineCode  == this.vaccineSchedule[i].vaccineCode) {
        this.listBatch.push({
          batch : this.vaccineSchedule[i].batch,
          isDisabled : false
        });
      }
    }
  }

  changeSelectedBatch(e){
    this.selectedBatch = e.target.value;
    this.isReadOnly = false;
    this.isDisabled = false;
    this.isDate = true;
    this.expiredDate = null;
    this.vaccineDate = null;
    for (const i in this.vaccineSchedule) {
      if ( this.selectedBatch == this.vaccineSchedule[i].batch 
        && this.vaccineCode == this.vaccineSchedule[i].vaccineCode ) {
        if (this.vaccineSchedule[i].vaccineDate == null) {
            this.isReadOnly = false;
            this.vaccineDate = null;
            this.expiredDays = this.vaccineSchedule[i].expDays;
        } else {
            this.isReadOnly = true;
            this.isDisabled = true;
            this.isDate = false;
            this.vaccineDate = this.vaccineSchedule[i].vaccineDate;
            this.expiredDate = this.vaccineSchedule[i].expDate;
        }
        break;
      }
    }
  }

  saveVaccineRecord(){

    this.vaccineDateEmpty = false;
    this.vaccineNameEmpty = false;
    this.selectedBatchEmpty = false;
    this.selectedIdChildEmpty = false;
    this.parentNameValid = true;

    if (this.vaccineDate == null) {
      this.vaccineDateEmpty = true;
    }

    if (this.tempUser == null) {
      this.parentNameValid = false;
    }

    if (this.vaccineName == '0'){
      this.vaccineNameEmpty = true;
    }

    if (this.selectedBatch == 0){
      this.selectedBatchEmpty = true;
    }

    if (this.selectedIdChild == 0) {
      this.selectedIdChildEmpty = true;
    }

    if (this.vaccineDateEmpty == false && this.parentNameValid == true 
      && this.vaccineNameEmpty == false && this.selectedBatchEmpty == false
      && this.selectedIdChildEmpty == false) {
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
      this.modalService.open(LoadingComponent,this.ngbModalOptions);
      let payload = {
        header : {
          uName: this.userAdmin.username,
          session: this.userAdmin.sessionId,
        },
        payload : {
          userId : this.tempUser.id,
          childId : this.selectedIdChild,
          vaccineCode: this.vaccineCode,
          batch : this.selectedBatch,
          vaccineDate : this.vaccineDate,
          notes :this.notes
        }
      };
      console.log(JSON.stringify(payload));
      this.recordService.addVaccineRecord(JSON.stringify(payload))
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
