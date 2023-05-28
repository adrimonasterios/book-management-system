# Book Management System

<img width="1043" alt="Screen Shot 2023-05-28 at 05 20 23" src="https://github.com/adrimonasterios/book-management-system/assets/25689012/9208dfd6-a155-4ab0-8275-07fab122a296">

## Requirements:

**Backend:**

- Set up a Node.js server using Express.
- Use Prisma as the ORM to connect to a mysql database.
- Define a Book model with the following properties: id (UUID), title (string), author (string), publicationYear (integer), and createdAt/updatedAt (timestamps).
- Implement GraphQL APIs using Apollo Server to perform CRUD operations on books.
- Implement proper validation and error handling for the APIs.

**Frontend:**

- Create a React application using Create React App.
- Set up Apollo Client to communicate with the GraphQL backend.
- Display a list of books on the homepage, including their titles, authors, and publication years.
- Implement a form to add a new book, including validation for required fields.
- Enable editing and deleting of existing books.
- Implement proper error handling and display error messages if API requests fail.

**Testing (optional but add bonus points):**

- Write unit tests for the backend APIs using a testing framework of your choice (e.g., Jest).
- Write integration tests for the frontend components using a testing framework of your choice (e.g., React Testing Library).

**Bonus:**

- Implement pagination or infinite scrolling for the book list.
- Add search and filtering capabilities to the book list.
- Implement authentication and authorization using a library like JWT or OAuth.


## Project Structure and Technologies used

This is an app with monolithic architecture. Basically there are 2 main folders:

1. client: A CRA application that uses tailwind to add style to the components and Apollo Client to communicate with the backend.
2. server: A Node.js server is setup to work with Graphql, through Apollo Server Express.js and Prisma.

The data is stored in a MySQL database

For testing purposes Jest is used to cover the unit tests for the Graphql resolvers and Jest and testing-library/react to cover integration tests in React.

The Graphql resolvers are protected by JWT authorization. Only requests that have a valid JWT token in the authorizationi header are able to get data back from the server.

## Start the application

To run the application follow these steps:

Install dependencies :

```
npm install
```

Create a new docker container to host a MySQL database:

```
docker run --name book-system -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql
```

Push the prisma schema to the database:

```
npx prisma db push
```

Start the server:

```
npm run dev.server
```

Install CRA dependencies:

```
cd client
npm install
```

Start client:

```
cd ..
npm run dev.client
```

Environment variables needed in .env

```
DATABASE_URL="mysql://root:root@localhost:3306/book-system"
TOKEN_SECRET="test-admin"
```

Environment variables needed in client/.env

```
REACT_APP_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbiI6ImJvb2stbWFuYWdlbWVudC1zeXN0ZW0iLCJpYXQiOjE1MTYyMzkwMjJ9.iT51THicnwBUtLF3ELeDIa7D7BQy7rpBIMIf8NPKwCQ
```

## Testing

To run the resolver unit tests run:

```
npm run test
```

To run the react app integration tests run:

```
cd client
npm run test
```
