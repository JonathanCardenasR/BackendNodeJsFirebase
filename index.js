const express = require("express");
const cors = require("cors");
const User = require("./config");
const app = express();

const port  = process.env.PORT || 4000;


const logRequestStart = (req, res, next) => {
  
  const fecha = new Date
  
  res.on('finish', () => {
      console.info(`${req.method} ${req.originalUrl} | STATUS: ${res.statusCode} ${res.statusMessage} | TIME: ${fecha}`)
  })
  
  next()
}

app.use(logRequestStart);

app.use(express.json());
app.use(cors());

app.get("/get", async (req, res) => {

  try {
    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.send(list);
  } catch (error) {
    console.log(error);
    return res.send({ msg: "User error" });
  }
  
});

app.get("/health", async (req, res) => {
  res.send('Todo ok');
});

app.post("/create", async (req, res) => {

  try {
    const data = req.body;
    await User.add({ data });
    return res.send({ msg: "User Added" });
  } catch (error) {
    return res.send({ msg: "User error" }); 
  }
  
});

//Cuando uso la api, me crea otro campo llamado password, pero no me actualiza el campo
app.post("/update", async (req, res) => {
  try {
    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const username = req.body.username;
    const newPassword = req.body.password;
    console.log(username)


    for (const user of list) {
      if (user.username === username) {
        const id = user.id;
        await User.doc(id).update({ "data.password": newPassword });
        return res.send({ msg: "Password updated" });
      }
    }

    return res.status(404).send({ msg: "User not found" });
  } catch (error) {
    console.log(error);
    return res.send({ msg: "Update error" });
  }
});




app.post("/validate", async (req, res) => {
  try {
    const { username, password } = req.body;

    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    for(const user of list){
      console.log(user);
      console.log(username, password );
      if(user.username == username && 
        user.password == password && 
        user.username != undefined && 
        user.password != undefined){
        return res.send({ authenticated: true, message: "Login successful" });
      }
    }

    return res.send({ authenticated: false, message: "Invalid credentials" });
    
  } catch (error) {
    console.log(error);
    return res.send({ messagg: "Login error" });
  }
});


app.post("/recoverpassword", async (req, res) => {
  try {
    const { username } = req.body;

    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("usuario buscado : " + username);

    for(const user of list){
      if(user.username == username &&
          user.username !== undefined 
        ){
        return res.send({ password: user.password});
      }
      else{
        return res.send({ message: "Usuario no encontrado"});
      }
    }


  } catch (error) {
    console.log(error);
    return res.send({ messagg: "Error inesperado en el servidor" });
  }
});

app.post("/delete", async (req, res) => {

  try {
    const id = req.body.id;
    await User.doc(id).delete();
    return res.send({ msg: "Deleted" });
  } catch (error) {
    console.log(error);
    return res.send({ msg: "Deleted error" });
  }

});

app.listen(port, () => console.log("Up & Running " + port));
