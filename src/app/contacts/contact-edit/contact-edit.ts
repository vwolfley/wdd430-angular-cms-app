import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
  editMode: boolean = false;
  // id: string;

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
    const newContact = new Contact(value.id, value.name, value.email, value.phone, value.imageUrl);
    // check if we are in edit mode
    if (this.editMode === true) {
      this.contactsService.updateContact(this.originalContact!, newContact);
    } else {
      this.contactsService.addContact(newContact);
    }
    // navigate back to the main contacts view
    this.router.navigate(['/contacts']);
  }
}
