const express = require('express')
const app = express()
const port = 3000
var rdfstore = require('rdfstore');



app.get('/', (req, res) => {
  rdfstore.create(function (err, store) {
    if (err) {
      res.send(err);
    }
    store.execute('LOAD <http://https://dbpedia.org/page/Category:Mausoleums_by_country> INTO GRAPH <mbc>', function () {
  
      store.setPrefix('skos', 'http://www.w3.org/2004/02/skos/core#');
      store.setPrefix('dct', 'http://purl.org/dc/terms/');
      store.setPrefix('dbp', 'http://dbpedia.org/property/');
      store.setPrefix('dbr', 'http://dbpedia.org/resource/');
  
      store.execute('select * where {\
        ?subject skos:broader <mbc> .\
        ?maqam dct:subject ?subject .\
        ?maqam dbp:religiousAffiliation dbr:Islam\
        }',
        function (err, results) {
          if (err) {
            res.send(err);
          }
  
          results.forEach(function (triple) {
            res.send(triple.object.valueOf());
          });
        });
  
    });
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})