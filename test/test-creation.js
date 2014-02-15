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

	it('creates all the boilerplate files', function (done) {
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

		kirby.options['skip-install'] = true;
		kirby.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});

	it('creates all the blog files', function (done) {
		helpers.mockPrompt(kirby, {
			whichFolder: 'kirby-mocha',
			kirbyBlog: 'Yes'
		});

		var expected = [
			// add files you expect to exist here.
			'kirby-mocha/content/04-blog/blog.txt',
			'kirby-mocha/content/04-blog/01-your-first-article/blogarticle.txt',
			'kirby-mocha/content/04-blog/02-your-second-article/blogarticle.txt',
			'kirby-mocha/content/04-blog/03-your-third-article/blogarticle.txt',
			'kirby-mocha/site/templates/blogarticle.php',
			'kirby-mocha/site/templates/blog.php'
		];

		kirby.options['skip-install'] = true;
		kirby.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});

	it('creates all the panel files', function (done) {
		helpers.mockPrompt(kirby, {
			whichFolder: 'kirby-mocha',
			kirbyPanel: 'Yes',
			username: 'mocha'
		});

		var expected = [
			// add files you expect to exist here.
			'kirby-mocha/site/panel/accounts/mocha.php',
		];

		kirby.options['skip-install'] = true;
		kirby.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});
});