import {Response} from "express";
import {STATUS_CODES} from "http";

export interface GenericResponse {
    data: any
    message: string
    status: number
}

export function sendResponse(res: Response, status?: number, data?: any, message?: string): void {
    res.status(status ?? 200);
    res.send({
        data: data ?? [],
        status: res.statusCode,
        message: message ?? STATUS_CODES[res.statusCode]
    });
}