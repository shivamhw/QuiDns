import { Express, static as static_ } from "express";
import path from "path";
import { router as userRouter } from "./routes/user"
import {router as adminRouter} from './routes/admin'
import {router as apiRouter } from "./routes/api"
import { LooseAuthProp } from '@clerk/clerk-sdk-node';
import { router as dnsRouter } from "./routes/dns"
import { cors_policy } from './utils'

declare global {
    namespace Express {
        interface Request extends LooseAuthProp { }
    }
}

export class Server {
    private app: Express;
    constructor(app: Express) {
        this.app = app;
        this.applyMiddlewares();
        this.addRoutes();
    }

    public applyMiddlewares(){
        this.app.use(cors_policy);
        this.app.use(static_(path.resolve("./") + "/build/frontend"));
    }

    public addRoutes(){
        this.app.use("/dns", dnsRouter)
        this.app.use("/user", userRouter)
        this.app.use("/admin", adminRouter)
        this.app.use("/api", apiRouter)
        // adding to serve react app from express server
        this.app.get('*', function(req, res) {
            res.sendFile('index.html', {root: path.resolve("./build/frontend")});
          });
    }

    public start(port: number) {
        this.app.listen(port, "0.0.0.0", () => {
            console.log(`server started on ${port}`)
        })
    }
}

