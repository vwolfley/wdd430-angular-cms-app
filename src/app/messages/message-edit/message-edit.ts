import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { ContactsService } from '../../contacts/contacts.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css',
})
export class MessageEdit {
  @ViewChild('subject') subjectInput!: ElementRef;
  @ViewChild('msgText') msgTextInput!: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: string = '66';

  constructor(private messageService: MessageService, private contactsService: ContactsService) {}

  onSendMessage() {
    const subject = this.subjectInput.nativeElement.value;
    const msgText = this.msgTextInput.nativeElement.value;

    // console.log(this.contactsService.getContact());

    const currentUser = this.contactsService.getContact('66'); // your custom id
    // console.log(currentUser);
    if (currentUser && currentUser._id) {
      this.currentSender = currentUser._id; // <-- Contact id
    }
    // Create a new Message object
    const newMessage = new Message('1', subject, msgText, this.currentSender);
    // console.log(newMessage);

    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear() {
    // Clear the input fields
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }
}
