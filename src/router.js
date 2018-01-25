'use strict';

import Express from 'express';

const router = Express.Router();
export default router;

router.get('/', (req, res) => {
    res.json({message: 'Hello World!'});
});

router.get('/hoge', (req, res) => {
    res.json({message: 'Hello Hoge!'});
});
