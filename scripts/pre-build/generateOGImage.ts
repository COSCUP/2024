import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from 'canvas';

interface Session {
    id: string;
    type: string;
    room: string;
    start: string;
    end: string;
    language: string;
    zh: {
      title: string;
      description: string;
    };
    en: {
      title: string;
      description: string;
    };
    speakers: string[];
    tags: string[];
    co_write: string;
    record: string;
    uri: string;
}

interface Speaker {
  id: string;
  avatar: string;
  zh: {
      name: string;
      bio: string;
  };
  en: {
      name: string;
      bio: string;
  };
}

interface Session_types{
  id: string;
  zh:{name:string};
  en:{name:string};
}

interface SomethingById {
  [id: string]: string;
}

export default async function generateOGImage(){
  return {
    name: 'vite-plugin-generate-og-images',
    async buildStart() {
    console.log('Start OG generating');
      registerFont(path.resolve(__dirname, '../../src/assets/fonts/TaipeiSansTCBeta-Bold/TaipeiSansTCBeta-Bold.ttf'), { family: 'TaipeiSansTCBeta-Bold' });
      // reading session.json
      const sessionsData: { sessions: Session[] } = JSON.parse(fs.readFileSync('./src/assets/json/session.json', 'utf-8'));
      const speakersData: { speakers: Speaker[] } = JSON.parse(fs.readFileSync('./src/assets/json/session.json', 'utf-8'));
      const session_typesData: { session_types: Session_types[] } = JSON.parse(fs.readFileSync('./src/assets/json/session.json', 'utf-8'));

      // create dictionary for decode json speakerID & type
      const nameById: { [id: string]: string } = {};
      speakersData.speakers.forEach(speaker => {
          nameById[speaker.id] = speaker.zh.name;
      });
      const typeById: { [id: string]: string } = {};
      session_typesData.session_types.forEach(type => {
        typeById[type.id] = type.zh.name;
      });

      // generate image
      for (const session of sessionsData.sessions) {
        await generateSessionImage(session,typeById,nameById);
      }

      console.log('All OG images have been generated.');
    },
  };
}

function wrapTitle(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
      } else {
          line = testLine;
      }
  }
  context.fillText(line, x, y);
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawTag(ctx: CanvasRenderingContext2D, tag: string, x: number, y: number, padding: number = 10, radius: number = 10): number {
  ctx.font = '16px TaipeiSansTCBeta-Bold'; // 设置字体大小和类型
  const metrics = ctx.measureText(tag); // 测量文本
  const textWidth = metrics.width;
  const textHeight = 20; // 假定文本高度为20像素
  const rectWidth = textWidth + 2 * padding;
  const rectHeight = textHeight + 2 * padding;

  // 绘制圆角矩形背景，添加透明度
  ctx.fillStyle = 'rgba(100, 100, 240, 0.4)'; // 背景色加透明度
  drawRoundedRect(ctx, x, y, rectWidth, rectHeight, radius);

  // 绘制文本
  ctx.fillStyle = '#000'; // 文本颜色
  ctx.fillText(tag, x + padding, y + padding + textHeight / 2 + 4); // 稍微调整y坐标使文本垂直居中

  // 返回下一个标签的起始 x 坐标，包括间隔
  return x + rectWidth + 15;
}


async function generateSessionImage(session: Session,typeById: SomethingById,nameById: SomethingById): Promise<void> {
  const dirPath = path.resolve(__dirname, '../../public/images/sessions');
  // Check if the directory exists, if not, create it
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created at ${dirPath}`);
  }

  const outputPath = path.join(dirPath, `${session.id}.png`);
  // check if the picture exists
  if (fs.existsSync(outputPath)) {
    // console.log(`Image for session ${session.id} already exists at ${outputPath}. Skipping generation.`);
    return;
  }

  // create canvas
  const canvasWidth = 1200;
  const canvasHeight = 630;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d') ;
  // set background image
  const background = await loadImage('./src/assets/images/og_background.jpg');
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

  // set painter property
  ctx.fillStyle = '#000000';
  ctx.font = '36px TaipeiSansTCBeta-Bold';

  // draw title
  const x = 150;
  const y = 190;
  const maxWidth = 900;
  const lineHeight = 40;
  wrapTitle(ctx, session.zh.title, x, y, maxWidth, lineHeight);

  // draw tag
  const tags = session.tags;
  let currentX = 150;
  let currentY = 105;
  tags.forEach(tag => {
    currentX = drawTag(ctx, tag, currentX, currentY); // 更新 currentX 到下一个标签的位置
  });
  // draw speaker
  const speakers = session.speakers;
  let currentX_spk = 150;
  let currentY_spk = 430;
  speakers.forEach(speaker => {
    currentX = drawTag(ctx, nameById[speaker], currentX_spk, currentY_spk); // 更新 currentX 到下一个标签的位置
  });
  // draw session type
  const type = session.type;
  ctx.font = '24px TaipeiSansTCBeta-Bold';
  ctx.fillText(typeById[type], 150, 500);

  // save image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated image for session ${session.id} at ${outputPath}`);
}

