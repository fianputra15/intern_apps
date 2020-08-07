const {
  knex,
  koneksi
} = require("../database/db");
const bcrypt = require('bcrypt')
const fileUpload = require('express-fileupload');
const moment = require('moment');
module.exports = {
  insertAbsenPagi: async (req, res) => {
    try {
      // Ambil Id User
      knex('in_users').where({
        email: req.body.email
      }).then(row => {
        try {
          knex('in_laporanharian').where("id_user", '=', row[0].id)
            .andWhere("absen_pagi", 'like', `${moment(new Date()).format("YYYY-MM-DD")}%`)
            .then(result => {
              if (result[0]) {
                return res.send({
                  message: "sudah"
                });
              } else {
                // Insert Absen Pagi
                knex('in_laporanharian').insert({
                  id_user: row[0].id,
                  absen_pagi: req.body.absenpagi
                }).then(result => {
                  return result ? res.send(true) : res.send(false)
                });
              }
            })

        } catch (err) {
          return res.send(err);
        }
      })
    } catch (err) {
      return res.send(err);
    }
  },
  updateAbsenPulang: async (req, res, next) => {
    if (req.files) {
      const myFile = req.files.laporan;
      myFile.mv(`${__dirname}/../public/laporan/${myFile.name}`, function(err) {
        if (err) {
          console.log(err);
          return res.status(500).send({
            msg: "Error occured"
          });
        } else {
          try {
            knex('in_users').where({
              email: req.body.email
            }).then(row => {
              try {
                knex('in_laporanharian').where('id_user', '=', row[0].id)
                  .andWhere('absen_pagi', 'like', `${req.body.tanggal}%`)
                  .update({
                    absen_pulang: req.body.pulang,
                    laporan: myFile.name
                  }).then(result => {
                    // Mengecek Apakah mahasiswa magang telah absen pagi atau belum
                    if (result) {
                      try {
                        knex('in_laporanharian').where('id_user', '=', row[0].id)
                          .andWhere('absen_pagi', 'like', `${req.body.tanggal}%`)
                          .update({
                            absen_pulang: req.body.pulang,
                            laporan: myFile.name
                          }).then(result => {
                            return result ? res.send(true) : res.send(false);
                          })
                      } catch (e) {
                        return res.send(e);
                      }
                    } else {
                      // Absen Pagi dan Pulang Karena Terlambat
                      try {
                        knex('in_laporanharian').insert({
                          id_user: row[0].id,
                          absen_pagi: req.body.pulang,
                          absen_pulang: req.body.pulang,
                          laporan: myFile.name
                        }).then(result => {
                          return result ? res.send(true) : res.send(false);
                        });
                      } catch (e) {
                        return res.send(e);
                      }
                    }
                  })
              } catch (err) {
                return res.send(err);
              }
            })
          } catch (err) {
            return res.send(err);
          }
        }
      });
    } else {
      return res.send(500);
    }
  },
  getInfoRiwayatAbsen: async (req, res) => {
    try {
      knex('in_users').where("email", '=', req.params.id)
        .then(row => {
          try {
            knex('in_laporanharian').where("id_user", '=', row[0].id)
              .then(result => {
                return res.send(result);
              })
          } catch (e) {
            return res.send({
              message: 'belum'
            });
          }
        })
    } catch (e) {
      console.log(e);
      return res.send({
        message: "tidak"
      });
    }
  },
  getDownloadLaporan: async (req, res) => {
    const file = `${__dirname}/../public/laporan/${req.body.laporan}`;
    return res.download(file);
  },
  getInfoUser: async (req, res) => {
    try {
      knex('in_users').where("email", '=', req.params.id)
        .then(row => {
          try {
            knex('in_magang').where("id_user", '=', row[0].id)
              .then(result => {
                return res.send(result);
              })
          } catch (e) {
            return res.send({
              message: 'belum'
            });
          }
        })
    } catch (e) {
      console.log(e);
      return res.send({
        message: "tidak"
      });
    }
  },
  updatePasswordMagang: async (req, res) => {
    try {
      knex('in_users')
        .where("email", '=', req.body.email)
        .then(row => {
          try {
            if (bcrypt.compareSync(req.body.now, row[0].password)) {
              knex('in_users')
                .where('email', '=', req.body.email)
                .update({
                  "password": bcrypt.hashSync(req.body.new, 5)
                }).then(result => {
                  return result ? res.send({
                    message: "Berhasil"
                  }) : res.send({
                    message: "Gagal"
                  });
                });
            } else {
              return res.send({
                message: 'Password Sekarang Salah'
              });
            }
          } catch (e) {
            return res.send({
              message: e
            });
          }
        })
    } catch (err) {
      return res.send({
        message: "Gagal"
      });
    }
  }
}
