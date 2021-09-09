import { Component, OnInit } from '@angular/core';
import {Report} from "../../models/report.model";
import {DatePipe} from "@angular/common";
import {ReportService} from "../../services/report.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  clients: string[] = [];
  allData: Report[];
  dataSource: Report[];
  private content: string;

  columnsToDisplay: string [] = [
    "ipp", "quarterly"//, "annual"
  ]
  filteredIPPs: string[];
  private selected: string;

  constructor(private reportService: ReportService) {
    let foundData = localStorage.getItem('abcData');
    if(foundData) {
      this.initializeData(JSON.parse(foundData));
    } else {
      this.reportService.getAllABCs().subscribe(
        (data: Report[]) => {
          data.forEach((k: Report) => {
            k.timestamp = new DatePipe('en-US').transform(k.timestamp, "M/d/yy h:mm a")!
            return;
          })
          localStorage.setItem('abcData', JSON.stringify(data));
          this.initializeData(data);
        },
        err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }
  }

  initializeData(data: Report[]) {
    this.allData = data;
    this.dataSource = data;
    this.content = JSON.stringify(data);
    this.setClientOptions();
    // this.filterIPPs();
    this.setupDashboardTableData();
  }

  ngOnInit(): void {

  }

  onClientSelectChange($event: string) {
    console.log("client selected:", $event);
    this.selected = $event;
    console.log("changed selected:", this.selected);
    this.filterABCs()
    this.initializeData(this.allData);
  }

  onlyUnique(value: any, index: any, self: string | any[]) {
    return self.indexOf(value) === index;
  }

  setClientOptions() {
    let clientList = this.allData.map((d: Report) => d?.client!).filter(this.onlyUnique);
    this.clients = ['All'].concat(this.allData.map((d: Report) => d?.client!).filter(this.onlyUnique));
  }

  private filterIPPs() {
    console.log("this.allData:", this.allData)
    this.filteredIPPs = this.allData.filter(r => {
      if(this.selected === 'All') return true;
      return r.client === this.selected
    }).map(k => k.ipp!).filter(ipp => ipp?.indexOf("Outcome") !== -1)
    .filter(this.onlyUnique).concat(['Other'])
    .sort();
    console.log("filteredIPPs:", this.filteredIPPs)
  }

  private filterABCs() {
    this.dataSource = this.allData.filter((report: Report) => {
        if(this.selected === 'All') return true;
        return report.client === this.selected
      });
  }

  private setupDashboardTableData() {
    // filter ipps by client
    console.log("setup start:", this.dataSource);
    this.dataSource = this.allData.filter((report: Report) => {
        console.log("selected:", this.selected);
        if(this.selected === 'All' || !this.selected)
          return true;
        return report.client === this.selected;
    }).filter(this.onlyUnique).sort();
    // get ipp count
    let ippCounts: {
      [key: string]: number,
    } = {};
    console.log("setup:", this.dataSource);
    function getIpp(ippStr: string) {
      if(ippStr && ippStr.includes("Outcome"))
        return ippStr;
      else
        return "Other";
    }
    this.dataSource.forEach((d: Report) => {
      let ipp: string = d.ipp!;
      console.log('forEach:', ipp);
      let ippCategory = getIpp(ipp);
      if(ippCounts.hasOwnProperty(ippCategory)) {
        console.log("increment:", ippCategory);
        ippCounts[ippCategory]++;
      } else {
        console.log("init:", ippCategory);
        ippCounts[ippCategory] = 1;
      }
    });
    console.log("ippCounts:", ippCounts);
    interface IppQuarterlyCount {
      ipp: string,
      quarterly: number
    }
    let newDataSource: IppQuarterlyCount[] = [];//{[key: string]: number|string}[] = [];
    Object.keys(ippCounts).forEach(k => {
      newDataSource.push({ipp: k, quarterly: ippCounts[k]});
    })
    newDataSource.sort(function (a, b) {
      // if(typeof a.ipp == 'string' && a.ipp.includes("Other")) return -1;
      if(a.ipp > b.ipp) return 1;
      if(b.ipp > a.ipp) return -1;
      return 0;
    });
    let otherElement: IppQuarterlyCount = newDataSource.shift()!;
    newDataSource.push(otherElement!);
    console.log("result:", newDataSource);
    this.dataSource = newDataSource;
  }
}
