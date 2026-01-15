/* eslint-env node */
/**
 * 通用字体分块脚本
 * 用法: node scripts/fontSplit.mjs [fontName]
 * 示例: node scripts/fontSplit.mjs minsans
 *       node scripts/fontSplit.mjs          # 构建所有字体
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { runInitScript } from 'cn-font-split/dist/init.mjs';
import { matchPlatform, getBinName } from 'cn-font-split/dist/load.mjs';
import { isMusl } from 'cn-font-split/dist/node/isMusl.mjs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= 字体配置 =================

const FONTS_SOURCE = path.resolve(__dirname, 'fonts');
const FONTS_DIST = path.resolve(__dirname, '../public/fonts');

const FONTS = {
  minsans: {
    input: 'MiSansVF.ttf',
    family: 'minsans-v',
    rename: 'misans-v-[index].[ext]',
    preview: '小米动态字体\nMiSans Variable Font\n中文网字计划',
  },
  'syht-cn': {
    input: 'SourceHanSansCN-VF.ttf',
    family: 'syht-cn-v',
    rename: 'syht-cn-v-[index].[ext]',
    preview: '思源黑体CN动态字体\nSource Han Sans CN Variable Font\n中文网字计划',
  },
  'syht-jp': {
    input: 'SourceHanSansJP-VF.ttf',
    family: 'syht-jp-v',
    rename: 'syht-jp-v-[index].[ext]',
    preview: '思源黑体JP动态字体\nSource Han Sans JP Variable Font\n中文网字计划',
  },
  'syst-cn': {
    input: 'SourceHanSerifCN-VF.ttf',
    family: 'syst-cn-v',
    rename: 'syst-cn-v-[index].[ext]',
    preview: '思源宋体CN动态字体\nSource Han Serif CN Variable Font\n中文网字计划',
  },
  'syst-jp': {
    input: 'SourceHanSerifJP-VF.ttf',
    family: 'syst-jp-v',
    rename: 'syst-jp-v-[index].[ext]',
    preview: '思源宋体JP动态字体\nSource Han Serif JP Variable Font\n中文网字计划',
  },
};

// ===========================================

function getFontSplitCorePath() {
  const pkgPath = require.resolve('cn-font-split/package.json');
  const distDir = path.join(path.dirname(pkgPath), 'dist');
  const binName = getBinName(matchPlatform(process.platform, process.arch, isMusl));
  return path.join(distDir, binName);
}

async function ensureFontSplitCore() {
  const corePath = getFontSplitCorePath();
  if (fs.existsSync(corePath)) return corePath;

  console.log('⚠️ cn-font-split 核心缺失，正在安装...');
  const originalArgv = process.argv;
  try {
    process.argv = ['node', 'cn-font-split', 'i', 'default'];
    await runInitScript();
  } finally {
    process.argv = originalArgv;
  }

  if (!fs.existsSync(corePath)) {
    throw new Error('cn-font-split 核心安装失败，请手动运行 npx cn-font-split i default');
  }
  return corePath;
}

async function buildFont(name) {
  const config = FONTS[name];
  if (!config) {
    console.error(`❌ 未知字体: ${name}，可选: ${Object.keys(FONTS).join(', ')}`);
    return false;
  }

  const fontDir = path.join(FONTS_DIR, name);
  const inputFile = path.join(fontDir, config.input);
  const outputDir = path.join(fontDir, 'dist');

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ 找不到字体文件: ${inputFile}`);
    return false;
  }

  console.log(`🚀 开始处理: ${name} (${config.input})`);
  console.time(name);

  await ensureFontSplitCore();
  const { fontSplit } = await import('cn-font-split');
  const inputBuffer = fs.readFileSync(inputFile);

  try {
    await fontSplit({
      input: inputBuffer,
      outDir: outputDir,
      css: {
        fontFamily: config.family,
        fontWeight: '100 900',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        localFamily: [config.family],
        compress: true,
        commentUnicodes: false,
      },
      renameOutputFont: config.rename,
      previewImage: { name: 'preview', text: config.preview },
      testHtml: true,
      reporter: true,
      autoSubset: true,
      fontFeature: true,
      compress: true,
    });

    console.timeEnd(name);
    console.log(`✅ ${name} 构建完成: ${outputDir}`);
    return true;
  } catch (e) {
    console.error(`❌ ${name} 构建失败:`, e);
    return false;
  }
}

async function main() {
  const target = process.argv[2];

  if (target) {
    await buildFont(target);
  } else {
    console.log(`📦 构建所有字体 (${Object.keys(FONTS).length} 个)\n`);
    for (const name of Object.keys(FONTS)) {
      await buildFont(name);
      console.log('');
    }
  }
}

main();
