var connection = require("socket.io-client")("http://localhost")

var connect = ()=>{
    connection.on("hello",(data)=>{
        alert(data)
    })
}

export default connect

