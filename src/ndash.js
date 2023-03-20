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
	$.extend(
		$.summernote.plugins,

		{
			ndash: function (context) {
				const ui = $.summernote.ui,
					$note = context.layoutInfo.note,
					options = context.options,
					lang = options.langInfo;
				context.memo('button.ndash', function () {
					var button = ui.button({
						contents: options.ndash.icon,
						//tooltip: lang.ndash.tooltip,
						container: 'body',
						click: function () {
							$note.summernote('pasteHTML', '&ndash;');
						},
					});
					return button.render();
				});
			},
		}
	);
});
