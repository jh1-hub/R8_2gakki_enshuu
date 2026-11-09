import React from 'react';
import {
  Database, Cloud, Smartphone, MessageSquare, MousePointerClick,
  Sparkles, Layers, Server, Network, Radio, MapPin, CreditCard, ShoppingCart,
  Truck, UserCheck, AlertTriangle, Fingerprint, Gavel, Copyright, CreativeCommons,
  Cpu, HardDrive, Camera, Wifi, Link, Binary, RefreshCw, Clock, Settings,
  Download, Trash2, BookOpen, PenTool, FileText, Archive, Globe, Upload,
  SearchCode, Shield, Box, Activity, Target, BarChart, PieChart, Zap,
  LineChart, Lightbulb, Monitor, Terminal, Code, Volume2, Waves, Image,
  Film, Video, Palette, Type, GitFork, Table, Play, Minimize2
} from 'lucide-react';

export const getTermIcon = (term: string, size: number = 32) => {
  const t = term.toLowerCase();
  let IconComponent = Code;

  // Logic circuits & computation
  if (t.includes('論理回路') || t.includes('回路') || t.includes('ゲート')) IconComponent = Cpu;
  else if (t.includes('and') || t.includes('積') || t.includes('or') || t.includes('和') || t.includes('not') || t.includes('否定')) IconComponent = GitFork;
  else if (t.includes('加算器') || t.includes('半加算') || t.includes('全加算')) IconComponent = Binary;
  else if (t.includes('真理値表') || t.includes('表')) IconComponent = Table;

  // Sound & sampling
  else if (t.includes('音波') || t.includes('周期') || t.includes('波')) IconComponent = Waves;
  else if (t.includes('周波数') || t.includes('サンプリング') || t.includes('標本化') || t.includes('量子化') || t.includes('符号化') || t.includes('pcm')) IconComponent = Volume2;
  else if (t.includes('hz') || t.includes('ヘルツ')) IconComponent = Activity;

  // Text, characters & fonts
  else if (t.includes('文字コード') || t.includes('ascii') || t.includes('jis') || t.includes('unicode') || t.includes('utf') || t.includes('euc')) IconComponent = Code;
  else if (t.includes('フォント') || t.includes('グリフ') || t.includes('明朝') || t.includes('ゴシック') || t.includes('文字')) IconComponent = Type;

  // Images & video
  else if (t.includes('画素') || t.includes('ピクセル') || t.includes('解像度') || t.includes('dpi') || t.includes('階調')) IconComponent = Camera;
  else if (t.includes('ラスタ') || t.includes('ベクタ') || t.includes('rgb') || t.includes('cmy') || t.includes('混色') || t.includes('カラー')) IconComponent = Palette;
  else if (t.includes('静止画像') || t.includes('画像') || t.includes('bmp') || t.includes('png') || t.includes('jpeg')) IconComponent = Image;
  else if (t.includes('動画') || t.includes('フレーム') || t.includes('fps') || t.includes('残像')) IconComponent = Film;

  // Compression
  else if (t.includes('圧縮') || t.includes('ランレングス') || t.includes('可逆') || t.includes('展開') || t.includes('解凍')) IconComponent = Minimize2;

  // CPU, registers & architecture
  else if (t.includes('cpu') || t.includes('演算装置') || t.includes('制御装置') || t.includes('プロセッサ')) IconComponent = Cpu;
  else if (t.includes('カウンタ') || t.includes('レジスタ') || t.includes('解読器') || t.includes('デコーダ')) IconComponent = Terminal;
  else if (t.includes('クロック') || t.includes('時間') || t.includes('時計')) IconComponent = Clock;
  else if (t.includes('メモリ') || t.includes('主記憶') || t.includes('補助記憶') || t.includes('ストレージ') || t.includes('ssd') || t.includes('hdd')) IconComponent = HardDrive;

  // Algorithms & Flowcharts
  else if (t.includes('アルゴリズム') || t.includes('フローチャート') || t.includes('流れ図')) IconComponent = GitFork;
  else if (t.includes('順次') || t.includes('選択') || t.includes('分岐') || t.includes('繰り返し') || t.includes('ループ') || t.includes('遷移') || t.includes('アクティビティ')) IconComponent = Play;
  else if (t.includes('プログラム')) IconComponent = Terminal;

  // Hardware & Software & interfaces
  else if (t.includes('ハードウェア') || t.includes('入力装置') || t.includes('出力装置')) IconComponent = Monitor;
  else if (t.includes('インタフェース') || t.includes('usb') || t.includes('hdmi') || t.includes('ケーブル')) IconComponent = Link;
  else if (t.includes('bluetooth') || t.includes('無線') || t.includes('wifi') || t.includes('wi-fi')) IconComponent = Wifi;
  else if (t.includes('ドライバ') || t.includes('ソフトウェア') || t.includes('os') || t.includes('基本ソフトウェア') || t.includes('タスク') || t.includes('アップデート')) IconComponent = Settings;
  else if (t.includes('gui') || t.includes('マウス') || t.includes('アイコン')) IconComponent = MousePointerClick;
  else if (t.includes('ファイル') || t.includes('拡張子')) IconComponent = FileText;
  else if (t.includes('フォルダ') || t.includes('ディレクトリ') || t.includes('階層')) IconComponent = Archive;

  // Base conversion & numbers
  else if (t.includes('2進数') || t.includes('16進数') || t.includes('10進数') || t.includes('基数変換') || t.includes('ビット') || t.includes('バイト') || t.includes('バイナリ') || t.includes('デジタル') || t.includes('アナログ')) IconComponent = Binary;

  // General fallbacks
  else if (t.includes('データ')) IconComponent = Database;
  else if (t.includes('セキュリティ') || t.includes('暗号')) IconComponent = Shield;

  return <IconComponent size={size} />;
};
