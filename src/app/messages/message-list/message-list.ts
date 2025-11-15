import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList implements OnInit, OnDestroy {
  messages: Message[] = [];
  private messageChangeSub!: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Get the initial list of messages
    this.messageService.getMessages();
    // Subscribe to message changes
    this.messageChangeSub = this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }

  ngOnDestroy() {
    this.messageChangeSub.unsubscribe();
  }
}
