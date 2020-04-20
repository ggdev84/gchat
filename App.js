import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from "./menu"
import Banniere from "./banniere"
import Concept from "./concept"
import Fonctionnalites from "./fonctionnalites"
import Connexion from "./connexion"
import BanniereFooter from "./bannierefooter"
import Inscription from "./inscription"
import Menuli from "./menuli"
import Chat from "./chat"
import connect from "./socket"

function App() {

  // Le premier state permet de déterminer si l'utilisateur est connecté ou non.
  var [loggedin,setloggedin] = useState(false)
  // Le deuxième permet de garder enregistré le pseudo de l'utilisateur.
  var [pseudo,setpseudo] = useState("")
  /* Le troisième permet de garder la conversation. La conversation est une liste d'objets JSON ayant trois caractéristiques :
  Le type de message (un message que j'ai envoyé ou reçu), le pseudo de la personne, et le contenu du message.*/
  var [conv,setconv] = useState([])

  // La connexion qui est crée dans le fichier connexion.js, est initialisée ici une fois que le component est bien montée.
  useEffect(()=>{
      connect.on("msg",(data)=>{
        var tmp = []
        conv.forEach(i=>{
          tmp.push(i)
        })
        tmp.push(JSON.parse(data.data))
        console.log(tmp)
        setconv(tmp)
      })

      /* Cette fonction qui remplace la méthode componentWillUnmount permet de fermer la connexion socket.io*/
      return function cleanup(){
        connect.off("noevent")
      }
  })

  // Ci-dessous, la méthode qui permet d'envoyer un message
  var sendmessage = (message) =>{
    let data = {
      type:"mymsg",
      who:pseudo,
      data:message
    }
    connect.emit("msg",{data:JSON.stringify(data)})
    let tmp = []
    conv.forEach(i=>{
      tmp.push(i)
    })
    tmp.push(data)
    // Une fois que la nouvelle liste d'objets conv est renouvelée, on le renouvelle avec sa méthode setconv
    setconv(tmp)
    
  }

  // Si la personne est connectée, on le dirige vers le component Chat.
  if(loggedin === true){

    return(
      <div>
        <Menuli pseudo={pseudo} setloggedin={setloggedin} />
        <Chat conv={conv} sendmessage={sendmessage} /> 
      </div>
    )
  }

  // Si la personne n'est pas connectée, on le dirige vers la page d'acceuil.
  else{

    return (
      <div className="App">
        <div className="menubannierediv">
          <Menu />
          <Banniere/>
          <Connexion setloggedin={setloggedin} setpseudo={setpseudo} />
          <BanniereFooter/>
        </div>
        <Concept/>
        <Fonctionnalites/>
        <Inscription/>
      </div>
    );
  }
}

export default App;
