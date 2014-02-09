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
				this.npmInstall();
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
			message: 'Site description:'
		}, {
			name: 'siteKeywords',
			message: 'Site keywords:'
		}, {
			name: 'siteCopyright',
			message: 'Copyright message'
		}, {
			name: 'siteCredits',
			message: 'Site credits:'
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
		this.mkdir('app');
		this.mkdir('app/templates');

		this.copy('_package.json', 'package.json');
		this.copy('_bower.json', 'bower.json');
	},

	projectfiles: function() {
		this.copy('editorconfig', '.editorconfig');
		this.copy('jshintrc', '.jshintrc');
	}
});

module.exports = KirbyGenerator;