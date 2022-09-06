import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from './views/layouts/full/full.component';
import { LoginComponent } from "./views/login/login.component";
import { LoginGuard } from './interceptor/login.guard';
import { AuthGuard } from './interceptor/auth.guard';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard', canActivate: [AuthGuard],
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'menu', canActivate: [AuthGuard],
        loadChildren: () => import('./views/menu/component.module').then(m => m.ComponentsModule)
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'login', 
        loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
