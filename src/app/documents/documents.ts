import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Document } from '../documents/document.model';
import { DocumentsService } from '../documents/documents.service';

@Component({
  selector: 'cms-documents',
  standalone: false,
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit, OnDestroy {
  selectedDocument!: Document;
  private docChangeSub!: Subscription;

  constructor(private documentsService: DocumentsService) {}

  ngOnInit() {
    this.docChangeSub = this.documentsService.documentListChangedEvent.subscribe(
      (documentList: Document[]) => {
        this.selectedDocument = documentList[0];
      }
    );
  }

  ngOnDestroy() {
    this.docChangeSub.unsubscribe();
  }
}
