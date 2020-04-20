import React, { useState } from "react"

function Inscription(){

    // Les states suivants contiennent juste les données de l'utilisateur souhaitant s'inscrire.
    var [pseudo,setpseudo] = useState("")
    var [email, setemail] = useState("")
    var [password,setpassword] = useState("")
    var [passwordconfirm, setpasswordconfirm] = useState("")
    var [response, setresponse] = useState("")

    // Fonction qui permet d'envoyer une requête d'inscription au serveur avec un objet JSON.
    const clickHandle = ()=>{
        let data = {
            pseudo:pseudo,
            email:email,
            password:password,
            passwordconfirm:passwordconfirm
        }
        data = JSON.stringify(data)
        let request = "/inscription/" + data
        fetch(request,{method:"POST"})
        .then(data=>data.text())
        .then(data=>setresponse(data))
        
    }

    // Fonction qui permet juste de prendre en charge la touche Enter.
    var handleEnter = (e)=>{
        if(e.keyCode === 13){
            e.preventDefault()
            clickHandle()
        }
    }

    return(
        <div>
            <p>{response}</p>

            <div className="inscriptiondiv" id="inscription">
                <h3>Inscription</h3>
                <input type="text" placeholder="pseudo" value={pseudo} onChange={(e)=>setpseudo(e.target.value)} /><br />
                <input type="email" placeholder="email" value={email} onChange={(e)=>setemail(e.target.value)} /><br />
                <input type="password" placeholder="mot de passe" value={password} onChange={(e)=>setpassword(e.target.value)} /><br />
                <input type="password" placeholder="confirmer mot de passe" value={passwordconfirm} onKeyUp={(e)=>handleEnter(e)} onChange={(e)=>setpasswordconfirm(e.target.value)} /><br />
                <button onClick={clickHandle}  >S'inscrire</button>
            </div>
        </div>
    )
}

export default Inscription