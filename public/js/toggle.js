let toggle = document.getElementById("flexSwitchCheckDefault");
      toggle.addEventListener("click",()=>{
        let taxinfo = document.getElementsByClassName("tax-info");
        for(info of taxinfo){
          if(info.style.display != "inline"){
            info.style.display = "inline";
          } else{
            info.style.display = "none";
          }
        }
    });