const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = 5000;

let clients = [];
let facts = [
  `English has one of the largest vocabularies of any language, with over a million words and counting. New words are added regularly`,
  `The shortest complete sentence in the English language is "I am."`,
  `The sentence "The quick brown fox jumps over the lazy dog" is a pangram, meaning it uses every letter of the English alphabet at least once`,
];

function eventsHandler(req, res) {
    const headers = {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    facts.forEach(fact => {
      res.write(`data: ${JSON.stringify(fact)}\n\n`);
    });

    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      res,
    };
  
    clients.push(newClient);
  
    req.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
}

function sendEventsToAll(newFact) {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(newFact)}\n\n`))
}
  
async function addFact(req, res) {
    const newFact = req.body;
    
    facts.push(newFact.fact);
    res.json(newFact)

    return sendEventsToAll(newFact.fact);
}

app.post('/fact', addFact);
  
app.get('/events', eventsHandler);

app.get('/status', (req, res) => res.json({ clients: clients.length }));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})