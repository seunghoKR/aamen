// 📜 AAMEN 15-Nation History and Timeline Dataset
// Faithfully translated and structured across all 15 AAMEN member countries
// Generated with responsive timeline and multi-language support by Youngja

export interface HistoryTaskForce {
  num: number
  name: string
  nameEn: string
  desc: string
}

export interface EarlyConversationItem {
  date: string
  place: string
  title: string
  desc: string
}

export interface HistoryTimelineItem {
  date: string
  place: string
  event: string
}

export interface HistoryLocaleData {
  badge: string
  mainTitle: string
  subtitle: string
  readPdfLabel: string
  sections: {
    need: {
      badge: string
      title: string
      paragraphs: string[]
    }
    early: {
      badge: string
      title: string
      lead: string
      items: EarlyConversationItem[]
    }
    renewing: {
      badge: string
      title: string
      paragraphs: string[]
      taskForcesIntro: string
      taskForces: HistoryTaskForce[]
    }
    gathering: {
      badge: string
      title: string
      paragraphs: string[]
    }
  }
  timeline: {
    badge: string
    title: string
    headers: {
      date: string
      place: string
      event: string
    }
    items: HistoryTimelineItem[]
  }
}

export const historyDataByLocale: Record<string, HistoryLocaleData> = {
  "ko": {
    "badge": "AAMEN 발자취",
    "mainTitle": "AAMEN 역사 (History)",
    "subtitle": "아시아 땅에 아나뱁티스트 신학 교육의 씨앗을 뿌리고 함께 가꾸어 온 여정",
    "readPdfLabel": "원문 PDF 보기",
    "sections": {
      "need": {
        "badge": "배경 및 문제의식",
        "title": "필요를 인식하다 (Recognizing the Need)",
        "paragraphs": [
          "1990년대 중반부터 아시아의 교회 지도자와 신학자들은 한 가지 공통된 문제의식을 나누기 시작했습니다. 바로 아시아 지역에 아나뱁티스트 성서·신학 교육이 부족하다는 것이었습니다.",
          "몇몇 예외는 있었습니다. 인도의 유니온 신학교(Union Theological Seminary), 필리핀에서 IMC와 함께한 훈련원, 베트남 메노나이트 교회의 성경학교, 인도네시아 두타 와차나 기독교대학교 신학부(Duta Wacana Christian University) 등입니다. 그러나 이 가운데 일부는 오래가지 못했고, 다른 일부는 여러 교단이 함께 운영하는 곳이었습니다."
        ]
      },
      "early": {
        "badge": "초기 역사",
        "title": "초기의 논의 (Early Conversations)",
        "lead": "그동안 세계 아나뱁티스트 공동체가 신학 교육이라는 선물을 어떻게 맡아 가꾸도록 부름받았는지를 묻는 자리가 공식·비공식으로 여러 차례 있었습니다.",
        "items": [
          {
            "date": "1996년 1월",
            "place": "미국 시카고 지역",
            "title": "탈기독교 세계의 메노나이트 교육 협의회",
            "desc": "현재 AAMEN에 참여하는 이들이 기억하는 가장 이른 모임으로, '탈기독교 세계의 메노나이트 교육(Mennonite Education in a Post-Christian World)'을 주제로 깊이 있는 협의를 가졌습니다."
          },
          {
            "date": "1997년 1월",
            "place": "인도 콜카타",
            "title": "다섯 대륙의 신학 교육 협의회",
            "desc": "메노나이트세계협의회(MWC)는 제13차 세계총회를 며칠 앞두고 전 세계 5대 대륙의 신학 교육 현황과 과제를 진단하는 협의회를 개최했습니다."
          },
          {
            "date": "2006년 3월 13–16일",
            "place": "마카오",
            "title": "동아시아 아나뱁티스트 지도력 개발 협의회",
            "desc": "교회 지도자들은 아시아 아나뱁티스트-메노나이트 교단들이 마주한 기회와 과제를 논의했습니다. 이 자리에서 '아시아에 기반을 두고 아시아가 빚어가는 유연한 신학 교육을 발전시키자'는 강력한 권고가 도출되었습니다. 선발된 교회 지도자들을 훈련하여 더 넓은 교회 안에 아나뱁티스트 정체성을 굳건히 세우는 것이 그 목적이었습니다."
          }
        ]
      },
      "renewing": {
        "badge": "새로운 도약",
        "title": "비전을 새롭게 하다 (Renewing the Vision)",
        "paragraphs": [
          "그로부터 거의 20년이 지나, 캐나다 메노나이트 교회의 지넷 핸슨(Jeanette Hanson)과 메노나이트 선교 네트워크의 안디 산토소(Andi Santoso)가 이 비전을 새롭게 그리고 실천에 옮기는 구체적인 걸음을 내디뎠습니다.",
          "이들의 부름에 응답한 이들이 2024년 9월 14–18일 인도네시아 족자카르타의 두타 와차나 기독교대학교에 모였습니다. 이 자리에는 MWC 지역 대표 두 사람인 신시아 피콕(Cynthia Peacock, 남아시아)과 제레마이어 최(Jeremiah Choi, 동북아시아)를 비롯하여 인도네시아, 일본, 미얀마, 필리핀, 한국, 미국(AMBS)의 교회 지도자들이 함께했습니다."
        ],
        "taskForcesIntro": "나눔과 브레인스토밍을 거쳐 참석자들은 세 분야에서 함께 일하기로 결정하고 태스크포스(Task Force)를 출범시켰습니다.",
        "taskForces": [
          {
            "num": 1,
            "name": "웹사이트 태스크포스",
            "nameEn": "Website Task Force",
            "desc": "아시아 전역의 자료를 발굴하고 이를 온 성도와 나눌 디지털 허브 및 공유 방안을 마련합니다."
          },
          {
            "num": 2,
            "name": "교육과정 개발 태스크포스",
            "nameEn": "Curriculum Development Task Force",
            "desc": "신학 교육의 우선순위를 분별하고 현장 중심의 교육 콘텐츠 체계를 정립합니다."
          },
          {
            "num": 3,
            "name": "진행 지원 태스크포스",
            "nameEn": "Facilitation Task Force",
            "desc": "구성원 간의 네트워크 연결을 유지하고, 사역 진행을 감독하며, 대면 모임을 기획합니다."
          }
        ]
      },
      "gathering": {
        "badge": "연합과 확장",
        "title": "첫 AAMEN 게더링 (The First AAMEN Gathering)",
        "paragraphs": [
          "2025년 10월 31일부터 11월 4일까지 태국 쿤끌랑(Kun Klang)에서 역사적인 첫 번째 AAMEN 게더링이 성황리에 개최되었습니다.",
          "몽족 제20지구 교단(Hmong District 20)이 모임을 따뜻하게 호스팅해 주었으며, 이 자리에서 세 개의 태스크포스는 지속 가능하고 전문적인 3대 워킹그룹(Working Groups)으로 공식 확대 개편되었습니다."
        ]
      }
    },
    "timeline": {
      "badge": "연대표",
      "title": "AAMEN 주요 연표 (Timeline)",
      "headers": {
        "date": "시기",
        "place": "장소",
        "event": "주요 내용"
      },
      "items": [
        {
          "date": "1990년대 중반",
          "place": "아시아 전역",
          "event": "아시아 교회 지도자들과 신학자들이 아나뱁티스트 신학 교육의 결핍에 대한 공통된 문제의식을 제기함"
        },
        {
          "date": "1996년 1월",
          "place": "미국 시카고 지역",
          "event": "\"탈기독교 세계의 메노나이트 교육\"을 주제로 최초의 협의회 개최"
        },
        {
          "date": "1997년 1월",
          "place": "인도 콜카타",
          "event": "MWC 제13차 세계총회에 앞서 '다섯 대륙의 신학 교육 협의회' 개최"
        },
        {
          "date": "2006년 3월 13–16일",
          "place": "마카오",
          "event": "'동아시아 아나뱁티스트 지도력 개발 협의회'; 아시아 상황에 기반한 유연한 신학 교육 발전 강력 권고"
        },
        {
          "date": "2024년 9월 14–18일",
          "place": "인도네시아 족자카르타",
          "event": "두타 와차나 기독교대학교에서 비전 재점화 모임(지넷 핸슨, 안디 산토소 제안); 3대 태스크포스 공식 구성"
        },
        {
          "date": "2025년 10월 31일 – 11월 4일",
          "place": "태국 쿤끌랑",
          "event": "첫 AAMEN 게더링 개최 (몽족 제20지구 교단 주관); 3대 태스크포스를 3대 워킹그룹으로 전격 확대"
        },
        {
          "date": "2026년 11월",
          "place": "필리핀 라구나주 룸반",
          "event": "2026 AAMEN 총회 및 연합 모임 개최 예정 (2026 AAMEN Meeting)"
        }
      ]
    }
  },
  "en": {
    "badge": "AAMEN Heritage",
    "mainTitle": "AAMEN History",
    "subtitle": "The Journey of Planting and Nurturing Anabaptist Theological Education in Asia",
    "readPdfLabel": "View Original PDF",
    "sections": {
      "need": {
        "badge": "Origins & Vision",
        "title": "Recognizing the Need",
        "paragraphs": [
          "In the mid-1990s, church leaders and theologians across Asia began to speak about a shared concern: the lack of Anabaptist biblical and theological education in the region.",
          "There were some exceptions, among them Union Theological Seminary in India, a training centre in the Philippines with IMC, the Bible school of the Vietnamese Mennonite Church, and the Faculty of Theology at Duta Wacana Christian University in Indonesia. Some of these efforts were short-lived, however, and others were shared with several denominations."
        ]
      },
      "early": {
        "badge": "Foundational Gatherings",
        "title": "Early Conversations",
        "lead": "Over the years, there have been many occasions, both formal and informal, to ask how the global Anabaptist communion is called to steward the gift of theological education.",
        "items": [
          {
            "date": "January 1996",
            "place": "Chicago area, USA",
            "title": "Consultation on Mennonite Education in a Post-Christian World",
            "desc": "The earliest such gathering remembered by those now involved in AAMEN was a consultation on \"Mennonite Education in a Post-Christian World.\""
          },
          {
            "date": "January 1997",
            "place": "Calcutta, India",
            "title": "Consultation on Theological Education on Five Continents",
            "desc": "A few days before its 13th Global Assembly, Mennonite World Conference (MWC) held the Consultation on Theological Education on Five Continents."
          },
          {
            "date": "March 13–16, 2006",
            "place": "Macau",
            "title": "Consultation on Anabaptist Leadership Development in East Asia",
            "desc": "Church leaders discussed the opportunities and challenges facing Anabaptist-Mennonite conferences in Asia. One strong recommendation emerged: to develop flexible theological education that is based in Asia and shaped by Asia. Its purpose would be to train selected church leaders who could, in turn, strengthen a lasting Anabaptist identity in the wider church."
          }
        ]
      },
      "renewing": {
        "badge": "New Momentum",
        "title": "Renewing the Vision",
        "paragraphs": [
          "Nearly two decades later, Jeanette Hanson (Mennonite Church Canada) and Andi Santoso (Mennonite Mission Network) took a concrete step to reimagine this vision and put it into practice.",
          "Those who responded to their call met at Duta Wacana Christian University in Yogyakarta, Indonesia, on September 14–18, 2024. Participants included two MWC regional representatives, Cynthia Peacock (South Asia) and Jeremiah Choi (Northeast Asia), along with church leaders from Indonesia, Japan, Myanmar, the Philippines, South Korea, and the United States (AMBS)."
        ],
        "taskForcesIntro": "Through sharing and brainstorming, the group decided to work together in three areas:",
        "taskForces": [
          {
            "num": 1,
            "name": "Website Task Force",
            "nameEn": "Website Task Force",
            "desc": "Finding resources and establishing the means to share them across the region."
          },
          {
            "num": 2,
            "name": "Curriculum Development Task Force",
            "nameEn": "Curriculum Development Task Force",
            "desc": "Discerning educational priorities and systematically organizing educational content."
          },
          {
            "num": 3,
            "name": "Facilitation Task Force",
            "nameEn": "Facilitation Task Force",
            "desc": "Keeping members connected, overseeing progress, and planning in-person meetings."
          }
        ]
      },
      "gathering": {
        "badge": "Expansion",
        "title": "The First AAMEN Gathering",
        "paragraphs": [
          "From October 31 to November 4, 2025, the first AAMEN Gathering took place in Kun Klang, Thailand, hosted by the Hmong District 20 church conference.",
          "There, the three task forces were expanded into three permanent Working Groups."
        ]
      }
    },
    "timeline": {
      "badge": "Chronology",
      "title": "Historical Timeline",
      "headers": {
        "date": "Date",
        "place": "Place",
        "event": "Event"
      },
      "items": [
        {
          "date": "Mid-1990s",
          "place": "Asia",
          "event": "Church leaders and theologians raise concern over the lack of Anabaptist theological education in Asia"
        },
        {
          "date": "January 1996",
          "place": "Chicago area, USA",
          "event": "Consultation on \"Mennonite Education in a Post-Christian World\""
        },
        {
          "date": "January 1997",
          "place": "Calcutta, India",
          "event": "MWC Consultation on Theological Education on Five Continents, held before the 13th Global Assembly"
        },
        {
          "date": "March 13–16, 2006",
          "place": "Macau",
          "event": "Consultation on Anabaptist Leadership Development in East Asia; recommendation for flexible, Asia-based theological education"
        },
        {
          "date": "September 14–18, 2024",
          "place": "Yogyakarta, Indonesia",
          "event": "Meeting at Duta Wacana Christian University, initiated by Jeanette Hanson and Andi Santoso; three task forces formed"
        },
        {
          "date": "October 31 – November 4, 2025",
          "place": "Kun Klang, Thailand",
          "event": "First AAMEN Gathering, hosted by Hmong District 20; task forces expanded into three Working Groups"
        },
        {
          "date": "November 2026",
          "place": "Lumban, Laguna, Philippines",
          "event": "2026 AAMEN Meeting"
        }
      ]
    }
  },
  "ja": {
    "badge": "AAMENの軌跡",
    "mainTitle": "AAMENの歴史 (History)",
    "subtitle": "アジアの地にアナバプテスト神学教育の種を蒔き、共に育んできた歩み",
    "readPdfLabel": "原文PDFを見る",
    "sections": {
      "need": {
        "badge": "背景と問題意識",
        "title": "必要性の認識 (Recognizing the Need)",
        "paragraphs": [
          "1990年代半ばから、アジア各地の教会指導者や神学者たちは共通の課題について語り始めました。それは、この地域におけるアナバプテストの聖書的・神学的な教育の不足でした。",
          "インドのユニオン神学校、フィリピンでのIMCによる研修センター、ベトナム・メノナイト教会の聖書学校、インドネシアのドゥタ・ワチャナキリスト教大学神学部など、いくつかの先駆的な試みは存在しました。しかし、それらの活動のいくつかは短期間で終了し、他のものは複数教派による共同運営でした。"
        ]
      },
      "early": {
        "badge": "初期の対話",
        "title": "初期の議論 (Early Conversations)",
        "lead": "長年にわたり、世界のアナバプテスト共同体が神学教育という賜物をどのように管理し育むべきかを問う場が、公式・非公式に数多く持たれました。",
        "items": [
          {
            "date": "1996年1月",
            "place": "米国シカゴ近郊",
            "title": "「ポスト・キリスト教世界におけるメノナイト教育」協議会",
            "desc": "現在AAMENに携わる人々が記憶する最初期の集まりで、「ポスト・キリスト教世界におけるメノナイト教育」を主題に深い議論が交わされました。"
          },
          {
            "date": "1997年1月",
            "place": "インド・コルカタ",
            "title": "5大陸神学教育協議会",
            "desc": "世界メノナイト会議（MWC）は第13回世界総会の数日前に、5大陸における神学教育に関する協議会を開催しました。"
          },
          {
            "date": "2006年3月13〜16日",
            "place": "マカオ",
            "title": "東アジア・アナバプテスト指導者育成協議会",
            "desc": "教会指導者たちがアジアのアナバプテスト・メノナイト諸教団が直面する機会と課題を協議しました。ここで「アジアに根ざし、アジアによって形作られる柔軟な神学教育を発展させる」という力強い提言がなされました。選抜された教会指導者を育成し、より広い教会の中で持続的なアナバプテストのアイデンティティを確立することがその目的でした。"
          }
        ]
      },
      "renewing": {
        "badge": "新たな展開",
        "title": "ビジョンを新たに (Renewing the Vision)",
        "paragraphs": [
          "それから約20年を経て、カナダ・メノナイト教会のジャネット・ハンソン（Jeanette Hanson）とメノナイト・ミッション・ネットワークのアンディ・サントソ（Andi Santoso）が、このビジョンを再構築し実践に移す具体的な一歩を踏み出しました。",
          "その呼びかけに応えた指導者たちが、2024年9月14〜18日、インドネシア・ジョグジャカルタのドゥタ・ワチャナキリスト教大学に集まりました。参加者には、MWCの地域代表であるシンシア・ピーコック（南アジア）とジェレマイア・チェ（北東アジア）の2名をはじめ、インドネシア、日本、ミャンマー、フィリピン、韓国、米国（AMBS）の教会指導者が含まれていました。"
        ],
        "taskForcesIntro": "分かち合いとブレインストーミングを経て、参加者は3つの分野で協働することを決定し、タスクフォースを発足させました。",
        "taskForces": [
          {
            "num": 1,
            "name": "ウェブサイト・タスクフォース",
            "nameEn": "Website Task Force",
            "desc": "資料の発掘と、それらを地域全体で共有するためのデジタルプラットフォームを構築する。"
          },
          {
            "num": 2,
            "name": "カリキュラム開発タスクフォース",
            "nameEn": "Curriculum Development Task Force",
            "desc": "教育の優先事項を見極め、体系的な教育コンテンツを組織化する。"
          },
          {
            "num": 3,
            "name": "進行支援（ファシリテーション）タスクフォース",
            "nameEn": "Facilitation Task Force",
            "desc": "メンバー間の繋がりを維持し、進捗を見守り、対面集会を企画する。"
          }
        ]
      },
      "gathering": {
        "badge": "結束と発展",
        "title": "第1回 AAMEN ギャザリング (The First AAMEN Gathering)",
        "paragraphs": [
          "2025年10月31日から11月4日にかけて、タイのクンクラーン（Kun Klang）にて歴史的な第1回AAMENギャザリングが開催されました。",
          "モン族第20地区教会協議会（Hmong District 20）が温かくホストを務め、この場で3つのタスクフォースは恒常的な3つのワーキンググループ（Working Groups）へと拡大・発展しました。"
        ]
      }
    },
    "timeline": {
      "badge": "年表",
      "title": "AAMENの歴史年表 (Timeline)",
      "headers": {
        "date": "時期",
        "place": "場所",
        "event": "主な出来事"
      },
      "items": [
        {
          "date": "1990年代半ば",
          "place": "アジア各地",
          "event": "アジアの教会指導者や神学者がアナバプテスト神学教育の不足に対する危機感を共有"
        },
        {
          "date": "1996年1月",
          "place": "米国シカゴ近郊",
          "event": "「ポスト・キリスト教世界におけるメノナイト教育」協議会を開催"
        },
        {
          "date": "1997年1月",
          "place": "インド・コルカタ",
          "event": "MWC第13回世界総会に先立ち「5大陸神学教育協議会」を開催"
        },
        {
          "date": "2006年3月13〜16日",
          "place": "マカオ",
          "event": "「東アジア・アナバプテスト指導者育成協議会」にてアジアに基づく柔軟な神学教育を提言"
        },
        {
          "date": "2024年9月14〜18日",
          "place": "インドネシア・ジョグジャカルタ",
          "event": "ドゥタ・ワチャナ大学にてビジョン再構築集会（J. ハンソン、A. サントソ発起）；3大タスクフォースを結成"
        },
        {
          "date": "2025年10月31日〜11月4日",
          "place": "タイ・クンクラーン",
          "event": "第1回AAMENギャザリング開催（モン族第20地区主催）；タスクフォースを3大ワーキンググループへ拡大"
        },
        {
          "date": "2026年11月",
          "place": "フィリピン・ラグナ州ルンバン",
          "event": "2026年 AAMEN 総会・連合集会（2026 AAMEN Meeting）開催予定"
        }
      ]
    }
  },
  "zh-TW": {
    "badge": "AAMEN 歷程",
    "mainTitle": "AAMEN 歷史 (History)",
    "subtitle": "在亞洲大地播下重洗派神學教育種子並攜手耕耘的信心之旅",
    "readPdfLabel": "查閱原版 PDF",
    "sections": {
      "need": {
        "badge": "背景與呼召",
        "title": "體認需要 (Recognizing the Need)",
        "paragraphs": [
          "從1990年代中葉開始，亞洲各地的教會領袖與神學家開始共同探討一個切身的關注：本區域極度缺乏重洗派的聖經與神學教育。",
          "雖然有一些先鋒特例，包括印度的協和神學院（Union Theological Seminary）、菲律賓與IMC合作的培訓中心、越南門諾會的聖經學校，以及印尼杜塔瓦查納基督教大學神學部（Duta Wacana Christian University）等。然而，其中一部分嘗試歷時短暫，另一部分則是由多個宗派共同運作。"
        ]
      },
      "early": {
        "badge": "早期探討",
        "title": "初期的研討 (Early Conversations)",
        "lead": "多年來，無論是在正式或非正式場合，全球重洗派信仰群體多次聚集，共同尋求如何善用並託管神學教育這份屬天恩賜。",
        "items": [
          {
            "date": "1996年1月",
            "place": "美國芝加哥地區",
            "title": "後基督教世界中的門諾會教育諮詢會",
            "desc": "現今參與AAMEN的成員所銘記最早的聚會，是以「後基督教世界中的門諾會教育（Mennonite Education in a Post-Christian World）」為主題的深入研討。"
          },
          {
            "date": "1997年1月",
            "place": "印度加爾各答",
            "title": "五大洲神學教育諮詢會",
            "desc": "世界門諾會大會（MWC）在第13屆全球大會召開前數日，舉行了「五大洲神學教育諮詢會」，共同把脈全球神學教育挑戰。"
          },
          {
            "date": "2006年3月13–16日",
            "place": "澳門",
            "title": "東亞重洗派領袖發展諮詢會",
            "desc": "教會領袖深入探討了亞洲重洗派－門諾宗教會所面臨的機遇與挑戰。會中提出一項強而有力的建議：發展以亞洲為根基、由亞洲塑造的靈活神學教育。其宗旨是培育遴選出的教會領袖，進而在更廣泛的教會中堅立歷久彌新的重洗派身分認同。"
          }
        ]
      },
      "renewing": {
        "badge": "重塑藍圖",
        "title": "重塑願景 (Renewing the Vision)",
        "paragraphs": [
          "將近二十年後，加拿大門諾教會的珍妮特·漢森（Jeanette Hanson）與門諾會宣教網絡的安迪·桑托索（Andi Santoso）採取了切實行動，重新勾勒這項願景並將其付諸實踐。",
          "回應其呼召的成員於2024年9月14–18日齊聚印尼日惹的杜塔瓦查納基督教大學。參與者包含兩位MWC區域代表：辛西婭·皮考克（Cynthia Peacock，南亞）與蔡少琪牧師（Jeremiah Choi，東北亞），以及來自印尼、日本、緬甸、菲律賓、韓國與美國（AMBS神學院）的教會領袖。"
        ],
        "taskForcesIntro": "經過深入交流與腦力激盪，與會者決議在三大領域齊心協力，並成立專責工作小組（Task Force）：",
        "taskForces": [
          {
            "num": 1,
            "name": "網站工作小組",
            "nameEn": "Website Task Force",
            "desc": "搜集發掘教學資源，並建立推動全亞洲分享的數位樞紐與共享途徑。"
          },
          {
            "num": 2,
            "name": "課程發展工作小組",
            "nameEn": "Curriculum Development Task Force",
            "desc": "明辨神學教育之優先次序，有系統地編纂與統整教育內容。"
          },
          {
            "num": 3,
            "name": "協調推動工作小組",
            "nameEn": "Facilitation Task Force",
            "desc": "維繫成員彼此間的緊密聯繫，督導事工推展進程，並策劃實體聚集。"
          }
        ]
      },
      "gathering": {
        "badge": "合一拓展",
        "title": "首屆 AAMEN 大會 (The First AAMEN Gathering)",
        "paragraphs": [
          "2025年10月31日至11月4日，歷史性的首屆AAMEN大會於泰國坤克朗（Kun Klang）盛大舉行。",
          "本次聚會由苗族第20教區協會（Hmong District 20）熱情主辦。在此大會中，三個工作小組正式拓展晉升為三大常設工作組（Working Groups）。"
        ]
      }
    },
    "timeline": {
      "badge": "編年紀要",
      "title": "AAMEN 歷史年表 (Timeline)",
      "headers": {
        "date": "時期",
        "place": "地點",
        "event": "重大歷史事件"
      },
      "items": [
        {
          "date": "1990年代中葉",
          "place": "亞洲全域",
          "event": "亞洲教會領袖與神學家共同提出亞洲缺乏重洗派神學教育之深切關注"
        },
        {
          "date": "1996年1月",
          "place": "美國芝加哥地區",
          "event": "召開「後基督教世界中的門諾會教育」首次諮詢研討會"
        },
        {
          "date": "1997年1月",
          "place": "印度加爾各答",
          "event": "MWC第13屆大會前夕舉辦「五大洲神學教育諮詢會」"
        },
        {
          "date": "2006年3月13–16日",
          "place": "澳門",
          "event": "「東亞重洗派領袖發展諮詢會」；強力建議推展立足亞洲之靈活神學教育體系"
        },
        {
          "date": "2024年9月14–18日",
          "place": "印尼日惹",
          "event": "杜塔瓦查納大學重塑願景聚集（J. Hanson與A. Santoso倡議）；確立三大工作小組"
        },
        {
          "date": "2025年10月31日–11月4日",
          "place": "泰國坤克朗",
          "event": "首屆AAMEN大會隆重舉行（苗族第20教區主辦）；工作小組正式升格為三大常設工作組"
        },
        {
          "date": "2026年11月",
          "place": "菲律賓拉古納省倫班",
          "event": "預定召開 2026 AAMEN 全球年會（2026 AAMEN Meeting）"
        }
      ]
    }
  },
  "zh-HK": {
    "badge": "AAMEN 歷程",
    "mainTitle": "AAMEN 歷史 (History)",
    "subtitle": "在亞洲大地播下重洗派神學教育種子並攜手耕耘的信心之旅",
    "readPdfLabel": "查閱原版 PDF",
    "sections": {
      "need": {
        "badge": "背景與呼召",
        "title": "體認需要 (Recognizing the Need)",
        "paragraphs": [
          "從1990年代中葉開始，亞洲各地的教會領袖與神學家開始共同探討一個切身的關注：本區域極度缺乏重洗派的聖經與神學教育。",
          "雖然有一些先鋒特例，包括印度的協和神學院（Union Theological Seminary）、菲律賓與IMC合作的培訓中心、越南門諾會的聖經學校，以及印尼杜塔瓦查納基督教大學神學部（Duta Wacana Christian University）等。然而，其中一部分嘗試歷時短暫，另一部分則是由多個宗派共同運作。"
        ]
      },
      "early": {
        "badge": "早期探討",
        "title": "初期的研討 (Early Conversations)",
        "lead": "多年來，無論是在正式或非正式場合，全球重洗派信仰群體多次聚集，共同尋求如何善用並託管神學教育這份屬天恩賜。",
        "items": [
          {
            "date": "1996年1月",
            "place": "美國芝加哥地區",
            "title": "後基督教世界中的門諾會教育諮詢會",
            "desc": "現今參與AAMEN的成員所銘記最早的聚會，是以「後基督教世界中的門諾會教育（Mennonite Education in a Post-Christian World）」為主題的深入研討。"
          },
          {
            "date": "1997年1月",
            "place": "印度加爾各答",
            "title": "五大洲神學教育諮詢會",
            "desc": "世界門諾會大會（MWC）在第13屆全球大會召開前數日，舉行了「五大洲神學教育諮詢會」，共同把脈全球神學教育挑戰。"
          },
          {
            "date": "2006年3月13–16日",
            "place": "澳門",
            "title": "東亞重洗派領袖發展諮詢會",
            "desc": "教會領袖深入探討了亞洲重洗派－門諾宗教會所面臨的機遇與挑戰。會中提出一項強而有力的建議：發展以亞洲為根基、由亞洲塑造的靈活神學教育。其宗旨是培育遴選出的教會領袖，進而在更廣泛的教會中堅立歷久彌新的重洗派身分認同。"
          }
        ]
      },
      "renewing": {
        "badge": "重塑藍圖",
        "title": "重塑願景 (Renewing the Vision)",
        "paragraphs": [
          "將近二十年後，加拿大門諾教會的珍妮特·漢森（Jeanette Hanson）與門諾會宣教網絡的安迪·桑托索（Andi Santoso）採取了切實行動，重新勾勒這項願景並將其付諸實踐。",
          "回應其呼召的成員於2024年9月14–18日齊聚印尼日惹的杜塔瓦查納基督教大學。參與者包含兩位MWC區域代表：辛西婭·皮考克（Cynthia Peacock，南亞）與蔡少琪牧師（Jeremiah Choi，東北亞），以及來自印尼、日本、緬甸、菲律賓、韓國與美國（AMBS神學院）的教會領袖。"
        ],
        "taskForcesIntro": "經過深入交流與腦力激盪，與會者決議在三大領域齊心協力，並成立專責工作小組（Task Force）：",
        "taskForces": [
          {
            "num": 1,
            "name": "網站工作小組",
            "nameEn": "Website Task Force",
            "desc": "搜集發掘教學資源，並建立推動全亞洲分享的數位樞紐與共享途徑。"
          },
          {
            "num": 2,
            "name": "課程發展工作小組",
            "nameEn": "Curriculum Development Task Force",
            "desc": "明辨神學教育之優先次序，有系統地編纂與統整教育內容。"
          },
          {
            "num": 3,
            "name": "協調推動工作小組",
            "nameEn": "Facilitation Task Force",
            "desc": "維繫成員彼此間的緊密聯繫，督導事工推展進程，並策劃實體聚集。"
          }
        ]
      },
      "gathering": {
        "badge": "合一拓展",
        "title": "首屆 AAMEN 大會 (The First AAMEN Gathering)",
        "paragraphs": [
          "2025年10月31日至11月4日，歷史性的首屆AAMEN大會於泰國坤克朗（Kun Klang）盛大舉行。",
          "本次聚會由苗族第20教區協會（Hmong District 20）熱情主辦。在此大會中，三個工作小組正式拓展晉升為三大常設工作組（Working Groups）。"
        ]
      }
    },
    "timeline": {
      "badge": "編年紀要",
      "title": "AAMEN 歷史年表 (Timeline)",
      "headers": {
        "date": "時期",
        "place": "地點",
        "event": "重大歷史事件"
      },
      "items": [
        {
          "date": "1990年代中葉",
          "place": "亞洲全域",
          "event": "亞洲教會領袖與神學家共同提出亞洲缺乏重洗派神學教育之深切關注"
        },
        {
          "date": "1996年1月",
          "place": "美國芝加哥地區",
          "event": "召開「後基督教世界中的門諾會教育」首次諮詢研討會"
        },
        {
          "date": "1997年1月",
          "place": "印度加爾各答",
          "event": "MWC第13屆大會前夕舉辦「五大洲神學教育諮詢會」"
        },
        {
          "date": "2006年3月13–16日",
          "place": "澳門",
          "event": "「東亞重洗派領袖發展諮詢會」；強力建議推展立足亞洲之靈活神學教育體系"
        },
        {
          "date": "2024年9月14–18日",
          "place": "印尼日惹",
          "event": "杜塔瓦查納大學重塑願景聚集（J. Hanson與A. Santoso倡議）；確立三大工作小組"
        },
        {
          "date": "2025年10月31日–11月4日",
          "place": "泰國坤克朗",
          "event": "首屆AAMEN大會隆重舉行（苗族第20教區主辦）；工作小組正式升格為三大常設工作組"
        },
        {
          "date": "2026年11月",
          "place": "菲律賓拉古納省倫班",
          "event": "預定召開 2026 AAMEN 全球年會（2026 AAMEN Meeting）"
        }
      ]
    }
  },
  "tl": {
    "badge": "Pamanang AAMEN",
    "mainTitle": "Kasaysayan ng AAMEN (History)",
    "subtitle": "Ang Paglalakbay ng Pagpupunla at Pag-aaruga ng Teolohikong Edukasyong Anabaptist sa Asya",
    "readPdfLabel": "Tingnan ang Orihinal na PDF",
    "sections": {
      "need": {
        "badge": "Pinagmulan at Pangitain",
        "title": "Pagkilala sa Pangangailangan (Recognizing the Need)",
        "paragraphs": [
          "Noong kalagitnaan ng dekada 1990, nagsimulang pag-usapan ng mga pinuno ng simbahan at teologo sa buong Asya ang isang pinagsasaluhang suliranin: ang kakulangan ng biblikal at teolohikong edukasyong Anabaptist sa rehiyon.",
          "May ilang mga natatanging pagsisikap, kabilang ang Union Theological Seminary sa India, isang sentro ng pagsasanay sa Pilipinas kasama ang IMC, ang Bible school ng Vietnamese Mennonite Church, at ang Faculty of Theology sa Duta Wacana Christian University sa Indonesia. Gayunpaman, ang ilan sa mga ito ay panandalian lamang, at ang iba naman ay pinagsasaluhan ng iba't ibang denominasyon."
        ]
      },
      "early": {
        "badge": "Mga Unang Pagtitipon",
        "title": "Mga Maagang Pag-uusap (Early Conversations)",
        "lead": "Sa paglipas ng mga taon, nagkaroon ng maraming pagkakataon, pormal man o impormal, upang itanong kung paano tinatawag ang pandaigdigang komunyon ng Anabaptist na pangalagaan ang kaloob ng teolohikong edukasyon.",
        "items": [
          {
            "date": "Enero 1996",
            "place": "Lugar ng Chicago, USA",
            "title": "Konsultasyon sa Edukasyong Mennonite sa Post-Christian World",
            "desc": "Ang pinakamaagang pagtitipon na naaalala ng mga kasalukuyang kasangkot sa AAMEN ay isang konsultasyon tungkol sa \"Mennonite Education in a Post-Christian World.\""
          },
          {
            "date": "Enero 1997",
            "place": "Calcutta, India",
            "title": "Konsultasyon sa Teolohikong Edukasyon sa Limang Kontinente",
            "desc": "Ilang araw bago ang ika-13 nitong Global Assembly, idinaos ng Mennonite World Conference (MWC) ang Consultation on Theological Education on Five Continents."
          },
          {
            "date": "Marso 13–16, 2006",
            "place": "Macau",
            "title": "Konsultasyon sa Pagpapaunlad ng Pamumunong Anabaptist sa Silangang Asya",
            "desc": "Tinalakay ng mga pinuno ng simbahan ang mga oportunidad at hamon na kinakaharap ng mga kumperensyang Anabaptist-Mennonite sa Asya. Lumitaw ang isang matibay na rekomendasyon: bumuo ng pleksibleng teolohikong edukasyon na nakabatay sa Asya at hinubog ng Asya. Layunin nitong sanayin ang mga piniling pinuno upang patatagin ang pangmatagalang pagkakakilanlang Anabaptist sa mas malawak na simbahan."
          }
        ]
      },
      "renewing": {
        "badge": "Bagong Hakbang",
        "title": "Pagpapanibago ng Pananaw (Renewing the Vision)",
        "paragraphs": [
          "Halos dalawang dekada ang lumipas, sina Jeanette Hanson (Mennonite Church Canada) at Andi Santoso (Mennonite Mission Network) ay gumawa ng kongkretong hakbang upang muling isipin at isakatuparan ang pananaw na ito.",
          "Ang mga tumugon sa kanilang panawagan ay nagpulong sa Duta Wacana Christian University sa Yogyakarta, Indonesia, noong Setyembre 14–18, 2024. Kabilang sa mga kalahok ang dalawang kinatawan ng rehiyon ng MWC, sina Cynthia Peacock (Timog Asya) at Jeremiah Choi (Hilagang-Silangang Asya), kasama ang mga pinuno ng simbahan mula sa Indonesia, Hapon, Myanmar, Pilipinas, Timog Korea, at Estados Unidos (AMBS)."
        ],
        "taskForcesIntro": "Sa pamamagitan ng pagbabahagi at palitan ng kaisipan, nagpasiya ang grupo na magtulungan sa tatlong larangan:",
        "taskForces": [
          {
            "num": 1,
            "name": "Website Task Force",
            "nameEn": "Website Task Force",
            "desc": "Paghahanap ng mga kagamitan at pamamaraan upang ibahagi ang mga ito sa buong rehiyon."
          },
          {
            "num": 2,
            "name": "Curriculum Development Task Force",
            "nameEn": "Curriculum Development Task Force",
            "desc": "Pag-unawa sa mga priyoridad sa edukasyon at maayos na pagsasaayos ng nilalaman ng pagtuturo."
          },
          {
            "num": 3,
            "name": "Facilitation Task Force",
            "nameEn": "Facilitation Task Force",
            "desc": "Pagpapanatili ng ugnayan ng mga miyembro, pagsubaybay sa pagsulong, at pagpaplano ng mga personal na pagtitipon."
          }
        ]
      },
      "gathering": {
        "badge": "Pagpapalawak",
        "title": "Ang Unang Pagtitipon ng AAMEN (The First AAMEN Gathering)",
        "paragraphs": [
          "Mula Oktubre 31 hanggang Nobyembre 4, 2025, ginanap ang unang AAMEN Gathering sa Kun Klang, Thailand, sa pangunguna ng Hmong District 20 church conference.",
          "Doon, ang tatlong task force ay opisyal na pinalawak tungo sa tatlong permanenteng Working Groups."
        ]
      }
    },
    "timeline": {
      "badge": "Kronolohiya",
      "title": "Makasaysayang Talaan ng Oras (Timeline)",
      "headers": {
        "date": "Panahon",
        "place": "Lugar",
        "event": "Pangyayari"
      },
      "items": [
        {
          "date": "Gitnang dekada 1990",
          "place": "Buong Asya",
          "event": "Nagpahayag ng pagkabahala ang mga pinuno ng simbahan ukol sa kakulangan ng teolohikong edukasyong Anabaptist sa Asya"
        },
        {
          "date": "Enero 1996",
          "place": "Lugar ng Chicago, USA",
          "event": "Konsultasyon tungkol sa \"Mennonite Education in a Post-Christian World\""
        },
        {
          "date": "Enero 1997",
          "place": "Calcutta, India",
          "event": "MWC Consultation on Theological Education on Five Continents bago ang ika-13 Global Assembly"
        },
        {
          "date": "Marso 13–16, 2006",
          "place": "Macau",
          "event": "Konsultasyon sa Pagpapaunlad ng Pamumuno; rekomendasyon para sa teolohikong edukasyon na nakabatay sa Asya"
        },
        {
          "date": "Setyembre 14–18, 2024",
          "place": "Yogyakarta, Indonesia",
          "event": "Pagpupulong sa Duta Wacana Christian University sa pangunguna nina J. Hanson at A. Santoso; tatlong task force ang binuo"
        },
        {
          "date": "Oktubre 31 – Nobyembre 4, 2025",
          "place": "Kun Klang, Thailand",
          "event": "Unang Pagtitipon ng AAMEN (pinangunahan ng Hmong District 20); pinalawak ang mga task force tungo sa tatlong Working Groups"
        },
        {
          "date": "Nobyembre 2026",
          "place": "Lumban, Laguna, Pilipinas",
          "event": "Nakatakdang Pangkalahatang Pagpupulong ng AAMEN para sa taong 2026 (2026 AAMEN Meeting)"
        }
      ]
    }
  },
  "id": {
    "badge": "Warisan AAMEN",
    "mainTitle": "Sejarah AAMEN (History)",
    "subtitle": "Perjalanan Menabur dan Merawat Pendidikan Teologi Anabaptis di Tanah Asia",
    "readPdfLabel": "Lihat PDF Asli",
    "sections": {
      "need": {
        "badge": "Latar Belakang & Panggilan",
        "title": "Menyadari Kebutuhan (Recognizing the Need)",
        "paragraphs": [
          "Pada pertengahan 1990-an, para pemimpin gereja dan teolog di seluruh Asia mulai menyuarakan keprihatinan bersama: kurangnya pendidikan Alkitab dan teologi Anabaptis di kawasan ini.",
          "Ada beberapa pengecualian, antara lain Union Theological Seminary di India, pusat pelatihan di Filipina bersama IMC, sekolah Alkitab Gereja Mennonit Vietnam, dan Fakultas Teologi di Universitas Kristen Duta Wacana di Indonesia. Namun, beberapa dari upaya ini berumur pendek, dan yang lainnya dijalankan bersama beberapa denominasi."
        ]
      },
      "early": {
        "badge": "Pertemuan Awal",
        "title": "Percakapan Awal (Early Conversations)",
        "lead": "Selama bertahun-tahun, ada banyak kesempatan, baik formal maupun informal, untuk mempertanyakan bagaimana persekutuan Anabaptis global dipanggil mengelola karunia pendidikan teologi.",
        "items": [
          {
            "date": "Januari 1996",
            "place": "Kawasan Chicago, AS",
            "title": "Konsultasi Pendidikan Mennonit di Dunia Pasca-Kristen",
            "desc": "Pertemuan paling awal yang diingat oleh mereka yang kini terlibat dalam AAMEN adalah konsultasi tentang \"Pendidikan Mennonit di Dunia Pasca-Kristen\" (Mennonite Education in a Post-Christian World)."
          },
          {
            "date": "Januari 1997",
            "place": "Kalkuta, India",
            "title": "Konsultasi Pendidikan Teologi di Lima Benua",
            "desc": "Beberapa hari sebelum Sidang Raya Global ke-13, Mennonite World Conference (MWC) menyelenggarakan Konsultasi Pendidikan Teologi di Lima Benua."
          },
          {
            "date": "13–16 Maret 2006",
            "place": "Makau",
            "title": "Konsultasi Pengembangan Kepemimpinan Anabaptis di Asia Timur",
            "desc": "Para pemimpin gereja membahas peluang dan tantangan yang dihadapi konferensi Anabaptis-Mennonit di Asia. Satu rekomendasi kuat mengemuka: mengembangkan pendidikan teologi yang fleksibel, berbasis di Asia, dan dibentuk oleh Asia. Tujuannya adalah melatih para pemimpin gereja terpilih yang pada gilirannya memperkuat identitas Anabaptis yang langgeng di gereja yang lebih luas."
          }
        ]
      },
      "renewing": {
        "badge": "Langkah Baru",
        "title": "Memperbarui Visi (Renewing the Vision)",
        "paragraphs": [
          "Hampir dua dekade kemudian, Jeanette Hanson (Mennonite Church Canada) dan Andi Santoso (Mennonite Mission Network) mengambil langkah nyata untuk membayangkan kembali visi ini dan mewujudkannya dalam tindakan.",
          "Mereka yang menanggapi panggilan ini berkumpul di Universitas Kristen Duta Wacana di Yogyakarta, Indonesia, pada 14–18 September 2024. Peserta mencakup dua perwakilan wilayah MWC, Cynthia Peacock (Asia Selatan) dan Jeremiah Choi (Asia Timur Laut), bersama para pemimpin gereja dari Indonesia, Jepang, Myanmar, Filipina, Korea Selatan, dan Amerika Serikat (AMBS)."
        ],
        "taskForcesIntro": "Melalui saling berbagi dan bertukar pikiran, kelompok ini memutuskan bekerja sama dalam tiga bidang dan membentuk gugus tugas (Task Force):",
        "taskForces": [
          {
            "num": 1,
            "name": "Gugus Tugas Situs Web",
            "nameEn": "Website Task Force",
            "desc": "Menemukan sumber daya dan menyediakan sarana digital untuk membagikannya ke seluruh kawasan."
          },
          {
            "num": 2,
            "name": "Gugus Tugas Pengembangan Kurikulum",
            "nameEn": "Curriculum Development Task Force",
            "desc": "Mencermati prioritas pendidikan dan menyusun konten materi pembelajaran secara sistematis."
          },
          {
            "num": 3,
            "name": "Gugus Tugas Fasilitasi",
            "nameEn": "Facilitation Task Force",
            "desc": "Menjaga keterhubungan antaranggota, mengawasi kemajuan program, dan merencanakan pertemuan tatap muka."
          }
        ]
      },
      "gathering": {
        "badge": "Perluasan",
        "title": "Pertemuan AAMEN Pertama (The First AAMEN Gathering)",
        "paragraphs": [
          "Dari tanggal 31 Oktober hingga 4 November 2025, Pertemuan AAMEN pertama berlangsung di Kun Klang, Thailand, diselenggarakan dengan hangat oleh sinode gereja Hmong District 20.",
          "Di sana, ketiga gugus tugas secara resmi diperluas menjadi tiga Kelompok Kerja (Working Groups) tetap."
        ]
      }
    },
    "timeline": {
      "badge": "Garis Waktu",
      "title": "Garis Waktu Sejarah (Timeline)",
      "headers": {
        "date": "Waktu",
        "place": "Tempat",
        "event": "Peristiwa Bersejarah"
      },
      "items": [
        {
          "date": "Pertengahan 1990-an",
          "place": "Seluruh Asia",
          "event": "Pemimpin gereja dan teolog menyuarakan keprihatinan atas minimnya pendidikan teologi Anabaptis di Asia"
        },
        {
          "date": "Januari 1996",
          "place": "Kawasan Chicago, AS",
          "event": "Konsultasi tentang \"Pendidikan Mennonit di Dunia Pasca-Kristen\" diadakan"
        },
        {
          "date": "Januari 1997",
          "place": "Kalkuta, India",
          "event": "Konsultasi Pendidikan Teologi Lima Benua oleh MWC menjelang Sidang Raya ke-13"
        },
        {
          "date": "13–16 Maret 2006",
          "place": "Makau",
          "event": "Konsultasi Pemimpin Asia Timur; rekomendasi kuat untuk pendidikan teologi fleksibel berbasis Asia"
        },
        {
          "date": "14–18 September 2024",
          "place": "Yogyakarta, Indonesia",
          "event": "Pertemuan di UKDW atas prakarsa J. Hanson & A. Santoso; pembentukan 3 gugus tugas utama"
        },
        {
          "date": "31 Okt – 4 Nov 2025",
          "place": "Kun Klang, Thailand",
          "event": "Pertemuan AAMEN Pertama (tuan rumah Hmong District 20); gugus tugas diperluas menjadi Kelompok Kerja"
        },
        {
          "date": "November 2026",
          "place": "Lumban, Laguna, Filipina",
          "event": "Rencana Pertemuan Sinode Global AAMEN 2026 (2026 AAMEN Meeting)"
        }
      ]
    }
  },
  "vi": {
    "badge": "Di sản AAMEN",
    "mainTitle": "Lịch sử AAMEN (History)",
    "subtitle": "Hành trình Gieo mầm và Nuôi dưỡng Giáo dục Thần học Anabaptist tại Châu Á",
    "readPdfLabel": "Xem Bản gốc PDF",
    "sections": {
      "need": {
        "badge": "Bối cảnh & Trăn trở",
        "title": "Nhận biết Nhu cầu (Recognizing the Need)",
        "paragraphs": [
          "Vào giữa những năm 1990, các nhà lãnh đạo giáo hội và các nhà thần học trên khắp châu Á bắt đầu chia sẻ một trăn trở chung: sự thiếu hụt giáo dục Kinh Thánh và thần học Anabaptist trong khu vực.",
          "Có một số trường hợp ngoại lệ, trong đó có Chủng viện Thần học Union ở Ấn Độ, một trung tâm huấn luyện tại Philippines với IMC, trường Kinh Thánh của Giáo hội Mennonite Việt Nam, và Khoa Thần học tại Đại học Cơ Đốc Duta Wacana ở Indonesia. Tuy nhiên, một số nỗ lực này chỉ tồn tại trong thời gian ngắn, và những nỗ lực khác được chia sẻ giữa nhiều giáo phái."
        ]
      },
      "early": {
        "badge": "Giai đoạn Sơ khai",
        "title": "Những Cuộc đối thoại Ban đầu (Early Conversations)",
        "lead": "Trong nhiều năm qua, đã có nhiều cơ hội, cả chính thức lẫn không chính thức, để tìm hiểu cách thức cộng đồng Anabaptist toàn cầu được kêu gọi để quản lý ân tứ giáo dục thần học.",
        "items": [
          {
            "date": "Tháng 1 năm 1996",
            "place": "Khu vực Chicago, Hoa Kỳ",
            "title": "Hội nghị Tham vấn về Giáo dục Mennonite trong Thế giới Hậu Cơ Đốc",
            "desc": "Cuộc tụ họp sớm nhất được ghi nhớ bởi những người hiện đang tham gia AAMEN là cuộc tham vấn về chủ đề \"Giáo dục Mennonite trong Thế giới Hậu Cơ Đốc\"."
          },
          {
            "date": "Tháng 1 năm 1997",
            "place": "Calcutta, Ấn Độ",
            "title": "Tham vấn về Giáo dục Thần học trên Năm Châu lục",
            "desc": "Vài ngày trước Đại hội Toàn cầu lần thứ 13, Hội nghị Thế giới Mennonite (MWC) đã tổ chức Hội nghị Tham vấn về Giáo dục Thần học trên Năm Châu lục."
          },
          {
            "date": "13–16 Tháng 3 năm 2006",
            "place": "Ma Cao",
            "title": "Tham vấn về Phát triển Lãnh đạo Anabaptist ở Đông Á",
            "desc": "Các nhà lãnh đạo giáo hội đã thảo luận về những cơ hội và thách thức mà các giáo hạt Anabaptist-Mennonite ở châu Á đang đối mặt. Một đề xuất mạnh mẽ đã xuất hiện: phát triển nền giáo dục thần học linh hoạt, đặt nền tảng tại châu Á và được định hình bởi châu Á. Mục đích là huấn luyện các nhà lãnh đạo được chọn lọc để củng cố bản sắc Anabaptist bền vững trong cộng đồng hội thánh rộng lớn hơn."
          }
        ]
      },
      "renewing": {
        "badge": "Làm mới Khải tượng",
        "title": "Làm mới Khải tượng (Renewing the Vision)",
        "paragraphs": [
          "Gần hai thập kỷ sau, Jeanette Hanson (Giáo hội Mennonite Canada) và Andi Santoso (Mạng lưới Truyền giáo Mennonite) đã có những bước đi cụ thể để tái hiện khải tượng này và đưa vào thực tiễn.",
          "Những người đáp lại lời kêu gọi đã gặp nhau tại Đại học Cơ Đốc Duta Wacana ở Yogyakarta, Indonesia, vào ngày 14–18 tháng 9 năm 2024. Những người tham dự bao gồm hai đại diện khu vực của MWC: Cynthia Peacock (Nam Á) và Jeremiah Choi (Đông Bắc Á), cùng các lãnh đạo giáo hội từ Indonesia, Nhật Bản, Myanmar, Philippines, Hàn Quốc và Hoa Kỳ (AMBS)."
        ],
        "taskForcesIntro": "Thông qua sự chia sẻ và thảo luận, nhóm đã quyết định cùng nhau làm việc trong ba lĩnh vực và thành lập các Nhóm đặc nhiệm (Task Force):",
        "taskForces": [
          {
            "num": 1,
            "name": "Nhóm đặc nhiệm Trang web",
            "nameEn": "Website Task Force",
            "desc": "Tìm kiếm tài liệu và thiết lập các phương thức kỹ thuật số để chia sẻ rộng rãi trong khu vực."
          },
          {
            "num": 2,
            "name": "Nhóm đặc nhiệm Phát triển Giáo trình",
            "nameEn": "Curriculum Development Task Force",
            "desc": "Phân định các ưu tiên giáo dục và tổ chức nội dung tài liệu học tập một cách hệ thống."
          },
          {
            "num": 3,
            "name": "Nhóm đặc nhiệm Điều phối & Hỗ trợ",
            "nameEn": "Facilitation Task Force",
            "desc": "Duy trì sự kết nối giữa các thành viên, giám sát tiến độ và lên kế hoạch cho các kỳ họp trực tiếp."
          }
        ]
      },
      "gathering": {
        "badge": "Hiệp một & Mở rộng",
        "title": "Kỳ Quy tụ AAMEN Đầu tiên (The First AAMEN Gathering)",
        "paragraphs": [
          "Từ ngày 31 tháng 10 đến ngày 4 tháng 11 năm 2025, kỳ quy tụ AAMEN đầu tiên đã diễn ra tại Kun Klang, Thái Lan, do Giáo hạt Hmong District 20 đăng cai tổ chức.",
          "Tại đây, ba nhóm đặc nhiệm đã được chính thức mở rộng thành ba Nhóm Công tác thường trực (Working Groups)."
        ]
      }
    },
    "timeline": {
      "badge": "Dòng thời gian",
      "title": "Biên niên sử AAMEN (Timeline)",
      "headers": {
        "date": "Thời gian",
        "place": "Địa điểm",
        "event": "Sự kiện lịch sử"
      },
      "items": [
        {
          "date": "Giữa thập niên 1990",
          "place": "Khắp Châu Á",
          "event": "Các lãnh đạo và nhà thần học lên tiếng về sự thiếu hụt giáo dục thần học Anabaptist tại châu Á"
        },
        {
          "date": "Tháng 1 năm 1996",
          "place": "Khu vực Chicago, Hoa Kỳ",
          "event": "Tham vấn về \"Giáo dục Mennonite trong Thế giới Hậu Cơ Đốc\""
        },
        {
          "date": "Tháng 1 năm 1997",
          "place": "Calcutta, Ấn Độ",
          "event": "Tham vấn về Giáo dục Thần học trên Năm Châu lục do MWC tổ chức trước Đại hội 13"
        },
        {
          "date": "13–16 Tháng 3 năm 2006",
          "place": "Ma Cao",
          "event": "Tham vấn Phát triển Lãnh đạo; khuyến nghị xây dựng nền giáo dục thần học linh hoạt tại châu Á"
        },
        {
          "date": "14–18 Tháng 9 năm 2024",
          "place": "Yogyakarta, Indonesia",
          "event": "Họp tại Đại học Duta Wacana khởi xướng bởi J. Hanson và A. Santoso; thành lập 3 nhóm đặc nhiệm"
        },
        {
          "date": "31/10 – 04/11/2025",
          "place": "Kun Klang, Thái Lan",
          "event": "Kỳ quy tụ AAMEN đầu tiên do Hmong District 20 tổ chức; nâng cấp nhóm đặc nhiệm thành Nhóm công tác"
        },
        {
          "date": "Tháng 11 năm 2026",
          "place": "Lumban, Laguna, Philippines",
          "event": "Dự kiến tổ chức Đại hội AAMEN năm 2026 (2026 AAMEN Meeting)"
        }
      ]
    }
  },
  "th": {
    "badge": "มรดก AAMEN",
    "mainTitle": "ประวัติศาสตร์ AAMEN (History)",
    "subtitle": "การเดินทางแห่งการเพาะหว่านและดูแลการศึกษาศาสนศาสตร์อนาแบปทิสต์ในแผ่นดินเอเชีย",
    "readPdfLabel": "ดูเอกสาร PDF ต้นฉบับ",
    "sections": {
      "need": {
        "badge": "ภูมิหลังและความตระหนัก",
        "title": "การตระหนักถึงความจำเป็น (Recognizing the Need)",
        "paragraphs": [
          "ในช่วงกลางทศวรรษ 1990 ผู้นำคริสตจักรและนักศาสนศาสตร์ทั่วเอเชียเริ่มแบ่งปันข้อกังวลร่วมกัน นั่นคือการขาดการศึกษาพระคัมภีร์และศาสนศาสตร์อนาแบปทิสต์ในภูมิภาคนี้",
          "แม้จะมีข้อยกเว้นบางประการ เช่น สถาบันศาสนศาสตร์ Union ในอินเดีย ศูนย์ฝึกอบรมในฟิลิปปินส์ร่วมกับ IMC โรงเรียนพระคัมภีร์ของคริสตจักรเมนโนไนต์เวียดนาม และคณะศาสนศาสตร์ที่มหาวิทยาลัยคริสเตียน Duta Wacana ในอินโดนีเซีย แต่ความพยายามเหล่านี้บางส่วนก็ดำเนินอยู่ได้ไม่นาน และบางส่วนก็เป็นการดำเนินงานร่วมกันระหว่างหลายคณะนิกาย"
        ]
      },
      "early": {
        "badge": "การหารือในระยะแรก",
        "title": "การสนทนาในระยะเริ่มต้น (Early Conversations)",
        "lead": "ตลอดหลายปีที่ผ่านมา มีโอกาสทั้งที่เป็นทางการและไม่เป็นทางการมากมาย เพื่อไตร่ตรองว่าประชาคมอนาแบปทิสต์ทั่วโลกได้รับการทรงเรียกให้ดูแลของประทานแห่งการศึกษาศาสนศาสตร์อย่างไร",
        "items": [
          {
            "date": "มกราคม 1996",
            "place": "เขตชิคาโก สหรัฐอเมริกา",
            "title": "การปรึกษาหารือเรื่องการศึกษาเมนโนไนต์ในโลกยุคหลังคริสเตียน",
            "desc": "การประชุมที่เก่าแก่ที่สุดที่ผู้มีส่วนร่วมใน AAMEN จดจำได้ คือการปรึกษาหารือในหัวข้อ \"การศึกษาเมนโนไนต์ในโลกยุคหลังคริสเตียน\" (Mennonite Education in a Post-Christian World)"
          },
          {
            "date": "มกราคม 1997",
            "place": "กัลกัตตา อินเดีย",
            "title": "การปรึกษาหารือเรื่องการศึกษาศาสนศาสตร์ในห้าทวีป",
            "desc": "ไม่กี่วันก่อนการประชุมสมัชชาระดับโลกครั้งที่ 13 การประชุมสมัชชาเมนโนไนต์โลก (MWC) ได้จัดการปรึกษาหารือเกี่ยวกับการศึกษาศาสนศาสตร์ในห้าทวีป"
          },
          {
            "date": "13–16 มีนาคม 2006",
            "place": "มาเก๊า",
            "title": "การปรึกษาหารือเรื่องการพัฒนาความเป็นผู้นำอนาแบปทิสต์ในเอเชียตะวันออก",
            "desc": "ผู้นำคริสตจักรได้อภิปรายถึงโอกาสและความท้าทายที่คริสตจักรอนาแบปทิสต์-เมนโนไนต์ในเอเชียกำลังเผชิญ ข้อเสนอแนะที่หนักแน่นประการหนึ่งได้ปรากฏขึ้น นั่นคือการพัฒนาการศึกษาศาสนศาสตร์ที่ยืดหยุ่น มีฐานอยู่ในเอเชียและหล่อหลอมโดยเอเชีย โดยมีเป้าหมายเพื่อฝึกอบรมผู้นำคริสตจักรที่ได้รับคัดเลือก เพื่อเสริมสร้างอัตลักษณ์อนาแบปทิสต์ที่ยั่งยืนในคริสตจักรวงกว้าง"
          }
        ]
      },
      "renewing": {
        "badge": "การฟื้นฟูนิมิต",
        "title": "การฟื้นฟูนิมิตใหม่ (Renewing the Vision)",
        "paragraphs": [
          "เกือบสองทศวรรษต่อมา Jeanette Hanson (Mennonite Church Canada) และ Andi Santoso (Mennonite Mission Network) ได้ก้าวไปข้างหน้าอย่างเป็นรูปธรรมเพื่อรื้อฟื้นนิมิตนี้และนำไปสู่การปฏิบัติ",
          "ผู้ที่ตอบรับการทรงเรียกได้พบกันที่มหาวิทยาลัยคริสเตียน Duta Wacana ในยอกยาการ์ตา ประเทศอินโดนีเซีย เมื่อวันที่ 14–18 กันยายน 2024 ผู้เข้าร่วมประกอบด้วยตัวแทนระดับภูมิภาคของ MWC สองท่าน ได้แก่ Cynthia Peacock (เอเชียใต้) และ Jeremiah Choi (เอเชียตะวันออกเฉียงเหนือ) พร้อมด้วยผู้นำคริสตจักรจากอินโดนีเซีย ญี่ปุ่น เมียนมา ฟิลิปปินส์ เกาหลีใต้ และสหรัฐอเมริกา (AMBS)"
        ],
        "taskForcesIntro": "ผ่านการแบ่งปันและการระดมความคิด กลุ่มได้ตัดสินใจทำงานร่วมกันในสามด้านและจัดตั้งคณะทำงานเฉพาะกิจ (Task Force):",
        "taskForces": [
          {
            "num": 1,
            "name": "คณะทำงานเฉพาะกิจด้านเว็บไซต์",
            "nameEn": "Website Task Force",
            "desc": "การค้นหาแหล่งข้อมูลและการจัดเตรียมช่องทางดิจิทัลเพื่อแบ่งปันทรัพยากรเหล่านั้น"
          },
          {
            "num": 2,
            "name": "คณะทำงานเฉพาะกิจด้านการพัฒนาหลักสูตร",
            "nameEn": "Curriculum Development Task Force",
            "desc": "การพิจารณาจัดลำดับความสำคัญทางการศึกษาและการจัดการเนื้อหาการศึกษาอย่างเป็นระบบ"
          },
          {
            "num": 3,
            "name": "คณะทำงานเฉพาะกิจด้านการอำนวยความสะดวก",
            "nameEn": "Facilitation Task Force",
            "desc": "การรักษาความเชื่อมโยงระหว่างสมาชิก การติดตามความคืบหน้า และการวางแผนการพบปะแบบตัวต่อตัว"
          }
        ]
      },
      "gathering": {
        "badge": "การรวมพลัง",
        "title": "การรวมตัว AAMEN ครั้งแรก (The First AAMEN Gathering)",
        "paragraphs": [
          "ตั้งแต่วันที่ 31 ตุลาคม ถึง 4 พฤศจิกายน 2025 การรวมตัว AAMEN ครั้งแรกได้จัดขึ้นที่บ้านขุนกลาง ประเทศไทย โดยมีคริสตจักรภาค 20 ชาวม้ง (Hmong District 20) เป็นเจ้าภาพ",
          "ในการประชุมครั้งนี้ คณะทำงานเฉพาะกิจทั้งสามได้ขยายไปสู่กลุ่มทำงานถาวรสามกลุ่ม (Working Groups)"
        ]
      }
    },
    "timeline": {
      "badge": "ลำดับเหตุการณ์",
      "title": "ไทม์ไลน์ประวัติศาสตร์ AAMEN",
      "headers": {
        "date": "ช่วงเวลา",
        "place": "สถานที่",
        "event": "เหตุการณ์สำคัญ"
      },
      "items": [
        {
          "date": "กลางทศวรรษ 1990",
          "place": "ทั่วภูมิภาคเอเชีย",
          "event": "ผู้นำคริสตจักรและนักศาสนศาสตร์แสดงความกังวลเรื่องการขาดการศึกษาศาสนศาสตร์อนาแบปทิสต์ในเอเชีย"
        },
        {
          "date": "มกราคม 1996",
          "place": "เขตชิคาโก สหรัฐอเมริกา",
          "event": "การปรึกษาหารือเรื่อง \"การศึกษาเมนโนไนต์ในโลกยุคหลังคริสเตียน\""
        },
        {
          "date": "มกราคม 1997",
          "place": "กัลกัตตา อินเดีย",
          "event": "การปรึกษาหารือเรื่องการศึกษาศาสนศาสตร์ในห้าทวีปโดย MWC ก่อนการประชุมสมัชชาครั้งที่ 13"
        },
        {
          "date": "13–16 มีนาคม 2006",
          "place": "มาเก๊า",
          "event": "การประชุมพัฒนาผู้นำเอเชียตะวันออก แนะนำให้พัฒนาการศึกษาศาสนศาสตร์ที่มีความยืดหยุ่นในเอเชีย"
        },
        {
          "date": "14–18 กันยายน 2024",
          "place": "ยอกยาการ์ตา อินโดนีเซีย",
          "event": "การประชุมที่มหาวิทยาลัย Duta Wacana ริเริ่มโดย J. Hanson และ A. Santoso ก่อตั้ง 3 คณะทำงาน"
        },
        {
          "date": "31 ต.ค. – 4 พ.ย. 2025",
          "place": "ขุนกลาง ประเทศไทย",
          "event": "การรวมตัว AAMEN ครั้งแรก โดยคริสตจักรภาค 20 ม้งเป็นเจ้าภาพ ยกระดับเป็นคณะทำงานถาวร"
        },
        {
          "date": "พฤศจิกายน 2026",
          "place": "ลุมบัน ลากูนา ฟิลิปปินส์",
          "event": "กำหนดการประชุมใหญ่สมัชชา AAMEN ประจำปี 2026 (2026 AAMEN Meeting)"
        }
      ]
    }
  },
  "mn": {
    "badge": "AAMEN-ийн Өв",
    "mainTitle": "AAMEN-ийн Түүх (History)",
    "subtitle": "Азийн хөрсөнд Анабаптист теологийн боловсролын үрийг тарьж, хамтдаа ургуулсан түүхэн замнал",
    "readPdfLabel": "Эх PDF үзэх",
    "sections": {
      "need": {
        "badge": "Үндэс суурь ба Ухамсар",
        "title": "Хэрэгцээг Ойлгон Ухамсарлах (Recognizing the Need)",
        "paragraphs": [
          "1990-ээд оны дунд үеэс Азийн чуулганы удирдагчид болон теологичид нэгэн нийтлэг асуудлыг хөндөж эхэлсэн нь: тус бүс нутагт Анабаптист библийн болон теологийн боловсрол дутмаг байгаа явдал байв.",
          "Энэтхэгийн Юнион теологийн семинар, Филиппинд IMC-тэй хамтарсан сургалтын төв, Вьетнамын Меннонит чуулганы Библийн сургууль, Индонезийн Дута Вачана Христийн Их Сургуулийн Теологийн факультет зэрэг цөөн хэдэн онцгой хүчин чармайлтууд байсан хэдий ч зарим нь богино настай байж, зарим нь олон урсгал хамтран хариуцдаг байгууллагууд байв."
        ]
      },
      "early": {
        "badge": "Эхний Яриа Хэлэлцүүлэг",
        "title": "Эхний Зөвлөлдөөнүүд (Early Conversations)",
        "lead": "Олон жилийн турш дэлхийн Анабаптист хамтын нөхөрлөл теологийн боловсрол хэмээх бэлгийг хэрхэн нандигнан хариуцах тухай албан ба албан бус олон уулзалт болж байв.",
        "items": [
          {
            "date": "1996 оны 1-р сар",
            "place": "АНУ, Чикаго орчим",
            "title": "Христийн шашны дараах ертөнц дэх Меннонит боловсрол",
            "desc": "Одоогийн AAMEN-д оролцогчдын дурсан санадаг хамгийн эртний цугларалт бол \"Христийн шашны дараах ертөнц дэх Меннонит боловсрол\" сэдэвт зөвлөлдөх уулзалт байв."
          },
          {
            "date": "1997 оны 1-р сар",
            "place": "Энэтхэг, Калькутта",
            "title": "Таван тивийн теологийн боловсролын зөвлөлдөх уулзалт",
            "desc": "Дэлхийн Меннонитын бага хурал (MWC) 13 дахь Дэлхийн Ассамблейгаас хэдхэн хоногийн өмнө таван тивийн теологийн боловсролын асуудлаар зөвлөлдөх уулзалт зохион байгуулав."
          },
          {
            "date": "2006 оны 3-р сарын 13–16",
            "place": "Макао",
            "title": "Зүүн Азийн Анабаптист манлайллыг хөгжүүлэх зөвлөлдөөн",
            "desc": "Чуулганы удирдагчид Азийн Анабаптист-Меннонит холбоодын өмнө тулгамдаж буй боломж, сорилтуудыг хэлэлцлээ. Үүнээс нэгэн чухал зөвлөмж гарсан нь: Азид суурилсан, Азийн нөхцөлд зохицсон уян хатан теологийн боловсролыг хөгжүүлэх явдал байв."
          }
        ]
      },
      "renewing": {
        "badge": "Шинэ Алхам",
        "title": "Алсын Харааг Сэргээх (Renewing the Vision)",
        "paragraphs": [
          "Бараг 20 жилийн дараа Канадын Меннонит чуулганы Жанет Хансон (Jeanette Hanson) болон Меннонит Номлолын Сүлжээний Анди Сантосо (Andi Santoso) нар энэхүү алсын харааг дахин сэргээж, бодит ажил болгох тодорхой алхмыг хийв.",
          "Тэдний уриалгыг хүлээн авсан удирдагчид 2024 оны 9-р сарын 14–18-ны өдрүүдэд Индонезийн Жогжакарта хотын Дута Вачана Христийн Их Сургуульд хуралдав. MWC-ийн бүс нутгийн төлөөлөгч Синтия Пикок (Өмнөд Ази), Иеремиа Чой (Зүүн Хойд Ази) болон Индонез, Япон, Мьянмар, Филиппин, Өмнөд Солонгос, АНУ (AMBS)-ийн удирдагчид оролцлоо."
        ],
        "taskForcesIntro": "Нөхөрлөл ба хамтын хэлэлцүүлгийн үр дүнд гурван чиглэлээр хамтран ажиллахаар шийдвэрлэж, Ажлын хэсгүүдийг (Task Force) байгуулсан:",
        "taskForces": [
          {
            "num": 1,
            "name": "Вэбсайт хариуцсан ажлын хэсэг",
            "nameEn": "Website Task Force",
            "desc": "Сургалтын хэрэглэгдэхүүн, материалыг олж илрүүлэх болон түгээх дижитал арга замуудыг бүрдүүлэх."
          },
          {
            "num": 2,
            "name": "Хөтөлбөр боловсруулах ажлын хэсэг",
            "nameEn": "Curriculum Development Task Force",
            "desc": "Боловсролын тэргүүлэх чиглэлийг тодорхойлж, сургалтын агуулгыг системтэйгээр эмхэтгэх."
          },
          {
            "num": 3,
            "name": "Зохион байгуулалт, дэмжлэгийн ажлын хэсэг",
            "nameEn": "Facilitation Task Force",
            "desc": "Гишүүдийн хоорондын харилцааг хадгалах, ахиц дэвшлийг хянах, биечилсэн уулзалтыг төлөвлөх."
          }
        ]
      },
      "gathering": {
        "badge": "Өргөжин Тэлэлт",
        "title": "Анхны AAMEN Чуулга Уулзалт (The First AAMEN Gathering)",
        "paragraphs": [
          "2025 оны 10-р сарын 31-ээс 11-р сарын 4-ний хооронд Тайландын Кун Кланг хотод Хмонг 20-р тойргийн чуулганы зохион байгуулалтаар анхны түүхэн AAMEN цугларалт болов.",
          "Энэхүү уулзалтаар дээрх гурван ажлын хэсгийг байнгын гурван Үйл ажиллагааны бүлэг (Working Groups) болгон өргөжүүллээ."
        ]
      }
    },
    "timeline": {
      "badge": "Он цагийн хэлхээс",
      "title": "AAMEN-ийн Түүхэн Он Цагийн Хэлхээс",
      "headers": {
        "date": "Огноо",
        "place": "Байршил",
        "event": "Түүхэн Үйл Явдал"
      },
      "items": [
        {
          "date": "1990-ээд оны дунд үе",
          "place": "Ази даяар",
          "event": "Азид Анабаптист теологийн боловсрол дутмаг байгаа тухай чуулганы удирдагчид хөндөв"
        },
        {
          "date": "1996 оны 1-р сар",
          "place": "АНУ, Чикаго орчим",
          "event": "\"Христийн шашны дараах ертөнц дэх Меннонит боловсрол\" анхны зөвлөлдөөн"
        },
        {
          "date": "1997 оны 1-р сар",
          "place": "Энэтхэг, Калькутта",
          "event": "MWC 13-р Ассамблейн өмнө таван тивийн теологийн боловсролын зөвлөлдөх уулзалт хийв"
        },
        {
          "date": "2006 оны 3-р сарын 13–16",
          "place": "Макао",
          "event": "Зүүн Азийн манлайллын зөвлөлдөөн; Азийн нөхцөлд нийцсэн уян хатан боловсролыг зөвлөмж болгов"
        },
        {
          "date": "2024 оны 9-р сарын 14–18",
          "place": "Индонез, Жогжакарта",
          "event": "Дута Вачана Их Сургуульд Ж. Хансон, А. Сантосо нарын санаачилгаар 3 ажлын хэсэг байгуулагдав"
        },
        {
          "date": "2025 оны 10-р сарын 31 – 11-р сарын 4",
          "place": "Тайланд, Кун Кланг",
          "event": "Анхны AAMEN Чуулга уулзалт болж, ажлын хэсгүүдийг Үйл ажиллагааны бүлгүүд болгон өргөжүүлэв"
        },
        {
          "date": "2026 оны 11-р сар",
          "place": "Филиппин, Лумбан",
          "event": "2026 оны AAMEN-ийн Ерөнхий Чуулган зохион байгуулагдахаар төлөвлөгдөв"
        }
      ]
    }
  },
  "my": {
    "badge": "AAMEN အမွေအနှစ်",
    "mainTitle": "AAMEN သမိုင်း (History)",
    "subtitle": "အာရှမြေတွင် အာနာဗက်တစ် ဓမ္မပညာရေး မျိုးစေ့ကို စိုက်ပျိုးပြီး အတူတကွ ရှင်သန်စေခဲ့သော ခရီးစဉ်",
    "readPdfLabel": "မူရင်း PDF ကြည့်ရှုရန်",
    "sections": {
      "need": {
        "badge": "နောက်ခံနှင့် သတိပြုမိခြင်း",
        "title": "လိုအပ်ချက်ကို အသိအမှတ်ပြုခြင်း (Recognizing the Need)",
        "paragraphs": [
          "၁၉၉၀ ပြည့်လွန်နှစ်များ အလယ်ပိုင်းမှစတင်၍ အာရှတိုက်တစ်ဝှမ်းရှိ အသင်းတော်ခေါင်းဆောင်များနှင့် ဓမ္မပညာရှင်များသည် ဘုံစိုးရိမ်ပူပန်မှုတစ်ခုကို စတင်ဆွေးနွေးခဲ့ကြသည်- ၎င်းမှာ ဤဒေသတွင်း အာနာဗက်တစ် သမ္မာကျမ်းစာနှင့် ဓမ္မပညာရေး လိုအပ်ချက်ပင် ဖြစ်သည်။",
          "ခြွင်းချက်အချို့ ရှိခဲ့သည်၊ ၎င်းတို့တွင် အိန္ဒိယနိုင်ငံရှိ Union Theological Seminary၊ ဖိလစ်ပိုင်ရှိ IMC နှင့် ပူးတွဲလေ့ကျင့်ရေးစင်တာ၊ ဗီယက်နမ် မန်နိုနိုက်အသင်းတော်၏ ကျမ်းစာကျောင်းနှင့် အင်ဒိုနီးရှားနိုင်ငံရှိ Duta Wacana Christian University ၏ ဓမ္မပညာဌာနတို့ ပါဝင်သည်။ သို့သော် ဤကြိုးပမ်းမှုအချို့မှာ သက်တမ်းတိုခဲ့ပြီး အခြားအရာများကိုမူ ဂိုဏ်းပေါင်းစုံ ပူးတွဲလုပ်ဆောင်ခဲ့ကြသည်။"
        ]
      },
      "early": {
        "badge": "အစောပိုင်း တွေ့ဆုံမှုများ",
        "title": "အစောပိုင်း ဆွေးနွေးမှုများ (Early Conversations)",
        "lead": "နှစ်ပေါင်းများစွာအတွင်း ကမ္ဘာလုံးဆိုင်ရာ အာနာဗက်တစ် မိတ်သဟာယသည် ဓမ္မပညာရေး ဆုကျေးဇူးကို မည်သို့ စောင့်ရှောက်ရန် ခေါ်ယူခံရသည်ကို မေးမြန်းရန် တရားဝင်နှင့် တရားမဝင် အခွင့်အလမ်းများစွာ ရှိခဲ့သည်။",
        "items": [
          {
            "date": "၁၉၉၆ ခုနှစ်၊ ဇန်နဝါရီလ",
            "place": "ချီကာဂိုဒေသ၊ အမေရိကန်ပြည်ထောင်စု",
            "title": "ခရစ်ယာန်ခေတ်လွန်ကမ္ဘာရှိ မန်နိုနိုက်ပညာရေးဆိုင်ရာ ညှိနှိုင်းဆွေးနွေးပွဲ",
            "desc": "AAMEN တွင် လက်ရှိပါဝင်နေသူများ သတိရသည့် အစောဆုံးတွေ့ဆုံမှုမှာ \"ခရစ်ယာန်ခေတ်လွန်ကမ္ဘာရှိ မန်နိုနိုက်ပညာရေး\" ဆိုင်ရာ ညှိနှိုင်းဆွေးနွေးပွဲ ဖြစ်သည်။"
          },
          {
            "date": "၁၉၉၇ ခုနှစ်၊ ဇန်နဝါရီလ",
            "place": "ကာလကတ္တား၊ အိန္ဒိယ",
            "title": "တိုက်ကြီးငါးတိုက်ရှိ ဓမ္မပညာရေးဆိုင်ရာ ညှိနှိုင်းဆွေးနွေးပွဲ",
            "desc": "မန်နိုနိုက်ကမ္ဘာ့ညီလာခံ (MWC) သည် ၎င်း၏ (၁၃) ကြိမ်မြောက် ကမ္ဘာလုံးဆိုင်ရာ ညီလာခံမတိုင်မီ ရက်ပိုင်းအလိုတွင် တိုက်ကြီးငါးတိုက်ရှိ ဓမ္မပညာရေးဆိုင်ရာ ဆွေးနွေးပွဲကို ကျင်းပခဲ့သည်။"
          },
          {
            "date": "၂၀၀၆ ခုနှစ်၊ မတ်လ ၁၃–၁၆ ရက်",
            "place": "မကာအို",
            "title": "အရှေ့အာရှ အာနာဗက်တစ် ခေါင်းဆောင်မှု ဖွံ့ဖြိုးတိုးတက်ရေး ဆွေးနွေးပွဲ",
            "desc": "အသင်းတော်ခေါင်းဆောင်များသည် အာရှရှိ အာနာဗက်တစ်-မန်နိုနိုက်အဖွဲ့များ ရင်ဆိုင်နေရသော အခွင့်အလမ်းများနှင့် စိန်ခေါ်မှုများကို ဆွေးနွေးခဲ့ကြသည်။ အာရှတွင် အခြေပြုပြီး အာရှက ပုံဖော်ထားသော လိုက်လျောညီထွေရှိသည့် ဓမ္မပညာရေးကို ဖွံ့ဖြိုးတိုးတက်စေရန် အရေးကြီးသော အကြံပြုချက်တစ်ခု ပေါ်ထွက်လာခဲ့သည်။"
          }
        ]
      },
      "renewing": {
        "badge": "ရူပါရုံသစ်",
        "title": "ရူပါရုံကို အသစ်တဖန် မွေးမြူခြင်း (Renewing the Vision)",
        "paragraphs": [
          "နှစ်ပေါင်း နှစ်ဆယ်နီးပါး ကြာပြီးနောက် ကနေဒါ မန်နိုနိုက်အသင်းတော်မှ Jeanette Hanson နှင့် မန်နိုနိုက်သာသနာပြုကွန်ရက်မှ Andi Santoso တို့သည် ဤရူပါရုံကို လက်တွေ့အကောင်အထည်ဖော်ရန် ခိုင်မာသော ခြေလှမ်းတစ်ရပ်ကို စတင်လှမ်းခဲ့ကြသည်။",
          "၎င်းတို့၏ ဖိတ်ခေါ်ချက်ကို တုံ့ပြန်သူများသည် ၂၀၂၄ ခုနှစ်၊ စက်တင်ဘာလ ၁၄–၁၈ ရက်တို့တွင် အင်ဒိုနီးရှားနိုင်ငံ ဂျော့ဂျာကာတာမြို့ရှိ Duta Wacana Christian University ၌ တွေ့ဆုံခဲ့ကြသည်။ MWC ဒေသဆိုင်ရာ ကိုယ်စားလှယ် Cynthia Peacock (တောင်အာရှ)၊ Jeremiah Choi (အရှေ့မြောက်အာရှ) နှင့်အတူ အင်ဒိုနီးရှား၊ ဂျပန်၊ မြန်မာ၊ ဖိလစ်ပိုင်၊ တောင်ကိုရီးယား၊ အမေရိကန် (AMBS) တို့မှ ခေါင်းဆောင်များ တက်ရောက်ခဲ့ကြသည်။"
        ],
        "taskForcesIntro": "မျှဝေခြင်းနှင့် အကြံဥာဏ်ဖလှယ်ခြင်းများ ပြုလုပ်ပြီးနောက် ပါဝင်သူများသည် နယ်ပယ်သုံးခုတွင် အတူတကွ လုပ်ဆောင်ရန် ဆုံးဖြတ်ခဲ့ပြီး လုပ်ငန်းအဖွဲ့များ (Task Force) ဖွဲ့စည်းခဲ့သည်-",
        "taskForces": [
          {
            "num": 1,
            "name": "ဝက်ဘ်ဆိုက်လုပ်ငန်းအဖွဲ့",
            "nameEn": "Website Task Force",
            "desc": "အရင်းအမြစ်များကို ရှာဖွေဖော်ထုတ်ပြီး ဒေသတွင်း မျှဝေရန် ဒစ်ဂျစ်တယ်ဗဟိုချက် တည်ဆောက်ခြင်း။"
          },
          {
            "num": 2,
            "name": "သင်ရိုးညွှန်းတမ်း ရေးဆွဲရေးလုပ်ငန်းအဖွဲ့",
            "nameEn": "Curriculum Development Task Force",
            "desc": "ပညာရေးဆိုင်ရာ ဦးစားပေးများကို ပိုင်းခြားသိမြင်ပြီး သင်ကြားရေးအကြောင်းအရာများကို စနစ်တကျ ပြုစုခြင်း။"
          },
          {
            "num": 3,
            "name": "ပံ့ပိုးကူညီရေးလုပ်ငန်းအဖွဲ့",
            "nameEn": "Facilitation Task Force",
            "desc": "အဖွဲ့ဝင်များအကြား ဆက်သွယ်မှုထိန်းသိမ်းခြင်း၊ တိုးတက်မှုကို ကြီးကြပ်ခြင်းနှင့် လူချင်းတွေ့ဆုံပွဲများ စီစဉ်ခြင်း။"
          }
        ]
      },
      "gathering": {
        "badge": "တိုးချဲ့စည်းလုံးခြင်း",
        "title": "ပထမဆုံး AAMEN စုဝေးပွဲ (The First AAMEN Gathering)",
        "paragraphs": [
          "၂၀၂၅ ခုနှစ်၊ အောက်တိုဘာလ ၃၁ ရက်မှ နိုဝင်ဘာလ ၄ ရက်အထိ ထိုင်းနိုင်ငံ၊ ကွန်ကလန် (Kun Klang) တွင် ပထမဆုံး AAMEN စုဝေးပွဲကို Hmong District 20 အသင်းတော်အဖွဲ့မှ အောင်မြင်စွာ လက်ခံကျင်းပခဲ့သည်။",
          "ထိုတွေ့ဆုံပွဲတွင် လုပ်ငန်းအဖွဲ့ (Task Force) သုံးခုကို အမြဲတမ်းလုပ်ငန်းအဖွဲ့ (Working Groups) သုံးခုအဖြစ် တရားဝင် တိုးချဲ့ဖွဲ့စည်းခဲ့သည်။"
        ]
      }
    },
    "timeline": {
      "badge": "အချိန်မှတ်တမ်း",
      "title": "AAMEN သမိုင်းဝင် အချိန်မှတ်တမ်း (Timeline)",
      "headers": {
        "date": "ကာလ",
        "place": "နေရာ",
        "event": "အဓိက အဖြစ်အပျက်"
      },
      "items": [
        {
          "date": "၁၉၉၀ ပြည့်လွန်နှစ်များ အလယ်",
          "place": "အာရှတစ်ဝှမ်း",
          "event": "အာရှတွင် အာနာဗက်တစ် ဓမ္မပညာရေး လိုအပ်ချက်ကို အသင်းတော်ခေါင်းဆောင်များ စတင်သတိပြုမိခြင်း"
        },
        {
          "date": "၁၉၉၆ ခုနှစ်၊ ဇန်နဝါရီလ",
          "place": "ချီကာဂိုဒေသ၊ အမေရိကန်",
          "event": "\"ခရစ်ယာန်ခေတ်လွန်ကမ္ဘာရှိ မန်နိုနိုက်ပညာရေး\" ပထမဆုံး ဆွေးနွေးပွဲ ကျင်းပခြင်း"
        },
        {
          "date": "၁၉၉၇ ခုနှစ်၊ ဇန်နဝါရီလ",
          "place": "ကာလကတ္တား၊ အိန္ဒိယ",
          "event": "MWC တိုက်ကြီးငါးတိုက် ဓမ္မပညာရေး ဆွေးနွေးပွဲကို ကမ္ဘာ့ညီလာခံမတိုင်မီ ကျင်းပခြင်း"
        },
        {
          "date": "၂၀၀၆ ခုနှစ်၊ မတ်လ ၁၃–၁၆ ရက်",
          "place": "မကာအို",
          "event": "အရှေ့အာရှ ခေါင်းဆောင်မှု ဆွေးနွေးပွဲ；အာရှအခြေပြု ဓမ္မပညာရေး ဖော်ဆောင်ရန် အကြံပြုခြင်း"
        },
        {
          "date": "၂၀၂၄ ခုနှစ်၊ စက်တင်ဘာလ ၁၄–၁၈ ရက်",
          "place": "ဂျော့ဂျာကာတာ၊ အင်ဒိုနီးရှား",
          "event": "Duta Wacana တက္ကသိုလ်၌ ရူပါရုံသစ် တွေ့ဆုံပွဲ (J. Hanson နှင့် A. Santoso စတင်)；လုပ်ငန်းအဖွဲ့ ၃ ခု ဖွဲ့စည်း"
        },
        {
          "date": "၂၀၂၅ ခုနှစ်၊ အောက်တိုဘာ ၃၁ – နိုဝင်ဘာ ၄",
          "place": "ကွန်ကလန်၊ ထိုင်းနိုင်ငံ",
          "event": "ပထမဆုံး AAMEN စုဝေးပွဲ ကျင်းပ (Hmong District 20 အိမ်ရှင်)；အမြဲတမ်းလုပ်ငန်းအဖွဲ့အဖြစ် တိုးချဲ့"
        },
        {
          "date": "၂၀၂၆ ခုနှစ်၊ နိုဝင်ဘာလ",
          "place": "လွမ်ဘန်၊ လာဂူနာ၊ ဖိလစ်ပိုင်",
          "event": "၂၀၂၆ ခုနှစ် AAMEN အထွေထွေညီလာခံ ကျင်းပရန် စီစဉ်ထားရှိခြင်း"
        }
      ]
    }
  },
  "hi": {
    "badge": "AAMEN विरासत",
    "mainTitle": "AAMEN का इतिहास (History)",
    "subtitle": "एशियाई धरती पर एनाबैपटिस्ट धर्मशास्त्रीय शिक्षा के बीज बोने और पोषित करने की यात्रा",
    "readPdfLabel": "मूल PDF देखें",
    "sections": {
      "need": {
        "badge": "पृष्ठभूमि और चिंता",
        "title": "आवश्यकता की पहचान (Recognizing the Need)",
        "paragraphs": [
          "1990 के दशक के मध्य में, एशिया भर के चर्च के नेताओं और धर्मशास्त्रियों ने एक साझा चिंता पर चर्चा शुरू की: इस क्षेत्र में एनाबैपटिस्ट बाइबिल और धर्मशास्त्रीय शिक्षा का अभाव।",
          "कुछ अपवाद थे, जिनमें भारत में यूनियन थियोलॉजिकल सेमिनरी, आईएमसी के साथ फिलीपींस में एक प्रशिक्षण केंद्र, वियतनामी मेनोनाइट चर्च का बाइबिल स्कूल, और इंडोनेशिया में दूता वाचना क्रिश्चियन यूनिवर्सिटी का धर्मशास्त्र संकाय शामिल थे। हालांकि, इनमें से कुछ प्रयास अल्पकालिक थे, और अन्य को कई संप्रदायों द्वारा साझा किया गया था।"
        ]
      },
      "early": {
        "badge": "प्रारंभिक सभाएं",
        "title": "प्रारंभिक वार्ताएं (Early Conversations)",
        "lead": "वर्षों से, वैश्विक एनाबैपटिस्ट समुदाय धर्मशास्त्रीय शिक्षा के उपहार की देखभाल कैसे करे, इस पर विचार करने के लिए औपचारिक और अनौपचारिक दोनों तरह के कई अवसर आए हैं।",
        "items": [
          {
            "date": "जनवरी 1996",
            "place": "शिकागो क्षेत्र, संयुक्त राज्य अमेरिका",
            "title": "\"उत्तर-ईसाई विश्व में मेनोनाइट शिक्षा\" पर परामर्श",
            "desc": "AAMEN में वर्तमान में शामिल लोगों द्वारा याद की जाने वाली सबसे पुरानी ऐसी सभा \"उत्तर-ईसाई विश्व में मेनोनाइट शिक्षा\" पर एक परामर्श थी।"
          },
          {
            "date": "जनवरी 1997",
            "place": "कलकत्ता, भारत",
            "title": "पांच महाद्वीपों पर धर्मशास्त्रीय शिक्षा पर परामर्श",
            "desc": "अपनी 13वीं वैश्विक सभा से कुछ दिन पहले, मेनोनाइट वर्ल्ड कॉन्फ्रेंस (MWC) ने पांच महाद्वीपों पर धर्मशास्त्रीय शिक्षा पर परामर्श आयोजित किया।"
          },
          {
            "date": "13–16 मार्च 2006",
            "place": "मकाऊ",
            "title": "पूर्वी एशिया में एनाबैपटिस्ट नेतृत्व विकास पर परामर्श",
            "desc": "चर्च के नेताओं ने एशिया में एनाबैपटिस्ट-मेनोनाइट सम्मेलनों के सामने आने वाले अवसरों और चुनौतियों पर चर्चा की। एक सशक्त सिफारिश सामने आई: एशिया में स्थित और एशिया द्वारा आकार दी गई लचीली धर्मशास्त्रीय शिक्षा का विकास करना। इसका उद्देश्य चयनित चर्च नेताओं को प्रशिक्षित करना था जो व्यापक चर्च में एक स्थायी एनाबैपटिस्ट पहचान को मजबूत कर सकें।"
          }
        ]
      },
      "renewing": {
        "badge": "नई गति",
        "title": "दृष्टि का नवीनीकरण (Renewing the Vision)",
        "paragraphs": [
          "लगभग दो दशक बाद, जेनेट हैनसन (मेनोनाइट चर्च कनाडा) और एंडी संतोसो (मेनोनाइट मिशन नेटवर्क) ने इस दृष्टि की पुनर्कल्पना करने और इसे व्यवहार में लाने के लिए एक ठोस कदम उठाया।",
          "उनके आह्वान का उत्तर देने वाले लोग 14–18 सितंबर 2024 को योग्याकार्ता, इंडोनेशिया में दूता वाचना क्रिश्चियन यूनिवर्सिटी में मिले। प्रतिभागियों में MWC के दो क्षेत्रीय प्रतिनिधि, सिंथिया पीकॉक (दक्षिण एशिया) और यिर्मयाह चोई (पूर्वोत्तर एशिया), साथ ही इंडोनेशिया, जापान, म्यांमार, फिलीपींस, दक्षिण कोरिया और संयुक्त राज्य अमेरिका (AMBS) के चर्च नेता शामिल थे।"
        ],
        "taskForcesIntro": "साझाकरण और विचार-मंथन के माध्यम से, समूह ने तीन क्षेत्रों में एक साथ काम करने का निर्णय लिया और कार्य बल (Task Force) गठित किए:",
        "taskForces": [
          {
            "num": 1,
            "name": "वेबसाइट कार्य बल",
            "nameEn": "Website Task Force",
            "desc": "संसाधनों की खोज करना और उन्हें पूरे क्षेत्र में साझा करने के डिजिटल साधन स्थापित करना।"
          },
          {
            "num": 2,
            "name": "पाठ्यचर्या विकास कार्य बल",
            "nameEn": "Curriculum Development Task Force",
            "desc": "शैक्षिक प्राथमिकताओं की पहचान करना और शिक्षण सामग्री को व्यवस्थित रूप से तैयार करना।"
          },
          {
            "num": 3,
            "name": "सुगमता कार्य बल",
            "nameEn": "Facilitation Task Force",
            "desc": "सदस्यों को आपस में जोड़े रखना, प्रगति की देखरेख करना, और व्यक्तिगत बैठकों की योजना बनाना।"
          }
        ]
      },
      "gathering": {
        "badge": "विस्तार",
        "title": "पहला AAMEN सम्मेलन (The First AAMEN Gathering)",
        "paragraphs": [
          "31 अक्टूबर से 4 नवंबर 2025 तक, थाईलैंड के कुन क्लांग में पहला AAMEN सम्मेलन आयोजित किया गया, जिसकी मेजबानी हमोंग डिस्ट्रिक्ट 20 चर्च सम्मेलन द्वारा की गई थी।",
          "वहां, तीन कार्य बलों को तीन स्थायी कार्य समूहों (Working Groups) में विस्तारित किया गया।"
        ]
      }
    },
    "timeline": {
      "badge": "कालक्रम",
      "title": "AAMEN ऐतिहासिक समयरेखा (Timeline)",
      "headers": {
        "date": "समय",
        "place": "स्थान",
        "event": "ऐतिहासिक घटना"
      },
      "items": [
        {
          "date": "1990 के दशक के मध्य",
          "place": "समग्र एशिया",
          "event": "चर्च नेताओं ने एशिया में एनाबैपटिस्ट धर्मशास्त्रीय शिक्षा की कमी पर चिंता व्यक्त की"
        },
        {
          "date": "जनवरी 1996",
          "place": "शिकागो क्षेत्र, यूएसए",
          "event": "\"उत्तर-ईसाई विश्व में मेनोनाइट शिक्षा\" पर पहला परामर्श आयोजित"
        },
        {
          "date": "जनवरी 1997",
          "place": "कलकत्ता, भारत",
          "event": "MWC द्वारा 13वीं वैश्विक सभा से पूर्व पांच महाद्वीपों पर धर्मशास्त्रीय शिक्षा पर परामर्श"
        },
        {
          "date": "13–16 मार्च 2006",
          "place": "मकाऊ",
          "event": "पूर्वी एशिया नेतृत्व परामर्श; एशिया-आधारित लचीली शिक्षा के विकास की पुरजोर सिफारिश"
        },
        {
          "date": "14–18 सितंबर 2024",
          "place": "योग्याकार्ता, इंडोनेशिया",
          "event": "दूता वाचना विश्वविद्यालय में जे. हैनसन और ए. संतोसो की पहल पर बैठक; 3 कार्य बलों का गठन"
        },
        {
          "date": "31 अक्टू – 4 नवं 2025",
          "place": "कुन क्लांग, थाईलैंड",
          "event": "पहला AAMEN सम्मेलन (हमोंग डिस्ट्रिक्ट 20 द्वारा आयोजित); कार्य बलों का कार्य समूहों में विस्तार"
        },
        {
          "date": "नवंबर 2026",
          "place": "लुम्बन, लगुना, फिलीपींस",
          "event": "2026 AAMEN महासभा और वार्षिक बैठक (2026 AAMEN Meeting) निर्धारित"
        }
      ]
    }
  },
  "ne": {
    "badge": "AAMEN सम्पदा",
    "mainTitle": "AAMEN को इतिहास (History)",
    "subtitle": "एसियाली भूमिमा एनाब्याप्टिस्ट धर्मशास्त्रीय शिक्षाको बीउ रोप्ने र हुर्काउने यात्रा",
    "readPdfLabel": "मूल PDF हेर्नुहोस्",
    "sections": {
      "need": {
        "badge": "पृष्ठभूमि र आवश्यकता",
        "title": "आवश्यकताको पहिचान (Recognizing the Need)",
        "paragraphs": [
          "१९९० को दशकको मध्यतिर, एसियाभरिका मण्डलीका अगुवाहरू र धर्मशास्त्रीहरूले एउटा साझा चिन्ता व्यक्त गर्न थाले: यस क्षेत्रमा एनाब्याप्टिस्ट बाइबलीय र धर्मशास्त्रीय शिक्षाको अभाव।",
          "केही अपवादहरू थिए, जसमा भारतको युनियन थियोलोजिकल सेमिनरी, आईएमसीसँग फिलिपिन्समा तालिम केन्द्र, भियतनामी मेनोनाइट मण्डलीको बाइबल स्कूल, र इन्डोनेसियाको दुता वाचना क्रिश्चियन युनिभर्सिटीको धर्मशास्त्र संकाय थिए। तथापि, यी प्रयासहरूमध्ये केही अल्पकालीन थिए, र अन्य धेरै सम्प्रदायहरूसँग साझेदारी गरिएका थिए।"
        ]
      },
      "early": {
        "badge": "प्रारम्भिक संवादहरू",
        "title": "प्रारम्भिक छलफलहरू (Early Conversations)",
        "lead": "वर्षौंदेखि, विश्वव्यापी एनाब्याप्टिस्ट समुदायलाई धर्मशास्त्रीय शिक्षाको वरदानलाई कसरी सम्हाल्न बोलाइएको छ भनी विचार गर्न औपचारिक र अनौपचारिक धेरै अवसरहरू भएका छन्।",
        "items": [
          {
            "date": "जनवरी १९९६",
            "place": "शिकागो क्षेत्र, संयुक्त राज्य अमेरिका",
            "title": "\"उत्तर-ईसाई संसारमा मेनोनाइट शिक्षा\" सम्बन्धी परामर्श",
            "desc": "अहिले AAMEN मा संलग्न व्यक्तिहरूले सम्झेको सबैभन्दा प्रारम्भिक भेला \"उत्तर-ईसाई संसारमा मेनोनाइट शिक्षा\" सम्बन्धी परामर्श थियो।"
          },
          {
            "date": "जनवरी १९९७",
            "place": "कलकत्ता, भारत",
            "title": "पाँच महाद्वीपमा धर्मशास्त्रीय शिक्षा सम्बन्धी परामर्श",
            "desc": "आफ्नो १३ औं विश्वव्यापी महासभाभन्दा केही दिन अघि, मेनोनाइट वर्ल्ड कन्फरेन्स (MWC) ले पाँच महाद्वीपमा धर्मशास्त्रीय शिक्षा सम्बन्धी परामर्श आयोजना गर्‍यो।"
          },
          {
            "date": "१३–१६ मार्च २००६",
            "place": "मकाउ",
            "title": "पूर्वी एसियामा एनाब्याप्टिस्ट नेतृत्व विकास सम्बन्धी परामर्श",
            "desc": "मण्डलीका अगुवाहरूले एसियामा एनाब्याप्टिस्ट-मेनोनाइट कन्फरेन्सहरूले सामना गरिरहेका अवसर र चुनौतीहरूबारे छलफल गरे। एउटा बलियो सिफारिस आयो: एसियामा आधारित र एसियाद्वारा आकार दिइएको लचिलो धर्मशास्त्रीय शिक्षा विकास गर्ने।"
          }
        ]
      },
      "renewing": {
        "badge": "नयाँ यात्रा",
        "title": "दर्शनको नवीकरण (Renewing the Vision)",
        "paragraphs": [
          "झण्डै दुई दशकपछि, ज्यानेट हेन्सन (मेनोनाइट चर्च क्यानाडा) र एन्डी सान्तोसो (मेनोनाइट मिसन नेटवर्क) ले यो दर्शनलाई पुन: कल्पना गर्न र यसलाई व्यवहारमा उतार्न ठोस कदम चाले।",
          "उनीहरूको आह्वानलाई स्वीकार गर्नेहरू सेप्टेम्बर १४–१८, २०२४ मा इन्डोनेसियाको योग्यकर्तास्थित दुता वाचना क्रिश्चियन युनिभर्सिटीमा भेला भए। सहभागीहरूमा MWC का दुई क्षेत्रीय प्रतिनिधिहरू, सिन्थिया पिकक (दक्षिण एसिया) र जेरेमिया चोई (उत्तरपूर्वी एसिया), साथै इन्डोनेसिया, जापान, म्यानमार, फिलिपिन्स, दक्षिण कोरिया, र संयुक्त राज्य अमेरिका (AMBS) का अगुवाहरू थिए।"
        ],
        "taskForcesIntro": "अनुभव आदानप्रदान र विचार-विमर्शपछि समूहले तीन क्षेत्रमा मिलेर काम गर्ने निर्णय गर्‍यो र कार्यदलहरू (Task Force) गठन गर्‍यो:",
        "taskForces": [
          {
            "num": 1,
            "name": "वेबसाइट कार्यदल",
            "nameEn": "Website Task Force",
            "desc": "स्रोतहरू पत्ता लगाउने र तिनीहरूलाई डिजिटल रूपमा साझा गर्ने माध्यमहरू निर्माण गर्ने।"
          },
          {
            "num": 2,
            "name": "पाठ्यक्रम विकास कार्यदल",
            "nameEn": "Curriculum Development Task Force",
            "desc": "शैक्षिक प्राथमिकताहरू निर्धारण गर्ने र शैक्षिक सामग्रीहरू व्यवस्थित गर्ने।"
          },
          {
            "num": 3,
            "name": "सहजीकरण कार्यदल",
            "nameEn": "Facilitation Task Force",
            "desc": "सदस्यहरू बीचको सम्पर्क कायम राख्ने, प्रगतिको निरीक्षण गर्ने, र प्रत्यक्ष भेटघाटको योजना बनाउने।"
          }
        ]
      },
      "gathering": {
        "badge": "विस्तार",
        "title": "पहिलो AAMEN जमघट (The First AAMEN Gathering)",
        "paragraphs": [
          "अक्टोबर ३१ देखि नोभेम्बर ४, २०२५ सम्म, पहिलो AAMEN जमघट थाइल्याण्डको कुन क्लाङमा हमोङ डिस्ट्रिक्ट २० मण्डली सम्मेलनको आयोजनामा सम्पन्न भयो।",
          "त्यहाँ तीन कार्यदलहरूलाई तीन स्थायी कार्य समूहहरूमा (Working Groups) विस्तार गरियो।"
        ]
      }
    },
    "timeline": {
      "badge": "समयरेखा",
      "title": "AAMEN ऐतिहासिक समयरेखा (Timeline)",
      "headers": {
        "date": "मिति",
        "place": "स्थान",
        "event": "ऐतिहासिक घटना"
      },
      "items": [
        {
          "date": "१९९० को दशकको मध्य",
          "place": "समग्र एसिया",
          "event": "एसियामा एनाब्याप्टिस्ट धर्मशास्त्रीय शिक्षाको अभावबारे मण्डलीका अगुवाहरूले चिन्ता व्यक्त गरे"
        },
        {
          "date": "जनवरी १९९६",
          "place": "शिकागो क्षेत्र, अमेरिका",
          "event": "\"उत्तर-ईसाई संसारमा मेनोनाइट शिक्षा\" सम्बन्धी परामर्श आयोजना"
        },
        {
          "date": "जनवरी १९९७",
          "place": "कलकत्ता, भारत",
          "event": "MWC द्वारा १३ औं विश्व सम्मेलन अघि पाँच महाद्वीपमा धर्मशास्त्रीय शिक्षा परामर्श"
        },
        {
          "date": "१३–१६ मार्च २००६",
          "place": "मकाउ",
          "event": "पूर्वी एसिया नेतृत्व विकास परामर्श; एसियामा आधारित लचिलो शिक्षाको सिफारिस"
        },
        {
          "date": "१४–१८ सेप्टेम्बर २०२४",
          "place": "योग्यकर्ता, इन्डोनेसिया",
          "event": "दुता वाचना विश्वविद्यालयमा जे. हेन्सन र ए. सान्तोसोको पहलमा बैठक; ३ कार्यदल गठन"
        },
        {
          "date": "३१ अक्टोबर – ४ नोभेम्बर २०२५",
          "place": "कुन क्लाङ, थाइल्याण्ड",
          "event": "पहिलो AAMEN जमघट (हमोङ डिस्ट्रिक्ट २० द्वारा आयोजित); कार्य समूहहरूमा विस्तार"
        },
        {
          "date": "नोभेम्बर २०२६",
          "place": "लुम्बन, लागुना, फिलिपिन्स",
          "event": "२०२६ AAMEN महासभा र सम्मेलन आयोजना हुने तय"
        }
      ]
    }
  },
  "km": {
    "badge": "កេរដំណែល AAMEN",
    "mainTitle": "ប្រវត្តិ AAMEN (History)",
    "subtitle": "ដំណើរនៃការសាបព្រោះ និងថែបំប៉នការអប់រំទ្រឹស្ដីអាណាបាទីស្ទលើទឹកដីអាស៊ី",
    "readPdfLabel": "មើលឯកសារ PDF ដើម",
    "sections": {
      "need": {
        "badge": "ប្រភពដើម និងការយល់ឃើញ",
        "title": "ការទទួលស្គាល់នូវតម្រូវការ (Recognizing the Need)",
        "paragraphs": [
          "នៅពាក់កណ្តាលទសវត្សរ៍ឆ្នាំ ១៩៩០ ថ្នាក់ដឹកនាំព្រះវិហារ និងអ្នកទ្រឹស្ដីទូទាំងអាស៊ីបានចាប់ផ្តើមចែករំលែកនូវក្តីកង្វល់រួមមួយ គឺកង្វះខាតការអប់រំផ្នែកព្រះគម្ពីរ និងទ្រឹស្ដីអាណាបាទីស្ទនៅក្នុងតំបន់។",
          "មានការលើកលែងមួយចំនួន ក្នុងនោះរួមមានសាលាទ្រឹស្ដី Union នៅប្រទេសឥណ្ឌា មជ្ឈមណ្ឌលបណ្តុះបណ្តាលនៅហ្វីលីពីនជាមួយ IMC សាលាព្រះគម្ពីរនៃព្រះវិហារមេនណូណាយវៀតណាម និងមហាវិទ្យាល័យទ្រឹស្ដីនៅសាកលវិទ្យាល័យគ្រីស្ទាន Duta Wacana ក្នុងប្រទេសឥណ្ឌូនេស៊ី។ ទោះជាយ៉ាងណាក៏ដោយ កិច្ចខិតខំប្រឹងប្រែងទាំងនេះខ្លះមានរយៈពេលខ្លី ហើយខ្លះទៀតដំណើរការរួមគ្នាដោយនិកាយជាច្រើន។"
        ]
      },
      "early": {
        "badge": "ការជួបជុំដំបូងៗ",
        "title": "ការសន្ទនាដំបូងៗ (Early Conversations)",
        "lead": "អស់ជាច្រើនឆ្នាំកន្លងមក មានឱកាសជាច្រើនទាំងផ្លូវការ និងមិនផ្លូវការ ដើម្បីសួរថាតើសហគមន៍អាណាបាទីស្ទពិភពលោកត្រូវបានត្រាស់ហៅឱ្យគ្រប់គ្រងអំណោយទាននៃការអប់រំទ្រឹស្ដីយ៉ាងដូចម្តេច។",
        "items": [
          {
            "date": "ខែមករា ឆ្នាំ ១៩៩៦",
            "place": "តំបន់ Chicago សហរដ្ឋអាមេរិក",
            "title": "កិច្ចពិគ្រោះយោបល់ស្តីពីការអប់រំមេនណូណាយក្នុងពិភពក្រោយគ្រីស្ទាន",
            "desc": "ការជួបជុំដំបូងបំផុតដែលចងចាំដោយអ្នកដែលបច្ចុប្បន្នកំពុងចូលរួមក្នុង AAMEN គឺកិច្ចពិគ្រោះយោបល់ស្តីពី \"Mennonite Education in a Post-Christian World\"។"
          },
          {
            "date": "ខែមករា ឆ្នាំ ១៩៩៧",
            "place": "Calcutta ប្រទេសឥណ្ឌា",
            "title": "កិច្ចពិគ្រោះយោបល់ស្តីពីការអប់រំទ្រឹស្ដីនៅលើទ្វីបទាំងប្រាំ",
            "desc": "ប៉ុន្មានថ្ងៃមុនមហាសន្និបាតពិភពលោកលើកទី ១៣ សន្និសីទពិភពលោកមេនណូណាយ (MWC) បានរៀបចំកិច្ចពិគ្រោះយោបល់ស្តីពីការអប់រំទ្រឹស្ដីនៅលើទ្វីបទាំងប្រាំ។"
          },
          {
            "date": "ថ្ងៃទី ១៣–១៦ ខែមីនា ឆ្នាំ ២០០៦",
            "place": "ម៉ាកាវ",
            "title": "កិច្ចពិគ្រោះយោបល់ស្តីពីការអភិវឌ្ឍភាពជាអ្នកដឹកនាំអាណាបាទីស្ទនៅអាស៊ីបូព៌ា",
            "desc": "ថ្នាក់ដឹកនាំព្រះវិហារបានពិភាក្សាអំពីឱកាស និងបញ្ហាប្រឈមដែលសន្និសីទអាណាបាទីស្ទ-មេនណូណាយនៅអាស៊ីជួបប្រទះ។ អនុសាសន៍ដ៏រឹងមាំមួយបានលេចចេញឡើង៖ ការអភិវឌ្ឍការអប់រំទ្រឹស្ដីដែលអាចបត់បែនបាន ដែលមានមូលដ្ឋាននៅអាស៊ី និងត្រូវបានរៀបចំឡើងដោយអាស៊ី។"
          }
        ]
      },
      "renewing": {
        "badge": "ទស្សនវិស័យថ្មី",
        "title": "ការធ្វើឱ្យទស្សនវិស័យរស់ឡើងវិញ (Renewing the Vision)",
        "paragraphs": [
          "ជិតពីរសតវត្សរ៍ក្រោយមក Jeanette Hanson (Mennonite Church Canada) និង Andi Santoso (Mennonite Mission Network) បានបោះជំហានយ៉ាងជាក់ស្តែងដើម្បីគិតឡើងវិញនូវទស្សនវិស័យនេះ និងយកទៅអនុវត្ត។",
          "អ្នកដែលបានឆ្លើយតបនឹងការអំពាវនាវរបស់ពួកគេបានជួបគ្នានៅសាកលវិទ្យាល័យគ្រីស្ទាន Duta Wacana ក្នុងទីក្រុង Yogyakarta ប្រទេសឥណ្ឌូនេស៊ី នៅថ្ងៃទី ១៤–១៨ ខែកញ្ញា ឆ្នាំ ២០២៤។ អ្នកចូលរួមរួមមានតំណាងប្រចាំតំបន់ MWC ពីររូប គឺ Cynthia Peacock (អាស៊ីខាងត្បូង) និង Jeremiah Choi (អាស៊ីឦសាន) ព្រមទាំងថ្នាក់ដឹកនាំព្រះវិហារមកពីឥណ្ឌូនេស៊ី ជប៉ុន មីយ៉ាន់ម៉ា ហ្វីលីពីន កូរ៉េខាងត្បូង និងសហរដ្ឋអាមេរិក (AMBS)។"
        ],
        "taskForcesIntro": "តាមរយៈការចែករំលែក និងការប្រមូលគំនិត ក្រុមការងារបានសម្រេចចិត្តធ្វើការរួមគ្នាក្នុងវិស័យចំនួនបី និងបានបង្កើតក្រុមការងារពិសេស (Task Force)៖",
        "taskForces": [
          {
            "num": 1,
            "name": "ក្រុមការងារគេហទំព័រ",
            "nameEn": "Website Task Force",
            "desc": "ស្វែងរកធនធាន និងបង្កើតមធ្យោបាយឌីជីថលដើម្បីចែករំលែកធនធានទាំងនោះ។"
          },
          {
            "num": 2,
            "name": "ក្រុមការងារអភិវឌ្ឍន៍កម្មវិធីសិក្សា",
            "nameEn": "Curriculum Development Task Force",
            "desc": "កំណត់អាទិភាពនៃការអប់រំ និងរៀបចំខ្លឹមសារអប់រំឱ្យមានលក្ខណៈជាប្រព័ន្ធ។"
          },
          {
            "num": 3,
            "name": "ក្រុមការងារសម្របសម្រួល",
            "nameEn": "Facilitation Task Force",
            "desc": "រក្សាការតភ្ជាប់រវាងសមាជិក តាមដានវឌ្ឍនភាព និងរៀបចំផែនការជួបជុំដោយផ្ទាល់។"
          }
        ]
      },
      "gathering": {
        "badge": "ការពង្រីក",
        "title": "ការជួបជុំ AAMEN លើកដំបូង (The First AAMEN Gathering)",
        "paragraphs": [
          "ចាប់ពីថ្ងៃទី ៣១ ខែតុលា ដល់ថ្ងៃទី ៤ ខែវិច្ឆិកា ឆ្នាំ ២០២៥ ការជួបជុំ AAMEN លើកដំបូងបានប្រព្រឹត្តទៅនៅ Kun Klang ប្រទេសថៃ ដោយមានការរៀបចំយ៉ាងកក់ក្តៅពីសន្និសីទព្រះវិហារ Hmong District 20។",
          "នៅទីនោះ ក្រុមការងារពិសេសទាំងបីត្រូវបានពង្រីកជាផ្លូវការទៅជាក្រុមការងារអចិន្ត្រៃយ៍ចំនួនបី (Working Groups)។"
        ]
      }
    },
    "timeline": {
      "badge": "បន្ទាត់ពេលវេលា",
      "title": "ប្រវត្តិ និងបន្ទាត់ពេលវេលា AAMEN",
      "headers": {
        "date": "កាលបរិច្ឆេទ",
        "place": "ទីកន្លែង",
        "event": "ព្រឹត្តិការណ៍ប្រវត្តិសាស្ត្រ"
      },
      "items": [
        {
          "date": "ពាក់កណ្តាលទសវត្សរ៍ឆ្នាំ ១៩៩០",
          "place": "ទូទាំងអាស៊ី",
          "event": "ថ្នាក់ដឹកនាំព្រះវិហារលើកឡើងពីកង្វល់ចំពោះកង្វះការអប់រំទ្រឹស្ដីអាណាបាទីស្ទនៅអាស៊ី"
        },
        {
          "date": "ខែមករា ឆ្នាំ ១៩៩៦",
          "place": "តំបន់ Chicago សហរដ្ឋអាមេរិក",
          "event": "ការពិគ្រោះយោបល់ស្តីពី \"ការអប់រំមេនណូណាយក្នុងពិភពក្រោយគ្រីស្ទាន\""
        },
        {
          "date": "ខែមករា ឆ្នាំ ១៩៩៧",
          "place": "Calcutta ប្រទេសឥណ្ឌា",
          "event": "កិច្ចពិគ្រោះយោបល់ស្តីពីការអប់រំទ្រឹស្ដីទ្វីបទាំងប្រាំដោយ MWC មុនមហាសន្និបាតលើកទី ១៣"
        },
        {
          "date": "ថ្ងៃទី ១៣–១៦ ខែមីនា ឆ្នាំ ២០០៦",
          "place": "ម៉ាកាវ",
          "event": "ការពិគ្រោះយោបល់ភាពជាអ្នកដឹកនាំអាស៊ីបូព៌ា ណែនាំឱ្យបង្កើតការអប់រំដែលមានមូលដ្ឋាននៅអាស៊ី"
        },
        {
          "date": "ថ្ងៃទី ១៤–១៨ ខែកញ្ញា ឆ្នាំ ២០២៤",
          "place": "Yogyakarta ប្រទេសឥណ្ឌូនេស៊ី",
          "event": "ការប្រជុំនៅសាកលវិទ្យាល័យ Duta Wacana ផ្តួចផ្តើមដោយ J. Hanson និង A. Santoso បង្កើត ៣ ក្រុមការងារ"
        },
        {
          "date": "៣១ តុលា – ៤ វិច្ឆិកា ២០២៥",
          "place": "Kun Klang ប្រទេសថៃ",
          "event": "ការជួបជុំ AAMEN លើកដំបូង (រៀបចំដោយ Hmong District 20) ពង្រីកជាក្រុមការងារអចិន្ត្រៃយ៍"
        },
        {
          "date": "ខែវិច្ឆិកា ឆ្នាំ ២០២៦",
          "place": "Lumban, Laguna ប្រទេសហ្វីលីពីន",
          "event": "គ្រោងរៀបចំមហាសន្និបាត AAMEN ឆ្នាំ ២០២៦ (2026 AAMEN Meeting)"
        }
      ]
    }
  },
  "lo": {
    "badge": "ມໍລະດົກ AAMEN",
    "mainTitle": "ປະຫວັດສາດ AAMEN (History)",
    "subtitle": "ການເດີນທາງແຫ່ງການຫວ່ານ ແລະ ບົວລະບັດການສຶກສາສາດສະໜາສາດອານາບັບຕິສໃນດິນແດນອາຊີ",
    "readPdfLabel": "ເບິ່ງເອກະສານ PDF ຕົ້ນສະບັບ",
    "sections": {
      "need": {
        "badge": "ຄວາມເປັນມາ ແລະ ຄວາມຮັບຮູ້",
        "title": "ການຮັບຮູ້ຄວາມຈຳເປັນ (Recognizing the Need)",
        "paragraphs": [
          "ໃນກາງຊຸມປີ 1990, ຜູ້ນຳຄຣິສຕະຈັກ ແລະ ນັກສາດສະໜາສາດທົ່ວອາຊີ ໄດ້ເລີ່ມແບ່ງປັນຄວາມກັງວົນຮ່ວມກັນ: ການຂາດເຂີນການສຶກສາພຣະຄຳພີ ແລະ ສາດສະໜາສາດອານາບັບຕິສໃນພາກພື້ນນີ້.",
          "ມີຂໍ້ຍົກເວັ້ນບາງຢ່າງ, ລວມທັງສະຖາບັນສາດສະໜາສາດ Union ໃນອິນເດຍ, ສູນຝຶກອົບຮົມໃນຟີລິບປິນຮ່ວມກັບ IMC, ໂຮງຮຽນພຣະຄຳພີຂອງຄຣິສຕະຈັກເມນໂນໄນຫວຽດນາມ, ແລະ ຄະນະສາດສະໜາສາດທີ່ມະຫາວິທະຍາໄລຄຣິສຕຽນ Duta Wacana ໃນອິນໂດເນເຊຍ. ແນວໃດກໍຕາມ, ຄວາມພະຍາຍາມເຫຼົ່ານີ້ບາງສ່ວນກໍມີອາຍຸສັ້ນ, ແລະ ບາງສ່ວນກໍດຳເນີນງານຮ່ວມກັນລະຫວ່າງຫຼາຍນິກາຍ."
        ]
      },
      "early": {
        "badge": "ການປຶກສາຫາລືໄລຍະທຳອິດ",
        "title": "ການສົນທະນາໃນໄລຍະເລີ່ມຕົ້ນ (Early Conversations)",
        "lead": "ຕະຫຼອດຫຼາຍປີທີ່ຜ່ານມາ, ມີໂອກາດທັງທີ່ເປັນທາງການ ແລະ ບໍ່ເປັນທາງການຫຼາຍຄັ້ງ ເພື່ອຖາມວ່າປະຊາຄົມອານາບັບຕິສທົ່ວໂລກຖືກຮຽກຮ້ອງໃຫ້ດູແລຂອງປະທານແຫ່ງການສຶກສາສາດສະໜາສາດແນວໃດ.",
        "items": [
          {
            "date": "ມັງກອນ 1996",
            "place": "ເຂດຊິຄາໂກ, ສະຫະລັດອາເມຣິກາ",
            "title": "ການປຶກສາຫາລືກ່ຽວກັບການສຶກສາເມນໂນໄນໃນໂລກຍຸກຫຼັງຄຣິສຕຽນ",
            "desc": "ການເຕົ້າໂຮມທີ່ເກົ່າແກ່ທີ່ສຸດທີ່ຜູ້ມີສ່ວນຮ່ວມໃນ AAMEN ຈື່ໄດ້ ແມ່ນການປຶກສາຫາລືກ່ຽວກັບ \"Mennonite Education in a Post-Christian World\"."
          },
          {
            "date": "ມັງກອນ 1997",
            "place": "ກັນກັດຕາ, ອິນເດຍ",
            "title": "ການປຶກສາຫາລືກ່ຽວກັບການສຶກສາສາດສະໜາສາດໃນຫ້າທະວີບ",
            "desc": "ບໍ່ເທົ່າໃດມື້ກ່ອນກອງປະຊຸມໃຫຍ່ລະດັບໂລກຄັ້ງທີ 13, ກອງປະຊຸມໃຫຍ່ເມນໂນໄນໂລກ (MWC) ໄດ້ຈັດການປຶກສາຫາລືກ່ຽວກັບການສຶກສາສາດສະໜາສາດໃນຫ້າທະວີບ."
          },
          {
            "date": "13–16 ມີນາ 2006",
            "place": "ມາເກົ໊າ",
            "title": "ການປຶກສາຫາລືກ່ຽວກັບການພັດທະນາຄວາມເປັນຜູ້ນຳອານາບັບຕິສໃນອາຊີຕາເວັນອອກ",
            "desc": "ຜູ້ນຳຄຣິສຕະຈັກໄດ້ສົນທະນາກ່ຽວກັບກາລະໂອກາດ ແລະ ສິ່ງທ້າທາຍທີ່ຄຣິສຕະຈັກອານາບັບຕິສ-ເມນໂນໄນໃນອາຊີກຳລັງປະເຊີນ. ຂໍ້ສະເໜີແນະທີ່ໜັກແໜ້ນອັນໜຶ່ງໄດ້ປະກົດຂຶ້ນ: ການພັດທະນາການສຶກສາສາດສະໜາສາດທີ່ມີຄວາມຍືດຍຸ່ນ, ມີພື້ນຖານຢູ່ໃນອາຊີ ແລະ ສ້າງຮູບຮ່າງໂດຍອາຊີ."
          }
        ]
      },
      "renewing": {
        "badge": "ນິມິດໃໝ່",
        "title": "ການຟື້ນຟູນິມິດ (Renewing the Vision)",
        "paragraphs": [
          "ເກືອບສອງທົດສະວັດຕໍ່ມາ, Jeanette Hanson (Mennonite Church Canada) ແລະ Andi Santoso (Mennonite Mission Network) ໄດ້ກ້າວໄປຂ້າງໜ້າຢ່າງເປັນຮູບປະທຳ ເພື່ອວາດພາບນິມິດນີ້ຄືນໃໝ່ ແລະ ນຳໄປສູ່ການປະຕິບັດ.",
          "ຜູ້ທີ່ຕອບຮັບການຮຽກຮ້ອງຂອງພວກເຂົາ ໄດ້ພົບກັນທີ່ມະຫາວິທະຍາໄລຄຣິສຕຽນ Duta Wacana ໃນຢອກຢາກາຕາ, ອິນໂດເນເຊຍ, ໃນວັນທີ 14–18 ກັນຍາ 2024. ຜູ້ເຂົ້າຮ່ວມລວມມີຕົວແທນລະດັບພາກພື້ນຂອງ MWC ສອງທ່ານ, Cynthia Peacock (ອາຊີໃຕ້) ແລະ Jeremiah Choi (ອາຊີຕາເວັນອອກສຽງເໜືອ), ພ້ອມດ້ວຍຜູ້ນຳຄຣິສຕະຈັກຈາກອິນໂດເນເຊຍ, ຍີ່ປຸ່ນ, ມຽນມາ, ຟີລິບປິນ, ເກົາຫຼີໃຕ້, ແລະ ສະຫະລັດອາເມຣິກາ (AMBS)."
        ],
        "taskForcesIntro": "ຜ່ານການແບ່ງປັນ ແລະ ການລະດົມຄວາມຄິດ, ກຸ່ມໄດ້ຕັດສິນໃຈເຮັດວຽກຮ່ວມກັນໃນສາມຂົງເຂດ ແລະ ໄດ້ສ້າງຕັ້ງຄະນະເຮັດວຽກສະເພາະກິດ (Task Force):",
        "taskForces": [
          {
            "num": 1,
            "name": "ຄະນະເຮັດວຽກສະເພາະກິດດ້ານເວັບໄຊ",
            "nameEn": "Website Task Force",
            "desc": "ຊອກຫາແຫຼ່ງຂໍ້ມູນ ແລະ ສ້າງຕັ້ງຊ່ອງທາງດິຈິຕອນເພື່ອແບ່ງປັນຊັບພະຍາກອນເຫຼົ່ານັ້ນ."
          },
          {
            "num": 2,
            "name": "ຄະນະເຮັດວຽກສະເພາະກິດດ້ານການພັດທະນາຫຼັກສູດ",
            "nameEn": "Curriculum Development Task Force",
            "desc": "ກຳນົດບຸລິມະສິດທາງການສຶກສາ ແລະ ຈັດລະບຽບເນື້ອໃນການຮຽນການສອນຢ່າງເປັນລະບົບ."
          },
          {
            "num": 3,
            "name": "ຄະນະເຮັດວຽກສະເພາະກິດດ້ານການອຳນວຍຄວາມສະດວກ",
            "nameEn": "Facilitation Task Force",
            "desc": "ຮັກສາການເຊື່ອມຕໍ່ລະຫວ່າງສະມາຊິກ, ຕິດຕາມຄວາມຄືບໜ້າ, ແລະ ວາງແຜນການພົບປະຕົວຈິງ."
          }
        ]
      },
      "gathering": {
        "badge": "ການຂະຫຍາຍຕົວ",
        "title": "ການເຕົ້າໂຮມ AAMEN ຄັ້ງທຳອິດ (The First AAMEN Gathering)",
        "paragraphs": [
          "ແຕ່ວັນທີ 31 ຕຸລາ ຫາ 4 ພະຈິກ 2025, ການເຕົ້າໂຮມ AAMEN ຄັ້ງທຳອິດໄດ້ຈັດຂຶ້ນທີ່ ຂຸນກາງ (Kun Klang), ປະເທດໄທ, ໂດຍມີຄຣິສຕະຈັກພາກ 20 ຊາວມົ້ງ (Hmong District 20) ເປັນເຈົ້າພາບ.",
          "ຢູ່ທີ່ນັ້ນ, ຄະນະເຮັດວຽກສະເພາະກິດທັງສາມໄດ້ຖືກຂະຫຍາຍອອກເປັນສາມກຸ່ມເຮັດວຽກຖາວອນ (Working Groups)."
        ]
      }
    },
    "timeline": {
      "badge": "ເສັ້ນເວລາ",
      "title": "ເສັ້ນເວລາປະຫວັດສາດ AAMEN",
      "headers": {
        "date": "ວັນທີ/ໄລຍະເວລາ",
        "place": "ສະຖານທີ່",
        "event": "ເຫດການປະຫວັດສາດ"
      },
      "items": [
        {
          "date": "ກາງຊຸມປີ 1990",
          "place": "ທົ່ວອາຊີ",
          "event": "ຜູ້ນຳຄຣິສຕະຈັກສະແດງຄວາມກັງວົນກ່ຽວກັບການຂາດການສຶກສາສາດສະໜາສາດອານາບັບຕິສໃນອາຊີ"
        },
        {
          "date": "ມັງກອນ 1996",
          "place": "ເຂດຊິຄາໂກ, ສະຫະລັດ",
          "event": "ການປຶກສາຫາລືກ່ຽວກັບ \"ການສຶກສາເມນໂນໄນໃນໂລກຍຸກຫຼັງຄຣິສຕຽນ\""
        },
        {
          "date": "ມັງກອນ 1997",
          "place": "ກັນກັດຕາ, ອິນເດຍ",
          "event": "ການປຶກສາຫາລືການສຶກສາສາດສະໜາສາດໃນຫ້າທະວີບໂດຍ MWC ກ່ອນກອງປະຊຸມໃຫຍ່ຄັ້ງທີ 13"
        },
        {
          "date": "13–16 ມີນາ 2006",
          "place": "ມາເກົ໊າ",
          "event": "ການປຶກສາຫາລືຄວາມເປັນຜູ້ນຳອາຊີຕາເວັນອອກ; ແນະນຳໃຫ້ພັດທະນາການສຶກສາທີ່ມີຄວາມຍືດຍຸ່ນໃນອາຊີ"
        },
        {
          "date": "14–18 ກັນຍາ 2024",
          "place": "ຢອກຢາກາຕາ, ອິນໂດເນເຊຍ",
          "event": "ການປະຊຸມທີ່ມະຫາວິທະຍາໄລ Duta Wacana ລິເລີ່ມໂດຍ J. Hanson ແລະ A. Santoso; ສ້າງຕັ້ງ 3 ຄະນະເຮັດວຽກ"
        },
        {
          "date": "31 ຕຸລາ – 4 ພະຈິກ 2025",
          "place": "ຂຸນກາງ, ປະເທດໄທ",
          "event": "ການເຕົ້າໂຮມ AAMEN ຄັ້ງທຳອິດ (ຈັດໂດຍ Hmong District 20); ຂະຫຍາຍເປັນກຸ່ມເຮັດວຽກຖາວອນ"
        },
        {
          "date": "ພະຈິກ 2026",
          "place": "ລຸມບານ, ລາກູນາ, ຟີລິບປິນ",
          "event": "ກຳນົດຈັດກອງປະຊຸມໃຫຍ່ AAMEN ປີ 2026 (2026 AAMEN Meeting)"
        }
      ]
    }
  }
}

export function getHistoryData(locale: string): HistoryLocaleData {
  return historyDataByLocale[locale] || historyDataByLocale['ko']
}
