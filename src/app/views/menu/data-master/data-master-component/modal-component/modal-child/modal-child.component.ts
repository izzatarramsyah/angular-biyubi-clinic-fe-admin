import { OnInit, Component, Input, ViewChild, ElementRef } from "@angular/core";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { UserAdminService } from '../../../../../../integration/service/userAdminService';
import { UserAdmin } from "../../../../../../entity/userAdmin";
import { UserService } from '../../../../../../integration/service/userService';
import { AlertComponent } from "../../../../components/alert/alert.component";
import { LoadingComponent } from "../../../../components/loading/loading.component";

@Component({
  selector: "app-modal-child",
  templateUrl: "./modal-child.component.html",
  styleUrls: ['./modal-child.component.css']
})
export class ModalChildComponent implements OnInit {

    @Input() childData : any;

    userAdmin: UserAdmin;

    id : number;
    name : string;
    birthDate : string;
    gender : string;

    nameEmpty : boolean;
    birthDateEmpty : boolean;
    genderEmpty : boolean;

    message = [];

    ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };

    constructor(private modal: NgbActiveModal,
               private modalService: NgbModal,
               private userService: UserService,
               private userAdminService: UserAdminService ) {
      this.userAdmin = this.userAdminService.userAdminValue;
    }

    ngOnInit() {
      this.setData();
    }

    setData(){
      this.id = this.childData.id;
      this.name = this.childData.fullname;
      this.birthDate = this.childData.birthDate;
      this.gender = this.childData.gender;
    }

    process(){

      this.nameEmpty = false;
      this.birthDateEmpty = false;
      this.genderEmpty = false;

      if (this.name == null || this.name == '') {
        this.nameEmpty = true;
      }

      if (this.birthDate == null || this.birthDate == '') {
        this.birthDateEmpty = true;
      }

      if (this.gender == null || this.gender == '') {
        this.genderEmpty = true;
      }

      if (this.nameEmpty == false && this.birthDateEmpty == false && this.genderEmpty == false) {

        this.modal.close();
        this.modalService.open(LoadingComponent,this.ngbModalOptions);
        let payload = {
          header : {
            uName : this.userAdmin.username,
            session : this.userAdmin.sessionId,
            command : 'user-update',
            channel : 'WEB'
          },
          payload : {
            id: this.id,
            fullname: this.name,
            gender: this.gender,
            birthDate : this.birthDate
          }
        };
        this.userService.childProcess(JSON.stringify(payload))
        .pipe(first()).subscribe(
          (data) => {
            let header = 'Gagal';
            if (data.header.responseCode == '00') {
              header = 'Sukses'
            }
            this.modalService.dismissAll(LoadingComponent);
            const modalRef = this.modalService.open(AlertComponent,this.ngbModalOptions);
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

}
