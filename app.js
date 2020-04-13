
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
    console.log("login");
    login();

    /*const p = new Promise((resolve) => {
        login();
        resolve();
    });
    p.then(() => getFriends());
    let promise = new Promise(login);
    promise.then(getFriends());*/
    console.log("friends");
}

function login(){
    VK.Auth.login(function (response) {
        console.log(response);
        if(response.status === 'connected'){
            localStorage.id = response.session.user.id;
            console.log('yes');
            document.getElementById('vkLogin').hidden = true;
            document.getElementById('vkLogout').hidden = false;
            console.log("debug");
            console.log(response.session.user);
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
        console.log("name");
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
        console.log("getFriends function");
        VK.Api.call('friends.get',
            {
                user_id: localStorage.id,
                count: 5,
                order: "random",
                v: "5.73"
            },
            function (r) {
                console.log(r);
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
                    console.log('friend');
                    /*list = friend.first_name + " " + friend.last_name;
                    console.log(list);
                    arr.push(list);*/
                    VK.Api.call('users.get', {user_ids: friend, v:"5.73"}, function(resp){
                        console.log('name');
                        console.log(resp);
                        console.log(resp.response[0].first_name);
                        let list = resp.response[0].first_name + " " + resp.response[0].last_name;
                        var li = document.createElement('li');
                        li.innerHTML = list;
                        li.style.textAlign = "center";
                        li.style.fontWeight = "bold";
                        li.style.fontSize = "16pt";
                        if(li){
                            ul.appendChild(li);
                            arr.push(list);
                        }
                        console.log(list);
                        console.log(arr);
                        localStorage.setItem("friends", JSON.stringify(arr));
                        console.log(localStorage.getItem("friends"));
                    });
                    console.log(arr);
                    localStorage.setItem("friends", JSON.stringify(arr));
                    console.log(localStorage.getItem("friends"));
                }

                for (let i = 0; i < arr.length; i++) {
                    console.log("array: ", 1);
                    console.log(arr[i]);
                    var li = document.createElement('li');
                    li.innerHTML = arr[i];
                    li.style.textAlign = "center";
                    li.style.fontWeight = "bold";
                    li.style.fontSize = "16pt";
                    if(li){
                        ul.appendChild(li);
                    }


                }
                div.appendChild(ul);
                console.log('friends');
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
        console.log(array);
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
            ul.appendChild(li);
        }
        div.appendChild(ul);
        console.log("same friends");
    }
    else{
        getFriends();
    }
}

document.getElementById('vkLogout').onclick = function(){
    console.log("logout");
    VK.Auth.logout(function(response){
        console.log(response);
        document.getElementById('vkLogin').hidden = false;
        document.getElementById('vkLogout').hidden = true;
        //document.getElementById('friendsList').hidden = true;
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

/*document.getElementById('vkFriends').onclick = function () {
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
};*/

