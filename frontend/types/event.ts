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
