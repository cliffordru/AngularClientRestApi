import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:3000/patients";
  //private REST_API_SERVER = "http://localhost:57678/api/patients";

  constructor(private httpClient : HttpClient) { }

  public getPatients(){
    // Add safe, URL encoded_page parameter
    const options = {params: new HttpParams({fromString: "_page=1&_limit=5"})};
    return this.httpClient.get(this.REST_API_SERVER,options).pipe(retry(3),catchError(this.handleError));
  }

  //TODO: handle errors globally via HttpClient interceptors
  handleError(error: HttpErrorResponse){
    let errorMessage = 'Unknown error!';

    if(error.error instanceof ErrorEvent){
      // Client-side error
      errorMessage = `Error:${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status} \n Message: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
}

