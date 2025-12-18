export const UserRole = {
    USER: "USER",
    ADMIN: "ADMIN",
};

export class User {
    constructor(data) {
        this.userId = data.userId;
        this.userName = data.userName;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.role = data.role;
    }
}

export class AuthResponse {
    constructor(data) {
        this.user = new User(data.user);
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
    }
}

export class LoginRequest {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

export class RegisterRequest {
    constructor(userName, firstName, lastName, email, password) {
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}
