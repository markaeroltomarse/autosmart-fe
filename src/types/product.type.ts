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
  createdAt: string;
  updatedAt?: string;
}
