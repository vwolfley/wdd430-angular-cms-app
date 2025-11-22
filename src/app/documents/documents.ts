import { Component, OnInit, effect } from '@angular/core';

import { Document } from '../documents/document.model';
import { DocumentsService } from '../documents/documents.service';

@Component({
  selector: 'cms-documents',
  standalone: false,
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit {
  selectedDocument!: Document;

  constructor(private documentsService: DocumentsService) {
    effect(() => {
      const documentList = this.documentsService.documentListChangedEvent();
      if (documentList.length > 0) {
        this.selectedDocument = documentList[0];
      }
    });
  }

  ngOnInit() {
    // Initial load happens in constructor effect
  }
}
