import { Routes } from '@angular/router';
import {FullComponent} from './mainAppComp/full/full.component';
import {LoginComponent} from './mainAppComp/login/login.component';
import {RegisterComponent} from './mainAppComp/register/register.component';
import {AuthGuard} from './auth.guard';
import {PasswordRecoveryComponent} from './mainAppComp/password-recovery/password-recovery.component';
import {MoviesComponent} from './mainAppComp/full/movies/movies.component';
import {RoomsComponent} from './mainAppComp/full/rooms/rooms.component';
import {ContactComponent} from './mainAppComp/full/contact/contact.component';
import {HomeComponent} from './mainAppComp/full/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'movies',
        component: MoviesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'rooms',
        component: RoomsComponent,
        canActivate: [AuthGuard],
      },
    ]
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
