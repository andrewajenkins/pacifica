import { Component, OnInit } from '@angular/core';
import {Report} from "../../models/report.model";
import {DatePipe} from "@angular/common";
import {ReportService} from "../../services/report.service";
import {GraphService} from "../../services/graph.service";
import {Observable} from "rxjs";


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
  allABCs$: Observable<Report[]>;

  columnsToDisplay: string [] = [
    "ipp", "quarterly"
  ]
  selected: string;

  constructor(private reportService: ReportService, private dataService: GraphService) {
    let foundData = localStorage.getItem('abcData');
    if(foundData) {
      this.initializeData(JSON.parse(foundData));
    } else {
      this.allABCs$ = this.reportService.getAllABCs()

      this.allABCs$.subscribe(
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
    this.setupDashboardTableData();
  }

  ngOnInit(): void {}

  onClientSelectChange($event: string) {
    this.selected = $event;
    this.filterABCs()
    this.initializeData(this.allData);
  }

  onlyUnique(value: any, index: any, self: string | any[]) {
    return self.indexOf(value) === index;
  }

  setClientOptions() {
    this.clients = ['All'].concat(this.allData.map((d: Report) => d?.client!).filter(this.onlyUnique));
  }

  private filterABCs() {
    this.dataSource = this.allData.filter((report: Report) => {
        if(this.selected === 'All') return true;
        return report.client === this.selected
      });
  }

  private setupDashboardTableData() {
    this.dataSource = this.allData.filter((report: Report) => {
        if(this.selected === 'All' || !this.selected)
          return true;
        return report.client === this.selected;
    }).filter(this.onlyUnique).sort();
    // get ipp count
    let ippCounts: {
      [key: string]: number,
    } = {};
    function getIpp(ippStr: string) {
      if(ippStr && ippStr.includes("Outcome"))
        return ippStr;
      else
        return "Other";
    }
    this.dataSource.forEach((d: Report) => {
      let ipp: string = d.ipp!;
      let ippCategory = getIpp(ipp);
      if(ippCounts.hasOwnProperty(ippCategory)) {
        ippCounts[ippCategory]++;
      } else {
        ippCounts[ippCategory] = 1;
      }
    });
    interface IppQuarterlyCount {
      ipp: string,
      quarterly: number
    }
    let newDataSource: IppQuarterlyCount[] = [];
    Object.keys(ippCounts).forEach(k => {
      newDataSource.push({ipp: k, quarterly: ippCounts[k]});
    })
    newDataSource.sort(function (a, b) {
      if(a.ipp > b.ipp) return 1;
      if(b.ipp > a.ipp) return -1;
      return 0;
    });
    let otherElement: IppQuarterlyCount = newDataSource.shift()!;
    newDataSource.push(otherElement!);
    this.dataSource = newDataSource;
  }
}
