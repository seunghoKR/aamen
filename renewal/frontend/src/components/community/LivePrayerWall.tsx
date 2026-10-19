'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Heart,
  Globe,
  Share2,
  Flame,
  Check,
  Copy,
  ArrowRight,
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  PenSquare,
  Shield,
  Trash2,
  X,
  RefreshCw,
  User,
  Pencil,
} from 'lucide-react'
import { MemberLevel, defaultTierSettings } from '@/lib/store'
import { getStoredTierLevel, TIER_EVENT_NAME, TIER_STORAGE_KEY } from '@/components/common/GlobalTierSimulator'
import { getStoredUser } from '@/lib/auth'
import { NATIONS_15 } from './communityI18n'
import { translateTitleTo15Languages } from '@/lib/gemini'

// ============================================================================
// 15개국 실시간 기도의 벽 다국어 사전 (PRAYER_I18N)
// ============================================================================
interface PrayerI18nStrings {
  prayer_wall: string
  submit_prayer: string
  view_all_prayers: string
  modal_create_title: string
  modal_edit_title: string
  modal_subtitle: string
  label_title: string
  placeholder_title: string
  label_content: string
  placeholder_content: string
  label_urgent: string
  badge_urgent: string
  hint_urgent: string
  btn_cancel: string
  btn_submit: string
  btn_save: string
  submitting: string
  updating: string
  toast_translating: string
  toast_create_success: string
  toast_update_success: string
  toast_delete_confirm: string
  toast_delete_success: string
  toast_empty_error: string
  toast_guest: string
  toast_associate: string
  btn_edit: string
  btn_delete: string
  empty_title: string
  empty_desc: string
  btn_first_submit: string
  btn_amen: string
  btn_pray: string
}

