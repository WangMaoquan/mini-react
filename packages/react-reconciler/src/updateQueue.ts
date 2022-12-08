import { Action } from 'shared/ReactTypes';

// 代表数据更新的数据结构 Update
export interface Update<State> {
	/**
	 * 可以理解为 setState(1) | setState((pr) => 2)
	 * 这个是action 就是1 或者 (pr) => 2
	 */
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		// 消费 Update 的字段
		pendding: Update<State> | null;
	};
}

/**
 * 创建update 的方法
 * @param action
 * @returns
 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

/**
 * 创建UpdateQueue方法
 * @returns
 */
export const createUpdateQueue = <State>(): UpdateQueue<State> => {
	return {
		shared: {
			pendding: null
		}
	};
};

/**
 * 将update 插入到 updateQueue的方法
 * @param updateQueue
 * @param update
 */
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pendding = update;
};

/**
 * 消费update的方法
 * @param baseState
 * @param pendingUpdate
 * @returns
 */
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// (preState) =>  newState
			result.memoizedState = action(baseState);
		} else {
			// newState
			result.memoizedState = action;
		}
	}
	return result;
};
