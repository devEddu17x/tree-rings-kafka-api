import { registerAs } from "@nestjs/config";

export default registerAs("websocket", () => {
    const { WEBSOCKET_PROCESS_FINISHED } = process.env;
    const missingVars = [
        ['WEBSOCKET_PROCESS_FINISHED', WEBSOCKET_PROCESS_FINISHED],
    ]
        .filter(([, value]) => !value)
        .map(([name]) => name);

    if (missingVars.length) {
        throw new Error(
            `Missing required API env vars: ${missingVars.join(', ')}`,
        );
    }

    return {
        events: {
            processFinished: WEBSOCKET_PROCESS_FINISHED,
        },
    };

});