const PRAYER_I18N: Record<string, PrayerI18nStrings> = {
  ko: {
    prayer_wall: '실시간 기도의 벽',
    submit_prayer: '기도제목 나누기',
    view_all_prayers: '기도제목 전체보기',
    modal_create_title: '중보 기도제목 나누기',
    modal_edit_title: '중보 기도제목 수정',
    modal_subtitle: '아시아 15개국 메노나이트 지체들과 함께 기도로 동역합니다',
    label_title: '기도제목',
    placeholder_title: '예: 미얀마 신학 교육 및 평화 워크숍을 위한 기도',
    label_content: '상세내용',
    placeholder_content: '함께 기도하고 싶은 상황과 구체적인 중보 기도제목을 나눠주세요.\n(등록된 기도제목은 실시간 기도의 벽에 게시되며 전 아시아 성도들이 함께 기도합니다)',
    label_urgent: '긴급 중보기도 요청',
    badge_urgent: '긴급 중보',
    hint_urgent: '상단 우선 노출',
    btn_cancel: '취소',
    btn_submit: '기도제목 등록하기',
    btn_save: '수정 완료',
    submitting: '등록 중...',
    updating: '수정 중...',
    toast_translating: '🌐 15개국 언어로 기도제목 자동 번역 중...',
    toast_create_success: '🙏 중보 기도제목이 은혜 가운데 등록되었습니다. 함께 기도합니다!',
    toast_update_success: '기도제목이 성공적으로 수정되었습니다.',
    toast_delete_confirm: '이 기도제목을 삭제하시겠습니까?',
    toast_delete_success: '기도제목이 성공적으로 삭제되었습니다.',
    toast_empty_error: '⚠️ 기도제목과 상세내용을 모두 입력해 주세요.',
    toast_guest: '비회원은 로그인 후 기도제목을 작성하실 수 있습니다.',
    toast_associate: '준회원은 열람만 가능하며, 2단계(정회원) 승인 후 작성이 가능합니다.',
    btn_edit: '수정',
    btn_delete: '삭제',
    empty_title: '등록된 중보 기도제목이 없습니다.',
    empty_desc: '첫 번째 기도제목을 작성하여 아시아 15개국 성도들과 함께 기도해 보세요.',
    btn_first_submit: '첫 기도제목 등록하기',
    btn_amen: '아멘 (기도동참)',
    btn_pray: '저도 기도할께요',
  },
  en: {
    prayer_wall: 'Live Prayer Wall',
    submit_prayer: 'Share Prayer Request',
    view_all_prayers: 'View All Prayers',
    modal_create_title: 'Share Prayer Request',
    modal_edit_title: 'Edit Prayer Request',
    modal_subtitle: 'Partnering in prayer across 15 Asian Mennonite nations',
    label_title: 'Prayer Title',
    placeholder_title: 'e.g., Pray for peace workshops and theological education',
    label_content: 'Details',
    placeholder_content: 'Share specific prayer requests and situations you want us to uphold in prayer.',
    label_urgent: 'Urgent Prayer Request',
    badge_urgent: 'URGENT',
    hint_urgent: 'Priority display',
    btn_cancel: 'Cancel',
    btn_submit: 'Submit Prayer',
    btn_save: 'Save Changes',
    submitting: 'Submitting...',
    updating: 'Updating...',
    toast_translating: '🌐 Auto-translating prayer title into 15 languages...',
    toast_create_success: '🙏 Prayer request submitted in grace. Let us pray together!',
    toast_update_success: 'Prayer request updated successfully.',
    toast_delete_confirm: 'Are you sure you want to delete this prayer request?',
    toast_delete_success: 'Prayer request deleted successfully.',
    toast_empty_error: '⚠️ Please enter both prayer title and details.',
    toast_guest: 'Guests must log in to submit a prayer request.',
    toast_associate: 'Associate members can view. Level 2 (Regular) approval required to post.',
    btn_edit: 'Edit',
    btn_delete: 'Delete',
    empty_title: 'No prayer requests posted yet.',
    empty_desc: 'Be the first to share a prayer request with believers across 15 Asian nations.',
    btn_first_submit: 'Submit First Prayer',
    btn_amen: 'Amen',
    btn_pray: 'I will pray too',
  },
  ja: {
    prayer_wall: 'リアルタイム祈りの壁',
    submit_prayer: '祈りの題目を分かち合う',
    view_all_prayers: '祈りの題目をすべて見る',
    modal_create_title: 'とりなしの祈りを分かち合う',
    modal_edit_title: '祈りの題目の修正',
    modal_subtitle: 'アジア15カ国のメノナイトの仲間と共に祈りで支え合います',
    label_title: '祈りの題目',
    placeholder_title: '例: ミャンマー神学教育と平和構築のための祈り',
    label_content: '詳細内容',
    placeholder_content: '共に祈りたい具体的な状況やとりなしの祈りの題目を共有してください。',
    label_urgent: '緊急とりなしの祈り要請',
    badge_urgent: '緊急祈祷',
    hint_urgent: '上部優先表示',
    btn_cancel: 'キャンセル',
    btn_submit: '祈りの題目を登録',
    btn_save: '変更を保存',
    submitting: '登録中...',
    updating: '修正中...',
    toast_translating: '🌐 15カ国語に祈りの題目を自動翻訳中...',
    toast_create_success: '🙏 とりなしの祈りが恵みのうちに登録されました。共に祈ります！',
    toast_update_success: '祈りの題目が正常に修正されました。',
    toast_delete_confirm: 'この祈りの題目を削除してもよろしいですか？',
    toast_delete_success: '祈りの題目が削除されました。',
    toast_empty_error: '⚠️ 祈りの題目と詳細内容の両方を入力してください。',
    toast_guest: 'ログイン後に祈りの題目を作成できます。',
    toast_associate: '準会員は閲覧のみ可能です。正会員承認後に作成できます。',
    btn_edit: '修正',
    btn_delete: '削除',
    empty_title: '登録された祈りの題目はありません。',
    empty_desc: '最初の祈りの題目を投稿して、アジア15カ国の信徒たちと共に祈りましょう。',
    btn_first_submit: '最初の祈りを登録',
    btn_amen: 'アーメン',
    btn_pray: '私も祈ります',
  },
  'zh-TW': {
    prayer_wall: '即時代禱牆',
    submit_prayer: '分享代禱事項',
    view_all_prayers: '查看全部代禱',
    modal_create_title: '分享代禱事項',
    modal_edit_title: '修改代禱事項',
    modal_subtitle: '與亞洲15國門諾會弟兄姊妹同心代禱',
    label_title: '代禱標題',
    placeholder_title: '例：為緬甸神學教育與和平培育事工代禱',
    label_content: '詳細內容',
    placeholder_content: '請分享需要一同守望的具體情況與代禱題目。',
    label_urgent: '緊急代禱請求',
    badge_urgent: '緊急代禱',
    hint_urgent: '置頂優先顯示',
    btn_cancel: '取消',
    btn_submit: '發佈代禱事項',
    btn_save: '儲存變更',
    submitting: '提交中...',
    updating: '更新中...',
    toast_translating: '🌐 正在自動翻譯為15國語言標題...',
    toast_create_success: '🙏 代禱事項已蒙恩發佈，願主同在！',
    toast_update_success: '代禱事項已成功修改。',
    toast_delete_confirm: '確定要刪除這條代禱事項嗎？',
    toast_delete_success: '代禱事項已成功刪除。',
    toast_empty_error: '⚠️ 請完整填寫代禱標題與詳細內容。',
    toast_guest: '訪客需登入後方可發佈代禱事項。',
    toast_associate: '準會員僅可瀏覽，成為正會員後可發佈。',
    btn_edit: '編輯',
    btn_delete: '刪除',
    empty_title: '暫無發佈的代禱事項。',
    empty_desc: '發佈第一個代禱題目，與亞洲15國信徒一同禱告。',
    btn_first_submit: '發佈首條代禱',
    btn_amen: '阿們',
    btn_pray: '我也同心代禱',
  },
  'zh-HK': {
    prayer_wall: '即時代禱牆',
    submit_prayer: '分享代禱事項',
    view_all_prayers: '查看全部代禱',
    modal_create_title: '分享代禱事項',
    modal_edit_title: '修改代禱事項',
    modal_subtitle: '與亞洲15國門諾會弟兄姊妹同心代禱',
    label_title: '代禱標題',
    placeholder_title: '例：為緬甸神學教育與和平培育事工代禱',
    label_content: '詳細內容',
    placeholder_content: '請分享需要一同守望的具體情況與代禱題目。',
    label_urgent: '緊急代禱請求',
    badge_urgent: '緊急代禱',
    hint_urgent: '置頂優先顯示',
    btn_cancel: '取消',
    btn_submit: '發佈代禱事項',
    btn_save: '儲存變更',
    submitting: '提交中...',
    updating: '更新中...',
    toast_translating: '🌐 正在自動翻譯為15國語言標題...',
    toast_create_success: '🙏 代禱事項已蒙恩發佈，願主同在！',
    toast_update_success: '代禱事項已成功修改。',
    toast_delete_confirm: '確定要刪除這條代禱事項嗎？',
    toast_delete_success: '代禱事項已成功刪除。',
    toast_empty_error: '⚠️ 請完整填寫代禱標題與詳細內容。',
    toast_guest: '訪客需登入後方可發佈代禱事項。',
    toast_associate: '準會員僅可瀏覽，成為正會員後可發佈。',
    btn_edit: '編輯',
    btn_delete: '刪除',
    empty_title: '暫無發佈的代禱事項。',
    empty_desc: '發佈第一個代禱題目，與亞洲15國信徒一同禱告。',
    btn_first_submit: '發佈首條代禱',
    btn_amen: '阿們',
    btn_pray: '我也同心代禱',
  },
  vi: {
    prayer_wall: 'Bức Tường Cầu Nguyện Trực Tiếp',
    submit_prayer: 'Chia sẻ lời cầu nguyện',
    view_all_prayers: 'Xem tất cả lời cầu nguyện',
    modal_create_title: 'Chia sẻ lời cầu nguyện',
    modal_edit_title: 'Chỉnh sửa lời cầu nguyện',
    modal_subtitle: 'Hiệp một cầu nguyện cùng các tín hữu Mennonite tại 15 quốc gia Châu Á',
    label_title: 'Tiêu đề cầu nguyện',
    placeholder_title: 'VD: Cầu nguyện cho giáo dục thần học và hòa bình tại Myanmar',
    label_content: 'Chi tiết',
    placeholder_content: 'Chia sẻ hoàn cảnh và các vấn đề cụ thể để cộng đồng cùng cầu thay.',
    label_urgent: 'Yêu cầu cầu nguyện khẩn cấp',
    badge_urgent: 'KHẨN CẤP',
    hint_urgent: 'Hiển thị ưu tiên hàng đầu',
    btn_cancel: 'Hủy',
    btn_submit: 'Gửi lời cầu nguyện',
    btn_save: 'Lưu thay đổi',
    submitting: 'Đang gửi...',
    updating: 'Đang cập nhật...',
    toast_translating: '🌐 Đang tự động dịch tiêu đề sang 15 ngôn ngữ...',
    toast_create_success: '🙏 Lời cầu nguyện đã được gửi đi trong ân điển. Cùng hiệp nguyện!',
    toast_update_success: 'Cập nhật lời cầu nguyện thành công.',
    toast_delete_confirm: 'Bạn có chắc chắn muốn xóa lời cầu nguyện này?',
    toast_delete_success: 'Đã xóa lời cầu nguyện thành công.',
    toast_empty_error: '⚠️ Vui lòng nhập cả tiêu đề và nội dung chi tiết.',
    toast_guest: 'Khách vui lòng đăng nhập để gửi lời cầu nguyện.',
    toast_associate: 'Hội viên liên kết chỉ có thể xem. Cần xét duyệt chính thức để đăng bài.',
    btn_edit: 'Sửa',
    btn_delete: 'Xóa',
    empty_title: 'Chưa có lời cầu nguyện nào được đăng.',
    empty_desc: 'Hãy là người đầu tiên chia sẻ lời cầu nguyện với 15 quốc gia Châu Á.',
    btn_first_submit: 'Đăng lời cầu nguyện đầu tiên',
    btn_amen: 'Amen',
    btn_pray: 'Tôi cũng sẽ cầu nguyện',
  },
  th: {
    prayer_wall: 'กำแพงอธิษฐานสด',
    submit_prayer: 'แบ่งปันหัวข้ออธิษฐาน',
    view_all_prayers: 'ดูหัวข้ออธิษฐานทั้งหมด',
    modal_create_title: 'แบ่งปันหัวข้ออธิษฐาน',
    modal_edit_title: 'แก้ไขหัวข้ออธิษฐาน',
    modal_subtitle: 'ร่วมอธิษฐานกับพี่น้องคริสตจักรเมนโนไนต์ใน 15 ประเทศเอเชีย',
    label_title: 'หัวข้ออธิษฐาน',
    placeholder_title: 'เช่น อธิษฐานเพื่อการศึกษาศาสนศาสตร์และการสร้างสันติในเมียนมา',
    label_content: 'รายละเอียด',
    placeholder_content: 'แบ่งปันสถานการณ์และหัวข้ออธิษฐานที่ต้องการให้พี่น้องร่วมสนับสนุนด้วยการอธิษฐาน',
    label_urgent: 'ขออธิษฐานฉุกเฉิน',
    badge_urgent: 'ฉุกเฉิน',
    hint_urgent: 'แสดงผลลำดับแรก',
    btn_cancel: 'ยกเลิก',
    btn_submit: 'ส่งหัวข้ออธิษฐาน',
    btn_save: 'บันทึกการแก้ไข',
    submitting: 'กำลังส่ง...',
    updating: 'กำลังแก้ไข...',
    toast_translating: '🌐 กำลังแปลหัวข้ออธิษฐานเป็น 15 ภาษาโดยอัตโนมัติ...',
    toast_create_success: '🙏 บันทึกหัวข้ออธิษฐานเรียบร้อยแล้ว ขอร่วมอธิษฐานด้วยกัน!',
    toast_update_success: 'แก้ไขหัวข้ออธิษฐานเรียบร้อยแล้ว',
    toast_delete_confirm: 'คุณแน่ใจหรือไม่ว่าต้องการลบหัวข้ออธิษฐานนี้?',
    toast_delete_success: 'ลบหัวข้ออธิษฐานเรียบร้อยแล้ว',
    toast_empty_error: '⚠️ กรุณาระบุทั้งหัวข้อและรายละเอียดให้ครบถ้วน',
    toast_guest: 'ผู้เยี่ยมชมต้องเข้าสู่ระบบก่อนส่งหัวข้ออธิษฐาน',
    toast_associate: 'สมาชิกสมทบสามารถดูได้เท่านั้น ต้องเป็นสมาชิกระดับ 2 เพื่อส่งหัวข้อ',
    btn_edit: 'แก้ไข',
    btn_delete: 'ลบ',
    empty_title: 'ยังไม่มีหัวข้ออธิษฐาน',
    empty_desc: 'ร่วมแบ่งปันหัวข้ออธิษฐานแรกกับผู้เชื่อใน 15 ประเทศทั่วเอเชีย',
    btn_first_submit: 'ส่งหัวข้ออธิษฐานแรก',
    btn_amen: 'อาเมน',
    btn_pray: 'ฉันจะร่วมอธิษฐานด้วย',
  },
  id: {
    prayer_wall: 'Dinding Doa Langsung',
    submit_prayer: 'Bagikan Pokok Doa',
    view_all_prayers: 'Lihat Semua Doa',
    modal_create_title: 'Bagikan Pokok Doa',
    modal_edit_title: 'Ubah Pokok Doa',
    modal_subtitle: 'Bermitra dalam doa bersama saudara-saudari Mennonite di 15 negara Asia',
    label_title: 'Judul Doa',
    placeholder_title: 'Cth: Doa untuk pendidikan teologi dan bina damai di Myanmar',
    label_content: 'Rincian',
    placeholder_content: 'Bagikan situasi dan pokok doa khusus yang ingin didukung dalam doa bersama.',
    label_urgent: 'Permintaan Doa Mendesak',
    badge_urgent: 'MENDESAK',
    hint_urgent: 'Tampilan prioritas',
    btn_cancel: 'Batal',
    btn_submit: 'Kirim Pokok Doa',
    btn_save: 'Simpan Perubahan',
    submitting: 'Mengirim...',
    updating: 'Memperbarui...',
    toast_translating: '🌐 Menerjemahkan judul doa secara otomatis ke 15 bahasa...',
    toast_create_success: '🙏 Pokok doa telah didaftarkan dalam anugerah. Mari berdoa bersama!',
    toast_update_success: 'Pokok doa berhasil diperbarui.',
    toast_delete_confirm: 'Apakah Anda yakin ingin menghapus pokok doa ini?',
    toast_delete_success: 'Pokok doa berhasil dihapus.',
    toast_empty_error: '⚠️ Harap isi judul dan rincian doa.',
    toast_guest: 'Tamu harus masuk untuk mengirim pokok doa.',
    toast_associate: 'Anggota asosiasi hanya dapat membaca. Diperlukan persetujuan reguler untuk memposting.',
    btn_edit: 'Ubah',
    btn_delete: 'Hapus',
    empty_title: 'Belum ada pokok doa yang dibagikan.',
    empty_desc: 'Jadilah yang pertama membagikan pokok doa kepada saudara seiman di 15 negara Asia.',
    btn_first_submit: 'Kirim Pokok Doa Pertama',
    btn_amen: 'Amin',
    btn_pray: 'Saya juga akan berdoa',
  },
  my: {
    prayer_wall: 'တိုက်ရိုက် ဆုတောင်းခြင်း နံရံ',
    submit_prayer: 'ဆုတောင်းခြင်း အကြောင်းအရာ မျှဝေရန်',
    view_all_prayers: 'ဆုတောင်းချက် အားလုံးကြည့်ရန်',
    modal_create_title: 'ဆုတောင်းခြင်း အကြောင်းအရာ မျှဝေရန်',
    modal_edit_title: 'ဆုတောင်းခြင်း အကြောင်းအရာ ပြင်ဆင်ရန်',
    modal_subtitle: 'အာရှ ၁၅ နိုင်ငံရှိ မန်နိုနိုက်ညီအစ်ကို မောင်နှမများနှင့်အတူ ဆုတောင်းခြင်းဖြင့် ပါဝင်ပါ',
    label_title: 'ဆုတောင်းခြင်း ခေါင်းစဉ်',
    placeholder_title: 'ဥပမာ- မြန်မာနိုင်ငံ ဓမ္မပညာရေးနှင့် ငြိမ်းချမ်းရေးအတွက် ဆုတောင်းခြင်း',
    label_content: 'အသေးစိတ်',
    placeholder_content: 'အတူတကွ ဆုတောင်းလိုသော အခြေအနေနှင့် အကြောင်းအရာများကို မျှဝေပေးပါ။',
    label_urgent: 'အရေးပေါ် ဆုတောင်းမေတ္တာ တောင်းခံခြင်း',
    badge_urgent: 'အရေးပေါ်',
    hint_urgent: 'ထိပ်တန်းဦးစားပေး ပြသခြင်း',
    btn_cancel: 'ပယ်ဖျက်ရန်',
    btn_submit: 'ဆုတောင်းခြင်း တင်သွင်းရန်',
    btn_save: 'ပြင်ဆင်ချက်များ သိမ်းဆည်းရန်',
    submitting: 'တင်သွင်းနေသည်...',
    updating: 'ပြင်ဆင်နေသည်...',
    toast_translating: '🌐 ဘာသာစကား ၁၅ မျိုးသို့ အလိုအလျောက် ဘာသာပြန်နေသည်...',
    toast_create_success: '🙏 ဆုတောင်းချက်ကို ကျေးဇူးတော်၌ မှတ်တမ်းတင်ပြီးပါပြီ။ အတူတကွ ဆုတောင်းကြပါစို့!',
    toast_update_success: 'ဆုတောင်းချက်ကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။',
    toast_delete_confirm: 'ဤဆုတောင်းချက်ကို ဖျက်ရန် သေချာပါသလား။',
    toast_delete_success: 'ဆုတောင်းချက်ကို ဖျက်ပြီးပါပြီ။',
    toast_empty_error: '⚠️ ခေါင်းစဉ်နှင့် အသေးစိတ် နှစ်ခုစလုံးကို ဖြည့်စွက်ပေးပါ။',
    toast_guest: 'ဆုတောင်းချက် တင်သွင်းရန် ဦးစွာ အကောင့်ဝင်ပါ။',
    toast_associate: 'အဆင့် ၂ အတည်ပြုပြီးမှ ဆုတောင်းချက် ရေးသားနိုင်ပါသည်။',
    btn_edit: 'ပြင်ဆင်ရန်',
    btn_delete: 'ဖျက်ရန်',
    empty_title: 'ဆုတောင်းချက် မရှိသေးပါ။',
    empty_desc: 'အာရှ ၁၅ နိုင်ငံရှိ ယုံကြည်သူများနှင့်အတူ ပထမဆုံး ဆုတောင်းချက်ကို မျှဝေပါ။',
    btn_first_submit: 'ပထမဆုံး ဆုတောင်းချက် တင်ရန်',
    btn_amen: 'အာမင်',
    btn_pray: 'ကျွန်ုပ်လည်း ဆုတောင်းပေးပါမည်',
  },
  ne: {
    prayer_wall: 'प्रत्यक्ष प्रार्थना पर्खाल',
    submit_prayer: 'प्रार्थनाका विषयहरू साझा गर्नुहोस्',
    view_all_prayers: 'सबै प्रार्थनाहरू हेर्नुहोस्',
    modal_create_title: 'प्रार्थनाका विषयहरू साझा गर्नुहोस्',
    modal_edit_title: 'प्रार्थना विषय सम्पादन गर्नुहोस्',
    modal_subtitle: 'एसियाका १५ देशका मेनोनाइट विश्वासीहरूसँग प्रार्थनामा सहकार्य गर्नुहोस्',
    label_title: 'प्रार्थना शीर्षक',
    placeholder_title: 'उदा: म्यानमारमा धर्मशास्त्रीय शिक्षा र शान्ति कार्यशालाका लागि प्रार्थना',
    label_content: 'विस्तृत विवरण',
    placeholder_content: 'हामीसँग प्रार्थना गर्न चाहनुभएका विशेष परिस्थितिहरू साझा गर्नुहोस्।',
    label_urgent: 'अत्यावश्यक प्रार्थना अनुरोध',
    badge_urgent: 'अत्यावश्यक',
    hint_urgent: 'शीर्ष प्राथमिकता प्रदर्शन',
    btn_cancel: 'रद्द गर्नुहोस्',
    btn_submit: 'प्रार्थना पेश गर्नुहोस्',
    btn_save: 'परिवर्तनहरू बचत गर्नुहोस्',
    submitting: 'पेश गर्दै...',
    updating: 'अपडेट गर्दै...',
    toast_translating: '🌐 १५ भाषाहरूमा प्रार्थना शीर्षक अनुवाद गरिँदैछ...',
    toast_create_success: '🙏 प्रार्थना अनुरोध अनुग्रहपूर्वक दर्ता गरियो। सँगै प्रार्थना गरौं!',
    toast_update_success: 'प्रार्थना अनुरोध सफलतापूर्वक अद्यावधिक गरियो।',
    toast_delete_confirm: 'के तपाईं यो प्रार्थना अनुरोध मेटाउन निश्चित हुनुहुन्छ?',
    toast_delete_success: 'प्रार्थना अनुरोध सफलतापूर्वक मेटाइयो।',
    toast_empty_error: '⚠️ कृपया शीर्षक र विवरण दुवै भर्नुहोस्।',
    toast_guest: 'प्रार्थना पेश गर्न कृपया लगइन गर्नुहोस्।',
    toast_associate: 'नियमित सदस्य अनुमोदन पछि मात्र पोस्ट गर्न सकिन्छ।',
    btn_edit: 'सम्पादन',
    btn_delete: 'मेटाउनुहोस्',
    empty_title: 'कुनै प्रार्थना अनुरोधहरू उपलब्ध छैनन्।',
    empty_desc: 'एसियाका १५ देशका विश्वासीहरूसँग पहिलो प्रार्थना अनुरोध साझा गर्नुहोस्।',
    btn_first_submit: 'पहिलो प्रार्थना पेश गर्नुहोस्',
    btn_amen: 'आमेन',
    btn_pray: 'म पनि प्रार्थना गर्नेछु',
  },
  hi: {
    prayer_wall: 'सजीव प्रार्थना दीवार',
    submit_prayer: 'प्रार्थना निवेदन साझा करें',
    view_all_prayers: 'सभी प्रार्थनाएं देखें',
    modal_create_title: 'प्रार्थना निवेदन साझा करें',
    modal_edit_title: 'प्रार्थना निवेदन संपादित करें',
    modal_subtitle: 'एशिया के 15 देशों के मेनोनाइट विश्वासियों के साथ प्रार्थना में सहभागिता करें',
    label_title: 'प्रार्थना का शीर्षक',
    placeholder_title: 'उदा: म्यांमार में धर्मशास्त्रीय शिक्षा और शांति कार्यशालाओं के लिए प्रार्थना',
    label_content: 'विस्तृत विवरण',
    placeholder_content: 'उन परिस्थितियों और प्रार्थना विषयों को साझा करें जिनके लिए आप प्रार्थना चाहते हैं।',
    label_urgent: 'अति आवश्यक प्रार्थना निवेदन',
    badge_urgent: 'अति आवश्यक',
    hint_urgent: 'शीर्ष प्राथमिकता',
    btn_cancel: 'रद्द करें',
    btn_submit: 'प्रार्थना भेजें',
    btn_save: 'परिवर्तन सहेजें',
    submitting: 'भेजा जा रहा है...',
    updating: 'अपडेट हो रहा है...',
    toast_translating: '🌐 15 भाषाओं में प्रार्थना शीर्षक का स्वतः अनुवाद किया जा रहा है...',
    toast_create_success: '🙏 प्रार्थना निवेदन अनुग्रह के साथ दर्ज किया गया। आइए मिलकर प्रार्थना करें!',
    toast_update_success: 'प्रार्थना निवेदन सफलतापूर्वक अद्यतित किया गया।',
    toast_delete_confirm: 'क्या आप वाकई इस प्रार्थना निवेदन को हटाना चाहते हैं?',
    toast_delete_success: 'प्रार्थना निवेदन सफलतापूर्वक हटा दिया गया।',
    toast_empty_error: '⚠️ कृपया शीर्षक और विवरण दोनों भरें।',
    toast_guest: 'प्रार्थना निवेदन भेजने के लिए कृपया लॉगिन करें।',
    toast_associate: 'नियमित सदस्य अनुमोदन के बाद ही पोस्ट किया जा सकता है।',
    btn_edit: 'संपादित करें',
    btn_delete: 'हटाएं',
    empty_title: 'कोई प्रार्थना निवेदन पोस्ट नहीं किया गया है।',
    empty_desc: '15 एशियाई देशों के विश्वासियों के साथ पहला प्रार्थना निवेदन साझा करें।',
    btn_first_submit: 'पहला प्रार्थना निवेदन भेजें',
    btn_amen: 'आमीन',
    btn_pray: 'मैं भी प्रार्थना करूँगा',
  },
  km: {
    prayer_wall: 'ជញ្ជាំងអធិស្ឋានផ្ទាល់',
    submit_prayer: 'ចែករំលែកប្រធានបទអធិស្ឋាន',
    view_all_prayers: 'មើលការអធិស្ឋានទាំងអស់',
    modal_create_title: 'ចែករំលែកប្រធានបទអធិស្ឋាន',
    modal_edit_title: 'កែសម្រួលប្រធានបទអធិស្ឋាន',
    modal_subtitle: 'ចូលរួមអធិស្ឋានជាមួយបងប្អូនម៉េណូណាយក្នុង ១៥ ប្រទេសនៅអាស៊ី',
    label_title: 'ចំណងជើងអធិស្ឋាន',
    placeholder_title: 'ឧទាហរណ៍៖ អធិស្ឋានសម្រាប់ការអប់រំទ្រឹស្ដីនិងសិក្ខាសាលាសន្តិភាពនៅមីយ៉ាន់ម៉ា',
    label_content: 'សេចក្ដីលម្អិត',
    placeholder_content: 'ចែករំលែកស្ថានភាពនិងប្រធានបទជាក់លាក់ដែលចង់ឱ្យរួមគ្នាអធិស្ឋាន។',
    label_urgent: 'សំណើអធិស្ឋានបន្ទាន់',
    badge_urgent: 'បន្ទាន់',
    hint_urgent: 'បង្ហាញជាអាទិភាព',
    btn_cancel: 'បោះបង់',
    btn_submit: 'ដាក់ស្នើការអធិស្ឋាន',
    btn_save: 'រក្សាទុកការកែប្រែ',
    submitting: 'កំពុងដាក់ស្នើ...',
    updating: 'កំពុងកែប្រែ...',
    toast_translating: '🌐 កំពុងបកប្រែចំណងជើងអធិស្ឋានជា ១៥ ភាសាដោយស្វ័យប្រវត្តិ...',
    toast_create_success: '🙏 សំណើអធិស្ឋានត្រូវបានដាក់ស្នើដោយព្រះគុណ។ សូមរួមគ្នាអធិស្ឋាន!',
    toast_update_success: 'សំណើអធិស្ឋានត្រូវបានកែប្រែដោយជោគជ័យ។',
    toast_delete_confirm: 'តើអ្នកពិតជាចង់លុបសំណើអធិស្ឋាននេះមែនទេ?',
    toast_delete_success: 'សំណើអធិស្ឋានត្រូវបានលុបដោយជោគជ័យ។',
    toast_empty_error: '⚠️ សូមបញ្ចូលទាំងចំណងជើងនិងសេចក្តីលម្អិត។',
    toast_guest: 'សូមចូលគណនីដើម្បីដាក់ស្នើសំណើអធិស្ឋាន។',
    toast_associate: 'ទាមទារការយល់ព្រមពីសមាជិកពេញសិទ្ធិដើម្បីបង្ហោះ។',
    btn_edit: 'កែប្រែ',
    btn_delete: 'លុប',
    empty_title: 'មិនទាន់មានសំណើអធិស្ឋាននៅឡើយទេ។',
    empty_desc: 'ក្លាយជាអ្នកដំបូងដែលចែករំលែកការអធិស្ឋានជាមួយបងប្អូនទូទាំង ១៥ ប្រទេសនៅអាស៊ី។',
    btn_first_submit: 'ដាក់ស្នើការអធិស្ឋានដំបូង',
    btn_amen: 'អាមែន',
    btn_pray: 'ខ្ញុំក៏នឹងអធិស្ឋានដែរ',
  },
  lo: {
    prayer_wall: 'ກຳແພງອະທິຖານສົດ',
    submit_prayer: 'ແບ່ງປັນຫົວຂໍ້ອະທິຖານ',
    view_all_prayers: 'ເບິ່ງການອະທິຖານທັງໝົດ',
    modal_create_title: 'ແບ່ງປັນຫົວຂໍ້ອະທິຖານ',
    modal_edit_title: 'ແກ້ໄຂຫົວຂໍ້ອະທິຖານ',
    modal_subtitle: 'ຮ່ວມອະທິຖານກັບພີ່ນ້ອງເມນໂນໄນຕ໌ໃນ 15 ປະເທດອາຊີ',
    label_title: 'ຫົວຂໍ້ອະທິຖານ',
    placeholder_title: 'ຕົວຢ່າງ: ອະທິຖານເພື່ອການສຶກສາສາດສະໜາສາດແລະສັນຕິພາບໃນມຽນມາ',
    label_content: 'ລາຍລະອຽດ',
    placeholder_content: 'ແບ່ງປັນສະຖານະການແລະຫົວຂໍ້ອະທິຖານທີ່ຕ້ອງການໃຫ້ອະທິຖານຮ່ວມກັນ.',
    label_urgent: 'ຄຳຮ້ອງຂໍອະທິຖານດ່ວນ',
    badge_urgent: 'ດ່ວນ',
    hint_urgent: 'ສະແດງບູລິມະສິດ',
    btn_cancel: 'ຍົກເລີກ',
    btn_submit: 'ສົ່ງຫົວຂໍ້ອະທິຖານ',
    btn_save: 'ບັນທຶກການປ່ຽນແປງ',
    submitting: 'ກຳລັງສົ່ງ...',
    updating: 'ກຳລັງປັບປຸງ...',
    toast_translating: '🌐 ກຳລັງແປຫົວຂໍ້ອະທິຖານເປັນ 15 ພາສາອັດຕະໂນມັດ...',
    toast_create_success: '🙏 ຫົວຂໍ້ອະທິຖານໄດ້ຖືກບັນທຶກແລ້ວ. ມາຮ່ວມອະທິຖານນຳກັນ!',
    toast_update_success: 'ຫົວຂໍ້ອະທິຖານໄດ້ຮັບການແກ້ໄຂສຳເລັດແລ້ວ.',
    toast_delete_confirm: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຫົວຂໍ້ອະທິຖານນີ້?',
    toast_delete_success: 'ລຶບຫົວຂໍ້ອະທິຖານສຳເລັດແລ້ວ.',
    toast_empty_error: '⚠️ ກະລຸນາປ້ອນທັງຫົວຂໍ້ແລະລາຍລະອຽດ.',
    toast_guest: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນສົ່ງຫົວຂໍ້ອະທິຖານ.',
    toast_associate: 'ຕ້ອງການການອະນຸມັດເປັນສະມາຊິກເຕັມຮູບແບບເພື່ອໂພສ.',
    btn_edit: 'ແກ້ໄຂ',
    btn_delete: 'ລຶບ',
    empty_title: 'ຍັງບໍ່ມີຫົວຂໍ້ອະທິຖານເທື່ອ.',
    empty_desc: 'ຮ່ວມແບ່ງປັນຫົວຂໍ້ອະທິຖານທຳອິດກັບຜູ້ເຊື່ອໃນ 15 ປະເທດອາຊີ.',
    btn_first_submit: 'ສົ່ງຫົວຂໍ້ອະທິຖານທຳອິດ',
    btn_amen: 'ອາແມນ',
    btn_pray: 'ຂ້ອຍກໍ່ຈະອະທິຖານເຊັ່ນກັນ',
  },
  mn: {
    prayer_wall: 'Шууд залбирлын хана',
    submit_prayer: 'Залбирлын хүсэлт хуваалцах',
    view_all_prayers: 'Бүх залбирлыг харах',
    modal_create_title: 'Залбирлын хүсэлт хуваалцах',
    modal_edit_title: 'Залбирлын хүсэлт засах',
    modal_subtitle: 'Азийн 15 орны меннонит итгэгчидтэй хамт залбиралд нэгдэх',
    label_title: 'Залбирлын гарчиг',
    placeholder_title: 'Жишээ нь: Мьянмарын теологийн боловсрол, энх тайвны төлөөх залбирал',
    label_content: 'Дэлгэрэнгүй',
    placeholder_content: 'Хамтдаа залбирахыг хүсэж буй тодорхой нөхцөл байдал, залбирлын сэдвээ хуваалцана уу.',
    label_urgent: 'Яаралтай залбирлын хүсэлт',
    badge_urgent: 'ЯАРАЛТАЙ',
    hint_urgent: 'Дээд талд харуулах',
    btn_cancel: 'Цуцлах',
    btn_submit: 'Залбирал илгээх',
    btn_save: 'Өөрчлөлтийг хадгалах',
    submitting: 'Илгээж байна...',
    updating: 'Шинэчилж байна...',
    toast_translating: '🌐 Залбирлын гарчгийг 15 хэл рүү автоматаар орчуулж байна...',
    toast_create_success: '🙏 Залбирлын хүсэлт нигүүлслээр бүртгэгдлээ. Хамтдаа залбирцгаая!',
    toast_update_success: 'Залбирлын хүсэлтийг амжилттай заслаа.',
    toast_delete_confirm: 'Та энэ залбирлын хүсэлтийг устгахдаа итгэлтэй байна уу?',
    toast_delete_success: 'Залбирлын хүсэлтийг амжилттай устгалаа.',
    toast_empty_error: '⚠️ Гарчиг болон дэлгэрэнгүй хэсгийг хоёуланг нь оруулна уу.',
    toast_guest: 'Залбирал илгээхийн тулд нэвтэрнэ үү.',
    toast_associate: 'Албан ёсны гишүүний зөвшөөрөл авсны дараа нийтлэх боломжтой.',
    btn_edit: 'Засах',
    btn_delete: 'Устгах',
    empty_title: 'Одоогоор залбирлын хүсэлт бүртгэгдээгүй байна.',
    empty_desc: 'Азийн 15 орны итгэгчидтэй хамт залбирах анхны хүсэлтээ хуваалцаарай.',
    btn_first_submit: 'Анхны залбирлыг бүртгэх',
    btn_amen: 'Амен',
    btn_pray: 'Би бас залбиръя',
  },
  tl: {
    prayer_wall: 'Live Prayer Wall',
    submit_prayer: 'Magbahagi ng Kahilingan sa Panalangin',
    view_all_prayers: 'Tingnan Lahat ng Panalangin',
    modal_create_title: 'Magbahagi ng Kahilingan sa Panalangin',
    modal_edit_title: 'I-edit ang Kahilingan sa Panalangin',
    modal_subtitle: 'Makipagkaisa sa panalangin kasama ang mga kapatid na Mennonite sa 15 bansa sa Asya',
    label_title: 'Pamagat ng Panalangin',
    placeholder_title: 'Hal: Panalangin para sa edukasyong teolohiko at kapayapaan sa Myanmar',
    label_content: 'Mga Detalye',
    placeholder_content: 'Ibahagi ang partikular na sitwasyon at mga kahilingan sa panalangin na nais ipanalangin.',
    label_urgent: 'Agarahang Kahilingan sa Panalangin',
    badge_urgent: 'URGENT',
    hint_urgent: 'Unang ipapakita',
    btn_cancel: 'Kanselahin',
    btn_submit: 'Isumite ang Panalangin',
    btn_save: 'I-save ang Pagbabago',
    submitting: 'Isinusumite...',
    updating: 'Ina-update...',
    toast_translating: '🌐 Awtomatikong isinasalin ang pamagat sa 15 wika...',
    toast_create_success: '🙏 Matagumpay na naitala ang kahilingan sa biyaya. Manalangin tayo nang sama-sama!',
    toast_update_success: 'Matagumpay na na-update ang kahilingan sa panalangin.',
    toast_delete_confirm: 'Sigurado ka bang nais mong burahin ang panalanging ito?',
    toast_delete_success: 'Matagumpay na nabura ang panalangin.',
    toast_empty_error: '⚠️ Pakilagay ang parehong pamagat at mga detalye.',
    toast_guest: 'Kailangang mag-log in ng mga bisita upang magsumite ng panalangin.',
    toast_associate: 'Maaari lamang tumingin ang associate member. Kinakailangan ang Regular approval.',
    btn_edit: 'I-edit',
    btn_delete: 'Burahin',
    empty_title: 'Wala pang naitalang kahilingan sa panalangin.',
    empty_desc: 'Maging una sa pagbabahagi ng panalangin sa mga mananampalataya sa 15 bansa sa Asya.',
    btn_first_submit: 'Isumite ang Unang Panalangin',
    btn_amen: 'Amen',
    btn_pray: 'Mananalangin din ako',
  },
}

