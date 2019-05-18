
// PRIMUS LIVE
primus = Primus.connect("http://localhost:3000", {
    reconnect: {
        max: Infinity,
        min: 500,
        retries: 10
    }
});

primus.on('data', (json) => {
    if(json.action === "addMessage") {
        appendMessage(json.data);
    }
});


fetch("/api/v1/messages", {
    'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}).then(result => {
    return result.json();
}).then(json => {
    json.data.messages.forEach(function(element) {
        console.log(element);
        
        let newMessage = `
            <div class="message">
                <div class="profile__image"></div>
                <div class="message__content">
                    <strong class="message__author">${element.user}</strong>
                    <p class="message__text">${element.text}</p>
                </div>
            </div>`;
        document.querySelector(".messages").insertAdjacentHTML('beforeend', newMessage);
    });


}).catch(err => {
    console.log('ween ween ween');
    // Redirect to login-screen
    window.location.href = "/users/login";
    // Delete token in localstorage
    window.localStorage.removeItem('token');

});

/* append a message */
let appendMessage = (json) => {
    let newMessage = `
        <div class="message">
            <div class="profile__image"></div>
            <div class="message__content">
                <strong class="message__author">${json.data.message.user}</strong>
                <p class="message__text">${json.data.message.text}</p>
            </div>
        </div>`;
                
    document.querySelector(".messages").insertAdjacentHTML('beforeend', newMessage);
}


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
        //console.log(json.data.message.text);
        message.value = "";

        primus.write({
            "action": "addMessage",
            "data": json
        });

        // Anders kreeg je dubbele berichten
        //appendMessage(json);

    }).catch(err => {
        console.log(err);
    })
    
    e.preventDefault();
    
})