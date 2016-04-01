module.exports = function(grunt) {

	grunt.initConfig({
		clean: ['dist'],
		copy: {
			dist: {
				files: [{
					expand: true,
					src: ['index.html','jsmain.js','cssmain.css', 'kgplogo.jpg','metakgp.jpg','tsa.png','pgcg.jpg','ugcg.jpg', 'cgsurvey.jpg', 'trust.jpg', 'hurdle.jpg', 'strength.jpg', 'comsurvey.jpg', 'dayexp.jpg','work.jpg','trust2.jpg'],
					dest: 'dist/'
				}]
			}
		},
				
		'gh-pages': {
			options: {
				base: 'dist'
			},
			src: ['**']
		}
	});

    grunt.registerTask('build', ['clean', 'copy:dist']);

	require('load-grunt-tasks')(grunt);
};
