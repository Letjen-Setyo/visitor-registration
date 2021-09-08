const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());//req body

//ROUTES


//create visitor

app.post("/visitor", async(req,res) => {
  try {
      
     const { name, company, address, idcard_number,viscard_number, phone, message, check_in, check_out, created_by, modified_by } = req.body;
      const newVisitor = await pool.query("INSERT INTO visitor (name, company, address, idcard_number,viscard_number, phone, message, check_in, check_out, created_by, modified_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING * ",
      [name, company, address, idcard_number,viscard_number, phone, message, check_in, check_out, created_by, modified_by]
      );

      res.json(newVisitor.rows[0]);

  } catch (err) {
      console.error(err.message);  
      res.json(err.message);
  }
});

//get all visitor
app.get("/visitor/get-all", async (req,res) =>{
 try {
      const allVisitor = await pool.query("SELECT * FROM visitor");

      res.json(allVisitor.rows);

 } catch (err) {
    console.error(err.message);  
      res.json(err.message);
 }

});

//get a visitor
app.get("/visitor/findbyid/:id", async(req,res) => {

    try {

        const {id} =  req.params;
        const visitor = await pool.query("SELECT * FROM visitor WHERE id = $1",[id]);
        res.json(visitor.rows[0]);

    } catch (err) {

        console.error(err.message);
        res.json(err.message);
    
    }

});

//update a visitor
app.put("/visitor/checkout/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const {check_out, modified_by} = req.body;
        const checkout = await pool.query("UPDATE visitor SET check_out = $1, modified_date = now(), modified_by = $2 WHERE id = $3 RETURNING *",[check_out,modified_by,id]);

        res.json("Visitors "+checkout.rows[0].name+" FROM "+checkout.rows[0].company+" has been checkout at "+checkout.rows[0].check_out);
   
    } catch (err) {
        console.error(err.message);
        res.json(err.message);
    }
});

//delete a visitor
app.delete("/visitor/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const visitor = await pool.query("DELETE FROM visitor WHERE id = $1 RETURNING *",[id]);

        res.json("Visitors "+visitor.rows[0].name+" FROM "+visitor.rows[0].company+" has been deleted ");
   
    } catch (err) {
        console.error(err.message);
        res.json(err.message);
    }
});


app.listen(5000,() => {
    console.log("Server Has Started on port 5000")
});

 