fetch("/api/v1/messages", {
    'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}).then(result => {
    return result.json();
}).then(json => {
    console.log(json);
}).catch(err => {
    console.log('ween ween ween');
    // Redirect to login-screen
    // Delete token in localstorage
});

/* SEND MESSAGE */
let send = document.querySelector('.message__send');
let message = document.querySelector('.message__input');
send.addEventListener("click", (e) => {
    let text = message.value;
    fetch('/api/v1/messages', {
        method: "post",
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            "text": text
        })
    })
    .then(result => {
        return result.json();
    }).then(json => {
        // TODO: add frontend in " " 
        // Give id in delete element
        // TODO: add it to the frontend
        let newMessage = `
            <div class="message">
                <div class="profile__image"></div>
                <div class="message__content">
                    <strong class="message__author">${json.data.message.user}</strong>
                    <p class="message__text">${json.data.message.text}</p>
                </div>
            </div>`
        document.querySelector(".messages").insertAdjacentHTML('afterend', newMessage);
    }).catch(err => {
        console.log(err);
    })
    
    e.preventDefault();
    
})