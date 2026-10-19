import Link from 'next/link'
import { useLocale } from 'next-intl'

interface FeatureText {
  title: string
  desc: string
}

interface CommunityCardsLocale {
  announce: FeatureText
  resources: FeatureText
  prayer: FeatureText
  photos: FeatureText
}

const COMMUNITY_CARDS_BY_LOCALE: Record<string, CommunityCardsLocale> = {
  ko: {
    announce: {
      title: '공지사항',
      desc: '아시아 리더들을 위한 한국어·영어 듀얼 공식 공지 라운지',
    },
    resources: {
      title: '자료방',
      desc: '15개국 완역 7대 신념 교안, 찬양집, 예배자료 무료 다운로드',
    },
    prayer: {
      title: '함께 기도해요',
      desc: '15개국 실시간 기도의 벽과 원클릭 WhatsApp 중보기도 연대',
    },
    photos: {
      title: '사진첩',
      desc: '아시아 각국의 생생한 사역 현장과 감동의 사진 매거진',
    },
  },
  en: {
    announce: {
      title: 'Announcements',
      desc: 'Official dual KO/EN announcement lounge for Asian leaders',
    },
    resources: {
      title: 'Resource Center',
      desc: 'Free download of 7 Convictions lessons, hymnal, & worship materials in 13 languages',
    },
    prayer: {
      title: 'Pray Together',
      desc: 'Real-time prayer wall across 15 nations & one-click WhatsApp prayer network',
    },
    photos: {
      title: 'Photo Gallery',
      desc: 'Vibrant ministry fields and inspiring photo magazine from across Asia',
    },
  },
  ja: {
    announce: {
      title: 'お知らせ',
      desc: 'アジアのリーダーのための韓国語・英語公式案内ラウンジ',
    },
    resources: {
      title: '資料共有室',
      desc: '13カ国語完訳 7つの確信指導案、讃美集、礼拝資料の無料ダウンロード',
    },
    prayer: {
      title: '共に祈りましょう',
      desc: '13カ国のリアルタイム祈りの壁とワンクリックWhatsApp祈りの連帯',
    },
    photos: {
      title: '写真アルバム',
      desc: 'アジア各地の生き生きとした宣教現場と感動のフォトマガジン',
    },
  },
  'zh-TW': {
    announce: {
      title: '最新公告',
      desc: '專為亞洲領袖打造的韓英雙語官方公告交流中心',
    },
    resources: {
      title: '資源資料庫',
      desc: '免費下載13國語言7大信念教案、詩歌集與敬拜材料',
    },
    prayer: {
      title: '同心祈禱',
      desc: '13國即時禱告之牆與一鍵式WhatsApp代禱同工網絡',
    },
    photos: {
      title: '相片藝廊',
      desc: '呈現亞洲各國生動的事工現場與動人的照片特輯',
    },
  },
  id: {
    announce: {
      title: 'Pengumuman',
      desc: 'Pusat pengumuman resmi dwibahasa Korea-Inggris untuk para pemimpin Asia',
    },
    resources: {
      title: 'Pusat Sumber Daya',
      desc: 'Unduh gratis kurikulum 7 Keyakinan, buku pujian & materi ibadah dalam 13 bahasa',
    },
    prayer: {
      title: 'Mari Berdoa Bersama',
      desc: 'Tembok doa waktu nyata 13 negara & jaringan doa syafaat WhatsApp satu klik',
    },
    photos: {
      title: 'Galeri Foto',
      desc: 'Dokumentasi lapangan pelayanan yang hidup dan majalah foto inspiratif se-Asia',
    },
  },
  th: {
    announce: {
      title: 'ประกาศอย่างเป็นทางการ',
      desc: 'ศูนย์ประกาศสองภาษา เกาหลี-อังกฤษ สำหรับผู้นำในเอเชีย',
    },
    resources: {
      title: 'คลังทรัพยากร',
      desc: 'ดาวน์โหลดฟรี แผนการสอน 7 ความเชื่อ หนังสือเพลง และคู่มือนมัสการ 13 ภาษา',
    },
    prayer: {
      title: 'อธิษฐานร่วมกัน',
      desc: 'กำแพงอธิษฐานแบบเรียลไทม์ 13 ประเทศ และเครือข่ายอธิษฐานผ่าน WhatsApp',
    },
    photos: {
      title: 'อัลบั้มภาพพันธกิจ',
      desc: 'ภาพบันทึกพันธกิจจริงที่เปี่ยมด้วยชีวิตและนิตยสารภาพถ่ายทั่วเอเชีย',
    },
  },
  vi: {
    announce: {
      title: 'Thông Báo',
      desc: 'Phòng thông báo chính thức song ngữ Hàn-Anh dành cho các lãnh đạo châu Á',
    },
    resources: {
      title: 'Kho Tài Liệu',
      desc: 'Tải miễn phí giáo án 7 Niềm Tin, thánh ca & tài liệu thờ phượng bằng 13 ngôn ngữ',
    },
    prayer: {
      title: 'Cùng Nhau Cầu Nguyện',
      desc: 'Bức tường cầu nguyện thời gian thực 13 quốc gia & liên kết cầu nguyện WhatsApp',
    },
    photos: {
      title: 'Bộ Sưu Tập Ảnh',
      desc: 'Hiện trường mục vụ sống động và tạp chí ảnh đầy cảm xúc khắp châu Á',
    },
  },
  my: {
    announce: {
      title: 'တရားဝင် အသိပေးချက်များ',
      desc: 'အာရှခေါင်းဆောင်များအတွက် ကိုရီးယား-အင်္ဂလိပ် နှစ်ဘာသာသုံး တရားဝင် ကြေညာချက်များ',
    },
    resources: {
      title: 'အရင်းအမြစ် စာကြည့်တိုက်',
      desc: '၁၃ နိုင်ငံဘာသာပြန် ၇ ချက်ယုံကြည်ခြင်း သင်ရိုး၊ ဓမ္မသီချင်းနှင့် ဝတ်ပြုရေးဆိုင်ရာ အခမဲ့ဒေါင်းလုဒ်',
    },
    prayer: {
      title: 'အတူတကွ ဆုတောင်းကြပါစို့',
      desc: '၁၃ နိုင်ငံ တိုက်ရိုက်ဆုတောင်းခြင်းနံရံနှင့် WhatsApp ဆုတောင်းခြင်းကွန်ရက်',
    },
    photos: {
      title: 'ဓါတ်ပုံ မော်ကွန်း',
      desc: 'အာရှတစ်ခွင်ရှိ သက်ဝင်လှုပ်ရှားသော အမှုတော်ဆောင်မျက်မြင်မှတ်တမ်း ဓါတ်ပုံမဂ္ဂဇင်း',
    },
  },
  hi: {
    announce: {
      title: 'आधिकारिक घोषणाएं',
      desc: 'एशियाई अगुओं के लिए कोरियाई-अंग्रेजी द्विभाषी आधिकारिक सूचना लाउंज',
    },
    resources: {
      title: 'संसाधन केंद्र',
      desc: '13 भाषाओं में 7 विश्वासों के पाठ, गीत संग्रह और आराधना सामग्री मुफ्त डाउनलोड करें',
    },
    prayer: {
      title: 'साथ मिलकर प्रार्थना करें',
      desc: '13 देशों की लाइव प्रार्थना दीवार और वन-क्लिक व्हाट्सएप प्रार्थना नेटवर्क',
    },
    photos: {
      title: 'फोटो गैलरी',
      desc: 'पूरे एशिया से जीवंत सेवकाई के दृश्य और प्रेरणादायक फोटो पत्रिका',
    },
  },
  ne: {
    announce: {
      title: 'आधिकारिक सूचनाहरू',
      desc: 'एसियाली अगुवाहरूका लागि कोरियन-अंग्रेजी द्विभाषी आधिकारिक सूचना लाउन्ज',
    },
    resources: {
      title: 'स्रोत केन्द्र',
      desc: '१३ भाषाहरूमा ७ विश्वासका पाठ योजना, भजन संग्रह र आराधना सामग्री निःशुल्क डाउनलोड',
    },
    prayer: {
      title: 'सँगै प्रार्थना गरौं',
      desc: '१३ देशहरूको प्रत्यक्ष प्रार्थना भित्ता र ह्वाट्सएप प्रार्थना सञ्जाल',
    },
    photos: {
      title: 'तस्बिर ग्यालरी',
      desc: 'एसियाभरिका जीवन्त सेवकाई दृश्यहरू र प्रेरणादायी फोटो म्यागजिन',
    },
  },
  km: {
    announce: {
      title: 'សេចក្តីជូនដំណឹង',
      desc: 'មជ្ឈមណ្ឌលជូនដំណឹងផ្លូវការពីរភាសា កូរ៉េ-អង់គ្លេស សម្រាប់អ្នកដឹកនាំអាស៊ី',
    },
    resources: {
      title: 'បណ្ណាល័យធនធាន',
      desc: 'ទាញយកដោយឥតគិតថ្លៃ មេរៀនជំនឿទាំង ៧ ទំនុកតម្កើង និងឯកសារថ្វាយបង្គំជា ១៣ ភាសា',
    },
    prayer: {
      title: 'រួមគ្នាអធិស្ឋាន',
      desc: 'ជញ្ជាំងអធិស្ឋានផ្ទាល់ ១៣ ប្រទេស និងបណ្តាញអធិស្ឋាន WhatsApp មួយចុច',
    },
    photos: {
      title: 'កម្រងរូបថត',
      desc: 'រូបភាពកិច្ចការបម្រើព្រះដ៏រស់រវើក និងទស្សនាវដ្តីរូបថតទូទាំងអាស៊ី',
    },
  },
  lo: {
    announce: {
      title: 'ແຈ້ງການທາງການ',
      desc: 'ຫ້ອງແຈ້ງການສອງພາສາ ສ.ເກົາຫຼີ-ອັງກິດ ສຳລັບຜູ້ນຳໃນອາຊີ',
    },
    resources: {
      title: 'ສູນຊັບພະຍາກອນ',
      desc: 'ດາວໂຫຼດຟຣີ ບົດຮຽນ 7 ຄວາມເຊື່ອ, ປຶ້ມເພງ ແລະ ເອກະສານນະມັດສະການ 13 ພາສາ',
    },
    prayer: {
      title: 'ອະທິຖານຮ່ວມກັນ',
      desc: 'ກຳແພງອະທິຖານສົດ 13 ປະເທດ ແລະ ເຄືອຂ່າຍອະທິຖານຜ່ານ WhatsApp',
    },
    photos: {
      title: 'ຄັງຮູບພາບພັນທະກິດ',
      desc: 'ພາບພັນທະກິດທີ່ມີຊີວິດຊີວາ ແລະ ວາລະສານຮູບພາບທົ່ວອາຊີ',
    },
  },
  mn: {
    announce: {
      title: 'Албан мэдээлэл',
      desc: 'Азийн удирдагчдад зориулсан Солонгос-Англи хос хэлний албан мэдээллийн танхим',
    },
    resources: {
      title: 'Эх сурвалжийн сан',
      desc: '13 хэл дээрх 7 итгэл үнэмшлийн хичээл, магтаалын ном, мөргөлийн материалыг үнэгүй татах',
    },
    prayer: {
      title: 'Хамтдаа залбирцгаая',
      desc: '13 улсын бодит цагийн залбирлын хана ба нэг товшилтоор WhatsApp залбирлын холбоо',
    },
    photos: {
      title: 'Гэрэл зургийн цомог',
      desc: 'Ази даяарх амьд үйлчлэлийн талбар ба сэтгэл хөдөлгөм гэрэл зургийн сэтгүүл',
    },
  },
}

