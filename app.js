'use strict';

import AwsServerlessExpress from 'aws-serverless-express';
import Express from 'express';
import AwsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import Context from 'request-context';
import Moment from 'moment-timezone';
import Router from './src/router';

const app = Express();
const server = AwsServerlessExpress.createServer(app);

// middleware
app.use(AwsServerlessExpressMiddleware.eventContext());
app.use(Context.middleware('request'));
app.use((req, res, next) => {
    const time = new Moment().tz("Asia/Tokyo");
    Context.set('time', time);
    next();
});
app.use((req, res, next) => {
    const time = Context.get('time').format('YYYY-MM-DD HH:mm:ss');
    const stage = req.apiGateway.event.requestContext.stage;
    const method = req.apiGateway.event.httpMethod;
    const path = req.apiGateway.event.path;
    const status = res.statusCode;
    console.info(`Datetime:${time}\tStage:${stage}\tStatus:${status}\tUri:[${method}] ${path}`);
    next();
});

// routing
app.use(Router);

export const main = (event, context, callback) => {
    try {
        context.succeed = (res) => {
            callback(null, res);
            if (event.headers.Host.match("localhost")) {
                // serverless-offlineでlocal実行時に /tmp にソケットファイルが溜まり続けるのでサーバー停止
                server.close();
            }
        };
        return AwsServerlessExpress.proxy(server, event, context);
    } catch (e) {
        console.error(e);
    }
}
