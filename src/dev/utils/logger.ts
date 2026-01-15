/**
 * 本地 Logger
 * 用于本地控制台日志管理
 */

import { addLog, getLogs, getFormattedLogs, clearLogs } from '@dev/store/useConsoleLogStore';

class Logger {
  /**
   * 初始化（空实现）
   */
  init() {
    // 本地存储无需初始化
  }

  /**
   * 捕获异常（仅记录到本地）
   */
  captureException(error: Error, context?: Record<string, unknown>) {
    addLog({
      message: `[Exception] ${error.name}: ${error.message}`,
      level: 'error',
      timestamp: Date.now(),
      url: window.location.href,
    });
  }

  /**
   * 获取本地日志
   */
  getLogs() {
    return getLogs();
  }

  /**
   * 获取格式化的本地日志
   */
  getFormattedLogs() {
    return getFormattedLogs();
  }

  /**
   * 清空本地日志
   */
  clearLogs() {
    clearLogs();
  }
}

// 导出单例
export const logger = new Logger();
