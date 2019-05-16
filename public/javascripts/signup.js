document.querySelector(".submit").addEventListener("click", (e) => {

    let username = document.querySelector(".username").value;
    let password = document.querySelector(".password").value;

    fetch('/users/signup', {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.status === "success") {
            let feedback = document.querySelector(".feedback");
            feedback.textContent = "Login failed."
            feedback.classList.remove("hidden");
            
            let token = json.data.token;
            localStorage.setItem("token", token);
            window.location.href = "/";

        } 
    })
});