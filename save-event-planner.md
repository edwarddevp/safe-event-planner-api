# Documentation of Safe Event Planner api
### Table of contents
**[Token](#token)**<br>
**[Register](#register)**<br>
**[SignIn](#signin)**<br>
**[Events](#events)**<br>
**[Guests](#guests)**<br>
**[Security Measures](#security-measures)**<br>
**[Events Security Measures](#events-security-measures)**<br>
**[Categories](#categories)**<br>
**[Users](#users)**<br>

## Token
Responses when token is check, otherwise it continues with the consults

**TOKEN IS REQUIRED**
* Error Response:
   
  If token is not provided
  * code: 401
   ```json
   {
        "success": false,
        "code": 401,
        "data": {},
        "message": "PermissionError",
        "errors": {
            "error": [
                "Authentication credentials were not provided - Token is required"
            ]
        }
    }
   ```
  
  or
  
  If token in invalid
  * code: 401
  ```json
    {
        "success": false,
        "code": 401,
        "data": {},
        "message": "PermissionError",
        "errors": {
            "error": [
                "Unauthorized: invalid token."
            ]
        }
    }
  ```

----------------------------------------------------------------------------------


## Register
Register user into the app 

**TOKEN IS NOT REQUIRED**
* Url

  http://127.0.0.1:3000/api/v1/register

* Method

  **POST**

* Url Params

  **None**

* Data Params

    ```json
    {
        "name": "test 3", // required
        "email": "test@email.com", // required
        "password": "password", // required
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "user": {....}
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:

  * code: 400
  ```json
    {
        "success": false,
        "code": 400,
        "data": {},
        "message": "FormError",
        "errors": {
            "error": [
                "incorrect form submission"
            ]
        }
    }
  ```

  or

  * code: 400
  ```json
    {
        "success": false,
        "code": 400,
        "data": {},
        "message": "FormError",
        "errors": {
            "error": [
                "Email already exists"
            ]
        }
    }
  ```

  or
  
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

----------------------------------------------------------------------------------

## SignIn
Sign user into the app and respond token

**TOKEN IS NOT REQUIRED**
* Url

  http://127.0.0.1:3000/api/v1/signin

* Method

  **POST**

* Url Params

  **None**

* Data Params

    ```json
    {
        "email": "test@email.com",  // required
        "password": "password" // required
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "token": "TOKEN_ID"
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  
  If credential are invalid

  * code: 400
  ```json
    {
        "success": false,
        "code": 400,
        "data": {},
        "message": "FormError",
        "errors": {
            "error": [
                "incorrect form submission"
            ]
        }
    }
  ```

  or

  * code: 401
  ```json
    {
        "success": false,
        "code": 401,
        "data": {},
        "message": "PermissionError",
        "errors": {
            "error": [
                "Authentication wrong credentials"
            ]
        }
    }
  ```
  
  or
  
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

----------------------------------------------------------------------------------

## Events
Events Crud

**TOKEN IS REQUIRED**


**Get events list**

* Url

  http://127.0.0.1:3000/api/v1/events

* Method

  **GET**

* Url Params

  **None**

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "events": [ ... ]
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  * Filter by session id provide by the token
  
**Get single event**

* Url

  http://127.0.0.1:3000/api/v1/events/:id

* Method

  **GET**

* Url Params

  * :id = id event

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "event": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Create event**

* Url

  http://127.0.0.1:3000/api/v1/events

* Method

  **POST**

* Url Params

    **None**

* Data Params

    ```json
    {
        "name": "name", //required
        "description": "description",
        "guestlimit": 20,
        "direction": "Calle falsa 123",
        "startdate": "2005/05/05", //required
        "enddate": "2005/05/07", //required
        "categoryid": 8, 
        "securityMeasureIds": [],
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "event": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
  
  * code: 400
  ```json
    {
        "success": false,
        "code": 400,
        "data": {},
        "message": "FormError",
        "errors": {
            "error": [
                "incorrect form submission"
            ]
        }
    }
  ```

  or
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Update event**

* Url

  http://127.0.0.1:3000/api/v1/events/:id

* Method

  **PUT**

* Url Params

  * :id = id event

* Data Params

    ```json
    {
        "name": "name", 
        "description": "description",
        "guestlimit": 20,
        "direction": "Calle falsa 123",
        "startdate": "2005/05/05", 
        "enddate": "2005/05/07", 
        "categoryid": 8, 
        "securityMeasureIds": [],
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "event": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Delete event**
* Url

  http://127.0.0.1:3000/api/v1/events/:id

* Method

  **DELETE**

* Url Params

  * :id = id event

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "eventId": "TOKEN_ID"
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

----------------------------------------------------------------------------------

## Guests
Guests Crud

**TOKEN IS REQUIRED**


**Get guests list**

* Url

  http://127.0.0.1:3000/api/v1/events/:eventId/guests

* Method

  **GET**

* Url Params

  * :eventId = id event

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "guests": [ ... ]
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:

  * code: 400
  ```json
    {
        "success": false,
        "code": 400,
        "data": {},
        "message": "FormError",
        "errors": {
            "error": [
                "incorrect form submission"
            ]
        }
    }
  ```

  or
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**
  
**Get single guest**

* Url

  http://127.0.0.1:3000/api/v1/events/:eventId/guests/:id

* Method

  **GET**

* Url Params

  * :eventId = id event
  * :id = id guest

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "guest": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Create guests**

* Url

  http://127.0.0.1:3000/api/v1/events/:eventId/guests

* Method

  **POST**

* Url Params

  * :eventId = id event

* Data Params

    ```json
    {
      "name": "guest 1", // required
      "email": "guest1@email.com",
      "avatarimg": "img"
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "guest": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Update guest**

* Url

  http://127.0.0.1:3000/api/v1/events/:eventId/guests/:id

* Method

  **PUT**

* Url Params

  * :eventId = id event
  * :id = id guest

* Data Params

    ```json
    {
      "name": "guest 1", 
      "email": "guest1@email.com",
      "avatarimg": "img"
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "guest": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Delete guest**
* Url

  http://127.0.0.1:3000/api/v1/events/:eventId/guests/:id

* Method

  **DELETE**

* Url Params

  * :eventId = id event
  * :id = id guest

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
           "guestId": "TOKEN_ID"
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

----------------------------------------------------------------------------------

## Security Measures
Security Measures Crud

**TOKEN IS REQUIRED**


**Get Security Measures list**

* Url

  http://127.0.0.1:3000/api/v1/securitymeasures

* Method

  **GET**

* Url Params

  **None**

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "securitymeasures": [ ... ]
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**
  
**Get single Security Measure**

* Url

  http://127.0.0.1:3000/api/v1/securitymeasures/:id

* Method

  **GET**

* Url Params

  * :id = id securityMeasure

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "securityMeasure": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Create Security Measure**

* Url

  http://127.0.0.1:3000/api/v1/securitymeasures

* Method

  **POST**

* Url Params

    **None**

* Data Params

    ```json
    {
        "name": "security measures 7", // required
        "description": "description", 
        "value": 7 // required
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "securityMeasure": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:

  * code: 400
  ```json
    {
        "success": false,
        "code": 400,
        "data": {},
        "message": "FormError",
        "errors": {
            "error": [
                "incorrect form submission"
            ]
        }
    }
  ```

  or
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Update Security Measure**

* Url

  http://127.0.0.1:3000/api/v1/securitymeasures/:id

* Method

  **PUT**

* Url Params

  * :id = id securityMeasure

* Data Params

   ```json
    {
        "name": "security measures 7", 
        "description": "description", 
        "value": 7 
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "securityMeasure": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Delete Security Measure**
* Url

  http://127.0.0.1:3000/api/v1/securitymeasures/:id

* Method

  **DELETE**

* Url Params

  * :id = id securityMeasure

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "securityMeasureId": "TOKEN_ID"
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

----------------------------------------------------------------------------------


## Events Security Measures
Events Security Measures Crud

**TOKEN IS REQUIRED**

**Get Security Measures of a event**

* Url

  http://127.0.0.1:3000/api/v1/events/:eventId/securitymeasures

* Method

  **GET**

* Url Params

  * :eventId = id event

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "securityMeasure": [] ... ]
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Toggle Events Security Measure**

* Url

  http://127.0.0.1:3000/api/v1/events/:eventId/securitymeasures/:id

* Method

  **GET**

* Url Params

  * :eventId = id event
  * :id = id Security Measure

* Data Params

    **None**
  
* Success Response:
    * code: 200
    * case security measure added
    ```json
    {
        "code": 200,
        "data": {
          "securityMeasure": true
        },
        "message": "Ok",
        "success": true
    }
   ```
   * case security measure removed
   ```json
    {
        "code": 200,
        "data": {
          "securityMeasure": false
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Set Event Security Measures**

* Url

  http://127.0.0.1:3000/api/v1/events/:eventId/guests

* Method

  **POST**

* Url Params

  * :eventId = id event

* Data Params

    ```json
    {
      "securityMeasureIds": ["1"]
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "securityMeasureIds": [ ... ]
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

----------------------------------------------------------------------------------

## Categories
Categories Crud

**TOKEN IS REQUIRED**


**Get Categories list**

* Url

  http://127.0.0.1:3000/api/v1/categories

* Method

  **GET**

* Url Params

  **None**

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "categories": [ ... ]
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**
  
**Get single Category**

* Url

  http://127.0.0.1:3000/api/v1/categories/:id

* Method

  **GET**

* Url Params

  * :id = id category

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "category": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Create Category**

* Url

  http://127.0.0.1:3000/api/v1/categories

* Method

  **POST**

* Url Params

    **None**

* Data Params

    ```json
    {
      "name": "halloween" // required
    }   
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "category": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:

  * code: 400
  ```json
    {
        "success": false,
        "code": 400,
        "data": {},
        "message": "FormError",
        "errors": {
            "error": [
                "incorrect form submission"
            ]
        }
    }
  ```

  or
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Update Category**

* Url

  http://127.0.0.1:3000/api/v1/categories/:id

* Method

  **PUT**

* Url Params

  * :id = id category

* Data Params

   ```json
    {
    "name": "halloween"
    }     
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "category": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Delete Category**
* Url

  http://127.0.0.1:3000/api/v1/categories/:id

* Method

  **DELETE**

* Url Params

  * :id = id category

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "categoryId": "TOKEN_ID"
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

  ----------------------------------------------------------------------------------

## Users
Users Crud

**TOKEN IS REQUIRED**


**Get Users list**

* Url

  http://127.0.0.1:3000/api/v1/users

* Method

  **GET**

* Url Params

  **None**

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "users": [ ... ]
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**
  
**Get single user**

* Url

  http://127.0.0.1:3000/api/v1/users/:id

* Method

  **GET**

* Url Params

  * :id = id user

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "user": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

  **Clean user events**

* Url

  http://127.0.0.1:3000/api/v1/users/:id/clean

* Method

  **GET**

* Url Params

  * :id = id user

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "user": "success"
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:

  * code: 400
  ```json
    {
        "success": false,
        "code": 400,
        "data": {},
        "message": "NoEventsToDelete"
    }
  ```

  or
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Update User**

* Url

  http://127.0.0.1:3000/api/v1/users/:id

* Method

  **PUT**

* Url Params

  * :id = id user

* Data Params

   ```json
    {
        "name": "test 2 - updated",
        "email": "test2updated@email.com"
    }
   ```
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "user": { ... }
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**

**Delete User**
* Url

  http://127.0.0.1:3000/api/v1/user/:id

* Method

  **DELETE**

* Url Params

  * :id = id user

* Data Params

    **None**
  
* Success Response:
    * code: 200
    ```json
    {
        "code": 200,
        "data": {
          "userId": "TOKEN_ID"
        },
        "message": "Ok",
        "success": true
    }
   ```

* Error Response:
   
  * case: 500
   ```json
    {
        "success": false,
        "code": 500,
        "data": {},
        "message": "Internal Server Error",
        "errors": {
            "error": [
                "errors"
            ]
        }
    }
  ```
* Notes:
 
  **None**