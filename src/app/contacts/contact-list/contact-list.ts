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

  constructor(private contactsService: ContactsService) {}

  // Use computed to expose contacts as a signal
  contacts = computed(() => this.contactsService.contactListChangedEvent());

  ngOnInit() {
    this.contactsService.getContacts();
  }

  onDrop(event: CdkDragDrop<Contact[]>) {
    if (event.previousContainer === event.container) {
      const updatedContacts = [...this.contacts()];
      moveItemInArray(updatedContacts, event.previousIndex, event.currentIndex);
      // Note: Drag and drop reordering is a UI-only operation
      // If persistence is needed, add a method in the service to update the order
    }
  }
  search(value: string) {
    this.term = value;
  }
}
