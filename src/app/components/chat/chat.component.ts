import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IMessage } from 'src/app/models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('virtualScroll') virtualScroll?: CdkVirtualScrollViewport;
  @Output() onSendMessage: EventEmitter<string> = new EventEmitter();

  @Input() set messages(messages: Array<IMessage>) {
    this._messages = messages.sort((x, y) => {
      return x.timeStamp - y.timeStamp;
    });
    this.virtualScroll?.scrollToIndex(this._messages.length - 1)
  }

  get messages() {
    return this._messages;
  }

  private _messages: Array<IMessage> = [];
  constructor() {}

  ngOnInit(): void {
   
  }

  public sendMessage(message: string, input: HTMLInputElement): void {
    this.onSendMessage.emit(message);
    input.value = '';
  }
}
