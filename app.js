
function ready(){
    console.log('Document have been succesfully loaded');
}
document.addEventListener("DomContentLoader", ready());
VK.init({apiId:7403845});
if (localStorage.id === undefined || localStorage.id === ''){
    document.getElementById('vkLogout').hidden = true;
    document.getElementById('vkFriends').hidden = true;
}
else{
    document.getElementById('vkLogin').hidden = true;
}
document.getElementById('vkLogin').onclick = function(){
    VK.Auth.login(function (response) {
        console.log(response);
        if(response.status === 'connected'){
            localStorage.id = response.session.user.id;
            console.log('yes');document.getElementById('vkLogin').hidden = true;
            document.getElementById('vkLogout').hidden = false;
            document.getElementById('vkFriends').hidden = false;
            document.getElementById('friendsList').hidden = false;

        }
        else if(response.status === 'not_authorized '){
            console.log("You need to allow the application to use your private data");
        }
        else if(response.status === 'unknown '){
            console.log("You need to register in Vkontakte");
        }

    }, VK.access.FRIENDS)

};
document.getElementById('vkLogout').onclick = function(){
    VK.auth.logout(function(response){
        console.log(response);
        localStorage.id = '';
        document.getElementById('vkLogin').hidden = false;
        document.getElementById('vkLogout').hidden = true;
        document.getElementById('vkFriends').hidden = true;
        document.getElementById('friendsList').hidden = true;
    });

};

