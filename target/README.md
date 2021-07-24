# Setup

```sh
sudo docker run --name xss-demo-target-db -p 4242:5432 -e POSTGRES_PASSWORD=1234 -d postgres:latest
sudo docker exec -it xss-demo-target-db psql -U postgres
CREATE DATABASE target;
cat db.sql | sudo docker exec -i xss-demo-target-db psql -U postgres target
```

Add this to `.env`:

```
PGCONNECTION=postgres://postgres:1234@localhost:4242/target
```

PGPASSWORD=1234 psql -h frankfurt-postgres.render.com -U target target -f db.sql
