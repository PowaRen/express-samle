// index.js
var express = require('express');
var loki = require('lokijs');
var bodyParser = require('body-parser');

var db = new loki('mydb.json', {
    autosave: true,
    autosaveInterval: 1000
});
var notes;
var users;
db.loadDatabase({}, function (err) {
    notes = db.getCollection('notes');
    users = db.getCollection('users');
});

var app = express();

// 加入靜態檔案資料夾路徑
app.use(express.static(__dirname + '/www'));

// 加入BodyParser來解析POST的內容
app.use(bodyParser.urlencoded({
    extended: false
}));


app.set('views', __dirname + '/views');
// 設定使用的引擎為ejs
app.set('view engine', 'ejs');
app.get('/home', function (req, res) {

    console.log(req.query.name);
    res.render('home', {
        title: "Hi " + req.query.name,
        notes: notes.find({})
    });
    res.end();
});

//如果有人打index自動導到Home
app.get('/', function (req, res) {
    res.redirect('/home');
});

app.get('/login', function (req, res) {
    res.render('login', {
        message: "請輸入帳號密碼"
    });
    res.end();
});

app.post('/login', function (req, res) {
    res.render('login', {
        message: "登入失敗，請重新輸入帳號密碼"
    });
    res.end();
});

app.get('/signup', function (req, res) {
    res.render('signup', {
        message: ""
    });
    res.end();
});


app.get('/notes', function (req, res) {
    res.render('notes', {
        notes: notes.data
    });
    res.end();
});


app.post('/notes', function (req, res) {

    notes.insert({
        color: req.body.note_color,
        text: req.body.note_text
    });

    res.render('notes', {
        notes: notes.data
    });
    res.end();
});

app.post('/signup', function (req, res) {
    console.log(req.body.name);
    console.log(req.body.password);

    // 查詢帳號是否存在
    var user = users.find({
        name: req.body.name
    });

    var message;
    if (user.length > 0) {
        message = "此帳號已經存在，請重新註冊";

    } else {
        users.insert({
            name: req.body.name,
            password: req.body.password
        });
        message = "註冊成功";
    }

    res.render('signup', {
        message: message
    });

    res.end();
});


app.listen(1234);