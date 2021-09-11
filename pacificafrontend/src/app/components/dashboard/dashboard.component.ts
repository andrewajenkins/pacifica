import { Component, OnInit } from '@angular/core';
import {Report} from "../../models/report.model";
import {DatePipe} from "@angular/common";
import {ReportService} from "../../services/report.service";
import * as d3 from 'd3';
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
    "ipp", "quarterly"//, "annual"
  ]
  filteredIPPs: string[];
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
    // this.filterIPPs();
    this.setupDashboardTableData();
  }

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
  }

  onClientSelectChange($event: string) {
    // console.log("client selected:", $event);
    this.selected = $event;
    // console.log("changed selected:", this.selected);
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

  private filterABCs() {
    this.dataSource = this.allData.filter((report: Report) => {
        if(this.selected === 'All') return true;
        return report.client === this.selected
      });
  }

  private setupDashboardTableData() {
    // filter ipps by client
    // console.log("setup start:", this.dataSource);
    this.dataSource = this.allData.filter((report: Report) => {
        // console.log("selected:", this.selected);
        if(this.selected === 'All' || !this.selected)
          return true;
        return report.client === this.selected;
    }).filter(this.onlyUnique).sort();
    // get ipp count
    let ippCounts: {
      [key: string]: number,
    } = {};
    // console.log("setup:", this.dataSource);
    function getIpp(ippStr: string) {
      if(ippStr && ippStr.includes("Outcome"))
        return ippStr;
      else
        return "Other";
    }
    this.dataSource.forEach((d: Report) => {
      let ipp: string = d.ipp!;
      // console.log('forEach:', ipp);
      let ippCategory = getIpp(ipp);
      if(ippCounts.hasOwnProperty(ippCategory)) {
        // console.log("increment:", ippCategory);
        ippCounts[ippCategory]++;
      } else {
        // console.log("init:", ippCategory);
        ippCounts[ippCategory] = 1;
      }
    });
    // console.log("ippCounts:", ippCounts);
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
    // console.log("result:", newDataSource);
    this.dataSource = newDataSource;
  }

  private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(data.map(d => d.Framework))
    .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 200000])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.Framework))
    .attr("y", d => y(d.Stars))
    .attr("width", x.bandwidth())
    .attr("height", (d) => this.height - y(d.Stars))
    .attr("fill", "#d04a35");
  }
}
