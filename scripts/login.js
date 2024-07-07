const url = "https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"
async function login(){
    const does_acc_exist = await get_acc()
    if(does_acc_exist==true){
        const getinacc = await getin_acc()
        if(getinacc==true){
            window.location.replace("../index.html")
        }
        if(getinacc==false){
            alert("Wrong password!")
            return
        }
    }
    if(does_acc_exist==false){
        await make_acc()
    }
}


async function get_acc(){
    const email = document.getElementById("email").value; 
    const password = document.getElementById("password").value;
    const valid_email = email.replace(".", "")
    const req = await fetch(url+valid_email+".json")
    const json = await req.json()
    if(json==null){
        return false
    }
    else{
        return true
    }
}

async function make_acc(){
    const email = document.getElementById("email").value; 
    const password = document.getElementById("password").value;
    const valid_email = email.replace(".", "")
    const json = JSON.stringify({
        "email": email,
        "password": password,
        "friends":{
            "num":1,
        }
    })
    const f = await fetch(url+valid_email+".json",{

        headers:
      {
          'Accept': 'application/json',
          'Content-Type': "application/json",
      },
        method: "PUT",
        body: json
    })
    if(f.status==200){
        localStorage.setItem("email", email)
        localStorage.setItem("password", password)
        localStorage.setItem("log", true)
        alert("account created succesfully!")
        window.location.replace("../index.html")
    }
}
async function getin_acc(){
    const email = document.getElementById("email").value; 
    const password = document.getElementById("password").value;
    const valid_email = email.replace(".", "")
    const f = await fetch(url+valid_email+".json")
    const json = await f.json()
    if(json.password == password){
        localStorage.setItem("email", email)
        localStorage.setItem("password", password)
        localStorage.setItem("log", true)
        return true
    }
    else{
        return false
    }
}
