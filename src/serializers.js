const BlocksToMarkdown = require("@sanity/block-content-to-markdown");
const { getImageUrl } = BlocksToMarkdown;
const config = require("./config");
const getYTid = require("get-youtube-id");

const serializers = {
  types: {
    image: ({ node }) =>
      `![${node.alt || ""}](${getImageUrl({ options: config, node })})`,
    // From @sanity/code-input
    code: ({ node }) => `\`\`\`${node.language || ""}\n${node.code}\n\`\`\``,
    // From the YouTube tutorial: https://youtu.be/kLsER_zHiS4
    youtube: ({ node }) =>
      `<iframe width="560" height="315" src="https://www.youtube.com/embed/${getYTid(
        node.url
      )}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  },
  marks: {
    internalLink: ({ mark, children }) => {
      const { slug = {} } = mark;
      const href = `/${slug.current}`;
      return `[${children}](${href})`;
    },
    link: ({ mark, children }) => {
      // Read https://css-tricks.com/use-target_blank/
      const { blank, href } = mark;
      return blank
        ? `<a href=${href} target="_blank" rel="noopener">${children}</a>`
        : `[${children}](${href})`;
    }
  }
};

module.exports = serializers;
