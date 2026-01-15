import React, { useState, useEffect } from 'react';
import ConverterSettings from './components/ConverterSettingsCompact';
import PreviewAndConvert from './components/PreviewAndConvert';
import SvgInputEditor from './components/SvgInputEditor';
import ReactOutputEditor from './components/ReactOutputEditor';
import FullscreenCodeViewer from './components/FullscreenCodeViewer';
import { useAtomValue, useSetAtom } from 'jotai';
import { svgInputAtom, settingsAtom, reactOutputAtom } from './store/useConverterStore';
import { useSvgConversion } from './hooks/useSvgConversion';
import defaultSvgInput from './defaultSvg';

// 主应用组件
const SvgReactConverter: React.FC = () => {
  const svgInput = useAtomValue(svgInputAtom);
  const settings = useAtomValue(settingsAtom);
  const setSvgInput = useSetAtom(svgInputAtom);
  const setReactOutput = useSetAtom(reactOutputAtom);

  const { convertSvgToReact } = useSvgConversion(svgInput);

  // SVG 输入变化时自动转换
  useEffect(() => {
    if (svgInput.trim()) {
      convertSvgToReact().then(result => {
        if (result) {
          setReactOutput(result);
        }
      }).catch(error => {
        console.error('自动转换失败:', error);
        setReactOutput(`// 转换错误: ${error.message}`);
      });
    } else {
      setReactOutput('');
    }
  }, [svgInput, settings, convertSvgToReact, setReactOutput]);

  const [fullscreenViewer, setFullscreenViewer] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    language: 'xml' | 'jsx';
  }>({
    isOpen: false,
    title: '',
    content: '',
    language: 'xml'
  });

  // 初始化默认SVG内容
  React.useEffect(() => {
    if (!svgInput.trim()) {
      setSvgInput(defaultSvgInput);
    }
  }, []);

  // 打开全屏查看器
  const openFullscreenViewer = (title: string, content: string, language: 'xml' | 'jsx') => {
    setFullscreenViewer({
      isOpen: true,
      title,
      content,
      language
    });
  };

  return (
    <div className="w-full px-4 pb-4 pt-0" style={{ height: 'calc(100vh - var(--navigation-height, 60px))' }}>
      <div className="w-full h-full max-w-[1600px] mx-auto flex flex-col gap-4">
        {/* 三栏主体布局 */}
        <div className="grid grid-cols-1 xl:grid-cols-11 gap-3 h-full overflow-hidden">
          {/* 左侧：预览转换和设置面板 */}
          <div className="xl:col-span-3 h-full overflow-hidden flex flex-col">
            <div className="space-y-2 h-full flex flex-col overflow-y-auto">
              {/* 预览和转换组件 */}
              <PreviewAndConvert />

              {/* 转换设置面板 */}
              <ConverterSettings />
            </div>
          </div>

          {/* 中间：SVG输入编辑器 */}
          <div className="xl:col-span-4 h-full overflow-hidden">
            <SvgInputEditor onOpenFullscreen={openFullscreenViewer} />
          </div>

          {/* 右侧：React输出编辑器 */}
          <div className="xl:col-span-4 h-full overflow-hidden">
            <ReactOutputEditor onOpenFullscreen={openFullscreenViewer} />
          </div>
        </div>
      </div>

      {/* 全屏代码查看器 */}
      {fullscreenViewer.isOpen && (
        <FullscreenCodeViewer
          title={fullscreenViewer.title}
          content={fullscreenViewer.content}
          language={fullscreenViewer.language}
          onClose={() => setFullscreenViewer({ ...fullscreenViewer, isOpen: false })}
        />
      )}
    </div>
  );
};

export default SvgReactConverter;