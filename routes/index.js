var express = require("express");
var router = express.Router();
var moment = require("moment");
const { ObjectID } = require("mongodb");

module.exports = function (take) {
  const dbName = "bread";
  const db = take.db(dbName);
  router.get("/", function (req, res, next) {
    const { name, weight, height, date, status, start, end } = req.query;

    const url = req.url == "/" ? "/?page=1" : req.url;
    let page = parseInt(req.query.page || 1);
    const limit = 3;
    const offset = (page - 1) * limit;
    let params = [];
    if (name || weight || height || start || end || status) {
      params.push(
        { name },
        { weight },
        { height },
        { start },
        { end },
        { status }
      );
    }

    if (params.length > 0) {
      if (name) {
        var ObjectName = { nama: name };
      }
      if (weight) {
        var ObjectWeight = { berat: `${weight}` };
      }
      if (height) {
        var ObjectHeight = { tinggi: `${height}` };
      }
      if (status) {
        var ObjectStatus = { hubungan: status };
      }

      var find = {
        ...ObjectName,
        ...ObjectWeight,
        ...ObjectHeight,
        ...ObjectStatus,
      };

      if (start && end) {
        var ObjectDate = { tanggal: { $gte: start, $lte: end } };
        var find = {
          ...ObjectName,
          ...ObjectWeight,
          ...ObjectHeight,
          ...ObjectStatus,
          ...ObjectDate,
        };
      }

      db.collection("bread")
        .find(find)
        .toArray((err, result) => {
          let total = result.length;
          let pages = Math.ceil(total / limit);
          db.collection("bread")
            .find(find)
            .skip(offset)
            .limit(limit)
            .toArray((err, result) => {
              res.render("index", {
                nama: result,
                moment: moment,
                page,
                pages,
                url,
                query: req.query,
              });
            });
        });
    }

    db.collection("bread")
      .find()
      .toArray((err, result) => {
        let total = result.length;
        let pages = Math.ceil(total / limit);
        db.collection("bread")
          .find()
          .skip(offset)
          .limit(limit)
          .toArray((err, result) => {
            res.render("index", {
              nama: result,
              moment: moment,
              page,
              pages,
              url,
              query: req.query,
            });
          });
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
    db.collection("bread")
      .find({ _id: ObjectID(`${req.params.id}`) })
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
        },
      }
    );

    res.redirect("/");
  });

  return router;
};
