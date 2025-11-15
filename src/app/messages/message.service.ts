import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Message } from './message.model';
// import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number = 0;

  // Firebase endpoint URL
  private messagesUrl =
    'https://wdd430-angular-cms-project-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }

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

  // getMessages(): Message[] {
  //   return this.messages.slice();
  // }

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
      },
    });
  }

  getMessage(id: string): Message | null {
    return this.messages.find((message) => message.id === id) || null;
  }

  addMessage(message: Message): void {
    this.messages.push(message);
    // this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  storeMessages() {
    const messagesJson = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Send PUT request to Firebase to update the messages list
    this.http.put(this.messagesUrl, messagesJson, { headers }).subscribe(() => {
      this.messageChangedEvent.next([...this.messages]);
    });
  }
}
