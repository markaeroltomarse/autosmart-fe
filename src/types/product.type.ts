import { ICustomerType } from './customer.type';
import { IRider } from './rider.type';

export interface IProductType {
  id: string;
  name: string;
  brandName: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  discount: number;
  imgURL?: string;
  color: string;
  contactOptions: string;
  description: string;
  application: string;
  productType: string;
  createdAt: string;
  updatedAt?: string;
  images: string[];
  thumbnail?: string;
}

export type ITransactionType = {
  id: string;
  status: string | null;
  serialNumber: string;
  totalAmount: number;
  customerId: string;
  products: IProductType[];
  rider: IRider | null;
  customer: ICustomerType | null;
  riderId: string;
  createdAt: Date | null;
};
