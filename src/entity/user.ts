
export class User {
    username:string;
    password:string;
    token:string;
    constructor(username, password, token) {
        this.username = username;
        this.password = password;
        this.token = token;
    }
}

module.exports = User