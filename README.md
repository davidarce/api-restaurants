# Tyba Restaurants API
A RESTful API for search restaurants based on the provided search criteria

### Technologies
- JavaScript
- TypeScript
- Node.js and Express.js
- Authentication with JSON Web Tokens
- TypeORM an ORM for typescript
- Sqlite3 as dev database
- Redis to store blacklist tokens
- Docker for deploying

## How to use

```
git clone https://github.com/davidarce/api-restaurants.git   

cd api-restaurants

npm install

npm run build
```
## Running with docker

```
docker-compose up --build 
```

## Running local
### Prerequisites
- TypeScript
- Redis installed in your local machine -> localhost:6379

```
npm run start-dev
```

Now you can access the API with base-path http://localhost:3000/

# Endpoints 
Authorization "Bearer token" header is mandatory to access resources

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e9dc701c42cd2fba226e#?env%5BTYBA%5D=W3sia2V5IjoibG9jYWxob3N0IiwidmFsdWUiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJlbmFibGVkIjp0cnVlfV0=)

```
Auth:

- POST    /api/auth/login - login to get Authorization token 
- POST    /api/auth/logout - logout to revoked Authorization token  
- POST    /api/auth/change-password - change user password

Users:

- GET      /api/users/ - get all users
- GET      /api/users/:id - get user by id
- GET      /api/users/me - get information from user logged
- POST     /api/users/- create user
- DELETE   /api/users/:id- delete user
- PATCH    /api/users/:id- edit user

Restaurants:

- GET     /api/restaurants/search?location=:location&latitude=:latitude&longitude=:longitude - search restaurants based on the provided search criteria 
- GET     /api/restaurants/search/history get a search history from user logged 

```

## Http Status Code Summary

```
200 OK - Everything worked as expected
201 OK - Resource created
204 OK - There is no content to send for this request,
400 Bad request - The request due to something that is perceived to be a client error 
401 Unauthorized -  The client must authenticate itself to get the requested response.
404 Not Found - The requested resource does not exist
500 Internal Server error - The server has encountered a situation it doesn't know how to handle.
```
# Examples

## Auth Resources

### POST /api/auth/login

##### Example

###### Request

```
POST /api/auth/login
```

Body

```
{
	"username": "admin",
	"password": "admin"
}
```

##### Response
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE1ODAwNjIzNzMsImV4cCI6MTU4MDA2NTk3M30.7bKPDE_14sNleL3_H9aKvnIa02I2RZS_knUuH57wOQc"
}
```

### POST /api/auth/logout

##### Example

###### Request

```
POST /api/auth/logout
```

###### Response

```
200 OK or 401 Unauthorized
```

## Users Resources

### POST /api/users/

##### Example

###### Request

```
POST /api/users/
```

Body

```
{
	"username": "tyba",
	"password": "tyba",
	"role": "USER"
}
```

##### Response
```
201 created
```

## Restaurants Resources

### GET /api/restaurants/search?location=:location&latitude=:latitude&longitude=:longitude

##### Example

###### Request

```
GET /api/restaurants/search?location=NYC

Query params:

location: Required if either latitude or longitude is not provided. This string indicates the geographic area to be used when searching for businesses. Examples: "New York City", "NYC".

latitude: Required if location is not provided. Latitude of the location you want to search nearby.

longitude: Required if location is not provided. Longitude of the location you want to search nearby.
```

##### Response
```
{
    "restaurants": [
        {
            "name": "Upstate Craft Beer & Oyster Bar",
            "alias": "upstate-craft-beer-and-oyster-bar-new-york-4",
            "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/RvnUVU7MF7DT0RzNL-EebQ/o.jpg",
            "url": "https://www.yelp.com/biz/upstate-craft-beer-and-oyster-bar-new-york-4?adjust_creative=FvuRVvJtk5UXtOIFVngfoA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=FvuRVvJtk5UXtOIFVngfoA",
            "rating": 4.5,
            "coordinates": {
                "latitude": 40.726373,
                "longitude": -73.986557
            },
            "range_price": "$$",
            "phone": "+16467915400",
            "location": {
                "address": "95 1st Ave",
                "city": "New York",
                "country": "US"
            }
        },
        {
            "name": "Amélie",
            "alias": "amélie-new-york",
            "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/cSDgVuPMnJgMLTrTNSEXug/o.jpg",
            "url": "https://www.yelp.com/biz/am%C3%A9lie-new-york?adjust_creative=FvuRVvJtk5UXtOIFVngfoA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=FvuRVvJtk5UXtOIFVngfoA",
            "rating": 4.5,
            "coordinates": {
                "latitude": 40.7327,
                "longitude": -73.99766
            },
            "range_price": "$$",
            "phone": "+12125332962",
            "location": {
                "address": "22 W 8th St",
                "city": "New York",
                "country": "US"
            }
        }
    ]
}
```

### GET /api/restaurants/search/history?limit=:limit

##### Example

###### Request

```
GET /api/restaurants/search/history

Query params:

limit: Optional > 1. Number of search history results to return by default return all search history
```

##### Response
```
[
    {
        "id": 1,
        "city": "Medellin",
        "latitude": "",
        "longitude": "",
        "createdAt": "2020-01-26T18:10:23.000Z",
        "user": {
            "username": "admin"
        }
    },
    {
        "id": 2,
        "city": "NYC",
        "latitude": null,
        "longitude": null,
        "createdAt": "2020-01-26T19:10:08.000Z",
        "user": {
            "username": "admin"
        }
    }
]
```


