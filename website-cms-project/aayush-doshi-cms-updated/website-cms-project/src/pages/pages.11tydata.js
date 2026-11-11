module.exports = {
  layout: "page.njk",
  eleventyComputed: {
    permalink: (data) => {
      if (data.draft) return false;
      const slug = String(data.slug || data.page.fileSlug || "new-page")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return `/${slug || "new-page"}.html`;
    }
  }
};
