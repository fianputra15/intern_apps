const {
  knex,
  koneksi
} = require('../database/db')
const bcrypt = require('bcrypt')
const moment = require('moment')
const fileUpload = require('express-fileupload');
var error = null;
module.exports = {
  getDataUser: async (req, res) => {
    try {
      let data = await knex.select('a.*', 'b.id as roles')
        .from('in_users as a')
        .join('in_roles as b', 'a.id_roles', 'b.id')
        .where('b.roles', '!=', 'magang');
      res.send(data);
    } catch (e) {
      console.log(e)
    }
  },
  insertDataUser: async (req,res) => {
    try{
      knex('in_users').insert({
        email : req.body.email,
        password: bcrypt.hashSync('pelindo', 5),
        id_roles : req.body.roles
      }).then(result => {
        return result ? res.send(true) : res.send(false);
      })
    }catch(e){
      console.log(`Message : ${e}`);
    }
  },
  deleteDataUser: async (req, res, next) => {
    knex('in_users')
      .where('email', req.params.id)
      .del()
      .then(result => {
        console.log(result)
        return result ? res.send(true) : res.send(false)
      })
  },
  updateDataUser : async (req, res, next) => {
    try {
      knex('in_users').where("id","=",req.body.id)
        .update({
          email : req.body.email,
          id_roles : req.body.roles
        })
        .then((result) => {
          return result ? res.send(true) : res.send(false);
        });
    } catch (err) {

    }
  },
  insertDataRoleUser: async (req, res, next) => {
    try {
      knex('in_roles').insert({
        roles: req.body.role
      }).then(result => {
        return result ? res.send(true) : res.send(false);
      })
    } catch (e) {
      console.log(e);
    }
  },
  getDataRoleUser: async (req, res, next) => {
    try {
      let data = await knex('in_roles')
      res.send(data);
    } catch (e) {
      console.log(e)
    }
  },
  getDataMagang: async (req, res, next) => {
    try {
      let data = await knex.select('a.*', 'b.email')
        .from('in_magang as a')
        .join('in_users as b', 'a.id_user', 'b.id');
      res.send(data);
    } catch (e) {
      console.log(e)
    }
  },
  insertDataMagang: async (req, res, next) => {
    if (!req.files) {
      try {
        knex('in_users').where('email','=',req.body.email)
          .then(result => {
            if(result[0]){
              return res.send({
                message : "Sudah"
              })
            }else{
              try {
                knex('in_users').insert({
                    email: req.body.email,
                    password: bcrypt.hashSync('pelindo', 5),
                    id_roles: 2
                  })
                  .returning('id')
                  .then(function(id) {
                    try{
                      knex('in_magang').insert({
                        nama: req.body.nama,
                        id_user: id,
                        alamat: req.body.alamat,
                        penempatan: req.body.penempatan,
                        jk: req.body.jk,
                        universitas: req.body.universitas,
                        foto: req.body.nama
                      }).then(result => {
                        return result ? res.send(true) : res.send(false);
                      })
                    }catch(err){
                      return res.send(err);
                    }
                    //
                    // return res.status(200).send(req.file)
                  })
              } catch (e) {
                return res.send(e);
              }
            }
          })
      } catch (error) {
        res.send("gagal " + error);
      }
    }else{
      const myFile = req.files.foto;
      //  mv() method places the file inside public directory
      myFile.mv(`${__dirname}/../public/foto/${myFile.name}`, function(err) {
        if (err) {
          return res.status(500).send({
            msg: "Error occured"
          });
        }
        try {
          knex('in_users').where('email','=',req.body.email)
            .then(result => {
              if(result[0]){
                return res.send({
                  message : "Sudah"
                })
              }else{
                try {
                  knex('in_users').insert({
                      email: req.body.email,
                      password: bcrypt.hashSync('pelindo', 5),
                      id_roles: 2
                    })
                    .returning('id')
                    .then(function(id) {
                      try{
                        knex('in_magang').insert({
                          nama: req.body.nama,
                          id_user: id,
                          alamat: req.body.alamat,
                          penempatan: req.body.penempatan,
                          jk: req.body.jk,
                          universitas: req.body.universitas,
                          foto: myFile.name
                        }).then(result => {
                          return result ? res.send(true) : res.send(false);
                        })
                      }catch(err){
                        return res.send(err);
                      }
                      //
                      // return res.status(200).send(req.file)
                    })
                } catch (e) {
                  return res.send(e);
                }
              }
            })
        } catch (error) {
          res.send("gagal " + error);
        }
        // // returing the response with file path and name
        // return res.send({
        //   name: myFile.name,
        //   path: `/${myFile.name}`,
        //   nama: req.body.nama
        // });
      });
    }
  },
  deleteDataMagang: async (req, res, next) => {
    knex('in_users')
      .where('email', req.params.id)
      .del()
      .then(result => {
        console.log(result)
        return result ? res.send(true) : res.send(false)
      })
  },
  updateDataMagang: async (req, res, next) => {
    if (!req.files) {
      try {
        knex('in_users').where('email','=', req.body.oldEmail).
        update({
          email: req.body.email
        }).then(function(id) {
          try {
            knex('in_magang').where('id', '=', req.body.oldId).update({
              nama: req.body.nama,
              alamat: req.body.alamat,
              penempatan: req.body.penempatan,
              jk: req.body.jk,
              universitas: req.body.universitas,
              foto: req.body.oldPhoto
            }).then(result => {
              return result ? res.send(true) : res.send(false);
            })
          } catch (err) {
            console.log(`${err}`);
          }
        })
      } catch (e) {
        res.send({
          message : e
        });
      }
    } else {
      const myFile = req.files.foto;
      myFile.mv(`${__dirname}/../public/foto/${myFile.name}`, function(err) {
        if (err) {
          console.log(err)
          return res.status(500).json({
            msg: "Error occured"
          });
        }
        try {
          knex('in_users').where('email','=',req.body.oldEmail).
          update({
            email: req.body.email
          }).then(function(id) {
            knex('in_magang').where('id', '=', req.body.oldId).update({
              nama: req.body.nama,
              alamat: req.body.alamat,
              penempatan: req.body.penempatan,
              jk: req.body.jk,
              universitas: req.body.universitas,
              foto: myFile.name
            }).then(result => {
              return result ? res.send(true) : res.send(false);
            })
          })
        } catch (error) {
          res.send("gagal " + error);
        }
        // returing the response with file path and name
        // return res.send({
        //   name: myFile.name,
        //   path: `/${myFile.name}`,
        //   nama: req.body.nama
        // });
      });
    }
  },
  insertPengaturanWFH : async(req,res,next) => {
    try {
      await knex('in_pengaturan').delete()
      .then(result => {
        try {
          knex('in_pengaturan').insert({
            start_date : req.body.mulai,
            end_date : req.body.setelah,
            deskripsi : req.body.deskripsi
          })
          .then(result => {
            return result ? res.send(true) : res.send(false)
          });
        } catch (err) {
          return send(`message ${err}`);
        }
      });
    } catch (err) {
      return send(`message ${err}`);
    }


  },
  getPengaturanWFH : async(req,res,next) => {
    try {
      let data = await knex('in_pengaturan')
      res.send(data);
    } catch (err) {
      res.send(err);
    }
  },
  getLaporanHarianMagang : async(req,res,next) => {
    try {
      knex.select('c.nama as nama','c.penempatan', 'b.*')
        .from('in_users as a')
        .join('in_laporanharian as b', 'a.id', 'b.id_user')
        .join('in_magang as c', 'a.id', 'c.id_user')
        .then(value => {
          return res.send(value);
        })
    } catch (err) {
      return res.send(err);
    }
  },
  getUniversitas : async(req,res,next) => {
    try {
      let result = await knex('in_magang').distinct('universitas');
      return res.send(result);
    } catch (err) {
      return res.send(err);
    }
  },
  resetPassword : async(req,res) => {
    try {
      knex('in_users').where("email","=",req.body.email)
        .update({
          password: bcrypt.hashSync('pelindo', 5),
        }).then(result =>{
          return result ? res.send(true) : res.send(false);
        });
    } catch (e) {
      return res.send(e);
    }
  },
  deleteLaporan: async (req, res, next) => {
    knex('in_laporanharian')
      .where('id', req.params.id)
      .del()
      .then(result => {
        return result ? res.send(true) : res.send(false)
      })
  },
  getMagangBelumAbsen : async (req,res) => {
    try{
      knex.select('a.nama as nama','a.penempatan','a.foto', 'b.*')
          .from('in_magang as a')
          .join('in_laporanharian as b','a.id_user','!=', 'b.id_user')
          .andWhere('b.absen_pulang','not like',`${moment(new Date()).format("YYYY-MM-DD")}%`)
          .then(value => {
            return res.send(value);
          })
    }catch (e){
      return res.send(e);
    }
  }
}
