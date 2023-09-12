import type { Handler, AppConfig, HandleFunction, MiddlewareFunction, NextFunction, RequestType, RoutesMap, ErrorRoutesMap } from "./types/Types";

class RouteMap {
    private routes: RoutesMap = {};

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

class ErrorRoutes {
    private routes: ErrorRoutesMap = {};

    set(code: number, handler: (message: string) => Response) {
        this.routes[code] = handler;
    }

    get(code: number): ((message: string) => Response) | undefined {
        return this.routes[code];
    }

    getRoutes() {
        return this.routes;
    }
}

function createElipseApp({
    prefix = "/api",
} = {} as AppConfig) {
    const app = new RouteMap();
    const errorRoutes = new ErrorRoutes();

    /**
     * 
     * @param message The message to be sent to the client
     * @returns A 404 response
     */
    function _404(message: string) {
        return new Response(message, { status: 404 });
    }

    /**
     * 
     * @param message The message to be sent to the client
     * @returns A 500 response
     */
    function _500(message: string) {
        return new Response(message, { status: 500 });
    }

    /**
     *  set default error routes
     */
    errorRoutes.set(404, _404);
    errorRoutes.set(500, _500);

    /**
     * 
     * @param query The query string
     * @returns A parsed query string
     */
    function parseQuery(query: string): Record<string, string> {
        const params = query.split("&");
        const parsed: Record<string, string> = {};

        for (const param of params) {
            const [key, value] = param.split("=");
            parsed[key] = value;
        }

        return parsed;
    }

    /**
     * 
     * @param req The request object
     * @returns The request object
     */
    function nextFunction(req: Request): Request {
        return req;
    }

    /**
     * 
     * @param req The request object
     * @param handlers The middlewares to be run
     * @returns The request object or a response object
     */
    async function runMiddlewares(req: Request, handlers: MiddlewareFunction[]): Promise<Response | Request> {
        for (const handler of handlers) {
            let j = await handler(req, nextFunction);

            if (j instanceof Request) {
                req = j;
            } else if (j instanceof Response) {
                return j;
            }
        }

        return req;
    }

    /**
     * 
     * @param req The request object
     * @returns A response object
     */
    async function handle(req: Request) {
        try {
            const url = new URL(req.url);
            const type = req.method.toUpperCase() as RequestType;

            const handlers = app.get(url.pathname, type);

            const query = parseQuery(url.searchParams.toString());
            req.headers.set("query", JSON.stringify(query));

            if (handlers) {
                // TODO: new_req looks so ugly, find a better way
                let new_req: Request | Response = req;

                new_req = await runMiddlewares(new_req, handlers.middlewares);

                if (new_req instanceof Response) {
                    return new_req;
                }

                const response = await handlers.endpoint(new_req);

                switch (response.status) {
                    case 404:
                        return errorRoutes.get(404)?.("Route not found");
                    case 500:
                        return errorRoutes.get(500)?.("Internal Server Error");
                }

                return response;
            } else {
                if (errorRoutes.get(404)) {
                    // @ts-ignore
                    return errorRoutes.get(404)("Route not found");
                } else {
                    return new Response("Not Found", { status: 404 });
                }
            }
        } catch (error) {
            return new Response(error.message, { status: 500 });
        }
    }

    /**
     * 
     * @param path The path of the route
     * @param type The type of the route
     * @param handlers The middlewares and the endpoint
     */
    function setRoute(path: string, type: RequestType, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        const middlewares = handlers.slice(0, handlers.length - 1);
        const endpoint = handlers[handlers.length - 1];

        app.set(prefix + path, {
            middlewares: middlewares as unknown as MiddlewareFunction[],
            endpoint: endpoint as unknown as HandleFunction,
        }, type);
    }

    /**
     * 
     * @param path The path of the route
     * @param type The type of the route
     * @returns The route object
     */
    function getRoute(path: string, type: RequestType) {
        return app.get(prefix + path, type);
    }

    /**
     * 
     * @returns The app object
     */
    function getApp() {
        return app;
    }

    /**
     * 
     * @param path The path of the route
     * @param handlers The middlewares and the endpoint
     */
    function get(path: string, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        setRoute(path, "GET", ...handlers);
    }

    /**
     * 
     * @param path The path of the route
     * @param handlers The middlewares and the endpoint
     */
    function post(path: string, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        setRoute(path, "POST", ...handlers);
    }

    /**
     * 
     * @param path The path of the route
     * @param handlers The middlewares and the endpoint
     */
    function put(path: string, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        setRoute(path, "PUT", ...handlers);
    }

    /**
     * 
     * @param path The path of the route
     * @param handlers The middlewares and the endpoint
     */
    function del(path: string, ...handlers: (HandleFunction | MiddlewareFunction)[]) {
        setRoute(path, "DELETE", ...handlers);
    }

    /**
     * 
     * @param code The error code
     * @param handler The handler function
     */
    function error(code: number, handler: (message: string) => Response) {
        errorRoutes.set(code, handler);
    }

    return {
        handle,
        getApp,
        getRoute,
        get,
        post,
        put,
        del,
        error,
    };
}

export {
    createElipseApp,
}