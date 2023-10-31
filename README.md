# Elipse Package

A small Express like package for api routing, middlewares and response with Bun runtime!

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

const app = createElipseApp({
    prefix: "/api",
});

app.get("/", async () => new Response("Hello y'all!"));

// You can use `use` to use functions that every route in below of it.
// app.use(async (req, next) => {
//     console.log("Middleware 1");
//     return next(req);
// }, UserLoggedIn);

app.intercept(...interceptFunctions);

// set your middleware functions and endpoint function
app.get("/hello", UserLoggedIn, Hello);
app.get("/hello2", Hello);

app.get("/actions", async () => eJson({ hello: "world" }));
app.post("/actions", async () => new Response("Post!"));
app.del("/actions", async () => new Response("Delete!"));
app.put("/actions", async () => new Response("Update!"));

app.get("/json", async () => eJson({ hello: "world" }));

// you can change the error handlers 
app.error(404, (message) => new Response(`Not found: ${message}`, { status: 404 }));

Bun.serve({
    port: PORT,
    hostname: HOSTNAME,
    fetch: app.handle,
});

console.log(`Server running at http://${HOSTNAME}:${PORT}/`);

```
