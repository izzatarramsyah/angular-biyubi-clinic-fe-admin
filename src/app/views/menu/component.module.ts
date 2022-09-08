import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { DataTablesModule } from 'angular-datatables';
import { ComponentsRoutes } from './component.routing';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InputDataComponent } from './input-data/input-data.component';
import { VaccineRecordComponent } from "./input-data/input-data-component/vaccine-record/vaccine-record.component";
import { ParentRegistrationComponent } from "./input-data/input-data-component/parent-registration/parent-registration.component";
import { ChildRegistrationComponent } from "./input-data/input-data-component/child-registration/child-registration.component";
import { CheckUpRecordComponent } from "./input-data/input-data-component/checkup-record/checkup-record.component";
import { DataMasterComponent } from './data-master/data-master.component';
import { ModalVaccineComponent } from "./data-master/data-master-component/modal-component/modal-vaccine/modal-vaccine.component";
import { DataVaccineComponent } from "./data-master/data-master-component/data-vaccine/data-vaccine.component";
import { ModalUserComponent } from "./data-master/data-master-component/modal-component/modal-user/modal-user.component";
import { AlertComponent } from "./components/alert/alert.component";
import { LoadingComponent } from "./components/loading/loading.component";
import { ScheduleComponent } from './schedule/schedule.component';
import { GraphComponent } from './graph/graph.component';
import { DataUserComponent } from "./data-master/data-master-component/data-user/data-user.component";
import { DataCheckUpComponent } from "./data-master/data-master-component/data-checkup/data-checkup.component";
import { ModalCheckUpComponent } from "./data-master/data-master-component/modal-component/modal-checkup/modal-checkup.component";
import { ModalChildComponent } from "./data-master/data-master-component/modal-component/modal-child/modal-child.component";
import { HistoryComponent } from './history/history.component';
import { FileSaverModule } from 'ngx-filesaver';

@NgModule({ 
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgApexchartsModule,
    DataTablesModule,
    AngularEditorModule,
    AutocompleteLibModule,
    FileSaverModule
  ],
  declarations: [
    InputDataComponent,
    DataMasterComponent,
    ModalVaccineComponent,
    DataVaccineComponent,
    VaccineRecordComponent,
    ParentRegistrationComponent,
    ChildRegistrationComponent,
    CheckUpRecordComponent,
    AlertComponent,
    ScheduleComponent,
    GraphComponent,
    LoadingComponent,
    DataUserComponent,
    ModalUserComponent,
    DataCheckUpComponent,
    ModalCheckUpComponent,
    ModalChildComponent,
    HistoryComponent
  ]
})
export class ComponentsModule { }
