import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }
  getCompanies(){
    return this.http.get('assets/companies.json').toPromise();
  }

  getMaterials(){
    return this.http.get('assets/materials.json').toPromise();
  }
  recycling2020(){
    return this.http.get('assets/recycling2020.json').toPromise();
  }
  recycling2021(){
    return this.http.get('assets/recycling2021.json').toPromise();
  }
}