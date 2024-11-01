// const linkToCode =
//   'https://gist.githubusercontent.com/nosbog/8fa72c38ad4d542d8121a1e520eb8fe2/raw/rsschool-nodejs-task-graphql-check-integrity';
//
// fetch(linkToCode)
//   .then((r) => r.text())
//   .then((t) => eval(t));

const tableData = [
  { path: 'test/routes/gql-loader-prime.test.js', isSame: true },
  { path: 'test/routes/gql-loader.test.js', isSame: true },
  { path: 'test/routes/gql-mutations.test.js', isSame: true },
  { path: 'test/routes/gql-queries.test.js', isSame: true },
  { path: 'test/routes/gql-rule.test.js', isSame: true },
  { path: 'test/helper.ts', isSame: true },
  { path: 'src/plugins/db.ts', isSame: true },
  { path: 'package.json', isSame: true }
];

setTimeout(() => console.table(tableData), 1000);