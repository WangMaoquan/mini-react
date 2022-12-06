import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';

// 保存 packages 文件的路径
const packagesPath = path.resolve(__dirname, '../../packages');
// 打包后的地址
const distPath = path.resolve(__dirname, '../../dist/node_modules');

export const resolvePath = (pkgName, isDist = false) => {
	const path = isDist ? distPath : packagesPath;
	return `${path}/${pkgName}`;
};

export const getPackagesJson = (pkgName) => {
	// 找到对应模块下的 package.json
	const path = `${resolvePath(pkgName)}/package.json`;
	const pkgJsonStr = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(pkgJsonStr);
};

export function getBasePlugins({ typescript = {} } = {}) {
	return [cjs(), ts(typescript)];
}
