import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Contact } from './contact.model';
// import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts = signal<Contact[]>([]);
  contactListChangedEvent = this.contacts.asReadonly();
  maxContactId: number = 0;

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  // Firebase endpoint URL
  private contactsUrl =
    'https://wdd430-angular-cms-project-default-rtdb.firebaseio.com/contacts.json';

  // getContacts(): Contact[] {
  //   return this.contacts.slice();
  // }

  getContacts() {
    this.http.get<Contact[]>(this.contactsUrl).subscribe({
      // SUCCESS method
      next: (contacts: Contact[]) => {
        this.maxContactId = this.getMaxId();

        // Sort by name
        const sortedContacts = contacts.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.contacts.set(sortedContacts);
      },
      // ERROR method
      error: (error: any) => {
        console.error('Error fetching contacts:', error);
      },
      complete: () => {
        console.log('Contact fetch complete');
      },
    });
  }

  getContact(id: string): Contact | null {
    return this.contacts().find((contact) => contact.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts()) {
      const currentId = Number(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    this.contacts.update(contacts => [...contacts, newContact]);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const contactsList = this.contacts();
    const pos = contactsList.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts.update(contacts => {
      const updated = [...contacts];
      updated[pos] = newContact;
      return updated;
    });

    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const contactsList = this.contacts();
    const pos = contactsList.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.update(contacts => {
      const updated = [...contacts];
      updated.splice(pos, 1);
      return updated;
    });
    this.storeContacts();
  }

  storeContacts() {
    const contactsJson = JSON.stringify(this.contacts());
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Send PUT request to Firebase to update the contacts list
    this.http.put(this.contactsUrl, contactsJson, { headers }).subscribe(() => {
      // Signal will automatically notify subscribers
    });
  }
}
