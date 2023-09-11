type AppConfig = {
    port: number;
    hostname: string;
    prefix: string;
};

type NextFunction = (req: Request) => Request;

type HandleFunction = (req: Request) => Promise<Response>;

type MiddlewareFunction = (req: Request, next: NextFunction) => Promise<Response | Request>;


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
    Handler
}