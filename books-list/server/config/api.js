/**
 * Created by paulocristo on 10/11/15.
 */

//API ROUTES
module.exports = function(apiRouter) {

    //-----------------------------------------------------------------------

    var Book  = require('../models/book');
    //get all books
    apiRouter.get('/books', function(req, res) {

            //get the number of records
            Book.count().exec( function (err, count) {

                var offset = 0;
                var numResultsPerPage = 100;
                var numPages = count / numResultsPerPage;

                if(req.query.offset) {
                    offset = parseInt(req.query.offset);
                }

                //example sort call
                ///api/books?cmd=get-records&limit=100&offset=0&sort[0][field]=author&sort[0][direction]=asc

                var sortField = 'index';//sort by index as default
                var sortDirection = 1;//ASC by default

                if(req.query.sort) {

                    //convert it to a JSON obj, for parsing
                    var queryToJSON = JSON.parse(JSON.stringify(req.query.sort));

                    if(queryToJSON[0].field && queryToJSON[0].field.length > 0) {
                        sortField = queryToJSON[0].field;
                    }//else default

                    if(queryToJSON[0].direction && queryToJSON[0].direction=="desc") {
                        sortDirection = -1;
                    }//else default
                    console.log("sort field: " + sortField + ", sort direction: " + sortDirection);
                }

                var searchField = null;//where to search
                var searchOperator = null;
                var searchType = null;//search type
                var searchExpression = null;//what to look for
                var doSearch = false;

                if(req.query.search) {

                    doSearch = true;

                    var filterToJSON = JSON.parse(JSON.stringify(req.query.search));
                    searchField = filterToJSON[0].field;
                    searchType = filterToJSON[0].type;
                    searchOperator = filterToJSON[0].operator;
                    searchExpression = filterToJSON[0].value;
                }

                //request examples for the sort/search
                //GET /api/books?cmd=get-records&limit=100&offset=0&search[0][field]=author&search[0][type]=text&search[0][operator]=begins&search[0][value]=Paulo&searchLogic=AND&sort[0][field]=author&sort[0][direction]=asc
                //GET /api/books?cmd=get-records&limit=100&offset=0&search[0][field]=genre&search[0][type]=text&search[0][operator]=contains&search[0][value]=test&searchLogic=AND&sort[0][field]=author&sort[0][direction]=asc
                //GET /api/books?cmd=get-records&limit=100&offset=0&search[0][field]=gender&search[0][type]=text&search[0][operator]=is&search[0][value]=F&searchLogic=AND&sort[0][field]=authorInfo.gender&sort[0][direction]=asc

                //is, begins, contains, ends
                //limit/paginate records
                var greater = (offset === 0) ? 0 : offset;
                var lessThen = (greater + numResultsPerPage) + 1;


                if(doSearch && searchField!==null && searchExpression!==null) {

                    console.log("filter by: " + searchField + " expression: " + searchExpression);
                    //filter by book genre
                    if(searchField==="genre") {
                        Book.find(function(err, books) {

                            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                            if (err) {
                                res.send(err);
                            }

                            //var count = books.length;
                            var response = {

                                "total": count,
                                "page" : offset/numResultsPerPage,
                                "records":books
                            };

                            res.json(response);
                        }).where('genre').equals(searchExpression).sort( [[sortField, sortDirection]] );
                    }
                    //filter by author gender
                    else if(searchField==="authorInfo.gender") {
                        Book.find(function(err, books) {

                            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                            if (err) {
                                res.send(err);
                            }

                            //var count = books.length;
                            var response = {

                                "total": count,
                                "page" : offset/numResultsPerPage,
                                "records":books
                            };

                            res.json(response);
                        }).where('authorInfo.gender').equals(searchExpression.toUpperCase()).sort( [[sortField, sortDirection]] );
                    }



                }
                else { //do sort
                    Book.find(function(err, books) {

                        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                        if (err) {
                            res.send(err);
                        }

                        //var count = books.length;
                        var response = {

                            "total": count,
                            "page" : offset/numResultsPerPage,
                            "records":books
                        };

                        res.json(response); // return all records in JSON format
                    }).where('index')
                        .gt(greater)
                        .lt(lessThen)
                        .sort( [[sortField, sortDirection]] );// 1 -> get all items asc by index
                }


            });
          // 1  -> ASC
          // -1 -> DESC
          //sort({ index: 1 }). OR sort( [['index', 1]])

    });

    //NOT used, as pert the requirements/specs (we have author info directed connected to the book model)
    var Author  = require('../models/author');
    //get all authors
    apiRouter.get('/authors', function(req, res) {

        //just use mongoose to get all records in the database
        Author.find(function(err, authors) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }



            var count = authors.length;
            var response = {
                "total": count,
                "records":authors
            };

            res.json(response); // return all records in JSON format
        }).sort( [['time', 1]] );// get all items asc by created date.;

    });

};
