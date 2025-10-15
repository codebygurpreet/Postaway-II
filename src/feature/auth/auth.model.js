// Auth Model

// Auth Model class
export default class AuthModel {
  constructor(name, email, password, gender, avatar) {
    this.name = name;
    this.email = email.toLowerCase(); // normalize email;
    this.password = password;
    this.gender = gender;
    this.avatar = avatar;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
