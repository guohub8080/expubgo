import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/components/ui/card.tsx';
import { Label } from '@shadcn/components/ui/label.tsx';
import { Switch } from '@shadcn/components/ui/switch.tsx';
import { Button } from '@shadcn/components/ui/button.tsx';
import { Input } from '@shadcn/components/ui/input.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shadcn/components/ui/dialog.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shadcn/components/ui/select.tsx';
import { Settings, Plus, X, Settings2 } from 'lucide-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { settingsAtom, updateSettingsAtom, type PropDetailConfig, type PropsAccessType } from '../store/useConverterStore';

const PropsSettings: React.FC = () => {
  const settings = useAtomValue(settingsAtom);
  const updateSettings = useSetAtom(updateSettingsAtom);

  const [localConfigs, setLocalConfigs] = useState<Record<string, PropDetailConfig>>({});
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // 新属性表单状态
  const [newPropName, setNewPropName] = useState<string>('');
  const [newPropType, setNewPropType] = useState<PropDetailConfig['type']>('string');
  const [newPropRequired, setNewPropRequired] = useState<boolean>(false);
  const [newPropDefault, setNewPropDefault] = useState<string>('');

  // 编辑模式
  const [editingProp, setEditingProp] = useState<string | null>(null);
  const [editPropType, setEditPropType] = useState<PropDetailConfig['type']>('string');
  const [editPropRequired, setEditPropRequired] = useState<boolean>(false);
  const [editPropDefault, setEditPropDefault] = useState<string>('');

  // 获取所有已配置的属性
  const getActiveProps = () => {
    const props: Array<{ name: string; isPreset: boolean }> = [];
    // 只显示已配置的属性，不分预设和自定义
    Object.keys(settings.propsDetailConfig || {}).forEach(name => {
      const isPreset = ['color', 'size', 'className'].includes(name);
      props.push({ name, isPreset });
    });
    return props;
  };

  const activeProps = getActiveProps();

  // 生成 TypeScript 对象格式的配置显示
  const generateTypeDisplay = () => {
    const config = settings.propsDetailConfig || {};
    const entries = Object.entries(config);

    if (entries.length === 0) {
      return '{}';
    }

    // 三列格式：属性名 | 类型 | 默认值
    const lines = entries.map(([name, propConfig]) => {
      const optional = !propConfig.required ? '?' : '';
      let defaultStr = '';
      if (propConfig.defaultValue) {
        // string 类型自动加引号
        if (propConfig.type === 'string' && !propConfig.defaultValue.startsWith('"') && !propConfig.defaultValue.startsWith("'")) {
          defaultStr = ` = "${propConfig.defaultValue}"`;
        } else {
          defaultStr = ` = ${propConfig.defaultValue}`;
        }
      }
      return `  ${name}${optional}: ${propConfig.type}${defaultStr}`;
    });

    return '{\n' + lines.join('\n') + '\n}';
  };

  // 打开对话框时，初始化本地配置
  const handleDialogOpen = (open: boolean) => {
    setDialogOpen(open);
    if (open) {
      // 复制当前配置到本地状态
      setLocalConfigs({ ...(settings.propsDetailConfig || {}) });
      setEditingProp(null);
    }
  };

  // 添加新属性
  const handleAddProp = () => {
    const trimmed = newPropName.trim();
    if (!trimmed) return;
    if (localConfigs[trimmed]) return;

    const newConfig: PropDetailConfig = {
      type: newPropType,
      required: newPropRequired,
      access: 'destruct' // 默认解构模式
    };

    // 有默认值时添加
    if (newPropDefault.trim()) {
      newConfig.defaultValue = newPropDefault.trim();
    }

    const newConfigs = {
      ...localConfigs,
      [trimmed]: newConfig
    };

    setLocalConfigs(newConfigs);
    updateSettings({ propsDetailConfig: newConfigs });

    // 重置表单
    setNewPropName('');
    setNewPropType('string');
    setNewPropRequired(false);
    setNewPropDefault('');
  };

  // 开始编辑属性
  const handleStartEdit = (name: string) => {
    const config = localConfigs[name];
    if (!config) return;

    setEditingProp(name);
    setEditPropType(config.type);
    setEditPropRequired(config.required || false);
    setEditPropDefault(config.defaultValue || '');
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editingProp) return;

    const newConfig: PropDetailConfig = {
      ...localConfigs[editingProp],
      type: editPropType,
      required: editPropRequired
    };

    // 更新默认值
    if (editPropDefault.trim()) {
      newConfig.defaultValue = editPropDefault.trim();
    } else {
      delete newConfig.defaultValue;
    }

    const newConfigs = {
      ...localConfigs,
      [editingProp]: newConfig
    };

    setLocalConfigs(newConfigs);
    updateSettings({ propsDetailConfig: newConfigs });
    setEditingProp(null);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingProp(null);
  };

  // 删除属性
  const handleRemoveProp = (prop: string) => {
    const newConfigs = { ...localConfigs };
    delete newConfigs[prop];
    setLocalConfigs(newConfigs);
    updateSettings({ propsDetailConfig: newConfigs });
  };

  // 清除所有属性配置
  const handleClearAll = () => {
    setLocalConfigs({});
    updateSettings({ propsDetailConfig: {} });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="w-3.5 h-3.5" />
          {settings.needsProps ? 'Props 配置' : '无 Props'}
        </CardTitle>
        <Switch
          checked={settings.needsProps}
          onCheckedChange={(checked: boolean) => updateSettings({ needsProps: checked })}
        />
      </CardHeader>

      {/* Props 配置卡片 - 点击打开详细配置 */}
      {settings.needsProps && (
        <CardContent className="space-y-3">
          {/* 属性配置卡片 - 第一个 */}
          <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-full text-left">
                <Card className="cursor-pointer hover:border-primary/50 transition-colors my-0 space-y-3 !py-3">
                  <CardContent className="py-0 px-3">
                    <div className="flex items-start gap-2">
                      <Settings2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium mb-1">属性配置</div>
                        <pre className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 overflow-x-auto whitespace-pre font-mono leading-tight">
                          {generateTypeDisplay()}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Props 属性配置</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* 添加新属性表单 */}
                <div className="space-y-2 p-3 border rounded-md bg-muted/30">
                  <Label className="text-sm font-medium">添加新属性</Label>

                  {/* 属性名 */}
                  <Input
                    placeholder="属性名（如 color、size、title）"
                    value={newPropName}
                    onChange={(e) => setNewPropName(e.target.value)}
                    className="h-8 text-sm"
                  />

                  {/* 类型和可空 */}
                  <div className="flex gap-2">
                    <Select value={newPropType} onValueChange={(v) => setNewPropType(v as PropDetailConfig['type'])}>
                      <SelectTrigger className="h-8 text-sm flex-1">
                        <SelectValue placeholder="类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">string</SelectItem>
                        <SelectItem value="number">number</SelectItem>
                        <SelectItem value="boolean">boolean</SelectItem>
                        <SelectItem value="React.ReactNode">React.ReactNode</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 px-3">
                      <Switch
                        checked={newPropRequired}
                        onCheckedChange={setNewPropRequired}
                      />
                      <Label className="text-xs cursor-pointer">必填</Label>
                    </div>
                  </div>

                  {/* 默认值 */}
                  <Input
                    placeholder="默认值（如 'red'、24 等，可选）"
                    value={newPropDefault}
                    onChange={(e) => setNewPropDefault(e.target.value)}
                    className="h-8 text-sm"
                  />

                  {/* 添加按钮 */}
                  <Button
                    size="sm"
                    onClick={handleAddProp}
                    disabled={!newPropName.trim()}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加属性
                  </Button>
                </div>

                {/* 已配置属性列表 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">已配置属性</Label>
                    <span className="text-xs text-muted-foreground">{Object.keys(localConfigs).length} 个</span>
                  </div>

                  {Object.keys(localConfigs).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
                      暂无属性配置
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(localConfigs).map(([name, config]) => {
                        const isEditing = editingProp === name;

                        return (
                          <div key={name} className="border rounded-md overflow-hidden">
                            {/* 查看模式 */}
                            {!isEditing && (
                              <div className="flex items-center justify-between p-2">
                                <div className="flex-1 min-w-0" onClick={() => handleStartEdit(name)} style={{ cursor: 'pointer' }}>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{name}</span>
                                    <span className="text-muted-foreground">:</span>
                                    <span className="text-muted-foreground">{config.type}</span>
                                    {!config.required && (
                                      <span className="text-xs text-muted-foreground">(可空)</span>
                                    )}
                                  </div>
                                  {config.defaultValue && (
                                    <div className="text-xs text-muted-foreground">
                                      默认: {config.defaultValue}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStartEdit(name)}
                                    className="h-7 px-2 text-xs"
                                  >
                                    编辑
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveProp(name)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* 编辑模式 */}
                            {isEditing && (
                              <div className="p-2 space-y-2 bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{name}</span>
                                </div>

                                {/* 类型选择 */}
                                <Select value={editPropType} onValueChange={(v) => setEditPropType(v as PropDetailConfig['type'])}>
                                  <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="string">string</SelectItem>
                                    <SelectItem value="number">number</SelectItem>
                                    <SelectItem value="boolean">boolean</SelectItem>
                                    <SelectItem value="React.ReactNode">React.ReactNode</SelectItem>
                                  </SelectContent>
                                </Select>

                                {/* 必填开关 */}
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={editPropRequired}
                                    onCheckedChange={setEditPropRequired}
                                  />
                                  <Label className="text-xs cursor-pointer">必填</Label>
                                </div>

                                {/* 默认值 */}
                                <Input
                                  placeholder="默认值（可选）"
                                  value={editPropDefault}
                                  onChange={(e) => setEditPropDefault(e.target.value)}
                                  className="h-8 text-sm"
                                />

                                {/* 保存/取消按钮 */}
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={handleSaveEdit} className="flex-1">
                                    保存
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={handleCancelEdit} className="flex-1">
                                    取消
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 底部按钮 */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button onClick={handleClearAll} variant="outline" className="flex-1">
                    清空全部
                  </Button>
                  <Button onClick={() => setDialogOpen(false)} className="flex-1">
                    关闭
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* 只标注类型开关 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="propsAccessMode" className="text-sm">只标注类型</Label>
            <Switch
              id="propsAccessMode"
              checked={settings.propsAccessMode === 'direct'}
              onCheckedChange={(checked: boolean) => updateSettings({ propsAccessMode: checked ? 'direct' : 'destruct' })}
            />
          </div>

          {/* 类型定义方式 - 只在"只标注类型"开启时显示 */}
          {settings.propsAccessMode === 'direct' && (
            <div className="flex gap-2">
              <Button
                variant={settings.directPropsTypeDefinition === 'interface' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ directPropsTypeDefinition: 'interface' })}
                className="flex-1 h-7 text-xs"
              >
                Interface
              </Button>
              <Button
                variant={settings.directPropsTypeDefinition === 'inline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ directPropsTypeDefinition: 'inline' })}
                className="flex-1 h-7 text-xs"
              >
                行内
              </Button>
            </div>
          )}

          {/* 展开剩余 props */}
          <div className="flex items-center justify-between">
            <Label htmlFor="enableRestSpread" className="text-sm">展开剩余 props (...rest)</Label>
            <Switch
              id="enableRestSpread"
              checked={settings.enableRestSpread}
              onCheckedChange={(checked: boolean) => updateSettings({ enableRestSpread: checked })}
            />
          </div>

          {settings.enableRestSpread && (
            <div className="flex gap-2">
              <Button
                variant={settings.restSpreadOrder === 'last' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ restSpreadOrder: 'last' })}
                className="flex-1 h-7 text-xs"
              >
                最后
              </Button>
              <Button
                variant={settings.restSpreadOrder === 'first' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ restSpreadOrder: 'first' })}
                className="flex-1 h-7 text-xs"
              >
                最前
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default PropsSettings;
