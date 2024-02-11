const forms = require("@tailwindcss/forms")({
  strategy: "class",
});
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
  },
  plugins: [forms],
};
