// ============================================================================
// AAMEN MyPage Multilingual Localization Data & Helpers (13 Nations)
// ============================================================================

import { MemberLevel } from './store'

export interface LocalizedTierInfo {
  name: string
  desc: string
}

export interface LocalizedCountry {
  code: string
  name: string
  flag: string
}

export interface MyPageTexts {
  required: string
  affiliationHint: string
  saveAffiliation: string
  affiliationPlaceholder: string
  nameSection: string
  nameSectionHint: string
  nativeLangHint: string
  dirtyWarning: string
  cleanStatus: string
  saveProfileBtn: string
  selectedCharacter: string
  changeCharacterBtn: string
  charModalTitle: string
  charModalDesc: string
  genderLabel: string
  ageLabel: string
  filterAll: string
  filterMale: string
  filterFemale: string
  filterYouth: string
  filterSenior: string
  charConfirmBtn: string
  adminPerm: string
  noPerm: string
  superApproved: string
  leaderApproved: string
  restrictedAccess: string
  simulatorNote: string
  leaveModalTitle: string
  leaveModalDesc: string
  leaveKeepEditing: string
  leaveDiscard: string
  leaveSaveAndGo: string
  optionalBadge: string
  notificationOptionalDesc: string
}

// 1. 등급 정보 13개국어 완역
const TIERS_BY_LOCALE: Record<string, Record<MemberLevel, LocalizedTierInfo>> = {
  ko: {
    0: { name: '0단계: 비회원 (손님)', desc: '로그인하지 않은 일반 방문자 (사역자 정보 및 기도제목 비공개/마스킹)' },
    1: { name: '1단계: 준회원', desc: '가입 대기 및 기본 열람 (게시글 읽기 가능, 글/댓글 작성 제한)' },
    2: { name: '2단계: 정회원', desc: '인증된 공식 정회원 (기도제목 작성, 교육 자료 다운로드)' },
    3: { name: '3단계: 사역자/간사', desc: '공동체 사역자 (공지 작성 및 기도 승인)' },
    4: { name: '4단계: 국가관리자 (코디네이터)', desc: '13개국 각국 대표 리더 (국가별 자료 승인 및 회원 관리)' },
    5: { name: '5단계: 총괄관리자', desc: '총괄 사이트 관리자 (모든 시스템 및 회원/게시판 총괄)' },
  },
  ja: {
    0: { name: 'レベル0: ゲスト (訪問者)', desc: 'ログインしていない一般訪問者 (リーダー情報および祈りのリクエスト非公開)' },
    1: { name: 'レベル1: 準会員', desc: '加入待機および基本閲覧 (投稿閲覧可能、投稿/コメント作成制限)' },
    2: { name: 'レベル2: 正会員', desc: '認証済み公式正会員 (祈りのリクエスト作成、教育資料ダウンロード)' },
    3: { name: 'レベル3: 奉仕者・スタッフ', desc: '共同体奉仕者 (お知らせ作成および祈りの承認)' },
    4: { name: 'レベル4: 国別コーディネーター', desc: '13カ国各国代表リーダー (国別資料承認および会員管理)' },
    5: { name: 'レベル5: 総括管理者', desc: '総括サイト管理者 (全システムおよび会員/掲示板統括)' },
  },
  en: {
    0: { name: 'Level 0: Guest (Visitor)', desc: 'General visitor not logged in (leader info & prayer requests masked)' },
    1: { name: 'Level 1: Associate Member', desc: 'Pending registration & basic viewing (read-only, posting restricted)' },
    2: { name: 'Level 2: Regular Member', desc: 'Verified regular member (post prayer requests, download resources)' },
    3: { name: 'Level 3: Ministry Worker', desc: 'Community ministry worker (publish notices, approve prayers)' },
    4: { name: 'Level 4: Country Coordinator', desc: 'Official leader for 13 nations (approve country resources & members)' },
    5: { name: 'Level 5: Super Administrator', desc: 'Master site admin (oversee all systems, members, & boards)' },
  },
  'zh-TW': {
    0: { name: '等級 0: 訪客 (Guest)', desc: '未登入之一般訪客 (同工資訊與代禱事項屏蔽遮蔽)' },
    1: { name: '等級 1: 準會員', desc: '註冊待審與基本瀏覽 (可閱讀文章，發文/留言受限)' },
    2: { name: '等級 2: 正式會員', desc: '已認證之正式會員 (發布代禱事項、下載教育資源)' },
    3: { name: '等級 3: 事工同工', desc: '團契事工同工 (發布官方公告及代禱審核)' },
    4: { name: '等級 4: 國家協調員', desc: '13國各國代表領袖 (審核國家專屬資料與會員管理)' },
    5: { name: '等級 5: 總管理員', desc: '總網站最高管理員 (統籌全系統、會員及討論區)' },
  },
  id: {
    0: { name: 'Tingkat 0: Tamu (Guest)', desc: 'Pengunjung umum belum masuk (info pelayanan & pokok doa disamarkan)' },
    1: { name: 'Tingkat 1: Anggota Madya', desc: 'Menunggu persetujuan & akses baca (baca postingan, tulis terbatas)' },
    2: { name: 'Tingkat 2: Anggota Penuh', desc: 'Anggota resmi terverifikasi (tulis pokok doa, unduh materi)' },
    3: { name: 'Tingkat 3: Pelayan Pelayanan', desc: 'Pelayan komunitas (buat pengumuman & setujui doa)' },
    4: { name: 'Tingkat 4: Koordinator Negara', desc: 'Pemimpin perwakilan 13 negara (setujui materi negara & kelola anggota)' },
    5: { name: 'Tingkat 5: Administrator Utama', desc: 'Pengelola situs penuh (mengawasi seluruh sistem & papan)' },
  },
  th: {
    0: { name: 'ระดับ 0: ผู้เยี่ยมชม (Guest)', desc: 'ผู้เยี่ยมชมทั่วไปที่ยังไม่ได้เข้าสู่ระบบ (ซ่อนข้อมูลผู้นำและคำอธิษฐาน)' },
    1: { name: 'ระดับ 1: สมาชิกสมทบ', desc: 'รอการอนุมัติและอ่านข้อมูลเบื้องต้น (อ่านได้ โพสต์จำกัด)' },
    2: { name: 'ระดับ 2: สมาชิกสามัญ', desc: 'สมาชิกทางการที่ได้รับการยืนยัน (เขียนคำอธิษฐาน ดาวน์โหลดคู่มือ)' },
    3: { name: 'ระดับ 3: ผู้รับใช้พันธกิจ', desc: 'ผู้รับใช้ในชุมชน (ประกาศทางการและอนุมัติคำอธิษฐาน)' },
    4: { name: 'ระดับ 4: ผู้ประสานงานระดับประเทศ', desc: 'ผู้นำตัวแทน 13 ประเทศ (อนุมัติสื่อประจำชาติและดูแลสมาชิก)' },
    5: { name: 'ระดับ 5: ผู้ดูแลระบบสูงสุด', desc: 'ผู้ดูแลระบบรวม (ควบคุมดูแลระบบและกระดานทั้งหมด)' },
  },
  vi: {
    0: { name: 'Cấp 0: Khách (Visitor)', desc: 'Khách chưa đăng nhập (ẩn thông tin mục vụ và lời cầu nguyện)' },
    1: { name: 'Cấp 1: Thành viên Dự bị', desc: 'Đang chờ phê duyệt & xem cơ bản (chỉ đọc, giới hạn đăng bài)' },
    2: { name: 'Cấp 2: Thành viên Chính thức', desc: 'Thành viên đã xác minh (gửi lời cầu nguyện, tải tài liệu)' },
    3: { name: 'Cấp 3: Nhân sự Mục vụ', desc: 'Nhân sự cộng đồng (đăng thông báo & duyệt lời cầu nguyện)' },
    4: { name: 'Cấp 4: Điều phối viên Quốc gia', desc: 'Lãnh đạo đại diện 13 quốc gia (duyệt tài liệu & quản lý thành viên)' },
    5: { name: 'Cấp 5: Quản trị viên Toàn quyền', desc: 'Quản trị viên hệ thống (toàn quyền quản lý hệ thống & diễn đàn)' },
  },
}

