const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain/blockchain');
const P2pServer = require('./p2pServer');

const HTTP_PORT = process.env.HTTP_PORT || 4001;

const app = express();
const bc = new Blockchain();
const p2pSever = new P2pServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
})

app.post('/mine', (req, res) => {
    const block  = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);
    p2pSever.syncChains();

    res.redirect('./blocks');
})

app.listen(HTTP_PORT, () => {
    console.log(`Listening at port ${HTTP_PORT}`);
})

p2pSever.listen();