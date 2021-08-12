'use strict';


const DADOS_CRIPTOGRAFAR = {
  algoritmo : "aes256",
  segredo : "chaves",
  tipo: "hex"
};



const crypto = require("crypto");
const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);


function criptografar(senha) {
  const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
  cipher.update(senha);
  return cipher.final(DADOS_CRIPTOGRAFAR.tipo);

};

function descriptografar(senha) {
  const decipher = crypto.createDecipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
  decipher.update(senha, DADOS_CRIPTOGRAFAR.tipo);
  return decipher.final();  
  
};

var express = require('express'),
  model = require('../models/model.js'),


  router = express.Router();



router.route('/lista_emails')
  .get(function(req, res) {
    model.find({}, function(err, lista_emails) {
      if (err) {
        res.send(err);

        return;
      }
      res.json(lista_emails);
    });
})
  .post(function(req, res) {
    var postData = req.body,
      verifica = {
        type: 'Verificacao',
        mensagem: ''
      };
    
    postData.senha = criptografar(postData.senha)


    if (!postData.nome) {
      verifica.mensagem = 'Campo nome não encontrado';
    }
   
    if (!postData.email) {
      verifica.mensagem = 'Campo de e-mail não preenchido';
    }

    if (!postData.telefone) {
      verifica.mensagem = 'Campo de telefone não preenchido';
    }

    if (!postData.senha) {
      verifica.mensagem = 'Campo de senha não preenchido';
    }

    if (verifica.mensagem) {
      res.json(verifica);

      return;
    }

    model.insert(postData, function(err, novo_cadastro) {
      if (err) {
        res.send(err);

        return;
      }

      res.json(novo_cadastro);
    });
  });




  

router.route('/lista_emails/:id')
  .put(function(req, res) {
    model.findOne({
      _id: req.params.id
    }, function(err, usuario) {
      var prop;

      if (err) {
        res.send(err);
        return;
      }

      if (usuario === null) {
        res.json({
          type: 'error',
          mensagem: 'Cadastro não encontrado '
        });
        return;
      }

      for (prop in req.body) {
        if (prop !== '_id') {
          usuario[prop] = req.body[prop];
        }
      }

      model.update({
        _id: usuario._id
      }, usuario, {}, function(err, numReplaced) {
        if (err) {
          res.send(err);

          return;
        }

        res.json({
          type: 'success',
          mensagem: 'Atualização executada com sucesso'
        });
      });
    });
  })
  .get(function(req, res) {
    model.findOne({
      _id: req.params.id
    }, function(err, usuario) {
      if (err) {
        res.send(err);

        return;
      }

      if (usuario === null) {
        res.json({
          type: 'error',
          mensagem: 'Usuario não encotrado '
        });

        return;
      }

      res.json(usuario);
    });
  })
  
  .delete(function(req, res) {
    model.remove({
      _id: req.params.id
    }, function(err, usuario) {
      if (err) {
        res.send(err);
      }

      res.json({
        type: 'success',
        mensagem: 'E-mail excluido com sucesso!'
      });
    });
  });

module.exports = router;
