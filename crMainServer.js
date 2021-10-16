const http = require("http");
const fs = require("fs");


//////////////////////////////////
//                              //
//    Beginning of the setup    //
//                              //
//////////////////////////////////

const html = fs.readFileSync("./home.html")
const host = 'localhost';
const port = 61600;
var Datastore = require('nedb');
var db = new Datastore({ filename: './databases/database1' });
db.loadDatabase();
db.find({ type: "info" }, (err, data) => {
    if (data.length == 0) {
        db.insert({ type: "info", lastID: 0 })
    } else {
        
    }
})

////////////////////////////
//                        //
//    End of the setup    //
//                        //
////////////////////////////


/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
async function requestListener(req, res) {
    if (getAliasOnPosition(req.url, 1) != "crcommand") return;

    if (req.method == "POST") {
        if (getAliasOnPosition(req.url, 2) == "submit") {
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                db.find({ type: "info" }, (err, data) => {
                    db.insert({ type: "satData", data: JSON.parse(body), id: data[0].lastID+1});
                    console.log(typeof data[0].lastID)
                    db.update({type: "info"}, {type:"info", lastID: data[0].lastID+1})
                })
                
            });

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end("Submit successful");
            return
        }
    } else if (req.method == "GET") {
        console.log(req.url)
        if (getAliasOnPosition(req.url, 2) == "getLatest") {
            console.log("applied")
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); //TODO return last 
            db.find({ type: "info" }, (err, array) => {
                let _lastID = array[0].lastID;
                console.log("last id = "+_lastID)
                db.find({type: "satData", id: _lastID}, (err, data) => {
                    console.log(data)
                    res.write(JSON.stringify(data[0]));
                    res.end();
                    
                })
            })
            // console.log(b)
            return
        } else if (getAliasOnPosition(req.url, 2) == "getAmount") {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); //TODO add ability to fetch several last datasets
            res.end("Latest n Info:");
            return
        }
    }
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(html)
    res.end("Invalid link")
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

/**
 * 
 * @param {String} uri 
 * @param {Number} position 
 * @returns {String}  
 */
function getAliasOnPosition(uri, position) {
    return uri.split("/")[position]
}

/**
 * 
 * @param {String} data 
 */
function convertData(data) {
    
    let _rawData = JSON.parse(data);
    
    
    return _normalizedData
}