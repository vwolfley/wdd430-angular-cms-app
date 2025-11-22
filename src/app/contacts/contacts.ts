import { Component, OnInit, effect } from '@angular/core';

import { Contact } from '../contacts/contact.model';
import { ContactsService } from './contacts.service';

@Component({
  selector: 'cms-contacts',
  standalone: false,
  templateUrl: './contacts.html',
  styleUrl: './contacts.css'
})
export class Contacts implements OnInit {
  selectedContact!: Contact;

  constructor(private contactsService: ContactsService) {
    effect(() => {
      const contactList = this.contactsService.contactListChangedEvent();
      if (contactList.length > 0) {
        this.selectedContact = contactList[0];
      }
    });
  }

  ngOnInit() {
    // Initial load happens in constructor effect
  }
}
