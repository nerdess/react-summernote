(function (factory) {
	/* global define */
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(window.jQuery);
	}
})(function ($) {
	// Extends plugins for adding hello.
	//  - plugin is external module for customizing.

	const lang = {

		cleaner: {
			tooltip: 'Cleaner',
			not: 'Text has been Cleaned!!!',
			limitText: 'Text',
			limitHTML: 'HTML'
		}
		
	}


	$.extend(
		$.summernote.plugins,

		{
			cleaner: function (context) {
				var self = this;
					const ui = $.summernote.ui,
					$note = context.layoutInfo.note,
					$editor = context.layoutInfo.editor,
					options = context.options,
					lang = options.langInfo;
				if (
					options.cleaner.action == 'both' ||
					options.cleaner.action == 'button'
				) {
					context.memo('button.cleaner', function () {
						var button = ui.button({
							contents: options.cleaner.icon,
							container: options.container,
							tooltip: lang.cleaner.tooltip,
							placement: options.placement,
							click: function () {
								if ($note.summernote('createRange').toString())
									$note.summernote(
										'pasteHTML',
										$note.summernote('createRange').toString()
									);
								else
									$note.summernote(
										'code',
										cleanPaste(
											$note.summernote('code'),
											options.cleaner.badTags,
											options.cleaner.keepTagContents,
											options.cleaner.badAttributes,
											options.cleaner.imagePlaceholder
										),
										true
									);
								if ($editor.find('.note-status-output').length > 0)
									$editor.find('.note-status-output').html(lang.cleaner.not);
							},
						});
						return button.render();
					});
				}
				this.events = {
					'summernote.init': function () {
						if (
							options.cleaner.limitChars != 0 ||
							options.cleaner.limitDisplay != 'none'
						) {
							var textLength = $editor
								.find('.note-editable')
								.text()
								.replace(/(<([^>]+)>)/gi, '')
								.replace(/( )/, ' ');
							var codeLength = $editor.find('.note-editable').html();
							var lengthStatus = '';
							if (
								textLength.length > options.cleaner.limitChars &&
								options.cleaner.limitChars > 0
							)
								lengthStatus += 'note-text-danger">';
							else lengthStatus += '">';
							if (
								options.cleaner.limitDisplay == 'text' ||
								options.cleaner.limitDisplay == 'both'
							)
								lengthStatus += lang.cleaner.limitText + ': ' + textLength.length;
							if (options.cleaner.limitDisplay == 'both') lengthStatus += ' / ';
							if (
								options.cleaner.limitDisplay == 'html' ||
								options.cleaner.limitDisplay == 'both'
							)
								lengthStatus += lang.cleaner.limitHTML + ': ' + codeLength.length;
							$editor
								.find('.note-status-output')
								.html(
									'<small class="note-pull-right ' +
										lengthStatus +
										'&nbsp;</small>'
								);
						}
					},
					'summernote.keydown': function (we, event) {
						if (
							options.cleaner.limitChars != 0 ||
							options.cleaner.limitDisplay != 'none'
						) {
							var textLength = $editor
								.find('.note-editable')
								.text()
								.replace(/(<([^>]+)>)/gi, '')
								.replace(/( )/, ' ');
							var codeLength = $editor.find('.note-editable').html();
							var lengthStatus = '';
							if (
								options.cleaner.limitStop == true &&
								textLength.length >= options.cleaner.limitChars
							) {
								var key = event.keyCode;
								const allowed_keys = [8, 37, 38, 39, 40, 46];
								if ($.inArray(key, allowed_keys) != -1) {
									$editor.find('.cleanerLimit').removeClass('note-text-danger');
									return true;
								} else {
									$editor.find('.cleanerLimit').addClass('note-text-danger');
									event.preventDefault();
									event.stopPropagation();
								}
							} else {
								if (
									textLength.length > options.cleaner.limitChars &&
									options.cleaner.limitChars > 0
								)
									lengthStatus += 'note-text-danger">';
								else lengthStatus += '">';
								if (
									options.cleaner.limitDisplay == 'text' ||
									options.cleaner.limitDisplay == 'both'
								)
									lengthStatus +=
										lang.cleaner.limitText + ': ' + textLength.length;
								if (options.cleaner.limitDisplay == 'both') lengthStatus += ' / ';
								if (
									options.cleaner.limitDisplay == 'html' ||
									options.cleaner.limitDisplay == 'both'
								)
									lengthStatus +=
										lang.cleaner.limitHTML + ': ' + codeLength.length;
								$editor
									.find('.note-status-output')
									.html(
										'<small class="cleanerLimit note-pull-right ' +
											lengthStatus +
											'&nbsp;</small>'
									);
							}
						}
					},
					'summernote.paste': function (we, event) {
						if (
							options.cleaner.action == 'both' ||
							options.cleaner.action == 'paste'
						) {
							event.preventDefault();
							var ua = window.navigator.userAgent;
							var msie = ua.indexOf('MSIE ');
							msie = msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
							var ffox =
								navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
							var text;
							var isHtmlData = false;
							if (msie) text = window.clipboardData.getData('Text');
							else {
								var dataType = 'text/plain';
								/*only get the html data if its avaialble else use plain text*/
								if (
									options.cleaner.keepHtml &&
									event.originalEvent.clipboardData.types.indexOf('text/html') >
										-1
								) {
									dataType = 'text/html';
									isHtmlData = true;
								}
								text = event.originalEvent.clipboardData.getData(dataType);
							}
							if (text) {
								if (msie || ffox) {
									setTimeout(function () {
										$note.summernote(
											'pasteHTML',
											cleanPaste(
												text,
												options.cleaner.badTags,
												options.cleaner.keepTagContents,
												options.cleaner.badAttributes,
												options.cleaner.imagePlaceholder,
												isHtmlData
											)
										);
									}, 1);
								} else
									$note.summernote(
										'pasteHTML',
										cleanPaste(
											text,
											options.cleaner.badTags,
											options.cleaner.keepTagContents,
											options.cleaner.badAttributes,
											options.cleaner.imagePlaceholder,
											isHtmlData
										)
									);
								if ($editor.find('.note-status-output').length > 0) {
									$editor.find('.note-status-output').html(lang.cleaner.not);
									/*now set a timeout to clear out the message */
									setTimeout(function () {
										if (
											$editor.find('.note-status-output').html() ==
											lang.cleaner.not
										) {
											/*lets fade out the text, then clear it and show the control ready for next time */
											$editor.find('.note-status-output').fadeOut(function () {
												$(this).html('');
												$(this).fadeIn();
											});
										}
									}, options.cleaner.notTimeOut);
								}
							}
						}
					},
				};
				var cleanPaste = function (
					input,
					badTags,
					keepTagContents,
					badAttributes,
					imagePlaceholder,
					isHtmlData
				) {
					if (isHtmlData) {
						return cleanHtmlPaste(
							input,
							badTags,
							keepTagContents,
							badAttributes,
							imagePlaceholder
						);
					} else {
						return cleanTextPaste(input);
					}
				};
	
				var cleanTextPaste = function (input) {
					var newLines = /(\r\n|\r|\n)/g;
					var parsedInput = input.split(newLines);
					if (parsedInput.length === 1) {
						return input;
					}
					var output = '';
					/*for larger blocks of text (such as multiple paragraphs) match summernote markup */
					for (
						let contentIndex = 0;
						contentIndex < parsedInput.length;
						contentIndex++
					) {
						const element = parsedInput[contentIndex];
						if (!newLines.test(element)) {
							var line = element == '' ? '<br>' : element;
							output += '<p>' + line + '</p>';
						}
					}
					return output;
				};
	
				var cleanHtmlPaste = function (
					input,
					badTags,
					keepTagContents,
					badAttributes,
					imagePlaceholder
				) {
					var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")? ^p)/g;
					var output = input.replace(stringStripper, '');
					var commentSripper = new RegExp('<!--(.*?)-->', 'g');
					var output = output.replace(commentSripper, '');
					var tagStripper = new RegExp(
						'<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>',
						'gi'
					);
					output = output.replace(
						/ src="(.*?)"/gi,
						' src="' + imagePlaceholder + '"'
					);
					output = output.replace(/ name="(.*?)"/gi, ' data-title="$1" alt="$1"');
					output = output.replace(tagStripper, '');
					for (var i = 0; i < badTags.length; i++) {
						tagStripper = new RegExp(
							'<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>',
							'gi'
						);
						output = output.replace(tagStripper, '');
					}
					for (var i = 0; i < keepTagContents.length; i++) {
						tagStripper = new RegExp('</?' + keepTagContents[i] + '.*?>', 'gi');
						output = output.replace(tagStripper, ' ');
					}
					for (var i = 0; i < badAttributes.length; i++) {
						var attributeStripper = new RegExp(
							badAttributes[i] + '="(.*?)"',
							'gi'
						);
						output = output.replace(attributeStripper, '');
					}
					output = output.replace(/ align="(.*?)"/gi, ' class="text-$1"');
					output = output.replace(/ class="western"/gi, '');
					output = output.replace(/ class=""/gi, '');
					output = output.replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>');
					output = output.replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>');
					output = output.replace(/\s{2,}/g, ' ').trim();
					return output;
				};
			},
		}
	);
});
