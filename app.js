// app.js
$(function(){
  /* YÊU CẦU 3 & 4: NAV + FOOTER sync (hover & click) */
  function setNavActive(i){
    $('#main-nav .nav-item, #site-footer .nav-item').removeClass('active');
    $('#main-nav .nav-item[data-i="'+i+'"], #site-footer .nav-item[data-i="'+i+'"]').addClass('active');
  }
  $('#main-nav .nav-item, #site-footer .nav-item').on('mouseenter click', function(){
    var i = $(this).data('i');
    setNavActive(i);
  });
  /* --- Hết Yêu cầu 3 & 4 --- */

  /* YÊU CẦU 8: NEWS collapse toggle (Đóng/mở) */
  var $newsList = $('#news-list');
  $newsList.on('click', '.news-toggle', function(e){
    var item = $(this).closest('.news-item');
    item.toggleClass('collapsed');
    $(this).text(item.hasClass('collapsed') ? '▶' : '↓');
  });
  /* --- Hết Yêu cầu 8 --- */
  
  /* YÊU CẦU 9: NEWS reorder (Thay đổi thứ tự) */
  (function(){
    var dragging = null;
    var placeholder = $('<div class="news-placeholder"></div>');
    $newsList.on('mousedown', '.news-drag', function(e){
      e.preventDefault();
      e.stopPropagation();
      var $item = $(this).closest('.news-item');
      dragging = { $item: $item };
      dragging.$clone = $item.clone().addClass('dragging-clone').css({
        width: $item.outerWidth(),
        left: $item.offset().left,
        top: e.pageY - 8
      }).appendTo('body');
      placeholder.insertAfter($item);
      $item.hide();
      $(document).on('mousemove.news', function(ev){
        dragging.$clone.css({ top: ev.pageY - 8 });
        var placed = false;
        $newsList.children('.news-item').not($item).each(function(){
          var $n = $(this);
          var mid = $n.offset().top + $n.outerHeight()/2;
          if(ev.pageY < mid){
            placeholder.insertBefore($n);
            placed = true; return false;
          }
        });
        if(!placed) $newsList.append(placeholder);
      });
      $(document).on('mouseup.news', function(ev){
        $(document).off('.news');
        dragging.$clone.remove();
        placeholder.replaceWith(dragging.$item);
        dragging.$item.show();
        dragging = null;
      });
    });
  })();
  /* --- Hết Yêu cầu 9 --- */

  
  