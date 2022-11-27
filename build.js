const { writeFile, readFileSync } = require("fs");
const yaml = require("js-yaml");

// Color definition
const themeColors = yaml.load(readFileSync("themes/palette.yml", "utf-8"));

// Chevalier has the syntax tokens applicable across multiple languages
let base = yaml.load(readFileSync("themes/chevalier.yml", "utf-8"));

// Additional theme definitions to combine with base syntax token styles
const workbench = yaml.load(readFileSync("themes/workbench.yml", "utf-8"));
const markdown = yaml.load(readFileSync("themes/markdown.yml", "utf-8"));

// Merge workbench styles
Object.assign(base, workbench);

// Merge additional syntax token styles
base.tokenColors = base.tokenColors.concat(
  markdown,
);

// Stringify all of the combined theme styles so we can run string regexes on it to
// replace color variables with color values
base = JSON.stringify(base, null, 2);

for (let color in themeColors) {
  base = base.replace(new RegExp(color + '"', "g"), themeColors[color] + '"');
}

// Base file has been extended with additional theme styles and color variables have
// been replaced with Panda theme values. Write to /dist for consumption.
writeFile("build/Chevalier.json", base, err => {
  if (err) {
    console.warn(err);
  }
  console.log("Build finished");
});
