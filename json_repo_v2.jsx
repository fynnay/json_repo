{//=============================//
//  JSON FILE READ/WRITE TEST  //
//-----------------------------//
/*

This script is a fully functional basic repository class.
FEATURES
[x] read content
[x] get clips/tags in array form
[x] add new tags
[x] add new clips
    [ ] add/remove tags to clips
    [ ] change specific info (name, path etc.)
[ ] create new repo_file

Notes for next version:
- Should actually get the info from 1) metadata 2) user input
- Should NOT overwrite the whole file but only add new content
- Add functionality to update existing content

TL;DR: read/write process:
	- make new object
	- read the repo_file and put in temp var
	- .push new object to temp var
	- overwrite all contents of repo_file with updated temp var
*/
//-----------------------------//
//=============================//

// Repository class. Justin Case.
function Repo(){
	//-- JSON import stuff --//
    //=======================//
	#include "json2.js" // jshint ignore:line
	var script_file = File($.fileName); // get the location of the scriptfile
	var script_file_path = script_file.path; // get the path
	var repo_file = File(script_file_path + "/JSONlib.json"); // get the repo_file containing all repository information
    //-- JSON import stuff --//
    //-----------------------//

	//-- Class variables --//
    //=====================//
	var repoStr; // this will hold the raw content from the file.
	var repoObj = null; // this will contain the repo_file as an object
	this.repoStr = repoStr;
	this.repoObj = repoObj;

    //-- Repo Init --//
    //===============//
	//--GUID generator--
	var makeGUID = function(){
	    var number = (Math.floor(Math.random()*0xffffffff)).toString(16);
	    var digits = 8
	    return 'x'+Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
	};
	this.makeGUID = makeGUID;
	//--Reads repo_file and assigns global variables--
	var loadRepo = function(){
		if(repo_file !== false){// check if it is really there
			repo_file.open('r'); // open it
			repoStr = repo_file.read(); // read it
			repoObj =  JSON.parse(repoStr);// evaluate the string from the file
			repo_file.close(); // always close files after reading
			return repoObj;
		}else{
			alert("can't read file!"); // if something went wrong, fuk u
		}
	}
	// load the repo_file and assign it to repoStr and repoObj
	loadRepo();
    //-- Repo Init --//
    //---------------//

	//== GET STUFF FROM REPO ==//
	//=========================//
	//--Returns the repository variable--
	// wat:	0: get object, 1: get String
	this.getAll = function(wat){
		if(wat=='obj')return repoObj;
		else if(wat=='str') return repoStr;
	}
	//--Returns repository info--
	this.getRepoInfo = function(){
		return repoObj.repoInfo;
	}
	//--Returns an array with all tags in the repository--
	this.getTags = function(){
		var tags = [];
		var repoTags = repoObj.tags;
		for(i in repoTags){
			tags.push(repoTags[i]);
		}
		return tags;
	}
	//--Returns an array with all clips in the repository--
	var getClips = function(){
		var clips = []
		for(i in repoObj.clips){
			clips.push(repoObj.clips[i])
		}
		return clips;
	}
    this.getClips = getClips;
	//-- GET STUFF FROM REPO --//
	//-------------------------//

	//-- ADD STUFF TO REPO --//
	//=======================//
	//-- Creates new tag --//
	this.addTag = function(input){
		if(typeof input == 'undefined'){
			$.writeln('addTag(): Invalid input type.')
		}else{
			if(input instanceof String) var tag = input;
            else var tag = input.toString();
			addToRepo(tag,'tag')
		}
	}
	//-- Creates a new json object, that can be written to the repo_file --//
	var repoClip = function(){
		// generate new guid
		var guid = makeGUID().toString();
		// asign object keys and values
		var obj = {'guid':guid,'name':'undefined',"proxy":"undefined","raw":"undefined","format":"undefined","length":-1,"size":[0,1],"tags":[]}
		return obj;
	}
	this.repoClip = repoClip;
	//-- Adds a new clip to 'clips' in the repo_file --
	/* args: newObj: new object, type: 'tag','clip'
	*/
	var addToRepo  = function(newObj,type){
		// You need parsed repo content to make changes to it
		// push newObj to repoObj
		switch(type){
			case 'clip':
				repoObj['clips'].push(newObj)
				break;
			case 'tag':
				repoObj['tags'].push(newObj)
				break;
			default:
				$.writeln('addTag(): Specify object type')
		}
		updateRepo();
	}
	this.addToRepo = addToRepo;
    //-- ADD STUFF TO REPO --//
	//-----------------------//

    //-- REMOVE STUFF FROM REPO --//
    //============================//
    // finds properties and returns the index inside its array (tags or clips)
    // args: group: 'tags' or 'clips', filter: search string
    var getIndex = function(group,filter){
        if(typeof group =='undefined') $.writeln('getIndex(): group is undefined.');
        else if(typeof filter == 'undefined') $.writeln('getIndex(): filter is undefined.');
        else{
            var index = -1;
            if(group=='clips'){
                var arr = repoObj['clips'];
                var props = repoObj.clips[0].reflect.properties // get all key's properties from first clip
                var keys = props.slice(0,props.length-4) // get all keys' names
                // search in all items
                for(i in arr){
                    // search in all keys of the item
                    var curObj = arr[i]
                    for(x in keys){
                        if(curObj[keys[x]] == filter){
                            index = i;
                            break;
                        }
                    }
                }
            }else if(group=='tags'){
                var tags = repoObj.tags;
                // search in all tags
                for(i in tags){
                    if(tags[i] == filter){
                        index = i;
                        break;
                    }
                }
            }
            return index;
        }
    }
    this.getIndex = getIndex;

    //-- REMOVE STUFF FROM REPO --//
    //============================//
    //-- Removes a clip --//
    this.removeClip = function(id){
        if(typeof id =='undefined') $.writeln('removeClip(): id is undefined.')
        else{
            var search = getIndex('clips',id)
            if(search==-1) $.writeln("couldn't find clip with id: ",id);
            else {
                repoObj.clips.splice(search,1);
                updateRepo();
            }
        }
    }
    this.removeTag = function(id){
        if(typeof id =='undefined') $.writeln('removeClip(): id is undefined.');
        else{
            var search = getIndex('tags',id)
            if(search==-1) $.writeln("couldn't find tag with id",id);
            else {
                repoObj.tags.splice(search,1);
                updateRepo();
            }
        }
    }
    //-- REMOVE STUFF FROM REPO --//
    //============================//

    //-- UPDATE REPO --//
    //=================//
    // takes the current repoStr and overwrites the repo_file with it
    var updateRepo = function(){
        // pretty-stringyfy the updated repoObj with indentations
        repoStr = JSON.stringify(repoObj,null,4)
        // open the repo_file in 'write' mode
        repo_file.open('w')
        // replace the contents of repo_file with content
        repo_file.write(repoStr);
        // close the repo_file
        repo_file.close()
        // reload the Class variables
        loadRepo();
        // return new repo_file contents
        return repoStr;
    }
    this.updateRepo = updateRepo;
    //-- UPDATE REPO --//
    //-----------------//
} // EOF: Repo()

// Make new repository object
var repo = new Repo();

//-- DO SOMETHING --
// create new repoClip object
var newRC = new repo.repoClip();
	// change new repoClip's properties
	newRC.name = 'name';
	newRC.proxy = '/path/to/thumbs/folder/'
	newRC.raw = '/path/to/raw/file.mov'
	newRC.format = '*.mov' // R3D, .mov, file sequence etc.
	newRC.length = -1 // length of clip in frames
	newRC.size = [0,1]; //x,y
	newRC.tags = []; //'tag1','tag2','tag3'
repo.removeTag('fire')
// Cave Johnson.
}