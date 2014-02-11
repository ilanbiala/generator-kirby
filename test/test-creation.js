/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('kirby generator', function () {
	beforeEach(function (done) {
		helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
			if (err) {
				return done(err);
			}

			this.app = helpers.createGenerator('kirby:app', [
				'../../app'
			]);
			done();
		}.bind(this));
	});

	it('creates expected files', function (done) {
		var expected = [
			// add files you expect to exist here.
			'kirby/.gitignore',
			'kirby/.htaccess',
			'kirby/assets/',
			'kirby/content/',
			'kirby/index.php',
			'kirby/kirby/',
			'kirby/license.md',
			'kirby/package.json',
			'kirby/readme.md',
			'kirby/site/'
		];

		helpers.mockPrompt(this.app, {
			'someOption': true
		});
		this.app.options['skip-install'] = true;
		this.app.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});
});