import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number = 0;

  // Firebase endpoint URL
  private messagesUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {}

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }
  // Fetch messages from the backend
  getMessages() {
    this.http.get<Message[]>(this.messagesUrl).subscribe({
      // SUCCESS method
      next: (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();

        this.messageChangedEvent.next(this.messages.slice());
      },
      // ERROR method
      error: (error: any) => {
        console.error('Error fetching messages:', error);
      },
      complete: () => {
        console.log('Message fetch complete');
        console.log(this.messages);
      },
    });
  }

  getMessage(id: string): Message | null {
    return this.messages.find((message) => message.id === id) || null;
  }

  // Add a new message
  addMessage(newMessage: Message): void {
    if (!newMessage) {
      return;
    }
    // make sure id of the new Message is empty
    newMessage.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; messageData: Message }>(this.messagesUrl, newMessage, {
        headers: headers,
      })
      .subscribe((responseData) => {
        console.log(responseData);
        this.messages.push(responseData.messageData);
        this.messageChangedEvent.next(this.messages.slice());
      });
  }

  // storeMessages() {
  //   const messagesJson = JSON.stringify(this.messages);
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   // Send PUT request to Firebase to update the messages list
  //   this.http.put(this.messagesUrl, messagesJson, { headers }).subscribe(() => {
  //     this.messageChangedEvent.next([...this.messages]);
  //   });
  // }
}
