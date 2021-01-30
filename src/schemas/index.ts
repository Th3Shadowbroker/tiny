import {Request, Response, NextFunction} from "express";
import joi, {ObjectSchema} from "joi";
import {sendResponse} from "../util/GenericResponse";

export const PostShrink = joi.object({
    url: joi.string()
            .uri({scheme: ["http", "https"]})
            .required(),

    name: joi.string()
             .max(25)
             .optional()
});

export function validate(schema: ObjectSchema): (req: Request, res: Response, next: NextFunction) => void {
    return function (req: Request, res: Response, next: NextFunction) {
        const result = schema.validate(req.body, {abortEarly: false});
        if (result.error) {
            sendResponse(res, 400, result.error.details.map(e => e.message), "Schema violation");
        } else {
            next();
        }
    }
}