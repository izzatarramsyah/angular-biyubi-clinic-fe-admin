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
  selector: "app-edit-checkup",
  templateUrl: "./edit-checkup.component.html",
  styleUrls: ['./edit-checkup.component.css']
})
export class EditCheckUpComponent implements OnInit {

    @Input() header : string ;
    @Input() weight : number;
    @Input() length : number ;
    @Input() headDiameter : number ;
    @Input() notes : string ;
    @Input() userId : number ;
    @Input() childId : number ;
    @Input() mstCode : string ;
    
    userAdmin: UserAdmin;

    weightEmpty : boolean;
    lengthEmpty : boolean;
    headDiameterEmpty : boolean;
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

    ngOnInit() { }

    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
    
    process(){

      this.weightEmpty = false;
      this.lengthEmpty = false;
      this.headDiameterEmpty = false;
      this.notesEmpty = false;

      if (this.weight == null || this.weight == 0) {
        this.weightEmpty = true;
      }

      if (this.length == null || this.length == 0) {
        this.lengthEmpty = true;
      }

      if (this.headDiameter == null || this.headDiameter == 0) {
        this.headDiameterEmpty = true;
      }

      if (this.notes == null || this.notes == '') {
        this.notesEmpty = true;
      }

      if (this.weightEmpty == false && this.lengthEmpty == false 
        && this.headDiameterEmpty == false && this.notesEmpty == false ) {
          
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
              mstCode : this.mstCode,
              weight : this.weight,
              length : this.length,
              headDiameter : this.headDiameter,
              notes : this.notes
            }
          };
          this.recordService.checkUpRecord(JSON.stringify(payload))
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
