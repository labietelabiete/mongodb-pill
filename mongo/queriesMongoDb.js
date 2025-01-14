// Creating and switching into the database
use booksDb;

// Creating collections and schemas
db.createCollection("authors", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "lastName", "country"],
      properties: {
        name: {
          bsonType: "string",
          description: "This must be a string and required",
        },
        lastName: {
          bsonType: "string",
          description: "This must be a string and required",
        },
        dateOfBirth: {
          bsonType: "date",
          description: "This must be a date and required",
        },
        dateOfDeath: {
          bsonType: "date",
          description: "This must be a date and required",
        },
        country: {
          bsonType: "string",
          description: "This must be a string and required",
        },
      }
    }
  }
});
db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "releaseYear", "category"],
      properties: {
        title: {
          bsonType: "string",
          description: "This must be a string and required",
        },
        releaseYear: {
          bsonType: "array",
          minItems: 1,
          uniqueItems: true,
          additionalProperties: false,
          items: {
            bsonType: "date",
            description: "This must be a date and required",
          }
        },
        category: {
          bsonType: "string",
          description: "This must be a string and required",
        },
        authors: {
          bsonType: "array",
          minItems: 1,
          uniqueItems: true,
          additionalProperties: false,
          items: {
            bsonType: "object",
            required: ["_id", "name", "lastName"],
            properties: {
              _id: {
              },
              name: {
                bsonType: "string",
                description: "This must be a string and required",
              },
              lastName: {
                bsonType: "string",
                description: "This must be a string and required",
              },
            }
          }
        }
      }
    }
  }
});

////////////////////////////////////////////////////////////////
// INSERT DATA

// Inserting 3 authors
db.authors.insertMany([
  {
    name: "Federico",
    lastName: "Garcia Lorca",
    dateOfBirth: new Date("1898-07-05"),
    dateOfDeath: new Date("1936-08-18"),
    country: "Spain",
  },
  {
    name: "Dan",
    lastName: "Brown",
    dateOfBirth: new Date("1964-06-22"),
    country: "USA",
  },
  {
    name: "Edgar Allan",
    lastName: "Poe",
    dateOfBirth: new Date("1809-01-19"),
    dateOfDeath: new Date("1849-10-07"),
    country: "USA",
  },
]);


// Inserting 10 books
db.books.insertMany([
  {
    title: "Bodas de sangre",
    releaseYear: [new Date("1933")],
    category: "Tragedy",
    authors: [db.authors.findOne({ name: "Federico" }, { id: 1, name: 1, lastName: 1 })],
  },
  {
    title: "Romancero gitano",
    releaseYear: [new Date("1928")],
    category: "Poetry",
    authors: [db.authors.findOne({ name: "Federico" }, { id: 1, name: 1, lastName: 1 })],
  },
  {
    title: "Poeta en Nueva York",
    releaseYear: [new Date("1940")],
    category: "Poetry",
    authors: [db.authors.findOne({ name: "Federico" }, { id: 1, name: 1, lastName: 1 })],
  },
  {
    title: "Impresiones y paisajes",
    releaseYear: [new Date("1918")],
    category: "Prose",
    authors: [db.authors.findOne({ name: "Federico" }, { id: 1, name: 1, lastName: 1 })],
  },
  {
    title: "Angels and Demons",
    releaseYear: [new Date("2000")],
    category: "Thriller",
    authors: [db.authors.findOne({ name: "Dan" }, { id: 1, name: 1, lastName: 1 })],
  },
  {
    title: "The Da Vinci Code",
    releaseYear: [new Date("2003")],
    category: "Thriller",
    authors: [db.authors.findOne({ name: "Dan" }, { id: 1, name: 1, lastName: 1 })],
  },
  {
    title: "Inferno",
    releaseYear: [new Date("2017")],
    category: "Thriller",
    authors: [db.authors.findOne({ name: "Dan" }, { id: 1, name: 1, lastName: 1 })],
  },
  {
    title: "The black cat",
    releaseYear: [new Date("1843")],
    category: "Horror",
    authors: [db.authors.findOne({ name: "Edgar Allan" }, { id: 1, name: 1, lastName: 1 })],
  },
  {
    title: "The oval portrait",
    releaseYear: [new Date("1842")],
    category: "Horror",
    authors: [db.authors.findOne({ name: "Edgar Allan" }, { id: 1, name: 1, lastName: 1 })],
  },
  {
    title: "Eldorado",
    releaseYear: [new Date("1849")],
    category: "Poetry",
    authors: [db.authors.findOne({ name: "Edgar Allan" }, { id: 1, name: 1, lastName: 1 })],
  },
]
);


// Update data ---------------------------------------------
// Add a date of death to one Author
db.authors.updateOne({ name: "Dan" }, { $set: { dateOfDeath: new Date() } });

// Add a new release year to a book
db.books.updateOne({ title: "Eldorado" }, { $push: { releaseYear: new Date("2021") } });
db.books.updateOne({ title: "EldoradoNew Edition" }, { $push: { authors: db.authors.findOne({ name: "Dan" }, { id: 1, name: 1, lastName: 1 }) } });

// Change the title of a book adding (“New Edition”)
db.books.updateOne({ title: "Eldorado" }, [{ $set: { title: { $concat: ["$title", " New Edition"] } } }], { multi: true });



// Get data -------------------------------------------------
// Select all books
db.books.find({});
// Select all books for a given category
db.books.find({ category: "Poetry" }, { title: 1 });
// Select all books published before 2002
db.books.find({ releaseYear: { $lt: new Date("2002") } }, { title: 1, releaseYear: 1 });
// Select all books with more than one author
db.books.find({ $where: "this.authors.length > 1" }, { title: 1, authors: 1 });
// Select all authors
db.authors.find({});
// Select all death authors
db.authors.find({ dateOfDeath: { $exists: true } }, { name: 1, lastName: 1 });
// Select all authors born before 1990
db.authors.find({ dateOfBirth: { $lt: new Date("1990") } }, { name: 1, lastName: 1 });
// Select all authors from a given country
db.authors.find({ country: "USA" }, { name: 1, country: 1 });



// DELETE DATA ----------------------------------------------------------
// Eliminate all the books for a given author
db.books.deleteMany({ "authors.name": "Edgar Allan" });
// Eliminate all the dead authors
db.authors.deleteMany({ dateOfDeath: { $exists: true } }, { name: 1, lastName: 1 });
