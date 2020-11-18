const express = require("express")
const http = require("http")
const axios = require("axios")

var fs = require('fs')
var request = require('request');

const apiport = 3080

const app = express();
const server = http.createServer(app)

// // url example : https://prnt.sc/le6557

function getRandomURL() { return 'https://prnt.sc/' + getRandomLetters() + getRandomNumbers(); }
function getRandomLetters() { return String.fromCharCode(97 + Math.floor(Math.random() * 26)) + String.fromCharCode(97 + Math.floor(Math.random() * 26)) }
function getRandomNumbers() { return Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() }
function getImageURL(s) { return s.split('<img class="no-click screenshot-image"')[1].split('src="')[1].split('" crossorigin="anonymous"')[0] }

function download(uri, filename, callback) {
    try {
        request.head(uri, function (err, res, body) { request(uri).pipe(fs.createWriteStream(filename)).on('close', callback) });
    } catch (error) {
        console.log('error')
    }
};

function aplcall(res) {
    var url = getRandomURL();
    axios(url, {
        crossDomain: true,
        method: 'GET',
    })
        .then((r) => {
            var imageurl = getImageURL(r.data)
            if ('//st.prntscr.com/2020/08/01/0537/img/0_173a7b_211be8ff.png' == imageurl) {
                console.log('error with url ' + url)
                aplcall(res);
                return;
            }
            console.log(url);
            download(imageurl, 'temp.png', function () {
                fs.copyFile(__dirname + '/temp.png', __dirname + '/images/' + url.split("prnt.sc/")[1] + '.png', (err) => {
                    if (err) throw err;
                });
                res.sendFile(__dirname + '/index.html')
            })
        })
}

app.get('/', (req, res) => {
    aplcall(res);
})

app.get('/image', (req, res) => {
    res.sendFile(__dirname + '/temp.png')
})

app.listen(apiport);
console.log('listening on port', apiport)