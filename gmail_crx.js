

(function () {

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

  var appendStylesheet = function(url) {
    var sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.type = 'text/css';
    sheet.href = url;
    document.head.appendChild(sheet);
  };

  InboxSDK.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js');
 

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

  cmd = {
    showLoadingView : function() {
      $("#loading-view").show(), $("#login-view").hide();
    },
    showDocList : function(sdk){
      if($( "#docs" ).text() == ''){
        chrome.runtime.sendMessage({
            method: 'POST',
            action: 'xhttp',
            url: 'http://test.close-more.deals/connect'
        }, function(responseText) {
            $("#loading-view").hide();
            var response = JSON.parse(responseText);
            var uid = response['user'][0]['uid'];
            $("#doc-list").css("max-height","200px").css("overflow-y","scroll").show();
            $( "#user" ).append( "<p>"+response['user'][0]['mail']+"</p>" ).show();
            $.each(response['documents'], function( index, doc ) {
              $( "#docs" ).append( "<div><a sel=\"no\" href=\"#\" class=\"doc\" nid=\""+doc['nid']+"\">"+ doc['title'] +"<a></div>" );
            });
            $( ".doc" ).on( "click", function() {
              $("#doc-list").css("max-height","32px").css("overflow-y","hidden");
              $( "#insert" ).attr('nid',$(this).attr('nid')).show();
              var cover_link = "http://app.close-more.deals/cover/120/140/o/c/"+$(this).attr('nid')+".gif";
              $("#cover").append("<img id=\"vignette\" src=\""+cover_link+"\">").show();
              $('.doc').hide();
              $(this).attr('sel','yes').show();
            });
            $( "#insert" ).on( "click", function() {
              //event.composeView.insertTextIntoBodyAtCursor('http://l.booklet.io');
              var thumbUrl = "https://d2qvtfnm75xrxf.cloudfront.net/public/extension/adobePdfIcon.png";
              var a = $('a[sel=yes]');
              var t = $('a[sel=yes]').text();
              var fullUrl = 'http://l.booklet.io/zh5/'+a.attr('nid')+'?to=';
              sdk.composeView.insertLinkChipIntoBodyAtCursor(t, fullUrl, thumbUrl);
            });

            //alert(responseText);
            /*Callback function to deal with the response*/
        });
      }
      else{ 
        $("#loading-view").hide();
        $("#cover").empty();
        $("#doc-list").css("max-height","200px").css("overflow-y","scroll").show();
        $(".doc" ).each(function( index ) {
          $(this).show();
          $(this).attr('sel', 'no');
        });

      } // endif
    }
  }

  InboxSDK.load(1, 'sdk_cmdgmailcrx_09bb9d5929').then(function(sdk){
    var dropdownContent = $("#cmd-popup-layout");
    dropdownContent.css("width", "275px"), dropdownContent.css("max-width", "275px"), dropdownContent.css("padding","10px 5px 25px 5px");
    // the SDK has been loaded, now do something with it!
    cmd.inboxSDK = sdk, cmd.inboxSDK.Compose.registerComposeViewHandler(function(sdk){

      // a compose view has come into existence, do something with it!
      sdk.addButton({
        title: "Send a document with CMD",
        iconUrl: 'http://www.zyyne.com/mourad/icon.png',
        hasDropdown: !0,
        onClick: function(event) {
          //var t = event.composeView.getToRecipients();
          //event.composeView.insertTextIntoBodyAtCursor(t[0].emailAddress);
          cmd.inboxSDK.composeView = sdk;
          var n = $(event.dropdown.el);
          dropdownContent.show(), n.append(dropdownContent);
          cmd.showLoadingView();
          cmd.showDocList(event);

        }
      }),
      sdk.on("presending", function() {
        //composeView.insertTextIntoBodyAtCursor('Wazaaa');
        var re = /http:\/\/l\.booklet\.io\/zh5\/\d+\?to=(.+)/;
        var t = sdk.getToRecipients();
        var b = $(sdk.getBodyElement());
        var a = b.find('a');
        a.each(function( index ) {
          if(!re.test($(this).attr('href')) && t.length==1){
            var newurl = $(this).attr('href') + t[0].emailAddress;
            $(this).attr('href', newurl);
          }
        });
        
      })
    });
  });

}());





