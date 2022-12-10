const express = require("express")
const path = require('path')
const app = express()
const PORT = process.env.PORT||8080
const http = require("http").Server(app)
const io = require("socket.io")(http)
let registeredPlayers = {}

io.on("connection",(socket)=>{
    console.log("we got company fam, "+socket.id);
    socket.on("registerPlayer",(data)=>{
        console.log(data);
        registeredPlayers[data.id]=data
        io.emit("registeredPlayer", data)
        socket.emit("getPlayers", registeredPlayers)
    })
    socket.on("movement",(movementData)=>{
        //{ playerId: 'aTgOo4WZqim_JJrfAAAV', pos: { x: 10, y: 14 } }
        console.log(movementData);
        socket.broadcast.emit("updateMovement",movementData)
    })
    socket.emit("getPlayers",registeredPlayers)
    socket.on("message",(data)=>{
        // {id: 'wjfdhdjuiwd', message: "Hello world"}
        console.log(data)
        socket.broadcast.emit("message",data)
    })
    socket.on("disconnect",()=>{
        delete registeredPlayers[socket.id]
        console.log("aww our company: "+socket.id+" left");
    })
})


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})
app.get("/registeredPlayers",(req,res)=>{
    res.json(registeredPlayers)
})
app.get("/deleteNetwork",(req,res)=>{
    for(var net in registeredPlayers){
        delete registeredPlayers[net]
    }
    res.send("done")
})

http.listen(PORT,()=>{
    console.log("wsg wsg app ready fam on "+PORT);
})