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

	$.extend(true, $.summernote.lang, {
		'en-US': {
			quotation: {
				tooltip: 'Quotation',
			},
		},
	});

	$.extend(
		$.summernote.plugins,

		{
			quotation: (context) => {
				const ui = $.summernote.ui,
					$note = context.layoutInfo.note,
					options = context.options,
					lang = options.langInfo;
				const addQuotation = (text) => {
					return '&bdquo;' + text + '&ldquo;';
				};
				context.memo('button.quotation', () => {
					console.log('lang', lang);

					const button = ui.button({
						contents: options.quotation.icon,
						tooltip: lang.quotation.tooltip,
						container: 'body',
						click: function () {
							if ($note.summernote('createRange').toString())
								$note.summernote(
									'pasteHTML',
									addQuotation($note.summernote('createRange').toString())
								);
						},
					});
					return button.render();
				});
			},
		}
	);
});
