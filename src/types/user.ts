export interface User {
  id: number
  gender: 'male' | 'female'
  name: { title: string; first: string; last: string }
  location: { city: string; country: string }
  email: string
  phone: string
  picture: string
  dob: { date: string; age: number }
  hobbies: string[]
  details: string
}