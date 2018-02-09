import Template from 'babel-template';
import syntax from 'babel-plugin-syntax-dynamic-import';
import * as t from 'babel-types';

const template = Template('(() => CONDITION ? AFFIRMATIVE : NEGATIVE)()');

/**
 * (['a']) => a
 * (['a', 'b']) => a.b
 * (['a', 'b', 'c']) => a.b.c
 */
function membersToExpression(members) {
	return members.length === 1
		? t.Identifier(members[0])
		: t.MemberExpression(
			membersToExpression(members.slice(0, -1)),
			t.Identifier(...members.slice(-1))
		)
}

/**
 * (['a'], arg) => a(arg)
 * (['a', 'b', 'c'], arg) => a.b.c(arg)
 * (['a'], [undefined, ...args]) => a.apply(undefined, args)
 * (['a', 'b', 'c'], [undefined, ...args]) => a.b.c.apply(a.b, args)
 */
function maybeApply(members, args) {
	return args.length === 1
		? [membersToExpression(members), args]
		: [
				membersToExpression([...members, 'apply']),
				[
					membersToExpression((members.length === 1 ? ['undefined'] : members.slice(0, -1))),
					...args.slice(1)
				]
		];
}

export default () => ({
	inherits: syntax,
	visitor: {
		Import(path) {
			const targetPath = path.findParent(parentPath => parentPath.isCallExpression());
			if (targetPath) {
				const { arguments: args } = targetPath.node;
				if (args && args.length > 0) {
					targetPath.replaceWith(
						template({
							CONDITION: membersToExpression(['process', 'browser']),
							AFFIRMATIVE: t.ExpressionStatement(
								t.CallExpression(
									...maybeApply(['System', 'import'], args)
								)
							),
							NEGATIVE: t.ExpressionStatement(
								t.CallExpression(membersToExpression(['Promise', 'resolve']), [
									t.CallExpression(
										...maybeApply(['require'], args)
									)
								])
							)
						})
					);
				}
			}
		}
	}
});
