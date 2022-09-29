import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexYAxis,
  ApexLegend, ApexXAxis, ApexTooltip, ApexTheme, ApexGrid, ApexPlotOptions } from 'ng-apexcharts';
import { UserAdmin } from "../../../entity/userAdmin";
import { UserData } from "../../../entity/userData";
import { ListChild, ListUser } from "../../../entity/listUser";
import { UserAdminService } from "../../../integration/service/userAdminService";
import { UserService } from "../../../integration/service/userService";
import { LoadingComponent } from "../components/loading/loading.component";
import { MasterService } from "../../../integration/service/masterService";

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
              private masterService : MasterService) {

    this.userAdmin = this.userAdminService.userAdminValue;
    this.salesChartOptions = {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], 
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      }
    };
    this.series = [];
    this.isReadOnly = true;
  }

  ngOnInit(): void {
    this.getListUser();
  }

  getListUser() {
    this.modalService.open(LoadingComponent, this.ngbModalOptions);
    this.resultOflistUser = [];
    let payload = {
      header : {
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command :'info-all-simple-user',
        channel : "WEB"
      }
    };
    this.userService.getUser(JSON.stringify(payload))
    .pipe(first()).subscribe(
      (data) => {
        if (data.header.responseCode == '00') {
          this.resultOflistUser = data.payload.object;
        }
        this.modalService.dismissAll(LoadingComponent);
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
        uName : this.userAdmin.username,
        session : this.userAdmin.sessionId,
        command :'info-user',
        channel : "WEB"
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
          this.weight = this.userData.childData.weight;
          this.weightCategory = this.userData.childData.weightCategory;
          this.lengthCategory = this.userData.childData.lengthCategory;
          this.weightNotes = this.userData.childData.weightNotes;
          this.length = this.userData.childData.length;
          this.lengthNotes = this.userData.childData.lengthNotes;
          this.headDiameter = this.userData.childData.headDiameter;
          this.headDiameterCategory = this.userData.childData.headDiameterCategory;
          this.headDiameterNotes = this.userData.childData.headDiameterNotes;
          this.seriesWeight = this.userData.childData.seriesWeight;
          this.seriesLength = this.userData.childData.seriesLength;
          this.seriesHeadDiameter = this.userData.childData.seriesHeadDiameter;
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
    const value = e.target.value;
    if (value == 'WEIGHT') {
      this.series = [
        { name: "Sangat Kurus",
          data: [2.0, 3.0, 3.8, 4.4, 5.0, 5.4, 5.8, 6.0, 6.2, 6.4, 6.6, 6.8, 7.0] },
        { name: "Kurus",
          data: [ 2.4, 3.2, 4.4, 5.0, 5.6, 6.0, 6.4, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8] },
        { name: "Normal",
          data: [3.4, 4.4, 5.6, 6.4, 7.0, 7.4, 8.0, 8.2, 8.6, 9.0, 9.2, 9.4, 9.8] },
        { name: "Gemuk",
          data: [4.4, 5.8, 7.0, 8.0, 8.8, 9.4, 9.8, 10.2, 10.6, 11.0, 11.4, 11.6, 12.0] },
        { name: "Sangat Gemuk",
          data: [5.0, 6.6, 8.0, 9.0, 9.8, 10.4, 11.0, 11.4, 11.8, 12.2, 12.6, 13.0, 13.4] },
        { name: "Berat Anak",
          data: this.seriesWeight },
      ];
    } else if (value == 'LENGTH') {
      this.series = [
        { name: "Sangat Pendek",
          data: [44.0, 48.0, 52.0, 55.0, 58.0, 59.0, 61.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0] },
        { name: "Pendek",
          data: [46.0, 51.0, 54.0, 57.0, 60.0, 62.0, 63.0, 65.0, 66.0, 67.0, 69.0, 70.0, 71.0] },
        { name: "Normal",
          data: [50.0, 55.0, 58.0, 62.0, 64.0, 66.0, 68.0, 69.0, 71.0, 72.0, 73.0, 74.0, 76.0] },
        { name: "Tinggi",
          data: [54.0, 58.0, 63.0, 65.0, 68.0, 70.0, 72.0, 73.0, 75.0, 76.0, 78.0, 79.0, 81.0] },
        { name: "Sangat Tinggi",
          data: [56.0, 61.0, 65.0, 68.0, 70.0, 72.0, 74.0, 76.0, 77.0, 79.0, 80.0, 82.0, 83.0] },
        { name: "Panjang Anak",
          data: this.seriesLength },
      ];
    } else if (value == 'HEAD CIRCUMFERENCE') {
      this.series = [
        { name: "Mikrosefali Tingkat Lanjut",
          data: [32.0, 35.0, 37.0, 38.5, 39.5, 40.5, 41.0, 41.5, 42.0, 42.5, 43.0, 43.5, 43.5] },
        { name: "Mikrosefali",
          data: [36.0, 38.5, 40.5, 41.5, 43.0, 44.0, 44.5, 45.5, 46.0, 46.5, 46.8, 47.0, 47.5] },
        { name: "Normal",
          data: [34.5, 37.0, 39.0, 40.5, 41.5, 42.5, 43.5, 44.0, 44.5, 45.0, 45.5, 45.8, 46.0] },
        { name: "Makrosefali",
          data: [33.0, 36.0, 38.0, 39.5, 40.5, 41.5, 42.0, 42.5, 43.0, 43.5, 44.0, 44.5, 44.5] },
        { name: "Makrosefali Tingkat Lanjut",
          data: [37.0, 39.0, 41.5, 42.5, 44.0, 45.0, 45.5, 46.5, 47.0, 47.5, 48.0, 48.2, 48.5] },
        { name: "Lingkar Kepala Anak",
          data: this.seriesHeadDiameter },
      ];
    }
  }
  
  
}
