import Template from 'babel-template';
import syntax from 'babel-plugin-syntax-dynamic-import';
import * as t from 'babel-types';

const template = Template(`
	(() => (
		CONDITION
			? ASYNC_IMPORT
			: Promise.resolve(require(ARGS))
	))()
`);

export default () => ({
	inherits: syntax,
	visitor: {
		Import(path) {
			const { arguments: args } = path.parentPath.node;
			path.parentPath.replaceWith(
				template({
					CONDITION: (
						t.memberExpression(
							t.identifier('process'),
							t.identifier('browser')
						)
					),
					ASYNC_IMPORT: t.expressionStatement(
						t.callExpression(
							t.memberExpression(
								t.identifier('System'),
								t.identifier('import')
							),
							args
						)
					),
					ARGS: args
				})
			);
		}
	}
});