import Hello from "./src/controllers/hello";
import UserLoggedIn from "./src/middlewares/userLoggedIn";
import { createElipseApp } from "./package/Elipse";

const app = createElipseApp({
    port: 8080,
    hostname: "localhost",
    prefix: "/api"
});

app.setRoute("/hello", UserLoggedIn, Hello);
app.setRoute("/hello2", Hello);

Bun.serve({
    port: 8080,
    hostname: "localhost",
    fetch: app.handle
});

