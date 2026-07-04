const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addCollection("posts", function (col) {
    return col.getFilteredByGlob("src/blog/*.md").reverse();
  });
  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });
  eleventyConfig.addFilter("htmlDateString", function (date) {
    return new Date(date).toISOString().split("T")[0];
  });
  eleventyConfig.addFilter("readableDate", function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
  return {
    dir: { input: "src", output: "_site" },
  };
};