export interface PrayerItem {
  id: string
  author: string
  authorId?: string
  countryCode: string
  countryName: string
  isLeader?: boolean
  isUrgent?: boolean
  date: string
  title?: string
  rawTitle?: string
  content?: string
  originalLang: string
  originalText: string
  translations: Record<string, string>
  prayCount: number
  extra_json?: any
}

// 6개의 13개국 회원 최근 기도제목 기본 안전 데이터
export const initial6Prayers: PrayerItem[] = [
  {
    id: 'pr_1',
    author: 'Pastor Zaw Min',
    authorId: 'zawmin',
    countryCode: 'MM',
    countryName: '미얀마 (MM)',
    isLeader: true,
    isUrgent: true,
    date: '2026-09-28',
    title: '신학 교육 및 평화 훈련 워크숍을 위한 중보기도',
    rawTitle: '신학 교육 및 평화 훈련 워크숍을 위한 중보기도',
    content:
      '올해 시작되는 신학 교육 프로그램과 평화 훈련 워크숍이 은혜 가운데 열릴 수 있도록 기도 부탁드립니다.\n정치적 불안과 어려운 시국 속에서도 신학생들과 청년들이 흔들리지 않고 그리스도의 평화 복음을 굳건히 배울 수 있도록 중보를 부탁드립니다.',
    originalLang: 'my',
    originalText:
      'ယခုနှစ်တွင် စတင်မည့် ဓမ္မပညာရေး အစီအစဉ်များအတွက်နှင့် ငြိမ်းချမ်းရေးသင်တန်းများ အောင်မြင်စွာ ကျင်းပနိုင်ရန် ဆုတောင်းပေးကြပါရန် မေတ္တာရပ်ခံအပ်ပါသည်။\n정치적 불안과 어려운 시국 속에서도 신학생들과 청년들이 흔들리지 않고 그리스도의 평화 복음을 굳건히 배울 수 있도록 중보를 부탁드립니다.',
    translations: {
      ko: '올해 시작되는 신학 교육 프로그램과 평화 훈련 워크숍이 은혜 가운데 열릴 수 있도록 기도 부탁드립니다.\n정치적 불안과 어려운 시국 속에서도 신학생들과 청년들이 흔들리지 않고 그리스도의 평화 복음을 굳건히 배울 수 있도록 중보를 부탁드립니다.',
      en: 'Please pray for our theological education programs starting this year and for the successful hosting of our peace training workshops.\nMay our students remain steadfast in Christ amid difficult political circumstances.',
      ja: '今年始まる神学教育プログラムと平和構築ワークショップが恵みのうちに実施されるようお祈りください。',
      'zh-TW': '請為我們今年展開的神學教育事工，以及和平培育工作坊能順利舉行代禱。',
      vi: 'Xin cầu nguyện cho chương trình giáo dục thần học và các hội thảo xây dựng hòa bình của chúng tôi trong năm nay.',
      th: 'ขอให้อธิษฐานเผื่อโปรแกรมการศึกษาศาสนศาสตร์และการอบรมการสร้างสันติภาพที่เริ่มขึ้นในปีนี้',
      id: 'Mohon doa untuk program pendidikan teologi dan lokakarya bina damai yang dimulai tahun ini.',
    },
    prayCount: 58,
  },
  {
    id: 'pr_2',
    author: 'Sarah Nguyen',
    authorId: 'sarah',
    countryCode: 'VN',
    countryName: '베트남 (VN)',
    isLeader: true,
    isUrgent: false,
    date: '2026-09-27',
    title: '교회 청년 세대 복음 전파 및 주일학교 교사 훈련',
    rawTitle: '교회 청년 세대 복음 전파 및 주일학교 교사 훈련',
    content:
      '교회의 다음 세대 청년들이 주님의 말씀을 사랑하고 지역 사회를 섬기며 평화와 화해의 증인이 되도록 기도합니다.\n4개 현지 가정교회가 연합하여 주일학교 교사 훈련을 잘 마칠 수 있도록 지혜를 더해 주소서.',
    originalLang: 'vi',
    originalText:
      'Cầu nguyện cho thế hệ trẻ trong Hội Thánh biết yêu mến Lời Chúa và dấn thân phục vụ cộng đồng, lan tỏa tinh thần hòa giải.\n4개 현지 가정교회가 연합하여 주일학교 교사 훈련을 잘 마칠 수 있도록 지혜를 더해 주소서.',
    translations: {
      ko: '교회의 다음 세대 청년들이 주님의 말씀을 사랑하고 지역 사회를 섬기며 평화와 화해의 증인이 되도록 기도합니다.\n4개 현지 가정교회가 연합하여 주일학교 교사 훈련을 잘 마칠 수 있도록 지혜를 더해 주소서.',
      en: 'Praying that the next generation of youth in our churches will love God’s Word, serve their local communities, and spread the spirit of reconciliation.\nGrant wisdom as four local home churches unite for Sunday school teacher training.',
      ja: '教会の次世代の若者たちがみ言葉を愛し、地域社会に仕え、和解の精神を広げていけるよう祈ります。',
      'zh-TW': '為教會的青年世代禱告，願他們熱愛真道、服事社區，活出和平與和解的見證。',
      th: 'อธิษฐานเผื่อเยาวชนรุ่นใหม่ในคริสตจักรให้รักในพระคำ และร่วมรับใช้ชุมชนด้วยจิตวิญญาณแห่งสันติภาพ',
      id: 'Berdoa agar generasi muda di gereja mencintai Firman Tuhan dan melayani masyarakat dengan semangat perdamaian.',
    },
    prayCount: 46,
  },
  {
    id: 'pr_3',
    author: 'Somchai Prasert',
    authorId: 'somchai',
    countryCode: 'TH',
    countryName: '태국 (TH)',
    isLeader: false,
    isUrgent: false,
    date: '2026-09-26',
    title: '태국어 AAMEN 교재 번역 감사 및 청소년 평화 캠프',
    rawTitle: '태국어 AAMEN 교재 번역 감사 및 청소년 평화 캠프',
    content:
      'AAMEN 레슨이 태국어로 번역된 것에 감사드립니다. 이 교육 자료들이 현지 교회들을 든든히 세우는 데 귀하게 쓰이길 기도합니다.\n다음 달 태국 북부에서 열리는 청소년 평화 캠프 가운데도 주님의 풍성한 은혜를 구합니다.',
    originalLang: 'th',
    originalText:
      'ขอบคุณพระเจ้าสำหรับการแปลบทเรียน AAMEN เป็นภาษาไทย ขอพระเจ้าทรงใช้วัสดุเหล่านี้เสริมสร้างคริสตจักรท้องถิ่น\nขอการทรงนำในการจัดค่ายเยาวชนเพื่อสันติภาพในภาคเหนือของไทยในเดือนหน้าด้วยครับ',
    translations: {
      ko: 'AAMEN 레슨이 태국어로 번역된 것에 감사드립니다. 이 교육 자료들이 현지 교회들을 든든히 세우는 데 귀하게 쓰이길 기도합니다.\n다음 달 태국 북부에서 열리는 청소년 평화 캠프 가운데도 주님의 풍성한 은혜를 구합니다.',
      en: 'Thank God for the Thai translation of the AAMEN lessons. May these educational materials strengthen our local churches.\nPlease also pray for our upcoming youth peace camp in Northern Thailand next month.',
      ja: 'AAMENのレッスンがタイ語に翻訳されたことを感謝します。現地の教会が力強く建て上げられますように。',
      'zh-TW': '為 AAMEN 課程翻譯成泰文獻上感恩，願這些教材成為各地方教會培育信徒的寶貴祝福。',
      vi: 'Cảm tạ Chúa vì tài liệu bài học AAMEN đã được dịch sang tiếng Thái, nguyện xin Chúa dùng tài liệu này gây dựng các giáo hội.',
      id: 'Bersyukur atas penerjemahan materi pelajaran AAMEN ke dalam bahasa Thai.',
    },
    prayCount: 63,
  },
  {
    id: 'pr_4',
    author: 'Rajesh Kumar',
    authorId: 'rajesh',
    countryCode: 'IN',
    countryName: '인도 (IN)',
    isLeader: false,
    isUrgent: true,
    date: '2026-09-25',
    title: '인도 차티스가르 농촌 지역 구호 및 사역자 안전',
    rawTitle: '인도 차티스가르 농촌 지역 구호 및 사역자 안전',
    content:
      '인도 차티스가르 농촌 지역에서 가뭄과 경제적 빈곤으로 고통받는 이웃들을 위해 기도해 주세요.\n식량과 구호 약품을 나누며 그리스도의 사랑을 전하는 자원봉사자들의 안전과 물질 공급을 위해 손 모아 주시기 바랍니다.',
    originalLang: 'hi',
    originalText:
      'छत्तीसगढ़ के ग्रामीण क्षेत्रों में सूखे और गरीबी से जूझ रहे परिवारों के लिए प्रार्थना करें।\nहमारे मेनोनाइट चर्च के स्वयंसेवक जो भोजन और दवाइयां पहुंचा रहे हैं, उनकी सुरक्षा और संसाधनों की पूर्ति के लिए प्रार्थना की विनती है।',
    translations: {
      ko: '인도 차티스가르 농촌 지역에서 가뭄과 경제적 빈곤으로 고통받는 이웃들을 위해 기도해 주세요.\n식량과 구호 약품을 나누며 그리스도의 사랑을 전하는 자원봉사자들의 안전과 물질 공급을 위해 손 모아 주시기 바랍니다.',
      en: 'Please pray for rural families in Chhattisgarh facing severe drought and hardship.\nPray for the protection and provision of our church volunteers delivering food and medical aid.',
      ja: 'インド・チャッティースガル州の干ばつと貧困に苦しむ農村地域の人々のために祈ってください。',
      'zh-TW': '請為印度恰蒂斯加爾邦面對乾旱與貧困的農村家庭代禱，求神供應物資並保守義工平安。',
      vi: 'Xin cầu nguyện cho các gia đình nông thôn tại Chhattisgarh đang đối mặt với hạn hán và khó khăn.',
      th: 'ขออธิษฐานเผื่อครอบครัวในชนบทของอินเดียที่เผชิญภัยแล้งและความยากลำบาก',
      id: 'Mohon doa bagi keluarga di pedesaan Chhattisgarh yang menghadapi kekeringan.',
    },
    prayCount: 51,
  },
  {
    id: 'pr_5',
    author: 'Sunita Shrestha',
    authorId: 'sunita',
    countryCode: 'NP',
    countryName: '네팔 (NP)',
    isLeader: true,
    isUrgent: false,
    date: '2026-09-24',
    title: '히말라야 산간 외딴 마을 목회자 건강과 평화 세미나',
    rawTitle: '히말라야 산간 외딴 마을 목회자 건강과 평화 세미나',
    content:
      '히말라야 산간 외딴 마을에서 묵묵히 복음을 전하는 현지 목회자들에게 건강과 사역의 지혜를 더하여 주시기를 기도합니다.\n서로 다른 부족 청년들이 주 안에서 용서와 화해를 배우는 평화 세미나가 큰 결실을 맺게 하소서.',
    originalLang: 'ne',
    originalText:
      'हिमाली क्षेत्रका दुर्गम गाउँहरूमा सेवा गर्ने हाम्रा पास्टरहरूलाई सुस्वास्थ्य र बल प्रदान गरियोस्।\nविभिन्न जनजाति युवाहरू बीचको शान्ति र मेलमिलाप तालิม मार्फत समुदायमा प्रेमको ज्योति फैलन सकोस् भनी प्रार्थना गर्दछौं।',
    translations: {
      ko: '히말라야 산간 외딴 마을에서 묵묵히 복음을 전하는 현지 목회자들에게 건강과 사역의 지혜를 더하여 주시기를 기도합니다.\n서로 다른 부족 청년들이 주 안에서 용서와 화해를 배우는 평화 세미나가 큰 결실을 맺게 하소서.',
      en: 'Please pray for our local pastors serving in remote Himalayan mountain villages, asking for health and wisdom.\nMay our peace and reconciliation seminars among diverse tribal youth bear great fruit.',
      ja: 'ヒマラヤの山岳村落で奉仕する牧師たちの健康と知恵のためにお祈りください。',
      'zh-TW': '求神加添力量給在喜馬拉雅偏遠山區服事的傳道人，並願跨部族青年和平營會結出豐盛果子。',
      vi: 'Xin cầu nguyện cho các mục sư đang phục vụ tại các ngôi làng vùng cao Himalaya xa xôi.',
      th: 'ขออธิษฐานเผื่อศิษยาภิบาลที่รับใช้ในหมู่บ้านแถบเทือกเขาหิมาลัย',
      id: 'Doakan para hamba Tuhan yang melayani di desa-desa terpencil pegunungan Himalaya.',
    },
    prayCount: 39,
  },
  {
    id: 'pr_6',
    author: 'Bounmy Keomany',
    authorId: 'bounmy',
    countryCode: 'LA',
    countryName: '라오스 (LA)',
    isLeader: false,
    isUrgent: false,
    date: '2026-09-23',
    title: '메콩강 유역 평화 사역자 안전과 섬김',
    rawTitle: '메콩강 유역 평화 사역자 안전과 섬김',
    content:
      '메콩강 유역에서 종교적 제약 속에서도 이웃 사랑과 섬김을 실천하는 평화 사역자들의 안전을 위해 기도합니다.\n지역 사회 주민들이 성도들의 희생과 돌봄을 통해 그리스도의 참된 평화를 발견하게 하소서.',
    originalLang: 'lo',
    originalText:
      'ຂໍອະທິຖານໃຫ້ບັນດາຜູ້ຮັບໃຊ້ສັນຕິພາບຕາມລຳແມ່ນ້ຳຂອງ ໃຫ້ມີຄວາມປອດໄພ ແລະ ຄວາມອົດທົນໃນການສຳແດງຄວາມຮັກຂອງພຣະຄຣິດ.\nຂໍໃຫ້ຊຸມຊົນທ້ອງຖິ່ນເຫັນປະຈັກຕາເຖິງຄວາມສາມັກຄີ ແລະ ສັນຕິສຸກທີ່ມາຈາກພຣະເຈົ້າ.',
    translations: {
      ko: '메콩강 유역에서 종교적 제약 속에서도 이웃 사랑과 섬김을 실천하는 평화 사역자들의 안전을 위해 기도합니다.\n지역 사회 주민들이 성도들의 희생과 돌봄을 통해 그리스도의 참된 평화를 발견하게 하소서.',
      en: 'Please pray for the safety and perseverance of peace workers serving along the Mekong River basin.\nMay local communities witness Christ’s love and peace through their faithful care.',
      ja: 'メコン川流域で仕える平和の働き人たちの安全と忍耐のためにお祈りください。',
      'zh-TW': '請為湄公河流域服事的和平同工的安全代禱，願當地居民看見基督的愛與平安。',
      vi: 'Xin cầu nguyện cho sự an toàn của những người kiến tạo hòa bình phục vụ dọc theo lưu vực sông Mê Kông.',
      th: 'ขออธิษฐานเผื่อความปลอดภัยของผู้รับใช้สันติภาพในลุ່ມแม่น้ำโขง',
      id: 'Doakan keselamatan para pekerja perdamaian di sepanjang lembah Sungai Mekong.',
    },
    prayCount: 44,
  },
]

