import app from "./app.js"
import { connectToDb } from "./config/database.js";

const port=3000;

connectToDb();

app.listen(port,()=>{
    console.log("app is listening on 3000")
})