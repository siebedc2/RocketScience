
// PRIMUS LIVE
// aanpassen voor online versie
primus = Primus.connect("http://localhost:3000", {
    reconnect: {
        max: Infinity,
        min: 500,
        retries: 10
    }
});

// als de actoe addMessage is dan moet je een bericht toevoegen
primus.on('data', (json) => {
    // to add a message
    if(json.action === "addMessage") {
        appendMessage(json.data);
    }

    // to delete a message
    if(json.action === "removeMessage") {
        removeMessage(json.data);
    }

    // to update a message
    if(json.action === "updateMessage") {
        updateMessage(json.data);
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
        <div class="message" data-id="${element._id}">
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

let removeMessage = (json) => {
    console.log('delete message with primus');
    console.log(json);
    // get id of message to delete
    // delete message from chat
    let message = document.querySelector(`[data-id = '${json.id}']`);
    message.style.display = "none";
}

let updateMessage = (json) => {
    console.log('update message with primus');
    console.log(json);
    // get id of message to update
    // get the input element
    let inputField = document.querySelector(`[data-id = '${json.data.message._id}']`).children[1].children[1];
    // create p tag to change with input field
    let messageElem = document.createElement('p');
    // set the classes
    messageElem.classList.add('message__text');
    // variabal with the new text
    let newTextMessage = json.data.message.text;
    // fill innerHTML with new message
    messageElem.innerHTML = newTextMessage;   
    //console.log(messageElem);
    // replace the input field with a p tag
    inputField.parentNode.replaceChild(messageElem, inputField);

}

/* append a message */
let appendMessage = (json) => {
    let newMessage = `
        <div class="message" data-id="${json.data.message._id}">
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
        // appendMessage(json);

    }).catch(err => {
        console.log(err);
    })
    
    // get prefix for bot
    let prefix = text.substr(0, 5);

    if ( prefix == '@bot ' ) {
        // bot word aangesproken
        // query pakken zonder prefix
        let botMessage = text.substr(5, 275);
        bot(botMessage);
    } else {
        // bot word niet aangesproken
    }

    e.preventDefault();
})
/* end of post a message */

class Weather {
    getWeather(lat, lng) {
        const API_KEY = "9c629e9e940a315667e2ecd2850ee870";
        let url = `//cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${API_KEY}/${lat},${lng}?units=si`;
        fetch(url)
            .then(response => {
                return response.json();
            }) 
            .then(json => {
                let temp = document.createElement("h1");
                temp.innerHTML = json.currently.summary;
                document.querySelector(".container").appendChild(temp);
                let gif = json.currently.icon;
                switch (gif) {
                    case "partly-cloudy-day":
                        this.getGif("cloudy");
                        break;

                    case "partly-cloudy-night":
                        this.getGif("moon");
                        break;

                    case "clear-day":
                        this.getGif("sunny");
                        break;

                    case "clear-night":
                        this.getGif("moon");
                        break;
                
                    default:
                        this.getGif(gif);
                        break;
                }
            });
    }
}

/* get answer from bot  */
function bot(botMessage) {
    const q = encodeURIComponent(botMessage);
    const uri = 'https://api.wit.ai/message?q=' + q;
    const auth = 'Bearer ' + '2LCPS4V4QI2JERU7OQV3VWAM5M45MXN7';
  
    fetch(uri, {headers: {Authorization: auth}})
        .then(res => {
            return res.json()
        })
        .then(result => {
            console.log(result)

            let intent = result.entities.intent[0].value
            console.log('intent: ', intent);

            if ( intent == 'get_weather' ) {
                // wheater
                let lat = result.entities.location[0].resolved.values[0].coords.lat;
                let lng = result.entities.location[0].resolved.values[0].coords.long;

                let wheater = new Weather();
                wheater.getWeather(lat, lng);

            } else if ( intent == 'get_skills' ) {
                // skills
            } else {
                // nothing
                console.log("command not found...");
            }

        })
        .catch(err => {
            console.log("Error:", err);
        })
}

/* delete a message */
document.querySelector(".messages").addEventListener("click", (e) => {
    if(e.target.classList.contains("message__delete")) {
        let messageId = e.target.getAttribute("data-id");
        let messageElem = e.target.parentElement.parentElement;
        //console.log(messageElem);

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
            
            primus.write({
                "action": "removeMessage",
                "data": json
            });            
            
            //console.log(json);
            
            
        }).catch(err => {
            console.log(err);
        })
    }
})
/* end of delete a message */


/* edit a message */
document.querySelector(".messages").addEventListener("click", (e) => {
    if(e.target.classList.contains("message__edit")) {
        let messageId = e.target.getAttribute("data-id");
        
        // get value of message
        let messageElem = e.target.previousElementSibling.previousElementSibling;
        //console.log(messageElem);

        // put it in an input-field
        let inputField = document.createElement('input');
        inputField.classList.add('message__text', 'input__message');
        inputField.value = messageElem.innerHTML;

        // change p tag to input field
        messageElem.parentNode.replaceChild(inputField, messageElem);

        // enter -> bericht aanpassen
        inputField.addEventListener("keypress", (e) => {
            if (event.keyCode == 13 || event.which == 13) {
                
                let newMessage = inputField.value;
                    
                fetch('/api/v1/messages/'+messageId, {
                    method: "put",
                    'headers': {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        "messageId": messageId,  
                        "text": newMessage
                    })
                })
                .then(result => {
                    return result.json();
                }).then(json => {
                    
                    primus.write({
                        "action": "updateMessage",
                        "data": json
                    });   

                }).catch(err => {
                    console.log(err);
                })
            
            }
        })
    }
})
/* end of edit a message */