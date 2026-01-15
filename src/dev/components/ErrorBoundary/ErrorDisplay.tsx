// 错误显示 UI 组件（函数组件）
import React, { useState } from 'react';
import { defaultTo } from 'es-toolkit/compat';
import { Button } from '../../shadcn/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/components/ui/card.tsx';
import { Badge } from '../../shadcn/components/ui/badge.tsx';
import { Copy, Check, RefreshCw, FileText, Terminal, Monitor, Cpu, Globe, Zap, Smartphone, Link } from 'lucide-react';
import {
  extractFunctionName,
  getDeviceType,
  getOSInfo,
  getBrowserInfo,
  getPlatformInfo,
  getMobileInfo,
} from './utils.ts';

interface ErrorDisplayProps {
  error: {
    name: string;
    message: string;
    stack?: string;
    componentStack?: string;
    source?: string;
    line?: number;
    column?: number;
    consoleErrors?: unknown[];
    eventId?: string;
  };
  errorTitle?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, errorTitle }) => {
  const [copiedError, setCopiedError] = useState(false);
  const [copiedConsole, setCopiedConsole] = useState(false);
  const consoleLogs = (error.consoleErrors || []);

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const handleCopyError = async () => {
    // 复制完整的 Markdown 格式错误报告
    let report = '# 错误报告\n\n';

    // 基本信息
    report += '## 错误信息\n\n';
    report += `**错误类型:** ${error.name || 'Error'}\n\n`;
    report += `**错误消息:** ${error.message || '未知错误'}\n\n`;
    if (error.source) {
      report += `**触发位置:** ${error.source}\n\n`;
    }
    if (error.line) {
      report += `**行号:** ${error.line}\n\n`;
    }
    if (error.column) {
      report += `**列号:** ${error.column || 0}\n\n`;
    }
    const functionName = extractFunctionName(error.stack || '');
    if (functionName) {
      report += `**触发函数:** ${functionName}\n\n`;
    }

    // 错误堆栈
    if (error.stack) {
      report += '## 错误堆栈\n\n';
      report += '```\n' + error.stack + '\n```\n\n';
    }

    // 控制台日志
    if (consoleLogs.length > 0) {
      report += `## 控制台日志 (${consoleLogs.length} 条)\n\n`;
      consoleLogs.forEach((log: { timestamp: number; level?: string; message: string }) => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        const level = log.level?.toUpperCase() || 'LOG';
        const levelEmoji = {
          'ERROR': '❌',
          'WARN': '⚠️',
          'INFO': 'ℹ️',
          'LOG': '📝',
          'DEBUG': '🔍'
        }[level] || '📝';
        report += `- ${levelEmoji} **[${level}]** [${timestamp}] ${log.message}\n`;
      });
      report += '\n';
    }

    // 环境信息
    report += '## 环境信息\n\n';
    report += `**设备类型:** ${getDeviceType()}\n\n`;
    report += `**操作系统:** ${getOSInfo()}\n\n`;
    report += `**浏览器:** ${getBrowserInfo()}\n\n`;
    report += `**平台:** ${getPlatformInfo()}\n\n`;
    const mobileInfo = getMobileInfo();
    if (mobileInfo) {
      report += `**设备型号:** ${mobileInfo}\n\n`;
    }
    report += `**当前 URL:** ${window.location.href}\n\n`;
    report += `**User Agent:** \`${navigator.userAgent}\`\n\n`;

    try {
      await navigator.clipboard.writeText(report);
      setCopiedError(true);
      setTimeout(() => setCopiedError(false), 1000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleCopyConsole = async () => {
    // 获取所有控制台日志
    const logsCount = consoleLogs.length;

    const logsText = consoleLogs.map((log: { timestamp: number; level?: string; message: string }) => {
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      const level = log.level?.toUpperCase() || 'LOG';
      return `[${timestamp}] [${level}] ${log.message}`;
    }).join('\n');

    const header = `=== 控制台日志 (共 ${logsCount} 条) ===\n\n`;
    const fullText = logsText ? header + logsText : '暂无控制台日志';

    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedConsole(true);
      setTimeout(() => setCopiedConsole(false), 1000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="mx-auto max-w-4xl">
        {/* 错误标题区域 */}
        <div className="mb-6 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-destructive">
              {defaultTo(errorTitle, "内容渲染出错")}
            </h2>
          </div>

          {/* 快速操作按钮 */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              onClick={handleCopyError}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              {copiedError ? (
                <>
                  <Check className="h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  复制错误信息
                </>
              )}
            </Button>
            <Button
              onClick={handleCopyConsole}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              {copiedConsole ? (
                <>
                  <Check className="h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Terminal className="h-4 w-4" />
                  复制控制台
                </>
              )}
            </Button>
            <Button
              onClick={handleRefreshPage}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              刷新页面
            </Button>
          </div>
        </div>

        {/* 错误信息卡片 */}
        <div className="space-y-3">
          {/* 错误基本信息 */}
          <Card>
            <CardContent className="space-y-3">
              <div>
                <Badge variant="destructive" className="mb-2 text-sm px-2 py-0.5">
                  {error.name || 'Error'}
                </Badge>
                <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-3">
                  <p className="text-sm text-foreground font-medium">
                    {error.message || '未知错误'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {error.source && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">触发位置:</span>
                    <span className="text-muted-foreground break-all">
                      {error.source}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-20">触发函数:</span>
                  <span className="text-muted-foreground">
                    {extractFunctionName(error.stack || '')}
                  </span>
                </div>

                {error.line && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">行列数:</span>
                    <span className="text-muted-foreground">
                      行 {error.line}, 列 {error.column || 0}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 控制台日志 */}
          {consoleLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  控制台日志 ({consoleLogs.length} 条)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <pre className="max-h-96 overflow-auto bg-muted p-4 text-xs leading-relaxed rounded-md mt-0 -mb-3 font-mono">
                  {consoleLogs.map((log: { timestamp: number; level?: string; message: string }, index: number) => {
                    const timestamp = new Date(log.timestamp).toLocaleTimeString();
                    const level = log.level?.toUpperCase() || 'LOG';
                    const levelColor = {
                      'ERROR': 'text-red-500',
                      'WARN': 'text-yellow-500',
                      'INFO': 'text-blue-500',
                      'LOG': 'text-gray-400',
                      'DEBUG': 'text-gray-500'
                    }[level] || 'text-gray-400';

                    return (
                      <div key={index} className="mb-1 last:mb-0">
                        <span className="text-gray-500">[{timestamp}]</span>
                        <span className={`${levelColor} font-semibold ml-1`}>[{level}]</span>
                        <span className="ml-2">{log.message}</span>
                      </div>
                    );
                  })}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* 错误堆栈 */}
          {error.stack && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  错误堆栈
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <pre className="max-h-96 overflow-auto bg-muted p-4 text-xs leading-relaxed rounded-md mt-0 -mb-3">
                  {error.stack}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* 环境设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                环境信息
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">设备类型</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-6">{getDeviceType()}</div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">操作系统</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-6">{getOSInfo()}</div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">浏览器</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-6">{getBrowserInfo()}</div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">平台</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-6">{getPlatformInfo()}</div>
                </div>

                {getMobileInfo() && (
                  <div className="p-3 rounded-lg bg-muted/50 sm:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">设备型号</span>
                    </div>
                    <div className="text-xs text-muted-foreground pl-6">{getMobileInfo()}</div>
                  </div>
                )}

                <div className="sm:col-span-2 space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Link className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">当前 URL</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground break-all pl-6">{window.location.href}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">User Agent</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground break-all pl-6">{navigator.userAgent}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

