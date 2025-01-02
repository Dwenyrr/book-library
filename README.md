# book-library
School Project: Book library API is a Node.js and Express-based RESTful API for managing a book register/library.<br/><br/>
Technologies used: **Node.js, Express.js, MongoDB, dotenv, body-parser**

The API connects to a MongoDB database and provides endpoints for performing CRUD operations on a collection of books. 

## Features:
* Fetch all books stored in the registry
* Fetch details of a spesific book using its unique identifier
* Retrieve books that match specific criteria, such as genre and a minimum rating, for reding suggestions
* Insert a new book into the registry
* Update book details by adding a review, rating and marking a book as read
* Remove a book from the registry

## API Endpoints

|  Method  |  Endpoint  |  Description  |
|  ------  |  --------  |  -----------  |
|  GET     |  /kirjat	  |  Retrieve all books  |
|  GET	   |  /kirja/:id  |  Retrieve a specific book by its ID  |
|  GET     |  /seuraavaksi-luettavaksi/:rating/:genre  |  Fetch recommended books based on rating and genre  |
|  POST    |  /lisaa-kirja  |  Add a new book to the registry  |
|  PUT     |  /arvostele/:id  |  Add a review and rating for a book, and mark it as read  |
|  DELETE  |  /poista/:id  |  Delete a book from the registry  |
