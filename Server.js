
const express = require('express');
const app = express();
const session = require('express-session');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const onvif = require('node-onvif');
require('dotenv').config();



app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 24 * 60000
    }
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(__dirname + '/public'));


app.get("/home", (req, res, next) => {
    let linkvideo = process.env.linkvideo
    const device = new onvif.OnvifDevice({
        xaddr: linkvideo + '/onvif/device_service',
        user: '',
        pass: '',
    });
    device.init().then(() => {
    }).catch(error => {
        console.error('Error:', error);
        // res.redirect('/');
    });

    io.on('connection', (socket) => {
        console.log('A user connected');


        setInterval(() => {
            socket.emit('img', JSON.stringify({ "url": device.current_profile.snapshot }));
        }, 1000 / 30);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
    res.sendFile(__dirname + '/view/home.html');


})

app.post("/home", (req, res) => {
    process.env.linkvideo = req.body.data[0]
    io.on('connection', (socket2) => {
        console.log('Client 2 đã kết nối.');
        socket2.emit('data', (req.body));

    })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html');
});

const post = 200

http.listen(post, () => {
    console.log('Server is running on http://localhost:' + post);
});
