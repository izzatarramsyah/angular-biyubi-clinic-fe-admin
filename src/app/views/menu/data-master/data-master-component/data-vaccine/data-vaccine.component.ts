import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbNavChangeEvent, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserAdminService } from '../../../../../integration/service/userAdminService';
import { MasterService } from '../../../../../integration/service/masterService';
import { UserAdmin } from "../../../../../entity/userAdmin";
import { AlertComponent } from "../../../components/alert/alert.component";
import { ModalVaccineComponent } from "../modal-component/modal-vaccine/modal-vaccine.component";
import { first } from 'rxjs/operators';
import { LoadingComponent } from "../../../components/loading/loading.component";
import * as XLSX from 'xlsx';
import { VaccineMaster } from "../../../../../entity/vaccineMaster";

@Component({
    selector: 'app-data-vaccine',
    templateUrl: './data-vaccine.component.html',
    styleUrls: ['./data-vaccine.component.css']
})
export class DataVaccineComponent implements OnInit{
 
  vaccineMaster : VaccineMaster[];
  userAdmin : UserAdmin;
  status : string;
  showTable : boolean;
  dtOptions: any = {};
  
  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService: NgbModal,
            private userAdminService: UserAdminService,
            private masterService : MasterService) { 
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
    this.getListVaccine();
  }

  getListVaccine() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    this.vaccineMaster = [];
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command : 'info-list-vaccine'
      },
    };
    this.masterService.getListMst(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.vaccineMaster = data.payload.object;
          this.showTable = true;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            processing: true
          };
        } 
        this.modalService.dismissAll(LoadingComponent);
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }

  modalAdd(){
    const modalRef = this.modalService.open(ModalVaccineComponent);
    modalRef.componentInstance.listOfVaccine = this.vaccineMaster;
    modalRef.componentInstance.command = "Add";
    modalRef.componentInstance.header = "Tambah Data Vaksin";
  }

  modalEdit(object){
    const modalRef = this.modalService.open(ModalVaccineComponent);
    modalRef.componentInstance.vaccineMaster = object;
    modalRef.componentInstance.command = "Edit";
    modalRef.componentInstance.header = "Ubah Data Vaksin";
  }

  changeCheckBox(e , object){
    e.preventDefault();
    const modalRef = this.modalService.open(AlertComponent);
    modalRef.componentInstance.header = 'Konfrimasi';
    if (e.target.checked == true) {
      modalRef.componentInstance.wording = 'Apakah anda yakin untuk mengaktifkan vaksin ini ? ';
      this.status = 'ACTIVE';
    } else {
      modalRef.componentInstance.wording = 'Apakah anda yakin untuk menonaktifkan vaksin ini ? ';
      this.status = 'INACTIVE';
    }
    modalRef.componentInstance.emitData.subscribe(($e) => {
      this.recive($e, object);
    })
  }

  recive(event, object) {
    if (event) {
      this.modalService.open(LoadingComponent, this.ngbModalOptions);
      let payload = {
        header : {
          uName: this.userAdmin.username,
          session: this.userAdmin.sessionId,
          command: 'changeStatus'
        },payload : {
          vaccineCode : object.vaccineCode,
          status : this.status
        }
      };
      this.masterService.processMstVaccine(JSON.stringify(payload))
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
    } else {
      this.status = '';
    }
  }

  ExportTOExcel() {
    const data = this.vaccineMaster.map(c => ({ 
      'Nama Vaksin': c.vaccineName, 
      'Tipe Vaksin': c.vaccineType,
      'Bulan Ke -' : c.batch,
      'Hari Kadaluarsa': c.expDays,
      'Catatan': c.notes
    }));
    const fileName = 'Daftar Data imunisasi.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

}
