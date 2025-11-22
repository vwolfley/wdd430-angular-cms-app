import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Document } from './document.model';
// import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private documents = signal<Document[]>([]);
  documentListChangedEvent = this.documents.asReadonly();
  maxDocumentId: number = 0;

  // Firebase endpoint URL
  private documentsUrl =
    'https://wdd430-angular-cms-project-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  // getDocuments(): Document[] {
  //   return this.documents.slice();
  // }

  getDocuments() {
    this.http.get<Document[]>(this.documentsUrl).subscribe({
      // SUCCESS method
      next: (documents: Document[]) => {
        this.maxDocumentId = this.getMaxId();

        // Sort by name
        const sortedDocuments = documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.documents.set(sortedDocuments);
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
    return this.documents().find((document) => document.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents()) {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();

    this.documents.update(documents => [...documents, newDocument]);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const documentsList = this.documents();
    const pos = documentsList.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents.update(documents => {
      const updated = [...documents];
      updated[pos] = newDocument;
      return updated;
    });

    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const documentsList = this.documents();
    const pos = documentsList.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.update(documents => {
      const updated = [...documents];
      updated.splice(pos, 1);
      return updated;
    });
    this.storeDocuments();
  }

  storeDocuments() {
    const documentsJson = JSON.stringify(this.documents());
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Send PUT request to Firebase to update the documents list
    this.http.put(this.documentsUrl, documentsJson, { headers }).subscribe(() => {
      // Signal will automatically notify subscribers
    });
  }
}
