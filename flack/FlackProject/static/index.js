
if(!localStorage.getItem('username'))
{
    window.location.href = '/register';
}
sessionStorage.setItem('username', localStorage.getItem('username'));
sessionStorage.setItem('channel', localStorage.getItem('channel'));

const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
document.addEventListener('DOMContentLoaded', ()=>{
    socket.on('connect', ()=>{
        showMessages(sessionStorage.getItem('channel'));
        document.querySelector('#form').onsubmit = ()=>{
           const name = document.querySelector('#name').value;
           if(name)
           {
               socket.emit('new channel', {'channel': name});
           }
           return false; 
        };
        document.querySelector('#message').onsubmit = ()=>{
            const content = document.querySelector('#content').value;
            if(content)
            {
                data = {
                    'channel': sessionStorage.getItem('channel'), 
                    'body': content, 
                    'username': sessionStorage.getItem('username')
                };
                socket.emit('new message', data );
            }
            document.querySelector('#content').value='';
            return false;
        };
    });
    socket.on('join announce', data =>{
        if(!data.stillIn)
        {
            showUser(data.username);
        }
    });

    socket.on('leave announce', data =>{
        let div = document.querySelector(`#${data.username.trim().replace(/[\s]/g, '')}`);
        if(!data.stillIn)
        {
            document.querySelector('#join-list').removeChild(div);
        }
    });

    socket.on('add channel', data =>{
        if(data.success)
        {
            createDiv(data.name);
            document.querySelector('#name').value='';
        }
    });
    
    socket.on('add message', data =>{
        display(data);
        document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight;
    });
    document.querySelector('#logout').onclick = ()=>{
        socket.emit('leave', {
            'channel': sessionStorage.getItem('channel'),
            'username': sessionStorage.getItem('username')
        });
        sessionStorage.setItem('username', '');
        sessionStorage.setItem('channel', '');
        window.location.href = '/';
    };
    return false;
});

function createDiv(channel){
    const div = document.createElement('div');
    div.dataset.channelname = channel;
    div.innerHTML = channel;
    div.className ='channel-btn';
    document.querySelector('#channel-list').append(div);
}
window.onbeforeunload = ()=>{
    if(sessionStorage.getItem('username'))
    {
        socket.emit('leave', {
            'channel': sessionStorage.getItem('channel'),
            'username': sessionStorage.getItem('username')
        });
    }
    localStorage.setItem('username', sessionStorage.getItem('username'));
    localStorage.setItem('channel', sessionStorage.getItem('channel'));
};

document.addEventListener('click', (event) =>{
    const element = event.target;
    if(element.className==='channel-btn')
    {
        if(sessionStorage.getItem('channel') !== element.dataset.channelname)
        {
            socket.emit('leave', {
                'channel': sessionStorage.getItem('channel'),
                'username': sessionStorage.getItem('username')
            });
            showMessages(element.dataset.channelname);
            history.pushState({channelName:element.dataset.channelname},"", element.dataset.channelname);
        }
    }
});

window.onpopstate = (event)=>{
    if(event.state)
    {
        if(sessionStorage.getItem('channel') !== event.state.channelName)
        {
            socket.emit('leave', {
                'channel': sessionStorage.getItem('channel'),
                'username': sessionStorage.getItem('username')
            });
            showMessages(event.state.channelName);
        }
    }
}

function showMessages(channel) {
    document.querySelector('#messages').innerHTML='';
    document.querySelector('#join-list').innerHTML='';
    const data={
        method:'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body: channel
    };
    fetch('/messages', data)
    .then(res => res.json())
    .then(data => {
        data.messages.forEach(display);
        document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight;
        data.users.forEach(user => {
                let div = document.querySelector(`#${user.trim().replace(/[\s]/g, '')}`);
                if(!div)
                {
                    showUser(user);
                } 
            }
        );
    });
    sessionStorage.setItem('channel', channel);
    socket.emit('join',  {
        'channel': channel,
        'username': sessionStorage.getItem('username')
    });
    
}
function showUser(username){
    const div = document.createElement('div');
    div.innerHTML=username;
    div.id= username.trim().replace(/[\s]/g, '');
    document.querySelector('#join-list').append(div);
}
function display(message){
    const h5 = document.createElement('h5')
    h5.innerHTML=message.username;
    const h6 = document.createElement('h6')
    h6.innerHTML=message.time;
    const p = document.createElement('p');
    p.innerHTML=message.body;
    const div = document.createElement('div');
    div.append(h5);
    div.append(h6);
    div.append(p);
    if(message.username === sessionStorage.getItem('username'))
    {
        div.style.alignSelf='flex-end';
        div.style.background='#48c6ef';
    } else {
        div.style.alignSelf='flex-start';
        div.style.background='#6f86d6';
    }
    document.querySelector('#messages').append(div);
}