import { Component, OnInit, computed } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Contact } from '../contact.model';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit {
  contactId: string = '';
  term: string = '';

  constructor(public contactsService: ContactsService) {}

  // Use computed to expose contacts as a signal
  contacts = computed(() => this.contactsService.contactListChangedEvent());

  ngOnInit() {
    this.contactsService.getContacts();
  }

  onDrop(event: CdkDragDrop<Contact[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.contacts(), event.previousIndex, event.currentIndex);
    }
  }
  search(value: string) {
    this.term = value;
  }
}
