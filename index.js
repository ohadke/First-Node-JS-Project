const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const orders = require('./order.mongo')


const PORT = 3000
const MONGO_URL = 'mongodb+srv://ohad:15AP7F0K4SiYONZx@firstdb.baome.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
app.use(express.json());
// i Decided to take from the last 24 hours which is 86400000 milliseconds
const dayInMilliSeconds = 86400000
// Access from any domain
app.use(cors());


//Once i connected to the Mongoose DB it print it
mongoose.connection.once("open", () => {
    console.log("MongoDB connected ");
  });
  
mongoose.connection.on("error", (err) => {
console.error(`There is error in mongodb ${err}`);
});

mongoose.connect(MONGO_URL, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
86400000
app.get('/', (req, res) => res.send("Website working"))//watch if there is any response 
app.get('/orders',async (req,res) => {
    try{
  const listOfOrders = await orders.find({}, { _id: 0, __v: 0 })// I searching the last orders by selecting from the last 24 hours , since the last milliseconds
 const listOfOrdersFromLastDay = listOfOrders.filter(order => {
   console.log(order.orderName);//print the order names
   return  new Date().getTime  <= dayInMilliSeconds + Number(order.orderDate)
  });
  console.log(listOfOrdersFromLastDay);
   return res.json(listOfOrdersFromLastDay)

    }catch(error){
        console.log(error);
       return res.status(500).json({error: 'Error in the server'})
    }
})
app.post('/new-order',async (req,res) => {// post a new order, the order date is auto generated , only need to insert "order" in JSON
    try{
        const {order} = req.body
        console.log(order);
        if(!order) return res.status(400)
        const newDate = new Date().getTime()
        console.log(newDate);
        await orders.findOneAndUpdate(
            {
              orderName: order,
              orderDate:newDate
            },
            { orderName: order,
              orderDate:newDate},
            {
              upsert: true,
            }
          );
        
        return res.json("Insert new order completed")
    }catch(error){
        console.log(error);
        return res.status(500);
    }
     
})
// app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
// app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) })


app.listen(PORT, () => {
    console.log(`app is runing on port ${PORT}`);
})