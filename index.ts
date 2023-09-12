import Hello from "./src/controllers/hello";
import UserLoggedIn from "./src/middlewares/userLoggedIn";
import { createElipseApp } from "./package/Elipse";

const HOSTNAME = "localhost";
const PORT = 8080;

const app = createElipseApp({
    prefix: "/api",
});

app.get("/", async () => new Response("Hepinize merhaba!"));

app.get("/hello", UserLoggedIn, Hello);
app.get("/hello2", Hello);
app.post("/hello2", async () => new Response("Hello, World!"));

Bun.serve({
    port: PORT,
    hostname: HOSTNAME,
    fetch: app.handle,
});

console.log(`Server running at http://${HOSTNAME}:${PORT}/`);