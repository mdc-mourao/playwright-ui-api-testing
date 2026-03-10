export const apiFactory = {
  generateUserData: () => {
    const names = [
      'John Doe',
      'Jane Smith',
      'Carlos Silva',
      'Diana Costa',
      'André Santos',
      'Fernanda Costa',
      'Maria Oliveira',
      'Pedro Almeida',
      'Ana Pereira',
      'João Ferreira',
      'Sofia Rodrigues',
      'Miguel Carvalho'
    ];
    const jobs = [
      'QA Engineer',
      'Fullstack Dev',
      'Product Owner',
      'Scrum Master',
      'DevOps Engineer',
      'UX Designer',
      'Backend Developer',
      'Frontend Developer',
      'Data Analyst'
    ];

    return {
      name: names[Math.floor(Math.random() * names.length)],
      job: jobs[Math.floor(Math.random() * jobs.length)]
    };
  },

  getRandomPage: () => {
    const pages = [1, 2];
    return pages[Math.floor(Math.random() * pages.length)];
  },

  getRandomEmailAndPassword: () => {
    const emails = [
      'michael.lawson@reqres.in',
      'lindsay.ferguson@reqres.in',
      'tobias.funke@reqres.in',
      'byron.fields@reqres.in',
      'george.edwards@reqres.in',
      'rachel.howell@reqres.in'
    ];
    const passwords = [
      'password123',
      '12345678',
      'qwertyuiop',
      'letmein123',
      'admin2024',
      'welcome1'
    ];

    return {
      email: emails[Math.floor(Math.random() * emails.length)],
      password: passwords[Math.floor(Math.random() * passwords.length)]
    };
  },

  getRandomName() {
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();

    return {
      firstName: `FN_${randomStr}`,
      lastName: `LN_${randomStr}`,
      id: `ID${Date.now().toString().slice(-4)}`
    };
  }
};
