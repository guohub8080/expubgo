import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shadcn/components/ui/card.tsx';
import { Button } from '@shadcn/components/ui/button.tsx';
import { Input } from '@shadcn/components/ui/input.tsx';
import { Label } from '@shadcn/components/ui/label.tsx';
import { Switch } from '@shadcn/components/ui/switch.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/components/ui/popover.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shadcn/components/ui/tabs.tsx';
import {
  Settings,
  X,
  HelpCircle
} from 'lucide-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { settingsAtom, updateSettingsAtom } from '../store/useConverterStore';

interface ConverterSettingsCompactProps {
  compact?: boolean;
}

// 帮助提示组件
const HelpTip: React.FC<{ content: string | React.ReactNode }> = ({ content }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 p-0.5 rounded-full">
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
    </PopoverTrigger>
    <PopoverContent
      className="text-xs max-w-sm p-0 shadow-lg border-0"
      side="bottom"
      align="end"
      sideOffset={8}
    >
      <div className="bg-gradient-to-br from-background to-muted/50 p-4 rounded-lg border">
        {content}
      </div>
    </PopoverContent>
  </Popover>
);

const ConverterSettingsCompact: React.FC<ConverterSettingsCompactProps> = ({ compact = false }) => {
  const settings = useAtomValue(settingsAtom);
  const updateSettings = useSetAtom(updateSettingsAtom);

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="pb-1 gap-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="w-4 h-4" />
            转换设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="componentName" className="text-sm">组件名称</Label>
                {!settings.componentName.trim() && (
                  <span className="text-xs text-muted-foreground">匿名模式</span>
                )}
              </div>
              <div className="relative">
                <Input
                  id="componentName"
                  type="text"
                  value={settings.componentName}
                  onChange={(e) => {
                    const newName = e.target.value;
                    updateSettings({ componentName: newName });
                  }}
                  placeholder="SvgComponent"
                  className="pr-8"
                />
                {settings.componentName.trim() && (
                  <button
                    type="button"
                    onClick={() => updateSettings({ componentName: '' })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* 函数形式 */}
            <div className="space-y-2">
              <Label className="text-sm">函数形式</Label>
              <Tabs
                value={settings.functionType}
                onValueChange={(value: 'arrow-implicit' | 'arrow-explicit' | 'function') => updateSettings({ functionType: value })}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-8 bg-muted">
                  <TabsTrigger value="arrow-implicit" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">() {'=>'} </TabsTrigger>
                  <TabsTrigger value="arrow-explicit" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">(){'=>'}{'{'}return{'}'}</TabsTrigger>
                  <TabsTrigger value="function" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">function</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 导出方式 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">导出方式</Label>
                {!settings.componentName.trim() && (
                  <span className="text-xs text-muted-foreground">仅默认导出</span>
                )}
              </div>
              <Tabs
                value={!settings.componentName.trim() ? 'default' : settings.exportType}
                onValueChange={(value: 'default' | 'named' | 'both') => updateSettings({ exportType: value })}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-8 bg-muted">
                  <TabsTrigger
                    value="default"
                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    disabled={!settings.componentName.trim()}
                  >默认</TabsTrigger>
                  <TabsTrigger
                    value="named"
                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    disabled={!settings.componentName.trim()}
                  >命名</TabsTrigger>
                  <TabsTrigger
                    value="both"
                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    disabled={!settings.componentName.trim()}
                  >两者</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 尺寸处理 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm">尺寸处理</Label>
                <HelpTip content={
                  <div className="space-y-2">
                    <div className="font-semibold text-foreground/90 border-b border-border pb-1">不保留</div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>• 移除width和height属性</div>
                      <div>• 组件大小由外部CSS控制</div>
                      <div>• 适合需要灵活调整大小的场景</div>
                    </div>

                    <div className="font-semibold text-foreground/90 border-b border-border pb-1 pt-1">原始</div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>• 保留SVG原始width和height属性</div>
                      <div>• 组件会继承原始尺寸</div>
                      <div>• 适合需要保持原始大小的图标</div>
                    </div>

                    <div className="font-semibold text-foreground/90 border-b border-border pb-1 pt-1">100%</div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>• 设置width和height为100%</div>
                      <div>• 组件会填满父容器</div>
                      <div>• 适合需要完全填充的场景</div>
                    </div>
                  </div>
                } />
              </div>
              <Tabs
                value={settings.widthHeightHandling}
                onValueChange={(value: 'preserve' | 'remove' | '100percent') => updateSettings({ widthHeightHandling: value })}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-8 bg-muted">
                  <TabsTrigger value="remove" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">不保留</TabsTrigger>
                  <TabsTrigger value="preserve" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">原始</TabsTrigger>
                  <TabsTrigger value="100percent" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">100%</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="removeIds"
                checked={settings.removeIds}
                onCheckedChange={(checked: boolean) => updateSettings({ removeIds: checked })}
              />
              <Label htmlFor="removeIds" className="text-sm">去除ID</Label>
            </div>

            {/* Class展平 */}
            <div className="flex items-center space-x-2">
              <Switch
                id="flattenStyles"
                checked={settings.flattenStyles}
                onCheckedChange={(checked: boolean) => updateSettings({ flattenStyles: checked })}
              />
              <Label htmlFor="flattenStyles" className="text-sm">Class展平</Label>
              <HelpTip content={
                <div className="space-y-2">
                  <div className="font-semibold text-foreground/90 border-b border-border pb-1">开启</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>• 将style标签内的CSS展平到行内style</div>
                    <div>• 合并已有style属性</div>
                    <div>• 移除class和style标签</div>
                  </div>

                  <div className="font-semibold text-foreground/90 border-b border-border pb-1 pt-1">关闭</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>• 保持原始class和style标签</div>
                    <div>• 不做任何展平处理</div>
                  </div>
                </div>
              } />
            </div>

            {/* Style转Object */}
            <div className="flex items-center space-x-2">
              <Switch
                id="convertStyleToObject"
                checked={settings.convertStyleToObject}
                onCheckedChange={(checked: boolean) => updateSettings({ convertStyleToObject: checked })}
              />
              <Label htmlFor="convertStyleToObject" className="text-sm">Style转Object</Label>
              <HelpTip content={
                <div className="space-y-2">
                  <div className="font-semibold text-foreground/90 border-b border-border pb-1">开启</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>• 将style属性转为React对象格式</div>
                    <div>• CSS属性名转为驼峰命名</div>
                    <div>• 生成style={'{'} key: value {'}'}格式</div>
                  </div>

                  <div className="font-semibold text-foreground/90 border-b border-border pb-1 pt-1">关闭</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>• 保持原始style字符串格式</div>
                    <div>• 保留CSS属性名和值</div>
                  </div>
                </div>
              } />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConverterSettingsCompact;
