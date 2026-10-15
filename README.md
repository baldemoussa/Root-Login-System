# Root Login System

## By [Mamadou Moussa Balde](https://www.linkedin.com/in/2mb/)

`npm start` runs `node server.js`. `npm run dev` runs the same file with nodemon. `server.js` uses `PORT` or `3001`, and the listen line is `Server is listening @ http://localhost:` plus that port.

This run exited before that line. Node v26.3.1 stopped while parsing `server.js`:

```
SyntaxError: Identifier 'passport' has already been declared
```

`passport` is declared with `const` on line 20 and again on line 25. `routes/user-routes.js` declares `const passport` twice as well. None of the auth routes were called.

The server is written to read `PORT`, `MONGO_URI`, `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `GITHUB_CALLBACK_URL`.

## The HTML file

`public/index.html` is the static page. The tab title is **Authentication and Authorization**. The heading is "Welcome to my API!". The background is `lightgreen`, `rgb(144, 238, 144)`. The file does not set a font. In this browser the heading is Times New Roman, 32px, black. `script.js` logs "Welcome to my API!" in the console. The shot is that file opened on its own. `server.js` did not serve it.

![Welcome to my API! on light green](docs/screenshots/home.png)

## Handlers in the route file

These are the handlers under `/api/auth`. This run did not call them.

`POST /register` rejects an email that is already stored with `400` and `This user already exists.` A new user is saved, the password is hashed with bcrypt and 10 salt rounds, and the response is `201` with `User created successfully!` and a token. The token payload is `_id` and `role`, and it expires in one hour. `username`, `email`, and `password` are required. The email check message is `Please provide a valid email addres.` The password must be at least 7 characters. `role` is `user` or `admin`, and it defaults to `user`.

`POST /login` answers `400` and `Incorrect email or password.` when the email is missing or the password does not match. A match answers `200` and `User logged in successfully!` with a token.

`GET /` and `GET /profile` load the user and omit the password. The JSON is `200` and `User authenticated.` With no user, the message is `401` and `User must register or log in.` `GET /` reads a header that starts with `Bearer `. A missing or badly shaped header is `401` and `No bearer token or incorrect format. Authentication denied.` A token that does not verify is `401` and `Token is invalid.` `GET /profile` uses the Passport JWT strategy instead.

`GET /admin` uses that same bearer check, then allows the request only when `role` is `admin`. Anyone else gets `403` and `Access denied. Admins only.`

`GET /github` starts the GitHub strategy. `GET /github/callback` answers `Successfully authenticated using GitHub!`

`models/note-model.js` defines a note with `title`, `content`, and a user id. Nothing in the server requires that file.
