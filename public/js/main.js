
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBoJ6lhOYCWP-VI4SsYA8D5_AJH6ZvVygo",
    authDomain: "rapido-f3769.firebaseapp.com",
    projectId: "rapido-f3769",
    storageBucket: "rapido-f3769.appspot.com",
    messagingSenderId: "646203535174",
    appId: "1:646203535174:web:d81e523e5d03a5fda6bf47",
    measurementId: "G-3ENR34G33X",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

function initFirebaseMessagingRegistration() {
    messaging.requestPermission().then(function () {
        return messaging.getToken()
    }).then(function (token) {
        var $deviceToken = $('#device_token');
        $deviceToken.val(token);

        //$(`#device_token`).attr('value', token);
        /*$.post("{{ route('fcmToken') }}", {
            _method: "PATCH",
            token
        }).then(({
            data
        }) => {
            console.log(data)
        }).catch(({
            response: {
                data
            }
        }) => {
            console.error(data)
        })*/

    }).catch(function (err) {
        console.log(`Token Error :: ${err}`);
    });
}

initFirebaseMessagingRegistration();

messaging.onMessage(function ({
    data: {
        body,
        title
    }
}) {
    new Notification(title, {
        body
    });
});