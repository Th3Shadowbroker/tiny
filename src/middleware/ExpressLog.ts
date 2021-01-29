import {Logger} from "log4js";
import {Request, Response, NextFunction} from "express";

export default function logRequests(logger: Logger) {
    return function (req: Request, res: Response, next: NextFunction) {
        req.on("end", () => {
            logger.info(`${req.headers.forwarded ?? req.socket.remoteAddress} ${req.method.toUpperCase()} ${req.url} - ${res.statusCode} ${res.statusMessage}`);
        });

        next();
    }
}