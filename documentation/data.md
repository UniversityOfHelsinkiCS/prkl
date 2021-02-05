# Real data

You can find a dump of real anonymized data from `prkl/data/anon_db.dump`

First make sure that your database is empty, but the tables exist. You can achieve this by first seeding and then emptying the database.

Then to load the data to your local postgres container use the following command:
`
cat data/anon_db.dump | docker-compose exec -T db psql -U postgres
`

Make sure you are running the container as you run the command. (running `npm run dev` in another terminal works fine)
