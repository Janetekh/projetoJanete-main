'use strict';


const jwt = require('jsonwebtoken');


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


function verifyJWT(req, res){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Não possui token' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Falha de autenticacao de token' });
      
      
      req.userId = decoded.id;
      
    });
}

var express = require('express'),
  model = require('../models/model.js'),


  router2 = express.Router();

  router2.route('/login')
  
  .post(function(req, res) {
    var dados = req.body;
    console.log(dados['email'])
    var email = dados['email']
    var senha = criptografar(dados['senha'])

    
    model.findOne({email:email}, function(err, docs) {
        if (err) {
          res.send(err);
  
          return;
        }
        
      
      
        if (docs['senha'] == senha) {
            
        const id = docs['_id'];
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 300 // expires in 5min
        });
        return res.json({ auth: true, token: token });
        }

        var teste = ""
          
        
        res.status(500).json({message: 'Login inválido!'});

      
      
      });

      router2.route('/acesso')
      .get(function(req, res){
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).json({ auth: false, message: 'Não possui token' });
    
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) return res.status(500).json({ auth: false, message: 'Falha de autenticacao de token' });
      
      
            req.userId = decoded.id;
            res.status(200).json({auth: true, message:'Deu boa'})
            console.log(req.userId)
        });

      
      })})

  module.exports = router2;