import { Request, Response, NextFunction } from 'express';

type AsyncHandlerFunction = (req: Request, res: Response, next?: NextFunction) => Promise<void>;

export const asyncHandler = (fn: AsyncHandlerFunction) => 
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            console.log(error)
            res.status(error.code || 500).json({
                success: false,
                message: error.message,
            });
        }
    };