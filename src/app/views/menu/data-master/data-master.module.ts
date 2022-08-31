import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { DataMasterComponent } from "./data-master.component";
import { DataVaccineComponent } from "./data-master-component/data-vaccine/data-vaccine.component";
import { DataUserComponent } from "./data-master-component/data-user/data-user.component";
import { DataCheckUpComponent } from "./data-master-component/data-checkup/data-checkup.component";
const routes: Routes = [
  {
    path: "",
    data: {
      title: "DataMaster",
      urls: [{ title: "DataMaster", url: "/DataMaster" }, { title: "DataMaster" }],
    },
    component: DataMasterComponent,
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
    DataMasterComponent,
    DataVaccineComponent,
    DataCheckUpComponent,
    DataUserComponent
  ],
})
export class InputDataModule {}
