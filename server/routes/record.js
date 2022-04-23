const express = require("express");
const searchGoogle = require("../crawler/searchGoogle")
const helperFunctions = require("../helper/helper")
const stopWordHelper =  require("../helper/stopword_remove")

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;   

// This function will get url information from urls collection
async function joinURLDocuments(db_connect,documents){

    for (let i=0; i < documents.length; i++){

        let result_from_urls = db_connect
        .collection("urls")
        .find({address:documents[i].address})

        result_from_urls = await result_from_urls.toArray();

        documents[i]["timesVisited"] = result_from_urls[0]["timesVisited"]
        documents[i]["lastVisited"] = result_from_urls[0]["lastVisited"]
        documents[i]["id"] = result_from_urls[0]["_id"].toString()

    }

    return documents

}

function applyOperations(documents,operations){
    // console.log(documents.length)
    let results = documents[0]
    for (let i=0; i < operations.length; i++){
        let operation = operations[i]
        if (operation === "and")
            results = results.filter(a => documents[i+1].some(b => b.address === a.address))
        else if (operation === "or")
            results = results.concat(documents[i+1])
        else if (operation === "not")
            results = results.filter(a => !list2.some(b => a.userId === b.userId));  
    }

    return results
}

recordRoutes.route("/updateurl").get(async function (req, res) {
    let db_connect = dbo.getDb("main");

    input_address = req.query.address
    const filter = { address: input_address };

    var dateTime = helperFunctions.getCurrentTime();

    const updateDoc = {
        $inc: {
          timesVisited: 1
        },
        $set:{
            lastVisited: dateTime
        }
      };
    
    const result = await db_connect.collection("urls").updateOne(filter, updateDoc);
    
    res.json("Updated");
});

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
    
    let searchquery = req.body.searchquery;
    let db_connect = dbo.getDb("main");
    console.log(searchquery)
    if (searchquery != null) {
        searchquery = searchquery.toLowerCase();
        
        let tokenized = stopWordHelper.stopWordRemove(searchquery)

        // Get all the operations that need to be performed
        const operations = tokenized.filter(word => (word=="and") || (word=="or") || (word=="not"))
        
        // Filter ONLY the words
        tokenized = tokenized.filter(word => (word!="and") && (word!="or") && (word!="not"))
        
        
        let token_documents = []
        const forLooptokens = async(_)=> {
            
            // Run for each word present in tokenized result
            for (let index=0; index < tokenized.length; index++){
                
                // console.log(tokenized[index])
                
                // Retrieve the urls for the word
                let result_from_db = db_connect
                    .collection("invertedindex")
                    .find({word: tokenized[index]} )

                result_from_db = await result_from_db.toArray();

                if (result_from_db.length !=0) {
                    console.log("Results present in DB")
                    let documents = result_from_db[0]["documents"]
                    documents = await joinURLDocuments(db_connect,documents)
                    
                    token_documents.push(documents)

                }

                else {
                    
                    const total_pages = 5
                    let result = []
                    const forLoop = async(_)=>{
                        let temp_data = [];
                        let complete_url_list = [];
                        for (let pagenumber=0; pagenumber < total_pages; pagenumber++){
                            const google_result = await searchGoogle(searchquery,pagenumber)
                            temp_data.push(...google_result)
                            
                            // Data to be pushed into URLs collection
                            url_list = temp_data.map(searchresult => searchresult.address)

                            var dateTime = helperFunctions.getCurrentTime();

                            url_list = url_list.map((url)=>{
                                return {"address":url,"timesVisited":1,"lastVisited": dateTime}
                            });

                            complete_url_list.push(...url_list);
                        }
                        
                        // Insert the searched result to the database
                        const inserted_collection = await db_connect
                        .collection("invertedindex")
                        .insertOne({word:searchquery,documents:temp_data})

                        // Insert the urls to the urls collection in database
                        const inserted_collection2 = await db_connect
                        .collection("urls")
                        .insertMany(complete_url_list)                
                        
                        return temp_data
                    }
                    
                    result = await forLoop();

                    // result will consist of the documents
                    result = await joinURLDocuments(db_connect,result)

                    token_documents.push(result)
                }

            }
            return token_documents
        }
        token_documents  = await forLooptokens();

        let finalresult = applyOperations(token_documents,operations);
        
        // console.log("-----------------")
        console.log(`Final result Length = ${finalresult.length}`)

        res.status(200);
        res.json(finalresult)

    }
    
    else {
        
        res.end();
    }

  });
  
module.exports = recordRoutes;