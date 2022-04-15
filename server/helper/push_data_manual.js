const searchGoogle = require("../crawler/searchGoogle")
const helperFunctions = require("../helper/helper")
const stopWordHelper =  require("../helper/stopword_remove")


// This will help us connect to the database
require("dotenv").config({ path: "../config.env" });
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;   

// This code will help in manually pushing some data 
const documents = async (searchquery,pagenumber) => {
    dbo.connectToServer(async function (err) {
        if (err) console.error(err);

        let db_connect = dbo.getDb("main");

        searchquery = searchquery.toLowerCase();
        
        let tokenized = stopWordHelper.stopWordRemove(searchquery)

        // Filter ONLY the words
        tokenized = tokenized.filter(word => (word!="and") && (word!="or") && (word!="not"))

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
            
            const updateDoc = {$push : { "documents" : { $each: temp_data}}}
            for (i=0;i<tokenized.length;i++){
                let filter = { word : tokenized[i] }
                let result = await db_connect.collection("invertedindex").updateOne(filter, updateDoc);

            }
            
            // Insert the urls to the urls collection in database
            const inserted_collection2 = await db_connect
            .collection("urls")
            .insertMany(complete_url_list)       
            
            console.log("UPDATED")
            
            return temp_data

        }

        result = await forLoop();
        // console.log(result)
        console.log(result.length)
        return result;
    });

}

// documents("facebook and twitter",5)