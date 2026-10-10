export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  gender: "male" | "female";
  role: "user" | "admin";
}