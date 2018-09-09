/**
 * @fileoverview テキスト配列
 * @author twitter:@billstw
 * 
 * Copyright (c) 2018 bills-appworks
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

/**
 */
$(function() {
  /**
   * ドロップ可能領域のHTML要素生成
   */
  function generate_html_element_le_block_edge() {
    /*
     * 以下のHTML要素構造を生成
        <div class="le-block-edge"></div>
     */
    return html_element_le_block_edge = $('<div>').addClass('le-block-edge');
  }

  /**
   * 配列要素テキスト表示のHTML要素生成
   */
  function generate_html_element_le_block(array_element, array_index) {
    /*
     * 以下のHTML要素構造を生成（現段階ではCSSで削除ボタン以降は非表示）
        <div class="le-block" id="block【array_index】">
          <div class="le-block__menu">
            <button class="mdl-button mdl-js-button mdl-button--icon">
              <i class="material-icons">open_with</i>
            </button>
            <span class="le-block__menu_id">【array_element】</span>
            <button class="mdl-button mdl-js-button mdl-button--icon">
              <i class="material-icons">delete</i>
            </button>
          </div>
          <div class="le-block-core">
            <div>【array_element】</div>
          </div>
        </div>
      */
    var html_element_le_block = $('<div>').addClass('le-block').attr('id', 'block' + (array_index + 1));
    var html_element_le_block__menu = $('<div>').addClass('le-block__menu');
    html_element_le_block.append(html_element_le_block__menu);
    var html_element_button_open_with = $('<button>').attr('class', 'mdl-button mdl-js-button mdl-button--icon');
    html_element_le_block__menu.append(html_element_button_open_with);
    html_element_button_open_with.append($('<i>').attr('class', 'material-icons').text('open_with'));
    html_element_le_block__menu.append($('<span>').addClass('le-block__menu_id').text(array_element));
    var html_element_button_delete = $('<button>').attr('class', 'mdl-button mdl-js-button mdl-button--icon');
    html_element_le_block__menu.append(html_element_button_delete);
    html_element_button_delete.append($('<i>').attr('class', 'material-icons').text('delete'));
    var html_element_le_block_core = $('<div>').attr('class', 'le-block-core');
    html_element_le_block.append(html_element_le_block_core)
    html_element_le_block_core.append($('<div>').text(array_element));
    return html_element_le_block;
  }

  /**
   * テキスト入力部のJSON配列文字列をGUI部に適用
   */
  function apply_text_to_gui() {
    var array_text = $('#array-text').val();
    var parsed_array = JSON.parse(array_text);
    $('#array-gui').append(generate_html_element_le_block_edge());
    parsed_array.forEach(function(array_element, array_index) {
      $('#array-gui').append(generate_html_element_le_block(array_element, array_index));
      $('#array-gui').append(generate_html_element_le_block_edge());
    });
  }

  /**
   * 初回表示
   */
  apply_text_to_gui();

  /**
   * GUIでの変更をJSON配列テキスト表示部に反映
   */
  function gui_to_text() {
    var array_text = '[';
    $('.le-block-core').each(function(index) {
      var element_text = '"' + $(this).children('div').text() + '"';
      if (index > 0) {
        array_text += ',';
      }
      array_text += element_text;
    });
    array_text += ']';
    $('#array-text').val(array_text);
  }

  /**
   * ドラッグ
   * ドラッグ＆ドロップ可能化
   * ドロップ先限定
   * @pekoporin氏の記事を利用
   * https://qiita.com/pekoporin/items/65de9d1ee3adc9456b54
   */
  $('.le-block').on('MSPointerDown touchstart mousedown', function(e){
    $(this).closest('.le-block').pep({
      shouldEase: false,
      place: false,
      droppable: ".le-block-edge",        // dropを許可する要素
      revert: true,
      start: function(ev, obj) {
        // ドロップ可能エリアを表示
        $(".le-block-edge").show();
        // ドラッグ対象前後のドロップ可能エリアは表示しない（ドロップ時処理で例外処理が必要なため）
        obj.$el.prev().hide();
        obj.$el.next().hide();
      },
      drag: function(ev, obj) {
        if (obj.activeDropRegions.length >= 1) {
          $(obj.activeDropRegions).each(function(index) {
            if (index) {
              $(this).removeClass(obj.options.droppableActiveClass);
            }
          });
        }  
      },
      stop: function(ev, obj) {
        // ドロップ可能エリアを非表示に
        $(".le-block-edge").hide();

        // ドロップ可能エリアの後ろにドラッグしたブロックとその直後のドロップ可能エリアを挿入
        obj.$el.next().insertAfter(obj.activeDropRegions[0]);
        obj.$el.insertAfter(obj.activeDropRegions[0]);
        // テキストに反映
        gui_to_text();
      }
    });
  });

});
