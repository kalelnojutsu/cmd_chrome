(function () {
  var reg = /(.*)(mail|inbox)\.google\.com(.*)/;
  var results = reg.exec(window.location.host);
  if(results == null || results.length == 0) {
    return;
  }

  var Ajaxer = {
    get: function(url, data, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if(xhr.readyState !== 3) {
          callback(xhr);
        }
      };

      xhr.open('GET', url, true);
      xhr.send();
    }
  };

  InboxSDK.loadScript("https://raw.githubusercontent.com/kalelnojutsu/cmd_chrome/master/gmail_crx.js");

  Ajaxer.get(chrome.extension.getURL('content.html'), null, function(data) {
    if(data.readyState != 4) {
      // don't do anything until the response is ready
      return;
    }
    e = document.createElement('div');
    e.setAttribute('id', 'cmd-popup-layout');
    e.style.cssText = 'display: none';
    e.innerHTML = data.responseText;
    document.body.appendChild(e);
  });
}());