export default function LivePrayerWall() {
  const t = useTranslations('community')
  const locale = useLocale()
  const pI18n = PRAYER_I18N[locale] || PRAYER_I18N['ko']

  const [prayers, setPrayers] = useState<PrayerItem[]>([])
  const [prayedSet, setPrayedSet] = useState<Record<string, boolean>>({})
  const [translatedSet, setTranslatedSet] = useState<Record<string, boolean>>({})
  const [shareModalItem, setShareModalItem] = useState<PrayerItem | null>(null)
  const [copyFeedback, setCopyFeedback] = useState(false)

  // 기도제목 등록 모달 상태
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [countryCode, setCountryCode] = useState('KR')
  const [isUrgent, setIsUrgent] = useState(false)

  // 기도제목 수정 모달 상태 (게시자 및 관리자)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPrayer, setEditingPrayer] = useState<PrayerItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editIsUrgent, setEditIsUrgent] = useState(false)
  const [updating, setUpdating] = useState(false)

  // 전역 회원 등급 (0~5단계) 구독
  const [currentLevel, setCurrentLevel] = useState<MemberLevel>(4)
  const [mounted, setMounted] = useState(false)
  const [noticeToast, setNoticeToast] = useState<string | null>(null)

  const fetchPrayers = async () => {
    try {
      const res = await fetch('/api/prayers.php')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const mapped: PrayerItem[] = data.map((d: any) => {
            const nation = NATIONS_15.find((n) => n.code === d.country_code)
            const countryNameOnly = nation
              ? (nation.name[locale as 'ko' | 'en'] || nation.name.ko)
              : (d.country_code || 'KR')
            const countryLabel = `${countryNameOnly} (${d.country_code || 'KR'})`

            let extra: any = {}
            if (d.extra_json) {
              extra =
                typeof d.extra_json === 'string'
                  ? (() => {
                      try {
                        return JSON.parse(d.extra_json)
                      } catch (e) {
                        return {}
                      }
                    })()
                  : d.extra_json
            }
            const titles = extra?.titles || {}
            const localizedTitle = titles[locale] || titles['ko'] || titles['en'] || d.title || ''
            const rawTitle = d.title || ''
            const cardContent = d.content || ''

            return {
              id: d.id,
              author: d.author_name || '성도',
              authorId: d.author_id || '',
              countryCode: d.country_code || 'KR',
              countryName: countryLabel,
              isLeader: Boolean(d.is_urgent),
              isUrgent: Boolean(d.is_urgent),
              date: (d.created_at || '').substring(0, 10),
              title: localizedTitle,
              rawTitle: rawTitle,
              content: cardContent,
              originalLang: d.country_code === 'KR' ? 'ko' : 'en',
              originalText: cardContent,
              translations: {
                ko: cardContent,
                en: cardContent,
              },
              prayCount: d.amen_count || 0,
              extra_json: extra,
            }
          })
          setPrayers(mapped)
          return
        }
      }
    } catch (e) {
      console.error(e)
    }
    // DB 데이터가 비어있거나 오류 시 기본 샘플 기도제목 표시
    setPrayers(initial6Prayers)
  }

  useEffect(() => {
    fetchPrayers()
  }, [locale])

  useEffect(() => {
    setMounted(true)
    setCurrentLevel(getStoredTierLevel())

    const handleTierChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: MemberLevel }>
      if (customEvent.detail && customEvent.detail.level) {
        setCurrentLevel(customEvent.detail.level)
      } else {
        setCurrentLevel(getStoredTierLevel())
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === TIER_STORAGE_KEY || e.key === 'aamen_auth_role') {
        setCurrentLevel(getStoredTierLevel())
      }
    }

    window.addEventListener(TIER_EVENT_NAME, handleTierChange)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(TIER_EVENT_NAME, handleTierChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const currentTier = defaultTierSettings[currentLevel]
  const isGuest = currentLevel === 0 // 0단계 비회원/손님
  const isAssociate = currentLevel === 1 // 1단계 준회원/가입대기
  const isRegularOrAbove = currentLevel >= 2 // 2단계 정회원 이상
  const isLeaderOrAdmin = currentLevel >= 4 // 4단계 리더/게시판관리자 이상

  const showToast = (msg: string) => {
    setNoticeToast(msg)
    setTimeout(() => setNoticeToast(null), 3000)
  }

  // 사용자 정보 자동 추출: 이름 (영문이름) | 국가 (이니셜)
  const getUserInfo = () => {
    const user = getStoredUser()
    const rawId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('aamen_profile_id') : null) || 'admin'

    let name = user?.name || ''
    let nameEn = ''
    let cCode = user?.country_code || ''

    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem(`aamen_profile_name_${rawId}`) || (rawId === 'admin' ? localStorage.getItem('aamen_profile_name') : null)
      const savedNameEn = localStorage.getItem(`aamen_profile_name_en_${rawId}`) || (rawId === 'admin' ? localStorage.getItem('aamen_profile_name_en') : null)
      const savedCountry = localStorage.getItem(`aamen_profile_country_${rawId}`) || (rawId === 'admin' ? localStorage.getItem('aamen_profile_country') : null)

      if (savedName) name = savedName
      if (savedNameEn) nameEn = savedNameEn
      if (savedCountry) cCode = savedCountry
    }

    if (!name) {
      if (rawId.toLowerCase() === 'admin') name = '이승호'
      else if (rawId.toLowerCase() === 'yongha') name = 'Bae Yongha'
      else name = 'AAMEN 사역자'
    }

    if (!nameEn) {
      if (rawId.toLowerCase() === 'admin') nameEn = 'Seungho Lee'
      else if (rawId.toLowerCase() === 'yongha') nameEn = 'Bae Yongha'
      else if (rawId.toLowerCase() === 'jeanette') nameEn = 'Jeanette Hanson'
      else if (rawId.toLowerCase() === 'jeremiah') nameEn = 'Jeremiah Choi'
      else if (rawId.toLowerCase() === 'paulus') nameEn = 'Paulus S. Widjaja'
      else if (rawId.toLowerCase() === 'andi') nameEn = 'Andi Santoso'
      else if (rawId.toLowerCase() === 'hiro') nameEn = 'Hiro Katano'
      else if (rawId.toLowerCase() === 'bockki') nameEn = 'Kim Bockki'
    }

    if (!cCode) {
      const localeMap: Record<string, string> = {
        ko: 'KR', ja: 'JP', vi: 'VN', th: 'TH', my: 'MM', id: 'ID',
        ne: 'NP', hi: 'IN', km: 'KH', lo: 'LA', mn: 'MN', 'zh-TW': 'TW',
        'zh-HK': 'HK', tl: 'PH', en: 'US',
      }
      cCode = localeMap[locale] || 'KR'
    }

    const nation = NATIONS_15.find((n) => n.code === cCode)
    const cName = nation ? (nation.name[locale as 'ko' | 'en'] || nation.name.ko) : '대한민국'

    return {
      id: rawId,
      name,
      nameEn,
      countryCode: cCode,
      countryName: cName,
      displayName: nameEn && nameEn !== name ? `${name} (${nameEn})` : name,
      displayCountry: `${cName} (${cCode})`,
    }
  }

  // 수정 / 삭제 권한 판별
  const canEdit = (item: PrayerItem) => {
    if (isLeaderOrAdmin) return true
    const info = getUserInfo()
    if (item.authorId && item.authorId === info.id) return true
    if (item.author && (item.author === info.displayName || item.author === info.name)) return true
    return false
  }

  const canDelete = (item: PrayerItem) => {
    if (isLeaderOrAdmin) return true
    const info = getUserInfo()
    if (item.authorId && item.authorId === info.id) return true
    return false
  }

  // 기도제목 등록 모달 열기 핸들러
  const handleOpenPrayerModal = () => {
    if (isGuest) {
      showToast('🚫 ' + pI18n.toast_guest)
      return
    }
    if (isAssociate) {
      showToast('🔒 ' + pI18n.toast_associate)
      return
    }
    const info = getUserInfo()
    setAuthorName(info.displayName)
    setCountryCode(info.countryCode)
    setTitle('')
    setContent('')
    setIsUrgent(false)
    setIsPrayerModalOpen(true)
  }

  // 신규 기도제목 등록 처리 (15개국 자동 번역 적용)
  const handleCreatePrayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      showToast(pI18n.toast_empty_error)
      return
    }

    const info = getUserInfo()
    setSubmitting(true)
    showToast(pI18n.toast_translating)

    try {
      // 15개국 언어로 기도제목 자동 번역
      let titles: Record<string, string> = {}
      try {
        titles = await translateTitleTo15Languages(title.trim())
      } catch (te) {
        console.warn('Title translation fallback to raw title:', te)
        titles = { ko: title.trim(), en: title.trim() }
      }

      const res = await fetch('/api/prayers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          author_name: info.displayName,
          author_id: info.id,
          country_code: info.countryCode,
          is_urgent: isUrgent ? 1 : 0,
          extra_json: { titles },
        }),
      })

      if (res.ok) {
        showToast(pI18n.toast_create_success)
        setTitle('')
        setContent('')
        setIsUrgent(false)
        setIsPrayerModalOpen(false)
        await fetchPrayers()
      } else {
        showToast('❌ 기도제목 등록 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    } catch (err) {
      console.error(err)
      showToast('❌ 서버 연결 실패. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  // 기도제목 수정 모달 열기 핸들러
  const handleOpenEditModal = (item: PrayerItem) => {
    setEditingPrayer(item)
    setEditTitle(item.rawTitle || item.title || '')
    setEditContent(item.content || item.originalText || '')
    setEditIsUrgent(Boolean(item.isUrgent))
    setIsEditModalOpen(true)
  }

  // 기도제목 수정 처리 (15개국 자동 번역 갱신)
  const handleUpdatePrayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPrayer) return
    if (!editTitle.trim() || !editContent.trim()) {
      showToast(pI18n.toast_empty_error)
      return
    }

    setUpdating(true)
    showToast(pI18n.toast_translating)

    try {
      let titles: Record<string, string> = {}
      try {
        titles = await translateTitleTo15Languages(editTitle.trim())
      } catch (te) {
        console.warn('Title translation fallback in edit:', te)
        titles = { ko: editTitle.trim(), en: editTitle.trim() }
      }

      const res = await fetch('/api/prayers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: editingPrayer.id,
          title: editTitle.trim(),
          content: editContent.trim(),
          is_urgent: editIsUrgent ? 1 : 0,
          extra_json: { titles },
        }),
      })

      if (res.ok) {
        showToast(pI18n.toast_update_success)
        setIsEditModalOpen(false)
        setEditingPrayer(null)
        await fetchPrayers()
      } else {
        showToast('❌ 기도제목 수정 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    } catch (err) {
      console.error(err)
      showToast('❌ 서버 연결 실패. 잠시 후 다시 시도해 주세요.')
    } finally {
      setUpdating(false)
    }
  }

  // 원터치 "함께 기도합니다" 핸들러 (실시간 DB 연동)
  const handlePray = async (id: string) => {
    if (isGuest) {
      showToast('🚫 ' + pI18n.toast_guest)
      return
    }
    if (prayedSet[id]) return

    setPrayedSet((prev) => ({ ...prev, [id]: true }))
    setPrayers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, prayCount: item.prayCount + 1 } : item
      )
    )

    try {
      await fetch('/api/prayers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'amen' }),
      })
    } catch (e) {
      console.error('Failed to sync pray count:', e)
    }
  }

  // 원클릭 AI 본문 번역 토글
  const toggleTranslate = (id: string) => {
    if (isGuest) {
      showToast('🚫 ' + pI18n.toast_guest)
      return
    }
    if (isAssociate) {
      showToast('🔒 ' + pI18n.toast_associate)
      return
    }
    setTranslatedSet((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // 삭제 핸들러 (게시자 및 관리자)
  const handleDeletePrayer = async (id: string, country: string) => {
    if (confirm(pI18n.toast_delete_confirm)) {
      try {
        await fetch('/api/prayers.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action: 'delete' }),
        })
      } catch (e) {}
      setPrayers((prev) => prev.filter((p) => p.id !== id))
      showToast(pI18n.toast_delete_success)
    }
  }

  const getShareUrl = () => {
    if (typeof window !== 'undefined') return window.location.href
    return 'https://aamen.net'
  }

  const shareViaWhatsApp = (item: PrayerItem) => {
    const text = encodeURIComponent(
      `[AAMEN ${pI18n.prayer_wall}] ${item.countryName}:\n${item.title ? `[${item.title}]\n` : ''}${item.content || item.originalText}\n\n${pI18n.btn_pray}: ${getShareUrl()}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(getShareUrl())
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-emerald-100 shadow-xl shadow-emerald-950/5 relative">
      {/* 알림 토스트 */}
      {noticeToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-top-2 border border-emerald-400">
          {noticeToast}
        </div>
      )}

      {/* 섹션 상단 헤더: 권한별 안내 문구 및 도구 */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-2xl">🙏</span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {pI18n.prayer_wall}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Live Intercession
            </span>

            {/* 현재 적용된 회원 등급 뱃지 */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                isGuest
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : isAssociate
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : isLeaderOrAdmin
                  ? 'bg-purple-50 text-purple-900 border-purple-200'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              {isGuest ? <Lock size={11} className="text-gray-600" /> : isAssociate ? <Lock size={11} /> : <ShieldCheck size={11} />}
              <span>{currentTier.name} 적용중</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {isGuest ? (
              <span className="text-gray-700 font-medium">
                🚫 <strong>0단계: 비회원(손님) 모드:</strong> 로그인하지 않은 방문자에게는 사역자 보호를 위해 기도제목이 블러 처리됩니다.
              </span>
            ) : isAssociate ? (
              <span className="text-amber-800 font-medium">
                🔒 <strong>1단계: 준회원 모드:</strong> 사역자 신변 보호를 위해 국가명만 표시되며, 기도제목은 1줄 미리보기로 제공됩니다.
              </span>
            ) : isLeaderOrAdmin ? (
              <span className="text-purple-800 font-medium">
                ⭐ <strong>{currentTier.name}:</strong> 15개국 모든 기도제목 및 사역자 실명 열람, 15개국 제목 자동 번역, 그리고 <strong>게시판 수정/삭제 권한</strong>이 활성화되어 있습니다.
              </span>
            ) : (
              <span className="text-emerald-800 font-medium">
                🌟 <strong>2단계 이상(정회원):</strong> 15개국 성도들의 전체 기도제목과 사역자 이름을 모두 열람하고 15개국 제목 자동 번역 및 중보기도에 동참하실 수 있습니다.
              </span>
            )}
          </p>
        </div>

        {/* 우측 도구: 기도제목 작성 & 더보기 링크 */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleOpenPrayerModal}
            className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isGuest || isAssociate
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <PenSquare size={13} />
            <span>{pI18n.submit_prayer}</span>
          </button>

          <Link
            href={locale === 'ko' ? '/community/prayer' : `/${locale}/community/prayer`}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <span>{pI18n.view_all_prayers}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 기도 카드 그리드 또는 비어있을 때 안내 */}
      {prayers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/60 rounded-3xl border border-gray-100">
          <Heart className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-gray-700 mb-1">{pI18n.empty_title}</h4>
          <p className="text-xs text-gray-500 mb-4">{pI18n.empty_desc}</p>
          <button
            type="button"
            onClick={handleOpenPrayerModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <PenSquare size={13} />
            <span>{pI18n.btn_first_submit}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prayers.map((item) => {
            const isPrayed = !!prayedSet[item.id]
            const cardContent = item.content || item.originalText
            const firstLine = cardContent.split('\n')[0]

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-gray-50/70 to-emerald-50/20 border border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all"
              >
                <div>
                  {/* 카드 상단: 작성자 및 국가 정보 */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      {isGuest ? (
                        <div className="font-bold text-sm text-gray-500 flex items-center gap-1">
                          <span>🔒 [사역자 비공개]</span>
                        </div>
                      ) : isRegularOrAbove ? (
                        <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5 flex-wrap">
                          <span>{item.author}</span>
                          {item.isLeader && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              ★ {t('leader_badge') || 'Leader'}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="font-bold text-sm text-emerald-800 flex items-center gap-1">
                          <span>[{item.countryName.split(' ')[0]}]</span>
                          <span className="text-gray-400 font-normal text-xs">{t('anonymous_member') || 'Member'}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                        {isGuest ? 'AAMEN 아시아 네트워크' : `${item.countryName} · ${item.date}`}
                      </div>
                    </div>

                    {/* 우측 뱃지 및 수정/삭제 도구 */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isGuest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-[10px] font-bold">
                          <Lock size={10} /> {t('restricted_guest') || 'Guest'}
                        </span>
                      )}
                      {isAssociate && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                          <Lock size={10} /> {t('preview_line') || 'Preview'}
                        </span>
                      )}
                      {canEdit(item) && (
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title={pI18n.btn_edit}
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                      {canDelete(item) && (
                        <button
                          onClick={() => handleDeletePrayer(item.id, item.countryName)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title={pI18n.btn_delete}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 기도제목 & 긴급 뱃지 */}
                  <div className="mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {item.isUrgent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wide shadow-2xs">
                          🚨 {pI18n.badge_urgent}
                        </span>
                      )}
                      <h4 className="font-extrabold text-sm sm:text-base text-gray-900 tracking-tight leading-snug">
                        {item.title || item.rawTitle}
                      </h4>
                    </div>
                  </div>

                  {/* 기도 본문 내용 (0단계 비회원 블러 / 1단계 준회원 1줄 / 2단계 이상 전문) */}
                  <div className="text-gray-800 text-xs sm:text-sm leading-relaxed mb-4 min-h-[60px]">
                    {isGuest ? (
                      <div className="relative overflow-hidden rounded-2xl p-4 bg-gray-50/80 border border-gray-200">
                        <p className="blur-[3px] select-none opacity-40 text-gray-500 text-xs leading-relaxed">
                          아시아 15개국 메노나이트 평화 사역자들과 성도들의 긴급 중보기도 내용입니다. 비회원에게는 사역자 보호를 위해 비공개 처리됩니다.
                        </p>
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px] p-2 text-center">
                          <Lock size={16} className="text-gray-700 mb-1" />
                          <span className="text-xs font-bold text-gray-900">회원 전용 기도제목입니다</span>
                          <Link
                            href="/member/login"
                            className="mt-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors"
                          >
                            로그인 후 전체 열람
                          </Link>
                        </div>
                      </div>
                    ) : isRegularOrAbove ? (
                      <p className="whitespace-pre-line text-gray-700">{cardContent}</p>
                    ) : (
                      <div>
                        <p className="line-clamp-1 font-medium text-gray-700">
                          {firstLine}...
                        </p>
                        <div className="mt-2 p-2.5 bg-amber-50/90 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-900 shadow-2xs">
                          <Lock size={13} className="shrink-0 text-amber-600" />
                          <span>{pI18n.toast_associate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 하단 인터랙션 바: 저도 기도할께요(아멘) & 공유 */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handlePray(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isPrayed
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200'
                    }`}
                  >
                    <Heart
                      size={13}
                      className={isPrayed ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}
                    />
                    <span>{isPrayed ? pI18n.btn_amen : pI18n.btn_pray}</span>
                    <span className="font-mono text-gray-400 text-[11px] ml-0.5">
                      {item.prayCount}
                    </span>
                  </button>

                  <div className="flex items-center gap-1 text-gray-400">
                    <button
                      onClick={() => setShareModalItem(item)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                      title="공유하기"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 1. 중보 기도제목 등록 모달 (Prayer Request Create Modal) */}
      {isPrayerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-black text-base sm:text-lg text-gray-900">
                    {pI18n.modal_create_title}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {pI18n.modal_subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPrayerModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* 입력 폼 */}
            <form onSubmit={handleCreatePrayer} className="space-y-4">
              {/* 1. 이름 (영문이름) | 국가 (이니셜) - 깔끔한 단일 표기, 중복 KR 및 뱃지 제거 */}
              {(() => {
                const info = getUserInfo()
                return (
                  <div className="p-3.5 bg-gradient-to-r from-gray-50 via-emerald-50/25 to-gray-50 rounded-2xl border border-emerald-100 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                        <User size={15} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-gray-900">
                          {info.displayName}
                        </span>
                        <span className="text-gray-300 font-bold">|</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-950 font-extrabold text-xs shadow-2xs">
                          <span>{info.countryName}</span>
                          <span className="font-mono text-emerald-700 font-black">({info.countryCode})</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* 2. 기도제목 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {pI18n.label_title}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={pI18n.placeholder_title}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* 3. 상세내용 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {pI18n.label_content}
                </label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={pI18n.placeholder_content}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-normal"
                />
              </div>

              {/* 4. 긴급 중보기도 요청 (뱃지 표시) */}
              <div className="flex items-center justify-between p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl transition-all">
                <label htmlFor="is_urgent_checkbox" className="flex items-center gap-2.5 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    id="is_urgent_checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-rose-950">
                      {pI18n.label_urgent}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold tracking-wide shadow-2xs">
                      <span>🚨 {pI18n.badge_urgent}</span>
                    </span>
                  </div>
                </label>
                <span className="text-[11px] text-rose-600 font-medium hidden sm:inline-block">
                  {pI18n.hint_urgent}
                </span>
              </div>

              {/* 모달 하단 버튼 */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPrayerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {pI18n.btn_cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>{pI18n.submitting}</span>
                    </>
                  ) : (
                    <>
                      <PenSquare size={13} />
                      <span>{pI18n.btn_submit}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 중보 기도제목 수정 모달 (Prayer Request Edit Modal - 게시자 및 관리자) */}
      {isEditModalOpen && editingPrayer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-black text-base sm:text-lg text-gray-900">
                    {pI18n.modal_edit_title}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {pI18n.modal_subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingPrayer(null)
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* 수정 입력 폼 */}
            <form onSubmit={handleUpdatePrayer} className="space-y-4">
              {/* 작성자 및 국가 정보 (읽기 전용) */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    <User size={15} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-gray-900">
                      {editingPrayer.author}
                    </span>
                    <span className="text-gray-300 font-bold">|</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-800 font-bold text-xs">
                      {editingPrayer.countryName}
                    </span>
                  </div>
                </div>
              </div>

              {/* 기도제목 수정 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {pI18n.label_title}
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={pI18n.placeholder_title}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              {/* 상세내용 수정 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {pI18n.label_content}
                </label>
                <textarea
                  required
                  rows={5}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder={pI18n.placeholder_content}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed font-normal"
                />
              </div>

              {/* 긴급 중보기도 여부 */}
              <div className="flex items-center justify-between p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl transition-all">
                <label htmlFor="edit_is_urgent_checkbox" className="flex items-center gap-2.5 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    id="edit_is_urgent_checkbox"
                    checked={editIsUrgent}
                    onChange={(e) => setEditIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-rose-950">
                      {pI18n.label_urgent}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold tracking-wide shadow-2xs">
                      <span>🚨 {pI18n.badge_urgent}</span>
                    </span>
                  </div>
                </label>
                <span className="text-[11px] text-rose-600 font-medium hidden sm:inline-block">
                  {pI18n.hint_urgent}
                </span>
              </div>

              {/* 수정 모달 하단 버튼 */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingPrayer(null)
                  }}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {pI18n.btn_cancel}
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {updating ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>{pI18n.updating}</span>
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      <span>{pI18n.btn_save}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 공유 모달 */}
      {shareModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h4 className="font-bold text-base text-gray-900 mb-2">기도제목 공유하기</h4>
            <p className="text-xs text-gray-500 mb-4">
              {shareModalItem.countryName}의 중보기도 요청을 메신저로 성도들과 나눠보세요.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => shareViaWhatsApp(shareModalItem)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>WhatsApp으로 공유</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copyFeedback ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copyFeedback ? '링크가 복사되었습니다!' : '링크 주소 복사'}</span>
              </button>
            </div>

            <button
              onClick={() => setShareModalItem(null)}
              className="mt-4 w-full py-2 text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
