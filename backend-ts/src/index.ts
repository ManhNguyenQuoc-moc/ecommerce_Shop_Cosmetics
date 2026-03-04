import express from "express";
import { prisma } from "./config/prisma";

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      password: req.body.password
    }
  });

  res.json(user);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});