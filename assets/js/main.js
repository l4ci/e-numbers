$(function() {
  $('html').removeClass('no-js');

  $('.focusMe').focus();

  // HIDE the more text
  function rehide(){
    $('.more').hide();
  }
  // Make h3 show the more text on click
  $('body').on('click','h3',function(){
    $(this).next('.more').toggle();
  });


  // On focus,click, keydown reset the body/input
  function resetBody(){
    $('.result').html('');
  }
  function resetInput(){
    $('.focusMe').val('');
  }
  $('.focusMe').on('click',function(){
    resetBody();
    resetInput();
  }).on('keydown',function(){
    resetBody();
  });


  var allData,
      loaded = false;
  // Get Data from spreadsheet
  Tabletop.init( { key: '1m3X5Urii-NTiYu6S6RYnXOF63Tkgvd813-H1jnxb-hY',
                  callback: function(data) { 
                    allData = data;
                    loaded = true;
                    success(allData);
                  },
                  simpleSheet: true } );


  function success(data){
    //console.table(data);

    // Pipe to autocomplete function
    var searchWrap = $('.box');
    $('#input').autocomplete({
      preventBadQueries: true,
      autoSelectFirst: true,
      lookupLimit: 3,
      appendTo: searchWrap,
      orientation: top,
      lookup: data,
      onSelect: function (suggestion) {
        updateResult(suggestion);
      }
    });
  }


  // Update on Result
  function updateResult(want){
    
    var html = "<h1 class='num'>E "+want.data+"</h1><h2 class='titel'>"+want.titel+"</h2><p class='desc'>"+want.desc+"</p>";
    
    if (want.details !== ""){
      html = html + "<h3 class='heading'>Details</h3><div class='more'><p>"+want.details+"</p></div>";
    }
    if (want.notes !== ""){
      html = html + "<h3 class='heading'>Hinweise</h3><div class='more'><p>"+want.notes+"</p></div>";
    }
    
    // Show result
    $('.result').html(html);

    // set hash
    window.location.hash = want.data;
    // Hide all the new .more
    rehide();
  }

  // @todo: Get hash and show result 
  function setManualResult(id){
    if (loaded){
      //console.table(allData);
      //updateResult(allData.id);
    }
  }
  
  var hash = window.location.hash;
  if (hash !== ""){
    setManualResult(hash);
  }

});