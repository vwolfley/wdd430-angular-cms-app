import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number = 0;

  constructor(private http: HttpClient) {
    this.getContacts();
    this.maxContactId = this.getMaxId();
  }

  // Firebase endpoint URL
  private contactsUrl = 'http://localhost:3000/contacts';

  // Fetch contacts from the server
  getContacts() {
    this.http.get<Contact[]>(this.contactsUrl).subscribe({
      // SUCCESS method
      next: (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();

        // Sort by name
        this.contacts.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.contactListChangedEvent.next(this.contacts.slice());
        console.log(this.contacts);
      },
      // ERROR method
      error: (error: any) => {
        console.error('Error fetching contacts:', error);
      },
      complete: () => {
        console.log('Contact fetch complete');
        console.log(this.contacts);
      },
    });
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((contact) => contact.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      const currentId = Number(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  // Add a new contact
  addContact(newContact: Contact) {
    if (!newContact) return;

    // make sure id of the new Contact is empty
    newContact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; contact: Contact }>(this.contactsUrl, newContact, {
        headers: headers,
      })
      .subscribe((responseData) => {
        // add new contact to contacts
        this.contacts.push(responseData.contact);
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  // Update an existing contact
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(`${this.contactsUrl}/` + originalContact.id, newContact, {
        headers: headers,
      })
      .subscribe((response) => {
        this.contacts[pos] = newContact;
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  // Delete a contact
  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    // delete from database
    this.http.delete(`${this.contactsUrl}/` + contact.id).subscribe((response) => {
      this.contacts.splice(pos, 1);
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }

  // storeContacts() {
  //   const contactsJson = JSON.stringify(this.contacts);
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   // Send PUT request to Firebase to update the contacts list
  //   this.http.put(this.contactsUrl, contactsJson, { headers }).subscribe(() => {
  //     this.contactListChangedEvent.next([...this.contacts]);
  //   });
  // }
}
