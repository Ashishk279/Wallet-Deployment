import express from 'express'
import cors from 'cors';
import morgan from 'morgan';
import { sendFailResponse } from "./utils/apiFailResponse.js";
import { ApiError } from "./utils/apiErrors.js";
import { limiter } from './middlewares/rateLimiter.js';
import { walletRoutes } from './routes/wallet.js';

const app = express();
app.use((req, res, next) => {
    res.append('Access-Control-Expose-Headers', 'x-total, x-total-pages');
    next();
});

app.use(limiter)

app.use(cors());

morgan.format('custom', ':method :url :status :res[content-length] - :response-time ms')
app.use(morgan('custom'))
app.use(express.json({
    limit: "16kb"
}))

app.use("/api/v1/wallet", walletRoutes)

app.use(function (err, req, res, next) {
    console.error(err);
    const status = err.status || 400;
    if (err.message == "jwt expired" || err.message == "Authentication error") { res.status(401).send({ status: 401, message: err }); }
    if (typeof err == typeof "") { sendFailResponse(req, res, status, err); }
    else if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            data: err.data,
            success: err.success,
            errors: err.errors
        });
    }
    else if (err.Error) res.status(status).send({ status: status, message: err.Error });
    else if (err.message) res.status(status).send({ status: status, message: err.message });
    else res.status(status).send({ status: status, message: err.message });
});

export {
    app
}