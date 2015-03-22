## Database Design


### Setting up mongo
log in to mongo

```
 use primero
 db.createUser({user: 'donato', pwd : 'oau123noazffu9invk', roles: ['readWrite']})
```

### User Management

```
{
    user_nickname(unique) : {
        unique