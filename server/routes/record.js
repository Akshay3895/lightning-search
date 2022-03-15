const express = require("express");
const searchGoogle = require("../crawler/searchGoogle")

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;   


recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("main");
    db_connect
      .collection("invertedindex")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });

  });

  recordRoutes.route("/search").post(async function (req, res) {
    
    const searchquery = req.body.searchquery;
    let db_connect = dbo.getDb("main");

    if (searchquery != null) {
        
        // Retrieve the urls for the word
        let result_from_db = db_connect
            .collection("invertedindex")
            .find({word:searchquery})

        result_from_db = await result_from_db.toArray();

        if (result_from_db.length !=0) {
            res.status(200);
            
            if (req.body.sortalpha)
                result_from_db[0]["documents"].sort((first,second)=>{
                    return first["title"].localeCompare(second["title"])
                })
            res.json(result_from_db[0]["documents"])
        }

        else {
            
            const total_pages = 5
            let result = []
            const forLoop = async(_)=>{
                let temp_data = [];
                for (let pagenumber=0; pagenumber < total_pages; pagenumber++){
                    const google_result = await searchGoogle(searchquery,pagenumber)
                    temp_data.push(...google_result)
                }
                
                // Insert the searched result to the database
                const inserted_collection = await db_connect
                .collection("invertedindex")
                .insertOne({word:searchquery,documents:temp_data})
                
                return temp_data
            }
            
            result = await forLoop();
            if (req.body.sortalpha)
                result.sort((first,second)=>{
                    return first["title"].localeCompare(second["title"])
                })
            res.status(200);
            res.json(result)
    }

    }
    
    else {
        
        res.end();
    }

  });
  
module.exports = recordRoutes;