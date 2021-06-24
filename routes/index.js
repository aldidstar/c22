var express = require("express");
var router = express.Router();
var moment = require("moment");
const { ObjectID } = require("mongodb");

module.exports = function (take) {
  const dbName = "bread";
  const db = take.db(dbName);
  router.get("/", function (req, res, next) {
    db.collection("bread")
      .find()
      .toArray((err, result) => {
        
        res.render("index", { nama: result, moment: moment });
      });
  });

  router.get("/add", (req, res) => res.render("add"));
  router.post("/add", (req, res) => {
    db.collection("bread").insertOne(
      {
        nama: req.body.name,
        berat: req.body.weight,
        tinggi: req.body.height,
        tanggal: req.body.date,
        hubungan: req.body.status,
      },
      (err, result) => {
        if (err) {
          throw err;
        }
       
        res.redirect("/");
      }
    );
  });

  router.get("/delete/:id", (req, res) => {
  
    db.collection("bread").deleteOne({
      _id: ObjectID(`${req.params.id}`),
    });
   
    res.redirect("/");
  });

  router.get("/edit/:id", (req, res) => {

    // let sql = `select * from bread where id='${req.params.id}'`;
    // console.log(sql)
    db.collection("bread")
    .find({_id: ObjectID(`${req.params.id}`)})
    .toArray((err, result) => {
      
      res.render("edit", { nama: result[0], moment: moment });
    });
    });
  
  
  router.post("/edit/:id", (req, res) => {

    db.collection("bread").updateOne(
      {
      _id: ObjectID(`${req.params.id}`),
    },
    {
      $set: {
        nama: req.body.name,
        berat: req.body.weight,
        tinggi: req.body.height,
        tanggal: req.body.date,
        hubungan: req.body.status,
      }
    }
    );
   
    res.redirect("/");
  });
 
  

  return router;
};
