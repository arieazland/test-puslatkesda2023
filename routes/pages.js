const Express = require("express");
const app = Express();
const axios = require('axios');
const Router = Express.Router();
const Dotenv = require("dotenv");
// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

Dotenv.config({ path: './.env' });
// const Connection = require ("../DBconnection");

/** Route for home */
Router.get('/', (req, res) => {
    res.send("Hello, welcome to API-DINKES-test Page")
})

/** Route for data rs covid */
Router.get('/datarscovid', (req, res) => {
    let res1 = res;
    url = process.env.COVID_URL;
    axios.get(url)
    .then(function (res) {
        var datacovid = res.data;
        console.log(datacovid);
    })
    .catch(function (err) {
    console.log(err);
    })
})

/** route for rs */
Router.get('/datars', (req, res) => {
    let res1 = res;
    url = process.env.RS_URL;
    axios.get(url)
    .then(function (res) {
        var datars = res.data;
        console.log(datars);
    })
    .catch(function (err) {
    console.log(err);
    })
})

/** Route for join */
Router.get('/join', (req, res) => {
    let res1 = res;
    /** get data RS Covid */
    url1 = process.env.COVID_URL;
    axios.get(url1)
    .then(function (res) {
        var datacovid = res.data;

        /** get data RS */
        let res1 = res;
        url2 = process.env.RS_URL;
        axios.get(url2)
        .then(function (res, next) {
            var datars = res.data;

            /** join data */
            var mergedSatu = [];
            var mergedDua = [];

            for(var j in datars){
                for (var i in datacovid) {
                    /** get jenis RS = RSUD */
                    if (datars[j].jenis_rumah_sakit === "Rumah Sakit Umum Daerah") {
                        /** get character awal nama rs covid = RSUD */
                        if (datacovid[i].nama_rumah_sakit.substring(0, 4) === "RSUD") {
                            /** cek jika nama rs dan nama rs di data rs covid sama */
                            var namaRSBesar = datars[j].nama_rumah_sakit.toUpperCase();
                            var namaRSCovidBesar = datacovid[i].nama_rumah_sakit.toUpperCase();
                            if (namaRSBesar === namaRSCovidBesar.substring(5)) {
                                mergedSatu.push({ ...datacovid[i], ...datars[j] })
                            }
                        }
                    }
                    /** get jenis RS = Rumah Sakit Umum */
                    if (datars[j].jenis_rumah_sakit === "Rumah Sakit Umum") {
                        /** get character awal nama rs covid = RS */
                        if (datacovid[i].nama_rumah_sakit.substring(0, 2) === "RS") {
                            /** cek jika nama rs dan nama rs di data rs covid sama */
                            var namaRSBesar = datars[j].nama_rumah_sakit.toUpperCase();
                            var namaRSCovidBesar = datacovid[i].nama_rumah_sakit.toUpperCase();
                            if (namaRSBesar === namaRSCovidBesar.substring(3)) {
                                mergedDua.push({ ...datacovid[i], ...datars[j] })
                            }
                        }
                    }
                }
            }

            /** print out data */
            // res.status(200).json({
            //     mergedSatu,
            //     mergedDua
            // });
            console.log(mergedSatu);
            console.log(mergedDua);

        })
        .catch(function (err) {
        // console.log(err);
        //var message = err.response.data.message;
        console.log(err);
        })
    })
    .catch(function (err) {
    // console.log(err);
    //var message = err.response.data.message;
    console.log(err);
    })
})


module.exports = Router;