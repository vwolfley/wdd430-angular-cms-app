import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Document } from '../document.model';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'cms-document-edit',
  standalone: false,
  templateUrl: './document-edit.html',
  styleUrl: './document-edit.css',
})
export class DocumentEdit implements OnInit{
  @ViewChild('f') documentForm!: NgForm;

  originalDocument!: Document | null;
  document: Document = new Document('', '', '', '', []);
  editMode: boolean = false;

  constructor(
    private documentsService: DocumentsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];

      if (!id) {
        this.editMode = false;
        return;
      }

      this.originalDocument = this.documentsService.getDocument(id);

      if (!this.originalDocument) {
        return;
      }

      this.editMode = true;

      // Create a deep clone of the document
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }

  onSubmit(form: NgForm) {
    // get values from the form
    const value = form.value;

    // create a new Document object using the form values
    const newDocument = new Document(value.id, value.name, value.description, value.url);

    // check if we are in edit mode
    if (this.editMode === true) {
      this.documentsService.updateDocument(this.originalDocument!, newDocument);
    } else {
      this.documentsService.addDocument(newDocument);
    }

    // navigate back to the main documents view
    this.router.navigate(['/documents']);
  }
}
