import {Injectable} from "@angular/core";
import {RemoteDataService} from "./remotedata.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {Subject, throwError} from "rxjs";
import {AuthenticationService} from "./auth.service";
import {AuthGuard} from "./auth.guard";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true
};

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(public authenticationService: AuthenticationService,
              private http: HttpClient,
              public remoteDataService: RemoteDataService) {
  }

  recoverPassword(data:any) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'forgotPasswordSendEmail', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));

  }

  createUser(data:any) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'createUser', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));

  }

  getMovie(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'getMovie', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  sendContactMessage(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'sendContactMessage', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  //For admin-------------
  addMovie(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'addMovie', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  //For admin------------
  updateMovie(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'updateMovie', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  //For admin-------------
  deleteMovie(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'deleteMovie', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  getRoom(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'getRoom', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  //For Admin ------------
  addRoom(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'addRoom', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  //For Admin ------------
  updateRoom(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'updateRoom', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  //For Admin ------------
  deleteRoom(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'deleteRoom', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  getSeat(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'getSeat', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  //For Admin ------------
  addSeat(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'addSeat', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  //For Admin -----------
  updateSeat(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'updateSeat', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  //For Admin -----------
  deleteSeat(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'deleteSeat', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  getView(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'getView', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  // For Admin---
  addView(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'addView', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  // For Admin---
  updateView(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'updateView', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  // For Admin---
  deleteView(data: any){
    return this.http.post<any>(this.remoteDataService.serviceURL + 'deleteView', data, httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        }
      ),
      catchError((error: any) => {
        this.handleError(error);
        return throwError(error); // Rethrow the error to be handled by the caller
      }));
  }

  private handleError(error:any) {
    var status = error.error.status;
    if (status == undefined) {
      let errorJson = JSON.parse(error.error);
      status = errorJson.status;
    }
    if (status == '403') {
      this.authenticationService.logout();
      window.location.reload();
    } else if (status == '405') {
      alert('Δεν έχετε τα απαραίτητα δικαιώματα γιαυτήν την ενέργεια');
      //this.toastr.error('Δεν έχετε τα απαραίτητα δικαιώματα γιαυτήν την ενέργεια', 'warning');
    }
  }

}
