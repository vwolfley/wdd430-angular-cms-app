// message.model.ts
import { Contact } from '../contacts/contact.model';

export class Message {
  constructor(
    public id: string,
    public subject: string,
    public msgText: string,
    public sender: Contact | string
  ) {}
}
