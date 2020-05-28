if(!localStorage.getItem('username'))
{
    window.location.href = '/register';
} else {
    if(localStorage.getItem('channel'))
    {
        window.location.href = `/${localStorage.getItem('channel')}`;
    }
} 
document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('#begin').onclick = ()=>{
        window.location = '/BBC%20channel';
    };
});