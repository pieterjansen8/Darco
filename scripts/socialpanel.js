const url = "https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"
async function get_acc(){
    const email = document.getElementById("email").value; 
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
async function already_added(){
    const email_of_friend = document.getElementById("email").value; 
    const valid_email_friend = email_of_friend.replace(".", "")
    const email = localStorage.getItem("email")
    const valid_email = email.replace(".", "")
    const req = await fetch(url+valid_email+"/friends.json")
    const req_json = await req.text()
    const check = req_json.includes(valid_email_friend)
    if(check==true){
        alert("Friend already added!")
        return false
    }
}

async function add_user(){
    const email_friend = document.getElementById("email").value; 
    const email = localStorage.getItem("email")
    const password = localStorage.getItem("password")
    const valid_email = email.replace(".", "")
    const valid_email_friend = email_friend.replace(".", "")
    if(valid_email==valid_email_friend){alert("You cannot add yourself!"); return}
    const url_friend = "https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends.json"

    const already_added_check = await already_added()
    if(already_added_check==false){
        return
    }
    const exist = await get_acc() 
    if(exist == false){
        alert ("Account not found!")
        return;
    }


    const update_number = await update_num()
    const update_number_friend_var = await update_num_friend()
    if(update_number==false){
        alert("error")
    }
    if(update_number_friend_var==false){
        alert("error")
    }
    const json_me = JSON.stringify({
        "conversation":{
            1:{
                "message":"chat is started!"
            }
        },
        "chat_num":{
            "new_num": 1
        },
        valid_email_friend: valid_email_friend
    })
    const json_friend = JSON.stringify({
        "conversation":{
            "host": true,
            "addres": valid_email,
            "friend_num": update_number
        },
        "chat_num":{
            "new_num": 1
        },
        valid_email_friend: valid_email
    })
    const f = await fetch(url+valid_email+"/friends/"+update_number+".json",{
        headers:{
            'Accept': 'application/json',
            'Content-Type': "application/json",
        },
          method: "PUT",
          body: json_me
      })
    const f_friend = await fetch(url+valid_email_friend+"/friends/"+update_number_friend_var+".json",{
        headers:{
            'Accept': 'application/json',
            'Content-Type': "application/json",
        },
          method: "PUT",
          body: json_friend
      })
    if(f.status==200){
        alert("Friend succesfuly added!")
        window.location.replace("../index.html")
    }

}

async function update_num(){
    const email_friend = document.getElementById("email").value; 
    const email =  localStorage.getItem("email")
    const password = localStorage.getItem("password")
    const valid_email = email.replace(".", "")
    const url_friend = "https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends.json"




    const current_number_req = await fetch(url_friend)
    const current_number = await current_number_req.json()

    const new_num = current_number.num + 1


    const f = await fetch(url+valid_email+"/friends/num.json",{
      headers:{
          'Accept': 'application/json',
          'Content-Type': "application/json",
      },
        method: "PUT",
        body: new_num
    })
    if(f.status==200){
        return new_num
    }
    else{
        return false
    }
}
async function update_num_friend(){
    const email_friend = document.getElementById("email").value; 
    const email =  localStorage.getItem("email")
    const password = localStorage.getItem("password")
    const valid_email = email_friend.replace(".", "")
    const url_friend = "https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends.json"




    const current_number_req = await fetch(url_friend)
    const current_number = await current_number_req.json()

    const new_num = current_number.num + 1


    const f = await fetch(url+valid_email+"/friends/num.json",{
      headers:{
          'Accept': 'application/json',
          'Content-Type': "application/json",
      },
        method: "PUT",
        body: new_num
    })
    if(f.status==200){
        return new_num
    }
    else{
        return false
    }
}