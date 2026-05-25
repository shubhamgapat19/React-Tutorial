// ========================================
// DEFAULT EXPORT - One main export per file
// ========================================

// Typically used for classes or main components
class User {
  constructor(name, email, age) {
    this.name = name;
    this.email = email;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}!`;
  }

  getInfo() {
    return {
      name: this.name,
      email: this.email,
      age: this.age
    };
  }

  isAdult() {
    return this.age >= 18;
  }
}

// Default export - can have only ONE per file
export default User;

// You can still have named exports alongside default
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

export function createUser(name, email, age) {
  return new User(name, email, age);
}

console.log("User.js loaded");
