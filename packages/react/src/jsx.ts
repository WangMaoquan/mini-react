import { ElementType } from './../../shared/ReactTypes';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { Key, Props, ReactElemet, Ref, Type } from 'shared/ReactTypes';
/**
 *
 * @param type 组件的type
 * @param key 组件的key
 * @param ref 组件的ref
 * @param props 组件的props
 */
export function ReactElement(
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElemet {
	return {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'decade'
	};
}

export const jsx = (
	type: ElementType,
	config: any,
	...maybeChildren: any[]
) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	/**
	 * config 中我们需要特殊处理 key / ref
	 */
	for (const prop in config) {
		const val = config[prop];
		if (key === 'key') {
			if (val !== undefined) {
				key = val + '';
			}
			continue;
		}
		if (key === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}

		if ({}.hasOwnProperty.call(config, key)) {
			props[key] = val;
		}
	}
	// 处理children
	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}
	return ReactElement(type, key, ref, props);
};

export const jsxDev = jsx;
