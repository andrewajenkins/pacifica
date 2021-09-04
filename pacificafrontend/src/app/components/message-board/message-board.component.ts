import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MessageService} from "../../services/message.service";
import {Message} from "../../models/message.model";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {take} from "rxjs/operators";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.scss']
})
export class MessageBoardComponent implements OnInit {

  messages: Message[] = [];
  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;

  constructor(
    private _ngZone: NgZone,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.messageService.getAllMessages().subscribe((resp: any) => {
      console.log("messages:", resp);
      this.messages = resp;
    })
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize!.resizeToFitContent(true));
  }

  onSubmit(value: string) {
    const message: Message = new Message();
    message.message = value;
    message.user = JSON.parse(this.tokenStorageService.getUser()).username;
    this.messageService.postMessage(message).subscribe();
    window.location.reload();
  }

  onDelete(id: number) {
    this.messageService.deleteMessage(id).subscribe();
    window.location.reload();
  }
}
