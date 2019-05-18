
// PRIMUS LIVE
primus = Primus.connect("http://localhost:3000", {
    reconnect: {
        max: Infinity,
        min: 500,
        retries: 10
    }
});

// als de actoe addMessage is dan moet je een bericht toevoegen
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

    console.log(json);

    json.data.messages.forEach(function(element) {
        console.log(element);
                   
        let newMessage = `
        <div class="message">
            <div class="profile__image"></div>
            <div class="message__content">
                <strong class="message__author">${element.user}</strong>
                <p class="message__text">${element.text}</p>
                <a class="message__delete" href="#" data-id="${element._id}">Delete</a>
                <a class="message__edit" href="#" data-id="${element._id}">Edit</a>
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
                <a class="message__delete" href="#" data-id="${json.data.message._id}">Delete</a>
                <a class="message__edit" href="#" data-id="${json.data.message._id}">Edit</a>
            </div>
        </div>`;
                
    document.querySelector(".messages").insertAdjacentHTML('beforeend', newMessage);
}


/* Bericht sturen */
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
/* end of post a message */

/* delete a message */
document.querySelector(".messages").addEventListener("click", e => {
    if(e.target.classList.contains("message__delete")) {
        let messageId = e.target.getAttribute("data-id");
        
        fetch('/api/v1/messages/' + messageId, {
            method: "delete",
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                "messageId": messageId
            })
        })
        .then(result => {
            return result.json();
        }).then(json => {
            console.log(json);
    
        }).catch(err => {
            console.log(err);
        })

    }
})
/* end of delete a message */


/* edit a message */
document.querySelector(".messages").addEventListener("click", e => {
    if(e.target.classList.contains("message__edit")) {
        let messageId = e.target.getAttribute("data-id");
        
        // get value of message
        // put it in an input-field
        // messageElement.parentNode.replaceChild(inputField, messageElement);
        // enter -> bericht aanpassen

        
        fetch('/api/v1/messages/'+messageId, {
            method: "put",
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                "messageId": messageId,
                "text": text
            })
        })
        .then(result => {
            return result.json();
        }).then(json => {
            console.log(json);
    
        }).catch(err => {
            console.log(err);
        })

    }
})
/* end of edit a message */