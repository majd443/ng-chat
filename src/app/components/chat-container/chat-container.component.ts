import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { IChatRoom, IMessage, User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { AddRoomComponent } from '../add-room/add-room.component';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss'],
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  private userId: string = '';
  private subscription: Subscription = new Subscription();
  public rooms$: Observable<Array<IChatRoom>>;
  public messages$: Observable<Array<IMessage>>;

  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.rooms$ = chatService.getRooms();

    const roomId: string = activatedRoute.snapshot.url[1].path;

    this.messages$ = chatService.getRoomMessages(roomId);
    console.log('room id', roomId);

    this.subscription.add(
      router.events
        .pipe(filter((data) => data instanceof NavigationEnd))
        .subscribe((data) => {
          const routeEvent: RouterEvent = data as RouterEvent;
          const urlArr = routeEvent.url.split('/');
          if (urlArr.length > 2) {
            this.messages$ = this.chatService.getRoomMessages(urlArr[2]);
          }
        })
    );
  }

  ngOnInit(): void {
    this.subscription.add(
      this.auth
        .getUserData()
        .pipe(filter((data) => !!data))
        .subscribe((user) => {
          this.userId = user.uid;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openAddRoomModal(): void {
    const dialogRef = this.dialog.open(AddRoomComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      this.onAddRoom(result, this.userId);
    });
  }

  public onAddRoom(roomName: string, userId: string) {
    this.chatService.addRoom(roomName, userId);
  }
}
