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