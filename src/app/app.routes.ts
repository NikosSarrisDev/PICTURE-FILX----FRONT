import { Routes } from '@angular/router';
import {FullComponent} from './mainAppComp/full/full.component';
import {LoginComponent} from './mainAppComp/login/login.component';
import {RegisterComponent} from './mainAppComp/register/register.component';
import {AuthGuard} from './auth.guard';
import {PasswordRecoveryComponent} from './mainAppComp/password-recovery/password-recovery.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: []
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'forgetPass',
    component: PasswordRecoveryComponent
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
