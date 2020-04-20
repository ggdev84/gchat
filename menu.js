import React, { useState } from "react"

function Menu(){

    // Le state clicked permet de gérer le menu mobile. Se réferer au commentaire suivant.
    const [clicked,setclicked] = useState(false)

    // La partie suivante permet de gérer le menu mobile. Elle sert à faire apparaître ou disparaître le menu selon le clic de l'utilisateur.

    const clickhandler = ()=>{
        if(clicked===true){
            setclicked(false)
        }
        else{
            setclicked(true)
        }
    }
    var style
    if(window.innerWidth < 701){
        if(clicked===true){
            style={display:"block"}
        }
        else{
            style={display:"none"}
        }
    }
    else{
        style={
            display:"block"
        }
    }
    

    

    return(
        <div>
            <ul className="mobilemenu" >
                <li className="mmlogo" >GChat</li>
                <li><button className="mmbutton" onClick={clickhandler} >Menu</button></li>
            </ul>
            <ul className="menu" style={style} >
                <li className="dlogo"><a className="dlogo" href="#concept">Gchat</a></li>
                <li><a href="#concept">Concept</a></li>
                <li><a href="#fonctionnalites">Fonctionnalités</a></li>
                <li><a href="#inscription">Inscription</a></li>
            </ul>

        </div>
    )
}

export default Menu