/* global $ */
import React, { useRef, useEffect } from 'react';
import 'summernote/dist/summernote';
import 'summernote/dist/summernote.css';
import 'codemirror/lib/codemirror.css';


const ReactSummernote = ({ children, options }) => {

  console.log('tag');

  const ref = useRef(null);

  useEffect(() => {
    console.log('ref', ref.current);

    $.extend(true, $.summernote.lang, {
      'en-US': {
          cleaner: {
              tooltip: 'Cleaner',
              not: 'Text has been Cleaned!!!',
              limitText: 'Text',
              limitHTML: 'HTML'
          },
          quotation: {
              tooltip: 'Quotation'
          },
          ndash: {
              tooltip: 'En dash'
          },
          imageLink: {
              tooltip: 'Image link',
              dialogTitle: 'Image Link',
              src: 'Source',
              title: 'Title',
              alt: 'Alt',
              editBtn: 'OK'
          }
      }
  });


  $.extend($.summernote.plugins, {
    'imageLink':function (context) {
        var self      = this,
            ui        = $.summernote.ui,
            $note     = context.layoutInfo.note,
            $editor   = context.layoutInfo.editor,
            $editable = context.layoutInfo.editable,
            options   = context.options,
            lang      = options.langInfo;

        context.memo('button.imageLink', function () {
            var button = ui.button({
                contents: options.imageLink.icon,
                tooltip: lang.imageLink.tooltip,
                container: 'body',
                click:function () {
                    context.invoke('imageLink.show');
                }
            });
            return button.render();
        });
        this.initialize = function () {
            var $container = $editor;
            var timestamp = Date.now();
            var body = '<p>Bitte laden die das gewünschte Bild vorher im Contentful-Bereich “Media” hoch und fügen Sie hier den entsprechenden Link hinzu. Beachten Sie, dass das Bild mindestens 640 Pixel breit ist, da alle Bilder über die komplette Breite dargestellt werden.</p>' +
                '  <div class="tab-pane note-tab-pane" id="note-imageLink-upload' + timestamp + '">' +
                '    <div class="note-form-group form-group note-group-imageLink-url">' +
                '      <div class="input-group note-input-group col-xs-12 col-sm-9">' +
                '        <input class="note-imageLink-src form-control note-form-control note-input" placeholder="' + lang.imageLink.src + '" type="text" />' +
                '      </div>' +
                '    </div>' +
                '    <div class="note-form-group form-group note-group-imageLink-title">' +
                '      <div class="input-group note-input-group col-xs-12 col-sm-9">' +
                '        <input class="note-imageLink-title form-control note-form-control note-input" placeholder="' + lang.imageLink.title + '" type="text" />' +
                '      </div>' +
                '    </div>' +
                '    <div class="note-form-group form-group note-group-imageLink-alt">' +
                '      <div class="input-group note-input-group col-xs-12 col-sm-9">' +
                '        <input class="note-imageLink-alt form-control note-form-control note-input" placeholder="' + lang.imageLink.alt + '" type="text" />' +
                '      </div>' +
                '    </div>' +
                '  </div>';
            this.$dialog=ui.dialog({
                title:  lang.imageLink.dialogTitle,
                body:   body,
                footer: '<button href="#" class="btn btn-primary note-btn note-btn-primary note-imageLink-btn">' + lang.imageLink.editBtn + '</button>'
            }).render().appendTo($container);
        };
        this.destroy = function () {
            ui.hideDialog(self.$dialog);
            self.$dialog.remove();
        };
        this.bindEnterKey = function ($input,$btn) {
            $input.on('keypress', function (e) {
                if (e.keyCode === 13) $btn.trigger('click');
            });
        };
        this.show = function () {
            $note.summernote('saveRange');
            this.showImageAttributesDialog().then( function (url, title, alt) {
                ui.hideDialog(self.$dialog);
                $note.summernote('restoreRange');
                $note.summernote('insertImage', url, function ($image) {
                    $image.attr('style', 'width: 100%; max-width: 570px; height: auto; display:block;');
                    $image.attr('title', title);
                    $image.attr('alt', alt);
                });
            });
        };
        this.showImageAttributesDialog = function () {
            return $.Deferred( function (deferred) {
                var $imageSrc    = self.$dialog.find('.note-imageLink-src'),
                    $imageTitle    = self.$dialog.find('.note-imageLink-title'),
                    $imageAlt    = self.$dialog.find('.note-imageLink-alt'),
                    $editBtn     = self.$dialog.find('.note-imageLink-btn');
                ui.onDialogShown(self.$dialog, function () {
                    context.triggerEvent('dialog.shown');
                    $editBtn.click( function (e) {
                        e.preventDefault();
                        deferred.resolve($imageSrc.val(), $imageTitle.val(), $imageAlt.val());
                    });
                    self.bindEnterKey($editBtn);
                });
                ui.onDialogHidden(self.$dialog, function () {
                    $editBtn.off('click');
                    if (deferred.state() === 'pending') deferred.reject();
                });
                ui.showDialog(self.$dialog);
            });
        };

    },
    'quotation':function (context) {
        var ui = $.summernote.ui,
            $note = context.layoutInfo.note,
            options = context.options,
            lang = options.langInfo;
        var addQuotation = function (text) {
            return "&bdquo;" + text + "&ldquo;";
        };
        context.memo('button.quotation', function () {
            var button = ui.button({
                contents: options.quotation.icon,
                tooltip: lang.quotation.tooltip,
                container: 'body',
                click:function () {
                    if ($note.summernote('createRange').toString())
                        $note.summernote('pasteHTML', addQuotation($note.summernote('createRange').toString()));
                }
            });
            return button.render();
        });
    },
    'ndash':function (context) {
        var ui = $.summernote.ui,
            $note = context.layoutInfo.note,
            options = context.options,
            lang = options.langInfo;
        context.memo('button.ndash', function () {
            var button = ui.button({
                contents: options.ndash.icon,
                tooltip: lang.ndash.tooltip,
                container: 'body',
                click:function () {
                    $note.summernote('pasteHTML', '&ndash;');
                }
            });
            return button.render();
        });
    },
    'cleaner': function (context) {
      var self = this,
            ui = $.summernote.ui,
         $note = context.layoutInfo.note,
       $editor = context.layoutInfo.editor,
       options = context.options,
          lang = options.langInfo;
      if (options.cleaner.action == 'both' || options.cleaner.action == 'button') {
        context.memo('button.cleaner', function () {
          var button = ui.button({
            contents: options.cleaner.icon,
            container: options.container,
            tooltip: lang.cleaner.tooltip,
            placement: options.placement,
            click: function () {
              if ($note.summernote('createRange').toString())
                $note.summernote('pasteHTML', $note.summernote('createRange').toString());
              else
                $note.summernote('code', cleanPaste($note.summernote('code'), options.cleaner.badTags, options.cleaner.keepTagContents, options.cleaner.badAttributes, options.cleaner.imagePlaceholder), true);
              if ($editor.find('.note-status-output').length > 0)
                $editor.find('.note-status-output').html(lang.cleaner.not);
            }
          });
          return button.render();
        });
      }
      this.events = {
        'summernote.init': function () {
          if (options.cleaner.limitChars != 0 || options.cleaner.limitDisplay != 'none'){
            var textLength = $editor.find(".note-editable").text().replace(/(<([^>]+)>)/ig, "").replace(/( )/," ");
            var codeLength = $editor.find('.note-editable').html();
            var lengthStatus = '';
            if (textLength.length > options.cleaner.limitChars&&options.cleaner.limitChars > 0)
              lengthStatus += 'note-text-danger">';
            else
              lengthStatus += '">';
            if (options.cleaner.limitDisplay == 'text' || options.cleaner.limitDisplay == 'both')
              lengthStatus += lang.cleaner.limitText + ': ' + textLength.length;
            if (options.cleaner.limitDisplay == 'both')
              lengthStatus += ' / ';
            if (options.cleaner.limitDisplay == 'html' || options.cleaner.limitDisplay == 'both')
              lengthStatus += lang.cleaner.limitHTML + ': ' + codeLength.length;
            $editor.find('.note-status-output').html('<small class="note-pull-right ' + lengthStatus + '&nbsp;</small>');
          }
        },
        'summernote.keydown': function (we, event) {
          if (options.cleaner.limitChars != 0 || options.cleaner.limitDisplay != 'none') {
            var textLength = $editor.find(".note-editable").text().replace(/(<([^>]+)>)/ig, "").replace(/( )/, " ");
            var codeLength = $editor.find('.note-editable').html();
            var lengthStatus = '';
            if (options.cleaner.limitStop == true && textLength.length >= options.cleaner.limitChars) {
              var key = event.keyCode;
              allowed_keys = [8, 37, 38, 39, 40, 46];
              if ($.inArray(key,allowed_keys) != -1){
                $editor.find('.cleanerLimit').removeClass('note-text-danger');
                return true;
              } else {
                $editor.find('.cleanerLimit').addClass('note-text-danger');
                event.preventDefault();
                event.stopPropagation();
              }
            } else {
              if (textLength.length > options.cleaner.limitChars && options.cleaner.limitChars > 0)
                lengthStatus += 'note-text-danger">';
              else
                lengthStatus += '">';
              if (options.cleaner.limitDisplay == 'text' || options.cleaner.limitDisplay == 'both')
                lengthStatus += lang.cleaner.limitText + ': '+textLength.length;
              if (options.cleaner.limitDisplay == 'both')
                lengthStatus += ' / ';
              if (options.cleaner.limitDisplay == 'html' || options.cleaner.limitDisplay == 'both')
                lengthStatus += lang.cleaner.limitHTML + ': ' + codeLength.length;
              $editor.find('.note-status-output').html('<small class="cleanerLimit note-pull-right ' + lengthStatus + '&nbsp;</small>');
            }
          }
        },
        'summernote.paste': function(we, event) {
          if (options.cleaner.action=='both' || options.cleaner.action == 'paste') {
            event.preventDefault();
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
                msie = msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
            var ffox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            var text; var isHtmlData = false;
            if (msie)
              text = window.clipboardData.getData("Text");
            else
            {
              var dataType = 'text/plain';
              /*only get the html data if its avaialble else use plain text*/
              if (options.cleaner.keepHtml && event.originalEvent.clipboardData.types.indexOf('text/html') > -1) {
                  dataType = 'text/html';
                  isHtmlData = true;
              }
              text = event.originalEvent.clipboardData.getData(dataType);
            }
            if (text) {
              if (msie || ffox) {
                setTimeout(function () {
                  $note.summernote('pasteHTML', cleanPaste(text, options.cleaner.badTags, options.cleaner.keepTagContents, options.cleaner.badAttributes, options.cleaner.imagePlaceholder, isHtmlData));
                }, 1);
              } else
                $note.summernote('pasteHTML', cleanPaste(text, options.cleaner.badTags, options.cleaner.keepTagContents, options.cleaner.badAttributes, options.cleaner.imagePlaceholder, isHtmlData));
              if ($editor.find('.note-status-output').length > 0) {
                $editor.find('.note-status-output').html(lang.cleaner.not);
                /*now set a timeout to clear out the message */
                setTimeout(function(){
                  if($editor.find('.note-status-output').html() == lang.cleaner.not){
                    /*lets fade out the text, then clear it and show the control ready for next time */
                    $editor.find('.note-status-output').fadeOut(function(){
                      $(this).html("");
                      $(this).fadeIn();
                    });
                  }
                }, options.cleaner.notTimeOut)
              }
            }
          }
        }
      }
      var cleanPaste = function(input, badTags, keepTagContents, badAttributes, imagePlaceholder, isHtmlData) {
        if(isHtmlData) {
          return cleanHtmlPaste(input, badTags, keepTagContents, badAttributes, imagePlaceholder);
        } else {
          return cleanTextPaste(input);
        }
      };

      var cleanTextPaste = function(input) {
        var newLines = /(\r\n|\r|\n)/g;
        var parsedInput = input.split(newLines);
        if(parsedInput.length === 1) { return input; }
        var output = "";
        /*for larger blocks of text (such as multiple paragraphs) match summernote markup */
        for (let contentIndex = 0; contentIndex < parsedInput.length; contentIndex++) {
          const element = parsedInput[contentIndex];
          if(!newLines.test(element)) {
            var line = element == '' ? '<br>' : element;
            output += '<p>' + line + '</p>'
          }
        }
        return output;
      }

      var cleanHtmlPaste = function(input, badTags, keepTagContents, badAttributes, imagePlaceholder) {
        var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")? ^p)/g;
        var output = input.replace(stringStripper, '');
        var commentSripper = new RegExp('<!--(.*?)-->', 'g');
        var output = output.replace(commentSripper, '');
        var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
        output = output.replace(/ src="(.*?)"/gi, ' src="' + imagePlaceholder + '"');
        output = output.replace(/ name="(.*?)"/gi, ' data-title="$1" alt="$1"');
        output = output.replace(tagStripper, '');
        for (var i = 0; i < badTags.length; i++) {
          tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
          output = output.replace(tagStripper, '');
        }
        for (var i = 0; i < keepTagContents.length; i++) {
          tagStripper = new RegExp('</?' + keepTagContents[i] + '.*?>', 'gi');
          output = output.replace(tagStripper, ' ');
        }
        for (var i = 0; i < badAttributes.length; i++) {
          var attributeStripper = new RegExp(badAttributes[i] + '="(.*?)"', 'gi');
          output = output.replace(attributeStripper, '');
        }
        output = output.replace(/ align="(.*?)"/gi, ' class="text-$1"');
        output = output.replace(/ class="western"/gi, '');
        output = output.replace(/ class=""/gi, '');
        output = output.replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>');
        output = output.replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>');
        output = output.replace(/\s{2,}/g, ' ').trim();
        return output;
      }
    }
});


    $(ref.current).summernote(options);

    return () => {
      $(ref.current).summernote('destroy');
    };


  }, []);

  return (
    <div ref={ref}>{children}</div>
  );
};

export default ReactSummernote;

