import {Component, Input, OnInit} from '@angular/core';
import * as d3 from "d3";
import {GraphService} from "../../../services/graph.service";

@Component({
  selector: 'client-timeline',
  templateUrl: './client-timeline.component.html',
  styleUrls: ['./client-timeline.component.scss']
})
export class ClientTimelineComponent implements OnInit {

  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  @Input() dataSource: any;
  @Input() client: string;
  @Input() title: string = "DEFAULT CLIENT TIMELINE TITLE";
  @Input() id: string = "DEFAULT COMPONENT ID";

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
    this.svg = d3.select("figure#"+this.id)
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
}
