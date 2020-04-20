/*Partie serveur de l'application web de messagerie instantanée.
Il faut noter, même si c'est déjà précisé plusieurs fois, que toutes les communications entre le serveur et le client 
se font par le biais d'objets JSON, qui est l'objet standard du langage Javascript. */

const express = require("express")
const bcrypt = require("bcrypt")
const mysql = require("mysql")
const http = require("http")

const app = express()

// Le serveur aurait pu être en https et utiliser un certificat SSL, mais c'est pas utile dans un contexte de test et de portfolio.
const server = http.createServer(app).listen(8080)


// Fonction qui ouvre une connexion MYSQL.
var mysql_connection = ()=>{
    var conn = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"password",
        database:"site"
    })

    return conn
}

// Implémentation du serveur Socket.io pour la messagerie instantanée.

const io = require("socket.io")(server)

io.on("connection",(socket)=>{

    // Lorsqu'on reçoit un message, le renvoyer automatiquement à tout le monde SAUF l'envoyeur lui-même.
    socket.on("msg",(data)=>{
        let tmp = JSON.parse(data.data)
        tmp.type = "yourmsg"
        socket.broadcast.emit("msg",{data:JSON.stringify(tmp)})
    })
})


// Fin du serveur io


// Inscription
app.post("/inscription/:data", (req,res)=>{

    // On récupère ici les données passées via la requête HTTP POST.
    var userdata = JSON.parse(req.params.data)
    let pseudo = userdata.pseudo
    let email = userdata.email
    let password = userdata.password
    let passwordconfirm = userdata.passwordconfirm
    res.setHeader("Content-Type","text/plain")
    let tmplist = [pseudo,email,password,passwordconfirm]
    let a = 0

    
    /* Les lignes suivantes sont dans le but de tester les données, on renvoie des messages d'erreurs si les champs sont vides,
    si les mots de passes ne se correspondent pas, ou si l'utilisateur existe déjà. Si tout va bien, on finalise l'inscription en 
    notant les données dans la base de données. */
    tmplist.forEach((i)=>{
        if(i === "" || i===" "){
            a=1
        }
    })
    if(a == 1){
        res.status(200).send("Veuillez remplir tous les champs.")
    }
    else if(password != passwordconfirm){
        res.status(200).send("Les mots de passes ne se correspondent pas.")
    }
    else{
        let mysqlconn = mysql_connection()

        let query = `select pseudo from user where pseudo="${pseudo}";`
        mysqlconn.query(query,(err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log(result)
                if(result.length != 0){
                    res.status(200).send("Cet utilisateur existe déjà.")
                }
                else{
                    bcrypt.hash(password,10,(err,hash)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                            let query = `insert into user(pseudo,email,password) values("${pseudo}","${email}","${hash}");`
            
                            mysqlconn.query(query,(err,result)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    res.status(200).send("L'inscription est terminée. Vous pouvez désormais vous connecter.")
                                }
                            })
                        }
                    })
                }
            }
        })




    }

})

// Connexion
app.post("/connexion/:data",(req,res)=>{
    res.setHeader("Content-Type","text/plain")

    // On crée ici un objet au format JSON, qui permettra de renvoyer à l'utilisateur les messages d'erreurs puis enfin son pseudo.
    let datatosend = {
        pseudo:"",
        message:""
    }

    /* Même chose que pour l'inscription, on récupère les données de l'utilisateur passées dans la requête POST. 
    D'ailleurs, la raison pour laquelle la méthode POST est utilisée au lieu de GET dans l'inscription et dans la connexion,
    est parce-que POST permet de gérer et de mieux prendre en charge des plus grandes quantitées de données.*/
    
    let data = JSON.parse(req.params.data)
    let pseudo = data.pseudo
    let password = data.password

    /*Encore une fois, on vérifie que les champs envoyés ne sont pas vides, et que l'utilisateur existe bel et bien.
    Enfin, si son mot de passe est bon, on finalise la connexion.*/
    if(pseudo == "" || pseudo==" " || password=="" || password==" "){
        datatosend.message="Veuillez remplir tous les champs"
        datatosend = JSON.stringify(datatosend)
        res.status(200).send(datatosend)
    }
    else{
        bcrypt.hash(password,10,(err,hash)=>{
            if(err){
                console.log(err)
            }
            else{
                let mysqlconn = mysql_connection()
                let query = `select password from user where pseudo="${pseudo}";`
                mysqlconn.query(query,(err,result)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        if(result.length != 0){
                            let query = `select password from user where pseudo="${pseudo}"`
                            mysqlconn.query(query,(err,result)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    bcrypt.compare(password,result[0].password,(err,same)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            if(same == true){
                                                datatosend.message="Connecté. Veuillez patienter."
                                                datatosend.pseudo=pseudo
                                                res.status(200).send(JSON.stringify(datatosend))



                                            }
                                            else{
                                                datatosend.message="Mauvais mot de passe"
                                                datatosend = JSON.stringify(datatosend)
                                                res.status(200).send(datatosend)
                                            }
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            datatosend.message="Pseudo inexistant"
                            datatosend = JSON.stringify(datatosend)
                            res.status(200).send(datatosend)
                        }
                    }
                })
            }
        })
    }

})




