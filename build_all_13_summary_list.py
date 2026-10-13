# -*- coding: utf-8 -*-
"""
AAMEN 13-Nation Convictions List Page Generator
"""

import json, sys

sys.stdout.reconfigure(encoding='utf-8')

import setup_quotes

# 13개 언어 메타
LANGS = ['ko', 'en', 'ja', 'zh-TW', 'vi', 'id', 'th', 'my', 'hi', 'ne', 'km', 'lo', 'mn']

SLUGS_META = [
    {'id': 'god', 'num': '01', 'scripture': 'Genesis 1:1-3, Deuteronomy 6:4, John 1:1-18, Matthew 28:19'},
    {'id': 'jesus', 'num': '02', 'scripture': 'Luke 4:16-21, Matthew 5-7, Philippians 2:5-11, John 1:14'},
    {'id': 'spirit', 'num': '03', 'scripture': 'Acts 2:1-4, Acts 2:37-47, 1 Corinthians 12:4-13, Galatians 5:22-26'},
    {'id': 'church', 'num': '04', 'scripture': '2 Timothy 3:16-17, Psalm 119:105, Hebrews 1:1-2, James 2:14-17'},
    {'id': 'peace', 'num': '05', 'scripture': 'Matthew 5:9, Matthew 5:38-48, Luke 19:1-10, Romans 12:14-21'},
    {'id': 'community', 'num': '06', 'scripture': 'Hebrews 10:24-25, 1 Corinthians 11:23-26, Colossians 3:16'},
    {'id': 'unity', 'num': '07', 'scripture': '1 Corinthians 12:12-27, Ephesians 2:11-22, Galatians 3:28, Matthew 25:31-46'}
]