// 2. 국가 목록 13개국어 명칭
const COUNTRY_NAMES_BY_LOCALE: Record<string, Record<string, string>> = {
  ko: {
    KR: '대한민국 (KR)',
    ID: '인도네시아 (ID)',
    TH: '태국 (TH)',
    VN: '베트남 (VN)',
    MM: '미얀마 (MM)',
    IN: '인도 (IN)',
    NP: '네팔 (NP)',
    JP: '일본 (JP)',
    PH: '필리핀 (PH)',
    KH: '캄보디아 (KH)',
    LA: '라오스 (LA)',
    MN: '몽골 (MN)',
    TW: '대만 (TW)',
  },
  ja: {
    KR: '大韓民国 (KR)',
    ID: 'インドネシア (ID)',
    TH: 'タイ (TH)',
    VN: 'ベトナム (VN)',
    MM: 'ミャンマー (MM)',
    IN: 'インド (IN)',
    NP: 'ネパール (NP)',
    JP: '日本 (JP)',
    PH: 'フィリピン (PH)',
    KH: 'カンボジア (KH)',
    LA: 'ラオス (LA)',
    MN: 'モンゴル (MN)',
    TW: '台湾 (TW)',
  },
  en: {
    KR: 'South Korea (KR)',
    ID: 'Indonesia (ID)',
    TH: 'Thailand (TH)',
    VN: 'Vietnam (VN)',
    MM: 'Myanmar (MM)',
    IN: 'India (IN)',
    NP: 'Nepal (NP)',
    JP: 'Japan (JP)',
    PH: 'Philippines (PH)',
    KH: 'Cambodia (KH)',
    LA: 'Laos (LA)',
    MN: 'Mongolia (MN)',
    TW: 'Taiwan (TW)',
  },
  'zh-TW': {
    KR: '南韓 (KR)',
    ID: '印尼 (ID)',
    TH: '泰國 (TH)',
    VN: '越南 (VN)',
    MM: '緬甸 (MM)',
    IN: '印度 (IN)',
    NP: '尼泊爾 (NP)',
    JP: '日本 (JP)',
    PH: '菲律賓 (PH)',
    KH: '柬埔寨 (KH)',
    LA: '寮國 (LA)',
    MN: '蒙古 (MN)',
    TW: '台灣 (TW)',
  },
  id: {
    KR: 'Korea Selatan (KR)',
    ID: 'Indonesia (ID)',
    TH: 'Thailand (TH)',
    VN: 'Vietnam (VN)',
    MM: 'Myanmar (MM)',
    IN: 'India (IN)',
    NP: 'Nepal (NP)',
    JP: 'Jepang (JP)',
    PH: 'Filipina (PH)',
    KH: 'Kamboja (KH)',
    LA: 'Laos (LA)',
    MN: 'Mongolia (MN)',
    TW: 'Taiwan (TW)',
  },
}

