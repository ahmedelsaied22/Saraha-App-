import 'dotenv/config'
import { ConnetDB } from "./DB/ConnectDB.js";
import authRouter from './modules/auth.module/auth.controller.js';

const bootstrap = async (app, express) => {
    const port = Number(process.env.PORT);
    app.use(express.json());
    ConnetDB()

    // app.use('/users', userRouter)
    app.use('/auth', authRouter)

    app.use('/uploads', express.static('./uploads'))

    app.all("{/*urls}", (req, res, next) => {
        const url = req.params.urls;
        const method = req.method;

        return res.status(404).json({
            errMsg: url
                ? `url ${url} with method ${method} not found`
                : "please send url",
        });
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ errMsg: err.message, status: err.status || 500 })
    })

    app.listen(port, () => {
        console.log(`Server started on port:`, port);
    });
};

export default bootstrap;