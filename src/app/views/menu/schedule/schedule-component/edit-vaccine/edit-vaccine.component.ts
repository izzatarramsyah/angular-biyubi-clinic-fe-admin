import { OnInit, Component, Input, ViewChild, ElementRef } from "@angular/core";
import { NgbModal, NgbActiveModal, NgbModalOptions, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { UserAdminService } from '../../../../../integration/service/userAdminService';
import { LoadingComponent } from "../../../../components/loading/loading.component";
import { UserAdmin } from "../../../../../entity/userAdmin";
import { RecordService } from '../../../../../integration/service/recordService';
import { AlertComponent } from "../../../components/alert/alert.component";

@Component({
  selector: "app-edit-vaccine",
  templateUrl: "./edit-vaccine.component.html",
  styleUrls: ['./edit-vaccine.component.css']
})
export class EditVaccineComponent implements OnInit {

    @Input() notes : string ;
    @Input() header : string ;
    @Input() userId : number ;
    @Input() childId : number ;
    @Input() mstCode : string ;
    @Input() batch : number ;

    userAdmin: UserAdmin;
    notesEmpty : boolean;

    ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };

    constructor(private modal: NgbActiveModal,
               private modalService: NgbModal,
               private recordService: RecordService,
               private userAdminService: UserAdminService ) {
      this.userAdmin = this.userAdminService.userAdminValue;
    }

    ngOnInit() { 
    }

    process(){

      this.notesEmpty = false;

      if (this.notes == null || this.notes == '') {
        this.notesEmpty = true;
      }

      if (this.notesEmpty == false) {
          
        this.modal.close();
        this.modalService.open(LoadingComponent, this.ngbModalOptions);
        let payload = {
            header : {
              uName : this.userAdmin.username,
              session : this.userAdmin.sessionId,
              command : 'update',
              channel : 'WEB'
            },
            payload : {
              userId : this.userId,
              childId : this.childId,
              vaccineCode : this.mstCode,
              notes : this.notes,
              batch : this.batch
            }
          };
          this.recordService.vaccineRecord(JSON.stringify(payload))
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

}
