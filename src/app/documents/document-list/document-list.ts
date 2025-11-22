import { Component, OnInit, computed } from '@angular/core';

import { Document } from '../document.model';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList implements OnInit {
  documentId: string = '';

  constructor(private documentsService: DocumentsService) {}

  // Use computed to expose documents as a signal
  documents = computed(() => this.documentsService.documentListChangedEvent());

  ngOnInit() {
    this.documentsService.getDocuments();
  }
}
