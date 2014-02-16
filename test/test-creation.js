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

		var expected = [ // expected files
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

		var expected = [ // expected files
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

		var expected = [ // expected files
			'kirby-mocha/site/panel/accounts/mocha.php',
		];

		kirby.options['skip-install'] = true;
		kirby.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});

	it('hashes passwords properly using MD5', function (done) {
		helpers.mockPrompt(kirby, {
			whichFolder: 'kirby-mocha',
			kirbyPanel: 'Yes',
			username: 'mocha',
			password: 'mocha-test',
			encryption: 'md5'
		});

		var expected = [ // expected files
			'kirby-mocha/site/panel/accounts/mocha.php',
		];

		kirby.options['skip-install'] = true;
		kirby.run({}, function () {
			var mochaUserFile = fs.readFileSync('kirby-mocha/site/panel/accounts/mocha.php');
			var passwordHashRegex = new RegExp('b18a47c265be207a358e42113d05f53f');

			helpers.assertFile(expected);
			assert.ok(passwordHashRegex.text(mochaUserFile), 'panel user file does not have properly MD5 hashed password.');

			done();
		});
	});

	it('hashes passwords properly using SHA1', function (done) {
		helpers.mockPrompt(kirby, {
			whichFolder: 'kirby-mocha',
			kirbyPanel: 'Yes',
			username: 'mocha',
			password: 'mocha-test',
			encryption: 'sha1'
		});

		var expected = [ // expected files
			'kirby-mocha/site/panel/accounts/mocha.php',
		];

		kirby.options['skip-install'] = true;
		kirby.run({}, function () {
			var mochaUserFile = fs.readFileSync('kirby-mocha/site/panel/accounts/mocha.php');
			var passwordHashRegex = new RegExp('cfc672ce2736e27349ca7a61005fc5f32f9018a5');

			helpers.assertFile(expected);
			assert.ok(passwordHashRegex.text(mochaUserFile), 'panel user file does not have properly SHA1 hashed password.');

			done();
		});
	});
});