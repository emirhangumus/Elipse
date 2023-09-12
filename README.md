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
const HOSTNAME = "localhost";
const PORT = 8080;

// create an Elipse app
const app = createElipseApp({
    prefix: "/api",
});

app.get("/", async () => new Response("Hello y'all!"));

// set your middleware functions and endpoint function
app.get("/hello", UserLoggedIn, Hello);
app.get("/hello2", Hello);
app.post("/hello2", async () => new Response("Hello, World!"));

// lastly, serve the app with Bun!
Bun.serve({
    port: PORT,
    hostname: HOSTNAME,
    fetch: app.handle,
});

console.log(`Server running at http://${HOSTNAME}:${PORT}/`);

```
