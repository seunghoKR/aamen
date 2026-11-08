'use client'

import React, { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link2,
  Minus,
  Highlighter,
  Eye,
  PenTool,
} from 'lucide-react'


export interface EditorI18n {
  markdown_supported: string
  tab_edit: string
  tab_preview: string
  preview_empty: string
  shortcuts_hint: string
  preview_hint: string
  char_count: string
  prompt_url: string
  prompt_default_text: string
  bold: string
  italic: string
  underline: string
  strike: string
  h1: string
  h2: string
  bullet_list: string
  numbered_list: string
  quote: string
  highlight: string
  link: string
  hr: string
  sample_bold: string
  sample_italic: string
  sample_underline: string
  sample_strike: string
  sample_h1: string
  sample_h2: string
  sample_bullet: string
  sample_numbered: string
  sample_quote: string
  sample_highlight: string
}

export const EDITOR_I18N: Record<string, EditorI18n> = {
  'ko': {
    markdown_supported: '마크다운 서식 지원',
    tab_edit: '편집',
    tab_preview: '미리보기',
    preview_empty: '미리볼 내용이 아직 없습니다. [편집] 탭에서 내용을 작성해 주세요.',
    shortcuts_hint: '단축키: **굵게**, *기울임*, # 제목, - 목록, [링크](URL)',
    preview_hint: '👁️ 실시간 서식 미리보기',
    char_count: '자',
    prompt_url: '연결할 웹사이트 URL을 입력해 주세요:',
    prompt_default_text: '여기를 클릭하세요',
    bold: '굵게 (Bold)',
    italic: '기울임 (Italic)',
    underline: '밑줄 (Underline)',
    strike: '취소선 (Strikethrough)',
    h1: '대제목 (H1)',
    h2: '중제목 (H2)',
    bullet_list: '글머리 목록 (Bullet List)',
    numbered_list: '번호 목록 (Numbered List)',
    quote: '인용구 (Blockquote)',
    highlight: '형광펜 강조 (Highlight)',
    link: '웹 링크 삽입 (Insert Link)',
    hr: '구분선 삽입 (Horizontal Rule)',
    sample_bold: '굵은 텍스트',
    sample_italic: '기울임 텍스트',
    sample_underline: '밑줄 텍스트',
    sample_strike: '취소선 텍스트',
    sample_h1: '대제목',
    sample_h2: '중제목',
    sample_bullet: '목록 항목',
    sample_numbered: '첫 번째 항목',
    sample_quote: '중요 인용 문구',
    sample_highlight: '강조',
  },
  'en': {
    markdown_supported: 'Markdown supported',
    tab_edit: 'Edit',
    tab_preview: 'Preview',
    preview_empty: 'No content to preview yet. Please write in the [Edit] tab.',
    shortcuts_hint: 'Shortcuts: **Bold**, *Italic*, # Header, - List, [Link](URL)',
    preview_hint: '👁️ Real-time Preview',
    char_count: ' chars',
    prompt_url: 'Enter website URL:',
    prompt_default_text: 'Click here',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strike: 'Strikethrough',
    h1: 'Heading 1 (H1)',
    h2: 'Heading 2 (H2)',
    bullet_list: 'Bullet List',
    numbered_list: 'Numbered List',
    quote: 'Blockquote',
    highlight: 'Highlight',
    link: 'Insert Link',
    hr: 'Horizontal Rule',
    sample_bold: 'Bold text',
    sample_italic: 'Italic text',
    sample_underline: 'Underlined text',
    sample_strike: 'Strikethrough text',
    sample_h1: 'Heading 1',
    sample_h2: 'Heading 2',
    sample_bullet: 'List item',
    sample_numbered: 'First item',
    sample_quote: 'Important quote',
    sample_highlight: 'Highlight',
  },
  'ja': {
    markdown_supported: 'マークダウン対応',
    tab_edit: '編集',
    tab_preview: 'プレビュー',
    preview_empty: 'プレビューする内容がありません。[編集]タブで作成してください。',
    shortcuts_hint: 'ショートカット: **太字**, *斜体*, # 見出し, - リスト, [リンク](URL)',
    preview_hint: '👁️ リアルタイムプレビュー',
    char_count: '文字',
    prompt_url: 'リンク先URLを入力してください:',
    prompt_default_text: 'ここをクリック',
    bold: '太字 (Bold)',
    italic: '斜体 (Italic)',
    underline: '下線 (Underline)',
    strike: '取り消し線 (Strikethrough)',
    h1: '大見出し (H1)',
    h2: '中見出し (H2)',
    bullet_list: '箇条書きリスト (Bullet List)',
    numbered_list: '番号付きリスト (Numbered List)',
    quote: '引用 (Blockquote)',
    highlight: 'マーカー強調 (Highlight)',
    link: 'リンク挿入 (Insert Link)',
    hr: '区切り線 (Horizontal Rule)',
    sample_bold: '太字テキスト',
    sample_italic: '斜体テキスト',
    sample_underline: '下線テキスト',
    sample_strike: '取り消し線テキスト',
    sample_h1: '大見出し',
    sample_h2: '中見出し',
    sample_bullet: 'リスト項目',
    sample_numbered: '1番目の項目',
    sample_quote: '重要な引用文',
    sample_highlight: '強調',
  },
  'zh-HK': {
    markdown_supported: '支援 Markdown 語法',
    tab_edit: '編輯',
    tab_preview: '預覽',
    preview_empty: '尚無預覽內容，請在【編輯】標籤填寫內容。',
    shortcuts_hint: '快速鍵: **粗體**, *斜體*, # 大標題, - 清單, [連結](URL)',
    preview_hint: '👁️ 即時格式預覽',
    char_count: '字',
    prompt_url: '請輸入欲連結的網址 URL:',
    prompt_default_text: '點此前往連結',
    bold: '粗體 (Bold)',
    italic: '斜體 (Italic)',
    underline: '底線 (Underline)',
    strike: '刪除線 (Strikethrough)',
    h1: '大標題 (H1)',
    h2: '中標題 (H2)',
    bullet_list: '項目符號清單 (Bullet List)',
    numbered_list: '編號清單 (Numbered List)',
    quote: '引用文字 (Blockquote)',
    highlight: '螢光筆重點 (Highlight)',
    link: '插入網址連結 (Insert Link)',
    hr: '分隔線 (Horizontal Rule)',
    sample_bold: '粗體文字',
    sample_italic: '斜體文字',
    sample_underline: '底線文字',
    sample_strike: '刪除線文字',
    sample_h1: '大標題',
    sample_h2: '中標題',
    sample_bullet: '清單項目',
    sample_numbered: '第一項',
    sample_quote: '重要引用文字',
    sample_highlight: '重點標記',
  },
  'zh-TW': {
    markdown_supported: '支援 Markdown 語法',
    tab_edit: '編輯',
    tab_preview: '預覽',
    preview_empty: '尚無預覽內容，請在【編輯】標籤填寫內容。',
    shortcuts_hint: '快速鍵: **粗體**, *斜體*, # 大標題, - 清單, [連結](URL)',
    preview_hint: '👁️ 即時格式預覽',
    char_count: '字',
    prompt_url: '請輸入欲連結的網址 URL:',
    prompt_default_text: '點此前往連結',
    bold: '粗體 (Bold)',
    italic: '斜體 (Italic)',
    underline: '底線 (Underline)',
    strike: '刪除線 (Strikethrough)',
    h1: '大標題 (H1)',
    h2: '中標題 (H2)',
    bullet_list: '項目符號清單 (Bullet List)',
    numbered_list: '編號清單 (Numbered List)',
    quote: '引用文字 (Blockquote)',
    highlight: '螢光筆重點 (Highlight)',
    link: '插入網址連結 (Insert Link)',
    hr: '分隔線 (Horizontal Rule)',
    sample_bold: '粗體文字',
    sample_italic: '斜體文字',
    sample_underline: '底線文字',
    sample_strike: '刪除線文字',
    sample_h1: '大標題',
    sample_h2: '中標題',
    sample_bullet: '清單項目',
    sample_numbered: '第一項',
    sample_quote: '重要引用文字',
    sample_highlight: '重點標記',
  },
  'id': {
    markdown_supported: 'Mendukung Markdown',
    tab_edit: 'Edit',
    tab_preview: 'Pratinjau',
    preview_empty: 'Belum ada konten untuk dipratinjau. Silakan tulis di tab [Edit].',
    shortcuts_hint: 'Pintasan: **Tebal**, *Miring*, # Judul, - Daftar, [Tautan](URL)',
    preview_hint: '👁️ Pratinjau Format Langsung',
    char_count: ' karakter',
    prompt_url: 'Masukkan URL situs web:',
    prompt_default_text: 'Klik di sini',
    bold: 'Tebal',
    italic: 'Miring',
    underline: 'Garis Bawah',
    strike: 'Coret',
    h1: 'Judul Utama (H1)',
    h2: 'Sub Judul (H2)',
    bullet_list: 'Daftar Poin',
    numbered_list: 'Daftar Bernomor',
    quote: 'Kutipan',
    highlight: 'Stabilo',
    link: 'Sisipkan Tautan',
    hr: 'Garis Pemisah',
    sample_bold: 'Teks tebal',
    sample_italic: 'Teks miring',
    sample_underline: 'Teks bergaris bawah',
    sample_strike: 'Teks dicoret',
    sample_h1: 'Judul Utama',
    sample_h2: 'Sub Judul',
    sample_bullet: 'Item daftar',
    sample_numbered: 'Item pertama',
    sample_quote: 'Kutipan penting',
    sample_highlight: 'Sorotan',
  },
  'tl': {
    markdown_supported: 'Suportado ang Markdown',
    tab_edit: 'I-edit',
    tab_preview: 'Preview',
    preview_empty: 'Wala pang nilalaman na mai-preview. Mangyaring magsulat sa tab na [I-edit].',
    shortcuts_hint: 'Shortcuts: **Bold**, *Italic*, # Header, - List, [Link](URL)',
    preview_hint: '👁️ Real-time na Preview',
    char_count: ' titik',
    prompt_url: 'Ilagay ang URL ng website:',
    prompt_default_text: 'Pindutin dito',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Salungguhit',
    strike: 'Strikethrough',
    h1: 'Pangunahing Pamagat (H1)',
    h2: 'Mababang Pamagat (H2)',
    bullet_list: 'Listahan ng Bullet',
    numbered_list: 'Listahang May Numero',
    quote: 'Blockquote',
    highlight: 'Highlight',
    link: 'Maglagay ng Link',
    hr: 'Pahalang na Guhit',
    sample_bold: 'Tekstong bold',
    sample_italic: 'Tekstong italic',
    sample_underline: 'May salungguhit na teksto',
    sample_strike: 'May linyang teksto',
    sample_h1: 'Pangunahing Pamagat',
    sample_h2: 'Mababang Pamagat',
    sample_bullet: 'Item ng listahan',
    sample_numbered: 'Unang item',
    sample_quote: 'Mahalagang quote',
    sample_highlight: 'Highlight',
  },
  'vi': {
    markdown_supported: 'Hỗ trợ định dạng Markdown',
    tab_edit: 'Soạn thảo',
    tab_preview: 'Xem trước',
    preview_empty: 'Chưa có nội dung để xem trước. Vui lòng soạn thảo trong tab [Soạn thảo].',
    shortcuts_hint: 'Phím tắt: **In đậm**, *In nghiêng*, # Tiêu đề, - Danh sách, [Liên kết](URL)',
    preview_hint: '👁️ Xem trước định dạng trực tiếp',
    char_count: ' ký tự',
    prompt_url: 'Nhập địa chỉ URL liên kết:',
    prompt_default_text: 'Bấm vào đây',
    bold: 'In đậm',
    italic: 'In nghiêng',
    underline: 'Gạch chân',
    strike: 'Gạch ngang',
    h1: 'Tiêu đề lớn (H1)',
    h2: 'Tiêu đề phụ (H2)',
    bullet_list: 'Danh sách dấu đầu dòng',
    numbered_list: 'Danh sách đánh số',
    quote: 'Trích dẫn',
    highlight: 'Tô sáng',
    link: 'Chèn liên kết',
    hr: 'Đường phân cách',
    sample_bold: 'Văn bản in đậm',
    sample_italic: 'Văn bản in nghiêng',
    sample_underline: 'Văn bản gạch chân',
    sample_strike: 'Văn bản gạch ngang',
    sample_h1: 'Tiêu đề lớn',
    sample_h2: 'Tiêu đề phụ',
    sample_bullet: 'Mục danh sách',
    sample_numbered: 'Mục thứ nhất',
    sample_quote: 'Lời trích dẫn quan trọng',
    sample_highlight: 'Tô sáng',
  },
  'th': {
    markdown_supported: 'รองรับรูปแบบ Markdown',
    tab_edit: 'แก้ไข',
    tab_preview: 'ดูตัวอย่าง',
    preview_empty: 'ยังไม่มีเนื้อหาสำหรับดูตัวอย่าง กรุณาเขียนในแท็บ [แก้ไข]',
    shortcuts_hint: 'ปุ่มลัด: **ตัวหนา**, *ตัวเอียง*, # หัวข้อ, - รายการ, [ลิงก์](URL)',
    preview_hint: '👁️ ดูตัวอย่างแบบเรียลไทม์',
    char_count: ' ตัวอักษร',
    prompt_url: 'กรุณากรอก URL เว็บไซต์ที่ต้องการเชื่อมโยง:',
    prompt_default_text: 'คลิกที่นี่',
    bold: 'ตัวหนา',
    italic: 'ตัวเอียง',
    underline: 'ขีดเส้นใต้',
    strike: 'ขีดฆ่า',
    h1: 'หัวข้อใหญ่ (H1)',
    h2: 'หัวข้อย่อย (H2)',
    bullet_list: 'รายการสัญลักษณ์แสดงหัวข้อย่อย',
    numbered_list: 'รายการลำดับเลข',
    quote: 'ข้อความอ้างอิง',
    highlight: 'ไฮไลต์ข้อความ',
    link: 'แทรกลิงก์',
    hr: 'เส้นคั่น',
    sample_bold: 'ข้อความตัวหนา',
    sample_italic: 'ข้อความตัวเอียง',
    sample_underline: 'ข้อความขีดเส้นใต้',
    sample_strike: 'ข้อความขีดฆ่า',
    sample_h1: 'หัวข้อใหญ่',
    sample_h2: 'หัวข้อย่อย',
    sample_bullet: 'รายการ',
    sample_numbered: 'รายการที่หนึ่ง',
    sample_quote: 'ข้อความอ้างอิงสำคัญ',
    sample_highlight: 'เน้นข้อความ',
  },
  'my': {
    markdown_supported: 'Markdown ပုံစံ အသုံးပြုနိုင်သည်',
    tab_edit: 'ပြင်ဆင်ရန်',
    tab_preview: 'အကြိုကြည့်ရန်',
    preview_empty: 'အကြိုကြည့်ရှုရန် အကြောင်းအရာ မရှိသေးပါ။ [ပြင်ဆင်ရန်] တက်ဘ်တွင် စာသားရေးပါ။',
    shortcuts_hint: 'ဖြတ်လမ်းခလုတ်များ: **စာလုံးမည်း**, *စာလုံးစောင်း*, # ခေါင်းစဉ်, - စာရင်း, [လင့်ခ်](URL)',
    preview_hint: '👁️ အချိန်နှင့်တပြေးညီ အကြိုကြည့်ရှုခြင်း',
    char_count: ' လုံး',
    prompt_url: 'ချိတ်ဆက်လိုသော ဝဘ်ဆိုဒ် URL ထည့်ပါ:',
    prompt_default_text: 'ဤနေရာကို နှိပ်ပါ',
    bold: 'စာလုံးမည်း (Bold)',
    italic: 'စာလုံးစောင်း (Italic)',
    underline: 'မျဉ်းသား (Underline)',
    strike: 'မျဉ်းဖြတ် (Strikethrough)',
    h1: 'ခေါင်းစဉ်ကြီး (H1)',
    h2: 'ခေါင်းစဉ်ငယ် (H2)',
    bullet_list: 'အမှတ်အသားစာရင်း',
    numbered_list: 'နံပါတ်စဉ်စာရင်း',
    quote: 'ကိုးကားချက်',
    highlight: 'စာသား အထူးပြုရန်',
    link: 'ဝဘ်လင့်ခ် ထည့်သွင်းရန်',
    hr: 'မျဉ်းတား ထည့်ရန်',
    sample_bold: 'စာလုံးမည်း စာသား',
    sample_italic: 'စာလုံးစောင်း စာသား',
    sample_underline: 'မျဉ်းသား စာသား',
    sample_strike: 'မျဉ်းဖြတ် စာသား',
    sample_h1: 'ခေါင်းစဉ်ကြီး',
    sample_h2: 'ခေါင်းစဉ်ငယ်',
    sample_bullet: 'စာရင်းအကြောင်းအရာ',
    sample_numbered: 'ပထမအချက်',
    sample_quote: 'အရေးကြီး ကိုးကားချက်',
    sample_highlight: 'အထူးပြုစာသား',
  },
  'ne': {
    markdown_supported: 'Markdown समर्थित',
    tab_edit: 'सम्पादन',
    tab_preview: 'पूर्वावलोकन',
    preview_empty: 'पूर्वावलोकन गर्न कुनै सामग्री छैन। कृपया [सम्पादन] ट्याबमा लेख्नुहोस्।',
    shortcuts_hint: 'सर्टकटहरू: **बोल्ड**, *इटालिक*, # शीर्षक, - सूची, [लिङ्क](URL)',
    preview_hint: '👁️ प्रत्यक्ष पूर्वावलोकन',
    char_count: ' अक्षर',
    prompt_url: 'वेबसाइटको URL प्रविष्ट गर्नुहोस्:',
    prompt_default_text: 'यहाँ क्लिक गर्नुहोस्',
    bold: 'बोल्ड',
    italic: 'इटालिक',
    underline: 'अन्डरलाइन',
    strike: 'स्ट्राइकथ्रु',
    h1: 'मुख्य शीर्षक (H1)',
    h2: 'उप-शीर्षक (H2)',
    bullet_list: 'बुलेट सूची',
    numbered_list: 'नम्बर सूची',
    quote: 'उद्धरण',
    highlight: 'हाइलाइट',
    link: 'लिङ्क हाल्नुहोस्',
    hr: 'विभाजक रेखा',
    sample_bold: 'बोल्ड पाठ',
    sample_italic: 'इटालिक पाठ',
    sample_underline: 'अन्डरलाइन पाठ',
    sample_strike: 'स्ट्राइकथ्रु पाठ',
    sample_h1: 'मुख्य शीर्षक',
    sample_h2: 'उप-शीर्षक',
    sample_bullet: 'सूची वस्तु',
    sample_numbered: 'पहिलो वस्तु',
    sample_quote: 'महत्वपूर्ण उद्धरण',
    sample_highlight: 'हाइलाइट',
  },
  'hi': {
    markdown_supported: 'मार्कडाउन समर्थित',
    tab_edit: 'संपादित करें',
    tab_preview: 'पूर्वावलोकन',
    preview_empty: 'पूर्वावलोकन के लिए अभी कोई सामग्री नहीं है। कृपया [संपादित करें] टैब में लिखें।',
    shortcuts_hint: 'शॉर्टकट: **बोल्ड**, *इटैलिक*, # शीर्षक, - सूची, [लिंक](URL)',
    preview_hint: '👁️ वास्तविक समय पूर्वावलोकन',
    char_count: ' वर्ण',
    prompt_url: 'वेबसाइट URL दर्ज करें:',
    prompt_default_text: 'यहाँ क्लिक करें',
    bold: 'बोल्ड',
    italic: 'इटैलिक',
    underline: 'रेखांकित',
    strike: 'स्ट्राइकथ्रू',
    h1: 'मुख्य शीर्षक (H1)',
    h2: 'उप-शीर्षक (H2)',
    bullet_list: 'बुलेट सूची',
    numbered_list: 'क्रमांकित सूची',
    quote: 'उद्धरण',
    highlight: 'हाइलाइट',
    link: 'लिंक डालें',
    hr: 'विभाजक रेखा',
    sample_bold: 'बोल्ड टेक्स्ट',
    sample_italic: 'इटैलिक टेक्स्ट',
    sample_underline: 'रेखांकित टेक्स्ट',
    sample_strike: 'स्ट्राइकथ्रू टेक्स्ट',
    sample_h1: 'मुख्य शीर्षक',
    sample_h2: 'उप-शीर्षक',
    sample_bullet: 'सूची आइटम',
    sample_numbered: 'पहला आइटम',
    sample_quote: 'महत्वपूर्ण उद्धरण',
    sample_highlight: 'हाइलाइट',
  },
  'km': {
    markdown_supported: 'គាំទ្រទម្រង់ Markdown',
    tab_edit: 'កែសម្រួល',
    tab_preview: 'មើលជាមុន',
    preview_empty: 'មិនទាន់មានខ្លឹមសារសម្រាប់មើលជាមុនទេ។ សូមសរសេរនៅក្នុងផ្ទាំង [កែសម្រួល]។',
    shortcuts_hint: 'ផ្លូវកាត់: **ដិត**, *ទ្រេត*, # ចំណងជើង, - បញ្ជី, [តំណ](URL)',
    preview_hint: '👁️ ការមើលជាមុនផ្ទាល់',
    char_count: ' តួអក្សរ',
    prompt_url: 'បញ្ចូល URL គេហទំព័រ៖',
    prompt_default_text: 'ចុចទីនេះ',
    bold: 'អក្សរដិត',
    italic: 'អក្សរទ្រេត',
    underline: 'គូសបន្ទាត់ក្រោម',
    strike: 'គូសបន្ទាត់ចំកណ្តាល',
    h1: 'ចំណងជើងធំ (H1)',
    h2: 'ចំណងជើងរង (H2)',
    bullet_list: 'បញ្ជីសញ្ញាចុច',
    numbered_list: 'បញ្ជីលេខរៀង',
    quote: 'ស្រង់សម្តី',
    highlight: 'រំលេចពណ៌',
    link: 'បញ្ចូលតំណភ្ជាប់',
    hr: 'បន្ទាត់ផ្ដេក',
    sample_bold: 'អត្ថបទដិត',
    sample_italic: 'អត្ថបទទ្រេត',
    sample_underline: 'អត្ថបទគូសបន្ទាត់ក្រោម',
    sample_strike: 'អត្ថបទគូសបន្ទាត់ចំកណ្តាល',
    sample_h1: 'ចំណងជើងធំ',
    sample_h2: 'ចំណងជើងរង',
    sample_bullet: 'ធាតុបញ្ជី',
    sample_numbered: 'ធាតុទីមួយ',
    sample_quote: 'ការស្រង់សម្តីសំខាន់',
    sample_highlight: 'រំលេច',
  },
  'lo': {
    markdown_supported: 'ຮອງຮັບຮູບແບບ Markdown',
    tab_edit: 'ແກ້ໄຂ',
    tab_preview: 'ເບິ່ງຕົວຢ່າງ',
    preview_empty: 'ຍັງບໍ່ມີເນື້ອໃນເພື່ອເບິ່ງຕົວຢ່າງ. ກະລຸນາຂຽນໃນແຖບ [ແກ້ໄຂ].',
    shortcuts_hint: 'ປຸ່ມລັດ: **ຕົວໜາ**, *ຕົວອຽງ*, # ຫົວຂໍ້, - ລາຍການ, [ລິ້ງ](URL)',
    preview_hint: '👁️ ເບິ່ງຕົວຢ່າງແບບສົດໆ',
    char_count: ' ຕົວອັກສອນ',
    prompt_url: 'ປ້ອນ URL ເວັບໄຊ:',
    prompt_default_text: 'ກົດບ່ອນນີ້',
    bold: 'ຕົວໜາ',
    italic: 'ຕົວອຽງ',
    underline: 'ຂີດກ້ອງ',
    strike: 'ຂີດຂ້າ',
    h1: 'ຫົວຂໍ້ໃຫຍ່ (H1)',
    h2: 'ຫົວຂໍ້ຍ່ອຍ (H2)',
    bullet_list: 'ລາຍການຈຸດ',
    numbered_list: 'ລາຍການຕົວເລກ',
    quote: 'ຄຳເວົ້າອ້າງອີງ',
    highlight: 'ໄຮໄລ້ຂໍ້ຄວາມ',
    link: 'ໃສ່ລິ້ງ',
    hr: 'ເສັ້ນຂັ້ນ',
    sample_bold: 'ຂໍ້ຄວາມຕົວໜາ',
    sample_italic: 'ຂໍ້ຄວາມຕົວອຽງ',
    sample_underline: 'ຂໍ້ຄວາມຂີດກ້ອງ',
    sample_strike: 'ຂໍ້ຄວາມຂີດຂ້າ',
    sample_h1: 'ຫົວຂໍ້ໃຫຍ່',
    sample_h2: 'ຫົວຂໍ້ຍ່ອຍ',
    sample_bullet: 'ລາຍການ',
    sample_numbered: 'ລາຍການທີ 1',
    sample_quote: 'ຄຳເວົ້າອ້າງອີງສຳຄັນ',
    sample_highlight: 'ເນັ້ນຂໍ້ຄວາມ',
  },
  'mn': {
    markdown_supported: 'Markdown форматыг дэмжинэ',
    tab_edit: 'Засах',
    tab_preview: 'Урьдчилан харах',
    preview_empty: 'Урьдчилан харах агуулга байхгүй байна. [Засах] таб дээр бичнэ үү.',
    shortcuts_hint: 'Товчлол: **Тодруулах**, *Налуу*, # Гарчиг, - Жагсаалт, [Холбоос](URL)',
    preview_hint: '👁️ Бодит цагийн харагдац',
    char_count: ' тэмдэгт',
    prompt_url: 'Вэбсайтын холбоос (URL) оруулна уу:',
    prompt_default_text: 'Энд дарна уу',
    bold: 'Тодруулах',
    italic: 'Налуу',
    underline: 'Доогуур зураас',
    strike: 'Дундуур зураас',
    h1: 'Том гарчиг (H1)',
    h2: 'Дэд гарчиг (H2)',
    bullet_list: 'Цэгтэй жагсаалт',
    numbered_list: 'Дугаарласан жагсаалт',
    quote: 'Ишлэл',
    highlight: 'Тодруулагч',
    link: 'Холбоос оруулах',
    hr: 'Тусгаарлах шугам',
    sample_bold: 'Тодруулсан текст',
    sample_italic: 'Налуу текст',
    sample_underline: 'Доогуур зураастай текст',
    sample_strike: 'Дундуур зураастай текст',
    sample_h1: 'Том гарчиг',
    sample_h2: 'Дэд гарчиг',
    sample_bullet: 'Жагсаалтын зүйл',
    sample_numbered: 'Нэгдүгээр зүйл',
    sample_quote: 'Чухал ишлэл',
    sample_highlight: 'Тодруулга',
  },
}

