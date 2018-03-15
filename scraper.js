
var childProcess = require('child_process');
const fs = require('fs');


function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}




//scraping michelin

function startScraping(){
	 return new Promise(function(resolve, reject){
		runScript('./scraping/link_scrapper.js', function(err){
		  if (err) throw err;
			console.log('We just scraped the links!');
			continueScrapingMichelin();
			
		});
		resolve();
		 
	 });
	
}

function continueScrapingMichelin(){
	 return new Promise(function(resolve, reject){
		runScript('./scraping/michelin.js', function(err){
			if (err) throw err;
			console.log('We just scraped the Michelin Guide!');
			continueScrapingFork();
		});
		resolve();
	 });
}



// Scrap lafourchette 
function continueScrapingFork(){
	 return new Promise(function(resolve, reject){
		runScript('./scraping/lafourchette.js', function(err){
		  if (err) throw err;
			console.log('We just scraped the Fourchette!');
			lookForPromotions();
		});
		resolve();

});
}

// Scrap promotions
function lookForPromotions(){
		fs.appendFile("./food-app/src/promotions.json", "[", function() {});

	 	return new Promise(function(resolve, reject){
		runScript('./scraping/promotions.js', function(err){
		if (err) throw err;
		console.log('And we have found all the promotions!');
		});
		resolve();

		fs.appendFile("./food-app/src/promotions.json", "]", function() {});

});
}




startScraping();



