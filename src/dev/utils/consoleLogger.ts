/**
 * 全局控制台日志捕获器
 * 从应用启动就开始记录所有控制台输出
 * 使用 Jotai atom 存储日志
 */

import { addLog } from '@dev/store/useConsoleLogStore';
import type { ConsoleLogEntry } from '@dev/store/useConsoleLogStore';

class ConsoleLogger {
  private originalConsole: {
    log: typeof console.log;
    info: typeof console.info;
    warn: typeof console.warn;
    error: typeof console.error;
    debug: typeof console.debug;
  };

  constructor() {
    // 保存原始的 console 方法
    this.originalConsole = {
      log: console.log.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: console.debug.bind(console),
    };

    // 开始拦截
    this.intercept();
  }

  private intercept() {
    // 检查参数中是否包含堆栈跟踪
    const argHasStackTrace = (args: unknown[]): boolean => {
      return args.some(arg =>
        arg instanceof Error ||
        (typeof arg === 'string' && (arg.includes('Error:') || arg.includes('at ')))
      );
    };

    // 通用的拦截函数
    const createIntercept = (
      originalFn: typeof console.log,
      level: ConsoleLogEntry['level']
    ) => {
      return function(...args: unknown[]) {
        // 调用原始方法
        originalFn.apply(console, args);

        // 格式化消息
        const message = args.map(arg => {
          if (arg instanceof Error) {
            return arg.stack || arg.message;
          }
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');

        // 尝试解析错误位置（仅对 error）
        let url = window.location.href;
        let line: number | undefined;
        let column: number | undefined;

        if (level === 'error' && argHasStackTrace(args)) {
          const stackMatch = message.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
          if (stackMatch) {
            [, , url, line, column] = stackMatch;
            line = parseInt(line);
            column = parseInt(column);
          }
        }

        // 添加到 store
        addLog({
          message,
          level,
          timestamp: Date.now(),
          url,
          line,
          column,
        });
      };
    };

    // 拦截所有 console 方法
    console.log = createIntercept(this.originalConsole.log, 'log');
    console.info = createIntercept(this.originalConsole.info, 'info');
    console.warn = createIntercept(this.originalConsole.warn, 'warn');
    console.error = createIntercept(this.originalConsole.error, 'error');
    console.debug = createIntercept(this.originalConsole.debug, 'debug');
  }

  /**
   * 恢复原始 console 方法
   */
  restore() {
    console.log = this.originalConsole.log;
    console.info = this.originalConsole.info;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    console.debug = this.originalConsole.debug;
  }
}

// 创建全局单例
export const globalConsoleLogger = new ConsoleLogger();

// 同时挂载到 window 对象，方便其他地方访问
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__consoleLogger = globalConsoleLogger;
}

// 导出类型
export type { ConsoleLogEntry };

