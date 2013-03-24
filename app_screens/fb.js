      (function() {
        var n = 1;
        window.fbAsyncInit = function() {
          if (--n === 0) {
            a.init('FB_APP_ID');
          }
        };
      }());

      (function(d) {
        var ref = d.getElementsByTagName('script')[0];
        var fJs = d.createElement('script');
        fJs.id = 'facebook-jssdk'; 
        fJs.async = true;
        fJs.src = '//connect.facebook.net/en_US/all.js';
        ref.parentNode.insertBefore(fJs, ref);
      }(document));
      
