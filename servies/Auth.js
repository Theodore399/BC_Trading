import axios from 'axios';

class Auth {
    constructor(token, user) {
        this.token = token || localStorage.getItem('authToken');

        const userString = localStorage.getItem('loggedInUser');
        const loggedInUser = userString ? JSON.parse(userString) : null;
        this.user = user || loggedInUser;
    }

    setToken(data: any): void {
        this.token = data.access_token;
        localStorage.setItem('authToken', this.token);
    }

    setUser(user) {
        this.user = user.user;
        localStorage.setItem('loggedInUser', JSON.stringify(this.user));
    }

    getToken() {
        return this.token;
    }

    getUser() {
        return this.user;
    }

    logout() {
        this.token = null;
        localStorage.setItem('authToken', this.token);
        localStorage.removeItem('loggedInUser');
    }

    hasToken() {
        return !!this.token;
    }
}

export default Auth;
