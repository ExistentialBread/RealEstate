let toggler = document.getElementById("toggler");

Number.prototype.toTime = 
function() {
    let hours = Math.floor(this / 3600);
    let minutes = Math.floor((this % 3600) / 60);
    let seconds = Math.floor((this % 3600) % 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ":" + minutes + ":" + seconds;
};

let toggleLogInSignUp = function(event) {
    
    let logInstead = "Login Instead";
    let signUpInstead = "Sign Up Instead";

    if (toggler.innerText == signUpInstead) {
        document.getElementById("confirmPassword").classList.remove("d-none");
        document.getElementById("loginSignUpButton").innerText = "Sign Up";
        document.getElementById("loginSignUpButton").setAttribute("value", "Sign Up");
        toggler.innerText = logInstead;
    }
    else {
        document.getElementById("confirmPassword").classList.add("d-none");
        document.getElementById("loginSignUpButton").innerText = "Login";
        document.getElementById("loginSignUpButton").setAttribute("value", "Login");
        toggler.innerText = signUpInstead;
    }

}

if (toggler) {toggler.addEventListener("click", toggleLogInSignUp);}

window.addEventListener("load", function() {

        let progressBar = document.getElementById("progressBar");
        let totalTimeStr = document.getElementById("totalTime");
        let timeLeftStr = document.getElementById("timeLeft");

        if (progressBar && totalTime && timeLeft) {
            let totalTime = parseInt(totalTimeStr.innerHTML);
            let timeLeft = parseInt(timeLeftStr.innerHTML);
            let intervalMs = 100.0;
            
            let bar = setInterval(function() {
                timeLeft -= intervalMs/1000;
                if (timeLeft <= 0) {
                    let claim = document.getElementById("claim");
                    console.log(claim);
                    claim.classList.remove("d-none");
                    let quit = document.getElementById("quit");
                    quit.classList.add("d-none");
                    timeLeft = 0;
                    clearInterval(bar);
                }
                let width = parseFloat(timeLeft)/parseFloat(totalTime);
                timeLeftStr.innerText = timeLeft.toTime();
                progressBar.style.width = width * 100 + "%";
            }, intervalMs);
        }

    
});