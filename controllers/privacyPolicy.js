const path = require('path')

const getPrivacyPolicy = (req, res) => {
  res.sendFile(path.resolve(__dirname,'../html/index.html'));
};

module.exports = {
  getPrivacyPolicy: getPrivacyPolicy,
};