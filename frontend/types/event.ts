export interface IUser {
  _id: string;
  username: string;
}

export interface IEvent {
  _id: string;
  name: string;
  owner: string;
  users: string[];
  pairs: { giver: string; receiver: string }[];
  date: string;
  joinLink: string;
  linkActive: boolean;
  locked: boolean;
}

export interface IEventWithOwner
  extends Omit<IEvent, "owner" | "users" | "pairs"> {
  owner: IUser;
  users: IUser[];
  pairs: { giver: IUser; receiver: IUser }[];
  isOwner: boolean;
}
