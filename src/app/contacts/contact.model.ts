// contact.model.ts

export class Contact {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public imageUrl: string,
    public group: Contact[] | null = null,
    public _id?: string
  ) {}
}
