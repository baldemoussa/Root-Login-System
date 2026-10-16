# Root Login System

An Express auth server that did not start in this run because `passport` is declared twice.

## Description

`npm start` runs `node server.js`. `npm run dev` runs the same file with nodemon. `server.js` uses `PORT` or `3001`, and the listen line is `Server is listening @ http://localhost:` plus that port.

This run exited before that line. Node v26.3.1 stopped while parsing `server.js`:

```
SyntaxError: Identifier 'passport' has already been declared
```

`passport` is declared with `const` on line 20 and again on line 25. `routes/user-routes.js` declares `const passport` twice as well. None of the auth routes were called.

The server is written to read `PORT`, `MONGO_URI`, `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `GITHUB_CALLBACK_URL`.

`public/index.html` is the static page. The tab title is **Authentication and Authorization**. The heading is "Welcome to my API!". The background is `lightgreen`, `rgb(144, 238, 144)`. The file does not set a font. In this browser the heading is Times New Roman, 32px, black. `script.js` logs "Welcome to my API!" in the console. The shot is that file opened on its own. `server.js` did not serve it.

These are the handlers under `/api/auth`. This run did not call them.

`POST /register` rejects an email that is already stored with `400` and `This user already exists.` A new user is saved, the password is hashed with bcrypt and 10 salt rounds, and the response is `201` with `User created successfully!` and a token. The token payload is `_id` and `role`, and it expires in one hour. `username`, `email`, and `password` are required. The email check message is `Please provide a valid email addres.` The password must be at least 7 characters. `role` is `user` or `admin`, and it defaults to `user`.

`POST /login` answers `400` and `Incorrect email or password.` when the email is missing or the password does not match. A match answers `200` and `User logged in successfully!` with a token.

`GET /` and `GET /profile` load the user and omit the password. The JSON is `200` and `User authenticated.` With no user, the message is `401` and `User must register or log in.` `GET /` reads a header that starts with `Bearer `. A missing or badly shaped header is `401` and `No bearer token or incorrect format. Authentication denied.` A token that does not verify is `401` and `Token is invalid.` `GET /profile` uses the Passport JWT strategy instead.

`GET /admin` uses that same bearer check, then allows the request only when `role` is `admin`. Anyone else gets `403` and `Access denied. Admins only.`

`GET /github` starts the GitHub strategy. `GET /github/callback` answers `Successfully authenticated using GitHub!`

`models/note-model.js` defines a note with `title`, `content`, and a user id. Nothing in the server requires that file.

## Screenshots

![Welcome to my API! on light green](docs/screenshots/home.png)

## Getting Started

### Dependencies

* Node.js and npm
* This run used Node v26.3.1
* Environment names in the source: `PORT`, `MONGO_URI`, `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`

### Installing

```bash
npm install
```

### Executing program

```bash
npm start
```

This run exited before the listen line. The screenshot is `public/index.html` opened on its own.

## Help

Node stops with `SyntaxError: Identifier 'passport' has already been declared` at `server.js` line 25. `routes/user-routes.js` declares `const passport` twice as well. Until that is one declaration in each file, the auth routes do not run.

## Authors

[Mamadou Moussa Balde](https://www.linkedin.com/in/2mb/)

## Version History

* Current local run
    * `npm start` exited before listen
    * The HTML screenshot was taken without Express serving the file

## License

This folder does not include a `LICENSE.md` file.

## Acknowledgments

* [README template](https://gist.github.com/DomPizzie/7a5ff55ffa9081f2de27c315f5018afc)
