import { getDayjs } from '@dev/utils/utDateTime/exDayjs';
import React from 'react';

const articleMeta = {
  title: "欢迎使用 ExPubGo",
  subtitle: "可扩展的内容发布与创作工具平台",
  date: getDayjs('2025-01-01 00:00:00 '),
  id: "default",
  author: "guohub8080",
  tag: ["文档", "入门"],
  category: "默认分类",
}

// ============================================ 组件 ============================================

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <section style={{ marginBottom: 40, textAlign: 'center' }}>
    <section style={{
      fontSize: 22,
      fontWeight: 700,
      color: '#1e293b',
      marginBottom: 12,
      letterSpacing: 2,
    }}>
      {title}
    </section>
    <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <section style={{ width: 32, height: 2, background: '#cbd5e1' }} />
      <section style={{ width: 6, height: 6, background: '#3b82f6', transform: 'rotate(45deg)' }} />
      <section style={{ width: 32, height: 2, background: '#cbd5e1' }} />
    </section>
  </section>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    padding: '4px 12px',
    background: '#fff',
    color: '#3b82f6',
    borderRadius: 16,
    fontSize: 12,
    fontWeight: 600,
    border: '1.5px solid #3b82f6',
    fontFamily: 'monospace',
  }}>
    {children}
  </span>
);

const Card: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string }> = ({ icon, title, desc, color }) => (
  <section style={{
    padding: 24,
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    borderRadius: 16,
    border: '1px solid rgba(59, 130, 246, 0.15)',
  }}>
    <section style={{
      width: 44, height: 44, background: color, borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    }}>
      {icon}
    </section>
    <section style={{ fontSize: 17, fontWeight: 700, color: '#1e40af', marginBottom: 8 }}>
      {title}
    </section>
    <section style={{ fontSize: 14, lineHeight: 1.7, color: '#475569' }}>
      {desc}
    </section>
  </section>
);

const Step: React.FC<{ num: number; title: string; desc: React.ReactNode; color: string }> = ({ num, title, desc, color }) => (
  <section style={{
    padding: 20,
    background: '#f8fafc',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    borderLeft: `4px solid ${color}`,
  }}>
    <section style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <section style={{
        width: 40, height: 40, borderRadius: 10,
        background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 18, flexShrink: 0,
      }}>
        {num}
      </section>
      <section style={{ flex: 1 }}>
        <section style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
          {title}
        </section>
        <section style={{ fontSize: 14, lineHeight: 1.7, color: '#64748b' }}>
          {desc}
        </section>
      </section>
    </section>
  </section>
);

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code style={{
    background: '#f1f5f9', padding: '2px 8px', borderRadius: 4,
    fontFamily: 'monospace', fontWeight: 600, color: '#dc2626', fontSize: 13,
  }}>
    {children}
  </code>
);

// ============================================ 主组件 ============================================

