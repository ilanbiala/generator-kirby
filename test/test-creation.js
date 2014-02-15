/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('kirby generator', function () {
	var kirby;

	beforeEach(function (done) {
		var dependencies = [
			'../../app'
		];

		helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
			if (err) {
				return done(err);
			}

			kirby = helpers.createGenerator('kirby:app', dependencies);
			done();
		}.bind(this));
	});

	it('creates expected files', function (done) {
		helpers.mockPrompt(kirby, {
			whichFolder: 'kirby-mocha'
		});

		var expected = [
			// add files you expect to exist here.
			'kirby-mocha/.gitignore',
			'kirby-mocha/.htaccess',
			'kirby-mocha/assets/',
			'kirby-mocha/content/',
			'kirby-mocha/index.php',
			'kirby-mocha/kirby/',
			'kirby-mocha/license.mdown',
			'kirby-mocha/package.json',
			'kirby-mocha/readme.mdown',
			'kirby-mocha/site/'
		];

		// helpers.mockPrompt(this.app, {
		// 	'someOption': true
		// });
		kirby.options['skip-install'] = true;
		kirby.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});
});