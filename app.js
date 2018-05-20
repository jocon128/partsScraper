const express = require('express');
const path = require('path');
const fs = require('fs');

const index = require('./routes/index');

const app = express();

var alldata = {};
var sourcesData = {};
var supplierArray = ['valueparts','hitechparts','jstech','mobilehq'];
var fileArray = {'valueparts':'ValueParts.json','hitechparts':'HitechParts.json','jstech':'JstechParts.json','mobilehq':'Mobilehq.json'};

app.use('/', index);

const model = require('./models');
app.get('/api/update', model.update);
app.get('/api/update/:supplier', model.update);
app.get('/api/sources', sources);
app.get('/api/:supplier', supplier);
app.get('/api/:supplier/:category', supplierfilter);
app.get('/api/:supplier/:category/:id', supplierfilterspecific);

fs.readFile('source.json', (err, data) => {
    if (err) {
        throw err;
    }
    sourcesData = JSON.parse(data);
});

function sources (req, res){
    console.log("test");
    res.send(sourcesData);
  };



function readSupplireDataFile(supplier){
        console.log('supplier name '+supplier);

	let fileName = fileArray[supplier];
        console.log('filename '+fileName);

	try{
		let rawData = fs.readFileSync(fileName);
		alldata[supplier] = JSON.parse(rawData);
		
	}catch(e){

	  console.log("Can not read "+fileName+" file");
	}
	

	


}

function supplier (req, res){
  
  readSupplireDataFile(req.params.supplier);
  try {
      
      res.send({data:alldata[req.params.supplier]['data'],meta_data:alldata[req.params.supplier]['meta_data']});
  }
  catch (e) {
      res.send({data:e.toString()});
  }
};

function supplierfilter (req, res){

    readSupplireDataFile(req.params.supplier);
    var categoryid = decodeURI(req.params.category);
    
    if(req.params.supplier!=undefined &&  supplierArray.indexOf(req.params.supplier)>-1){

      try {
	   
          res.send({data:alldata[req.params.supplier]['data'][categoryid],meta_data:alldata[req.params.supplier]['meta_data']});
      }catch (e) {
          res.send({data:e.toString()});
      }

    }



};



function supplierfilterspecific(req, res){

  readSupplireDataFile(req.params.supplier);
  var categoryid = req.params.category;
  var id = decodeURI(req.params.id);

    if(req.params.supplier!=undefined && supplierArray.indexOf(req.params.supplier)>-1){

      try {
          res.send({data:alldata[req.params.supplier]['data'][categoryid][id],meta_data:alldata[req.params.supplier]['meta_data']});

      }catch (e) {
          res.send({data:e.toString()});
      }

    }


}



var port = process.env.PORT || 3344;
// app.listen(port, function(){
//     console.log('Server is running on port:', port);
    
// });

// start the server
const server = app.listen(port);

// increase the timeout to 4 minutes
server.timeout = 0; 

module.exports = app;
