import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticationService} from "./auth.service";
import {DataService} from "./data.service";
import {RemoteDataService} from "./remotedata.service";


@Injectable({ providedIn: 'root' })
export class AuthGuard  {
    constructor(
        public remoteDataService: RemoteDataService,
        private dataservice: DataService,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }


    // async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
    //     const currentUser = this.authenticationService.currentUser();
    //     if (currentUser) {
    //         return true;
    //     }else{
    //         this.authenticationService.logout();
    //         this.router.navigate(['login']);
    //         return false;
    //     }
    // }


    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
        console.log("can activate!");
        var coockiePlayExist=this.checkPlaySessionCookie(this.remoteDataService.coockieName);
        const currentUser = this.authenticationService.currentUser();
        if (currentUser && coockiePlayExist) {
            return true;
        }else{
            this.authenticationService.logout();
            this.router.navigate(['login']);
            return false;
        }
    }


    checkPlaySessionCookie(name:any) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return true;
        }
        else{
            return false;
        }
    }



}
