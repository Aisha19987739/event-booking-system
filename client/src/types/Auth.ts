export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: 'user' | 'organizer' | 'admin';
}
