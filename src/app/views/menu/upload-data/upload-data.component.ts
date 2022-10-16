import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserAdminService } from '../../../integration/service/userAdminService';
import { BulkProcessService } from '../../../integration/service/bulkProcessService';
import { first } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { UserAdmin } from "../../../entity/userAdmin";
import { DatePipe } from '@angular/common';
import { AlertUploadDataComponent } from "./upload-data-component/alert/alert-upload-data.component";

@Component({
    selector: 'app-upload-data',
    templateUrl: './upload-data.component.html',
    styleUrls: ['./upload-data.component.css']
})
export class UploadDataComponent implements OnInit{
 
  userAdmin : UserAdmin;
  
  dataType: any = [
  {name: '-- Silahkan Pilih Tipe Data --', value: null, isDisabled : true},
  {name: 'Registrasi Pengguna', value: 'user-registration', isDisabled : false},
  {name: 'Registrasi Anak', value: 'child-registration', isDisabled : false},
  {name: 'Rekam Imunisasi ', value: 'vaccine-record', isDisabled : false},
  {name: 'Rekam Pemeriksaan Medis', value: 'checkup-record', isDisabled : false}];
  selectedValue = this.dataType[0].value;

  loading : boolean;

  filename : string;
  dataExcel = [];

  url : String;

  selectedValueEmpty = false;
  fileEmpty = false;

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };
  
  constructor(private modalService: NgbModal,
              private userAdminService: UserAdminService,
              public datepipe: DatePipe,
              private bulkProcessService : BulkProcessService) { 
    this.userAdmin = this.userAdminService.userAdminValue;
  }

  ngOnInit() {
  }

  onChangeType(e) {
    this.selectedValue = e.target.value;
    this.url = null;
    switch (this.selectedValue){
      case ('user-registration'):
        this.url = '/assets/file/Format_Registrasi_Pengguna.xlsx';
        break;
      case ('child-registration'):
        this.url = '/assets/file/Format_Registrasi_Anak.xlsx';
        break;
      case ('vaccine-record'):
        this.url = '/assets/file/Format_Input_Imunisasi.xlsx';
        break;
      case ('checkup-record'):
        this.url = ' /assets/file/Format_Input_Jejak_Medis.xlsx';
        break;
    }
  }

  uploadFile(event: any){
       /* wire up file reader */
       this.filename ='';
       this.dataExcel = [];
       const target: DataTransfer = <DataTransfer>(event.target);
       if (target.files.length !== 1) {
         throw new Error('Cannot use multiple files');
       }
       const reader: FileReader = new FileReader();
       reader.readAsBinaryString(target.files[0]);
       this.filename = target.files[0].name;
       reader.onload = (e: any) => {
         /* create workbook */
         const binarystr: string = e.target.result;
         const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
         
        for (var i = 0; i < wb.SheetNames.length; ++i) {
          const wsname: string = wb.SheetNames[i];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
          this.dataExcel = data;
        }
        
       };
  }

  upload(){
    this.selectedValueEmpty = false;
    this.fileEmpty = false;

    if (this.selectedValue == null) {
      this.selectedValueEmpty = true;
    }

    if (this.filename == null) {
      this.fileEmpty = true;
    }

    if ( this.selectedValueEmpty == false && this.fileEmpty == false) {
      this.loading = true;
      let payload = {
      header : {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command : this.selectedValue,
        channel : 'WEB'
      },
      payload: {
        filename : this.filename,
        data : this.dataExcel
      }
    };
    this.bulkProcessService.bulkProcess(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        let message = [];
        message.push( `<div style="float: left" > Data Berhasil Di Proses : `+ data.payload.countSuccess +`</div>` );
        message.push( `<div style="float: left" > Data Gagal Di Proses : `+ data.payload.countFailed +`</div>` );
        const modalRef = this.modalService.open(AlertUploadDataComponent, this.ngbModalOptions);
        modalRef.componentInstance.wording = message;
        modalRef.componentInstance.object = data.payload.object;
        this.loading = false;
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
    }
    
  }

}
