import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UserAdminService } from '../../../../../integration/service/userAdminService';
import { MasterService } from '../../../../../integration/service/masterService';
import { UserAdmin } from "../../../../../entity/userAdmin";
import { AlertComponent } from "../../../components/alert/alert.component";
import { ModalCheckUpComponent } from "../modal-component/modal-checkup/modal-checkup.component";
import { first } from 'rxjs/operators';
import { LoadingComponent } from "../../../components/loading/loading.component";
import { CheckUpMaster } from "../../../../../entity/checkUpMaster";
import * as XLSX from 'xlsx';
import { ExportService } from '../../../../../integration/service/exportService';
import { saveAs } from 'file-saver'

@Component({ 
    selector: 'app-data-checkup',
    templateUrl: './data-checkup.component.html',
    styleUrls: ['./data-checkup.component.css']
  })
export class DataCheckUpComponent implements OnInit{
 
  checkUpMaster : CheckUpMaster[];
  userAdmin : UserAdmin;
  status : string;
  showTable = false;
  dtOptions: any = {};

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
    this.getListCheckUp();
 
  }

  getListCheckUp() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    this.checkUpMaster = [];
    let payload = {
      uName : this.userAdmin.username,
      session : this.userAdmin.sessionId,
      command : 'info-list-checkup' ,
      channel : "WEB"
    };
    this.masterService.getListMst(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.checkUpMaster = data.payload.object;
          this.showTable = true;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 4,
            lengthMenu : [4,8,16,32,64,128],
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
    const modalRef = this.modalService.open(ModalCheckUpComponent);
    modalRef.componentInstance.listOfCheckUp = this.checkUpMaster;
    modalRef.componentInstance.command = "Add";
    modalRef.componentInstance.header = "Tambah Data";
  }

  modalEdit(object){
    const modalRef = this.modalService.open(ModalCheckUpComponent);
    modalRef.componentInstance.checkUpMaster = object;
    modalRef.componentInstance.command = "Edit";
    modalRef.componentInstance.header = "Ubah Data";
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
          uName : this.userAdmin.username,
          session : this.userAdmin.sessionId,
          command : 'changeStatus',
          channel : "WEB"
        },payload : {
          actName : object.actName,
          code : object.code,
          status : this.status
        }
      };
      this.masterService.processMstCheckUp(JSON.stringify(payload))
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
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command: 'mst-checkup'
      }
    };
    this.exportService.schedule(JSON.stringify(payload))
    .then(blob=> {
       saveAs(blob, 'Daftar data rekam medis.xls');
       this.modalService.dismissAll(LoadingComponent);
    });
  }

}
