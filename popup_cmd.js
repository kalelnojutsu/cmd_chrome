

(function(window) {
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
  window.Ajaxer = Ajaxer;
})(window);





document.addEventListener('DOMContentLoaded', function() {
  Ajaxer.get('http://test.close-more.deals/connect', null, function(data) {
    if(data.readyState != 4) {
      return;
    }
    var response = JSON.parse(data.responseText);
    if(response['user'][0]['uid'] == 0){
      $( '#login' ).show();
    }
    else{
      var uid = response['user'][0]['uid'];
      $( "#user" ).append( "<p>"+response['user'][0]['mail']+"</p>" );
      $.each(response['documents'], function( index, doc ) {
        $( "#docs" ).append( "<div><a href=\"#\" class=\"doc\" nid=\""+doc['nid']+"\">"+ doc['title'] +"<a></div>" );
      });

      $(document).ready(function(){
        $( ".doc" ).on( "click", function() {
          $( '#email' ).show();
          $( "#generate" ).attr('nid',$(this).attr('nid'));
          $('.doc').hide();
          $(this).show();
        });

        $( "#generate" ).on( "click", function() {
            Ajaxer.get('http://test.close-more.deals/generate_link_sub.php?email='+$('#emailto').val()+'&uid='+response['user'][0]['uid']+'&nid='+$( "#generate" ).attr('nid'), null, function(data) {
              if(data.readyState != 4) {
                // don't do anything until the response is ready
                return;
              }
              var response_link = JSON.parse(data.responseText);
              $("#link_generated").val(response_link['url']);
              $( '#generated' ).show();
            });
        });
      });
    }//endif
  });
});

