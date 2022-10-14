import { Injectable } from '@angular/core';
import { IChatRoom } from '../models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private _db: AngularFirestore) {}

  /**
   * get rooms V
   * add room
   * get room messages
   * send message
   * delete room
   */

  public getRooms(): Observable<Array<IChatRoom>> {
    return this._db
      .collection('rooms')
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          return snaps.map((snap) => {
            const id = snap.payload.doc.id;
            const data: IChatRoom = <IChatRoom>snap.payload.doc.data();
            return <IChatRoom>{
              ...data,
              id,
            };
          });
        })
      );
  }
}
