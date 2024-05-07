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
import { ExportService } from '../../../../../integration/service/exportService';
import { saveAs } from 'file-saver'

@Component({
    selector: 'app-data-vaccine',
    templateUrl: './data-vaccine.component.html',
    styleUrls: ['./data-vaccine.component.css']
})
export class DataVaccineComponent implements OnInit{
 
  vaccineMaster : VaccineMaster[];
  userAdmin : UserAdmin;
  showTable = false;
  dtOptions: any = {};
  
  status : string;

  message = [];

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService: NgbModal,
            private userAdminService: UserAdminService,
            private masterService : MasterService,
            private exportService : ExportService) { 
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
    this.getListVaccine();
  }

  getListVaccine() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    this.vaccineMaster = [];
    let payload = {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command : 'info-list-vaccine',
        channel : 'WEB'
    };
    this.masterService.getListMst(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        this.modalService.dismissAll(LoadingComponent);
        if (data.header.responseCode == '00') {
          this.vaccineMaster = data.payload.object;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 4,
            lengthMenu : [4,8,16,32,64,128],
            processing: true
          };
          this.showTable = true;
        } 
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }

  modalAdd(){
    const modalRef = this.modalService.open(ModalVaccineComponent);
    modalRef.componentInstance.lilstOfVaccineMaster = this.vaccineMaster;
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
      this.message = [];
      this.message.push('Apakah anda yakin untuk mengaktifkan vaksin ini ?  ');
      modalRef.componentInstance.wording = this.message;
      this.status = 'ACTIVE';
    } else {
      this.message = [];
      this.message.push('Apakah anda yakin untuk menonaktifkan vaksin ini ? ');
      modalRef.componentInstance.wording = this.message;
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
          uName : this.userAdmin.username,
          session : this.userAdmin.sessionId,
          command : 'change-status-vaccine',
          channel : "WEB"
        },payload : {
          vaccineCode : object.vaccineCode,
          vaccineName : object.vaccineName,
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

  ExportTOExcel() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command: 'info-list-vaccine'
      }
    };
    this.exportService.schedule(JSON.stringify(payload))
    .then(blob=> {
       saveAs(blob, 'Daftar data imunisasi.xls');
       this.modalService.dismissAll(LoadingComponent);
    });
  }

}
