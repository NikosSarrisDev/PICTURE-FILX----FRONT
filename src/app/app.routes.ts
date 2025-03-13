import {Routes} from '@angular/router';
import {FullComponent} from './mainAppComp/full/full.component';
import {LoginComponent} from './mainAppComp/login/login.component';
import {RegisterComponent} from './mainAppComp/register/register.component';
import {AuthGuard} from './auth.guard';
import {PasswordRecoveryComponent} from './mainAppComp/password-recovery/password-recovery.component';
import {MoviesComponent} from './mainAppComp/full/movies/movies.component';
import {RoomsComponent} from './mainAppComp/full/rooms/rooms.component';
import {ContactComponent} from './mainAppComp/full/contact/contact.component';
import {HomeComponent} from './mainAppComp/full/home/home.component';
import {RoomDefaultComponent} from './mainAppComp/full/rooms/room-default/room-default.component';
import {ViewsComponent} from './mainAppComp/full/views/views.component';
import {QuantityComponent} from './mainAppComp/full/quantity/quantity.component';
import {
  BuyTicketAddShowRemainingComponent
} from './mainAppComp/full/buy-ticket-add-show-remaining/buy-ticket-add-show-remaining.component';
import {AdminPageMoviesComponent} from './ConfirmationDialogs/admin-page-movies/admin-page-movies.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
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
      {
        path: 'roomDefault',
        component: RoomDefaultComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'views',
        component: ViewsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'quantity',
        component: QuantityComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'buyTicket',
        component: BuyTicketAddShowRemainingComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'moviesAdmin',
    component: AdminPageMoviesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contact',
    component: ContactComponent,
    canActivate: [AuthGuard]
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
