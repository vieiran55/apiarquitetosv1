import express, { Application } from "express";
import cors from "cors";
import { ErrorHandlingMiddleware } from "./middlewares/error-handling";
import { AppRoutes } from "./routes/app.routes";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.errorInterceptor();
    }

    private config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
    }

    private routes() {
        this.app.use("/api/v1", new AppRoutes().router);
        this.app.use(
            "/docs",
            swaggerUI.serve,
            swaggerUI.setup(swaggerDocument)
        );
    }

    private errorInterceptor() {
        this.app.use(new ErrorHandlingMiddleware().handler);
    }

    public listen(port: number) {
        this.app.listen(process.env.PORT || port, () =>
            console.log("Server is running at port " + port)
        );
    }
}
