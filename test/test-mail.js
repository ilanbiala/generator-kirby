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
		
		// only information really necessary is the folder
		helpers.mockPrompt(kirby, {
			whichFolder: 'kirby-mocha'
		});

		// some files that should be created
		var expected = [
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
		
		// run the test
		kirby.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});

	it('configures the contact form and related parts properly', function (done) {
		
		// make sure the contact form option is selected
		helpers.mockPrompt(kirby, {
			whichFolder: 'kirby-mocha',
			kirbyContactForm: true,
			adminName: 'Johnny Appleseed',
			adminEmail: 'johnny.appleseed@gmail.com',
		});

		// filename should match the format {{username}}.php
		var expected = [
		  'kirby-mocha/assets/scripts/jquery.min.js',
		  'kirby-mocha/assets/scripts/contact.js',
		  'kirby-mocha/content/03-contact/contact.txt',
		  'kirby-mocha/lib/mail.php',
		  'kirby-mocha/lib/class.smtp.php',
		  'kirby-mocha/lib/class.pop3.php',
		  'kirby-mocha/lib/class.phpmailer.php',
		  'kirby-mocha/lib/PHPMailerAutoload.php'
		];

		kirby.options['skip-install'] = true;
		
		// run the SHA1 test, make sure the hashes match
		kirby.run({}, function () {
			var mochaUserFile = fs.readFileSync('kirby-mocha/site/panel/accounts/mocha.php');
			var passwordHashRegex = new RegExp('cfc672ce2736e27349ca7a61005fc5f32f9018a5');

			helpers.assertFile(expected);
			assert.ok(passwordHashRegex.text(mochaUserFile), 'panel user file does not have properly SHA1 hashed password.');

			done();
		});
	});
});
