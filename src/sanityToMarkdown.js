const fs = require("fs");
const path = require("path");
const sanityClient = require("@sanity/client");
const groq = require("groq");
const PortableText = require("@sanity/block-content-to-markdown");
const config = require("./config");
const serializers = require("./serializers");
const client = sanityClient(config);

async function getDocs() {
  const filter = groq`*[_type == "post" && defined(slug) && defined(publishedAt)]`;
  const projection = groq`{
    ...,
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "type": @->_type,
          "slug": @->slug.current,
        },
      }
    }
  }`;
  const query = [filter, projection].join(" ");
  const docs = await client.fetch(query).catch(err => console.error(err));

  console.log(docs)

  docs.forEach(post => {
    const { title, excerpt, body, slug, publishedAt } = post;
    const [date, time] = new Date(publishedAt).toISOString().split("T");
    const content = `
---
layout: post
title: "${title}"
date: ${date} ${time}
description: "${excerpt}"
---

${PortableText(body, { serializers, ...config })}
`;
    const filename = path.join(
      __dirname,
      `../posts/${date}-${slug.current}.md`
    );

    fs.writeFile(filename, content, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!", filename);
    });
  });
}
getDocs();
