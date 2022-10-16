import { OnInit, Component, Input, ViewChild, ElementRef } from "@angular/core";
import { NgbModal, NgbActiveModal, NgbModalOptions, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { UserAdminService } from '../../../../../../integration/service/userAdminService';
import { MasterService } from '../../../../../../integration/service/masterService';
import { UserAdmin } from "../../../../../../entity/userAdmin";
import { CheckUpMaster } from "../../../../../../entity/checkUpMaster";
import { AlertComponent } from "../../../../components/alert/alert.component";
import { LoadingComponent } from "../../../../components/loading/loading.component";

@Component({
  selector: "app-modal-checkup",
  templateUrl: "./modal-checkup.component.html",
  styleUrls: ['./modal-checkup.component.css']
})
export class ModalCheckUpComponent implements OnInit {

    @Input() checkUpMaster : CheckUpMaster ;
    @Input() listOfCheckUp : any;
    @Input() command : string ;
    @Input() header  : string ;

    userAdmin: UserAdmin;

    actName : string;
    description : string;
    selectedBatch : number;
    nextCheckUpDays : number;

    actNameEmpty : boolean;
    descriptionEmpty : boolean;
    batchEmpty : boolean;
    nextCheckUpDaysEmpty : boolean;
    selectedBatchEmpty : boolean;

    listBatch: any = [
      {batch: 1, value: false},
      {batch: 2, value: false},
      {batch: 3, value: false},
      {batch: 4, value: false},
      {batch: 5, value: false},
      {batch: 6, value: false},
      {batch: 7, value: false},
      {batch: 8, value: false},
      {batch: 9, value: false},
      {batch: 10, value: false},
      {batch: 11, value: false},
      {batch: 12, value: false},
      {batch: 13, value: false}
    ];

    message = [];
    
    ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };

    constructor(private modal: NgbActiveModal,
               private modalService: NgbModal,
               private masterService: MasterService,
               private userAdminService: UserAdminService ) {
      this.userAdmin = this.userAdminService.userAdminValue;
    }

    ngOnInit() {
      this.selectedBatch = 0;
      this.setBatchValue();
      if (this.command == 'Edit') {
        this.setData();
      }
    }

    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
    
    setBatchValue(){
      for (const y in this.listBatch) {
        for (const x in this.listOfCheckUp) {
          if (this.listBatch[y].batch == this.listOfCheckUp[x].batch) {
            this.listBatch[y].value = true;
          }
        }
      }
    }

    setData(){
      this.actName = this.checkUpMaster.actName;
      this.description = this.checkUpMaster.description;
      this.selectedBatch = this.checkUpMaster.batch;
      this.nextCheckUpDays = this.checkUpMaster.nextCheckUpDays;
    }

    process(){

      this.actNameEmpty = false;
      this.descriptionEmpty = false;
      this.batchEmpty = false;
      this.nextCheckUpDaysEmpty = false;

      if (this.actName == null || this.actName == '') {
        this.actNameEmpty = true;
      }

      if (this.description == null || this.description == '') {
        this.descriptionEmpty = true;
      }

      if (this.selectedBatch == null) {
        this.batchEmpty = true;
      }

      if (this.nextCheckUpDays == null) {
        this.nextCheckUpDaysEmpty = true;
      }

      if (this.command == 'Edit') {

        if (this.actNameEmpty == false && this.descriptionEmpty == false
          && this.batchEmpty == false && this.nextCheckUpDaysEmpty == false ) {

          this.modal.close();
          this.modalService.open(LoadingComponent, this.ngbModalOptions);
          let payload = {
            header : {
              uName : this.userAdmin.username,
              session : this.userAdmin.sessionId,
              command : 'update-checkup',
              channel : 'WEB'
            },
            payload : {
              code : this.checkUpMaster.code,
              actName : this.actName,
              description : this.description,
              batch : this.selectedBatch,
              nextCheckUpDays : this.nextCheckUpDays,
              status : this.checkUpMaster.status
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
              this.message = [];
              this.message.push(data.header.responseMessage);
              modalRef.componentInstance.wording = this.message;
            },
            (error) => {
              console.log("error : ", error);
            }  
          );
        
        }
        
      } else {

        if (this.actNameEmpty == false && this.descriptionEmpty == false
                && this.batchEmpty == false && this.nextCheckUpDaysEmpty == false ) {
                  
            this.modal.close();
            this.modalService.open(LoadingComponent, this.ngbModalOptions);
            let payload = {
              header : {
                uName : this.userAdmin.username,
                session : this.userAdmin.sessionId,
                command : 'save-checkup',
                channel : 'WEB'
              },
              payload : {
                actName : this.actName,
                description : this.description,
                batch : this.selectedBatch,
                nextCheckUpDays : this.nextCheckUpDays
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

}
