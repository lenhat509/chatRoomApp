if(localStorage.getItem('username'))
{
    window.location.href = '/';
}
document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('form').onsubmit = ()=>{
        const username = document.querySelector('input').value.trim();
        if(username)
        {
            localStorage.setItem('username', username);
            window.location.href = '/';
        }
    }
});