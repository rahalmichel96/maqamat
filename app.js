const express = require('express');
var path = require('path');
var coords = [];
var descs = [];
const app = express()
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
const port = 3000
const SparqlClient = require('sparql-http-client')
const endpointUrl = 'https://dbpedia.org/sparql/'
const query = `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX dnr: <http://dbpedia.org/resource/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX georss: <http://www.georss.org/georss/>

    select * where {
      ?subject skos:broader dbc:Mausoleums_by_country .
      ?maqam dct:subject ?subject .
      ?maqam dbp:religiousAffiliation dbr:Islam .
      ?maqam georss:point ?position .
      ?maqam dbo:abstract ?desc
      
      FILTER(lang(?desc) = 'fr')
    }`;

const client = new SparqlClient({ endpointUrl });

(async function main() {
  const stream = await client.query.select(query);
  stream.on('data', row => {
    Object.entries(row).forEach(([key, value]) => {
      if (key === 'position') {
        coords.push(value.value.replace(' ', ','));
      } else if (key == 'desc') {
        descs.push(value.value);
      }
    });
  })

  stream.on('error', err => {
    console.error(err)
  })

})();

app.get('/', (req, res) => {
  res.render('./index.html');
})

app.get('/coord', (req, res) => {
  res.send(JSON.stringify(coords));
})

app.get('/desc', (req, res) => {
  res.send(JSON.stringify(descs));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})