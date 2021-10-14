const http = require("http");
const fs = require("fs");
const { get } = require("https");
const host = 'localhost';
const port = 61600;
// const html = fs.readFileSync("./home.html")
/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function requestListener(req, res) {
    console.log(getAliasOnPosition(req.url, 1))
    if (getAliasOnPosition(req.url, 1) != "crcommand") return;

    if (req.method == "POST") {
        if (getAliasOnPosition(req.url, 2) == "submit") {
            // console.log(req.headers)
            // console.log(req.url)
            // console.log(req.headers)
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end("Submit successful");
            return
        }
    } else if (req.method == "GET") {
        if (getAliasOnPosition(req.url, 2) == "getLatest") {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end("Latest Info:");
        } else if (getAliasOnPosition(req.url, 2) == "getAmount"){
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); //TODO add ability to fetch several last datasets
            res.end("Latest Info:");
        }
    }
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end("Invalid link")
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

function getAliasOnPosition(uri, position) {
    return uri.split("/")[position]
}