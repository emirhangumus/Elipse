import Hello from "./src/controllers/hello";
import UserLoggedIn from "./src/middlewares/userLoggedIn";
import { createElipseApp } from "./package/Elipse";

const HOSTNAME = "localhost";
const PORT = 8080;

const app = createElipseApp({
    prefix: "/api",
});

app.get("/", async () => new Response("Hello y'all!"));

// You can use `use` to use functions that every route in below of it.
app.use(async (req, next) => {
    console.log("Middleware 1");
    return next(req);
}, UserLoggedIn);

// set your middleware functions and endpoint function
app.get("/hello", UserLoggedIn, Hello);
app.get("/hello2", Hello);

app.get("/actions", async () => new Response("Get!"));
app.post("/actions", async () => new Response("Post!"));
app.del("/actions", async () => new Response("Delete!"));
app.put("/actions", async () => new Response("Update!"));

// you can change the error handlers 
app.error(404, (message) => new Response(`Not found: ${message}`, { status: 404 }));
Bun.serve({
    port: PORT,
    hostname: HOSTNAME,
    fetch: app.handle,
});

console.log(`Server running at http://${HOSTNAME}:${PORT}/`);