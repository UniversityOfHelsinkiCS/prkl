**Known issues**

* Moving between different course’s groupviews gives TypeError if there are different students on the courses. Refreshing the page fixes the view.
* Keepalive polling (used to keep the user logged in) seems to not work in production: returns 404 instead.
* The algorithm doesn’t work very well when enrolling to a course from different time zones. At the moment when enrolling the working times will be saved as UTC time compared to the local time zone. However, the algorithm only takes into account times that are between 6:00 and 20:00 UTC. It needs to be decided if participation from different time zones should be possible (and change the algorithm accordingly) or if the working times should always be saved as if the enrollment to the course was done from Finland. This should also be clearly shown to the user.
