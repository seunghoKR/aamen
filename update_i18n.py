# -*- coding: utf-8 -*-
import json
import os

MESSAGES_DIR = r"C:\Dev\AAMEN\renewal\frontend\messages"

# 13개 언어 배너 번역 정의
banners_data = {
    "ko": {
        "banner_01": {
            "title": "아시아 13개국을 잇는 평화와 교육의 공동체",
            "subtitle": "언어와 국경을 넘어 그리스도의 비폭력 평화와 제자도를 함께 배웁니다",
            "buttonText": "함께 기도하기 (기도의 벽)",
            "secondaryButtonText": "7대 확신 교안",
            "badgeText": "AAMEN GLOBAL NETWORK"
        },
        "banner_02": {
            "title": "2026 MWC 아시아 아나밥티스트 연합 컨퍼런스",
            "subtitle": "“화해의 복음, 하나 된 아시아” — 각국 코디네이터 및 청년 리더십 참가 신청 접수 중",
            "buttonText": "공지사항 바로가기",
            "secondaryButtonText": "네트워크 일정",
            "badgeText": "UPCOMING EVENT 2026"
        },
        "banner_03": {
            "title": "13개 언어로 완역된 7대 신념 교안 자료실",
            "subtitle": "하나님, 예수 그리스도, 성령, 평화와 화해 등 교회 주일학교와 신학교를 위한 무료 교육 자료",
            "buttonText": "자료실 둘러보기",
            "secondaryButtonText": "레슨 플랜 보기",
            "badgeText": "CURRICULUM & RESOURCES"
        },
        "banner_04": {
            "title": "“평화를 만드는 사람은 복이 있나니”",
            "subtitle": "마태복음 5:9 — 갈등과 분쟁 속에서 평화의 도구로 부르심 받은 아시아 성도들의 고백",
            "buttonText": "열린 나눔터 참여",
            "secondaryButtonText": "기도의 벽 가기",
            "badgeText": "SCRIPTURE OF PEACE"
        },
        "banner_05": {
            "title": "함께 손잡고 드리는 기도의 벽 (Live Prayer Wall)",
            "subtitle": "미얀마, 베트남, 인도, 네팔... 13개국에서 실시간으로 올라오는 기도의 제목에 '아멘'으로 응답하세요",
            "buttonText": "기도 제목 올리기",
            "secondaryButtonText": "은혜 나눔방",
            "badgeText": "FELLOWSHIP & PRAYER"
        }
    },
    "en": {
        "banner_01": {
            "title": "A Community of Peace and Education Across 13 Asian Nations",
            "subtitle": "Transcending borders and languages to learn Christ's nonviolent peace and discipleship together",
            "buttonText": "Pray Together (Prayer Wall)",
            "secondaryButtonText": "7 Shared Convictions",
            "badgeText": "AAMEN GLOBAL NETWORK"
        },
        "banner_02": {
            "title": "2026 MWC Asia Anabaptist Fellowship Conference",
            "subtitle": "\"Gospel of Reconciliation, United Asia\" — Registration open for national coordinators and youth leadership",
            "buttonText": "View Announcements",
            "secondaryButtonText": "Network Calendar",
            "badgeText": "UPCOMING EVENT 2026"
        },
        "banner_03": {
            "title": "7 Shared Convictions Curriculum in 13 Languages",
            "subtitle": "Free educational resources for Sunday schools and seminaries on God, Christ, Holy Spirit, and Peace",
            "buttonText": "Browse Resources",
            "secondaryButtonText": "View Lesson Plans",
            "badgeText": "CURRICULUM & RESOURCES"
        },
        "banner_04": {
            "title": "\"Blessed are the peacemakers\"",
            "subtitle": "Matthew 5:9 — The testimony of Asian believers called to be instruments of peace amidst conflict",
            "buttonText": "Join Community Board",
            "secondaryButtonText": "Live Prayer Wall",
            "badgeText": "SCRIPTURE OF PEACE"
        },
        "banner_05": {
            "title": "Live Prayer Wall: Holding Hands in Intercession",
            "subtitle": "Myanmar, Vietnam, India, Nepal... Respond with 'Amen' to real-time prayer requests from 13 nations",
            "buttonText": "Submit Prayer Request",
            "secondaryButtonText": "Grace Sharing Room",
            "badgeText": "FELLOWSHIP & PRAYER"
        }
    },
    "mn": {
        "banner_01": {
            "title": "Азийн 13 орныг холбосон энх тайван, боловсролын хамтын нийгэмлэг",
            "subtitle": "Хэл, хил хязгаарыг даван Христийн хүчирхийлэлгүй энх тайван ба шавь бэлтгэлийг хамтдаа суралцдаг",
            "buttonText": "Хамтдаа залбирах (Залбирлын хана)",
            "secondaryButtonText": "Үндсэн 7 итгэл үнэмшил",
            "badgeText": "AAMEN ДЭЛХИЙН СҮЛЖЭЭ"
        },
        "banner_02": {
            "title": "2026 MWC Азийн Анабаптист Нэгдсэн Бага Хурал",
            "subtitle": "“Эвлэрлийн сайн мэдээ, Нэгдсэн Ази” — Улс орнуудын зохицуулагчид ба залуучуудын манлайлагчдын бүртгэл явагдаж байна",
            "buttonText": "Мэдэгдэл рүү очих",
            "secondaryButtonText": "Сүлжээний хуваарь",
            "badgeText": "УДАХГҮЙ БОЛОХ ҮЙЛ ЯВДАЛ 2026"
        },
        "banner_03": {
            "title": "13 хэлээр орчуулагдсан 7 итгэл үнэмшлийн сургалтын хөтөлбөр",
            "subtitle": "Бурхан, Есүс Христ, Ариун Сүнс, Энх тайвны сэдвээр Ням гарагийн сургууль, семинарт зориулсан үнэгүй материалууд",
            "buttonText": "Материалууд үзэх",
            "secondaryButtonText": "Хичээлийн төлөвлөгөө",
            "badgeText": "СУРГАЛТ БА НӨӨЦ МАТЕРИАЛ"
        },
        "banner_04": {
            "title": "“Энхийг тогтоогчид юутай ерөөлтэй вэ”",
            "subtitle": "Матай 5:9 — Зөрчил, тэмцэл дунд энх тайвны зэмсэг болохоор дуудагдсан Азийн итгэгчдийн илэрхийлэл",
            "buttonText": "Нээлттэй хуваалцах талбар",
            "secondaryButtonText": "Залбирлын хана руу очих",
            "badgeText": "ЭНХ ТАЙВНЫ СУДАР"
        },
        "banner_05": {
            "title": "Гар гараа барилцан өргөх Залбирлын Хана (Live Prayer Wall)",
            "subtitle": "Мьянмар, Вьетнам, Энэтхэг, Балба... 13 орноос ирж буй залбирлын гуйлтад 'Амен' хэмээн хариулаарай",
            "buttonText": "Залбирлын гуйлт оруулах",
            "secondaryButtonText": "Ивээл хуваалцах өрөө",
            "badgeText": "НӨХӨРЛӨЛ БА ЗАЛБИРАЛ"
        }
    },
    "ja": {
        "banner_01": {
            "title": "アジア13カ国を結ぶ平和と教育の共同体",
            "subtitle": "言語や国境を越え、キリストの非暴力の平和と弟子道を共に学びます",
            "buttonText": "共に祈る（祈りの壁）",
            "secondaryButtonText": "7つの信仰箇条 教案",
            "badgeText": "AAMEN GLOBAL NETWORK"
        },
        "banner_02": {
            "title": "2026 MWC アジア・アナバプテスト連合カンファレンス",
            "subtitle": "「和解の福音、一つとなるアジア」— 各国コーディネーターおよび青年リーダーシップの参加受付中",
            "buttonText": "お知らせを見る",
            "secondaryButtonText": "ネットワーク日程",
            "badgeText": "UPCOMING EVENT 2026"
        },
        "banner_03": {
            "title": "13言語に完全翻訳された7つの信仰箇条 教案資料室",
            "subtitle": "神、イエス・キリスト、聖霊、平和と和解など、教会学校や神学校のための無料教育リソース",
            "buttonText": "資料室を見る",
            "secondaryButtonText": "指導案を見る",
            "badgeText": "CURRICULUM & RESOURCES"
        },
        "banner_04": {
            "title": "「平和をつくる人々は幸いである」",
            "subtitle": "マタイによる福音書 5:9 — 紛争や対立の中で平和の器として召されたアジアの信徒たちの告白",
            "buttonText": "自由広場に参加",
            "secondaryButtonText": "祈りの壁へ",
            "badgeText": "SCRIPTURE OF PEACE"
        },
        "banner_05": {
            "title": "手を取り合って捧げる祈りの壁 (Live Prayer Wall)",
            "subtitle": "ミャンマー、ベトナム、インド、ネパール… 13カ国からリアルタイムに届く祈りの題目に「アーメン」と応えましょう",
            "buttonText": "祈りのリクエストを投稿",
            "secondaryButtonText": "恵みの分かち合い",
            "badgeText": "FELLOWSHIP & PRAYER"
        }
    },
    "zh-TW": {
        "banner_01": {
            "title": "連結亞洲13國的和平與教育共同體",
            "subtitle": "跨越語言與國界，一同學習基督的非暴力和平與門徒之道",
            "buttonText": "一同禱告（禱告之牆）",
            "secondaryButtonText": "七大共同信念教案",
            "badgeText": "AAMEN 全球網絡"
        },
        "banner_02": {
            "title": "2026 MWC 亞洲重浸派聯合大會",
            "subtitle": "「和解的福音，合一的亞洲」— 各國協調員及青年領袖報名開放中",
            "buttonText": "查看最新消息",
            "secondaryButtonText": "網絡行事曆",
            "badgeText": "即將舉辦活動 2026"
        },
        "banner_03": {
            "title": "13種語言完全翻譯的七大共同信念教材資源庫",
            "subtitle": "涵蓋上帝、耶穌基督、聖靈、和平與和解，供主日學與神學院使用的免費教育資源",
            "buttonText": "瀏覽資源庫",
            "secondaryButtonText": "查看教案大綱",
            "badgeText": "課程與資源"
        },
        "banner_04": {
            "title": "「使人和睦的人有福了」",
            "subtitle": "馬太福音 5:9 — 亞洲信徒在衝突紛爭中蒙召成為和平使者的見證與告白",
            "buttonText": "加入自由交流區",
            "secondaryButtonText": "前往禱告之牆",
            "badgeText": "和平經文"
        },
        "banner_05": {
            "title": "攜手同心獻上的實時禱告牆 (Live Prayer Wall)",
            "subtitle": "緬甸、越南、印度、尼泊爾… 請以「阿們」回應來自13個國家的實時禱告代求",
            "buttonText": "發佈禱告代求",
            "secondaryButtonText": "恩典分享室",
            "badgeText": "團契與禱告"
        }
    },
    "vi": {
        "banner_01": {
            "title": "Cộng đồng hòa bình và giáo dục kết nối 13 quốc gia châu Á",
            "subtitle": "Vượt qua rào cản ngôn ngữ và biên giới để cùng học biết hòa bình phi bạo lực và môn đồ hóa của Đấng Christ",
            "buttonText": "Cùng nhau cầu nguyện (Bức tường cầu nguyện)",
            "secondaryButtonText": "7 Niềm Tin Chia Sẻ",
            "badgeText": "AAMEN TOÀN CẦU"
        },
        "banner_02": {
            "title": "Hội nghị Hiệp hội Anabaptist Châu Á MWC 2026",
            "subtitle": "“Phúc âm hòa giải, Một châu Á hiệp một” — Đang mở đăng ký cho các điều phối viên và lãnh đạo trẻ",
            "buttonText": "Xem thông báo",
            "secondaryButtonText": "Lịch sự kiện mạng lưới",
            "badgeText": "SỰ KIỆN SẮP TỚI 2026"
        },
        "banner_03": {
            "title": "Kho tài liệu 7 Niềm Tin Chia Sẻ được dịch sang 13 ngôn ngữ",
            "subtitle": "Tài liệu giáo dục miễn phí cho các trường Chúa Nhật và thần học viện về Đức Chúa Trời, Đấng Christ và Hòa bình",
            "buttonText": "Khám phá tài liệu",
            "secondaryButtonText": "Xem giáo án",
            "badgeText": "GIÁO TRÌNH & TÀI LIỆU"
        },
        "banner_04": {
            "title": "“Phước cho những kẻ làm cho người hòa thuận”",
            "subtitle": "Ma-thi-ơ 5:9 — Tiếng nói của các tín hữu châu Á được kêu gọi trở thành công cụ hòa bình giữa xung đột",
            "buttonText": "Tham gia diễn đàn chia sẻ",
            "secondaryButtonText": "Đến Bức tường cầu nguyện",
            "badgeText": "KINH THÁNH HÒA BÌNH"
        },
        "banner_05": {
            "title": "Bức tường cầu nguyện trực tiếp: Chung tay cầu thay (Live Prayer Wall)",
            "subtitle": "Myanmar, Việt Nam, Ấn Độ, Nepal... Hãy đáp lại bằng lời 'Amen' trước những lời cầu thay từ 13 quốc gia",
            "buttonText": "Gửi yêu cầu cầu nguyện",
            "secondaryButtonText": "Phòng chia sẻ ân điển",
            "badgeText": "THÔNG CÔNG & CẦU NGUYỆN"
        }
    },
    "th": {
        "banner_01": {
            "title": "ชุมชนแห่งสันติภาพและการศึกษาที่เชื่อมโยง 13 ประเทศในเอเชีย",
            "subtitle": "ก้าวข้ามภาษาและพรมแดนเพื่อเรียนรู้สันติภาพแบบอหิงสาและการเป็นสาวกของพระคริสต์ร่วมกัน",
            "buttonText": "ร่วมอธิษฐาน (กำแพงคำอธิษฐาน)",
            "secondaryButtonText": "บทเรียน 7 ความเชื่อร่วมกัน",
            "badgeText": "AAMEN เครือข่ายระดับโลก"
        },
        "banner_02": {
            "title": "การประชุมสามัคคีธรรมอนาแบปทิสต์แห่งเอเชีย MWC 2026",
            "subtitle": "“ข่าวประเสริฐแห่งการคืนดี เอเชียที่เป็นหนึ่งเดียว” — เปิดรับสมัครผู้ประสานงานและผู้นำเยาวชนแล้ว",
            "buttonText": "ดูประกาศ",
            "secondaryButtonText": "ปฏิทินเครือข่าย",
            "badgeText": "กิจกรรมที่กำลังจะมาถึง 2026"
        },
        "banner_03": {
            "title": "คลังทรัพยากรหลักสูตร 7 ความเชื่อร่วม แปลครบ 13 ภาษา",
            "subtitle": "สื่อการเรียนการสอนฟรีสำหรับรหัสโรงเรียนวันอาทิตย์และสถาบันพระคริสตธรรมเกี่ยวกับพระเจ้า พระคริสต์ และสันติภาพ",
            "buttonText": "สำรวจคลังทรัพยากร",
            "secondaryButtonText": "ดูแผนการสอน",
            "badgeText": "หลักสูตรและทรัพยากร"
        },
        "banner_04": {
            "title": "“บุคคลผู้สร้างสันติย่อมเป็นสุข”",
            "subtitle": "มัทธิว 5:9 — คำพยานของผู้เชื่อในเอเชียที่ได้รับการทรงเรียกให้เป็นเครื่องมือแห่งสันติภาพท่ามกลางความขัดแย้ง",
            "buttonText": "เข้าร่วมกระดานแบ่งปัน",
            "secondaryButtonText": "ไปที่กำแพงคำอธิษฐาน",
            "badgeText": "พระคัมภีร์แห่งสันติภาพ"
        },
        "banner_05": {
            "title": "กำแพงคำอธิษฐานแบบสด: ร่วมจับมือในการอธิษฐานวิงวอน (Live Prayer Wall)",
            "subtitle": "เมียนมา เวียดนาม อินเดีย เนปาล... ตอบรับด้วยคำว่า 'อาเมน' ต่อหัวข้ออธิษฐานแบบเรียลไทม์จาก 13 ประเทศ",
            "buttonText": "ส่งหัวข้ออธิษฐาน",
            "secondaryButtonText": "ห้องแบ่งปันพระคุณ",
            "badgeText": "สามัคคีธรรมและการอธิษฐาน"
        }
    },
    "id": {
        "banner_01": {
            "title": "Komunitas Perdamaian dan Pendidikan yang Menghubungkan 13 Negara Asia",
            "subtitle": "Melintasi bahasa dan batas negara untuk bersama mempelajari damai tanpa kekerasan dan pemuridan Kristus",
            "buttonText": "Berdoa Bersama (Tembok Doa)",
            "secondaryButtonText": "7 Keyakinan Bersama",
            "badgeText": "AAMEN GLOBAL NETWORK"
        },
        "banner_02": {
            "title": "Konferensi Persekutuan Anabaptis Asia MWC 2026",
            "subtitle": "“Injil Rekonsiliasi, Asia yang Bersatu” — Pendaftaran dibuka untuk koordinator dan kepemimpinan pemuda",
            "buttonText": "Lihat Pengumuman",
            "secondaryButtonText": "Kalender Jaringan",
            "badgeText": "ACARA MENDATANG 2026"
        },
        "banner_03": {
            "title": "Kurikulum 7 Keyakinan Bersama Diterjemahkan Lengkap dalam 13 Bahasa",
            "subtitle": "Materi pendidikan gratis untuk sekolah minggu dan seminari tentang Allah, Kristus, Roh Kudus, dan Damai",
            "buttonText": "Jelajahi Sumber Daya",
            "secondaryButtonText": "Lihat Rencana Pelajaran",
            "badgeText": "KURIKULUM & SUMBER DAYA"
        },
        "banner_04": {
            "title": "“Berbahagialah orang yang membawa damai”",
            "subtitle": "Matius 5:9 — Kesaksian orang percaya Asia yang dipanggil menjadi alat perdamaian di tengah konflik",
            "buttonText": "Bergabung di Forum Berbagi",
            "secondaryButtonText": "Tembok Doa Langsung",
            "badgeText": "AYAT PERDAMAIAN"
        },
        "banner_05": {
            "title": "Tembok Doa Langsung: Bergandengan Tangan dalam Syafaat (Live Prayer Wall)",
            "subtitle": "Myanmar, Vietnam, India, Nepal... Tanggapi dengan 'Amin' untuk pokok doa real-time dari 13 negara",
            "buttonText": "Kirim Pokok Doa",
            "secondaryButtonText": "Ruang Berbagi Kasih Karunia",
            "badgeText": "PERSEKUTUAN & DOA"
        }
    },
    "my": {
        "banner_01": {
            "title": "အာရှ (၁၃) နိုင်ငံကို ချိတ်ဆက်ထားသော ငြိမ်းချမ်းရေးနှင့် ပညာရေး အသိုက်အဝန်း",
            "subtitle": "ဘာသာစကားနှင့် နယ်နိမိတ်များကို ကျော်လွန်၍ ခရစ်တော်၏ အကြမ်းမဖက် ငြိမ်းချမ်းရေးနှင့် တပည့်တော်ဖြစ်ခြင်းကို အတူတကွ သင်ယူကြပါစို့",
            "buttonText": "အတူတကွ ဆုတောင်းခြင်း (ဆုတောင်းခြင်းနံရံ)",
            "secondaryButtonText": "အခြေခံယုံကြည်ချက် (၇) ချက်",
            "badgeText": "AAMEN ကမ္ဘာလုံးဆိုင်ရာကွန်ရက်"
        },
        "banner_02": {
            "title": "၂၀၂၆ MWC အာရှ အာနာဗက်တစ် မိတ်သဟာယ ညီလာခံ",
            "subtitle": "“ပြန်လည်သင့်မြတ်ခြင်း ဧဝံဂေလိ၊ တလုံးတဝတည်းဖြစ်သော အာရှ” — နိုင်ငံအလိုက် ညှိနှိုင်းရေးမှူးများနှင့် လူငယ်ခေါင်းဆောင်များ လျှောက်ထားနိုင်ပါပြီ",
            "buttonText": "ကြေညာချက်များ ကြည့်ရန်",
            "secondaryButtonText": "ကွန်ရက် ပြက္ခဒိန်",
            "badgeText": "လာမည့် အစီအစဉ် ၂၀၂၆"
        },
        "banner_03": {
            "title": "(၁၃) ဘာသာစကားဖြင့် အပြည့်အစုံ ဘာသာပြန်ထားသော အခြေခံယုံကြည်ချက် (၇) ချက် သင်ရိုးညွှန်းတမ်း",
            "subtitle": "ဘုရားသခင်၊ ခရစ်တော်၊ သန့်ရှင်းသောဝိညာဉ်တော်နှင့် ငြိမ်းချမ်းရေးဆိုင်ရာ တနင်္ဂနွေစာသင်ကျောင်းနှင့် ဓမ္မတက္ကသိုလ်များအတွက် အခမဲ့သင်ထောက်ကူများ",
            "buttonText": "သင်ထောက်ကူများ လေ့လာရန်",
            "secondaryButtonText": "သင်ခန်းစာ အစီအစဉ်များ",
            "badgeText": "သင်ရိုးညွှန်းတမ်းနှင့် သင်ထောက်ကူများ"
        },
        "banner_04": {
            "title": "“ရန်ငြိမ်းစေသောသူတို့သည် မင်္ဂလာရှိကြ၏”",
            "subtitle": "မဿဲ ၅:၉ — ပဋိပက္ခများကြားတွင် ငြိမ်းချမ်းရေးတန်ဆာအဖြစ် ခေါ်ယူခြင်းခံရသော အာရှယုံကြည်သူများ၏ ဝန်ခံချက်",
            "buttonText": "ပွင့်လင်းသော မျှဝေခြင်းဖိုရမ်",
            "secondaryButtonText": "ဆုတောင်းခြင်းနံရံသို့ သွားရန်",
            "badgeText": "ငြိမ်းချမ်းရေး ကျမ်းပိုဒ်"
        },
        "banner_05": {
            "title": "လက်တွဲ၍ ဆုတောင်းပေးသော တိုက်ရိုက်ဆုတောင်းခြင်းနံရံ (Live Prayer Wall)",
            "subtitle": "မြန်မာ၊ ဗီယက်နမ်၊ အိန္ဒိယ၊ နီပေါ... (၁၃) နိုင်ငံမှ အချိန်နှင့်တပြေးညီ တက်လာသော ဆုတောင်းချက်များကို 'အာမင်' ဖြင့် တုံ့ပြန်ပါ",
            "buttonText": "ဆုတောင်းချက် တင်သွင်းရန်",
            "secondaryButtonText": "ကျေးဇူးတော်မျှဝေခြင်း အခန်း",
            "badgeText": "မိတ်သဟာယနှင့် ဆုတောင်းခြင်း"
        }
    },
    "km": {
        "banner_01": {
            "title": "សហគមន៍សន្តិភាព និងការអប់រំដែលតភ្ជាប់ ១៣ ប្រទេសនៅអាស៊ី",
            "subtitle": "ឆ្លងកាត់ភាសា និងព្រំដែនដើម្បីរៀនសូត្រពីសន្តិភាពអហិង្សា និងភាពជាសិស្សរបស់ព្រះគ្រីស្ទជាមួយគ្នា",
            "buttonText": "អធិស្ឋានជាមួយគ្នា (ជញ្ជាំងអធិស្ឋាន)",
            "secondaryButtonText": "ជំនឿរួមទាំង ៧ យ៉ាង",
            "badgeText": "បណ្តាញសកល AAMEN"
        },
        "banner_02": {
            "title": "សន្និសីទមិត្តភាពអាណាបាទីស្ទអាស៊ី MWC ឆ្នាំ ២០២៦",
            "subtitle": "«ដំណឹងល្អនៃការផ្សះផ្សា អាស៊ីតែមួយ» — បើកទទួលការចុះឈ្មោះសម្រាប់អ្នកសម្របសម្រួល និងអ្នកដឹកនាំយុវជន",
            "buttonText": "មើលសេចក្តីជូនដំណឹង",
            "secondaryButtonText": "ប្រតិទិនបណ្តាញ",
            "badgeText": "ព្រឹត្តិការណ៍នាពេលខាងមុខ ២០២៦"
        },
        "banner_03": {
            "title": "ធនធានកម្មវិធីសិក្សាជំនឿរួមទាំង ៧ បកប្រែជា ១៣ ភាសាពេញលេញ",
            "subtitle": "ឯកសារអប់រំឥតគិតថ្លៃសម្រាប់សាលាថ្ងៃអាទិត្យ និងសាលាទេវវិទ្យាអំពីព្រះ ព្រះគ្រីស្ទ និងសន្តិភាព",
            "buttonText": "រកមើលធនធាន",
            "secondaryButtonText": "មើលគម្រោងមេរៀន",
            "badgeText": "កម្មវិធីសិក្សា និងធនធាន"
        },
        "banner_04": {
            "title": "«មានពរហើយ អស់អ្នកដែលបង្កើតសន្តិភាព»",
            "subtitle": "ម៉ាថាយ ៥:៩ — សក្ខីភាពរបស់អ្នកជឿអាស៊ីដែលត្រូវបានត្រាស់ហៅឱ្យធ្វើជាឧបករណ៍នៃសន្តិភាពក្នុងទំនាស់",
            "buttonText": "ចូលរួមវេទិកាចែករំលែក",
            "secondaryButtonText": "ទៅកាន់ជញ្ជាំងអធិស្ឋាន",
            "badgeText": "ព្រះគម្ពីរនៃសន្តិភាព"
        },
        "banner_05": {
            "title": "ជញ្ជាំងអធិស្ឋានផ្ទាល់៖ ចាប់ដៃគ្នាក្នុងការអធិស្ឋានអង្វរ (Live Prayer Wall)",
            "subtitle": "មីយ៉ាន់ម៉ា វៀតណាម ឥណ្ឌា នេប៉ាល់... ឆ្លើយតបដោយពាក្យ 'អាម៉ែន' ចំពោះសំណើអធិស្ឋានពី ១៣ ប្រទេស",
            "buttonText": "ដាក់ស្នើសំណើអធិស្ឋាន",
            "secondaryButtonText": "បន្ទប់ចែករំលែកព្រះគុណ",
            "badgeText": "ការប្រកប និងការអធិស្ឋាន"
        }
    },
    "lo": {
        "banner_01": {
            "title": "ຊຸມຊົນແຫ່ງສັນຕິພາບ ແລະ ການສຶກສາທີ່ເຊື່ອມໂຍງ 13 ປະເທດໃນອາຊີ",
            "subtitle": "ຂ້າມຜ່ານພາສາ ແລະ ຊາຍແດນ ເພື່ອຮຽນຮູ້ສັນຕິພາບແບບອະຫິງສາ ແລະ ການເປັນສິດຂອງພຣະຄຣິດຮ່ວມກັນ",
            "buttonText": "ຮ່ວມອະທິຖານ (ກຳແພງຄຳອະທິຖານ)",
            "secondaryButtonText": "ບົດຮຽນ 7 ຄວາມເຊື່ອຮ່ວມກັນ",
            "badgeText": "AAMEN ເຄືອຂ່າຍລະດັບໂລກ"
        },
        "banner_02": {
            "title": "ກອງປະຊຸມສາມັກຄີທຳອານາບັບຕິສອາຊີ MWC 2026",
            "subtitle": "“ຂ່າວປະເສີດແຫ່ງການຄືນດີ ອາຊີທີ່ເປັນໜຶ່ງດຽວ” — ເປີດຮັບສະໝັກຜູ້ປະສານງານ ແລະ ຜູ້ນຳຊາວໜຸ່ມແລ້ວ",
            "buttonText": "ເບິ່ງແຈ້ງການ",
            "secondaryButtonText": "ປະຕິທິນເຄືອຂ່າຍ",
            "badgeText": "ເຫດການທີ່ກຳລັງຈະມາເຖິງ 2026"
        },
        "banner_03": {
            "title": "ສາງຊັບພະຍາກອນຫຼັກສູດ 7 ຄວາມເຊື່ອຮ່ວມ ແປຄົບ 13 ພາສາ",
            "subtitle": "ເອກະສານການສຶກສາຟຣີສຳລັບໂຮງຮຽນວັນອາທິດ ແລະ ສະຖາບັນພຣະຄຳພີກ່ຽວກັບພຣະເຈົ້າ, ພຣະຄຣິດ ແລະ ສັນຕິພາບ",
            "buttonText": "ສຳຫຼວດຊັບພະຍາກອນ",
            "secondaryButtonText": "ເບິ່ງແຜນການສອນ",
            "badgeText": "ຫຼັກສູດ ແລະ ຊັບພະຍາກອນ"
        },
        "banner_04": {
            "title": "“ຜູ້ສ້າງສັນຕິສຸກຍ່ອມເປັນສຸກ”",
            "subtitle": "ມັດທາຍ 5:9 — ຄຳພະຍານຂອງຜູ້ເຊື່ອໃນອາຊີທີ່ໄດ້ຮັບການຊົງຮຽກໃຫ້ເປັນເຄື່ອງມືແຫ່ງສັນຕິພາບທ່າມກາງຄວາມຂັດແຍ່ງ",
            "buttonText": "ເຂົ້າຮ່ວມກະດານແບ່ງປັນ",
            "secondaryButtonText": "ໄປທີ່ກຳແພງຄຳອະທິຖານ",
            "badgeText": "ພຣະຄຳພີແຫ່ງສັນຕິພາບ"
        },
        "banner_05": {
            "title": "ກຳແພງຄຳອະທິຖານສົດ: ຈັບມືກັນໃນການອະທິຖານວິງວອນ (Live Prayer Wall)",
            "subtitle": "ມຽນມາ, ຫວຽດນາມ, ອິນເດຍ, ເນປານ... ຕອບຮັບດ້ວຍຄຳວ່າ 'ອາແມນ' ຕໍ່ຫົວຂໍ້ອະທິຖານແບບຮຽວທາຍຈາກ 13 ປະເທດ",
            "buttonText": "ສົ່ງຫົວຂໍ້ອະທິຖານ",
            "secondaryButtonText": "ຫ້ອງແບ່ງປັນພຣະຄຸນ",
            "badgeText": "ສາມັກຄີທຳ ແລະ ການອະທິຖານ"
        }
    },
    "hi": {
        "banner_01": {
            "title": "एशिया के 13 देशों को जोड़ने वाला शांति और शिक्षा का समुदाय",
            "subtitle": "भाषा और सीमाओं के पार, मसीह की अहिंसक शांति और शिष्यता को मिलकर सीखें",
            "buttonText": "साथ मिलकर प्रार्थना करें (प्रार्थना दीवार)",
            "secondaryButtonText": "7 साझा विश्वास पाठ्यचर्या",
            "badgeText": "AAMEN वैश्विक नेटवर्क"
        },
        "banner_02": {
            "title": "2026 MWC एशिया एनाबैपटिस्ट फैलोशिप सम्मेलन",
            "subtitle": "“सुलह का सुसमाचार, एकजुट एशिया” — राष्ट्रीय समन्वयकों और युवा नेतृत्व के लिए पंजीकरण खुला है",
            "buttonText": "सूचनाएं देखें",
            "secondaryButtonText": "नेटवर्क कैलेंडर",
            "badgeText": "आगामी कार्यक्रम 2026"
        },
        "banner_03": {
            "title": "13 भाषाओं में पूर्णतः अनुवादित 7 साझा विश्वास संसाधन",
            "subtitle": "रविवार स्कूल और सेमिनरी के लिए ईश्वर, मसीह, पवित्र आत्मा और शांति पर मुफ्त शैक्षिक सामग्री",
            "buttonText": "संसाधन ब्राउज़ करें",
            "secondaryButtonText": "पाठ योजनाएं देखें",
            "badgeText": "पाठ्यचर्या और संसाधन"
        },
        "banner_04": {
            "title": "“धन्य हैं वे जो मेल करवाने वाले हैं”",
            "subtitle": "मत्ती 5:9 — संघर्ष और कलह के बीच शांति का साधन बनने के लिए बुलाए गए एशियाई विश्वासियों की गवाही",
            "buttonText": "ओपन शेयरिंग बोर्ड में शामिल हों",
            "secondaryButtonText": "प्रार्थना दीवार पर जाएं",
            "badgeText": "शांति का वचन"
        },
        "banner_05": {
            "title": "लाइव प्रार्थना दीवार: मध्यस्थता में हाथ मिलाना (Live Prayer Wall)",
            "subtitle": "म्यांमार, वियतनाम, भारत, नेपाल... 13 देशों से वास्तविक समय में आने वाले प्रार्थना विषयों पर 'आमीन' कहें",
            "buttonText": "प्रार्थना विषय प्रस्तुत करें",
            "secondaryButtonText": "अनुग्रह साझाकरण कक्ष",
            "badgeText": "संगति और प्रार्थना"
        }
    },
    "ne": {
        "banner_01": {
            "title": "एसियाका १३ राष्ट्रहरूलाई जोड्ने शान्ति र शिक्षाको समुदाय",
            "subtitle": "भाषा र सीमापार ख्रीष्टको अहिंसात्मक शान्ति र चेलापन सँगै सिकौं",
            "buttonText": "सँगै प्रार्थना गरौं (प्रार्थना भित्ता)",
            "secondaryButtonText": "७ साझा विश्वासका पाठहरू",
            "badgeText": "AAMEN विश्वव्यापी सञ्जाल"
        },
        "banner_02": {
            "title": "२०२६ MWC एसिया एनाबाप्टिस्ट संगति सम्मेलन",
            "subtitle": "“मेलमिलापको सुसमाचार, एकताबद्ध एसिया” — राष्ट्रिय संयोजक र युवा नेतृत्वका लागि दर्ता खुला छ",
            "buttonText": "सूचनाहरू हेर्नुहोस्",
            "secondaryButtonText": "सञ्जाल पात्रो",
            "badgeText": "आगामी कार्यक्रम २०२६"
        },
        "banner_03": {
            "title": "१३ भाषाहरूमा पूर्ण रूपमा अनुवादित ७ साझा विश्वास स्रोतहरू",
            "subtitle": "आइतबारको संगति र सेमिनरीका लागि परमेश्वर, ख्रीष्ट, पवित्र आत्मा र शान्तिसम्बन्धी निःशुल्क सामग्री",
            "buttonText": "स्रोतहरू खोज्नुहोस्",
            "secondaryButtonText": "पाठ योजनाहरू हेर्नुहोस्",
            "badgeText": "पाठ्यक्रम र स्रोतहरू"
        },
        "banner_04": {
            "title": "“धन्य मेलमिलाप गराउनेहरू”",
            "subtitle": "मत्ती ५:९ — द्वन्द्वको बीचमा शान्तिको माध्यम बन्न बोलाइएका एसियाली विश्वासीहरूको गवाही",
            "buttonText": "खुला मञ्चमा सहभागी हुनुहोस्",
            "secondaryButtonText": "प्रार्थना भित्तामा जानुहोस्",
            "badgeText": "शान्तिको धर्मशास्त्र"
        },
        "banner_05": {
            "title": "प्रत्यक्ष प्रार्थना भित्ता: मध्यस्थतामा हात मिलाउँदै (Live Prayer Wall)",
            "subtitle": "म्यानमार, भियतनाम, भारत, नेपाल... १३ राष्ट्रहरूबाट आउने प्रार्थनाका विषयहरूमा 'आमेन' भन्नुहोस्",
            "buttonText": "प्रार्थनाको विषय पठाउनुहोस्",
            "secondaryButtonText": "अनुग्रह साझा कोठा",
            "badgeText": "संगति र प्रार्थना"
        }
    }
}

