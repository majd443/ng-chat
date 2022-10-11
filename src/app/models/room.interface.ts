import { IMessage } from './';

export interface IChatRoom {
  id: string;
  roomName: string;
  massages: Array<IMessage>;
  createdUserId: string;
}
