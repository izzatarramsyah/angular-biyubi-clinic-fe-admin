import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { InputDataComponent } from "./input-data.component";
import { VaccineRecordComponent } from "./input-data-component/vaccine-record/vaccine-record.component";
import { ParentRegistrationComponent } from "./input-data-component/parent-registration/parent-registration.component";
import { ChildRegistrationComponent } from "./input-data-component/child-registration/child-registration.component";
import { CheckUpRecordComponent } from "./input-data-component/checkup-record/checkup-record.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "InputData",
      urls: [{ title: "InputData", url: "/InputData" }, { title: "InputData" }],
    },
    component: InputDataComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgApexchartsModule,
  ],
  declarations: [
    InputDataComponent,
    VaccineRecordComponent,
    ParentRegistrationComponent,
    ChildRegistrationComponent,
    CheckUpRecordComponent
  ],
})
export class InputDataModule {}
