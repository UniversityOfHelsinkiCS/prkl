# New algorithm (developed December 2020)

New algorithm differs from [earlier iteration](documentation/algorithm.md) (which can still be found from repository). Current algorithm calculates overlapping hours 
between every pair of students. Then students are ordered based on amount of total working hours 
(from least to most) and forming of groups can start:

### When forming groups:

1. Check if users can be divided evenly into groups given the asked group size

2. If not: remove the remainder from the beginning of array (people with least working hours), mark them
as a group and mark each member as handled

3. For the remaining users: select next student that is not commited to a group and put him/her as a first 
member of the current group

4. While current group has space: find next available student with maximum common hours with user chosen in 
previous step

5. Mark student as belonging to current group and no longer available 

6. Repeat from step 4 

7. When the group is full, push it into array of ready groups, select next available student and repeat

(Note that week days are encoded as numbers 5-11 and stored in a Map object, in which they are 
mapped onto numbers 0-6)

### Todo

Currently the algorithm can only use the student-specific working hour answers to generate the new groups. The algorithm needs to be expanded so that in addition to the working hours, it can also use the answers to other questions (i.e. to single- and multi-choice questions) to evaluate the best groups. In addition to this, it would probably be a nice feature to let the course creator specify different weights for different questions, so that similar working hours could be marked as most important, similarity of programming language knowledge the second important, and so on.

Another useful feature would be to have the algorithm return a leftover group that consists of people who have, for example, too few available working hours. This should also be configurable by the teacher who is creating the course. These leftover students would then be shown in their own, clearly specified non-group in the group creation view, to be manually assigned to groups by the teacher.

Another missing feature: course creator should be allowed to confine the possible working hours to specific days or times (to disallow picking times that collide with the lecture times of the course, for example).