export function getEditorI18n(locale: string = 'ko'): EditorI18n {
  return EDITOR_I18N[locale] || EDITOR_I18N['en'] || EDITOR_I18N['ko']
}

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  themeColor?: 'emerald' | 'sky' | 'blue'
  required?: boolean
  label?: string
  minHeight?: string
  locale?: string
}

// 🎨 안전하고 미려한 마크다운/서식 렌더러
export function RichTextRenderer({ content, className = '' }: { content: string; className?: string }) {
  if (!content) return null

  // 라인 단위 파싱
  const lines = content.split('\n')
  const renderedElements: React.ReactNode[] = []

  let inList: 'bullet' | 'ordered' | null = null
  let listItems: React.ReactNode[] = []

  const flushList = (keyPrefix: number) => {
    if (inList === 'bullet') {
      renderedElements.push(
        <ul key={`ul-${keyPrefix}`} className="list-disc ml-5 my-2 space-y-1 text-gray-700">
          {listItems}
        </ul>
      )
    } else if (inList === 'ordered') {
      renderedElements.push(
        <ol key={`ol-${keyPrefix}`} className="list-decimal ml-5 my-2 space-y-1 text-gray-700">
          {listItems}
        </ol>
      )
    }
    inList = null
    listItems = []
  }

  // 인라인 서식 파서 (Bold, Italic, Underline, Strike, Highlight, Link)
  const parseInline = (text: string): React.ReactNode => {
    // 1. 링크 변환 [텍스트](URL)
    const linkRegex = /\[(.*?)\]\((https?:\/\/.*?)\)/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(parseFormatting(text.substring(lastIndex, match.index)))
      }
      const linkLabel = match[1] || match[2]
      const linkHref = match[2]
      parts.push(
        <a
          key={`link-${match.index}`}
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {linkLabel} ↗
        </a>
      )
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      parts.push(parseFormatting(text.substring(lastIndex)))
    }

    return parts.length > 0 ? parts : text
  }

  // 기본 인라인 태그 변환
  const parseFormatting = (str: string): React.ReactNode => {
    // 정규식 치환을 위해 HTML 태그 파싱 지원
    // **굵게**, *기울임*, <u>밑줄</u>, ~~취소선~~, ==형광펜==
    let formatted = str
    // <u>밑줄</u>
    formatted = formatted.replace(/<u>(.*?)<\/u>/gi, '###U_START###$1###U_END###')
    // **굵게**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '###B_START###$1###B_END###')
    // *기울임*
    formatted = formatted.replace(/\*(.*?)\*/g, '###I_START###$1###I_END###')
    // ~~취소선~~
    formatted = formatted.replace(/~~(.*?)~~/g, '###S_START###$1###S_END###')
    // ==하이라이트==
    formatted = formatted.replace(/==(.*?)==/g, '###H_START###$1###H_END###')

    const tokens = formatted.split(/(###[A-Z]+_(?:START|END)###)/)
    const result: React.ReactNode[] = []

    let isBold = false
    let isItalic = false
    let isUnderline = false
    let isStrike = false
    let isHighlight = false

    tokens.forEach((token, idx) => {
      if (token === '###B_START###') { isBold = true; return }
      if (token === '###B_END###') { isBold = false; return }
      if (token === '###I_START###') { isItalic = true; return }
      if (token === '###I_END###') { isItalic = false; return }
      if (token === '###U_START###') { isUnderline = true; return }
      if (token === '###U_END###') { isUnderline = false; return }
      if (token === '###S_START###') { isStrike = true; return }
      if (token === '###S_END###') { isStrike = false; return }
      if (token === '###H_START###') { isHighlight = true; return }
      if (token === '###H_END###') { isHighlight = false; return }

      if (!token) return

      let node: React.ReactNode = token
      if (isBold) node = <strong key={`b-${idx}`} className="font-bold text-gray-900">{node}</strong>
      if (isItalic) node = <em key={`i-${idx}`} className="italic">{node}</em>
      if (isUnderline) node = <u key={`u-${idx}`} className="underline underline-offset-2">{node}</u>
      if (isStrike) node = <del key={`s-${idx}`} className="line-through text-gray-400">{node}</del>
      if (isHighlight) node = <mark key={`h-${idx}`} className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-medium">{node}</mark>

      result.push(node)
    })

    return result.length > 0 ? result : str
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()

    // 1. 대제목 (# H1)
    if (trimmed.startsWith('# ')) {
      flushList(idx)
      renderedElements.push(
        <h3 key={`h1-${idx}`} className="text-lg sm:text-xl font-black text-gray-900 my-2.5 pb-1 border-b border-gray-100">
          {parseInline(trimmed.substring(2))}
        </h3>
      )
      return
    }

    // 2. 중제목 (## H2)
    if (trimmed.startsWith('## ')) {
      flushList(idx)
      renderedElements.push(
        <h4 key={`h2-${idx}`} className="text-base font-extrabold text-gray-900 my-2">
          {parseInline(trimmed.substring(3))}
        </h4>
      )
      return
    }

    // 3. 소제목 (### H3)
    if (trimmed.startsWith('### ')) {
      flushList(idx)
      renderedElements.push(
        <h5 key={`h3-${idx}`} className="text-sm font-bold text-gray-800 my-1.5">
          {parseInline(trimmed.substring(4))}
        </h5>
      )
      return
    }

    // 4. 구분선 (---)
    if (trimmed === '---' || trimmed === '***') {
      flushList(idx)
      renderedElements.push(<hr key={`hr-${idx}`} className="my-3 border-gray-200" />)
      return
    }

    // 5. 인용구 (> Blockquote)
    if (trimmed.startsWith('> ')) {
      flushList(idx)
      renderedElements.push(
        <blockquote
          key={`quote-${idx}`}
          className="my-2 pl-3 py-1.5 border-l-4 border-emerald-500 bg-emerald-50/60 rounded-r-xl text-gray-700 italic text-xs sm:text-sm"
        >
          {parseInline(trimmed.substring(2))}
        </blockquote>
      )
      return
    }

    // 6. 글머리 기호 (- 또는 *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (inList !== 'bullet') {
        flushList(idx)
        inList = 'bullet'
      }
      listItems.push(
        <li key={`li-b-${idx}`} className="text-xs sm:text-sm leading-relaxed">
          {parseInline(trimmed.substring(2))}
        </li>
      )
      return
    }

    // 7. 번호 매기기 (1. 2. 3.)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
    if (numMatch) {
      if (inList !== 'ordered') {
        flushList(idx)
        inList = 'ordered'
      }
      listItems.push(
        <li key={`li-o-${idx}`} className="text-xs sm:text-sm leading-relaxed">
          {parseInline(numMatch[2])}
        </li>
      )
      return
    }

    // 일반 문장
    flushList(idx)
    if (!trimmed) {
      renderedElements.push(<div key={`br-${idx}`} className="h-2" />)
    } else {
      renderedElements.push(
        <p key={`p-${idx}`} className="text-xs sm:text-sm leading-relaxed text-gray-700 my-0.5">
          {parseInline(line)}
        </p>
      )
    }
  })

  flushList(lines.length)

  return <div className={`rich-text-content space-y-1 ${className}`}>{renderedElements}</div>
}