const DefaultArticle = () => {
  return (
    <section style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#3b82f6',
      padding: '40px 16px',
      borderRadius: 20,
      color: '#fff',
    }}>
      {/* 头部 */}
      <section style={{ textAlign: 'center', marginBottom: 36 }}>
        <section style={{
          display: 'inline-block', padding: '6px 18px',
          background: 'rgba(255,255,255,0.2)', borderRadius: 20,
          fontSize: 13, fontWeight: 500, marginBottom: 16,
        }}>
          可扩展的内容发布平台
        </section>
        <section style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.2 }}>
          欢迎使用 ExPubGo
        </section>
      </section>

      {/* 白色内容区 */}
      <section style={{
        background: '#fff', borderRadius: 16, padding: '40px 20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', color: '#334155',
      }}>
        {/* 项目介绍 */}
        <section style={{ marginBottom: 48 }}>
          <SectionTitle title="项目介绍" />
          <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <section style={{
              padding: '24px 20px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              borderRadius: 16,
            }}>
              <section style={{
                display: 'inline-block', padding: '4px 14px',
                background: '#3b82f6', color: '#fff', borderRadius: 20,
                fontSize: 12, fontWeight: 600, marginBottom: 14,
              }}>
                内容发布 + 工具集
              </section>
              <section style={{ fontSize: 16, lineHeight: 1.8, color: '#334155', marginBottom: 16 }}>
                ExPubGo 是一个基于 React + TypeScript + Vite 的可扩展内容发布平台。提供文章预览、SVG 动画编辑、样式转换等工具，支持通过 Publisher 机制接入不同内容源，每个发布者独立管理、互不干扰。
              </section>
              <section style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS'].map(t => <Tag key={t}>{t}</Tag>)}
              </section>
            </section>

            <section style={{
              padding: '24px 20px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              borderRadius: 16,
            }}>
              <section style={{
                display: 'inline-block', padding: '4px 14px',
                background: '#2563eb', color: '#fff', borderRadius: 20,
                fontSize: 12, fontWeight: 600, marginBottom: 14,
              }}>
                Publisher 扩展机制
              </section>
              <section style={{ fontSize: 16, lineHeight: 1.8, color: '#334155', marginBottom: 16 }}>
                每个 Publisher 是一个独立的内容源，拥有自己的文章、组件和资源。作为独立目录存在于项目中，框架自动发现和加载。适合多账号运营场景，公开框架与私有内容完全隔离。
              </section>
              <section style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['多账号', '独立目录', '自动发现', '内容隔离'].map(t => <Tag key={t}>{t}</Tag>)}
              </section>
            </section>
          </section>
        </section>

        {/* 核心特性 */}
        <section style={{ marginBottom: 48 }}>
          <SectionTitle title="核心特性" />
          <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
              title="文章预览与编辑"
              desc="实时预览文章渲染效果，支持分类筛选、标签搜索。所见即所得，满意后一键复制 HTML 发布到微信公众号等平台。"
              color="#3b82f6"
            />
            <Card
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>}
              title="SVG 动画组件库"
              desc="内置丰富的 SVG 交互组件：伸长动画、点击切换、图片轮播等。配合完整文档和在线预览，快速构建公众号交互图文。"
              color="#2563eb"
            />
            <Card
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>}
              title="实用工具箱"
              desc="色彩工具、阴影工具、SVG 转 React 组件、class 转 inline 样式 — 覆盖公众号开发全链路的辅助工具。"
              color="#1d4ed8"
            />
            <Card
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
              title="多平台镜像部署"
              desc="同时部署到 GitHub Pages、Cloudflare Pages、Netlify、Vercel 等多个平台，确保访问稳定性。"
              color="#1e40af"
            />
          </section>
        </section>

        {/* 快速开始 */}
        <section style={{ marginBottom: 48 }}>
          <SectionTitle title="快速开始" />
          <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Step
              num={1}
              title="克隆并安装"
              desc={<>
                克隆仓库后运行 <Code>pnpm install</Code> 安装依赖，然后 <Code>pnpm dev</Code> 启动开发服务器
              </>}
              color="#3b82f6"
            />
            <Step
              num={2}
              title="创建 Publisher"
              desc={<>
                在 <Code>publishers/</Code> 下创建你的 Publisher 目录，添加文章和配置，框架自动加载
              </>}
              color="#2563eb"
            />
            <Step
              num={3}
              title="预览并发布"
              desc="在浏览器中预览文章效果，满意后复制 HTML 发布到微信公众号等平台"
              color="#1d4ed8"
            />
          </section>
        </section>

        {/* 技术栈 */}
        <section style={{
          padding: 24, background: '#f8fafc', borderRadius: 16,
          border: '1px solid #e2e8f0',
        }}>
          <section style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', textAlign: 'center', marginBottom: 16, letterSpacing: 1 }}>
            技术栈
          </section>
          <section style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {[
              'React 18', 'TypeScript', 'Vite', 'Tailwind CSS v4',
              'Radix UI', 'shadcn/ui', 'Zustand', 'React Router v6',
              'Motion', 'MDX', 'Lodash', 'Day.js',
            ].map(t => <Tag key={t}>{t}</Tag>)}
          </section>
        </section>
      </section>

      {/* 底部 */}
      <section style={{ textAlign: 'center', marginTop: 24, padding: '24px 20px' }}>
        <section style={{
          display: 'inline-block', padding: '6px 18px',
          background: 'rgba(255,255,255,0.15)', borderRadius: 20,
          fontSize: 13, fontWeight: 600, marginBottom: 10,
        }}>
          ExPubGo
        </section>
        <section style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
          Built by guohub8080
        </section>
      </section>
    </section>
  );
};

export default {
  jsx: DefaultArticle,
  ...articleMeta
};
