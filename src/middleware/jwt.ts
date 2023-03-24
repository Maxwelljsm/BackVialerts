import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "./../config/config";

export const checkJwt = (request: Request, response: Response, next: NextFunction) => {
    const token = <string>request.headers['auth'];
    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        response.locals.jwtPayload = jwtPayload;
    } catch (error) {
        return response.status(401).json({ message: 'Not authorized' });
    }

    const { userId, username } = jwtPayload;

    const newToken = jwt.sign({ userId, username }, config.jwtSecret, { expiresIn: '1h' });

    response.setHeader('token', newToken);
    // Call next
    next();
}

