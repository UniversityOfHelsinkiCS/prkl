import psycopg2 as psy

connection = psy.connect(user='postgres', password='postgres', host='localhost', database='postgres')

cursor = connection.cursor()
print(connection.get_dsn_parameters(), "\n")

cursor.execute("SELECT version();")
record = cursor.fetchone()
print("You are connected to - ", record, "\n")


class User:
    def __init__(self, id, shibbolethUid, role, firstname, lastname, studentNo, email):
        self.id = id
        self.shibbolethUid = shibbolethUid
        self.role = role
        self.firstname = firstname
        self.lastname = lastname
        self.studentNo = studentNo
        self.email = email

        self.registrations = []
        self.availability = {}
        self.days_hours = {}
        self.best_pairs = {}

    def set_registrations(self, list_of_registrations):
        for reg in list_of_registrations:
            if reg.studentId == self.id:
                self.registrations.append(reg)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"

    def __repr__(self):
        return f"{self.firstname} {self.lastname}"

    def __contains__(self, item):
        if self.id == item.id:
            return True
        return False

    def total_available_hours(self):
        res = 0
        for v in self.days_hours.values():
            res += len(v)

        return res


class Registration:
    def __init__(self, id, createdAt, updatedAt, courseId, studentId):
        self.id = id
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.courseId = courseId
        self.studentId = studentId

        self.working_times = []

    def __str__(self):
        return f"{self.id} {self.courseId} {self.studentId}"

    def set_working_times(self, list_of_working_times):
        for working_time in list_of_working_times:
            if working_time.registrationId == self.id:
                self.working_times.append(working_time)


class WorkingTimes:
    def __init__(self, id, startTime, endTime, registrationId, questionId, tentative):
        self.id = id
        self.startTime = startTime
        self.endTime = endTime
        self.registrationId = registrationId
        self.questionId = questionId
        self.tentative = tentative

    def __str__(self):
        return f"{self.startTime} {self.endTime}"


class Course:
    def __init__(self, id, title, deadline, code, description, maxGroupSize, minGroupSize, createdAt, updatedAt,
                 deleted, published, groupsPublished):
        self.id = id
        self.title = title
        self.deadline = deadline
        self.code = code
        self.description = description
        self.maxGroupSize = maxGroupSize
        self.minGroupSize = minGroupSize
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.deleted = deleted
        self.published = published
        self.groupsPublished = groupsPublished

        self.registrations = []
        self.users = []

    def set_registrations(self, list_of_registrations):
        for reg in list_of_registrations:
            if reg.courseId == self.id:
                self.registrations.append(reg)

    def set_users_taking_part(self, list_of_users):
        for reg in self.registrations:
            for user in list_of_users:
                if reg.studentId == user.id and reg.courseId == self.id:
                    self.users.append(user)


def fetch_all(query):
    select_query = query
    cursor.execute(select_query)

    columns = [x[0] for x in cursor.description]
    res = cursor.fetchall()
    #print(columns)
    return res


#
# def print_five(list):
#     for item in list[:5]:
#         print(item)


"select * from postgres.public.user"
user_objs = [User(x[0], x[1], x[2], x[3], x[4], x[5], x[6]) for x in fetch_all("select * from postgres.public.user")]

# print_five(user_objs)

registration_objs = [Registration(x[0], x[1], x[2], x[3], x[4]) for x in
                     fetch_all("select * from postgres.public.registration")]

# print_five(registration_objs)

course_objs = [Course(x[0], x[1], x[2], x[3], x[4], x[5], x[6], x[7], x[8], x[9], x[10], x[11]) for x in
               fetch_all("select * from postgres.public.course")]

# print_five(course_objs)

working_times_objs = [WorkingTimes(x[0], x[1], x[2], x[3], x[4], x[5]) for x in
                      fetch_all("select * from postgres.public.\"workingTimes\"")]

query = "select * from postgres.public.\"workingTimes\""


# print_five(working_times_objs)
#
# print(working_times_objs[0].startTime, working_times_objs[0].endTime, type(working_times_objs[0].startTime))


