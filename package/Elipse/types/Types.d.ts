type AppConfig = {
    prefix: string;
};

type NextFunction = (req: Request) => Request;

type HandleFunction = (req: Request) => Promise<Response>;

type MiddlewareFunction = (req: Request, next: NextFunction) => Promise<Response | Request>;

type IntercepterFunction = (req: Request, res: Response) => Promise<Response>;

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

type JsonObject = Record<string, any>;

export {
    AppConfig,
    HandleFunction,
    MiddlewareFunction,
    NextFunction,
    IntercepterFunction,
    Handler,
    RequestType,
    RoutesMap,
    ErrorRoutesMap,
    JsonObject
}