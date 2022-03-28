const mocks = [
  {
    uid: '1',
    givenname: 'Firstname 1 (Student)',
    sn: 'Lastname 1',
    hypersonstudentid: '000000001',
    mail: 'user-1@email.com',
    role: 1,
  },
  {
    uid: '2',
    givenname: 'Firstname 2 (Staff)',
    sn: 'Lastname 2',
    hypersonstudentid: '000000002',
    mail: 'user-2@email.com',
    role: 2,
  },
  {
    uid: '3',
    givenname: 'Firstname 3 (Admin)',
    sn: 'Lastname 3',
    hypersonstudentid: '000000003',
    mail: 'user-3@email.com',
    role: 3,
  },
];

/*
const demoMocks = [
  {
    uid: '7',
    givenname: 'Oili',
    sn: 'Rajala',
    hypersonstudentid: '123458871',
    mail: 'oirajal@hy.fi',
    role: 1,
  },
  {
    uid: '8',
    givenname: 'Vilho',
    sn: 'Tontteri',
    hypersonstudentid: '123452002',
    mail: 'vitontt@hy.fi',
    role: 2,
  },
  {
    uid: '9',
    givenname: 'Mirka',
    sn: 'Muristo',
    hypersonstudentid: '123450003',
    mail: 'mimuris@hy.fi',
    role: 3,
  },
  {
    uid: '10',
    givenname: 'Olli',
    sn: 'Keinänen',
    hypersonstudentid: '123454217',
    mail: 'olkeina@hy.fi',
    role: 1,
  },
  {
    uid: '15',
    givenname: 'Karoliina',
    sn: 'Andersson',
    hypersonstudentid: '123459960',
    mail: 'kaander@hy.fi',
    role: 1,
  },
  {
    uid: '16',
    givenname: 'John',
    sn: 'Smith',
    hypersonstudentid: '123450017',
    mail: 'josmith@hy.fi',
    role: 1,
  },
  {
    uid: '17',
    givenname: 'Ruslan',
    sn: 'Titov',
    hypersonstudentid: '123455470',
    mail: 'rutitov@hy.fi',
    role: 1,
  },
  {
    uid: '18',
    givenname: 'Maria',
    sn: 'Virtanen',
    hypersonstudentid: '123453301',
    mail: 'mavirta@hy.fi',
    role: 1,
  },
  {
    uid: '19',
    givenname: 'Linda',
    sn: 'Nikoskelainen',
    hypersonstudentid: '123454852',
    mail: 'linikos@hy.fi',
    role: 1,
  },
  {
    uid: '20',
    givenname: 'Janina',
    sn: 'Skog',
    hypersonstudentid: '123457797',
    mail: 'jaskog@hy.fi',
    role: 1,
  },
  {
    uid: '21',
    givenname: 'Mo',
    sn: 'Salah',
    hypersonstudentid: '123459999',
    mail: 'mosalah@hy.fi',
    role: 1,
  },
  {
    uid: '22',
    givenname: 'Sam',
    sn: 'Sung',
    hypersonstudentid: '123450114',
    mail: 'sasung@hy.fi',
    role: 1,
  },
  {
    uid: '23',
    givenname: 'Topias',
    sn: 'Kuhta',
    hypersonstudentid: '123456650',
    mail: 'tokuhta@hy.fi',
    role: 1,
  },
  {
    uid: '24',
    givenname: 'Jaana',
    sn: 'Laitela',
    hypersonstudentid: '123452251',
    mail: 'jalaite@hy.fi',
    role: 1,
  },
  {
    uid: '25',
    givenname: 'Vilhelmiina',
    sn: 'Lind',
    hypersonstudentid: '123451504',
    mail: 'vilind@hy.fi',
    role: 1,
  },
  {
    uid: '26',
    givenname: 'Olli',
    sn: 'Happonen',
    hypersonstudentid: '123450021',
    mail: 'olhappo@hy.fi',
    role: 1,
  },
  {
    uid: '27',
    givenname: 'Iiro',
    sn: 'Kapanen',
    hypersonstudentid: '123459470',
    mail: 'iikapan@hy.fi',
    role: 1,
  },
  {
    uid: '28',
    givenname: 'Bruce',
    sn: 'Wayne-Lee',
    hypersonstudentid: '123451470',
    mail: 'brwayne@hy.fi',
    role: 1,
  },
  {
    uid: '29',
    givenname: 'Francesco',
    sn: 'Antonucci',
    hypersonstudentid: '123453310',
    mail: 'franton@hy.fi',
    role: 1,
  },
  {
    uid: '30',
    givenname: 'Svetlana',
    sn: 'Fedorova',
    hypersonstudentid: '123452201',
    mail: 'svfedor@hy.fi',
    role: 1,
  },
  {
    uid: '31',
    givenname: 'Jan',
    sn: 'Johansson',
    hypersonstudentid: '123454444',
    mail: 'jajohan@hy.fi',
    role: 1,
  },
  {
    uid: '11',
    givenname: 'Minna',
    sn: 'Laaksonen',
    hypersonstudentid: '123457781',
    mail: 'milaaks@hy.fi',
    role: 2,
  },
];
*/

export const getMockHeaders = () => mocks[localStorage.getItem('mockHeaderIndex') || 0];

// export const getMockHeaders = () => demoMocks[localStorage.getItem('mockHeaderIndex') || 0];

export const setMockHeaders = index => localStorage.setItem('mockHeaderIndex', index);
