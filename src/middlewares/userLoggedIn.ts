import { NextFunction } from "../../package/Elipse/types/Types";

async function UserLoggedIn(req: Request, next: NextFunction) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // return new Response(`User logged in`);

    if (req.headers.get("Authorization") !== "Bearer 123") {
        return new Response(`User not logged in`, { status: 401 });
    }

    req.headers.set("User-Logged-In", "true");

    return next(req);
}

export default UserLoggedIn;