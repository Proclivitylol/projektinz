import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Prosty endpoint testowy
app.get('/', (req, res) => {
  res.send({ message: 'Backend działa!' });
});

// Placeholdery na endpointy do transakcji i użytkowników
// TODO: Dodaj obsługę transakcji i użytkowników

app.listen(PORT, () => {
  console.log(`Serwer backendu działa na http://localhost:${PORT}`);
});
