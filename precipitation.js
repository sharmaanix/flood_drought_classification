/* This code takes the data from a JSON file and classify weather the precipation is excess or minimal from the normal situation
and classify it into  drought and flood */ 

//using file stream library
var fs = require("fs");
var stream;
stream = fs.createReadStream("precipitation.json");

// Obtain wink's streaming api for standard deviation.
var stdev = require( 'wink-statistics' ).streaming.stdev();


// Configuration to compute outliers.
const minDataSize = 3; // Min # data points to process before outliers detection begins
const multiplier = 	2.5; // Used to flag a value as outlier if it is > multiplier x std dev.
const stock_value = [];

stream.on("data", function(data) 
{
    var chunk = JSON.parse(data);
    var key;
    var precipitation_record =[];
    var precipitation_value;
    var year;
    const flood =[];
  	const drought =[];

    for (key in chunk.data)
    {
    //console.log(chunk.data[key].value);
    //console.log(key);
    //precipitation_record.push(chunk.data[key].value);

  	const precipitation_value = +chunk.data[key].value;
  	const  year = Math.floor(key/100);
  	//console.log(year);
  	//console.log(precipitation_value);
  	const r = stdev.result();
  	

  	if(r.size && (r.size >= minDataSize)&&(precipitation_value > (r.mean + multiplier*r.stdev)))
  		{
  			console.log(`Oultlier detetcted.The year ${year} has unusally higher precipitation.So there may have floods and landslide.`);
  			flood.push(year);
  		}

  	else if(r.size && (r.size >= minDataSize)&&(precipitation_value > (r.mean + multiplier*r.stdev)))
  		{
  			console.log(`Oultlier detetcted.The year ${year} has unusally lower precipitation.So there may have many drought.`);
  			drought.push(year);	
  		}
	else 
  	{ 
    	stdev.compute( precipitation_value );
  	}

	}

	console.log("\n flood year : ");
	console.log(flood);
	console.log("\n dought year : ");
	console.log(drought);


}); 

