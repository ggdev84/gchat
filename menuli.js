import React from "react"

function Menuli(props){
    /* Ce menu est un menu simple qu'on affiche une fois l'utilisateur connecté. 
    Le pseudo n'apparaît pas sur mobile, car il n'y a pas de place pour faire tenir le nom de l'application,
    le pseudo et le bouton de déconnexion en une seule ligne. */
    
    return(
        <ul className="menuli">
            <li >Gchat</li>
            <li className="mobilepseudo">Pseudo : {props.pseudo} </li>
            <li><button onClick={()=>{props.setloggedin(false)}}>Déconnexion</button></li>
        </ul>
    )
}

export default Menuli