/**
 * Mock users to be used in local development and testing.
 * Each user has to data objects: One in the shape of the database User entity,
 * and another in the shape of the Shibboleth headers. Use accordingly.
 */

const users = [
  {
    database: {
      shibbolethUid: "1",
      firstname: "Firstname 1",
      lastname: "Lastname 1",
      studentNo: "000000001",
      email: "user-1@email.com",
      role: 1,
    },
    headers: {
      uid: "1",
      givenname: "Firstname 1",
      sn: "Lastname 1",
      schacpersonaluniquecode: "urn:schac:personalUniqueCode:int:studentID:helsinki.fi:000000001",
      mail: "user-1@email.com",
    },
  },
  {
    database: {
      shibbolethUid: "2",
      firstname: "Firstname 2",
      lastname: "Lastname 2",
      studentNo: "000000002",
      email: "user-2@email.com",
      role: 2,
    },
    headers: {
      uid: "2",
      givenname: "Firstname 2",
      sn: "Lastname 2",
      schacpersonaluniquecode: "urn:schac:personalUniqueCode:int:studentID:helsinki.fi:000000002",
      mail: "user-2@email.com",
    },
  },
  {
    database: {
      shibbolethUid: "3",
      firstname: "Firstname 3",
      lastname: "Lastname 3",
      studentNo: "000000003",
      email: "user-3@email.com",
      role: 3,
    },
    headers: {
      uid: "3",
      givenname: "Firstname 3",
      sn: "Lastname 3",
      schacpersonaluniquecode: "urn:schac:personalUniqueCode:int:studentID:helsinki.fi:000000003",
      mail: "user-3@email.com",
    },
  },
];

export const database = users.map(user => user.database);
export const headers = users.map(user => user.headers);
