import {Injectable} from '@angular/core';
@Injectable()
export class RemoteDataService {

  /***local_dev****/
  public serviceURL = 'http://localhost:9000/';
  public serviceServe = 'http://localhost:4200/';
  public coockieName = 'PICTUREFLIX_COOKIE_SESSION_LOCAL';
  public platform = 'PICTUREFLIX';

}
