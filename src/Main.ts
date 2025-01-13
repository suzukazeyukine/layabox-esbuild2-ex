import chalk from 'chalk';
import { version } from 'esbuild';
import { openUrl } from './_T/openUrl';
import TestMain from './_test/TestMain';
import { getVar } from './config/getVar';
import IConfig from './config/IConfig';
import MainConfig from './config/MainConfig';
import PackageConfig from './config/PackageConfig';
import BinProxy from './dirProxy/bin';
import SrcProxy from './dirProxy/src';
import HttpTool from './http/HttpTool';

/**
 * layaboxEsbuild构建实例
 */
export default class layaboxEsbuild {
  /**
   * 开始构建
   */
  static async start(config: IConfig) {
    MainConfig.config = config;
    //代理src
    let strProxyPort = await SrcProxy.start(config.esbuild);
    //代理bin
    let binProxyPort = await BinProxy.start(strProxyPort, config.port);
    //提示bin目录的主页地址
    console.log(
      chalk.gray(
        `${PackageConfig.package.name}@${PackageConfig.package.version} 快捷命令:leb`,
      ),
    );
    console.log(
      chalk.magenta('本地主页:'),
      chalk.blue(HttpTool.getPath('local', binProxyPort)),
      chalk.green('推荐⚡'),
    );
    console.log(
      chalk.magenta('局域网主页:'),
      chalk.blue(HttpTool.getPath('localNetwork', binProxyPort)),
    );
    console.log(chalk.gray(`esbuild@${version}`));
    console.log(chalk.gray('执行 leb -h 查看帮助或解决bug'));
    await getVar().then((res) => {
      if (res.msgs && res.msgs.length > 0) {
        res.msgs.forEach(({ msg, color }) => {
          console.log(chalk[color || 'gray'](msg));
        });
      }
    });
    console.log(chalk.gray('...'));
    //打开本地主页
    MainConfig.config.ifOpenHome && openUrl(HttpTool.getPath('local', binProxyPort));
    //测试
    TestMain.start();
  }
}
