const request = require('request');

function urlExistsDeep(url, header, method, timeout) {
  return new Promise((resolve) => {
    request({
      url,
      method: method || 'HEAD',
      headers: header || {},
      followRedirect: false,
      timeout: timeout || 5000,
    }, (err, res) => {
      if (!res || err) {
        resolve(false);
        return;
      }

      let checkUrl;
      if (/5\d\d/.test(res.statusCode) ||
          /4\d\d/.test(res.statusCode) && res.statusCode !== 403) {
        resolve(false);
        return;
      }

      if (res.statusCode === 403) {
        checkUrl = res.request.uri.href;
        header = { 'Accept': 'text/html', 'User-Agent': 'Mozilla/5.0' };
        method = 'GET';
      } else if (res.statusCode === 301) {
        checkUrl = res.headers.location;
      }

      if (checkUrl) {
        urlExistsDeep(checkUrl, header, method)
          .then(resolve);
      } else resolve(res.request.uri);
    });
  });
}

module.exports = urlExistsDeep;
