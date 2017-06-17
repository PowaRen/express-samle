// index.js
var express = require('express');
var loki = require("lokijs");
var db = new loki('mydb.json');
/*db.loadDatabase({});
var notes = db.getCollection('notes');*/
var notes = db.addCollection('notes');
for (var i = 1; i <= 10; i++) {
    notes.insert({
        text: "筆記" + i
    });
}

//db.saveDatabase();

var app = express();

// 加入靜態檔案資料夾路徑
app.use(express.static(__dirname + '/www'));
app.set('views', __dirname + '/views');
// 設定使用的引擎為ejs
app.set('view engine', 'ejs');

app.get('/home', function (req, res) {
    res.render('home', {
        title: "Hi EJS",
        notes: notes.find({})
    });
    res.end();
});

app.listen(1234);