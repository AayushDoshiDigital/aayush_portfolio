module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addFilter("faqsToQ", (a) => (a || []).map((f) => [f.question, f.answer]));
  eleventyConfig.addFilter("dateFormat", (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }));
  eleventyConfig.addFilter("head", (a, n) => (a || []).slice(0, n));
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/blog/*.md").filter((p) => !p.data.draft).sort((a, b) => b.date - a.date));
  return { dir: { input: "src", output: "_site", includes: "_includes", data: "_data" }, markdownTemplateEngine: false, htmlTemplateEngine: "njk" };
};