# 7대 신념 설명 (items_desc)
convictions_desc_data = {
    "ko": {
        "god": "창조주 하나님과 회복",
        "jesus": "삶과 가르침, 십자가와 부활",
        "spirit": "신자들의 부르심과 공동체",
        "church": "그리스도 중심의 성경 해석",
        "peace": "폭력 거부와 화해의 복음",
        "community": "삶으로 드리는 예배와 교제",
        "mission": "13개국 장벽을 넘는 그리스도의 몸"
    },
    "en": {
        "god": "Creator God and Restoration",
        "jesus": "Life, Teachings, Cross and Resurrection",
        "spirit": "Empowering Believers and Community",
        "church": "Christ-centered Biblical Interpretation",
        "peace": "Peace, Justice and Reconciliation",
        "community": "Worship, Fellowship and Mission",
        "mission": "Global Family in Christ Across 13 Nations"
    },
    "mn": {
        "god": "Бүтээгч Бурхан ба Эвлэрэл",
        "jesus": "Амьдрал, сургаал, загалмай ба амилалт",
        "spirit": "Итгэгчдийг хүчирхэгжүүлэх ба хамтын нийгэмлэг",
        "church": "Христ төвтэй Библийн тайлбар",
        "peace": "Энх тайван, шударга ёс ба эвлэрэл",
        "community": "Мөргөл, нөхөрлөл ба үйлчлэл",
        "mission": "Христ доторх 13 орны дэлхийн гэр бүл"
    },
    "ja": {
        "god": "創造主なる神と回復",
        "jesus": "生涯と教え、十字架と復活",
        "spirit": "信徒の召命と聖霊の共同体",
        "church": "キリスト中心の聖書解釈",
        "peace": "非暴力と和解の福音",
        "community": "礼拝、交わり、そして宣教",
        "mission": "13カ国の国境を越えるキリストの体"
    },
    "zh-TW": {
        "god": "創造主上帝與復和",
        "jesus": "生命、教導、十字架與復活",
        "spirit": "信徒的呼召與團契",
        "church": "以基督為中心的聖經詮釋",
        "peace": "和平、公義與和解的福音",
        "community": "敬拜、團契與宣教",
        "mission": "跨越13國界限的基督肢體"
    },
    "vi": {
        "god": "Thiên Chúa Sáng Tạo và Sự Phục Hồi",
        "jesus": "Đời sống, Giáo huấn, Thập tự giá và Phục sinh",
        "spirit": "Sự kêu gọi tín hữu và cộng đồng Thánh Linh",
        "church": "Giải nghĩa Kinh Thánh lấy Đấng Christ làm trung tâm",
        "peace": "Hòa bình, Công lý và Sự hòa giải",
        "community": "Thờ phượng, Thông công và Sứ mạng",
        "mission": "Thân thể Đấng Christ vượt qua 13 quốc gia"
    },
    "th": {
        "god": "พระผู้สร้างและการฟื้นฟู",
        "jesus": "พระชนม์ชีพ คำสอน ไม้กางเขน และการฟื้นคืนพระชนม์",
        "spirit": "การเสริมพลังผู้เชื่อและชุมชน",
        "church": "การตีความพระคัมภีร์โดยมีพระคริสต์เป็นศูนย์กลาง",
        "peace": "สันติภาพ ความยุติธรรม และการคืนดี",
        "community": "การนมัสการ การสามัคคีธรรม และพันธกิจ",
        "mission": "พระกายของพระคริสต์ข้ามพรมแดน 13 ประเทศ"
    },
    "id": {
        "god": "Allah Pencipta dan Pemulihan",
        "jesus": "Kehidupan, Ajaran, Salib dan Kebangkitan",
        "spirit": "Memperlengkapi Orang Percaya dan Komunitas",
        "church": "Penafsiran Alkitab Berpusat pada Kristus",
        "peace": "Damai, Keadilan dan Rekonsiliasi",
        "community": "Ibadah, Persekutuan dan Misi",
        "mission": "Tubuh Kristus Melintasi 13 Negara"
    },
    "my": {
        "god": "ဖန်ဆင်းရှင်ဘုရားသခင်နှင့် ပြန်လည်သင့်မြတ်ခြင်း",
        "jesus": "အသက်တာ၊ သွန်သင်ချက်၊ လက်ဝါးကပ်တိုင်နှင့် ရှင်ပြန်ထမြောက်ခြင်း",
        "spirit": "ယုံကြည်သူများအား ခွန်အားပေးခြင်းနှင့် အသင်းတော်အဖွဲ့အစည်း",
        "church": "ခရစ်တော်ဗဟိုပြု သမ္မာကျမ်းစာအနက်ဖွင့်ဆိုချက်",
        "peace": "ငြိမ်းချမ်းရေး၊ တရားမျှတမှုနှင့် ပြန်လည်သင့်မြတ်ခြင်း",
        "community": "ဝတ်ပြုကိုးကွယ်ခြင်း၊ မိတ်သဟာယနှင့် သာသနာ",
        "mission": "(၁၃) နိုင်ငံကို ဖြတ်ကျော်သော ခရစ်တော်၏ ခန္ဓာ"
    },
    "km": {
        "god": "ព្រះដ៏ជាអ្នកបង្កើត និងការផ្សះផ្សា",
        "jesus": "ជីវិត ការបង្រៀន ឈើឆ្កាង និងការរស់ឡើងវិញ",
        "spirit": "ការផ្តល់អំណាចដល់អ្នកជឿ និងសហគមន៍",
        "church": "ការបកស្រាយព្រះគម្ពីរផ្អែកលើព្រះគ្រីស្ទ",
        "peace": "សន្តិភាព យុត្តិធម៌ និងការផ្សះផ្សា",
        "community": "ការថ្វាយបង្គំ ការប្រកប និងបេសកកម្ម",
        "mission": "រូបកាយព្រះគ្រីស្ទឆ្លងកាត់ ១៣ ប្រទេស"
    },
    "lo": {
        "god": "ພຣະເຈົ້າຜູ້ສ້າງ ແລະ ການຟື້ນຟູ",
        "jesus": "ຊີວິດ, ຄຳສອນ, ໄມ້ກາງແຂນ ແລະ ການຟື້ນຄືນພຣະຊົນ",
        "spirit": "ການເສີມກຳລັງຜູ້ເຊື່ອ ແລະ ຊຸມຊົນ",
        "church": "ການຕີຄວາມພຣະຄຳພີໂດຍມີພຣະຄຣິດເປັນສູນກາງ",
        "peace": "ສັນຕິພາບ, ຄວາມຍຸຕິທຳ ແລະ ການຄືນດີ",
        "community": "ການນະມັດສະການ, ການສາມັກຄີທຳ ແລະ ພັນທະກິດ",
        "mission": "ພຣະກາຍຂອງພຣະຄຣິດຂ້າມ 13 ປະເທດ"
    },
    "hi": {
        "god": "सृष्टिकर्ता ईश्वर और पुनर्स्थापना",
        "jesus": "जीवन, शिक्षाएं, क्रूस और पुनरुत्थान",
        "spirit": "विश्वासियों और समुदाय का सशक्तीकरण",
        "church": "मसीह-केंद्रित बाइबिल व्याख्या",
        "peace": "शांति, न्याय और मेल-मिलाप",
        "community": "आराधना, संगति और मिशन",
        "mission": "13 देशों में फैला मसीह का शरीर"
    },
    "ne": {
        "god": "सृष्टिकर्ता परमेश्वर र पुनर्स्थापना",
        "jesus": "जीवन, शिक्षाहरू, क्रूस र पुनरुत्थान",
        "spirit": "विश्वासीहरू र समुदायको सशक्तिकरण",
        "church": "ख्रीष्ट-केन्द्रित बाइबलीय व्याख्या",
        "peace": "शान्ति, न्याय र मेलमिलाप",
        "community": "आराधना, संगति र मिसन",
        "mission": "१३ देशहरूमा ख्रीष्टको शरीर"
    }
}

