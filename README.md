# Stpes to start application.

## Prerequisites

+ Node.js
+ npm
+ Running postgres server and created empty database authentication_db

## Setup Backend

> copy example.env to .env and replace your postgres creds in .env

```bash 
cd server
npm install
npm run dev
```

>> Backend will run on: http://localhost:5000


## setup  cliend 


```bash

cd client
npm install
npm run dev

```

>> Frontend will run on: http://localhost:5173
 

 # Login creds

 ```js 
[
    {
      name: "Test User 3",
      emailId: "user3@gmail.com",
      phoneNumber: "9876543210",
      gender: "male",
    },
    {
      name: "Test User One",
      emailId: "user1@gmail.com",
      phoneNumber: "9876543211",
      gender: "male",
    },
    {
      name: "Test User Two",
      emailId: "user2@gmail.com",
      phoneNumber: "9876543212",
      gender: "female",
    },
  ]
 ```