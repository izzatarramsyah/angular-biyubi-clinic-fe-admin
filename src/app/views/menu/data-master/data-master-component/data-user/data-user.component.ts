import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UserAdminService } from '../../../../../integration/service/userAdminService';
import { UserService } from '../../../../../integration/service/userService';
import { UserAdmin } from "../../../../../entity/userAdmin";
import { User } from "../../../../../entity/user";
import { Child } from "../../../../../entity/child";
import { AlertComponent } from "../../../components/alert/alert.component";
import { ModalUserComponent } from "../modal-component/modal-user/modal-user.component";
import { ModalChildComponent } from "../modal-component/modal-child/modal-child.component";
import { first } from 'rxjs/operators';
import { LoadingComponent } from "../../../components/loading/loading.component";
import * as XLSX from 'xlsx';
import { ExportService } from '../../../../../integration/service/exportService';
import { saveAs } from 'file-saver'

@Component({
    selector: 'app-data-user',
    templateUrl: './data-user.component.html',
    styleUrls: ['./data-user.component.css']
  })
export class DataUserComponent implements OnInit{
 
  userAdmin : UserAdmin;
  listOfUser : User [];
  dtOptions: any = {};
  status : string;
  showTable : boolean;

  message = [];
  
  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService: NgbModal,
            private userAdminService: UserAdminService,
            private userService : UserService,
            private exportService : ExportService) { 
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
    this.getListUser();
  }

  getListUser() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    this.listOfUser = [];
    let payload = {
      header : {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command : 'info-all-user',
        channel : "WEB"
      },
    };
    this.userService.getUser(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.listOfUser = data.payload.object;
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

  modalEdit(object){
    const modalRef = this.modalService.open(ModalUserComponent);
    modalRef.componentInstance.user = object;
    modalRef.componentInstance.command = "Edit";
    modalRef.componentInstance.header = "Edit Profil Pengguna";
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

  recive(event, ids) {
    if (event) {
      this.modalService.open(LoadingComponent, this.ngbModalOptions);
      let payload = {
        header : {
          uName : this.userAdmin.username,
          session : this.userAdmin.sessionId,
          command : 'user-change-status',
          channel : 'WEB'
        },
        payload : {
          id : ids,
          status : this.status
        }
      };
      this.userService.userProcess(JSON.stringify(payload))
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
        command: 'list-user'
      }
    };
    this.exportService.schedule(JSON.stringify(payload))
    .then(blob=> {
       saveAs(blob, 'Daftar data pengguna.xls');
       this.modalService.dismissAll(LoadingComponent);
    });
  }

  checkChild(obj, parentId){   
    const modalRef = this.modalService.open(ModalChildComponent);
    modalRef.componentInstance.childData = obj;
    modalRef.componentInstance.parentId = parentId;
  }

}
