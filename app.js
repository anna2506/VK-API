
function ready(){
    console.log('Document have been succesfully loaded');
}
document.addEventListener("DomContentLoader", ready());
VK.init({apiId:7403845});

if (localStorage.id === undefined || localStorage.id === ''){
    document.getElementById('vkLogout').hidden = true;
    //document.getElementById('friendsList').hidden = true;
    //document.getElementById('hello').hidden = true;
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
            //document.getElementById('vkFriends').hidden = false;
            //document.getElementById('friendsList').hidden = false;
            //document.getElementById('hello').hidden = false;

        }
        else if(response.status === 'not_authorized '){
            console.log("You need to allow the application to use your private data");
        }
        else if(response.status === 'unknown '){
            console.log("You need to register in Vkontakte");
        }
        console.log("debug");
        console.log(response.session.user);
        /* сохраняем имя и фамилию пользователя*/
        localStorage.name = response.session.user.first_name;
        localStorage.surname = response.session.user.last_name;
        name();
        getFriend();


    }, VK.access.FRIENDS);

    if(localStorage.id){
    }

};

function name() {
    if(localStorage.name && localStorage.surname){
        var hi = document.getElementById('hello');
        var hey = document.createElement('span');
        hey.style.display = "flex";
        hey.style.justifyContent = "center";
        hey.style.fontWeight = "bold";
        hey.style.fontSize = "20pt";
        hey.innerHTML = "Добро пожаловать, " + localStorage.name + " " + localStorage.surname + "!";
        if(hi){
            while (hi.firstElementChild){
                hi.removeChild(hi.firstElementChild);
            }
        }
        hi.appendChild(hey);
    }
}

function getFriend() {
    if(localStorage.id){
        VK.Api.call('friends.get',
            {user_ids: localStorage.id,
                count: 5,
                v:"5.73"},
            function(r) {
            console.log(r);
                var div = document.getElementById('friends');
                var ul = document.getElementById('friendsList');
                var li1 = document.createElement('li');
                div.style.justifyContent = "center";
                li1.style.textAlign = "center";
                li1.style.fontWeight = "bold";
                li1.style.fontSize = "20pt";
                li1.innerHTML = "Ваши друзья";
                if (ul){
                    while (ul.firstElementChild){
                        ul.removeChild(ul.firstElementChild);
                    }
                    ul.appendChild(li1);
                }
                var arr = [];
                for(let i = 0; i < r.response.items.length; i++){
                    friend = r.response.items[i];
                    VK.Api.call('users.get', {user_ids: friend, v:"5.73"}, function(resp){
                        console.log(resp);
                        list = resp.response.user.first_name + " " + resp.response.user.last_name;
                        arr.push(list);
                    });
                }
                for(let i = 0; i < arr.length; i++){
                    var li = document.createElement('li');
                    li.innerHTML = arr[i];
                    ul.appendChild(li);

                }
                div.appendChild(ul);
                console.log('friends');
            });
    }
}

name();
getFriend();

document.getElementById('vkLogout').onclick = function(){
    console.log("logout");
    VK.Auth.logout(function(response){
        console.log(response);
        document.getElementById('vkLogin').hidden = false;
        document.getElementById('vkLogout').hidden = true;
        //document.getElementById('friendsList').hidden = true;
        var friends = document.getElementById('friends');
        while(friends.firstElementChild){
            friends.removeChild(friends.firstElementChild);
        }
        var hi = document.getElementById('hello');
        while (hi.firstElementChild){
            hi.removeChild(hi.firstElementChild);
        }
        localStorage.id = '';
        localStorage.name = '';
        localStorage.surname = '';
        var ul = document.getElementById('friendsList');
        while (ul.firstElementChild){
            ul.removeChild(ul.firstChild);
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

