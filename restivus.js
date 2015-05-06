Things = new Mongo.Collection('things');

if (Meteor.isServer) {
  console.log("starting up, we have " + Things.find().count() + " things in the db");
  if (Things.find().count() == 0) {
    console.log("inserting some test data");
    Things.insert({name: "William", nickname: 'Bill'});
    Things.insert({name: "Susan", nickname: 'Sue'});
    Things.insert({name: "Maxwell", nickname: 'Max'});
    console.log("now we have " + Things.find().count() + " things in the db");
  }

  // Global API configuration
  Restivus.configure({
//    useAuth: true,
    prettyJson: true
  });

  // Generates: GET, POST, DELETE on /api/things and GET, PUT, DELETE on
  // /api/things/:id for Things collection
  // 
  // try:
  // /api/things
  // should return:
  //  {
  //  "status": "success",
  //  "data": [
  //    {
  //      "_id": "JGjJKLm5vBaSMBWPT",
  //      "name": "William",
  //      "nickname": "Bill"
  //    },
  //    {
  //      "_id": "uPpybkv2kxgExpYyS",
  //      "name": "Susan",
  //      "nickname": "Sue"
  //    },
  //    {
  //      "_id": "aWyGNhJDKnJ4a7thp",
  //      "name": "Maxwell",
  //      "nickname": "Max"
  //    }
  //  ]
  //}
  //
  // try
  //
  // /api/things/JGjJKLm5vBaSMBWPT
  // 
  // should return:
  // {
  //  "status": "success",
  //  "data": {
  //    "_id": "JGjJKLm5vBaSMBWPT",
  //    "name": "William",
  //    "nickname": "Bill"
  //  }
  //}

  Restivus.addCollection(Things);


  // try in browser
  // /api/getByParam/?name=Maxwell
  //
  // should return:
  //{
  //  "message": "found the thing with name Maxwell",
  //  "result": {
  //    "_id": "aWyGNhJDKnJ4a7thp",
  //    "name": "Maxwell",
  //    "nickname": "Max"
  //  }
  //}
  Restivus.addRoute('getByParam', {authRequired: false}, {
    get: function () {
      console.log("getByParam, url params: ", this.urlParams);
      var name = this.urlParams.query.name;
      console.log("getByParam, name param is: ", name);
      var theThing = Things.findOne({name: name});
      if (theThing) {
        console.log("found thing: ", theThing);
        return {
          statusCode: 200,
          body: {message: 'found the thing with name ' + name, result: theThing}
        };
      }
      else {
        console.log("couldn't find thing");
      return {
          statusCode: 404,
          body: {message: "couldn't find the thing with name " + name}
        };
      }
    },
    post: function () {
      console.log("post to customEndpoint");
    }
  });

  // try in browser
  // /api/getByNickname/Sue
  //
  // should return:
  // {
  //  "message": "found the thing with nickname Sue",
  //  "result": {
  //    "_id": "uPpybkv2kxgExpYyS",
  //    "name": "Susan",
  //    "nickname": "Sue"
  //  }
  //}
  Restivus.addRoute('getByNickname/:nickname', {authRequired: false}, {
    get: function () {
      var nickname = this.urlParams.nickname;
      console.log("finding by nickname " + nickname);
      var theThing = Things.findOne({nickname: nickname});
      if (theThing) {
        console.log("found thing: ", theThing);
        return {
          statusCode: 200,
          body: {message: 'found the thing with nickname ' + nickname, result: theThing}
        };
      }
      else {
        console.log("couldn't find thing");
      return {
          statusCode: 404,
          body: {message: "couldn't find the thing with nickname " + nickname}
        };
      }
    },
    post: function () {
      console.log("post to getByNickname");
    }
  });

}