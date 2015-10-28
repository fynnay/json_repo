{//=============================//
//  JSON FILE READ/WRITE TEST  //
//-----------------------------//
/*

This script is a fully functional basic repository class.
FEATURES
FEATURES
[x] read content
[x] get clips/tags in array form
[x] add new tags
[x] add new clips
    [x] add/remove tags to clips
    [x] change specific info (name, path etc.)
[x] create fresh repo_file

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
	var rv = 0.1;
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
    //-- Checks if repo exists --//
    var checkRepo = function(){
        if(repo_file.exists) return true;
        else{
            var uInp = confirm("Oh snap!\nRepository file doesn't exist. Do you want to create a new one?"); // if something went wrong, fuk u
            if(uInp==true)freshRepo();
            else return false;
        };
    }
    this.checkRepo = checkRepo;
    //-- UPDATE REPO --//
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
    //-- Creates a new, empty repository --//
    var freshRepo = function(){
        var newRepo = {"repoInfo":{"version":rv,"healthy":true},"tags":[],"clips":[] }
        repoObj = newRepo;
        repo_file = new File(script_file_path+'/'+'JSONlib.json');
        updateRepo();
    }
	//-- Reads repo_file and assigns global variables --//
	var loadRepo = function(){
		if(checkRepo()){// check if it is really there
			repo_file.open('r'); // open it
			repoStr = repo_file.read(); // read it
			repoObj =  JSON.parse(repoStr);// evaluate the string from the file
			repo_file.close(); // always close files after reading
			return repoObj;
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
    // How to:
    // // create new repoClip object
    // var newRC = new repo.repoClip();
    //  // change newRC's properties
    //  newRC.name = 'name';
    //  newRC.proxy = '/path/to/thumbs/folder/'
    //  newRC.raw = '/path/to/raw/file.mov'
    //  newRC.ext = '*.mov' // R3D, .mov, file sequence etc.
    //  newRC.length = -1 // length of clip in frames
    //  newRC.size = [0,1]; //x,y
    //  newRC.tags = []; //'tag1','tag2','tag3'
    // // add newRC to repo
    // addToRepo(newRC,'clip')
    // // update the repo_file
    // updateRepo();
	var repoClip = function(){
		// generate new guid
		var guid = makeGUID().toString();
		// asign object keys and values
		var obj = {"guid":guid,"name":'undefined',"proxy":"undefined","poster":null,"raw":"undefined","ext":"undefined","length":-1,"size":[0,1],"tags":[]}
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

    //-- MODIFY STUFF IN REPO --//
    //==========================//
    //-- modifies clip name --//
    var mdfy_name = function(id,value){
        // check input args
        if(typeof id =='undefined') $.writeln('mdfy_name(): id is undefined.')
        else if(typeof value =='undefined') $.writeln('mdfy_name(): value is undefined.')
        else{
            var index = getIndex('clips',id); // get index of clip with id
            if(index==-1) $.writeln("mdfy_name(): couldn't find clip with id: ",id) // if there is no such clip
            else{
                repoObj.clips[index].name = value.toString();
                updateRepo();
            }
        }
    }
    this.mdfy_name = mdfy_name;
    //-- sets poster frame --//
    var mdfy_poster = function(id,value){
        if(typeof id =='undefined') $.writeln('mdfy_poster(): id is undefined.')
        else if(typeof value =='undefined') $.writeln('mdfy_poster(): value is undefined.')
        else{
            var index = getIndex('clips',id)
            if(index==-1) $.writeln("mdfy_poster(): couldn't find clip with id: ",id) // if there is no such clip
            else{
                repoObj.clips[index].poster = value;
                updateRepo();
                $.writeln(repoStr)
            }
        }
    }
    this.mdfy_poster = mdfy_poster;
    //-- changes path of raw file --//
    var mdfy_raw = function(id,value){
        if(typeof id =='undefined') $.writeln('mdfy_raw(): id is undefined.')
        else if(typeof value =='undefined') $.writeln('mdfy_raw(): value is undefined.')
        else{
            var index = getIndex('clips',id)
            if(index==-1) $.writeln("mdfy_raw(): couldn't find clip with id: ",id) // if there is no such clip
            else{
                // check if value arg is actually a file
                if(!(value instanceof File))$.writeln('Invalid file. \nPlease try again. Remember you have to select a file, not a folder. For image sequences select the first image in the sequence.') // if not
                else{ // if it is
                    repoObj.clips[index].raw = value.fsName.toString();
                    updateRepo();
                }
            }
        }
    }
    this.mdfy_raw = mdfy_raw;
    //-- removes tags from clip --/
    var delClipTag = function(id,value){
        if(typeof id =='undefined') $.writeln('delClipTag(): id is undefined.')
        else if(typeof value =='undefined') $.writeln('delClipTag(): value is undefined.')
        else{
            var index = getIndex('clips',id)
            if(index==-1) $.writeln("delClipTag(): couldn't find clip with id: ",id) // if there is no such clip
            else{
                var clipTags = repoObj.clips[index].tags;
                var tagIndex = -1;
                for(i in clipTags){
                    if(clipTags[i]==value){
                        tagIndex = i;
                    }
                }
                if(tagIndex==-1){
                    $.writeln("couldn't find any tag named '",value,"' in '",id,"'.")
                    return false;
                }else{
                    repoObj.clips[index].tags.splice(tagIndex,1)
                    updateRepo();
                }
            }
        }
    }
    this.delClipTag = delClipTag;
    //-- adds tags to clip --/
    var addClipTag = function(id,value){
        if(typeof id =='undefined') $.writeln('addClipTag(): id is undefined.')
        else if(typeof value =='undefined') $.writeln('addClipTag(): value is undefined.')
        else{
            var index = getIndex('clips',id)
            if(index==-1) $.writeln("addClipTag(): couldn't find clip with id: ",id) // if there is no such clip
            else{
                repoObj.clips[index].tags.push(value.toString());
                updateRepo();
            }
        }
    }
    this.addClipTag = addClipTag;
    //-- MODIFY STUFF IN REPO --//
    //--------------------------//

    //-- REMOVE STUFF FROM REPO --//
    //============================//
    //-- Removes a clip --//
    this.removeClip = function(id){
        if(typeof id =='undefined') $.writeln('removeClip(): id is undefined.')
        else{
            var index = getIndex('clips',id)
            if(index==-1) $.writeln("couldn't find clip with id: ",id);
            else {
                repoObj.clips.splice(index,1);
                updateRepo();
            }
        }
    }
    //-- Removes a tag--//
    this.removeTag = function(id){
        if(typeof id =='undefined') $.writeln('removeClip(): id is undefined.');
        else{
            var index = getIndex('tags',id)
            if(index==-1) $.writeln("couldn't find tag with id",id);
            else {
                repoObj.tags.splice(index,1);
                updateRepo();
            }
        }
    }
    //-- REMOVE STUFF FROM REPO --//
    //============================//
} // EOF: Repo()

// Make new repository object
var repo = new Repo();
//repo.mdfy_name('x2c22ffff','ficken')
//repo.mdfy_poster('x2c22ffff',15)
//var file = File('/Users/fynn/Desktop/dat code.jpg'); repo.mdfy_raw('x2c22ffff',file);
//repo.addClipTag('xec57ffff','asdfasdf')
//repo.delClipTag('xec57ffff','fire')

//-- DO SOMETHING --
// Cave Johnson.
}