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
			imageLink: function (context) {
	
				var self = this,
					ui = $.summernote.ui,
					$note = context.layoutInfo.note,
					$editor = context.layoutInfo.editor,
					$editable = context.layoutInfo.editable,
					options = context.options,
					lang = options.langInfo;
	
				context.memo('button.imageLink', function () {
					var button = ui.button({
						contents: options.imageLink.icon,
						//tooltip: lang.imageLink.tooltip,
						container: 'body',
						click: function () {
							context.invoke('imageLink.show');
						},
					});
					return button.render();
				});
				this.initialize = function () {
					var $container = $editor;
					var timestamp = Date.now();
					var body =
						'<p>Bitte laden die das gewünschte Bild vorher im Contentful-Bereich “Media” hoch und fügen Sie hier den entsprechenden Link hinzu. Beachten Sie, dass das Bild mindestens 640 Pixel breit ist, da alle Bilder über die komplette Breite dargestellt werden.</p>' +
						'  <div class="tab-pane note-tab-pane" id="note-imageLink-upload' +
						timestamp +
						'">' +
						'    <div class="note-form-group form-group note-group-imageLink-url">' +
						'      <div class="input-group note-input-group col-xs-12 col-sm-9">' +
						'        <input class="note-imageLink-src form-control note-form-control note-input" placeholder="' +
						lang.imageLink.src +
						'" type="text" />' +
						'      </div>' +
						'    </div>' +
						'    <div class="note-form-group form-group note-group-imageLink-title">' +
						'      <div class="input-group note-input-group col-xs-12 col-sm-9">' +
						'        <input class="note-imageLink-title form-control note-form-control note-input" placeholder="' +
						lang.imageLink.title +
						'" type="text" />' +
						'      </div>' +
						'    </div>' +
						'    <div class="note-form-group form-group note-group-imageLink-alt">' +
						'      <div class="input-group note-input-group col-xs-12 col-sm-9">' +
						'        <input class="note-imageLink-alt form-control note-form-control note-input" placeholder="' +
						lang.imageLink.alt +
						'" type="text" />' +
						'      </div>' +
						'    </div>' +
						'  </div>';
					this.$dialog = ui
						.dialog({
							title: lang.imageLink.dialogTitle,
							body: body,
							footer:
								'<button href="#" class="btn btn-primary note-btn note-btn-primary note-imageLink-btn">' +
								lang.imageLink.editBtn +
								'</button>',
						})
						.render()
						.appendTo($container);
				};
				this.destroy = function () {
					ui.hideDialog(self.$dialog);
					self.$dialog.remove();
				};
				this.bindEnterKey = function ($input, $btn) {
					$input.on('keypress', function (e) {
						if (e.keyCode === 13) $btn.trigger('click');
					});
				};
				this.show = function () {
					$note.summernote('saveRange');
					this.showImageAttributesDialog().then(function (url, title, alt) {
						ui.hideDialog(self.$dialog);
						$note.summernote('restoreRange');
						$note.summernote('insertImage', url, function ($image) {
							$image.attr(
								'style',
								'width: 100%; max-width: 570px; height: auto; display:block;'
							);
							$image.attr('title', title);
							$image.attr('alt', alt);
						});
					});
				};
				this.showImageAttributesDialog = function () {

					return $.Deferred(function (deferred) {
						var $imageSrc = self.$dialog.find('.note-imageLink-src'),
							$imageTitle = self.$dialog.find('.note-imageLink-title'),
							$imageAlt = self.$dialog.find('.note-imageLink-alt'),
							$editBtn = self.$dialog.find('.note-imageLink-btn');
						ui.onDialogShown(self.$dialog, function () {
							context.triggerEvent('dialog.shown');
							$editBtn.click(function (e) {
								e.preventDefault();
								deferred.resolve(
									$imageSrc.val(),
									$imageTitle.val(),
									$imageAlt.val()
								);
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
		}
	);
});
