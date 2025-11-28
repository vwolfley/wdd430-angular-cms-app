import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number = 0;

  // Firebase endpoint URL
  private documentsUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    // this.maxDocumentId = this.getMaxId();
    this.documents = this.documents;
    // this.getDocuments();
  }

  // getDocuments(): Document[] {
  //   return this.documents.slice();
  // }

  getDocuments() {
    this.http.get<Document[]>(this.documentsUrl).subscribe({
      // SUCCESS method
      next: (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();

        // Sort by name
        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.documentListChangedEvent.next(this.documents.slice());
      },
      // ERROR method
      error: (error: any) => {
        console.error('Error fetching documents:', error);
      },
      complete: () => {
        console.log('Document fetch complete');
      },
    });
  }

  getDocument(id: string): Document | null {
    return this.documents.find((document) => document.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  // Add a new document
  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    // make sure id of the new Document is empty
    newDocument.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; document: Document }>(this.documentsUrl, newDocument, {
        headers: headers,
      })
      .subscribe((responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }
  // Update an existing document
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(`${this.documentsUrl}/` + originalDocument.id, newDocument, {
        headers: headers,
      })
      .subscribe((response) => {
        this.documents[pos] = newDocument;
        // this.sortAndSend();
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.findIndex((d) => d.id === document.id);
    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete(`${this.documentsUrl}/` + document.id).subscribe((response) => {
      this.documents.splice(pos, 1);
      // this.sortAndSend();
    });
  }

  storeDocuments() {
    const documentsJson = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Send PUT request to Firebase to update the documents list
    this.http.put(this.documentsUrl, documentsJson, { headers }).subscribe(() => {
      this.documentListChangedEvent.next([...this.documents]);
    });
  }
}
