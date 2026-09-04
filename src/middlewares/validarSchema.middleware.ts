import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';

export const validarSchema = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Error de validación en los datos enviados',
                    detalles: error.issues.map((issue) => ({
                        campo: issue.path.join('.'),
                        mensaje: issue.message,
                    })),
                });
            }
            return res.status(500).json({ error: 'Error interno de validación' });
        }
    };
};