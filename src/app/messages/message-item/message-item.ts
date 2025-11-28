import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactsService } from '../../contacts/contacts.service';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.html',
  styleUrl: './message-item.css',
})
export class MessageItem implements OnInit {
  @Input() message!: Message;
  messageSender: string = '';

  constructor(private contactsService: ContactsService) {}

  ngOnInit(): void {
    if (!this.message || !this.message.sender) {
      this.messageSender = 'Error - could not find user';
      return;
    }
    // Check if sender is already a Contact object (from server with .populate())
    if (typeof this.message.sender === 'object') {
      const sender = this.message.sender as Contact;
      this.messageSender = sender.name;
    } else {
      // sender is a string ID, look it up in ContactService
      const contact: Contact | null = this.contactsService.getContact(this.message.sender);
      if (contact) {
        this.messageSender = contact.name;
      } else {
        this.messageSender = 'Error - could not find user';
      }
    }
  }
}
