import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3001;
const contracts = [];

const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error())
    }
  }
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/contracts', (req, res) => {
    res.status(200).send(contracts);
});

app.post('/addContract', (req, res) => {
    contracts.push(req.body);
    res.status(200).send(contracts);
})

app.put('/updateContract', (req, res) => {
    const newCVersion = req.body;
    for(let i=0; i < contracts.length; i++){
        if(contracts[i].address === newCVersion.address){
            contracts[i] = {...contracts[i], ...newCVersion};
        }
    }
    res.status(200).send(contracts);
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});