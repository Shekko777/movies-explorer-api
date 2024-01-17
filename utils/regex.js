const mailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
const linkRegex = /^https?:\/\/(www\.)?.+#?/;

module.exports = {
  mailRegex,
  linkRegex,
};
