'use strict';

// Dependencies
var util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	chalk = require('chalk'),
	exec = require('child_process').exec,
	child;

// CryptoJS gives MD5 & SHA1 encryption
var CryptoJS = require('crypto-js');

// These variables need to be global
var whichFolder = 'kirby';
var kirbyPanel;
var kirbyBlog;

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
		// Make sure this runs synchronously
		var done = this.async();

		// execute a git command and check for an error
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
		// Make sure this runs synchronously
		var done = this.async();

		// have Yeoman greet the user
		console.log(this.yeoman);

		// short and sweet description of your generator
		console.log(chalk.magenta('You\'re using the fantastic Kirby generator.'));
		
		var prompt = {
			name: 'whichFolder',
			message: 'In which folder would you like this Kirby project to be created? This can be changed later.',
			default: 'kirby'
		};
		
		// Prompt the user for the folder to set up Kirby in.
		this.prompt(prompt, function (props) {
			whichFolder = props.whichFolder;
			done();
		}.bind(this));
	},

	cloneKirby: function () {
		// Make sure this runs synchronously
		var done = this.async();
		
		// Clone the respository
		child = exec('git clone https://github.com/bastianallgeier/kirbycms.git ' + whichFolder,
			function (error) {
				if (error !== null) {
					console.log(error);
				}
				done();
			}.bind(this));
	},

	removeExtraneousFiles: function () {
		// Make sure this runs synchronously
		var done = this.async();
		
		// Remove unnecessary files
		child = exec('rm ./' + whichFolder + '/site/config/config.php ./' + whichFolder + '/content/site.txt',
			function (error) {
				if (error !== null) {
					console.log(error);
				}
				done();
			}.bind(this));
	},

	askFor: function () {
		// Make sure this runs synchronously
		var done = this.async();

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
		}, {
			type: 'confirm',
			name: 'kirbyPanel',
			message: 'Would you like the Kirby Panel to be set up?',
			default: true
		}, {
			type: 'confirm',
			name: 'kirbyBlog',
			message: 'Would you like a Kirby blog page to be set up?',
			default: true
		}];

		// Get the user's input on some important stuff
		this.prompt(prompts, function (props) {
			this.licenseKey = props.licenseKey;
			this.siteTitle = props.siteTitle;
			this.siteAuthor = props.siteAuthor;
			this.siteDescription = props.siteDescription;
			this.siteKeywords = props.siteKeywords;
			this.siteCopyright = props.siteCopyright;
			this.siteCredits = props.siteCredits;
			kirbyPanel = props.kirbyPanel;
			kirbyBlog = props.kirbyBlog;

			done();
		}.bind(this));
	},

	downloadPanel: function () {
		// Download the panel if the user says so
		if (kirbyPanel) {
			var done = this.async();

			child = exec('git clone https://github.com/bastianallgeier/kirbycms-panel.git ' + whichFolder + '/panel',
				function (error) {
					if (error !== null) {
						console.log(error);
					}
					done();
				}.bind(this));
		}
	},

	configurePanelFolder: function () {
		if (kirbyPanel) {
			var done = this.async();

			child = exec('mv ' + whichFolder + '/panel/defaults ' + whichFolder + '/site/panel/',
				function (error) {
					if (error !== null) {
						console.log(error);
					}
					done();
				}.bind(this));
		}
	},

	createPanelUser: function () {
		if (kirbyPanel) {
			var done = this.async();

			var prompts = [{
				name: 'username',
				message: 'What would you like your panel username to be?'
			}, {
				type: 'password',
				name: 'password',
				message: 'What would you like your password to be? You can only use these characters: a-z, 0-9, _, -'
			}, {
				type: 'list',
				name: 'encryption',
				message: 'How would you like your password to be encrypted?',
				choices: [{
					name: 'md5'
				}, {
					name: 'sha1'
				}],
				default: 'md5'
			}, {
				type: 'list',
				name: 'language',
				message: 'What language would you like the panel to be in?',
				choices: [{
					name: 'en'
				}, {
					name: 'de'
				}],
				default: 'en'
			}];

			child = exec('rm ' + whichFolder + '/site/panel/accounts/admin.php',
				function (error) {
					if (error !== null) {
						console.log(error);
					}

				});

			this.prompt(prompts, function (props) {
				this.username = props.username;
				// this.password = props.password;
				this.encryption = props.encryption;
				this.language = props.language;

				if (props.encryption === 'sha1') {
					this.password = CryptoJS.SHA1(props.password);
				} else if (props.encryption === 'md5') {
					this.password = CryptoJS.MD5(props.password);
				}

				var successMessage = 'Fantastic! The panel has been added to your project.' +
					'\nPlease visit ' + chalk.magenta('/panel') + ' in a browser once' +
					'\neverything else is set up to log in to your panel.';
				console.log(successMessage);

				done();
			}.bind(this));
		}
	},

	app: function () {
		// copy files with the proper fields filled in with user info
		this.template('_package.json', whichFolder + '/package.json');
		this.template('basic/config.php', whichFolder + '/site/config/config.php');
		this.template('basic/site.txt', whichFolder + '/content/site.txt');

		if (kirbyPanel) {
			this.template('panel/admin.php', whichFolder + '/site/panel/accounts/' + this.username + '.php');
		}

		if (kirbyBlog) {
			this.mkdir(whichFolder + '/content/04-blog');
			this.mkdir(whichFolder + '/content/04-blog/01-your-first-article');
			this.mkdir(whichFolder + '/content/04-blog/02-your-second-article');
			this.mkdir(whichFolder + '/content/04-blog/03-your-third-article');
			this.copy('blog/blog.txt', whichFolder + '/content/04-blog/blog.txt');
			this.copy('blog/blogarticle.txt', whichFolder + '/content/04-blog/01-your-first-article/blogarticle.txt');
			this.copy('blog/blogarticle.txt', whichFolder + '/content/04-blog/02-your-second-article/blogarticle.txt');
			this.copy('blog/blogarticle.txt', whichFolder + '/content/04-blog/03-your-third-article/blogarticle.txt');
			this.copy('blog/blogarticle.php', whichFolder + '/site/templates/blogarticle.php');
			this.copy('blog/blog.php', whichFolder + '/site/templates/blog.php');
		}

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
