import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'; 
import { first } from 'rxjs/operators';
import { DatePipe, JsonPipe } from '@angular/common';
import { UserAdmin } from "../../../entity/userAdmin";
import { VaccineSchedule } from "../../../entity/vaccineSchedule";
import { CheckUpSchedule } from "../../../entity/checkUpSchedule";
import { ListChild, ListUser } from "../../../entity/listUser";
import { UserAdminService } from '../../../integration/service/userAdminService';
import { UserService } from '../../../integration/service/userService';
import { RecordService } from '../../../integration/service/recordService';
import { LoadingComponent } from "../../components/loading/loading.component";
import { ExportService } from '../../../integration/service/exportService';
import { FileSaverService } from 'ngx-filesaver'; 
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx';
import { EditCheckUpComponent } from "./schedule-component/edit-checkup/edit-checkup-component";
import { EditVaccineComponent } from "./schedule-component/edit-vaccine/edit-vaccine.component";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent implements OnInit {

  userAdmin : UserAdmin;
  vaccineSchedule : VaccineSchedule [];
  checkUpSchedule : CheckUpSchedule [];
  resultOflistUser : ListUser [];
  tempUser : ListUser;
  tempListChild : ListChild [] ;

  listData = [] ;

  selectedChildId = 0;
  selectedHistoryType = '0';

  showTable = false;
  dtOptions: any = {};

  keyword = 'fullname';
  
  isDisabled = true;

  typeSchedule: any = [{name: 'Jadwal Imunisasi', value: 'info-vaccine'},
  {name: 'Jadwal Medis', value: 'info-checkup'}];

  displayedColumns : string[];
  rowTable : string[];

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService : NgbModal,
              private userService : UserService,
              private userAdminService : UserAdminService,
              private recordService: RecordService,
              private exportService : ExportService) {
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit(): void {
    this.getListUser();
  }
  
  getListUser() {
    this.resultOflistUser = [];
    let payload = {
      header : {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command :'info-id-user',
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

  onSelectEvent(object : any) {
    this.tempUser = object;
    this.tempListChild = this.tempUser.listChild;
    this.selectedChildId = 0;
    this.selectedHistoryType = '0';
    this.showTable = false;
    this.isDisabled = true;
  }

  onInputChanged(name: string) {
    this.tempUser = null;
    this.tempListChild = [];
    this.selectedChildId = 0;
    this.selectedHistoryType = '0';
    this.showTable = false;
    this.isDisabled = true;
    for (const i in this.resultOflistUser) {
      if (name == this.resultOflistUser[i].fullname) {
        this.tempUser = this.resultOflistUser[i];
        this.tempListChild = this.tempUser.listChild;
      }
    }
  }
  
  onChangeChildName(e) {
    this.selectedChildId = e.target.value;
    this.selectedHistoryType = '0';
    this.showTable = false;
    if (e.target.value != 0) {
      this.isDisabled = false;
    }
  }

  onChangeRecordType(e) {
    this.selectedHistoryType = e.target.value;
    this.listData = [];
    this.showTable = false;
    switch (this.selectedHistoryType){
      case ('info-vaccine'):
        this.displayedColumns = ['Jadwal Imunisasi', 'Nama Imunisasi', 'Bulan Ke', 'Detail'];
        this.rowTable = ['scheduleDate', 'vaccineName', 'batch', 'execDate'];
        this.getListVaccineRecord();
        break;
      case ('info-checkup'):
        this.displayedColumns = ['Jadwal Pemeriksaan', 'Bulan Ke', 'Deskripsi', 'Detail'];
        this.rowTable = ['scheduleDate', 'batch', 'description', 'execDate'];
        this.getListCheckUpRecord();
        break;
    }
  }

  getListVaccineRecord () {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    this.vaccineSchedule = [];
    let payload = {
      header : {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command : 'info-schedule-vaccine',
        channel : 'WEB'
      },
      payload: {
        userId : this.tempUser.id,
        childId : this.selectedChildId
      }
    };
    this.recordService.getSchedule(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.vaccineSchedule = data.payload.object;
          for (const i in this.vaccineSchedule) {
            this.listData.push({
              execDate : this.vaccineSchedule[i].vaccineDate,
              scheduleDate: this.vaccineSchedule[i].scheduleDate,
              vaccineName : this.vaccineSchedule[i].vaccineName,
              batch : this.vaccineSchedule[i].batch,
              data : this.vaccineSchedule[i],
              flag : 'vaccine'
            });
          }
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 4,
            lengthMenu : [4,8,16,32,64,128],
            processing: true
          };
          this.showTable = true;
        } 
        this.modalService.dismissAll(LoadingComponent);
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }

  getListCheckUpRecord () {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    this.checkUpSchedule = [];
    let payload = {
      header : {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command : 'info-schedule-checkup',
        channel : 'WEB'
      },
      payload: {
        userId : this.tempUser.id,
        childId : this.selectedChildId
      }
    };
    this.recordService.getSchedule(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.checkUpSchedule = data.payload.object;
          for (const i in this.checkUpSchedule) {
            this.listData.push({
              scheduleDate : this.checkUpSchedule[i].scheduleDate,
              execDate: this.checkUpSchedule[i].checkUpDate,
              description : this.checkUpSchedule[i].description,
              batch : this.checkUpSchedule[i].batch,
              data : this.checkUpSchedule[i],
              flag : 'checkUp'
            });
          }
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 4,
            lengthMenu : [4,8,16,32,64,128],
            processing: true
          };
          this.showTable = true;
        }
        this.modalService.dismissAll(LoadingComponent);
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }

  downloadPdf(object){
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    let filename; let payload;
    let child = this.tempListChild.filter(({id}) => id == this.selectedChildId)
    if (this.selectedHistoryType == 'info-checkup') {
      filename = 'Laporan Rekam Medis '+ child[0].fullname +'.pdf';
      payload = {
        header : {
          uName : this.userAdmin.username,
          session : this.userAdmin.sessionId,
          command : 'schedule-checkup',
        },
        payload: {
          userId : this.tempUser.id,
          childId : this.selectedChildId,
          mstCode : object.code
        }
      };
    } else if (this.selectedHistoryType == 'info-vaccine') {
      filename = 'Laporan Rekam Imunisasi '+ child[0].fullname +'.pdf';
      payload = {
        header : {
          uName: this.userAdmin.username,
          session: this.userAdmin.sessionId,
          command: 'schedule-vaccine'
        },
        payload: {
          userId : this.tempUser.id,
          childId : this.selectedChildId,
          mstCode : object.vaccineCode,
          batch : object.batch
        }
      };
    }
    this.exportService.report(JSON.stringify(payload))
    .then(blob=> {
       saveAs(blob, filename);
       this.modalService.dismissAll(LoadingComponent);
    });
  }
 
  ExportToExcel() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    let command; let filename;
    if (this.selectedHistoryType == 'info-checkup') {
      command = 'schedule-checkup';
      filename = 'Jadwal Rekam Medis.xls';
    } else if (this.selectedHistoryType == 'info-vaccine') {
      command = 'schedule-vaccine'
      filename = 'Jadwal Rekam Imunisasi.xls';
    }
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command: command
      },
      payload: {
        userId : this.tempUser.id,
        childId : this.selectedChildId
      }
    };
    this.exportService.schedule(JSON.stringify(payload))
    .then(blob=> {
       saveAs(blob, filename);
       this.modalService.dismissAll(LoadingComponent);
    });
  }

  editData (object : any, flag : string) {
    console.log(flag);
    switch (flag){
      case ('vaccine'):
        this.editVaccine(object);
        break;
      case ('checkUp'):
        this.editCheckUp(object);
        break;
    }
  }

  editCheckUp(object){
    const modalRef = this.modalService.open(EditCheckUpComponent);
    modalRef.componentInstance.header = "Edit Jejak Medis Bulan Ke - " + object.batch;
    modalRef.componentInstance.userId = this.tempUser.id;
    modalRef.componentInstance.childId = this.selectedChildId;
    modalRef.componentInstance.notes = object.notes;
    modalRef.componentInstance.mstCode = object.code;
    modalRef.componentInstance.weight = object.weight;
    modalRef.componentInstance.length = object.length;
    modalRef.componentInstance.headDiameter = object.headDiameter;
  }

  editVaccine(object){
    const modalRef = this.modalService.open(EditVaccineComponent);
    modalRef.componentInstance.header = "Edit Catatan Imunisasi Bulan Ke - " + object.batch;
    modalRef.componentInstance.userId = this.tempUser.id;
    modalRef.componentInstance.childId = this.selectedChildId;
    modalRef.componentInstance.notes = object.notes;
    modalRef.componentInstance.mstCode = object.vaccineCode;
    modalRef.componentInstance.batch = object.batch;
  }

}
