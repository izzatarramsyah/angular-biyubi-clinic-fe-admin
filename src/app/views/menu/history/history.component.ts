import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UserAdminService } from '../../../integration/service/userAdminService';
import { AuditTrailService } from '../../../integration/service/auditTrailService';
import { first } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { AuditTrail } from "../../../entity/auditTrail";
import { UserAdmin } from "../../../entity/userAdmin";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit{
 
  auditTrail : AuditTrail[];
  userAdmin : UserAdmin;
  dtOptions : any;

  startDate : String;
  endDate : String;

  showTable = false;

  loading = false;

  maxDate : String;

  showComponent = false;

  constructor(private userAdminService: UserAdminService,
            private auditTrailService : AuditTrailService,
            public datepipe: DatePipe) { 
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
    this.startDate = null;
    this.endDate = null;
    this.setMaxDate();
  }

  setMaxDate(){
    let today = new Date();
    this.maxDate = this.datepipe.transform(today, "yyyy / MM / dd");
    this.showComponent = true;
  }

  search() {
    this.auditTrail = [];
    this.showTable = false;
    this.loading = true;
     
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
      },
      payload : {
        startDate : this.startDate,
        endDate : this.endDate,
      }
    };

    this.auditTrailService.getListAuditTrail(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.auditTrail = data.payload.object;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,  
            processing: true
          };
          this.showTable = true;
        } 
        this.loading = false;
      },

      (error) => {
        console.log("error : ", error);
      }  
    );
  }


  ExportTOExcel() {
    const data = this.auditTrail.map(c => ({ 
      'Username': c.username,
      'Tanggal': c.date,
      'Aktivitas' : c.activity,
      'Detail': c.detail
    }));
    const fileName = 'Daftar Data Jejak Aktivitas Admin.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

}
