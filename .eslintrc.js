module.exports = {
  parser: "babel-eslint",
  extends: ["standard", "standard-react"],
  env: {
    browser: true,
    es6: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "quotes": "off",
    "dot-notation": "off",
    "react/jsx-indent": "warn",
    "react/prop-types": "off"
  }
}