// 3. 마이페이지 공통 텍스트 13개국어 사전
const MYPAGE_TEXTS_BY_LOCALE: Record<string, MyPageTexts> = {
  ko: {
    required: '필수',
    affiliationHint: '(소속교회 / 기관 / 단체)',
    saveAffiliation: '소속 저장',
    affiliationPlaceholder: '소속 교회 또는 사역 단체명을 입력하세요',
    nameSection: '이름',
    nameSectionHint: '(본인 국가 언어 및 아시아 13개국 공용 영문명)',
    nativeLangHint: '(모국어/현지어)',
    dirtyWarning: '수정된 프로필 내용이 있습니다. 다른 페이지로 이동하기 전에 저장해 주세요.',
    cleanStatus: '현재 모든 프로필 정보가 안전하게 보관되어 있습니다.',
    saveProfileBtn: '프로필 저장하기',
    selectedCharacter: '선택된 캐릭터:',
    changeCharacterBtn: '캐릭터 선택/변경',
    charModalTitle: '아시아 13개국 인물 캐릭터 선택',
    charModalDesc: '나의 개성과 사역에 어울리는 대표 캐릭터를 골라보세요!',
    genderLabel: '성별:',
    ageLabel: '연령대:',
    filterAll: '전체',
    filterMale: '남성',
    filterFemale: '여성',
    filterYouth: '청년',
    filterSenior: '장년',
    charConfirmBtn: '선택 완료',
    adminPerm: '👑 관리자 권한',
    noPerm: '❌ 권한 없음',
    superApproved: '👑 총괄 승인',
    leaderApproved: '✅ 코디네이터',
    restrictedAccess: '❌ 접근 불가',
    simulatorNote: '💡 좌측 하단의 [권한 시뮬레이터] 버튼을 통해 언제든 다른 등급 화면을 체험하실 수 있습니다.',
    leaveModalTitle: '저장되지 않은 수정사항이 있습니다',
    leaveModalDesc: '프로필 정보를 수정하셨으나 아직 저장하지 않았습니다. 저장하지 않고 이동하시면 변경된 내용이 유실될 수 있습니다.',
    leaveKeepEditing: '계속 수정',
    leaveDiscard: '저장 안 함',
    leaveSaveAndGo: '저장 후 이동',
    optionalBadge: '선택 사항 (Optional)',
    notificationOptionalDesc: '알림센터 설정은 선택 사항입니다. 필요하신 채널만 자유롭게 활성화해 두시면 됩니다.',
  },
  ja: {
    required: '必須',
    affiliationHint: '(所属教会 / 機関 / 団体)',
    saveAffiliation: '所属を保存',
    affiliationPlaceholder: '所属教会または宣教団体名を入力してください',
    nameSection: '氏名',
    nameSectionHint: '(自国言語およびアジア13カ国共通の英語名)',
    nativeLangHint: '(母国語/現地語)',
    dirtyWarning: '変更されたプロフィール内容があります。他のページに移動する前に保存してください。',
    cleanStatus: '現在すべてのプロフィール情報が安全に保存されています。',
    saveProfileBtn: 'プロフィールを保存',
    selectedCharacter: '選択されたキャラクター:',
    changeCharacterBtn: 'キャラクター選択・変更',
    charModalTitle: 'アジア13カ国人物キャラクター選択',
    charModalDesc: 'あなたの個性や宣教に合った代表キャラクターをお選びください！',
    genderLabel: '性別:',
    ageLabel: '年齢層:',
    filterAll: 'すべて',
    filterMale: '男性',
    filterFemale: '女性',
    filterYouth: '青年',
    filterSenior: '壮年',
    charConfirmBtn: '選択完了',
    adminPerm: '👑 管理者権限',
    noPerm: '❌ 権限なし',
    superApproved: '👑 総括承認',
    leaderApproved: '✅ コーディネーター',
    restrictedAccess: '❌ アクセス不可',
    simulatorNote: '💡 画面下の「権限シミュレーター」ボタンからいつでも他のグレード画面を体験できます。',
    leaveModalTitle: '未保存の変更があります',
    leaveModalDesc: 'プロフィール情報を編集しましたが、まだ保存されていません。保存せずに移動すると、変更内容が失われる場合があります。',
    leaveKeepEditing: '編集を続ける',
    leaveDiscard: '破棄して移動',
    leaveSaveAndGo: '保存して移動',
    optionalBadge: '任意 (Optional)',
    notificationOptionalDesc: '通知センターの設定は任意です。必要なチャンネルのみ自由に有効化してください。',
  },
  en: {
    required: 'Required',
    affiliationHint: '(Church / Ministry / Org)',
    saveAffiliation: 'Save Affiliation',
    affiliationPlaceholder: 'Enter church or ministry name',
    nameSection: 'Name',
    nameSectionHint: '(Native language & English name for 13 Asian nations)',
    nativeLangHint: '(Native / Local language)',
    dirtyWarning: 'You have unsaved changes. Please save before leaving this page.',
    cleanStatus: 'All profile information is securely saved.',
    saveProfileBtn: 'Save Profile',
    selectedCharacter: 'Selected Character:',
    changeCharacterBtn: 'Choose / Change Character',
    charModalTitle: 'Choose Asia 13 Nations Character',
    charModalDesc: 'Choose a character that best represents you and your ministry!',
    genderLabel: 'Gender:',
    ageLabel: 'Age Group:',
    filterAll: 'All',
    filterMale: 'Male',
    filterFemale: 'Female',
    filterYouth: 'Youth',
    filterSenior: 'Senior',
    charConfirmBtn: 'Confirm Selection',
    adminPerm: '👑 Admin Permission',
    noPerm: '❌ No Permission',
    superApproved: '👑 Super Approved',
    leaderApproved: '✅ Coordinator',
    restrictedAccess: '❌ Restricted',
    simulatorNote: '💡 You can experience other tier views anytime using the [Permission Simulator] below.',
    leaveModalTitle: 'Unsaved Changes',
    leaveModalDesc: 'You have modified your profile information but have not saved it yet. Leaving without saving may cause your changes to be lost.',
    leaveKeepEditing: 'Keep Editing',
    leaveDiscard: 'Discard Changes',
    leaveSaveAndGo: 'Save and Proceed',
    optionalBadge: 'Optional',
    notificationOptionalDesc: 'Notification Center settings are optional. Feel free to enable only the channels you need.',
  },
  'zh-TW': {
    required: '必填',
    affiliationHint: '(所屬教會 / 機構 / 團體)',
    saveAffiliation: '儲存所屬',
    affiliationPlaceholder: '請輸入所屬教會或事工機構名稱',
    nameSection: '姓名',
    nameSectionHint: '(本國語言及亞洲13國通用英文姓名)',
    nativeLangHint: '(母語/當地語言)',
    dirtyWarning: '個人資料有未儲存的變更。在離開此頁面之前請先儲存。',
    cleanStatus: '目前所有個人資料均已安全妥善保存。',
    saveProfileBtn: '儲存個人資料',
    selectedCharacter: '已選擇角色:',
    changeCharacterBtn: '選擇/變更角色',
    charModalTitle: '選擇亞洲13國人物角色',
    charModalDesc: '挑選一個最能代表您與事工的專屬角色！',
    genderLabel: '性別:',
    ageLabel: '年齡層:',
    filterAll: '全部',
    filterMale: '男性',
    filterFemale: '女性',
    filterYouth: '青年',
    filterSenior: '壯年',
    charConfirmBtn: '確認選擇',
    adminPerm: '👑 管理員權限',
    noPerm: '❌ 無權限',
    superApproved: '👑 總幹事審核',
    leaderApproved: '✅ 協調員',
    restrictedAccess: '❌ 無法存取',
    simulatorNote: '💡 您可透過左下角的 [權限模擬器] 隨時體驗不同等級的頁面。',
    leaveModalTitle: '個人資料有未儲存的變更',
    leaveModalDesc: '您已修改個人資料但尚未儲存。若未儲存即離開，變更內容可能會遺失。',
    leaveKeepEditing: '繼續編輯',
    leaveDiscard: '不儲存',
    leaveSaveAndGo: '儲存後前往',
    optionalBadge: '選填 (Optional)',
    notificationOptionalDesc: '通知中心設定為選填項目。您只需啟用所需的聯絡管道即可。',
  },
  id: {
    required: 'Wajib',
    affiliationHint: '(Gereja / Lembaga / Pelayanan)',
    saveAffiliation: 'Simpan Afiliasi',
    affiliationPlaceholder: 'Masukkan nama gereja atau organisasi pelayanan Anda',
    nameSection: 'Nama',
    nameSectionHint: '(Bahasa ibu & Nama Inggris untuk 13 negara Asia)',
    nativeLangHint: '(Bahasa Ibu / Lokal)',
    dirtyWarning: 'Ada perubahan profil. Harap simpan sebelum berpindah ke halaman lain.',
    cleanStatus: 'Semua informasi profil Anda saat ini tersimpan dengan aman.',
    saveProfileBtn: 'Simpan Profil',
    selectedCharacter: 'Karakter Terpilih:',
    changeCharacterBtn: 'Pilih / Ubah Karakter',
    charModalTitle: 'Pilih Karakter Tokoh 13 Negara Asia',
    charModalDesc: 'Pilihlah karakter yang paling mewakili kepribadian dan pelayanan Anda!',
    genderLabel: 'Jenis Kelamin:',
    ageLabel: 'Kelompok Usia:',
    filterAll: 'Semua',
    filterMale: 'Pria',
    filterFemale: 'Wanita',
    filterYouth: 'Pemuda',
    filterSenior: 'Dewasa',
    charConfirmBtn: 'Selesai Memilih',
    adminPerm: '👑 Hak Admin',
    noPerm: '❌ Tidak Ada Hak',
    superApproved: '👑 Disetujui Penuh',
    leaderApproved: '✅ Koordinator',
    restrictedAccess: '❌ Dibatasi',
    simulatorNote: '💡 Anda dapat melihat tampilan tingkat lain kapan saja lewat [Simulator Izin] di bawah.',
    leaveModalTitle: 'Perubahan Belum Disimpan',
    leaveModalDesc: 'Anda telah mengubah informasi profil tetapi belum menyimpannya. Meninggalkan tanpa menyimpan dapat menyebabkan perubahan hilang.',
    leaveKeepEditing: 'Lanjut Edit',
    leaveDiscard: 'Abaikan Perubahan',
    leaveSaveAndGo: 'Simpan & Lanjutkan',
    optionalBadge: 'Opsional',
    notificationOptionalDesc: 'Pengaturan Pusat Pemberitahuan bersifat opsional. Aktifkan saluran yang Anda butuhkan saja.',
  },
  th: {
    required: 'จำเป็น',
    affiliationHint: '(คริสตจักร / หน่วยงาน / องค์กร)',
    saveAffiliation: 'บันทึกสังกัด',
    affiliationPlaceholder: 'กรุณากรอกชื่อคริสตจักรหรือองค์กรพันธกิจของคุณ',
    nameSection: 'ชื่อ-นามสกุล',
    nameSectionHint: '(ภาษาประจำชาติและชื่อภาษาอังกฤษกลาง 13 ประเทศ)',
    nativeLangHint: '(ภาษาแม่/ท้องถิ่น)',
    dirtyWarning: 'มีข้อมูลที่แก้ไข กรุณากดบันทึกก่อนเปลี่ยนไปหน้าอื่น',
    cleanStatus: 'ข้อมูลโปรไฟล์ทั้งหมดได้รับการบันทึกอย่างปลอดภัยแล้ว',
    saveProfileBtn: 'บันทึกโปรไฟล์',
    selectedCharacter: 'ตัวละครที่เลือก:',
    changeCharacterBtn: 'เลือก/เปลี่ยนตัวละคร',
    charModalTitle: 'เลือกตัวละครบุคคล 13 ประเทศในเอเชีย',
    charModalDesc: 'เลือกตัวละครที่สื่อถึงตัวตนและพันธกิจของคุณได้ดีที่สุด!',
    genderLabel: 'เพศ:',
    ageLabel: 'ช่วงวัย:',
    filterAll: 'ทั้งหมด',
    filterMale: 'ชาย',
    filterFemale: 'หญิง',
    filterYouth: 'เยาวชน',
    filterSenior: 'ผู้ใหญ่',
    charConfirmBtn: 'ยืนยันการเลือก',
    adminPerm: '👑 สิทธิ์ผู้ดูแล',
    noPerm: '❌ ไม่มีสิทธิ์',
    superApproved: '👑 อนุมัติรวม',
    leaderApproved: '✅ ผู้ประสานงาน',
    restrictedAccess: '❌ เข้าไม่ถึง',
    simulatorNote: '💡 คุณสามารถทดลองมุมมองระดับอื่นได้ตลอดเวลาผ่านปุ่ม [จำลองสิทธิ์] ด้านล่าง',
    leaveModalTitle: 'มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก',
    leaveModalDesc: 'คุณได้แก้ไขข้อมูลโปรไฟล์แต่ยังไม่ได้บันทึก หากออกจากหน้านี้ข้อมูลที่เปลี่ยนแปลงอาจสูญหายได้',
    leaveKeepEditing: 'แก้ไขต่อ',
    leaveDiscard: 'ไม่บันทึก',
    leaveSaveAndGo: 'บันทึกแล้วไปต่อ',
    optionalBadge: 'ไม่บังคับ (Optional)',
    notificationOptionalDesc: 'การตั้งค่าศูนย์การแจ้งเตือนเป็นแบบไม่บังคับ สามารถเลือกเปิดใช้งานเฉพาะช่องทางที่ต้องการได้',
  },
  vi: {
    required: 'Bắt buộc',
    affiliationHint: '(Hội thánh / Tổ chức / Đoàn thể)',
    saveAffiliation: 'Lưu đơn vị',
    affiliationPlaceholder: 'Nhập tên hội thánh hoặc tổ chức mục vụ của bạn',
    nameSection: 'Họ và tên',
    nameSectionHint: '(Ngôn ngữ mẹ đẻ & Tên tiếng Anh chung 13 quốc gia)',
    nativeLangHint: '(Tiếng mẹ đẻ/Địa phương)',
    dirtyWarning: 'Có thông tin đã chỉnh sửa. Vui lòng lưu lại trước khi chuyển trang.',
    cleanStatus: 'Tất cả thông tin hồ sơ hiện đã được lưu trữ an toàn.',
    saveProfileBtn: 'Lưu hồ sơ',
    selectedCharacter: 'Nhân vật đã chọn:',
    changeCharacterBtn: 'Chọn / Đổi nhân vật',
    charModalTitle: 'Chọn nhân vật đại diện 13 quốc gia châu Á',
    charModalDesc: 'Hãy chọn nhân vật phù hợp nhất với cá tính và mục vụ của bạn!',
    genderLabel: 'Giới tính:',
    ageLabel: 'Độ tuổi:',
    filterAll: 'Tất cả',
    filterMale: 'Nam',
    filterFemale: 'Nữ',
    filterYouth: 'Thanh niên',
    filterSenior: 'Trung niên',
    charConfirmBtn: 'Xác nhận chọn',
    adminPerm: '👑 Quyền Quản trị',
    noPerm: '❌ Không có quyền',
    superApproved: '👑 Duyệt Tổng quản',
    leaderApproved: '✅ Điều phối viên',
    restrictedAccess: '❌ Giới hạn',
    simulatorNote: '💡 Bạn có thể trải nghiệm giao diện cấp độ khác bất cứ lúc nào qua [Mô phỏng Quyền] bên dưới.',
    leaveModalTitle: 'Thay đổi chưa được lưu',
    leaveModalDesc: 'Bạn đã chỉnh sửa thông tin hồ sơ nhưng chưa lưu lại. Rời khỏi mà không lưu có thể làm mất các thay đổi.',
    leaveKeepEditing: 'Tiếp tục sửa',
    leaveDiscard: 'Không lưu',
    leaveSaveAndGo: 'Lưu và tiếp tục',
    optionalBadge: 'Tùy chọn (Optional)',
    notificationOptionalDesc: 'Cài đặt Trung tâm thông báo là tùy chọn. Bạn chỉ cần kích hoạt các kênh mình cần.',
  },
}

