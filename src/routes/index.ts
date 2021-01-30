import express, {Application, Request, Response} from "express";
import {PostShrink, validate} from "../schemas";
import {sendResponse} from "../util/GenericResponse";
import TinyUrl from "../entities/TinyUrl";
import TinyServer from "../TinyServer";

async function postShrink(req: Request, res: Response): Promise<void> {
    await TinyUrl.generate(req.body.url)
                 .then( turl => {
                     sendResponse(res, 200, `${TinyServer.instance.config.service.domain}/${turl.short}`);
                 })
                 .catch( reason => {
                     TinyServer.instance.log.error(reason);
                    sendResponse(res, 500);
                 });
}

async function getShortIdInfo(req: Request, res: Response): Promise<void> {
    await TinyUrl.resolve(req.params.shortId, true)
                 .then( turl => {
                    if (turl) {
                        sendResponse(res, 200, {
                           name: turl.name,
                           target: turl.target,
                           interactions: turl.interactions,
                           created: turl.created
                        });
                    } else {
                        sendResponse(res, 404);
                    }
                 })
                 .catch( reason => {
                    TinyServer.instance.log.error(reason);
                    sendResponse(res, 500);
                 });
}

async function getShortId(req: Request, res: Response): Promise<void> {
    await TinyUrl.resolve(req.params.shortId)
                 .then( turl => {
                    if (turl) {
                        res.redirect(turl.target);
                    } else {
                        sendResponse(res, 404);
                    }
                 })
                 .catch( reason => {
                    TinyServer.instance.log.error(reason);
                    sendResponse(res, 500);
                 });
}

export default function registerRoutes(app: Application): void {
    app.post("/api/shrink", validate(PostShrink), postShrink);
    app.get("/api/:shortId/i", getShortIdInfo);

    if (process.env.NODE_ENV === 'development') {
        app.use("/swagger", express.static(`${__dirname}/../../docs/swagger/swagger.html`));
        app.use("/swagger.yml", express.static(`${__dirname}/../../docs/swagger/swagger.yml`));
    }

    app.get("/:shortId", getShortId);
}