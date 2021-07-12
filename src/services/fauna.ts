import { Client } from 'faunadb';

// Configurando acesso ao B.D
export const fauna = new Client({
  secret: process.env.FAUNADB_KEY
});