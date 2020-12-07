# User roles

There are three levels of authorization (from least to most privileges):

* Student 
* Staff 
* Admin

Each elevation of privileges (student -> staff -> admin) retains old privileges and adds extra ones on top. Here is a list of privileges that user gets with each role. 

## Current rights users have:

### Student 
* can see a list of current published courses and past courses that s/he has registered on
* can order and filter courses
* can register on a published course if its deadline has not passed
* can see info about themselves (name, email, list of own registrations etc.)
* can delete own registration if course’s deadline has not passed
* can see groups s/he has been assigned to after course's teacher has published them

### Staff
* can choose to see only own courses and/or past courses 
* can add a new course 
* can edit an unpublished course, if s/he is course's teacher
* can delete own courses 
* can see registrations on courses that s/he teaches 
* can delete students' registrations from own course
* can form groups from course's students and publish them if s/he is the teacher

### Admin 
* can edit and delete any course (except adding and deleting questions of published courses)
* can see list of registrations on any course
* can delete registrations from any course
* can close course's registration immediately
* can manage users in the database

