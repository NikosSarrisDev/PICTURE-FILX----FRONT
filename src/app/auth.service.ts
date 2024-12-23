import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {CookieService} from "./cookie.service";
import {Router} from "@angular/router";
import {RemoteDataService} from "./remotedata.service";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  user: any;
  public currentUserSubject: Subject<any> = new Subject<any>();

  public menuOtionsInds:any={};


  constructor(private http: HttpClient, private cookieService: CookieService, private remoteDataService: RemoteDataService , private router: Router) {}
  public currentUser(): any {
    if (!this.user) {
      this.user = JSON.parse(<string>this.cookieService.getCookie(this.remoteDataService.platform+'_user'));
    }
    return this.user;
  }
  login(password: string ,email: string) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'login',
        {
          password: password,
          email: email,
        } , httpOptions)
        .pipe(map(user => {
          if (user && user.isVerified) {
            this.user = user;
            this.currentUserSubject.next(this.user);
            this.cookieService.deleteCookie(this.remoteDataService.platform+'_user');
            this.cookieService.setCookie(this.remoteDataService.platform+'_user', JSON.stringify(user), 1);
          }
          return user;
        }));
  }
  impersonateUser(user:any , previousUserAdmin:any) {
    user.impersonateUser=true;
    user.previousUserAdmin=previousUserAdmin;
    this.user = user;
    this.currentUserSubject.next(this.user);
    this.cookieService.deleteCookie(this.remoteDataService.platform+'_user');
    this.cookieService.setCookie(this.remoteDataService.platform+'_user', JSON.stringify(user), 1);
  }
  logout() {
    this.cookieService.deleteCookie(this.remoteDataService.platform+'_user');
    this.user = null;
  }
  logoutPlay(data:any) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'logout', {} , httpOptions)
      .pipe(map(user => {
        return user;
      }));
  }
  addingToSessionManually(data:any) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'addingToSessionManually', data  )
      .pipe(map(user => {
        return user;
      }));
  }
  currentIp() {
    return this.http.get<any>('https://api.db-ip.com/v2/free/self' )
      .pipe(map(currentIp => {
        return currentIp;
      }));
  }
}
