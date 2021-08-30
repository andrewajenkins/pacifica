import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Report} from "../../models/report.model";

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  reportId: any = 1;
  data: any = {};
  header: any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let foundData = JSON.parse(localStorage.getItem('abcData')!)
    if(!foundData) this.router.navigate(['/login']);
    this.reportId = this.route.snapshot.paramMap.get('id');
    this.data = foundData![this.reportId];
    this.header = Object.keys(this.data);
  }
}
