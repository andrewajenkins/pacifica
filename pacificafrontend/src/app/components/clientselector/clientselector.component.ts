import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-clientselector',
  templateUrl: './clientselector.component.html',
  styleUrls: ['./clientselector.component.scss']
})
export class ClientselectorComponent implements OnInit {

  @Input() clients: string[] = [];
  @Output() clientSelectedOutput = new EventEmitter<string>();
  set selected(value: any) {
    this.clientSelectedOutput.emit(value);
  }
  constructor() { }

  clientSelected(event: string | undefined) {
    this.clientSelectedOutput.emit(event);
  }

  ngOnInit(): void {
  }

}