# 기도의 벽 및 추가 UI 라벨
community_extra = {
    "ko": {
        "submit_prayer": "기도제목 나누기",
        "view_all_prayers": "기도의 벽 전체보기",
        "anonymous_member": "익명 성도",
        "restricted_guest": "비회원 제한",
        "preview_line": "1줄 공개",
        "amen_action": "아멘",
        "praying_action": "함께 기도하기",
        "toast_guest": "🚫 비회원은 로그인 후 기도제목을 작성하실 수 있습니다.",
        "toast_associate": "🔒 기도제목 작성은 2단계(정회원) 이상 승인 후 가능합니다.",
        "photo_count_label": "앨범 {count}장"
    },
    "en": {
        "submit_prayer": "Submit Prayer Request",
        "view_all_prayers": "View All Prayers",
        "anonymous_member": "Anonymous Member",
        "restricted_guest": "Restricted",
        "preview_line": "1-Line Preview",
        "amen_action": "Amen",
        "praying_action": "Pray Along",
        "toast_guest": "🚫 Guests must log in to submit a prayer request.",
        "toast_associate": "🔒 Level 2 (Regular Member) approval required to submit prayer requests.",
        "photo_count_label": "{count} Photos"
    },
    "mn": {
        "submit_prayer": "Залбирлын гуйлт оруулах",
        "view_all_prayers": "Бүх залбирлыг үзэх",
        "anonymous_member": "Нэргүй гишүүн",
        "restricted_guest": "Хязгаарлагдмал",
        "preview_line": "1 мөр урьдчилан харах",
        "amen_action": "Амен",
        "praying_action": "Хамтдаа залбирах",
        "toast_guest": "🚫 Залбирлын гуйлт оруулахын тулд эхлээд нэвтэрнэ үү.",
        "toast_associate": "🔒 Залбирлын гуйлт бичихийн тулд 2-р түвшин (Албан ёсны гишүүн) зөвшөөрөл шаардлагатай.",
        "photo_count_label": "{count} зураг"
    },
    "ja": {
        "submit_prayer": "祈りのリクエストを投稿",
        "view_all_prayers": "祈りの壁をすべて見る",
        "anonymous_member": "匿名信徒",
        "restricted_guest": "ゲスト制限",
        "preview_line": "1行プレビュー",
        "amen_action": "アーメン",
        "praying_action": "共に祈る",
        "toast_guest": "🚫 ゲストはログイン後に祈りのリクエストを投稿できます。",
        "toast_associate": "🔒 祈りの投稿にはレベル2（正会員）以上の承認が必要です。",
        "photo_count_label": "写真{count}枚"
    },
    "zh-TW": {
        "submit_prayer": "發佈禱告代求",
        "view_all_prayers": "查看所有禱告代求",
        "anonymous_member": "匿名會友",
        "restricted_guest": "訪客受限",
        "preview_line": "單行預覽",
        "amen_action": "阿們",
        "praying_action": "一同禱告",
        "toast_guest": "🚫 訪客請先登入後再發佈禱告代求。",
        "toast_associate": "🔒 發佈禱告需通過第二級（正式會員）審核。",
        "photo_count_label": "{count}張相片"
    },
    "vi": {
        "submit_prayer": "Gửi yêu cầu cầu nguyện",
        "view_all_prayers": "Xem tất cả lời cầu nguyện",
        "anonymous_member": "Thành viên ẩn danh",
        "restricted_guest": "Hạn chế",
        "preview_line": "Xem trước 1 dòng",
        "amen_action": "Amen",
        "praying_action": "Cùng cầu nguyện",
        "toast_guest": "🚫 Khách cần đăng nhập để gửi yêu cầu cầu nguyện.",
        "toast_associate": "🔒 Cần được phê duyệt Cấp 2 (Thành viên chính thức) để gửi lời cầu nguyện.",
        "photo_count_label": "{count} ảnh"
    },
    "th": {
        "submit_prayer": "ส่งหัวข้ออธิษฐาน",
        "view_all_prayers": "ดูกำแพงคำอธิษฐานทั้งหมด",
        "anonymous_member": "สมาชิกไม่ระบุชื่อ",
        "restricted_guest": "จำกัดสิทธิ์",
        "preview_line": "ดูตัวอย่าง 1 บรรทัด",
        "amen_action": "อาเมน",
        "praying_action": "ร่วมอธิษฐาน",
        "toast_guest": "🚫 ผู้มาเยือนต้องเข้าสู่ระบบก่อนส่งหัวข้ออธิษฐาน",
        "toast_associate": "🔒 ต้องได้รับการอนุมัติระดับ 2 (สมาชิกทั่วไป) จึงจะส่งหัวข้ออธิษฐานได้",
        "photo_count_label": "{count} รูปภาพ"
    },
    "id": {
        "submit_prayer": "Kirim Pokok Doa",
        "view_all_prayers": "Lihat Semua Pokok Doa",
        "anonymous_member": "Anggota Anonim",
        "restricted_guest": "Terbatas",
        "preview_line": "Pratinjau 1 Baris",
        "amen_action": "Amin",
        "praying_action": "Berdoa Bersama",
        "toast_guest": "🚫 Pengunjung harus masuk untuk mengirim pokok doa.",
        "toast_associate": "🔒 Persetujuan Tingkat 2 (Anggota Biasa) diperlukan untuk mengirim pokok doa.",
        "photo_count_label": "{count} Foto"
    },
    "my": {
        "submit_prayer": "ဆုတောင်းချက် တင်သွင်းရန်",
        "view_all_prayers": "ဆုတောင်းချက်အားလုံး ကြည့်ရန်",
        "anonymous_member": "အမည်မဖော်လိုသော အသင်းဝင်",
        "restricted_guest": "ကန့်သတ်ထားသည်",
        "preview_line": "(၁) ကြောင်းသာ ကြည့်ရှုခွင့်",
        "amen_action": "အာမင်",
        "praying_action": "အတူတကွ ဆုတောင်းရန်",
        "toast_guest": "🚫 ဆုတောင်းချက်တင်ရန် အရင်ဆုံး အကောင့်ဝင်ပါ။",
        "toast_associate": "🔒 ဆုတောင်းချက်တင်ရန် အဆင့် (၂) တရားဝင်အသင်းဝင် ခွင့်ပြုချက် လိုအပ်ပါသည်။",
        "photo_count_label": "ဓာတ်ပုံ {count} ပုံ"
    },
    "km": {
        "submit_prayer": "ដាក់ស្នើសំណើអធិស្ឋាន",
        "view_all_prayers": "មើលការអធិស្ឋានទាំងអស់",
        "anonymous_member": "សមាជិកអនាមិក",
        "restricted_guest": "មានកម្រិត",
        "preview_line": "មើលជាមុន ១ បន្ទាត់",
        "amen_action": "អាម៉ែន",
        "praying_action": "អធិស្ឋានជាមួយគ្នា",
        "toast_guest": "🚫 ភ្ញៀវត្រូវតែចូលដើម្បីដាក់ស្នើសំណើអធិស្ឋាន។",
        "toast_associate": "🔒 ត្រូវការការយល់ព្រមកម្រិត ២ (សមាជិកពេញសិទ្ធិ) ដើម្បីដាក់ស្នើសំណើអធិស្ឋាន។",
        "photo_count_label": "{count} រូបថត"
    },
    "lo": {
        "submit_prayer": "ສົ່ງຫົວຂໍ້ອະທິຖານ",
        "view_all_prayers": "ເບິ່ງຫົວຂໍ້ອະທິຖານທັງໝົດ",
        "anonymous_member": "ສະມາຊິກບໍ່ລະບຸຊື່",
        "restricted_guest": "ຈຳກັດສິດ",
        "preview_line": "ເບິ່ງຕົວຢ່າງ 1 ແຖວ",
        "amen_action": "ອາແມນ",
        "praying_action": "ຮ່ວມອະທິຖານ",
        "toast_guest": "🚫 ແຂກຕ້ອງເຂົ້າສູ່ລະບົບກ່ອນສົ່ງຫົວຂໍ້ອະທິຖານ.",
        "toast_associate": "🔒 ຕ້ອງໄດ້ຮັບການອະນຸມັດລະດັບ 2 (ສະມາຊິກທົ່ວໄປ) ຈຶ່ງຈະສົ່ງຫົວຂໍ້ອະທິຖານໄດ້.",
        "photo_count_label": "{count} ຮູບພາບ"
    },
    "hi": {
        "submit_prayer": "प्रार्थना विषय प्रस्तुत करें",
        "view_all_prayers": "सभी प्रार्थनाएं देखें",
        "anonymous_member": "गुमनाम सदस्य",
        "restricted_guest": "प्रतिबंधित",
        "preview_line": "1-पंक्ति पूर्वावलोकन",
        "amen_action": "आमीन",
        "praying_action": "साथ मिलकर प्रार्थना करें",
        "toast_guest": "🚫 प्रार्थना विषय प्रस्तुत करने के लिए कृपया लॉगिन करें।",
        "toast_associate": "🔒 प्रार्थना प्रस्तुत करने के लिए स्तर 2 (नियमित सदस्य) की मंजूरी आवश्यक है।",
        "photo_count_label": "{count} तस्वीरें"
    },
    "ne": {
        "submit_prayer": "प्रार्थनाको विषय पठाउनुहोस्",
        "view_all_prayers": "सबै प्रार्थनाहरू हेर्नुहोस्",
        "anonymous_member": "अज्ञात सदस्य",
        "restricted_guest": "प्रतिबन्धित",
        "preview_line": "१-लाइन पूर्वावलोकन",
        "amen_action": "आमेन",
        "praying_action": "सँगै प्रार्थना गरौं",
        "toast_guest": "🚫 प्रार्थना विषय पठाउन कृपया लगइन गर्नुहोस्।",
        "toast_associate": "🔒 प्रार्थना पठाउन स्तर २ (नियमित सदस्य) स्वीकृति आवश्यक छ।",
        "photo_count_label": "{count} तस्बिरहरू"
    }
}

def main():
    locales = list(banners_data.keys())
    for loc in locales:
        file_path = os.path.join(MESSAGES_DIR, f"{loc}.json")
        if not os.path.exists(file_path):
            print(f"Warning: {file_path} not found!")
            continue

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # 1. banners 주입
        data["banners"] = banners_data[loc]

        # 2. convictions.items_desc 주입
        if "convictions" not in data:
            data["convictions"] = {}
        data["convictions"]["items_desc"] = convictions_desc_data[loc]

        # 3. community 추가 키 주입
        if "community" not in data:
            data["community"] = {}
        for k, v in community_extra[loc].items():
            data["community"][k] = v

        # 4. home photo_count_label 주입
        if "home" not in data:
            data["home"] = {}
        data["home"]["photo_count_label"] = community_extra[loc]["photo_count_label"]

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"Successfully updated: {loc}.json")

if __name__ == "__main__":
    main()
