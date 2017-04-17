requirejs.config({
	baseUrl: "js/lib",
	paths: {
		"app": "../app",
		"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min"
	},
	shim: {
		"viz": {
			exports: 'Viz'
		}
	}
});

// Load the main app module to start the app
requirejs(["app/helpers"], function() {
	requirejs(["app/main"]);
});
