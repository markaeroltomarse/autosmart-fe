export interface IRider {
  id: string;
  email: string;
  password: string;
  fname?: string;
  lname?: string;
  address: string[];

  createdAt?: Date;
  updatedAt?: Date;
}
