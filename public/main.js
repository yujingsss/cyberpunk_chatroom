// make connection, make a request from backend & keep connection alive
let socket = io();

socket.on('connect', function () {
    console.log('connection established...');
});
//socket.on - listening an disconnect event
socket.on('disconnect', function () {
    console.log('lost connection...');
    // alert('lost connection...');
});
socket.on('userquit', function (msg) {
    console.log(msg + ' quit');
});

socket.on('introgreeting', function (msg) {
    const formatTime = moment(msg.createdAt).format('lll');
    // console.log(`${msg.from}: ${msg.text} at ${msg.createdAt}`);
    // console.log('introgreeting', msg);
    let clientname = document.createElement('li');
    clientname.innerText = `${msg.from}, ${formatTime}:\n`;
    clientname.style.color = "rgba(0, 255, 0, 20)";
    clientname.style.listStyle = "none";
    let li = document.createElement('li');
    li.style.listStyle = "none";
    li.innerText = `${msg.text}\n\n`;
    document.querySelector('#typing').append(clientname, li);
});
socket.on('newMessage', function (msg) {
    const formatTime = moment(msg.createdAt).format('lll');
    // console.log('newMessage', msg);
    let chatcontent = document.createElement('li');
    chatcontent.innerText = `${msg.from}, ${formatTime}:\n`;
    chatcontent.style.color = "rgba(0, 255, 0, 10)";
    chatcontent.style.listStyle = "none";
    chatcontent.style.fontSize="13px";
    let li = document.createElement('li');
    li.style.fontSize = "16px";
    li.style.listStyle = "none";
    li.innerText = `${msg.text}\n\n`;
    document.querySelector('#chatbox').append(chatcontent, li);
});

//available users
socket.on('availableusers', function (data) {
    // console.log(data);
    document.getElementById('allusers').innerText = data;
});

//socket.emit(argument1, argument2, callback);
// socket.emit('createMessage', {
//     from: 'x',
//     text: 'hi'
// }, function (msg) {
//     console.log(msg, 'got it');
// });

document.querySelector('#username').addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        let username = document.getElementsByName("nickname")[0].value;
        // console.log(document.getElementsByName("nickname")); = node.list
        let password = document.querySelector('#password');
        if (password.value === 'replicant' && username != '') {
            // console.log("socket.id: " + socket.id);
            // event.preventDefault();
            // console.log(`Welcome, ${username}`);
            hideinputname();
            socket.emit('createName', {
                from: 'User',
                text: username
            });
        } if (password.value != 'replicant' && username != '') {
            let hint = document.createElement('p');
            hint.innerText = 'please enter your correct identity, hint: Blade Runner';
            document.querySelector('#username').appendChild(hint);
        } if (username === '' && password.value === 'replicant') {
            let hint = document.createElement('p');
            hint.innerText = 'please enter a name';
            document.querySelector('#username').appendChild(hint);
        } if (username === '' && password.value != 'replicant') {
            let hint = document.createElement('p');
            hint.innerText = 'please enter a name';
            document.querySelector('#username').appendChild(hint);
        }
    }
});
function hideinputname() {
    document.getElementById("intropage").style.display = "none";
    enterchatroom();
}
function enterchatroom() {
    document.getElementById("chatroom").style.display = "flex";
    let yourname = document.getElementById("yourname");
    yourname.style.color = "rgba(0,255,0,20)";
    yourname.innerText = document.getElementsByName("nickname")[0].value;
}

document.querySelector('#submitmessage').addEventListener('click', function (event) {
    let messagecontent = document.getElementsByName("messagecontent")[0].value;
    let username = document.getElementsByName("nickname")[0].value;
    event.preventDefault();
    socket.emit('createMessage', {
        from: username,
        text: messagecontent
    }, function (msg) { console.log(msg + "send messages"); });
    document.getElementsByName("messagecontent")[0].value = '';
});

document.querySelector('#send-location').addEventListener('click', function () {
    event.preventDefault();
    let username = document.getElementsByName("nickname")[0].value;
    if (!navigator.geolocation) {
        return alert('You are at Nowhere');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        // console.log(position);
        socket.emit('createLocationMessage', {
            from: username,
            lat: position.coords.latitude,
            long: position.coords.longitude
        });
    }, function () {
        alert('unable to fetch location');
    });
});

socket.on('newLocationMessage', function (msg) {
    // console.log('newLocationMessage', msg);
    const formatTime = moment(msg.createdAt).format('lll');
    let chatcontent = document.createElement('li');
    chatcontent.innerText = `${msg.from}, ${formatTime}:\n`;
    chatcontent.style.color = "rgba(0, 255, 0, 20)";
    chatcontent.style.listStyle = "none";
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', msg.url);
    a.innerText = `My Current Spot\n\n`;
    a.style.textDecoration = "underline";
    a.style.color = "white";
    a.addEventListener('mouseenter', function () {
        a.style.color = "red";
    });
    a.addEventListener('mouseleave', function () {
        a.style.color = "white";
    });
    li.style.listStyle = "none";
    li.appendChild(a);
    document.querySelector('#chatbox').append(chatcontent, li);
});

socket.on('connect_error', (error) => {
    console.log('connection error...');
    // alert('connection error...');
});
socket.on('error', (error) => {
    console.log('error occurs...');
    // alert('error occurs...');
});

