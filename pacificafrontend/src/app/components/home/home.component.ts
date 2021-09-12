import { Component, OnInit } from '@angular/core';
import {ReportService} from "../../services/report.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {
    // this.reportService.triggerDataUpdate().subscribe(k=>console.log("finished loading data"));
  }
}