# UI 언어별 헤더 및 버튼 문구
PAGE_UI = {
    'ko': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7대 공유된 확신',
        'bannerDesc': '“우리는 그리스도 안에서 성령으로 하나 되어, 세상의 평화와 사랑의 증인이 되도록 부름받은 글로벌 신앙 공동체입니다.”',
        'introTitle': 'AAMEN 신앙의 기초',
        'introDesc': '아시아 아나밥티스트 메노나이트 교육 네트워크(AAMEN)에 속한 13개국 교회와 학교는 메노나이트 세계 협의회(MWC)의 7대 공유된 확신을 우리의 공동 신앙 고백으로 삼고 있습니다. 각 항목을 클릭하여 깊이 묵상해 보세요.',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': '참고 성경 말씀:',
        'viewBtn': '상세 교안 & 원본 보기',
        'ctaTitle': '이 확신을 바탕으로 제작된 7대 레슨 플랜',
        'ctaDesc': 'AAMEN의 레슨 플랜은 13개국 언어로 번역되어 각 나라 교회와 주일학교에서 무료로 다운로드하여 가르칠 수 있습니다.',
        'ctaBtn': '📚 7대 레슨 플랜 시작하기 (주제 1: 하나님)'
    },
    'en': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7 Shared Convictions',
        'bannerDesc': '“We are a world-wide community of faith and life called to be faithful in fellowship, worship, service and witness in the way of Jesus Christ.”',
        'introTitle': 'Foundations of AAMEN Faith',
        'introDesc': 'Churches and Christian communities across 13 Asian nations in AAMEN embrace the 7 Shared Convictions of the Mennonite World Conference (MWC) as our common confession of faith. Explore each theme below to read full teaching guides and curriculum.',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'Key Scripture Passages:',
        'viewBtn': 'View Detailed Lesson Plan & Guide',
        'ctaTitle': '7 Comprehensive Lesson Plans Built on These Convictions',
        'ctaDesc': 'AAMEN lesson plans are translated into 13 Asian languages for churches, schools, and study groups across 13 nations to use freely.',
        'ctaBtn': 'Start Exploring Lesson Plan #1 (God)'
    },
    'ja': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7つの共有された確信',
        'bannerDesc': '「私たちはキリストにあって聖霊によって一つとされ、世の平和と愛の証人となるよう召された世界大の信仰共同体です。」',
        'introTitle': 'AAMEN 信仰の礎',
        'introDesc': 'アジア・アナバプテスト・メノナイト教育ネットワーク（AAMEN）に連なる13カ国の教会と学校は、メノナイト世界会議（MWC）の「7つの共有された確信」を共通の信仰告白としています。各主題をクリックして深く学びましょう。',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': '参考聖書箇所:',
        'viewBtn': '詳細な教案・ガイドを見る',
        'ctaTitle': 'これらの確信に基づく7つの包括的レッスン・プラン',
        'ctaDesc': 'AAMENの教案はアジア13言語に翻訳され、各国の教会や日曜学校で自由に学び、教えることができます。',
        'ctaBtn': '主題1（神）の教案を始める'
    },
    'zh-TW': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7大共同信念',
        'bannerDesc': '「我們是在基督裡藉著聖靈合而為一的全球信仰群體，蒙召在世上為和平與愛作見證。」',
        'introTitle': 'AAMEN 信仰基石',
        'introDesc': '亞洲重浸派門諾教育網絡（AAMEN）轄下13個國家的教會與學校，皆以門諾世界總會（MWC）的「7大共同信念」為共同信仰告白。點擊各項主題即可深入探索詳盡教材。',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': '參考聖經經文：',
        'viewBtn': '閱讀詳細教案與導讀',
        'ctaTitle': '基於這些信念精心製作的7套完整教案',
        'ctaDesc': 'AAMEN教案已翻譯為亞洲13種語言，供各國教會與主日學免費研讀與教授。',
        'ctaBtn': '開啟主題 1（上帝）教案'
    },
    'vi': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7 Niềm Xác Tín Chung',
        'bannerDesc': '“Chúng ta là một cộng đồng đức tin và đời sống trên toàn thế giới, được kêu gọi để sống trung tín trong thông công, thờ phượng, phục vụ và làm chứng theo đường lối của Chúa Giê-su Christ.”',
        'introTitle': 'Nền Tảng Đức Tin AAMEN',
        'introDesc': 'Các hội thánh và trường học tại 13 quốc gia Châu Á thuộc Mạng lưới Giáo dục Mennonite Anabaptist Châu Á (AAMEN) cùng chia sẻ 7 Niềm Xác Tín Chung của Hội nghị Thế giới Mennonite (MWC) làm lời xưng nhận đức tin chung.',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'Kinh Thánh tham khảo:',
        'viewBtn': 'Xem giáo án chi tiết & hướng dẫn',
        'ctaTitle': '7 Giáo Án Toàn Diện Được Xây Dựng Trên Các Niềm Xác Tín Này',
        'ctaDesc': 'Các giáo án AAMEN được dịch sang 13 ngôn ngữ Châu Á để các hội thánh và trường Chúa Nhật sử dụng miễn phí.',
        'ctaBtn': 'Bắt đầu khám phá Chủ đề 1 (Đức Chúa Trời)'
    },
    'id': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7 Keyakinan Bersama',
        'bannerDesc': '“Kita adalah komunitas iman dan kehidupan di seluruh dunia yang dipanggil untuk setia dalam persekutuan, ibadah, pelayanan, dan kesaksian di jalan Yesus Kristus.”',
        'introTitle': 'Dasar Iman AAMEN',
        'introDesc': 'Gereja dan sekolah di 13 negara Asia dalam Jaringan Pendidikan Anabaptis Mennonite Asia (AAMEN) memegang 7 Keyakinan Bersama Konferensi Mennonite Sedunia (MWC) sebagai pengakuan iman bersama.',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'Ayat Alkitab Kunci:',
        'viewBtn': 'Lihat Rencana Pelajaran Lengkap',
        'ctaTitle': '7 Rencana Pembelajaran Komprehensif Berdasarkan Keyakinan Ini',
        'ctaDesc': 'Rencana pelajaran AAMEN diterjemahkan ke dalam 13 bahasa Asia untuk digunakan secara bebas oleh gereja dan sekolah minggu.',
        'ctaBtn': 'Mulai Tema 1 (Allah)'
    },
    'th': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7 ความเชื่อมั่นร่วมกัน',
        'bannerDesc': '“เราเป็นชุมชนแห่งความเชื่อและการดำเนินชีวิตทั่วโลกที่ได้รับการทรงเรียกให้สัตย์ซื่อในการสามัคคีธรรม การนมัสการ การรับใช้ และการเป็นพยานในทางของพระเยซูคริสต์”',
        'introTitle': 'รากฐานความเชื่อของ AAMEN',
        'introDesc': 'คริสตจักรและโรงเรียนใน 13 ประเทศในเอเชียในเครือข่ายการศึกษาแอนาแบปทิสต์ เมนโนไนต์แห่งเอเชีย (AAMEN) ยึดมั่นใน 7 ความเชื่อมั่นร่วมกันของการประชุมเมนโนไนต์โลก (MWC) เป็นคำสารภาพความเชื่อร่วมกัน',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'ข้อพระคัมภีร์อ้างอิง:',
        'viewBtn': 'ดูแผนการสอนและคู่มือฉบับเต็ม',
        'ctaTitle': '7 แผนการสอนที่ครอบคลุมซึ่งสร้างขึ้นจากความเชื่อมั่นเหล่านี้',
        'ctaDesc': 'แผนการสอนของ AAMEN ได้รับการแปลเป็น 13 ภาษาในเอเชีย เพื่อให้คริสตจักรและโรงเรียนวันอาทิตย์ใช้ได้อย่างเสรี',
        'ctaBtn': 'เริ่มเรียนรู้หัวข้อที่ 1 (พระผู้เป็นเจ้า)'
    },
    'my': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC မျှဝေထားသော ခံယူချက် ၇ ချက်',
        'bannerDesc': '“ကျွန်ုပ်တို့သည် ယေရှုခရစ်၏ လမ်းစဉ်အတိုင်း မိတ်သဟာယဖွဲ့ခြင်း၊ ဝတ်ပြုကိုးကွယ်ခြင်း၊ အစေခံခြင်းနှင့် သက်သေခံခြင်းတို့တွင် သစ္စာရှိရန် ခေါ်ယူခြင်းခံရသော တစ်ကမ္ဘာလုံးဆိုင်ရာ ယုံကြည်ခြင်းနှင့် အသက်တာ အသိုက်အဝန်းဖြစ်သည်။”',
        'introTitle': 'AAMEN ယုံကြည်ခြင်း၏ အခြေခံအုတ်မြစ်',
        'introDesc': 'အာရှ အန်နာဘပ်တစ် မန်နိုနိုက် ပညာရေးကွန်ရက် (AAMEN) ရှိ အာရှ ၁၃ နိုင်ငံမှ အသင်းတော်များနှင့် ကျောင်းများသည် မန်နိုနိုက် ကမ္ဘာ့ညီလာခံ (MWC) ၏ မျှဝေထားသော ခံယူချက် ၇ ချက်ကို ဘုံယုံကြည်ခြင်းအဖြစ် ဆုပ်ကိုင်ထားကြသည်။',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'အဓိက ကျမ်းချက်များ:',
        'viewBtn': 'အသေးစိတ် သင်ခန်းစာ အစီအစဉ် ကြည့်ရန်',
        'ctaTitle': 'ဤခံယူချက်များအပေါ် အခြေခံထားသော ပြည့်စုံသော သင်ခန်းစာ အစီအစဉ် ၇ ခု',
        'ctaDesc': 'AAMEN သင်ခန်းစာများကို အသင်းတော်များနှင့် တနင်္ဂနွေကျောင်းများတွင် အခမဲ့ အသုံးပြုနိုင်ရန် အာရှ ၁၃ ဘာသာစကားဖြင့် ဘာသာပြန်ဆိုထားသည်။',
        'ctaBtn': 'အကြောင်းအရာ ၁ (ဘုရားသခင်) စတင်လေ့လာရန်'
    },
    'hi': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7 साझा विश्वास',
        'bannerDesc': '“हम विश्वास और जीवन का एक विश्वव्यापी समुदाय हैं जिसे यीशु मसीह के मार्ग में संगति, आराधना, सेवा और गवाही में विश्वासयोग्य रहने के लिए बुलाया गया है।”',
        'introTitle': 'AAMEN विश्वास की नींव',
        'introDesc': 'एशिया अनाबाप्टिस्ट मेनोनाइट एजुकेशन नेटवर्क (AAMEN) में 13 एशियाई देशों के चर्च और संस्थान मेनोनाइट वर्ल्ड कॉन्फ्रेंस (MWC) के 7 साझा विश्वासों को अपने आम विश्वास के रूप में स्वीकार करते हैं।',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'मुख्य बाइबिल संदर्भ:',
        'viewBtn': 'विस्तृत पाठ योजना देखें',
        'ctaTitle': 'इन विश्वासों पर निर्मित 7 व्यापक पाठ योजनाएं',
        'ctaDesc': 'AAMEN पाठ योजनाओं का 13 एशियाई भाषाओं में अनुवाद किया गया है ताकि चर्च और संडे स्कूल स्वतंत्र रूप से अध्ययन कर सकें।',
        'ctaBtn': 'विषय 1 (परमेश्वर) प्रारंभ करें'
    },
    'ne': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC ७ साझा दृढ विश्वासहरू',
        'bannerDesc': '“हामी विश्वास र जीवनको विश्वव्यापी समुदाय हौँ जसलाई येशू ख्रीष्टको मार्गमा संगति, आराधना, सेवा र गवाहीमा विश्वासी हुन बोलाइएको छ।”',
        'introTitle': 'AAMEN विश्वासको जग',
        'introDesc': 'एसिया अनाबाप्टिस्ट मेनोनाइट एजुकेशन नेटवर्क (AAMEN) मा १३ एसियाली देशका मण्डलीहरूले मेनोनाइट वर्ल्ड कन्फरेन्स (MWC) का ७ साझा विश्वासहरूलाई साझा स्वीकारोक्तिको रूपमा ग्रहण गर्दछन्।',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'प्रमुख बाइबल खण्डहरू:',
        'viewBtn': 'विस्तृत पाठ योजना हेर्नुहोस्',
        'ctaTitle': 'यी विश्वासहरूमा आधारित ७ पूर्ण पाठ योजनाहरू',
        'ctaDesc': 'AAMEN पाठ योजनाहरू १३ एसियाली भाषाहरूमा अनुवाद गरिएका छन् ताकि मण्डलीहरूले निःशुल्क अध्ययन गर्न सकून्।',
        'ctaBtn': 'विषय १ (परमेश्वर) सुरु गर्नुहोस्'
    },
    'km': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC ជំនឿរួម ៧ យ៉ាង',
        'bannerDesc': '“យើងជាសហគមន៍ជំនឿ និងជីវិតទូទាំងពិភពលោកដែលត្រូវបានត្រាស់ហៅឱ្យមានភាពស្មោះត្រង់ក្នុងការប្រកបគ្នា ការថ្វាយបង្គំ ការបម្រើ និងការធ្វើបន្ទាល់តាមគន្លងនៃព្រះយេស៊ូវគ្រីស្ទ។”',
        'introTitle': 'មូលដ្ឋានគ្រឹះនៃជំនឿ AAMEN',
        'introDesc': 'ក្រុមជំនុំ និងសាលារៀននៅទូទាំង ១៣ ប្រទេសអាស៊ីក្នុងបណ្តាញអប់រំអាណាបាទីស្ទមេណូណាយអាស៊ី (AAMEN) ប្រកាន់ខ្ជាប់នូវជំនឿរួមទាំង ៧ នៃសន្និសីទពិភពលោកមេណូណាយ (MWC)។',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'ខគម្ពីរយោងសំខាន់ៗ៖',
        'viewBtn': 'មើលគម្រោងមេរៀនលម្អិត',
        'ctaTitle': 'គម្រោងមេរៀនដ៏ទូលំទូលាយទាំង ៧ ដែលបង្កើតឡើងផ្អែកលើជំនឿទាំងនេះ',
        'ctaDesc': 'គម្រោងមេរៀន AAMEN ត្រូវបានបកប្រែជា ១៣ ភាសាអាស៊ី សម្រាប់ក្រុមជំនុំប្រើប្រាស់ដោយឥតគិតថ្លៃ។',
        'ctaBtn': 'ចាប់ផ្តើមប្រធានបទ ១ (ព្រះជាម្ចាស់)'
    },
    'lo': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7 ຄວາມເຊື່ອໝັ້ນຮ່ວມກັນ',
        'bannerDesc': '“ພວກເຮົາເປັນຊຸມຊົນແຫ່ງຄວາມເຊື່ອ ແລະ ຊີວິດທົ່ວໂລກທີ່ໄດ້ຮັບການເອີ້ນໃຫ້ສັດຊື່ໃນການສາມັກຄີທຳ, ການນະມັດສະການ, ການຮັບໃຊ້ ແລະ ການເປັນພະຍານໃນທາງຂອງພຣະເຢຊູຄຣິດ.”',
        'introTitle': 'ຮາກຖານຄວາມເຊື່ອຂອງ AAMEN',
        'introDesc': 'ຄຣິສຕະຈັກ ແລະ ໂຮງຮຽນໃນ 13 ປະເທດອາຊີໃນເຄືອຂ່າຍການສຶກສາອານາບັບຕິສ ເມນໂນໄນຕ໌ ອາຊີ (AAMEN) ຍຶດໝັ້ນໃນ 7 ຄວາມເຊື່ອໝັ້ນຮ່ວມກັນຂອງກອງປະຊຸມເມນໂນໄນຕ໌ໂລກ (MWC).',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'ຂໍ້ພຣະຄຳພີອ້າງອີງ:',
        'viewBtn': 'ເບິ່ງແຜນການສອນລະອຽດ',
        'ctaTitle': '7 ແຜນການສອນທີ່ຄົບຖ້ວນເຊິ່ງສ້າງຂຶ້ນບົນພື້ນຖານຄວາມເຊື່ອໝັ້ນເຫຼົ່ານີ້',
        'ctaDesc': 'ແຜນການສອນ AAMEN ໄດ້ຮັບການແປເປັນ 13 ພາສາອາຊີ ສຳລັບຄຣິສຕະຈັກ ແລະ ໂຮງຮຽນວັນອາທິດ.',
        'ctaBtn': 'ເລີ່ມຕົ້ນຫົວຂໍ້ 1 (ພຣະເຈົ້າ)'
    },
    'mn': {
        'bannerBadge': 'Mennonite World Conference',
        'bannerTitle': 'MWC 7 Нийтлэг Итгэл үнэмшил',
        'bannerDesc': '“Бид бол Есүс Христийн замаар нөхөрлөл, магтан хүндэтгэл, үйлчлэл, гэрчлэлд үнэнч байхаар дуудагдсан итгэл ба амьдралын дэлхий дахины хамт олон юм.”',
        'introTitle': 'AAMEN Итгэлийн үндэс суурь',
        'introDesc': 'Азийн Анабаптист Меннонит Боловсролын Сүлжээний (AAMEN) Азийн 13 орны чуулганууд Дэлхийн Меннонит Чуулганы (MWC) 7 нийтлэг итгэл үнэмшлийг хамтын итгэлийн тунхаглал болгон баримталдаг.',
        'convictionPrefix': 'CONVICTION',
        'scriptureLabel': 'Гол Библийн ишлэлүүд:',
        'viewBtn': 'Дэлгэрэнгүй хичээлийн төлөвлөгөөг үзэх',
        'ctaTitle': 'Эдгээр итгэл үнэмшилд суурилсан 7 цогц хичээлийн төлөвлөгөө',
        'ctaDesc': 'AAMEN хичээлийн төлөвлөгөөг Азийн 13 хэлээр орчуулан чуулганууд үнэ төлбөргүй ашиглах боломжтой болголоо.',
        'ctaBtn': 'Сэдэв 1 (Бурхан) хичээлийг эхлүүлэх'
    }
}

# 13개 언어별 카드 리스트 맵 생성
conviction_lists_13 = {}

for lang in LANGS:
    lang_list = []
    for item in SLUGS_META:
        slug = item['id']
        num = item['num']
        quote = setup_quotes.QUOTES_BY_LANG.get(slug, {}).get(lang, '')
        title = setup_quotes.TITLES_BY_LANG.get(slug, {}).get(lang, '')
        badge = slug.upper()

        lang_list.append({
            'id': slug,
            'slug': slug,
            'num': num,
            'badge': badge,
            'title': title,
            'lead': quote,
            'scripture': item['scripture']
        })
    conviction_lists_13[lang] = lang_list

with open(r'C:\Dev\AAMEN\conviction_lists_13.json', 'w', encoding='utf-8') as f:
    json.dump({'lists': conviction_lists_13, 'ui': PAGE_UI}, f, ensure_ascii=False, indent=2)

print("Saved conviction_lists_13.json successfully!")
