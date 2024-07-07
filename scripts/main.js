const email = localStorage.getItem("email")
const valid_email = email.replace(".", "")
const url = "https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends.json"
const friends_hash = new Array
const friend_numbers_hash = new Array
var loop_num = 2
var icons_to_show = 0 
async function get_friends(){
    const get_friends_req = await fetch(url)
    const friends = await get_friends_req.json()

    const friend_number = friends.num
    if(friend_number==1){
        return
    }

    await all_friend_loop(friend_number, friends)
    await show_friends_setup(friend_number)
}
async function all_friend_loop(friend_number, friends){
    const req = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+loop_num+".json")
    const req_json = await req.json()

    friends_hash.push(req_json.valid_email_friend)
    friend_numbers_hash.push(loop_num)
    if(loop_num==friend_number){
        return 
    }
    else{
        loop_num+=1
        all_friend_loop(friend_number, friends)
    }
}
get_friends()


async function show_friends_setup(friend_number){
    const to_show = friend_number - 1 
    const start = 0 
    const id = 0 
    show_friend(to_show, start, id)
}
function show_friend(to_show, start, ids){
    const text_mode_div = document.getElementById("text_mode")
    const div_to_show = document.getElementById("centered_icons")
    const img = document.createElement("img")
    img.src = "./assets/standard-icon.svg"
    img.id = ids
    img.onclick = function (){
        text_mode_div.style = "display:block;"
        text_mode_div.className = "focused"
        const get_input = document.getElementsByClassName("text_to_send")
        get_input[0].value = ""
        const id_for_inp = this.id
        get_input.id = id_for_inp
        const text_center_place = document.getElementById("center_text")
        text_center_place.innerHTML = ""
        show_text(this.id)
    }
    div_to_show.appendChild(img)
    to_show-=1
    console.log(to_show)
    if(to_show==0){
        console.log("wh")
        return
    }
    id+=1
    show_friend(to_show, start, ids)
}

//that was the show friends part!!
async function show_text(id){
    console.log(id)
    const email_of_friend = friends_hash[id]
    const friend_number_id = friend_numbers_hash[id]
    console.log(friend_number_id)
    const text_url = "https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+friend_number_id+"/conversation.json"
    const try_host = await fetch(text_url); const try_host_json = await try_host.json()
    const number_of_messages = await get_chat_num(friend_number_id)
    const time_looped = 0
    const loop_trough = await loop_trough_messages(number_of_messages, time_looped, friend_number_id)

    setInterval(() => {
        auto_update()
    }, 2000);
}

async function get_chat_num(friend_number){
    const url = "https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+friend_number+"/chat_num/new_num.json"
    const try_host = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+friend_number+"/conversation.json"); const hosted = await try_host.json()
    if(hosted.host==true){
        console.log(url)
        const req = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+hosted.addres+"/friends/"+hosted.friend_num+"/chat_num/new_num.json")
        const json = await req.json()
        const num = json
        return num
    }else{
        console.log(url)
        const req = await fetch(url)
        const json = await req.json()
        const num = json
        return num
    }
}

async function loop_trough_messages(number_of_messages, time_looped, friend_number_id){
    const div_check = document.getElementsByClassName("focused")
    const text_place = document.getElementById("center_text")
    const new_h2 = document.createElement("h2")
    const chat_number_to_req = time_looped+1
    const try_host = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+friend_number_id+"/conversation.json"); const hosted = await try_host.json()
    if(hosted.host==true){
        const host_addres = hosted.addres
        const friend_num = hosted.friend_num
        const text_req = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+host_addres+"/friends/"+friend_num+"/conversation/"+chat_number_to_req+".json")
        const text = await text_req.json()
        const new_text = document.createTextNode(text.message)
        const new_id = time_looped
        new_h2.id = new_id
        new_h2.append(new_text)
        text_place.appendChild(new_h2)
        console.log(number_of_messages)
        if(time_looped==number_of_messages){
            console.log(time_looped, number_of_messages)
            console.log("yes")
            return
        }else{
            console.log(time_looped)
            time_looped+=1 
            loop_trough_messages(number_of_messages, time_looped, friend_number_id)
        }
    }
    else{
        const text_req = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+friend_number_id+"/conversation/"+chat_number_to_req+".json")
        const text = await text_req.json()
        const new_text = document.createTextNode(text.message)
        const new_id = time_looped
        new_h2.id = new_id
        new_h2.append(new_text)
        text_place.appendChild(new_h2)
        console.log(number_of_messages)
        if(time_looped==number_of_messages){
            console.log(time_looped, number_of_messages)
            console.log("yes")
            window.location.replace("#"+time_looped)
            return
        }else{
            console.log(time_looped)
            time_looped+=1 
            loop_trough_messages(number_of_messages, time_looped, friend_number_id)
        }
    }
}
// the show_text_part
//chat_api_func

