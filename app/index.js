'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var KirbyGenerator = yeoman.generators.Base.extend({
	init: function() {
		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

		this.on('end', function() {
			if (!this.options['skip-install']) {
				// this.npmInstall();
			}
		});
	},

	askFor: function() {
		var done = this.async();

		// have Yeoman greet the user
		console.log(this.yeoman);

		// replace it with a short and sweet description of your generator
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

		this.prompt(prompts, function(props) {
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

	app: function() {
		this.mkdir('kirby');
		this.copy('kirby/.gitignore', 'kirby/.gitignore');
		this.copy('kirby/.htaccess', 'kirby/.htaccess');
		this.copy('kirby/index.php', 'kirby/index.php');
		this.copy('kirby/license.md', 'kirby/license.md');
		this.copy('kirby/readme.md', 'kirby/readme.md');
		this.directory('kirby/assets/', 'kirby/assets/');
		this.directory('kirby/kirby/', 'kirby/kirby/');
		this.directory('kirby/site/', 'kirby/site/');
		this.directory('kirby/content/', 'kirby/content/');

		this.template('_package.json', 'kirby/package.json');
		this.template('kirby/site/config/config.php', 'kirby/site/config/config.php');
		this.template('kirby/content/site.txt', 'kirby/content/site.txt');
	},

	finish: function() {
		// Give the user info on how to start developing
		var howToInstall =
			'Nice! Now run ' + chalk.magenta('cd kirby/') + '.' +
			'\nYou can either start up the server with MAMP, XAMPP, or the like, or' +
			'\nYou can run ' + chalk.magenta('php -S localhost:8080') + '.' +
			'\nEither way, you have completed this scaffolding, young grasshopper.';
		console.log(howToInstall);
	}
});

module.exports = KirbyGenerator;