export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  rows = 6,
  themeColor = 'emerald',
  required = false,
  label,
  minHeight = '140px',
  locale = 'ko',
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const edT = getEditorI18n(locale)

  // 테마별 스타일
  const themeStyles = {
    emerald: {
      borderFocus: 'focus:ring-emerald-500 focus:border-emerald-500',
      tabActive: 'bg-emerald-600 text-white shadow-2xs',
      toolHover: 'hover:bg-emerald-50 hover:text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    sky: {
      borderFocus: 'focus:ring-sky-500 focus:border-sky-500',
      tabActive: 'bg-sky-600 text-white shadow-2xs',
      toolHover: 'hover:bg-sky-50 hover:text-sky-700',
      badge: 'bg-sky-100 text-sky-800',
    },
    blue: {
      borderFocus: 'focus:ring-blue-500 focus:border-blue-500',
      tabActive: 'bg-blue-600 text-white shadow-2xs',
      toolHover: 'hover:bg-blue-50 hover:text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
    },
  }[themeColor]

  // 마크다운 서식 삽입기
  const insertFormat = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)
    const textToInsert = selected || defaultText

    const replacement = `${before}${textToInsert}${after}`
    const newValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      const newCursorStart = start + before.length
      const newCursorEnd = newCursorStart + textToInsert.length
      textarea.setSelectionRange(newCursorStart, newCursorEnd)
    }, 10)
  }

  // 링크 삽입
  const handleInsertLink = () => {
    const textarea = textareaRef.current
    const start = textarea?.selectionStart || 0
    const end = textarea?.selectionEnd || 0
    const selected = value.substring(start, end)

    const url = window.prompt(edT.prompt_url, 'https://')
    if (!url) return

    const linkText = selected || edT.prompt_default_text
    const linkMd = `[${linkText}](${url.trim()})`
    const newValue = value.substring(0, start) + linkMd + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea?.focus()
    }, 10)
  }

  const effectivePlaceholder = placeholder || (locale === 'en' ? 'Write content...' : '내용을 작성해 주세요...')

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-700">{label}</label>
          <span className="text-[11px] text-gray-400">{edT.markdown_supported}</span>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-opacity-80 transition-all">
        {/* 상단 툴바 */}
        <div className="flex flex-wrap items-center justify-between gap-1 px-2.5 py-1.5 bg-gray-50/90 border-b border-gray-200 text-gray-600">
          <div className="flex flex-wrap items-center gap-0.5">
            {/* 굵게 */}
            <button
              type="button"
              onClick={() => insertFormat('**', '**', edT.sample_bold)}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.bold}
            >
              <Bold size={14} />
            </button>

            {/* 기울임 */}
            <button
              type="button"
              onClick={() => insertFormat('*', '*', edT.sample_italic)}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.italic}
            >
              <Italic size={14} />
            </button>

            {/* 밑줄 */}
            <button
              type="button"
              onClick={() => insertFormat('<u>', '</u>', edT.sample_underline)}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.underline}
            >
              <UnderlineIcon size={14} />
            </button>

            {/* 취소선 */}
            <button
              type="button"
              onClick={() => insertFormat('~~', '~~', edT.sample_strike)}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.strike}
            >
              <Strikethrough size={14} />
            </button>

            <span className="w-px h-4 bg-gray-300 mx-1" />

            {/* 대제목 H1 */}
            <button
              type="button"
              onClick={() => insertFormat('\n# ', '\n', edT.sample_h1)}
              className={`p-1.5 rounded-lg text-gray-700 font-black text-xs transition-colors ${themeStyles.toolHover} flex items-center gap-0.5`}
              title={edT.h1}
            >
              <Heading1 size={14} />
            </button>

            {/* 중제목 H2 */}
            <button
              type="button"
              onClick={() => insertFormat('\n## ', '\n', edT.sample_h2)}
              className={`p-1.5 rounded-lg text-gray-700 font-black text-xs transition-colors ${themeStyles.toolHover} flex items-center gap-0.5`}
              title={edT.h2}
            >
              <Heading2 size={14} />
            </button>

            <span className="w-px h-4 bg-gray-300 mx-1" />

            {/* 글머리 기호 */}
            <button
              type="button"
              onClick={() => insertFormat('\n- ', '', edT.sample_bullet)}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.bullet_list}
            >
              <List size={14} />
            </button>

            {/* 숫자 목록 */}
            <button
              type="button"
              onClick={() => insertFormat('\n1. ', '', edT.sample_numbered)}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.numbered_list}
            >
              <ListOrdered size={14} />
            </button>

            {/* 인용구 */}
            <button
              type="button"
              onClick={() => insertFormat('\n> ', '', edT.sample_quote)}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.quote}
            >
              <Quote size={13} />
            </button>

            {/* 형광펜 강조 */}
            <button
              type="button"
              onClick={() => insertFormat('==', '==', edT.sample_highlight)}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.highlight}
            >
              <Highlighter size={13} />
            </button>

            {/* 링크 삽입 */}
            <button
              type="button"
              onClick={handleInsertLink}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.link}
            >
              <Link2 size={14} />
            </button>

            {/* 구분선 */}
            <button
              type="button"
              onClick={() => insertFormat('\n---\n', '', '')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title={edT.hr}
            >
              <Minus size={14} />
            </button>
          </div>

          {/* 우측 편집 / 미리보기 탭 전환 */}
          <div className="flex items-center gap-1 bg-gray-200/70 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'edit' ? themeStyles.tabActive : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PenTool size={11} />
              <span>{edT.tab_edit}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'preview' ? themeStyles.tabActive : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye size={11} />
              <span>{edT.tab_preview}</span>
            </button>
          </div>
        </div>

        {/* 텍스트 입력창 또는 실시간 미리보기 */}
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            required={required}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={effectivePlaceholder}
            style={{ minHeight }}
            className="w-full p-3.5 text-xs text-gray-800 bg-white placeholder-gray-400 focus:outline-none leading-relaxed resize-y"
          />
        ) : (
          <div
            style={{ minHeight }}
            className="p-4 bg-gray-50/50 overflow-y-auto max-h-80 border-t border-gray-100"
          >
            {value.trim() ? (
              <RichTextRenderer content={value} />
            ) : (
              <p className="text-xs text-gray-400 italic">{edT.preview_empty}</p>
            )}
          </div>
        )}

        {/* 하단 글자수 및 안내 바 */}
        <div className="px-3 py-1.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>
            {activeTab === 'edit' ? edT.shortcuts_hint : edT.preview_hint}
          </span>
          <span className="font-mono">{value.length}{edT.char_count}</span>
        </div>
      </div>
    </div>
  )
}
