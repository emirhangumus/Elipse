# Elipse Package

A small package for api routing, middlewares and response with Bun!

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
# Usage

!!!! THIS REPO FOR ONLY FUN! DO NOT USE IT !!!!

```ts
// create an Elipse app
const app = createElipseApp({
    port: 8080,
    hostname: "localhost",
    prefix: "/api"
});

// set your middleware functions and endpoint function
app.setRoute("/hello", UserLoggedIn, Hello);
app.setRoute("/hello2", Hello);

// lastly, serve the app with Bun!
Bun.serve({
    port: 8080,
    hostname: "localhost",
    fetch: app.handle
});

```
