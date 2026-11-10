module.exports = {
  layout: "blog-post.njk",
  tags: "post",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/blog/${data.page.fileSlug}/`),
  },
};
