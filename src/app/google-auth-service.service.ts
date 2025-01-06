import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RemoteDataService} from './remotedata.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthServiceService {
  constructor(private httpClient: HttpClient,
              private remoteDataService: RemoteDataService) {
  }

  public signOutExternal = () => {
    localStorage.removeItem("token");
    console.log("token deleted");
  }

  //Method for sending the Credentials to Play
  LoginWithGoogle(credentials: string) {
    return this.httpClient.post<any>(this.remoteDataService.serviceURL + 'googleLoginSendCredentials', JSON.stringify(credentials), httpOptions);
  }
}
