export interface ICustomerType {
  id: string;
  email: string;
  password: string;
  fname: string | null;
  lname: string | null;
  gender: string | null;
  address: string[];
  defaultAddress: string | null;
  profileImage: string | null;
  contactNumber: string | null;
  isRider: boolean;
  isVerified: boolean;
}
