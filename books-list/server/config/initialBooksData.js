/**
 * Created by paulocristo on 22/04/16.
 */

var Book = require('../models/book');
var Author = require('../models/author');
var async = require('async');

module.exports = function() {

    var getRandomAuthor = function() {
        var authorArray = [
            {name: 'John', gender:'M'},
            {name: 'Paulo', gender: 'M'},
            {name: 'Alfred', gender: 'M'},
            {name: 'Susan', gender: 'F'},
            {name: 'Alice', gender:'F'},
            {name: 'Stewart', gender: 'M'},
            {name: 'Olive', gender: 'F'},
            {name: 'Linda', gender: 'F'}
        ];
        var randomIndex = Math.floor(Math.random()*authorArray.length);
        return authorArray[randomIndex];
    };

       // create the book authors
        console.log("Creating 10 different book authors...");
        for(var i = 0; i < 10 ; i++) {

            var auth = getRandomAuthor();
            // create an author record
            Author.create({


                name: auth.name,
                gender: auth.gender,
                done: false
            }, function(err, record) {
                if (err)
                   console.log("error creating author: " + err);

            });
        }


    //already exist
    Book.count().exec( function (err, count) {
        if (count > 0) {
            console.log("current num of books in list: " + count );
            return;
        }
        else {
            console.log("generating initial list");
        }

        var bulk = Book.collection.initializeOrderedBulkOp();
        var counter = 0;

        var getRandomGenre = function() {
            var genreArray = [
                'thriller',
                'comedy',
                'action',
                'horror',
                'finance',
                'romance'
            ];
            var randomIndex = Math.floor(Math.random()*genreArray.length);
            return genreArray[randomIndex];
        };


        async.whilst(
            // Iterator condition
            function() { return counter < 1000000 },//1000000

            // Do this in the iterator
            function(callback) {
                counter++;
                var randomAuth = getRandomAuthor();
                var randomDate = new Date();

                //random day of month between 1 and 29
                randomDate.setDate(  Math.floor(Math.random()*29) + 1);

                var model = {
                    index: counter,
                    name: 'Book_' + counter,
                    genre: getRandomGenre(),
                    //author: randomAuth.name,
                    publishDate: randomDate,
                    authorInfo: {
                        name: randomAuth.name,
                        gender: randomAuth.gender
                    }
                };

                bulk.insert(model);
                console.log( "inserted book: " + JSON.stringify(model) );

                if ( counter % 1000 == 0 ) { //1000
                    bulk.execute(function(err,result) {
                        bulk = Book.collection.initializeOrderedBulkOp();
                        callback(err);
                    });
                } else {
                    callback();
                }
            },

            // When all is done
            function(err) {
                if ( counter % 1000 != 0 )//1000
                    bulk.execute(function(err,result) {
                    });
                console.log( "I'm finished inserting 1 million rows now!");
            }
        );
    });
};
