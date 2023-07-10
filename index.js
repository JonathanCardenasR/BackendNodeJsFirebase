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
//Se cambio el metodo update porque no funcionaba (hasta ahora tampoco funciona)
app.post("/update", async (req, res) => {
  try {
    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const username = req.body.username; 

    for (const user of list) {
      if (user.username == username) {
        const id = user.id;
        await User.doc(id).update({ password: req.body.password });
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
      if(user.data.username == username && 
        user.data.password == password && 
        user.data.username != undefined && 
        user.data.password != undefined){
        return res.send({ authenticated: true, message: "Login successful" });
      }
    }

    return res.send({ authenticated: false, message: "Invalid credentials" });
    
  } catch (error) {
    console.log(error);
    return res.send({ messagg: "Login error" });
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
