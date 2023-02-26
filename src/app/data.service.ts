import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:3000/patients";
  //private REST_API_SERVER = "http://localhost:57678/api/patients";

  constructor(private httpClient : HttpClient) { }

  public first: string = "";
  public prev: string = "";
  public next: string = "";
  public last: string = "";

  public getPatients(){
    // Add safe, URL encoded_page parameter
    return this.httpClient.get(this.REST_API_SERVER, {  params: new HttpParams({fromString: "_page=1&_limit=5"}), observe: "response"}).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link')!);
    }));
  }

  parseLinkHeader(header: string) {
    if (header.length == 0) {
      return ;
    }

    let parts = header.split(',');
    var links = {} as any;
    parts.forEach( p => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });

    this.first  = links["first"];
    this.last   = links["last"];
    this.prev   = links["prev"];
    this.next   = links["next"];
  }

  public sendGetRequestToUrl(url: string){
    return this.httpClient.get(url, { observe: "response"}).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link')!);

    }));
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

