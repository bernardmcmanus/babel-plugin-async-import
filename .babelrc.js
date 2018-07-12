module.exports = {
	presets: [
		['@babel/env', {
			targets: {
				node: 6
			},
			useBuiltIns: 'usage'
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
