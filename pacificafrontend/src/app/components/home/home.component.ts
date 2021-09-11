import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {ReportService} from "../../services/report.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {
    this.reportService.triggerDataUpdate().subscribe(k=>console.log("finished loading data"));
  }
}
