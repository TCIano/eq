const purgecss = require('@fullhuman/postcss-purgecss')

// const join = require("path").join;

// const tailwindJS = join(__dirname, "tailwind.js");

class TailwindExtractor {
   static extract(content) {
      return content.match(/[A-Za-z0-9-_:\/]+/g) || []
   }
}

const plugins = [require('tailwindcss'), require('autoprefixer')]
// if (process.env.NODE_ENV === "production") {
//     plugins.push(
//         purgecss({
//             content: [
//                 "./layout/**/*.vue",
//                 "./components/**/*.vue",
//                 "./view/**/*.vue"
//             ],
//             whitelist: ["html", "body"],
//             // whitelistPatternsChildren: [/^token/, /^pre/, /^code/],
//             extractors: [
//                 {
//                     extractor: TailwindExtractor,
//                     extensions: ["html", "vue"]
//                 }
//             ]
//         })
//     );
// }

module.exports = {
   plugins,
}
