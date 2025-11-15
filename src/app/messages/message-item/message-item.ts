import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactsService } from '../../contacts/contacts.service';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.html',
  styleUrl: './message-item.css'
})
export class MessageItem implements OnInit{
  @Input() message!: Message;
  messageSender: string = '';

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
    const contact: Contact | null = this.contactsService.getContact(this.message.sender);
    this.messageSender = contact ? contact.name : 'Unknown' ;
  }

}
