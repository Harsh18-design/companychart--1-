import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CompanyChartComponent } from './company-chart/company-chart.component';
import { Chart } from 'chart.js';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { registerables
 } from 'chart.js';
import { CompanyService } from './company.service';
 Chart.register(...registerables)

@NgModule({
  declarations: [
    AppComponent,
    CompanyChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CompanyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