export default function CommunityPreview() {
  const locale = useLocale()

  const getLocalizedPath = (path: string) => {
    return locale === 'ko' ? path : `/${locale}${path}`
  }

  const currentTexts = COMMUNITY_CARDS_BY_LOCALE[locale] || COMMUNITY_CARDS_BY_LOCALE.en

  const features = [
    {
      icon: '📢',
      title: currentTexts.announce.title,
      desc: currentTexts.announce.desc,
      href: '/community/announce',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      textColor: 'text-emerald-700',
    },
    {
      icon: '📚',
      title: currentTexts.resources.title,
      desc: currentTexts.resources.desc,
      href: '/community/resources',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      textColor: 'text-sky-700',
    },
    {
      icon: '🙏',
      title: currentTexts.prayer.title,
      desc: currentTexts.prayer.desc,
      href: '/community/prayer',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      textColor: 'text-teal-700',
    },
    {
      icon: '📸',
      title: currentTexts.photos.title,
      desc: currentTexts.photos.desc,
      href: '/community/photos',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      textColor: 'text-purple-700',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature) => (
        <Link
          key={feature.href}
          href={getLocalizedPath(feature.href)}
          className={`group p-6 rounded-2xl border ${feature.bg} ${feature.border} hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between`}
        >
          <div>
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className={`font-bold text-base mb-2 ${feature.textColor} group-hover:opacity-80 transition-opacity`}>
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
