var Modules = {
	init: function() {
		this.handleViewMode();
		// this.analytics();
	},

	analytics: function() {
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'UA-31871536-6');
	},

	handleViewMode: function() {
		var toggleButton = document.querySelector('#viewMode');
		var body = document.body;
		toggleButton.addEventListener('click', function(e) {
			body.classList.toggle('is-expanded');
			var icon = body.classList.contains('is-expanded') ? 'icon-collapse' : 'icon-expand';
			toggleButton.querySelector('use').setAttribute('xlink:href', '/gfx/symbol-defs.svg#' + icon);
		});
	}
}

Modules.init();