async function chat_api(){
    const get_friend_id_input = document.getElementsByClassName("text_to_send")
    const inp_for_to_send_const = get_friend_id_input
    const to_send = inp_for_to_send_const[0].value;
    const friend_id = get_friend_id_input.id
    console.log(get_friend_id_input.id)
    console.log(get_friend_id_input)               
    const id_of_friend = friend_numbers_hash[friend_id]
    const try_host = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+id_of_friend+"/conversation.json"); const hosted = await try_host.json()
    console.log("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+id_of_friend+"/conversation.json")
    if(hosted.host==true){
        const chat_number = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+hosted.addres+"/friends/"+hosted.friend_num+"/chat_num.json")
        const chat_num = await chat_number.json()
        const new_num = chat_num.new_num + 1 
        const f = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+hosted.addres+"/friends/"+hosted.friend_num+"/chat_num.json",{
            headers:{
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
              method: "PUT",
              body: JSON.stringify({"new_num": new_num})
        })
        const put = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+hosted.addres+"/friends/"+hosted.friend_num+"/conversation/"+new_num+".json",{
            headers:{
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
              method: "PATCH",
              body: JSON.stringify({"message": to_send})
        })
        inp_for_to_send_const[0].value = ""
    }
    else{
        const chat_number = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+id_of_friend+"/chat_num.json")
        const chat_num = await chat_number.json()
        const new_num = chat_num.new_num + 1 
        const f = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+id_of_friend+"/chat_num.json",{
            headers:{
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
            method: "PUT",
            body: JSON.stringify({"new_num": new_num})
        })
        const put = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+id_of_friend+"/conversation/"+new_num+".json",{
            headers:{
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({"message": to_send})
        })
        inp_for_to_send_const[0].value = ""
    }
}
// auto_update_part

async function auto_update(){
    const get_friend_id_input = document.getElementsByClassName("text_to_send")
    const friend_id = get_friend_id_input.id
    const id_of_friend = friend_numbers_hash[friend_id]
    const try_host = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+id_of_friend+"/conversation.json"); const hosted = await try_host.json()
    if(hosted.host==true){
        const chat_number = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+hosted.addres+"/friends/"+hosted.friend_num+"/chat_num.json")
        const chat_num = await chat_number.json()
        const new_num = chat_num.new_num
        const added_check = document.getElementById(new_num) 
        if(added_check==null){   
        }
        else{
            return     
        }
        const check_for_new = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+hosted.addres+"/friends/"+hosted.friend_num+"/conversation/"+new_num+".json")
        const check_new = await check_for_new.json()
        if(check_new==null){
        }

        else{
            const text_to_add  = check_new.message
            const div = document.getElementById("center_text")
            const h2 = document.createElement("h2")
            const text = document.createTextNode(text_to_add)
            h2.append(text)
            h2.id = new_num
            div.appendChild(h2)
        }
    }
    else{
        const chat_number = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+id_of_friend+"/chat_num.json")
        const chat_num = await chat_number.json()
        const new_num = chat_num.new_num
        const added_check = document.getElementById(new_num) 
        if(added_check==null){    
        }
        else{
            return     
        }
        const check_for_new = await fetch("https://lams-aa86c-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/friends/"+id_of_friend+"/conversation/"+new_num+".json")
        const check_new = await check_for_new.json()
        if(check_new==null){

        }
        else{
            const text_to_add  = check_new.message
            const div = document.getElementById("center_text")
            const h2 = document.createElement("h2")
            const text = document.createTextNode(text_to_add)
            h2.append(text)
            div.appendChild(h2)
            h2.id = new_num
            const to_search = new_num
            const el = document.getElementById(to_search) 
            el.scrollIntoView
        } 
    }
}