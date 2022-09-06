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

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  constructor(private modalService: NgbModal,
            private userAdminService: UserAdminService,
            private userService : UserService) { 
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
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command: 'info-all-user'
      },
    };
    this.userService.getUser(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.listOfUser = data.payload.object;
          this.showTable = true;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 3,
            processing: true,
            dom: 'Bfrtip',
            buttons: [
              'copy', 'csv', 'excel', 'print'
              ]
          };
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
      modalRef.componentInstance.wording = 'Apakah anda yakin untuk mengaktifkan pengguna ini ? ';
      this.status = 'ACTIVE';
    } else {
      modalRef.componentInstance.wording = 'Apakah anda yakin untuk menonaktifkan pengguna ini ? ';
      this.status = 'INACTIVE';
    }
    modalRef.componentInstance.emitData.subscribe(($e) => {
      this.recive($e, object.id);
    })
  }

  recive(event, ids) {
    if (event) {
      this.modalService.open(LoadingComponent, this.ngbModalOptions);
      let payload = {
        header : {
          uName: this.userAdmin.username,
          session: this.userAdmin.sessionId,
          command: 'changeStatus'
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
          modalRef.componentInstance.wording = data.header.responseMessage;
        },
        (error) => {
          console.log("error : ", error);
        }  
      );
    } 
  }

  ExportTOExcel() {
    const data = this.listOfUser.map(c => ({ 
      'Username': c.username, 
      'Nama Lengkap': c.fullname,
      'Alamat' : c.address,
      'Nomor Telepon': c.phone_no,
      'Tanggal Bergabung': c.joinDate
    }));
    const fileName = 'Daftar Data Pengguna Aplikasi.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

  checkChild(obj, parentId){   
    const modalRef = this.modalService.open(ModalChildComponent);
    modalRef.componentInstance.childData = obj;
    modalRef.componentInstance.parentId = parentId;
  }

}
