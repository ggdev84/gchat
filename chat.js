import React, { useState, useEffect, useRef } from "react"

function Chat(props){

    // Le state suivant permet de prendre en charge le message que l'utilisateur est en train d'écrire.
    var [message,setmessage] = useState("")

    /* Une réference inutile, c'est en fait pour le "coller" au conteneur des messages et pouvoir le sélectionner
    pour pouvoir descendre tout en bas automatiquement à chaque message envoyé ou reçu. */
    const ref = useRef(null)

    // Fonction qui permet juste de gérer la touche Entrée. Fonctionne aussi bien sur PC que mobile.
    var handlekey = (e)=>{
        if(e.key === "Enter"){
            props.sendmessage(message)
            setmessage("")
        }
    }

    var a=0;
    var messages = props.conv.map((i)=>{
        a+=1
        return(
            <div className={i.type} key={a} >
                <p className="username">{i.who}</p>
                <p>{i.data}</p>
            </div>
        )
    })

    /* A chaque fois que le component est rechargé, descendre tout en bas.
     Sinon quoi on est obligé de défiler manuellement tout en bas pour voir les nouveaux messages. */
    useEffect(()=>{
        ref.current.scrollTop = ref.current.scrollHeight
    })


    return(
        <div className="chatdiv">
            <div className="messagesdiv" ref={ref} >
                {messages}
            </div>
            <input type="text" placeholder="Envoyer un message.." value={message} onChange={(e)=>{setmessage(e.target.value)}} onKeyPress={handlekey} autoFocus /><button onClick={()=>{props.sendmessage(message); setmessage("")}} >Envoyer</button>
        </div>
    )
}

export default Chat