import type { Handler, AppConfig, HandleFunction, MiddlewareFunction, NextFunction, RequestType } from "./types/Types";

function _404() {
    return new Response(`Not found`, { status: 404 });
}

class RouteMap {
    private routes: Record<string, {
        "POST": Handler | undefined;
        "GET": Handler | undefined;
        "PUT": Handler | undefined;
        "DELETE": Handler | undefined;
    }> = {};

    set(path: string, handlers: Handler, type: RequestType) {
        if (!this.routes[path]) {
            this.routes[path] = {
                "POST": undefined,
                "GET": undefined,
                "PUT": undefined,
                "DELETE": undefined,
            };
        }

        this.routes[path][type] = handlers;
    }

    get(path: string, type: RequestType): Handler | undefined {
        return this.routes[path]?.[type];
    }
}

function createElipseApp({
    prefix = "/api",
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
            const type = req.method.toUpperCase() as RequestType;

            const handlers = app.get(url.pathname, req.method.toUpperCase() as RequestType);

            const query = parseQuery(url.searchParams.toString());

            req.headers.set("query", JSON.stringify(query));

            if (handlers) {
                let new_req: Request | Response = req;

                new_req = await runMiddlewares(new_req, handlers.middlewares);

                if (new_req instanceof Response) {
                    return new_req;
                }

                const response = await handlers.endpoint(new_req);

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

    function setRoute(path: string, type: RequestType, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        const middlewares = handlers.slice(0, handlers.length - 1);
        const endpoint = handlers[handlers.length - 1];

        app.set(prefix + path, {
            middlewares: middlewares as unknown as MiddlewareFunction[],
            endpoint: endpoint as unknown as HandleFunction,
        }, type);
    }

    function getRoute(path: string, type: RequestType) {
        return app.get(prefix + path, type);
    }

    function getApp() {
        return app;
    }

    function get(path: string, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        setRoute(path, "GET", ...handlers);
    }

    function post(path: string, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        setRoute(path, "POST", ...handlers);
    }

    function put(path: string, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        setRoute(path, "PUT", ...handlers);
    }

    function del(path: string, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        setRoute(path, "DELETE", ...handlers);
    }


    return {
        handle,
        getApp,
        getRoute,
        get,
        post,
        put,
        del
    };
}

export {
    createElipseApp,
}