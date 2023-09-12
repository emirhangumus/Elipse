type AppConfig = {
    prefix: string;
};

type NextFunction = (req: Request) => Request;

type HandleFunction = (req: Request) => Promise<Response>;

type MiddlewareFunction = (req: Request, next: NextFunction) => Promise<Response | Request>;

type RequestType = "GET" | "POST" | "PUT" | "DELETE";

type RoutesMap = Record<string, {
    "POST": Handler | undefined;
    "GET": Handler | undefined;
    "PUT": Handler | undefined;
    "DELETE": Handler | undefined;
}>;

type ErrorRoutesMap = Record<number, (message: string) => Response>;

type Handlers = [...HandleFunction[]];

type Handler = {
    middlewares: MiddlewareFunction[];
    endpoint: HandleFunction;
}

export {
    AppConfig,
    HandleFunction,
    MiddlewareFunction,
    NextFunction,
    Handler,
    RequestType,
    RoutesMap,
    ErrorRoutesMap
}