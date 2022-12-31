const express = require('express')
const app = express()
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
      ?maqam georss:point ?position
    }`;

const client = new SparqlClient({ endpointUrl });

(async function main() {
  const stream = await client.query.select(query);

  stream.on('data', row => {
    Object.entries(row).forEach(([key, value]) => {
      console.log(`${key}: ${value.value} (${value.termType})`)
    })
  })

  stream.on('error', err => {
    console.error(err)
  })

})();

app.get('/', (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})