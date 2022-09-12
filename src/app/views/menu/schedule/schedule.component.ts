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
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
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
            pageLength: 3,
            processing: true
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

  getListCheckUpRecord () {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
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
            pageLength: 3,
            processing: true
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

  downloadPdf(object){
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    let command;
    let filename;
    let payload;
    let child = this.tempListChild.filter(({id}) => id == this.selectedChildId)
    if (this.selectedHistoryType == 'info-checkup') {
      command = 'report-checkup';
      filename = 'Laporan Rekam Medis '+ child[0].fullname +'.pdf';
      payload = {
        header : {
          uName: this.userAdmin.username,
          session: this.userAdmin.sessionId,
          command: 'report-checkup'
        },
        payload: {
          parentId : this.tempUser.id,
          childId : this.selectedChildId,
          param : object.code
        }
      };
    } else if (this.selectedHistoryType == 'info-vaccine') {
      command = 'report-vaccine';
      filename = 'Laporan Rekam Imunisasi '+ child[0].fullname +'.pdf';
      payload = {
        header : {
          uName: this.userAdmin.username,
          session: this.userAdmin.sessionId,
          command: 'report-vaccine'
        },
        payload: {
          parentId : this.tempUser.id,
          childId : this.selectedChildId,
          param : object.vaccineCode,
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
 
  ExportTOExcel() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    let command = '';
    let filename = '';
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
        parentId : this.tempUser.id,
        childId : this.selectedChildId
      }
    };
    this.exportService.schedule(JSON.stringify(payload))
    .then(blob=> {
       saveAs(blob, filename);
       this.modalService.dismissAll(LoadingComponent);
    });
  }

 

}
