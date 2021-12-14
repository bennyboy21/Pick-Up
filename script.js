var allInfo = {
    Street: null,
    postalCode: null,
    date: null
}

var allowRequest = false;
var requestSentPreviously = false

const successfulLookup = position => {
    const { latitude, longitude } = position.coords;
    // fetch('https://api.opencagedata.com/geocode/v1/json?key=207dd37d22b8482dbc8c536573596a6c&q=52.3877830%2C+9.7334394&pretty=1&no_annotations=1')
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=207dd37d22b8482dbc8c536573596a6c&pretty=1&no_annotations=1`)
    .then(response => response.json())
    .then(result => {
        let allDetails = result.results[0].components;
        let {state, suburb, road, postcode} = allDetails;
        allInfo.Street = road;
        allInfo.postalCode = postcode;
        document.getElementById("address").innerHTML = ": " + road
        document.getElementById("postal-Code").innerHTML = ": " + postcode
        allowRequest = true
    })
    // .then(console.log)
}

if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(successfulLookup, errorLocation);
} 

function errorLocation() {
    allowRequest = false
    document.getElementById("address").innerHTML = ": Somewhere"
    document.getElementById("postal-Code").innerHTML = ": Somewhere"
}

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
document.getElementById("date").innerHTML = ": " + today;
allInfo.date = today;

var key = localStorage.getItem("Last Sent")

document.getElementById("no-Location").style.display = "none"

const firebaseConfig = {
    apiKey: "AIzaSyB8lTLxpMssHPBogei0q5bn8ZE7PAqL3jo",
    authDomain: "pick-up-ffe64.firebaseapp.com",
    databaseURL: "https://pick-up-ffe64-default-rtdb.firebaseio.com",
    projectId: "pick-up-ffe64",
    storageBucket: "pick-up-ffe64.appspot.com",
    messagingSenderId: "613177248799",
    appId: "1:613177248799:web:d3cac871578e8b8729992a",
    measurementId: "G-ZMB625T4Q8"
};

firebase.initializeApp(firebaseConfig);

document.getElementById("submit-Request").addEventListener("click", function() {
    if(key != today) {
        if(requestSentPreviously == false) {
            if(allowRequest == true) {
                firebase.database().ref("Requests").push().set({
                    "Street": allInfo.Street,
                    "Postcode": allInfo.postalCode,
                    "Date": allInfo.date
                });
                document.getElementById("success-Notification").style.animation = "showNotification 7s forwards"
                requestSentPreviously = true;
                localStorage.setItem("Last Sent", today)
            } else {
                document.getElementById("no-Location").style.display = "flex"
                document.getElementById("no-Location").style.animation = "showError 1s forwards"
                document.getElementById("no-Location-Container").style.animation = "showErrorCard 1s forwards ease"
            } 
        } else {
            document.getElementById("error-Notification").style.animation = "showNotification 7s forwards"
        }
    } else {
        document.getElementById("error-Notification").style.animation = "showNotification 7s forwards"
    }
})

document.getElementById("help-Info").addEventListener("click", function() {
    window.open("https://www.canada.ca/en/environment-climate-change/services/managing-reducing-waste.html")
})