'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var exec = require('child_process').exec,
	child;

var whichFolder = 'kirby';

var KirbyGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

		this.on('end', function () {
			if (!this.options['skip-install']) {
				// this.npmInstall();
			}
		});
	},

	checkForGit: function () {
		var done = this.async();

		child = exec('git --version',
			function (error) {
				if (error) {
					console.log('Git does not seem to be installed or is not properly set up in the PATH, please configure this then come back.');
					return; // REQUIRE GIT
				}
				done();
			}.bind(this));
	},

	promptForFolder: function () {
		var done = this.async();

		var prompt = {
			name: 'whichFolder',
			message: 'In which folder would you like this Kirby project to be created?'
		};

		this.prompt(prompt, function (props) {
			whichFolder = props.whichFolder;
			done();
		}.bind(this));
	},

	cloneKirby: function () {
		var done = this.async();

		child = exec('git clone https://github.com/bastianallgeier/kirbycms.git ' + whichFolder || './kirby',
			function (error) {
				if (error !== null) {
					console.log('error: ' + error);
				}
				done();
			}.bind(this));
	},

	removeExtraneousFiles: function () {
		var done = this.async();

		child = exec('rm ./' + whichFolder + '/site/config/config.php ./' + whichFolder + '/content/site.txt',
			function (error) {
				if (error !== null) {
					console.log('error: ' + error);
				}
				done();
			}.bind(this));
	},

	askFor: function () {
		var done = this.async();

		// have Yeoman greet the user
		console.log(this.yeoman);

		// short and sweet description of your generator
		console.log(chalk.magenta('You\'re using the fantastic Kirby generator.'));

		var prompts = [{
			name: 'licenseKey',
			message: 'License key:'
		}, {
			name: 'siteTitle',
			message: 'Site name:',
			default: 'My site'
		}, {
			name: 'siteAuthor',
			message: 'Site author:'
		}, {
			name: 'siteDescription',
			message: 'Site description:',
			default: 'A nice little website.'
		}, {
			name: 'siteKeywords',
			message: 'Site keywords:'
		}, {
			name: 'siteCopyright',
			message: 'Copyright message',
			default: '© (date: Year)'
		}];

		this.prompt(prompts, function (props) {
			this.licenseKey = props.licenseKey;
			this.siteTitle = props.siteTitle;
			this.siteAuthor = props.siteAuthor;
			this.siteDescription = props.siteDescription;
			this.siteKeywords = props.siteKeywords;
			this.siteCopyright = props.siteCopyright;
			this.siteCredits = props.siteCredits;

			done();
		}.bind(this));
	},

	app: function () {
		// copy files with the proper fields filled in with user info
		this.template('_package.json', whichFolder + '/package.json');
		this.template('config.php', whichFolder + '/site/config/config.php');
		this.template('site.txt', whichFolder + '/content/site.txt');
	},

	finish: function () {
		// Give the user info on how to start developing
		var howToInstall =
			'Nice! Now run ' + chalk.magenta('cd ' + whichFolder + '/') + '.' +
			'\nYou can either start up the server with MAMP, XAMPP, or the like, or' +
			'\nYou can run ' + chalk.magenta('php -S localhost:8080') + '.' +
			'\nEither way, you have completed this scaffolding, young grasshopper.';
		console.log(howToInstall);
	}
});

module.exports = KirbyGenerator;