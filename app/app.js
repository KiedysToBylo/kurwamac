import express from 'express';
import path from 'path';
import routes from './routes/web.js'
import routesapi from './routes/api.js'
import ejsLayouts from 'express-ejs-Layouts'
import {viewMiddleware} from './middleware/view-variables.js';
import {userMiddleware} from './middleware/user-middleware.js';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import { sessionKeySecret } from './config.js'
import {isAuth} from '../app/middleware/isAuth.js'
import {usersListMiddleware} from '../app/middleware/usersListMiddelware.js'
import helmet from 'helmet';
import rateLimiterMiddleware from './middleware/rate-limiter.js'
const app = express();
const __dirname = path.resolve();
//init database
import './db/mongoose.js';
//security
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(rateLimiterMiddleware);
//session
app.use(session({
    resave: false,
    secret: sessionKeySecret,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*60*24*2}, //1 day
}));
//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
//set layout
app.use(ejsLayouts);
app.set('layout', '../views/layouts/main.ejs');
//public folder
app.use(express.static('./public'))
//body parser
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json())
//middleware
app.use('/',viewMiddleware);
app.use('/',userMiddleware, usersListMiddleware);
// app.use('/admin',isAuth);
//routes
app.use('/api', routesapi);
app.use(routes);
export default app