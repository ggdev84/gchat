import React, { useState } from "react"

function Connexion(props){
    
    // On a trois states : le pseudo, le mot de passe et le message renvoyé par le serveur à la fin des requêtes.
    var [username, setusername] = useState("")
    var [password, setpassword] = useState("")
    var [message, setmessage] = useState("")

    /*La fonction qui gère la connexion. Si la personne a réussi à se connecter, on change le pseudo à son pseudo, et 
    on le redirige vers la page de la discussion.*/
    const handleConnection = (data)=>{
        setmessage(data.message)
        if(data.message.includes("Connecté")){
            props.setpseudo(username)
            props.setloggedin(true)
        }
    }

    // Fonction qui permet juste de prendre en charge la touche Enter.
    var handleEnter = (e)=>{
        if(e.keyCode === 13){
            e.preventDefault()
            handleClick()
        }
    }

    // Fonction qui envoie la requête pour se connecter. Il passe ensuite le résultat à la fonction ci-dessus.
    const handleClick = ()=>{
        let tmplist={
            pseudo:username,
            password:password
        }
        tmplist = JSON.stringify(tmplist)
        fetch("/connexion/"+tmplist,{method:"POST"})
        .then(data=>data.json())
        .then(data=>handleConnection(data))
    }

    return(
        <div className="connexiondiv">
            
            <h3>Connexion</h3>
            <p>
                <input placeholder="pseudo" type="text" value={username} onChange={(e)=>setusername(e.target.value)}/><br/>
                <input placeholder="mot de passe" type="password" value={password} onKeyUp={(e)=>handleEnter(e)} onChange={(e)=>setpassword(e.target.value)}/><br />
                <button onClick={handleClick} >Se connecter</button>
                <p>{message}</p>
            </p>
        </div>
    )
}

export default Connexion