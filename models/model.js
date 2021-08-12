'use strict';

var Datastore = require('nedb'),

  lista_emailsDb = new Datastore({
    filename: __dirname + '/../db/listaemails.db',
    autoload: true
  });

module.exports = lista_emailsDb;
