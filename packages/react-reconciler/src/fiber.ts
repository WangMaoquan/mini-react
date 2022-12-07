import { WorkTag } from './workTags';
import { Key, Props, Ref } from 'shared/ReactTypes';

export class FiberNode {
	// fiber 的类型
	tag: WorkTag;
	// 接下来需要被改变的props
	pendingProps: Props;
	// key
	key: Key;
	// 组件类型
	type: any;
	// 对应的真实DOM
	stateNode: any;
	ref: Ref | null;

	// 指向父级fiber
	return: FiberNode | null;
	// 下一个兄弟fiber
	sibling: FiberNode | null;
	// 子fiber
	child: FiberNode | null;
	// 同级fiber 的下标
	index: number;

	// 最后确定props
	memoizedProps: Props | null;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例基本属性
		this.tag = tag;
		this.key = key;
		this.type = null;
		this.stateNode = null;

		// 构成树状结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
	}
}
