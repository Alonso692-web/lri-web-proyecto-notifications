// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotificationComponent } from './components/notifications/log.component';
import { authGuard } from './guard/auth.guard';
import { CreditosComponent } from './components/creditos/creditos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'notifications', component: NotificationComponent },
      { path: 'creditos', component: CreditosComponent },
      { path: '', redirectTo: 'notifications', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];