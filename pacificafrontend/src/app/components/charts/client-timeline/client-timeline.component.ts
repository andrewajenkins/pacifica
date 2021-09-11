import {Component, Input, OnInit} from '@angular/core';
import * as d3 from "d3";
import {GraphService} from "../../../services/graph.service";

@Component({
  selector: 'client-timeline',
  templateUrl: './client-timeline.component.html',
  styleUrls: ['./client-timeline.component.scss']
})
export class ClientTimelineComponent implements OnInit {

  private data = [
    // {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    // {"Framework": "React", "Stars": "150793", "Released": "2013"},
    // {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    // {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    // {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
    {timestamp: "9/3/21 8:51 PM", client: "Hunter", ipp: "sittintg on couch and started mumbling under his breathe "},
    {timestamp: "9/4/21 8:41 PM", client: "Hunter", ipp: "went into bathroom. in bathroom for 10-15 mins "},
    {timestamp: "9/5/21 10:11 AM", client: "Hunter", ipp: "Trying to prompt him to take his meds, put on a shirt and get dressed"},
    {timestamp: "9/6/21 10:03 AM", client: "Hunter", ipp: "Came out of his room and Hunter was having breakfa…would have to wait for snack time which was soon."},
    {timestamp: "9/6/21 8:43 PM", client: "Hunter", ipp: "One staff called out sick. Katie was alone with cl…use meeting, took break 20 min, then passed meds."}
  ];
  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  @Input() dataSource: any;
  @Input() client: string;

  constructor(private graphService: GraphService) {}

  ngOnInit(): void {
  }

  ngOnChanges(changes) {
    if (changes.dataSource) {
      console.log("this.dataSource changed child:", this.dataSource);
      this.dataSource = changes.dataSource.currentValue;
    }
    if (changes.client) {
      console.log("client changed child:", changes.client);
      this.client = changes.client.currentValue;
      this.graphService.getClientABCTimeline(this.client).subscribe((response: any[]) => {
        console.log("graph response:", response);
        this.createSvg();
        this.drawBars(response);
      })
    }
  }

  private createSvg(): void {
    this.svg = d3.select("figure#client-timeline")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    console.log("domain:", data.map(entry => entry.timestamp))
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(entry => entry.timestamp))
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
      .domain([0, Math.max(...data.map(k => k.count)) + 1])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.timestamp))
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => this.height - y(d.count))
      .attr("fill", "#d04a35");
  }

  private generateGraphData(data) {
    // let today = new Date()
    // let priorDate = new Date().setDate(today.getDate()-90)
    // let dateData = data.filter(t => {
    //   console.log("priorDate:", new Date(priorDate), "GT", new Date(Date.parse(t.timestamp))+(Date.parse(t.timestamp) > priorDate ? "Include" : "Reject"));
    //   return Date.parse(t.timestamp) > priorDate;
    // }).map(r => {
    //   // let dateString = new DatePipe('en-US').transform(r.timestamp, "y-M-d")!
    //   return {date: Date.parse(r.timestamp), ...r};
    // })
    // console.log("dateData:", dateData);
    // let weekCount: {[date: string]: number} = {};
    // for(let i = 0; i < 13; i++) {
    //   weekCount[new Date().setDate(today.getDate()-(i*7))] = 0;
    // }
    // // let dateCount: {[date: string]: number} = {};
    // dateData.forEach(s => {
    //   for(let i = Object.keys(weekCount).length; i > 0; i--) {
    //     console.log("sys time:", Object.keys(weekCount)[i]);
    //     console.log("timestamp:", new Date(Object.keys(weekCount)[i]));
    //     console.log("test:", 1)
    //     if(s.date > weekCount[Object.keys(weekCount)[i]]) {
    //       console.log("incrementing week:", new Date(Object.keys(weekCount)[i]).getDate(), "date:", new Date(s.date).getDate());
    //       weekCount[Object.keys(weekCount)[i]]++;
    //       continue;
    //     } else {
    //       console.log("skipping week");
    //     }
    //   }
    //   // if(dateCount.hasOwnProperty(s.date)) {
    //   //   dateCount[s.date] = dateCount[s.date] + 1;
    //   // } else {
    //   //   dateCount[s.date] = 1;
    //   // }
    // });
    // console.log("weekCount:", weekCount);
    // // parse dates
    // // count based on date (week)
    // // return [{[week: Date]: count:number}]
  }

}
