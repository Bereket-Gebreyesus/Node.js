import express from "express";
import { register, login, getProfile, logout } from "./users.js";


let app = express();

app.use(express.json());
// Create routes 
app.post("/register", register);
app.post("/login", login);
app.get("/profile", getProfile);
app.post("/logout", logout);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
