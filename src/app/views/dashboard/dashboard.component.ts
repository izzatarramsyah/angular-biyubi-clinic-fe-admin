import { Component, AfterViewInit } from '@angular/core';
import { UserAdminService } from '../../integration/service/userAdminService';
import { UserAdmin } from "../../entity/userAdmin";

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit {
  title:string;
  subtitle: string;
  userAdmin : UserAdmin;
  constructor(private userAdminService: UserAdminService) {
    this.userAdmin = this.userAdminService.userAdminValue;
    this.title = 'Selamat Datang, ' + this.userAdmin.username + " ! ";
    this.subtitle = 'Website ini digunakan untuk admin Biyubi Clinic App';
  }

  ngAfterViewInit() { }
}
