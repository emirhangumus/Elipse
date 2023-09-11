async function Hello(req: Request): Promise<Response> {

    const query = JSON.parse(req.headers.get("query") || "{}");

    return new Response(`<h1>Hello, ${query.name || "World"}!</h1>`);
}

export default Hello;