export function getLocalizedTierInfo(level: MemberLevel, locale: string): LocalizedTierInfo {
  const table = TIERS_BY_LOCALE[locale] || TIERS_BY_LOCALE.en || TIERS_BY_LOCALE.ko
  return table[level] || TIERS_BY_LOCALE.ko[level]
}

export function getLocalizedCountryList(locale: string): LocalizedCountry[] {
  const names = COUNTRY_NAMES_BY_LOCALE[locale] || COUNTRY_NAMES_BY_LOCALE.en || COUNTRY_NAMES_BY_LOCALE.ko
  const codes = ['KR', 'ID', 'TH', 'VN', 'MM', 'IN', 'NP', 'JP', 'PH', 'KH', 'LA', 'MN', 'TW']
  const flags: Record<string, string> = {
    KR: '🇰🇷',
    ID: '🇮🇩',
    TH: '🇹🇭',
    VN: '🇻🇳',
    MM: '🇲🇲',
    IN: '🇮🇳',
    NP: '🇳🇵',
    JP: '🇯🇵',
    PH: '🇵🇭',
    KH: '🇰🇭',
    LA: '🇱🇦',
    MN: '🇲🇳',
    TW: '🇹🇼',
  }

  return codes.map((code) => ({
    code,
    name: names[code] || `${code} (${code})`,
    flag: flags[code] || '🌐',
  }))
}

export function getLocalizedCountryName(code: string, locale: string): string {
  const names = COUNTRY_NAMES_BY_LOCALE[locale] || COUNTRY_NAMES_BY_LOCALE.en || COUNTRY_NAMES_BY_LOCALE.ko
  return names[code] || `${code} (${code})`
}

export function getMyPageTexts(locale: string): MyPageTexts {
  return MYPAGE_TEXTS_BY_LOCALE[locale] || MYPAGE_TEXTS_BY_LOCALE.en || MYPAGE_TEXTS_BY_LOCALE.ko
}
