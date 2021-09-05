import { Component, OnInit } from '@angular/core';
import {ReportService} from "../../services/report.service";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  private FileSaver: any;

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
  }

  archiveClick(value: string) {
    this.reportService.archiveReports(parseInt(value))
      .subscribe(data => this.downloadFile(data))
  }

  downloadFile(data: Blob) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }
}
