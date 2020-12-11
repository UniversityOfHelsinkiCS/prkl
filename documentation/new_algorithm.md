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

### Pseudocode for forming groups



