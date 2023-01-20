require("./sanityToMarkdown");
const fs = require("fs");
const express = require("express");
const path = require("path");
//create a server object:
const app = express();
const port = 8080; // Codesandbox.io uses 8080
const filesPath = path.join(__dirname, "../posts");

// delete posts on server start
fs.readdir(filesPath, (err, files) => {
  if (err) throw err;
  const posts = files.filter(file => file.match(/\.md$/));
  for (const post of posts) {
    fs.unlink(path.join(filesPath, post), err => {
      if (err) throw err;
    });
  }
});

app.get("/", (req, res) => {
  // make the file list
  fs.readdir(filesPath, (err, files) => {
    res.send(
      "<html><body><p>Convert the blog template from <a href='https://www.sanity.io/create?template=sanity-io%2Fsanity-template-gatsby-blog'>sanity.io/create</a> to SSG ready markdown files.</p>" +
        "<pre>posts/" +
        files
          .filter(file => /(.*)\.md$/.test(file)) // only list .md files
          .map(file => {
            return `<br />  <a href="/posts/${file}">${file}</a>`;
          })
          .join("") +
        "</pre>"
    );
    res.end(); //end the response
  });
});

app.get("/posts/:post", (req, res) => {
  res.sendFile(path.join(__dirname, "../posts", req.params.post));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
