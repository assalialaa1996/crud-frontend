import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

//Endpoint
const endpoint = 'http://localhost:4000/api/product/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }

  getProducts(x): Observable<any> {
    return this.http.get(endpoint+'?page='+x).pipe(
      map(this.extractData));
  }

  

  getProduct(id): Observable<any> {
    return this.http.get(endpoint + id).pipe(
      map(this.extractData));
  }
  
  addProduct (prod): Observable<any> {
   // console.log(art);
    return this.http.post<any>(endpoint , JSON.stringify(prod), httpOptions).pipe(
      tap((prod) => console.log(`added Product w/ id=${prod._id}`)),
      catchError(this.handleError<any>('addPodcut problem'))
    );
  }

  deleteProduct (id): Observable<any> {
    return this.http.delete<any>(endpoint + id, httpOptions).pipe(
      tap(_ => console.log(`deleted product id=${id}`)),
      catchError(this.handleError<any>('deletePeoduct problem'))
    );
  }

  UpdateProduct (id,prod): Observable<any> {
    console.log(prod);
    return this.http.put<any>(endpoint+id , JSON.stringify(prod), httpOptions).pipe(
      tap((prod) => console.log(`updated product w/ id=${prod._id}`)),
      catchError(this.handleError<any>('UpdateProduct problem'))
    );
  }
  

private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    console.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
