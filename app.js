
function ready(){
    console.log('Document have been succesfully loaded');
}
document.addEventListener("DomContentLoader", ready());
VK.init({apiId:7403845});

if (!localStorage.id){
    document.getElementById('vkLogout').hidden = true;
}
else{
    document.getElementById('vkLogin').hidden = true;
}



document.getElementById('vkLogin').onclick = function(){
    login();
};

function login(){
    VK.Auth.login(function (response) {
        if(response.status === 'connected'){
            localStorage.id = response.session.user.id;
            console.log('connected');
            document.getElementById('vkLogin').hidden = true;
            document.getElementById('vkLogout').hidden = false;
            /* сохраняем имя и фамилию пользователя*/
            localStorage.name = response.session.user.first_name;
            localStorage.surname = response.session.user.last_name;
            name();
            getFriends();
        }
        else if(response.status === 'not_authorized '){
            console.log("You need to allow the application to use your private data");
        }
        else if(response.status === 'unknown '){
            console.log("You need to register in Vkontakte");
        }
    }, VK.access.FRIENDS);
}


function name() {
    if(localStorage.name && localStorage.surname){
        var hi = document.getElementById('hello');
        var hey = document.createElement('span');
        hey.style.display = "flex";
        hey.style.justifyContent = "center";
        hey.style.fontWeight = "bold";
        hey.style.fontSize = "20pt";
        hey.style.margin = "15px";
        hey.style.color = "#4a76a8";
        hey.innerHTML = "Добро пожаловать, " + localStorage.name + " " + localStorage.surname + "!";
        if(hi){
            while (hi.firstElementChild){
                hi.removeChild(hi.firstElementChild);
            }
        }
        hi.appendChild(hey);
    }
}
function getFriends() {
    if (localStorage.name && localStorage.surname) {
        VK.Api.call('friends.get',
            {
                user_id: localStorage.id,
                count: 5,
                order: "random",
                v: "5.73"
            },
            function (r) {
                var div = document.getElementById('friends');
                var ul = document.getElementById('friendsList');
                var li1 = document.createElement('li');
                div.style.justifyContent = "center";
                li1.style.textAlign = "center";
                li1.style.fontWeight = "bold";
                li1.style.fontSize = "20pt";
                li1.style.color = "#4a76a8";
                li1.style.margin = "5px";
                li1.innerHTML = "Ваши друзья:";
                if (ul) {
                    while (ul.firstElementChild) {
                        ul.removeChild(ul.firstElementChild);
                    }
                    ul.appendChild(li1);
                }
                var arr = [];
                for (let i = 0; i < r.response.items.length; i++) {
                    friend = r.response.items[i];
                    VK.Api.call('users.get', {user_ids: friend, v:"5.73"}, function(resp){
                        let list = resp.response[0].first_name + " " + resp.response[0].last_name;
                        var li = document.createElement('li');
                        li.innerHTML = list;
                        li.style.textAlign = "center";
                        li.style.fontWeight = "bold";
                        li.style.fontSize = "16pt";
                        li.style.margin = "3px";
                        if(li){
                            ul.appendChild(li);
                            arr.push(list);
                        }
                        localStorage.setItem("friends", JSON.stringify(arr));
                    });
                }
            });
    }
}

function onPageLoad() {
    name();
    onLoadFriends();
}
onPageLoad();

function onLoadFriends(){
    if(localStorage.getItem("friends")){
        var array = JSON.parse(localStorage.getItem("friends"));
        var div = document.getElementById('friends');
        var ul = document.getElementById('friendsList');
        var li1 = document.createElement('li');
        div.style.justifyContent = "center";
        li1.style.textAlign = "center";
        li1.style.fontWeight = "bold";
        li1.style.fontSize = "20pt";
        li1.style.color = "#4a76a8";
        li1.style.margin = "5px";
        li1.innerHTML = "Ваши друзья:";
        if (ul) {
            while (ul.firstElementChild) {
                ul.removeChild(ul.firstElementChild);
            }
            ul.appendChild(li1);
        }
        for(let i = 0; i < array.length; i++){
            var li = document.createElement('li');
            li.innerHTML = array[i];
            li.style.textAlign = "center";
            li.style.fontWeight = "bold";
            li.style.fontSize = "16pt";
            li.style.margin = "3px";
            ul.appendChild(li);
        }
        div.appendChild(ul);
    }
    else{
        getFriends();
    }
}

document.getElementById('vkLogout').onclick = function(){
    VK.Auth.logout(function(response){
        document.getElementById('vkLogin').hidden = false;
        document.getElementById('vkLogout').hidden = true;
        var hi = document.getElementById('hello');
        while (hi.firstElementChild){
            hi.removeChild(hi.firstElementChild);
        }
        localStorage.id = '';
        localStorage.name = '';
        localStorage.surname = '';
        localStorage.removeItem("friends");
        var ul = document.getElementById('friendsList');
        if(ul){
            while (ul.firstElementChild){
                ul.removeChild(ul.firstChild);
            }
        }
    });

};