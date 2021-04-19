**Known issues**

* The algorithm doesn’t work very well when enrolling to a course from different time zones. At the moment when enrolling the working times will be saved as UTC time compared to the local time zone. However, the algorithm only takes into account times that are between 6:00 and 20:00 UTC. It needs to be decided if participation from different time zones should be possible (and change the algorithm accordingly) or if the working times should always be saved as if the enrollment to the course was done from Finland. This should also be clearly shown to the user.

* Typing to form when creating or editing a course is quite sluggish due to constant validating of form inputs.

* If the frontend appears as a blank page, the database is empty and needs to be seeded. This can be done by starting up the backend and visiting: `http://localhost:3001/seed`.

* Cypress requires (more than little) patience. If you try to run all specs whilst in `npm run test:dev` -view, the test browser may crash (has happened with Chrome). Try with different browser or run the specs one by one.
