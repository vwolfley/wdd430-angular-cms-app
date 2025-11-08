import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Contact } from '../contact.model';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.html',
  styleUrl: './contact-edit.css',
})
export class ContactEdit implements OnInit {
  @ViewChild('f') documentForm!: NgForm;

  originalContact!: Contact | null;
  contact: Contact = new Contact('', '', '', '', '', null);
  groupContacts: Contact[] = [];
  hasInvalidGroupContact: boolean = false;
  editMode: boolean = false;

  connectedDropLists: string[] = ['availableList', 'groupList'];

  constructor(
    private contactsService: ContactsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to route parameters
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];

      // No id? → We're creating a new contact
      if (!id) {
        this.editMode = false;
        return;
      }

      // Get the original contact by id
      this.originalContact = this.contactsService.getContact(id);

      // If no contact found, do nothing
      if (!this.originalContact) {
        return;
      }

      // We’re editing an existing contact
      this.editMode = true;

      // Clone the contact (to avoid directly modifying the original)
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      // If the contact has a group, clone that too
      if (this.contact.group) {
        this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
      }
    });
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onSubmit(form: NgForm) {
    // get values from the form
    const value = form.value;
    // create a new Contact object using the form values
    const newContact = new Contact(
      value.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl || '',
      this.groupContacts.length > 0 ? this.groupContacts : null
    );
    // check if we are in edit mode
    if (this.editMode === true) {
      this.contactsService.updateContact(this.originalContact!, newContact);
    } else {
      this.contactsService.addContact(newContact);
    }
    // navigate back to the main contacts view
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact) {
      return true; // newContact has no value
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true; // Check if it is the contact itself
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true; // Contact already exists in the groupContacts array
      }
    }
    return false; // Valid contact, not in the group
  }

  // Prevent duplicates from being dropped into the group
  canEnterGroup = (drag: any, drop: any): boolean => {
    const draggedContact: Contact = drag.data;
    // Make sure draggedContact exists before checking
    if (!draggedContact || !this.groupContacts) {
      return false;
    }

    // Only allow drop if the contact isn't already in the group
    const isDuplicate = this.groupContacts.some((c) => c.id === draggedContact.id);
    return !isDuplicate;
  };

  onGroupDrop(event: CdkDragDrop<Contact[]>) {
    const draggedContact = event.item.data as Contact;

    // Check for duplicates
    const invalidGroupContact = this.isInvalidContact(draggedContact);
    if (invalidGroupContact) {
      this.hasInvalidGroupContact = true;
      return;
    }

    this.hasInvalidGroupContact = false;

    // Add the contact to the group list if dropped from outside
    if (event.previousContainer !== event.container) {
      this.groupContacts.push(draggedContact);
    } else {
      // Reorder if dropped within the same container
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;
      this.groupContacts.splice(currentIndex, 0, this.groupContacts.splice(previousIndex, 1)[0]);
    }
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }
}
