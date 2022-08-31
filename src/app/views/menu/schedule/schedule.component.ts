import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
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
import { DetailCheckUpComponent } from "./schedule-component/detail-checkup/detail-checkup.component";
import { DetailVaccineComponent } from "./schedule-component/detail-vaccine/detail-vaccine.component";

import * as XLSX from 'xlsx';

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

  selectedChildId = 0;
  selectedHistoryType = '0';

  showTableVaccine = false;
  showTableCheckUp = false;
  dtOptions: any = {};

  keyword = 'fullname';
  
  isDisabled = true;

  typeSchedule: any = [{name: 'Jadwal Imunisasi', value: 'info-vaccine'},
  {name: 'Jadwal Medis', value: 'info-checkup'}];

  constructor(private modalService : NgbModal,
              private userService : UserService,
              private userAdminService : UserAdminService,
              private recordService: RecordService,
              private datePipe : DatePipe) {
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit(): void {
    this.getListUser();
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

  selectEvent(object : any) {
    this.tempUser = object;
    this.tempListChild = this.tempUser.listChild;
    this.selectedChildId = 0;
    this.selectedHistoryType = '0';
    this.showTableVaccine = false;
    this.showTableCheckUp = false;
    this.isDisabled = true;
  }

  onChangeSearch(name: string) {
    this.tempUser = null;
    this.tempListChild = [];
    this.selectedChildId = 0;
    this.selectedHistoryType = '0';
    this.showTableVaccine = false;
    this.showTableCheckUp = false;
    this.isDisabled = true;
    for (const i in this.resultOflistUser) {
      if (name == this.resultOflistUser[i].fullname) {
        this.tempUser = this.resultOflistUser[i];
        this.tempListChild = this.tempUser.listChild;
      }
    }
  }
  
  changeChildName(e){
    this.selectedChildId = e.target.value;
    this.selectedHistoryType = '0';
    this.showTableVaccine = false;
    this.showTableCheckUp = false;
    if (e.target.value != 0) {
      this.isDisabled = false;
    }
  }

  changeRecordType (e) {
    this.selectedHistoryType = e.target.value;
    if (this.selectedHistoryType == 'info-vaccine') {
        this.getListVaccineRecord();
    } else if (this.selectedHistoryType == 'info-checkup') {
        this.getListCheckUpRecord();
    }
  }

  getListVaccineRecord () {
    this.modalService.open(LoadingComponent);
    this.vaccineSchedule = [];
    this.showTableCheckUp = false;
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command: 'info-schedule-vaccine'
      },
      payload: {
        parentId : this.tempUser.id,
        childId : this.selectedChildId
      }
    };
    this.recordService.getSchedule(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.vaccineSchedule = data.payload.object;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            processing: true,
            dom: 'Bfrtip'
          };
          this.showTableVaccine = true;
        } 
        this.modalService.dismissAll(LoadingComponent);
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }

  checkDetailVaccine(object){
    const modalRef = this.modalService.open(DetailVaccineComponent);
    modalRef.componentInstance.scheduleVaccine = object;
  }

  getListCheckUpRecord () {
    this.modalService.open(LoadingComponent);
    this.checkUpSchedule = [];
    this.showTableVaccine = false;
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command: 'info-schedule-checkup'
      },
      payload: {
        parentId : this.tempUser.id,
        childId : this.selectedChildId
      }
    };
    this.recordService.getSchedule(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.checkUpSchedule = data.payload.object;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            processing: true,
            dom: 'Bfrtip'
          };
          this.showTableCheckUp = true;
        }
        this.modalService.dismissAll(LoadingComponent);
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }

  checkDetailCheckUp(object){
    const modalRef = this.modalService.open(DetailCheckUpComponent);
    modalRef.componentInstance.scheduleCheckUp = object;
  }
 
  ExportTOExcel() {
    let data; let fileName;
    if (this.selectedHistoryType == 'info-vaccine') {
      data = this.vaccineSchedule.map(c => ({ 
        'Nama Imunisasi': c.vaccineName, 
        'Tipe Imunisasi': c.vaccineType,
        'Bulan Ke -' : c.batch,
        'Tanggal Imunisasi': c.vaccineDate,
        'Tanggal Kadaluarsa': c.expDate,
        'Catatan' : c.notes
      }));
      fileName = 'Jadwal Imunisasi.xlsx';
    } else if (this.selectedHistoryType == 'info-checkup') {
      data = this.checkUpSchedule.map(c => ({ 
        'Kegiatan': c.actName, 
        'Deskripsi': c.description,
        'Bulan Ke -' : c.batch,
        'Jadwal Cek Medis': c.scheduleDate,
        'Tanggal Cek Medis': c.checkUpDate,
        'Berat' : c.weight + ' KG',
        'Tinggi ': c.length + ' CM',
        'Lingkar Kepala': c.headDiameter + ' CM',
        'Catatan' : c.notes
      }));
      fileName = 'Jadwal Cek Medis.xlsx';
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

 

}
