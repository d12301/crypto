import { getLocaleDateFormat } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExchangeService } from './exchange.service';


export interface ExchangeValue {
  exchanges: any;
  tradeValue: any;
  value:any
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  dataSource: MatTableDataSource<ExchangeValue>;
  displayedColumns: string[] = ['exchangeCu', 'trade'];
  len: any;
  p = 0;
  count: number = 10;
  isShowDiv = false;

  exchangeArray: any[] = [];
  Exchange: ExchangeValue[] = [];
  arrayImage: any[] = [];


  constructor(private service: ExchangeService) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('pagination', { static: true, read: MatPaginator }) paginator: MatPaginator;

  ngOnInit(): void {
    this.getDataFrom()
  }


  getDataFrom() {
    this.service.apiCall().subscribe((data: any) => {
      console.log("api response ", data)

      let arrayValue = data;
      this.exchangeArray.push(...arrayValue);
      console.log(this.exchangeArray, "some data")
      this.len = this.exchangeArray.length

      if (this.len > 0) {
        for (let i = 1; i < this.len; i++) {
          if (this.exchangeArray[i].volume_1day_usd != 0 || this.exchangeArray[i].exchange_id!=this.exchangeArray[++i].exchange_id) {
            var ex = this.exchangeArray[i].exchange_id;
            var trade = this.exchangeArray[i].volume_1day_usd;
            this.p+=1
          }
          this.Exchange.push({
            value:this.p,
            exchanges: ex,
            tradeValue: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(trade/1000000000)+" "+"Billions"

          })

          this.dataSource = new MatTableDataSource(this.Exchange);
          this.dataSource.paginator = this.paginator;

        }

      }


    }, (error) => {
      console.log("error is", error)
    }
    )
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

   
  

  change() {
    this.isShowDiv = !this.isShowDiv;
  }

}



