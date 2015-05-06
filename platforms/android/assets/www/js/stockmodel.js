/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function emptyLocalStorage()
{
    localStorage.clear();
}

function getCurrentUser()
{
    return sessionStorage.getItem('username');
}

function signOutCurrentUser()
{
    return sessionStorage.getItem('username', null);
}

function getCurrentUserDetails()
{
    var username = getCurrentUser();
    var users = JSON.parse(localStorage.getItem('users'));
    if (username in users)
        return users[username];
    return null;
}

function checkLogin(user, passwd)
{
    var users = JSON.parse(localStorage.getItem('users'));
    if(users === null)
        return false;
    console.log(user);
    console.log(passwd);
    console.log(users);
    console.log(users[user]);
    if(user in users)
    {
        console.log(users[user]["password"]);
        if(users[user].password === passwd)
        {
            sessionStorage.setItem('username', user);
            return true;
        }
        else
        {
            return false;
        }
    }
    else
        return false;
}

function storeNewUser(username, passwd)
{   
    var users = JSON.parse(localStorage.getItem('users'));
    console.log(users);
    if(users === null)
        users = {};
    if(username in users)
    {
        return false;
    };
    users[username] = {
        "name" : username,
        "password" : passwd,
        "photo" : "",
        "account" : {
            "accounts" : [],
            "cash" : 0,
            "stocks" : {},
            "history" : []
        }
    };
    localStorage.setItem('users',JSON.stringify(users));
    return true;
}

function storeDeposit(username, amount, bank, accno, photo)
{
    var users = JSON.parse(localStorage.getItem('users'));
    console.log("storeDeposit and photo",username, amount, bank, accno, photo);
    users[username].account.cash = parseInt(amount);
    users[username].account.accounts.push([bank, accno]);
    users[username].photo = photo;
    users[username].account.history.push([Date(), "User account created.", null]);
    users[username].account.history.push([Date(), "Initial deposit made", amount]);
    localStorage.setItem('users',JSON.stringify(users));
}

function saveUserDetails(userdet)
{
    var username = getCurrentUser();
    var users = JSON.parse(localStorage.getItem('users'));
    users[username] = userdet;
    localStorage.setItem('users',JSON.stringify(users));
}
//localStorage.setItem('users',JSON.stringify({a:{name:'a',password:'a',account:{accounts:[['Bank of America',12345]],cash:1000,stocks:{},history:[]}}}));
