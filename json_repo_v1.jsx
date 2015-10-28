//=============================//
//  JSON FILE READ/WRITE TEST  //
//-----------------------------//
/*

This script successfully reads a predefined library file and adds new "clip" objects to it.
All clip-info in this version is just dummy info.

Notes for next version:
- Should actually get the info from 1) metadata 2) user input
- Should NOT overwrite the whole file but only add new content
- Add functionality to update existing content


TL;DR rundown:
	- make new object
	- read the repo_file and put in temp var
	- .push new object to temp var
	- overwrite all contents of repo_file with updated temp var

*/
//-----------------------------//
//=============================//

// I put it all in class, to not make super global variables and stuff. Justin Case, you know.
function jsonTest(){
	//--JSON import stuff--
	#include "json2.js" // jshint ignore:line
	var script_file = File($.fileName); // get the location of the scriptfile
	var script_file_path = script_file.path; // get the path
	var repo_file = File(script_file_path + "/JSONString.json"); // get the repo_file containing all repository information

	//--Global variables--
	var REPO = null; // this will contain the repo_file object
	var content; // this will hold the String content from the file

	//--GUID generator--
	function makeGUID() {
	    var number = (Math.floor(Math.random()*0xffffffff)).toString(16);
	    var digits = 8
	    return 'x'+Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
	};

	//--Reads repo_file and assigns global variables--
	function getLib(){
		if(repo_file !== false){// check if it is really there
			repo_file.open('r'); // open it
			content = repo_file.read(); // read it
			REPO =  JSON.parse(content);// evaluate the string from the file
			return REPO; // if it all went fine we have now a JSON Object insted of a string call length
			repo_file.close(); // always close files after reading
		}else{
			alert("can't read file!"); // if something went wrong, fuk u
		}
	}

	//--Updates repo_file
	function addToRepo(newObj){
		// parse current content to make changes to it
		var obj = REPO;
		// push input obj to parsed content
		obj['clips'].push(newObj)
		// pretty-stringyfy the updated object with indentations
		content = JSON.stringify(obj,null,4)
		// open the repo_file in 'write' mode
		repo_file.open('w')
		// replace the contents of repo_file with content
		repo_file.write(content);
		// close the repo_file
		repo_file.close()
		// return new content
		return content;
	}

	//--Creates a new json object, that can be written to the repo_file--
	function repoClip(info){
		// generate new guid
		var guid = makeGUID().toString();
		// create new object
		var obj = {};
		// asign object keys and values
		obj[guid] = {'name':'test1','proxy':info.proxy,'raw':info.raw,'format':info.format,'length':info.length,'size':info.size,'tags':info.tags}
		// return obj
		return obj;
	}


	//-- MAIN SHIT IS HAPPENING DOWN HERE! --
	// create new clip-info for object
	var nInfo = {"proxy":"/proxyPath","raw":"/rawPath","format":".mov","length":123,"size":[1920,1080],"tags":['tag1','tag2','tag3']}
	// create new json object
	var testClip = new repoClip(nInfo)
	// assign main variables etc.
	getLib();
	// update repo_file
	addToRepo(testClip);

}
// run dat shit
jsonTest();