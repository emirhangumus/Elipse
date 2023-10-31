import type { IntercepterFunction } from "../../package/Elipse/types/Types";
import { eJson, getResponseContent } from "../../package/Elipse";

const interceptFunctions: IntercepterFunction[] = [];

async function intercept1(req: Request, res: Response) {
    const jsonContent = JSON.parse(await getResponseContent(res));

    const newRes = eJson({
        content: {
            ...jsonContent,
        },
        auth: "hi1"
    }, res);
    
    return newRes;
}

async function intercept2(req: Request, res: Response) {
    const jsonContent = JSON.parse(await getResponseContent(res));

    const newRes = eJson({
        content: {
            ...jsonContent,
        },
        auth: "hi2"
    }, res);
    
    return newRes;
}

interceptFunctions.push(intercept1);
interceptFunctions.push(intercept2);

export default interceptFunctions;