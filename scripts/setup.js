const logged = localStorage.getItem("log")
if(logged==null){
    window.location.replace("./login/index.html")
}
