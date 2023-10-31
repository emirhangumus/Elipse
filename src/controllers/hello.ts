import { eJson } from "../../package/Elipse";

async function Hello(req: Request): Promise<Response> {
    return eJson({ hello: "world" });
}

export default Hello;