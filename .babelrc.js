module.exports = {
	presets: [
		['@babel/env', {
			targets: {
				node: 4
			},
			useBuiltins: 'usage'
		}]
	],
	plugins: [
		[
			'@babel/proposal-object-rest-spread',
			{
				useBuiltIns: true
			}
		]
	]
};
