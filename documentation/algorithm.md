**Algorithm**

The aim of the algorithm is two-fold. Creating groups based on common times, and creating groups with similar or dissimilar (up to the end user) answers to the questions. At the moment, the use of tentative times is not implemented, they are instead interpreted as fully working times.

The current (fairly simple) idea of the algorithm is to randomly create groups with as many matching times as possible. The created proposed set of groups is scored by how well the times match, as  well as how similar (dissimilar is yet to be implemented) the answers are. This would then be repeated for a number of (at least 1000+) times, and the best scoring grouping is then selected and returned.

Single choice questions are assumed to be on a continuum, ie. with three choices, choices 1 and 2 are more similar than 1 and 3. Multiple choice questions are graded simply by the amount of similar answers (actually the inverse of dissimilar answers). A smarter option would be to add weights or values to specific answer choices, so these could be used to group users more (or less) aggressively. 

Some smarter clustering algorithm would probably yield better results, as the random approach can’t even scratch the surface of all possible groupings. For context, there are over 10^100 ways to divide 99 into groups of 3. We couldn’t find a well suited clustering algorithm for our needs, but that is not to say that one does not exist. We quite quickly decided to move along with a simpler approach.

The algorithm also provides a method to generate randomized data for testing. The randomized data contains four questions (single choice questions with 3 and 4 choices, multiple choice questions with 4 and 5 choices) with random answers, and a randomized answer to the timetable question. Feel free to tweak these according to your needs.

The algorithm doesn’t work very well when enrolling to a course from different time zones. At the moment when enrolling the working times will be saved as UTC time compared to the local time zone. However, the algorithm only takes into account times that are between 6:00 and 20:00 UTC. It needs to be decided if participation from different time zones should be possible (and change the algorithm accordingly) or if the working times should always be saved as if the enrollment to the course was done from Finland. This should also be clearly shown to the user.
