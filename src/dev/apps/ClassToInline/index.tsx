import React, { useState } from 'react';
import HtmlInputCard from './components/HtmlInputCard';
import CssInputCard from './components/CssInputCard';
import ResultOutputCard from './components/ResultOutputCard';
import PreviewCard from './components/PreviewCard';
import FullscreenCodeViewer from '@apps/SvgReactConverter/components/FullscreenCodeViewer';
import FullscreenPreview from './components/FullscreenPreview';
import { useClassToInlineStore } from './store/useClassToInlineStore';

const ClassToInline: React.FC = () => {
  const { htmlInput, cssInput } = useClassToInlineStore();

  const [codeViewer, setCodeViewer] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    language: 'xml' | 'jsx';
  }>({
    isOpen: false,
    title: '',
    content: '',
    language: 'jsx'
  });

  const [previewFullscreen, setPreviewFullscreen] = useState(false);

  // TODO: 等待用户实现转换逻辑
  const handleConvert = () => {
    console.log('handleConvert called, but conversion logic is not implemented yet');
    // 转换逻辑将由用户提供
  };

  const canConvert = !!htmlInput && !!cssInput;

  const openCodeViewer = (title: string, content: string, language: 'xml' | 'jsx') => {
    setCodeViewer({
      isOpen: true,
      title,
      content,
      language
    });
  };

  const closeCodeViewer = () => {
    setCodeViewer({ ...codeViewer, isOpen: false });
  };

  return (
    <div className="w-full px-4 pb-4 pt-0" style={{ height: 'calc(100vh - var(--navigation-height, 60px))' }}>
      <div className="w-full h-full max-w-[1800px] mx-auto flex flex-col gap-4">
        {/* 田字格布局 - 固定等大 */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full overflow-hidden">
          {/* 左上：预览 */}
          <PreviewCard onOpenFullscreen={() => setPreviewFullscreen(true)} />

          {/* 右上：HTML输入编辑器 */}
          <HtmlInputCard onOpenFullscreen={openCodeViewer} />

          {/* 左下：CSS输入编辑器 */}
          <CssInputCard onOpenFullscreen={openCodeViewer} />

          {/* 右下：转化结果 */}
          <ResultOutputCard
            onOpenFullscreen={openCodeViewer}
            onConvert={handleConvert}
            isConverting={false}
            canConvert={canConvert}
          />
        </div>
      </div>

      {/* 全屏代码查看器 */}
      {codeViewer.isOpen && (
        <FullscreenCodeViewer
          title={codeViewer.title}
          content={codeViewer.content}
          language={codeViewer.language}
          onClose={closeCodeViewer}
        />
      )}

      {/* 全屏预览 */}
      {previewFullscreen && (
        <FullscreenPreview onClose={() => setPreviewFullscreen(false)} />
      )}
    </div>
  );
};

export default ClassToInline;
