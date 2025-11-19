export class Tag {
  constructor(
    public id: string,
    public name: string,
    public color: string | null,
    public createdAt: Date,
    public userId: string,
  ) {}
}
