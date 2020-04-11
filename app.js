
function ready(){
    console.log('Document have been succesfully loaded');
}
document.addEventListener("DomContentLoader", ready());
VK.init({apiId:7403845});

if (localStorage.id === undefined || localStorage.id === ''){
    document.getElementById('vkLogout').hidden = true;
    document.getElementById('vkFriends').hidden = true;
    document.getElementById('friendsList').hidden = true;
}
else{
    document.getElementById('vkLogin').hidden = true;
}
document.getElementById('vkLogin').onclick = function(){
    console.log("login");
    VK.Auth.login(function (response) {
        console.log(response);
        if(response.status === 'connected'){
            localStorage.id = response.session.user.id;
            console.log('yes');document.getElementById('vkLogin').hidden = true;
            document.getElementById('vkLogout').hidden = false;
            document.getElementById('vkFriends').hidden = false;
            //document.getElementById('friendsList').hidden = false;

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
    console.log("logout");
    VK.Auth.logout(function(response){
        console.log(response);
        document.getElementById('vkLogin').hidden = false;
        document.getElementById('vkLogout').hidden = true;
        document.getElementById('vkFriends').hidden = true;
        document.getElementById('friendsList').hidden = true;
        localStorage.id = '';
    });

};

document.getElementById('vkFriends').onclick = function () {
    console.log('friends');
    var ul = document.getElementById('friendsList');
    var li = document.createElement('li');
    li.style.textAlign = "center";
    li.style.fontWeight = "bold";
    li.style.fontSize = "20pt";
    li.innerHTML = "Ваши друзья";
    if(ul.childElementCount != 0){
        ul.removeChild(ul.firstElementChild);
    }

    ul.appendChild(li);
    document.getElementById('friendsList').hidden = false;
    VK.Api.call(
        'friends.get',{
            user_id: localStorage.id,
            count: 5,

        }, function (response){
            let list = document.createElement("li");
            for(let i = 0; i < response.response.items.length; i++){
                let friend = response.response.items[i];
                list.appendChild(friend.first_name + " " + friend.last_name);
            }
            list.innerHTML(list);
    })
};

