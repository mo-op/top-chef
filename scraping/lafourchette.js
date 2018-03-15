const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio')


let punctuation = ['\'', ' ', '-'];
let regExp = new RegExp('[' + punctuation.join('') + ']', 'g')
let similarTarget = {} //found restaurants


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./data/rest.json')
});


if (fs.existsSync('./data/restFork.json')) {
  fs.truncate('./data/restFork.json', 0, function() {})
}

lineReader.on('line', function(line) {
  var targetToFind = JSON.parse(line);
  var fieldsAPI = targetToFind["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp); //special characters replaced
  let parametersForLinks = "";
  for (var i = 0; i < fieldsAPI.length - 1; i++) {
    parametersForLinks += fieldsAPI[i] + '+';
  }
  parametersForLinks += fieldsAPI[fieldsAPI.length - 1];
  request({
    // uri: "https://www.lafourchette.com/recherche/autocomplete?searchText=" + linkParamatersAPI + "&localeCode=fr",
    uri: "https://m.lafourchette.com/api/restaurant-prediction?name=" + parametersForLinks, //use of the API this time
  }, function(error, response, body) {
    if (error) return console.log(error);
    if (body[0] != '<') {
      var listRests = JSON.parse(body);
      let targetAcquired = false
      if (listRests.length > 0) {
        for (var i = 0; i < listRests.length; i++) {
          if (targetAcquired) {
            break; // restaurant found
          }
          // make sure that this is the real restaurant by comparing their address/postalcode
          if (listRests[i]['address']['postal_code'] == targetToFind['address']['postalcode']) {
            similarTarget = listRests[i]
            targetAcquired = true

            let tokensSearch = similarTarget["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
            var searchLinkParameters = "";
            for (var i = 0; i < tokensSearch.length - 1; i++) {
              searchLinkParameters += tokensSearch[i] + '-';
            }
            searchLinkParameters += tokensSearch[tokensSearch.length - 1];
            similarTarget['link'] = "https://www.lafourchette.com/restaurant/" + searchLinkParameters + "/" + similarTarget['id']
            similarTarget['stars'] = targetToFind['stars']

            if (targetAcquired) {
              try {
                fs.appendFile("./data/restFork.json", JSON.stringify(similarTarget) + "\n"); //add existing restaurant from both michelin  and lafourchette
              } catch (err) {
                console.log(err);
              }
            }
          }
        }
      }
    }
  }).on('error', function(err) {
    console.log(err)
  }).end()
});
