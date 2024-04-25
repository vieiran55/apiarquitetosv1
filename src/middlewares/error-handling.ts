import { Request, Response, NextFunction } from "express";

export class ErrorHandlingMiddleware {
    public async handler(
        err: Error,
        req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction
    ) {
        if (err instanceof Error) {
            return res.status(400).json({
                status: "error",
                message: err.message,
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
}
