
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const axios = require('axios');
const { response } = require("express");
const app = express(); //initalise a new express app
var mysql = require('mysql');
const { kill } = require("process");

app.set("view engine", "ejs");
app.use("/css/style.css", express.static(__dirname + "/css/style.css"));
app.use("/images", express.static(__dirname + "/images"));

tankNames = []
tankStats= []
tankPlace=[]
var wholeData=[]
tankID=[]

var ids = []

var topTanks = []
//-----------------------------------------------
sqlData = []
sqlKills = []
sqlDeaths = []
sqlTime = []
sqlColor = []
sqlCountry = []
sqlAwards = []
sqlFavMap = []
sqlOtherTanks = []
imgLinks = []
fontColor =[]



// function getnames(num) {

//   const url2 = `https://tankpit.com/api/leaderboards/?leaderboard=overall&page=${num}`
//   console.log(url2)
//   https.get(url2, function(response) {
//     console.log(response.statusCode);
//     response.on("data", function(data){
//     jsonData = JSON.parse(data) // this parses the json so its able to access the data
//     // xz.push("cat","hat")
//     console.log(jsonData.results.length)
//     for (var i=0; i <jsonData.results.length; i++){
//       ids.push(jsonData.results[i].tank_id)
//     }
//     // CallTheConsole();
//     });
//   });
// };


// function sleep(ms) { //THE AWAIT SLEEP FUCNCTION 
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function CallTheConsole() {
//   x = jsonData
//   for (var i=0; i <jsonData.results.length; i++){
//     await sleep(2000);
//     tankList = ids[i]
//     const url3 = `https://tankpit.com/api/tank?tank_id=${tankList}`
//     https.get(url3, function(response){
//       console.log(response.statusCode);
//       response.on("data", function(data){
//         theData = JSON.parse(data)
//         topTanks.push(theData)
//         topTanks.push(theData)
//         tankid = theData.tank_id
//         tankname = theData.name
//         tankawards = theData.awards
//         kills = theData.map_data.World.destroyed_enemies
//         tankcolor = theData.main_color
//         deaths = theData.map_data.World.deactivated
//         tankcountry = theData.country
//         tankfavoritemap = theData.favorite_map
//         tankrank = theData.map_data.World.rank
//         tanktimeplayed = theData.map_data.World.time_played
//         othertanks = theData.other_tanks

        

//     var con = mysql.createConnection({
//       host: "s1.swapdns.com",
//       user: "division_master",
//       password: "!Ght567hkl",
//       database: "division_tpwebstats"
//     });
//     con.connect(function(err) {
//       if (err) throw err;
//       console.log("Connected!");
//       var sql = `INSERT INTO overall (tank_id, name, awards, main_color, country, favorite_map, time_played, rank, destroyed_enemies, deactivated, other_tanks ) 
//       VALUES ('${tankid}', '${tankname}', '${tankawards}', '${tankcolor}', '${tankcountry}', '${tankfavoritemap}', '${tanktimeplayed}', '${tankrank}', '${kills}', '${deaths}', '${othertanks}')`;
//       con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("1 record inserted");
//           });
//         });
        
//       });
//     });
    
//   };
// };


// getnames(1);
//since this is outside a function block I can use variables 


function award_string(){
  img_set= [
    ['','',''],
    ['','',''],
    ['','',''],
    ['','',''],
    ['','',''],
    ['','',''],
    ['','',''],
    ['','',''],
    ['','',''],
  ]
}

app.get("/", function (req, resp) { // this is getting the root directory when a user goes to this page
  const url = "https://tankpit.com/api/leaderboards/?leaderboard=overall&page=1"
  var posts=[]; // resets posts arrary each time a user goes to the root webpage
  tankNames = []


  https.get(url, function(response) {
    // console.log(response.statusCode);
    response.on("data", function(data){
      let top25 = JSON.parse(data) // this parses the json so its able to access the data
      // console.log(top25)
      // yep = top25.results[0].name
      // console.log(yep)
      console.log(top25.results.length-1) // getting the length of every post made by a user that day
      for (var i=0; i <top25.results.length; i++){
      
        tankNames.push(top25.results[i].name)
        tankStats.push(top25.results[i].rank)
        tankPlace.push(top25.results[i].placing)
        tankID.push(top25.results[i].tank_id)
        wholeData.push(top25.results) //for length        
      };
//       var con = mysql.createConnection({
//         host: "s1.swapdns.com",
//         user: "division_master",
//         password: "!Ght567hkl",
//         database: "division_tpwebstats"
//       });
//       con.connect(function(err) {
//         if (err) throw err;
//         con.query("SELECT * FROM overall", function (err, result, fields) {
//           if (err) throw err;
          // console.log(result[1]);
          baseData = result
          console.log(baseData.length)
          const color = {
            red:"/images/redtank.png",
            blue:"/images/bluetank.png",
            purple:"/images/purpletank.png",
            orange:"/images/orangetank.png",
          }

          const textColor = {
            red: "#FF0000",
            blue: "#007EE4",
            orange: "#FFA500",
            purple: "#A020F0",

          }



          for (var i=0; i < baseData.length; i++) {
            sqlKills.push(baseData[i].destroyed_enemies)
            sqlDeaths.push(baseData[i].deactivated)
            sqlTime.push(baseData[i].time_played)
            sqlAwards.push(baseData[i].awards)
            sqlColor.push(baseData[i].main_color)
            
            
          }
          
          for (var i=0; i <tankNames.length; i++){
            // console.log(sqlColor[i]) //getting each color of all the tanks in the array
            imgLinks.push(color[sqlColor[i]])// i should start with orange
            // console.log(color[sqlColor[i]])
            fontColor.push(textColor[sqlColor[i]])
            console.log(textColor[sqlColor[i]])

          }

           //getting the attibute red of the object colors


          console.log(sqlKills)
          resp.render("index", {name: tankNames, data1: tankNames, data2: tankStats, data3: tankPlace, kills: sqlKills, deaths: sqlDeaths, time: sqlTime, awards: sqlAwards, tankcolor: imgLinks, fontColor: fontColor}); //render ejs page. ejs page uses html."
         })
        });
      });
 



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


//IF STATMENT FOR 0 DATA MAKE IT SAY CLASSIFED
