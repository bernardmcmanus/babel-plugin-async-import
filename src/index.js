import Template from '@babel/template';
import syntax from '@babel/plugin-syntax-dynamic-import';

export default (_, options) => {
	const opts = {
		template: undefined,
		browser: 'import(REQUEST)',
		node: 'Promise.resolve(require(REQUEST))',
		syntax: ['asyncGenerators', 'dynamicImport', 'objectRestSpread'],
		...options
	};

	const history = new WeakSet();
	const template = Template(
		opts.template || opts[process.env.BABEL_TARGET] || opts.node,
		{ plugins: opts.syntax }
	);

	return {
		inherits: syntax,
		visitor: {
			Import(path) {
				const targetPath = path.findParent(parentPath => parentPath.isCallExpression());
				const { arguments: args } = targetPath.node;
				if (args && args.length > 0 && !history.has(targetPath.node)) {
					const replacementNode = template({ REQUEST: args });
					targetPath.replaceWith(replacementNode);
					history.add(replacementNode.expression);
				}
			}
		}
	};
};
