export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
}

export type AddressRequest = Omit<Address, 'id'>;

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  addressCount: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
}

export interface UserRequest {
  email: string;
  firstName: string;
  lastName: string;
}
