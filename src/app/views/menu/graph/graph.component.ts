import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexYAxis,
  ApexLegend, ApexXAxis, ApexTooltip, ApexTheme, ApexGrid, ApexPlotOptions } from 'ng-apexcharts';
import { DatePipe } from '@angular/common';
import { UserAdmin } from "../../../entity/userAdmin";
import { UserData } from "../../../entity/userData";
import { ListChild, ListUser } from "../../../entity/listUser";
import { UserAdminService } from "../../../integration/service/userAdminService";
import { UserService } from "../../../integration/service/userService";
import { LoadingComponent } from "../components/loading/loading.component";
import { AlertComponent } from "../components/alert/alert.component";

export type salesChartOptions = {
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions
};

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  userAdmin : UserAdmin;
  userData : UserData;
  resultOflistUser : ListUser [];
  tempUser : ListUser;
  tempListChild : ListChild [] ;

  parentName : string;
  childName : string;
  birthDate : string;
  gender : string;
  weight : number;
  length : number;
  headDiameter : number;
  age : number;
  weightCategory : string;
  lengthCategory : string;
  headDiameterCategory : string;
  weightNotes : string;
  lengthNotes : string;
  headDiameterNotes : string

  notes : string;

  series : ApexAxisChartSeries;
  seriesWeight = [];
  seriesLength = [];
  seriesHeadDiameter = [];

  selectedChildId = 0;
  
  listChild = [];

  @ViewChild("chart") chart: ChartComponent = Object.create(null);
  public salesChartOptions: Partial<salesChartOptions>;

  isReadOnly : boolean;
  
  keyword = 'fullname';

  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };

  public isCollapsed = true;

  constructor(private modalService : NgbModal,
              private userService : UserService,
              private userAdminService : UserAdminService,
              private datePipe : DatePipe) {

    this.userAdmin = this.userAdminService.userAdminValue;
    this.salesChartOptions = {
      chart: {
        fontFamily: 'Montserrat,sans-serif',
        height: 460,
        type: 'area',
        toolbar: {
          show: false
        },
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#0d6efd", "#009efb", "#6771dc"],
      stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
      },
      grid: {
        strokeDashArray: 3,
      },
      xaxis: {
        categories: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      },
      tooltip: {
        theme: 'dark'
      }
    };
    this.series = [];
    this.isReadOnly = true;
  }

  ngOnInit(): void {
    this.getListUser();
  }

  getListUser() {
    this.resultOflistUser = [];
    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command:'info-all-simple-user'
      }
    };
    this.userService.getUser(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.resultOflistUser = data.payload.object;
        }
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }

  selectEvent(object) {
    this.tempUser = object;
    this.tempListChild = this.tempUser.listChild;
  }

  onChangeSearch(name: string) {
    this.tempUser = null;
    this.tempListChild = [];
    this.selectedChildId = 0;
    for (const i in this.resultOflistUser) {
      if (name == this.resultOflistUser[i].fullname) {
        this.tempUser = this.resultOflistUser[i];
        this.tempListChild = this.tempUser.listChild;
      }
    }
  }

  changeChildName (e) {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    this.selectedChildId = e.target.value;

    let payload = {
      header : {
        uName: this.userAdmin.username,
        session: this.userAdmin.sessionId,
        command:'info-user'
      }, payload : {
        parentId : this.tempUser.id,
        childId : this.selectedChildId
      }
    };
    this.userService.getUser(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.userData = data.payload.object;

          this.childName =  this.userData.childData.fullname;
          this.birthDate = this.userData.childData.birthDate;
          this.gender = this.userData.childData.gender;
          this.age = this.userData.childData.age;
          this.weightCategory = this.userData.childData.weightCategory;
          this.lengthCategory = this.userData.childData.lengthCategory;
          this.weightNotes = this.userData.childData.weightNotes;
          this.lengthNotes = this.userData.childData.lengthNotes;
          this.headDiameterCategory = this.userData.childData.headDiameterCategory;
          this.headDiameterNotes = this.userData.childData.headDiameterNotes;

          for (const y in this.userData.childData.growthDetail) {
            this.seriesWeight.push(this.userData.childData.growthDetail[y].weight);
            this.seriesLength.push(this.userData.childData.growthDetail[y].length);
            this.seriesHeadDiameter.push(this.userData.childData.growthDetail[y].headDiameter);
          }
  
          if (this.userData.childData.growthDetail.length > 0) {
            const index = this.userData.childData.growthDetail.length -1;
            this.weight = this.seriesWeight[index];
            this.length = this.seriesLength[index];
            this.headDiameter = this.seriesHeadDiameter[index];
          }

          this.modalService.dismissAll(LoadingComponent);

        }
      },
      (error) => {
        console.log("error : ", error);
      }  
    );
  }

  changeGraphType (e) {
    this.series = [];
    this.notes = null;
    const value = e.target.value;
    if (value == 'weight') {
      this.notes = this.weightNotes;
      this.series = [
        { name: "Sangat Kurus",
          data: [2, 3, 3.8, 4.4] },
        { name: "Kurus",
          data: [2.4, 3.4, 4.4, 5] },
        { name: "Normal",
          data: [3.3, 4.4, 5.6, 6.4] },
        { name: "Gemuk",
          data: [4.4, 5.8, 7, 8] },
        { name: "Sangat Gemuk",
          data: [5, 6.6, 8, 9] },
        { name: "Berat Anak",
          data:  this.seriesWeight },
      ];
    } else if (value == 'length') {
      this.notes = this.lengthNotes;
      this.series = [
        { name: "Sangat Pendek",
          data: [44, 48, 52, 55] },
        { name: "Pendek",
          data: [47, 51, 55, 57] },
        { name: "Normal",
          data: [50, 55, 59, 62] },
        { name: "Tinggi",
          data: [54, 59, 63, 66] },
        { name: "Sangat Tinggi",
          data: [56, 61, 65, 68] },
        { name: "Panjang Anak",
          data: this.seriesLength },
      ];
    } else if (value == 'headDiameter') {
      this.notes = this.headDiameterNotes;
      this.series = [
        { name: "Mikrosefali",
          data: [32, 35, 37, 39.5] },
        { name: "Normal",
          data: [34.5, 37.5, 39, 41.5] },
        { name: "Makrosefali",
          data: [37, 39.5, 42.5, 44] },
        { name: "Lingkar Kepala Anak",
          data: this.seriesHeadDiameter },
      ];
    }
    const modalRef = this.modalService.open(AlertComponent);
    modalRef.componentInstance.header = "Informasi";
    modalRef.componentInstance.wording = this.notes;
  }
  
  
}