class Assembleri:
    def __init__(self, users, courses, workingtimes, registrations):
        self.users = users
        self.courses = courses
        self.workingtimes = workingtimes
        self.registrations = registrations

        self.fill_deps()
        # self.print_people_taking_part_in_course()
        self.algo()

    def fill_deps(self):
        for course in self.courses:
            course.set_registrations(self.registrations)
            for registration in course.registrations:
                registration.set_working_times(self.workingtimes)

        for course in self.courses:
            course.set_users_taking_part(self.users)

        for user in self.users:
            user.set_registrations(self.registrations)

    def print_people_taking_part_in_course(self):
        for course in self.courses:

            print(f"\n {course.title} \n")
            for reg in course.registrations:
                if reg.courseId == course.id:
                    for user in self.users:
                        if user.id == reg.studentId:
                            # print('hep')
                            print(user)

    def get_course_by_id(self, id):
        for course in self.courses:
            if course.id == id:
                return course

    def generate_working_times(self, users):
        for user in users:
            for reg in user.registrations:
                for working_time in reg.working_times:
                    if working_time.startTime.day not in user.availability:
                        user.availability[working_time.startTime.day] = [
                            (working_time.startTime.hour, working_time.endTime.hour)]
                    else:
                        user.availability[working_time.startTime.day].append(
                            (working_time.startTime.hour, working_time.endTime.hour))

        for user in users:
            # print(user.availability)
            for k, v in user.availability.items():
                ## Make day hour list
                for tupla in v:
                    if k not in user.days_hours:
                        user.days_hours[k] = []
                        start, end = tupla
                        for x in range(start, end):
                            user.days_hours[k].append(x)
                    else:
                        start, end = tupla
                        for x in range(start, end):
                            user.days_hours[k].append(x)

    def generate_best_matches(self, users):
        for user in users:
            overlap = 0
            for other_user in users:
                if user == other_user:
                    continue
                overlap = 0
                    ## Calc overlap
                for day, hours in user.days_hours.items():
                    comparing_to_hours = other_user.days_hours.get(day)
                    # print(comparing_to_hours)
                    # print(hours)
                    if comparing_to_hours:
                        hour_overlap = len(set(hours).intersection(set(comparing_to_hours)))
                        # if day == 10 or day == 11:
                        #     hour_overlap /= 2
                        overlap += hour_overlap
                user.best_pairs[other_user] = overlap


    def generate_groups(self, users, groupsize):


        amount_of_groups = int(len(users) / groupsize)
        amount_of_ungrouped_people = len(users) - amount_of_groups * groupsize
        print(amount_of_ungrouped_people)
        groups = []
        handled_users = []
        for _ in range(500):
            for user in sorted(users, key=lambda item: item.total_available_hours())[3:]:
                if user in handled_users:
                    continue
                group = [user]
                handled_users.append(user)
                for k, v in sorted(user.best_pairs.items(), key=lambda item: item[1], reverse=True):
                    if k in handled_users:
                        continue
                    group.append(k)
                    handled_users.append(k)
                    if len(group) == groupsize:
                        groups.append(group)
                        break
                if len(group) == groupsize:
                    break

        return groups

    def amount_of_common_hours_per_group(self, people_in_group):
        #for user in people_in_group:
            #print(user.days_hours)
        common_hours = {}
        mapper = {5: "Monday", 6: "Tuesday", 7:"Wednesday", 8:"Thursday", 9:"Friday", 10: "Saturday", 11: "Sunday"}
        for x in range(5, 12):
            hours = []
            if all([x in user.days_hours for user in people_in_group]):
                for user in people_in_group:
                    #if x in user.days_hours:
                    hours.append(user.days_hours[x])
                #print(hours)
                intersection = [x for x in range(8, 22) if all([x in sublist for sublist in hours])]
                #print(intersection)
                common_hours[mapper[x]] = intersection

        return common_hours


    def algo(self):
        course = self.get_course_by_id("283df2a6-51e7-434f-a4b6-08514579a9ea")
        self.generate_working_times(course.users)
        self.generate_best_matches(course.users)
        groups = self.generate_groups(course.users, 4)

        flat_list = [person for group in groups for person in group]
        not_grouped = [person for person in course.users if person not in flat_list]
        print("Ungrouped people")
        print(not_grouped)


        unique_names = [f"{x.firstname}{x.lastname}" for x in flat_list]

        if len(unique_names) == len(set(unique_names)):
            print("No duplicates")

        for group in groups:
            res = self.amount_of_common_hours_per_group(group)
            print(group)
            for k, v in res.items():
                print(k, v)



a = Assembleri(user_objs, course_objs, working_times_objs, registration_objs)

cursor.close()
connection.close()
