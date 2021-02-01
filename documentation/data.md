# Real data

You can find a dump of real anonymized data from `prkl/data/anon_db.dump`

To load this data to your local postgres container use the following command:
`
cat data/anon_db.dump | docker-compose exec -T db psql -U postgres
`

Make sure you are running the container before you run the command. (running `npm run dev` in another terminal works fine)
