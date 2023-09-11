import type { Handler, AppConfig, HandleFunction, MiddlewareFunction, NextFunction } from "./types/Types";

function _404() {
    return new Response(`Not found`, { status: 404 });
}

class RouteMap {
    private routes: Record<string, Handler> = {};

    set(path: string, handlers: Handler) {
        this.routes[path] = handlers;
    }

    get(path: string): Handler | undefined {
        return this.routes[path];
    }
}

function createElipseApp({
    port = 8080,
    hostname = "localhost",
    prefix = "/api"
} = {} as AppConfig) {
    const app = new RouteMap();

    function parseQuery(query: string): Record<string, string> {
        const params = query.split("&");
        const parsed: Record<string, string> = {};

        for (const param of params) {
            const [key, value] = param.split("=");
            parsed[key] = value;
        }

        return parsed;
    }

    function nextFunction(req: Request): Request {
        return req;
    }

    async function runMiddlewares(req: Request, handlers: MiddlewareFunction[]): Promise<Response | Request> {
        for (const handler of handlers) {
            let j = await handler(req, nextFunction);

            // console.log(typeof j);
            if (j instanceof Request) {
                req = j;
            } else if (j instanceof Response) {
                return j;
            }
        }

        return req;
    }


    async function handle(req: Request) {
        try {

            const url = new URL(req.url);
            const handlers = app.get(url.pathname);

            const query = parseQuery(url.searchParams.toString());

            req.headers.set("query", JSON.stringify(query));

            if (handlers) {
                let i_req: Request | Response = req;

                i_req = await runMiddlewares(i_req, handlers.middlewares);

                if (i_req instanceof Response) {
                    return i_req;
                }

                let response = await handlers.endpoint(i_req);

                if (!response) {
                    return _404();
                }

                return response;
            } else {
                return _404();
            }
        } catch (error) {
            return new Response(error.message, { status: 500 });
        }
    }

    function setRoute(path: string, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        const middlewares = handlers.slice(0, handlers.length - 1);
        const endpoint = handlers[handlers.length - 1];

        app.set(prefix + path, {
            middlewares: middlewares as unknown as MiddlewareFunction[],
            endpoint: endpoint as unknown as HandleFunction
        });
    }

    function getRoute(path: string) {
        return app.get(path);
    }

    function getApp() {
        return app;
    }

    return {
        handle,
        setRoute,
        getRoute,
        getApp
    };
}

export {
    createElipseApp,
}