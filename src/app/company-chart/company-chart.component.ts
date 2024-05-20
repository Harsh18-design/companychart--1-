import { Component, OnInit } from '@angular/core';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip } from 'chart.js';
import { CompanyService } from '../company.service';
import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-chart',
  templateUrl: './company-chart.component.html',
  styleUrls: ['./company-chart.component.css']
})
export class CompanyChartComponent implements OnInit {
  year: any = [];
  companyData: any = [];
  materialData: any = [];
  recycle2020Data: any = [];
  recycle2021Data: any = [];
  recycleData: any = [];
  chartData: any=[];
  materials: any;
  year2020Data:any=[];
  year2021Data:any=[];
  companyFilter:any;
  companyName:any=[];
  companySelected:any='b7d8b259-c019-4e49-9be9-2f144cc31a7b';
  vChart: any;

  constructor(private data: CompanyService, private http: HttpClient) {
    Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip);
  }
  ngOnInit() {
    var p1=this.data.getCompanies();
    p1.then((data)=>{
      this.companyData=data;
    }
    );

    var p2=this.data.getMaterials();
    p2.then((data)=>{
      this.materialData=data;
    }
    );

    var p3=this.data.recycling2020();
    p3.then((data)=>{
      this.recycle2020Data=data;
    }
    );

    var p4=this.data.recycling2021();
    p4.then((data)=>{
      this.recycle2021Data=data;
    }
    );

    Promise.allSettled([p1,p2,p3,p4]).then(
      (data)=>
      {
         this.refreshChart(); 
      });
    }

    onCompanyChange(company:any){
    this.companySelected = company.value;
    this.refreshChart();
  }
  
  refreshChart() {
    this.year2020Data.splice(0, this.year2020Data.length);
    this.year2021Data.splice(0, this.year2021Data.length);
      this.recycleData= this.recycle2020Data.concat(this.recycle2021Data)
      this.recycleData.forEach((r:any)=>{
        let obj = this.materialData.find((m:any)=>m.MATERIALID === r.MATERALID)
        r.PROFIT=obj.COST*r.RECYCLED;
      });
      this.year = [...new Set(this.recycleData.map((y:any)=>y.YEAR))]
      this.chartData = [...new Set(this.recycleData)]
      this.materials = [...new Set(this.materialData.map((m:any)=>m.MATERIALNAME))]

      this.materialData.forEach((mt:any,mi:any)=>{
        //calculation for year 2020
        let filter2020 = this.recycleData.filter((r:any)=>r.MATERALID===mt.MATERIALID && r.YEAR===2020 && r.COMPANYID===this.companySelected).map((s:any)=>s.PROFIT)
        let sum2020 = filter2020.reduce((a:any,b:any)=>a+b,0)
        // calculation for year 2021
        let filter2021 = this.recycleData.filter((r:any)=>r.MATERALID===mt.MATERIALID && r.YEAR===2021 && r.COMPANYID===this.companySelected).map((s:any)=>s.PROFIT)
        let sum2021 = filter2021.reduce((a:any,b:any)=>a+b,0)
        
        this.year2020Data.push(sum2020) //for year 2020
        this.year2021Data.push(sum2021) //for year 2021
      })

      const ctx:any = document.getElementById('myChart');

      //destroy earlier chart
      if(this.vChart) this.vChart.destroy();

      this.vChart=new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.materials,
          datasets: [
            {
            label: this.year[0],
            data: this.year2020Data,
            borderWidth: 1
            },
            {
              label: this.year[1],
              data: this.year2021Data,
              borderWidth: 1
            },
        ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      
    }
}
