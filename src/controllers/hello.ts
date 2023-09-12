import { getBody, getQuery } from "../../package/Elipse";

async function Hello(req: Request): Promise<Response> {
    return new Response(JSON.stringify({
        message: `Fine!`,
    }), {
        status: 200,
    });
}

export default Hello;