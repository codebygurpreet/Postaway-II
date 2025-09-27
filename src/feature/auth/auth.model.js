// Auth Model

export default class AuthModel {
  constructor(name, email, password, gender) {
    this.name = name;
    this.email = email.toLowerCase(); // normalize email;
    this.password = password;
    this.gender = gender
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
