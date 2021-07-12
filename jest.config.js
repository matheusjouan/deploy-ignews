module.exports = {
  testPathIgnorePatterns: ['/node_modules', '/.next'],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts"
  ],
  // Converter o código utilizando o Babel p/ o JEST entenda
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  // Mapeia os arquivos scss/css/sass => Para ser entendivel pelo JEST
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy",
  },
  // Indica o ambiente que está executando o teste
  testEnvironment: 'jsdom',
  // Ativa o Covarage
  collectCovarage: true,
  // Quais arquivos será coletado pelo Covarage
  collectCoverageFrom: [
    "src/**/*.{tsx}",
    "!src/**/*.spec.tsx"
  ],
  coverageReporters: ["lcov", "json"]
};