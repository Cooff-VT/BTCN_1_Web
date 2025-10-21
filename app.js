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

  /* YÊU CẦU 10: Logic Popover */
  $('#btnSettings').on('click', function(e) {
    e.stopPropagation();
    $('#settingsPopover').toggle();
  });
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.settings-container').length && !$(e.target).is('#btnSettings')) {
        $('#settingsPopover').hide();
    }
  });

   /* YÊU CẦU 10: Hàm áp dụng Style (cho cả SampleText & Highlight) */
  function applyHighlightStyles(){
    var textColor = $('#textColor').val();
    var bgColor = $('#bgColor').val();
    var isBold = $('#cbBold').is(':checked');
    var isItalic = $('#cbItalic').is(':checked');
    var isUnderline = $('#cbUnderline').is(':checked');

    var styles = {
      color: textColor,
      background: bgColor,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none'
    };
    
    // Áp dụng style cho text đã highlight (Yêu cầu 11)
    $orig.find('.highlighted').css(styles);
    // Áp dụng style cho nút SampleText (Yêu cầu 10)
    $('#btnSample').css(styles);
  }

  function applyHighlight(pattern, isRegex){
    var currentText = $orig.text();
    if(!pattern) {
        $orig.html(escapeHtml(currentText)); 
        applyHighlightStyles();
        return;
    };
    var regex;
    try{
      regex = isRegex ? new RegExp(pattern, 'g') : new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    } catch(err) {
      alert('Pattern không hợp lệ'); return;
    }
    if (currentText.match(regex)) {
        var out = currentText.replace(regex, m => `%%HIGHLIGHT%%${m}%%END%%`);
        out = escapeHtml(out).replace(/%%HIGHLIGHT%%/g, '<span class="highlighted">').replace(/%%END%%/g, '</span>');
        $orig.html(out);
    } else {
        $orig.html(escapeHtml(currentText));
    }
    applyHighlightStyles();
  }

  $('#btnDelete').on('click', function(){
    var pattern = $('#pattern').val();
    if(!pattern) return;
    var currentText = $orig.text();
    try{
        var regex = new RegExp(pattern, 'g');
        var newText = currentText.replace(regex, '');
        $orig.text(newText);
    } catch(err){ alert('Pattern không hợp lệ'); }
  });

  /* YÊU CẦU 13: Nút Reset */
  $('#btnReset').on('click', function(){
     $orig.html(initialHtmlContent); // Khôi phục text gốc
     initializeControls(true); // Đặt lại các điều khiển
  });

  /* Hàm khởi tạo các nút điều khiển (Yêu cầu 6 & 10) */
  function initializeControls(isReset = false) {
      $('#textColor').val('#b30000');
      $('#bgColor').val('#fff176');
      $('#cbBold').prop('checked', false);
      $('#cbItalic').prop('checked', false);
      $('#cbUnderline').prop('checked', false);
      applyHighlightStyles();
      if (!isReset) {
         $orig.html(initialHtmlContent);
      } else {
         applyHighlightStyles();
      }
       $('#pattern').val('');
  }
  initializeControls();

  $('#addNew').on('click', function(){
      idCounter++;
      var $selected = $('#iconSelect option:selected');
      var icon = $selected.text();
      var label = $selected.val() || ('Item ' + idCounter);

      var $new = $('<div class="grid-item"></div>')
          .attr('data-id', idCounter)
          .append('<div class="icon-box"><div class="icon">'+icon+'</div></div>')
          .append('<div class="label">'+label+'</div>');
      $grid.append($new); // Thêm vào cuối
    });

    $(document).on('mouseup.gr', function(ev){
        if (!dragging) return;
        $(document).off('.gr');
        dragging.$clone.remove();
        
        $grid.children('.grid-item').css({
            transform: '',
            transition: ''
        });

        // Thả item vào vị trí placeholder
        dragging.$placeholder.replaceWith(dragging.$item);
        dragging.$item.show();
        dragging = null;
      });

      $(document).on('mousemove.gr', function(ev){
        if (!dragging) return;
        var $item = dragging.$item;
        
        dragging.$clone.css({ left: ev.pageX - ($item.outerWidth()/2), top: ev.pageY - ($item.outerHeight()/2) });

        var placed = false;
        var newTarget = null;
        
        $grid.children().not($item).not(dragging.$placeholder).each(function(){
          var $n = $(this);
          var midX = $n.offset().left + $n.outerWidth()/2;
          var midY = $n.offset().top + $n.outerHeight()/2;
          
          if(ev.pageY < midY || (Math.abs(ev.pageY-midY) < 10 && ev.pageX < midX)){
             newTarget = this;
             placed = true; 
             return false;
          }
        });
        
        var newInsertionTarget = placed ? newTarget : null;
        var currentTarget = dragging.$placeholder.next()[0] || null;

        if (newInsertionTarget === currentTarget) {
            return; 
        }

        // Bắt đầu FLIP
        var $itemsToAnimate = $grid.children('.grid-item').not($item);
        var firstRects = new Map();
        $itemsToAnimate.each(function(){
            firstRects.set(this, this.getBoundingClientRect());
        });

        $itemsToAnimate.css('transition', 'none'); 
        if (newInsertionTarget) {
            dragging.$placeholder.insertBefore(newInsertionTarget);
        } else {
            $grid.append(dragging.$placeholder);
        }

        $itemsToAnimate.each(function(){
            var firstRect = firstRects.get(this);
            var lastRect = this.getBoundingClientRect();
            var deltaX = firstRect.left - lastRect.left;
            var deltaY = firstRect.top - lastRect.top;
            if (deltaX !== 0 || deltaY !== 0) {
                 $(this).css({
                    transform: `translate(${deltaX}px, ${deltaY}px)`
                 });
            }
        });

        setTimeout(function(){
            $itemsToAnimate.each(function(){
                var $this = $(this);
                if ($this.css('transform') !== 'none') {
                    $this.css({
                        transition: 'transform .18s ease',
                        transform: 'translate(0, 0)'
                    });
                    $this.one('transitionend', function(){
                        $this.css({ transform: '', transition: '' });
                    });
                } else {
                    $this.css('transition', '');
                }
            });
        }, 10);
        
      });
});
  