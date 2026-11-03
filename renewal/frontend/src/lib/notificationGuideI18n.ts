// 15개 참여국 완벽 다국어 지원: 알림 내역, 웹앱 설치 가이드, 텔레그램 연동 텍스트
export interface NotificationGuideTexts {
  // 1. 실시간 알림 내역 (NotificationHistoryList)
  historyTitle: string
  historyDesc: string
  historyUnreadBadge: string
  historyRefresh: string
  historyMarkAllRead: string
  historyDeleteAll: string
  historyTabAll: string
  historyTabUnread: string
  historyTabComment: string
  historyTabPrayer: string
  historyTabMessage: string
  historyLoading: string
  historyEmptyTitle: string
  historyEmptyDesc: string

  timeJustNow: string
  timeMinAgo: (min: number) => string
  timeHourAgo: (hour: number) => string
  timeDayAgo: (day: number) => string

  typeComment: string
  typeAmen: string
  typeUrgentPrayer: string
  typeMessage: string
  typeSystem: string
  viewAction: string
  deleteAction: string

  // 2. 스마트폰 웹앱 설치 & 푸시 알림 안내 (AppInstallGuide)
  installGuideTitle: string
  installGuideDesc: string
  installGuideBadge: string
  installTabAndroid: string
  installTabIos: string
  installTabPush: string

  androidStepTitle: string
  androidStep1Title: string
  androidStep1Desc: string
  androidStep2Title: string
  androidStep2Desc: string
  androidStep3Title: string
  androidStep3Desc: string
  samsungTip: string

  iosStepTitle: string
  iosStep1Title: string
  iosStep1Desc: string
  iosStep2Title: string
  iosStep2Desc: string
  iosStep3Title: string
  iosStep3Desc: string
  iosNoticeTitle: string
  iosNoticeDesc: string

  pushStepTitle: string
  pushStep1Title: string
  pushStep1Desc: string
  pushStep2Title: string
  pushStep2Desc: string
  pushFaqTitle: string
  pushFaqDesc: string
  pushEnableBtn: string
  pushTestBtn: string

  // 3. 텔레그램 봇 연동 (Telegram Card)
  telegramIdSub: string
  telegramBotNoticeBadge: string
  telegramPolicyLabel: string
  telegramPolicyDesc: string
  telegramOpenBotBtn: string
}

export const NOTIFICATION_GUIDE_TEXTS: Record<string, NotificationGuideTexts> = {
  ko: {
    historyTitle: '실시간 알림 내역',
    historyDesc: '기도, 댓글, 쪽지 등 나에게 전달된 최신 알림을 확인하고 관리합니다.',
    historyUnreadBadge: '미확인',
    historyRefresh: '새로고침',
    historyMarkAllRead: '모두 읽음',
    historyDeleteAll: '전체 삭제',
    historyTabAll: '전체',
    historyTabUnread: '미확인',
    historyTabComment: '댓글',
    historyTabPrayer: '기도/아멘',
    historyTabMessage: '쪽지',
    historyLoading: '알림을 불러오는 중...',
    historyEmptyTitle: '해당하는 알림이 없습니다 🕊️',
    historyEmptyDesc: '새로운 상호작용이 발생하면 여기에 표시됩니다.',
    timeJustNow: '방금 전',
    timeMinAgo: (m: number) => `${m}분 전`,
    timeHourAgo: (h: number) => `${h}시간 전`,
    timeDayAgo: (d: number) => `${d}일 전`,
    typeComment: '게시물 댓글',
    typeAmen: '저도 기도할게요',
    typeUrgentPrayer: '🚨 긴급 중보기도',
    typeMessage: '✉️ 개인 쪽지',
    typeSystem: '시스템 공지',
    viewAction: '바로가기',
    deleteAction: '삭제',

    installGuideTitle: '📱 AAMEN 스마트폰 웹앱 설치 & 푸시 알림 안내',
    installGuideDesc: '스마트폰 홈 화면에 AAMEN 앱을 1초 만에 설치하고, 기도 응답과 새 소식을 기기 알림으로 받아보세요!',
    installGuideBadge: '앱스토어 불필요',
    installTabAndroid: '안드로이드 (갤럭시/Chrome)',
    installTabIos: '아이폰 (iPhone/Safari)',
    installTabPush: '알림 켜기 & 해결법',

    androidStepTitle: '안드로이드 (삼성 인터넷 또는 Chrome) 설치 방법 (3단계)',
    androidStep1Title: '메뉴 또는 설치 버튼 터치',
    androidStep1Desc: '브라우저 상단 주소창 우측의 [설치 ⬇️] 아이콘을 누르거나, 우측 상단 더보기 메뉴(⋮)를 누릅니다.',
    androidStep2Title: '[홈 화면에 추가] 선택',
    androidStep2Desc: '메뉴에서 [홈 화면에 추가] 또는 [앱 설치]를 선택하고 [추가]를 누릅니다.',
    androidStep3Title: '앱처럼 바로 실행!',
    androidStep3Desc: '스마트폰 홈 화면에 생성된 AAMEN 아이콘을 터치하면 상단 주소창 없이 시원한 전체화면 앱으로 실행됩니다.',
    samsungTip: '삼성 인터넷 브라우저를 쓰시는 경우: 하단 삼선 메뉴(≡) → [현재 페이지 추가] → [홈 화면]을 누르시면 가장 편리합니다.',

    iosStepTitle: '아이폰/iPad (Safari 브라우저) 설치 방법 (3단계)',
    iosStep1Title: 'Safari 하단 공유 버튼 터치',
    iosStep1Desc: '반드시 Safari(사파리) 브라우저로 접속한 후, 화면 하단 중앙의 공유 아이콘 (네모에 위 화살표 ⬆️)을 터치합니다.',
    iosStep2Title: '[홈 화면에 추가] 선택',
    iosStep2Desc: '공유 메뉴를 아래로 스크롤하여 [홈 화면에 추가 ➕]를 누른 뒤, 우측 상단 [추가]를 터치합니다.',
    iosStep3Title: '홈 화면 아이콘으로 실행!',
    iosStep3Desc: '바탕화면에 생성된 AAMEN 앱을 터치하여 실행하면 사파리 주소창 없이 앱스토어 앱과 동일하게 작동합니다.',
    iosNoticeTitle: '⚠️ 아이폰(iOS) 유저 필독 안내',
    iosNoticeDesc: '애플의 보안 정책상 iOS 16.4 이상부터 웹 푸시를 지원하며, 반드시 [홈 화면에 추가]한 앱 아이콘으로 접속하셔야 알림 허용 팝업이 활성화됩니다.',

    pushStepTitle: '브라우저 푸시 알림 켜기 및 문제 해결 방법',
    pushStep1Title: '1단계: [알림 켜기] 버튼 누르고 브라우저 팝업에서 [허용]',
    pushStep1Desc: '아래 알림 카드에서 [알림 켜기] 버튼을 누른 후, 화면 상단 브라우저 질문에서 [허용 (Allow)]을 터치해 주세요.',
    pushStep2Title: '2단계: [🔔 알림 테스트] 버튼으로 정상 수신 확인',
    pushStep2Desc: '[알림 테스트] 버튼을 누르면 기기 상단에 띵동~ 하고 AAMEN 테스트 팝업이 뜹니다. 팝업이 뜨면 모든 준비가 완료된 것입니다!',
    pushFaqTitle: 'Q. 허용을 눌렀는데도 알림이 안 와요!',
    pushFaqDesc: '스마트폰 [설정] → [알림] → [사용 중인 브라우저(또는 AAMEN 앱)]의 알림 허용 스위치가 켜져 있는지 확인해 주세요. 방해금지 모드일 경우 무음 처리될 수 있습니다.',
    pushEnableBtn: '지금 알림 권한 켜기',
    pushTestBtn: '🔔 알림 테스트 발송',

    telegramIdSub: '* 본인 텔레그램 숫자 Chat ID 입력',
    telegramBotNoticeBadge: '💡 봇 시작하기 (알림 수신 활성화 필수)',
    telegramPolicyLabel: '텔레그램 보안 정책',
    telegramPolicyDesc: '텔레그램 보안 정책상, 봇 대화창에서 [시작(Start)]을 먼저 눌러주셔야 AAMEN 봇이 회원님께 알림을 보낼 수 있습니다.',
    telegramOpenBotBtn: '👉 @aamen13_bot 대화창 열고 [시작(Start)] 누르기',
  },
  ja: {
    historyTitle: 'リアルタイム通知履歴',
    historyDesc: '祈り、コメント、メッセージなど届いた最新通知を確認・管理します。',
    historyUnreadBadge: '未読',
    historyRefresh: '更新',
    historyMarkAllRead: 'すべて既読',
    historyDeleteAll: '全て削除',
    historyTabAll: '全て',
    historyTabUnread: '未読',
    historyTabComment: 'コメント',
    historyTabPrayer: '祈り/アーメン',
    historyTabMessage: 'メッセージ',
    historyLoading: '通知を読み込み中...',
    historyEmptyTitle: '該当する通知はありません 🕊️',
    historyEmptyDesc: '新しいアクティビティが発生するとここに表示されます。',
    timeJustNow: 'たった今',
    timeMinAgo: (m: number) => `${m}分前`,
    timeHourAgo: (h: number) => `${h}時間前`,
    timeDayAgo: (d: number) => `${d}日前`,
    typeComment: 'コメント',
    typeAmen: '私も祈ります (アーメン)',
    typeUrgentPrayer: '🚨 緊急とりなしの祈り',
    typeMessage: '✉️ メッセージ',
    typeSystem: 'システム通知',
    viewAction: '確認',
    deleteAction: '削除',

    installGuideTitle: '📱 AAMEN スマートフォンウェブアプリ設置＆プッシュ通知案内',
    installGuideDesc: 'スマホのホーム画面にAAMENアプリを瞬時に追加し、祈りの応答や新着情報を端末通知で受け取りましょう！',
    installGuideBadge: 'ストア不要 (PWA)',
    installTabAndroid: 'Android (Galaxy/Chrome)',
    installTabIos: 'iPhone (iOS/Safari)',
    installTabPush: '通知有効化＆解決法',

    androidStepTitle: 'Android (Samsungブラウザ または Chrome) 設置手順 (3ステップ)',
    androidStep1Title: 'メニューまたはインストールをタップ',
    androidStep1Desc: 'ブラウザのアドレスバー右側にある[インストール ⬇️]アイコン、または右上の詳細メニュー(⋮)をタップします。',
    androidStep2Title: '[ホーム画面に追加] を選択',
    androidStep2Desc: 'メニューから [ホーム画面に追加] または [アプリをインストール] を選択して確定します。',
    androidStep3Title: 'アプリとして起動！',
    androidStep3Desc: 'ホーム画面に追加された AAMEN アイコンをタップすると、アドレスバーのない快適な全画面アプリとして起動します。',
    samsungTip: 'Samsungブラウザをお使いの場合: 下部メニュー(≡) → [現在のページを追加] → [ホーム画面] が最も簡単です。',

    iosStepTitle: 'iPhone/iPad (Safariブラウザ) 設置手順 (3ステップ)',
    iosStep1Title: 'Safari下部の共有ボタンをタップ',
    iosStep1Desc: '必ずSafariブラウザでアクセスし、画面下部中央の共有アイコン (四角に上矢印 ⬆️) をタップします。',
    iosStep2Title: '[ホーム画面に追加] を選択',
    iosStep2Desc: '共有メニューを下にスクロールして [ホーム画面に追加 ➕] をタップし、右上の [追加] をタップします。',
    iosStep3Title: 'ホーム画面アイコンから起動！',
    iosStep3Desc: 'ホーム画面に作成された AAMEN アプリをタップして起動すると、アドレスバーなしでアプリ同様に快適動作します。',
    iosNoticeTitle: '⚠️ iPhone (iOS) ユーザー必読案内',
    iosNoticeDesc: 'Appleの仕様によりiOS 16.4以降でWebプッシュに対応します。必ず[ホーム画面に追加]したアイコンから起動してください。',

    pushStepTitle: 'ブラウザプッシュ通知の有効化とトラブル解決法',
    pushStep1Title: 'ステップ1: [通知を有効化] を押してブラウザで [許可]',
    pushStep1Desc: '下のカードから通知ボタンを押し、画面上部のポップアップで [許可 (Allow)] をタップしてください。',
    pushStep2Title: 'ステップ2: [🔔 通知テスト] で正常受信を確認',
    pushStep2Desc: '[通知テスト] ボタンを押すと端末上部にテスト通知が表示されます。届いたら準備完了です！',
    pushFaqTitle: 'Q. 許可したのに通知が届きません！',
    pushFaqDesc: 'スマホの [設定] → [通知] → [ご利用のブラウザまたはAAMEN] の通知がONになっているか、おやすみモード等でないかご確認ください。',
    pushEnableBtn: '今すぐ通知権限を有効化',
    pushTestBtn: '🔔 通知テスト送信',

    telegramIdSub: '* ご自身のTelegram数字Chat IDを入力',
    telegramBotNoticeBadge: '💡 ボットの起動 (通知受信に必須)',
    telegramPolicyLabel: 'Telegramセキュリティポリシー',
    telegramPolicyDesc: 'Telegramの仕様により、ボットのチャット画面で [開始(Start)] を先に押していただくことで、AAMENボットが通知を配信できるようになります。',
    telegramOpenBotBtn: '👉 @aamen13_bot チャットを開いて [開始(Start)] を押す',
  },
  'zh-TW': {
    historyTitle: '即時通知記錄',
    historyDesc: '查看並管理代禱、留言、私信等最新通知。',
    historyUnreadBadge: '未讀',
    historyRefresh: '重新整理',
    historyMarkAllRead: '全部標為已讀',
    historyDeleteAll: '全部刪除',
    historyTabAll: '全部',
    historyTabUnread: '未讀',
    historyTabComment: '留言',
    historyTabPrayer: '禱告/阿們',
    historyTabMessage: '私信',
    historyLoading: '載入通知中...',
    historyEmptyTitle: '沒有相關通知 🕊️',
    historyEmptyDesc: '有新動態時將會顯示於此。',
    timeJustNow: '剛剛',
    timeMinAgo: (m: number) => `${m}分鐘前`,
    timeHourAgo: (h: number) => `${h}小時前`,
    timeDayAgo: (d: number) => `${d}天前`,
    typeComment: '文章留言',
    typeAmen: '我也同心禱告 (阿們)',
    typeUrgentPrayer: '🚨 緊急代禱',
    typeMessage: '✉️ 私信',
    typeSystem: '系統公告',
    viewAction: '前往查看',
    deleteAction: '刪除',

    installGuideTitle: '📱 AAMEN 智慧型手機網頁應用安裝與推播通知指南',
    installGuideDesc: '1秒內將AAMEN應用添加到手機主畫面，即時接收代禱回應與最新消息通知！',
    installGuideBadge: '無需應用商店',
    installTabAndroid: 'Android (三星/Chrome)',
    installTabIos: 'iPhone (iOS/Safari)',
    installTabPush: '開啟通知與故障排除',

    androidStepTitle: 'Android (三星瀏覽器或Chrome) 安裝步驟 (3步)',
    androidStep1Title: '點選選單或安裝按鈕',
    androidStep1Desc: '點選瀏覽器網址列右側的 [安裝 ⬇️] 圖示，或開啟右上角的更多選單 (⋮)。',
    androidStep2Title: '選擇 [新增至主畫面]',
    androidStep2Desc: '從選單中選擇 [新增至主畫面] 或 [安裝應用]，然後確認新增。',
    androidStep3Title: '如原生App般啟動！',
    androidStep3Desc: '點選主畫面上的 AAMEN 圖示，即可享受無網址列的清爽全螢幕體驗。',
    samsungTip: '若使用三星瀏覽器：點選底部的三條線選單 (≡) → [新增頁面至] → [主畫面] 最為便捷。',

    iosStepTitle: 'iPhone/iPad (Safari瀏覽器) 安裝步驟 (3步)',
    iosStep1Title: '點選Safari底部的分享按鈕',
    iosStep1Desc: '請務必使用Safari瀏覽器開啟，點選螢幕底部中央的分享圖示 (方框加向上箭頭 ⬆️)。',
    iosStep2Title: '選擇 [加入主畫面]',
    iosStep2Desc: '向下滑動選單並點選 [加入主畫面 ➕]，接著點選右上角的 [新增]。',
    iosStep3Title: '從主畫面圖示啟動！',
    iosStep3Desc: '點選主畫面上的 AAMEN 應用圖示，即可如原生App般流暢運行。',
    iosNoticeTitle: '⚠️ iPhone (iOS) 用戶必讀說明',
    iosNoticeDesc: '根據Apple規範，iOS 16.4以上支援Web推播，且必須從 [加入主畫面] 的圖示開啟才能接收推播。',

    pushStepTitle: '開啟瀏覽器推播通知與常見問題解決',
    pushStep1Title: '第1步：點選開啟通知並在瀏覽器中選擇 [允許]',
    pushStep1Desc: '點選下方按鈕，並在瀏覽器彈出的詢問視窗中點選 [允許 (Allow)]。',
    pushStep2Title: '第2步：點選 [🔔 測試通知] 確認正常接收',
    pushStep2Desc: '點選測試按鈕，若手機頂部彈出測試通知，即表示設定完成！',
    pushFaqTitle: '問：已允許但收不到通知怎麼辦？',
    pushFaqDesc: '請檢查手機 [設定] → [通知] → [瀏覽器/AAMEN] 是否開啟通知許可權，並確認未處於勿擾模式。',
    pushEnableBtn: '立即開啟通知權限',
    pushTestBtn: '🔔 發送測試通知',

    telegramIdSub: '＊ 輸入您的 Telegram 數字 Chat ID',
    telegramBotNoticeBadge: '💡 啟動機器人 (接收通知必備)',
    telegramPolicyLabel: 'Telegram 安全規範',
    telegramPolicyDesc: '依據 Telegram 規範，您必須先在機器人對話視窗點選 [開始(Start)]，AAMEN 機器人才能向您發送通知。',
    telegramOpenBotBtn: '👉 開啟 @aamen13_bot 並點選 [開始(Start)]',
  },
  'zh-HK': {
    historyTitle: '即時通知記錄',
    historyDesc: '查看並管理代禱、留言、私信等最新通知。',
    historyUnreadBadge: '未讀',
    historyRefresh: '重新整理',
    historyMarkAllRead: '全部標為已讀',
    historyDeleteAll: '全部刪除',
    historyTabAll: '全部',
    historyTabUnread: '未讀',
    historyTabComment: '留言',
    historyTabPrayer: '禱告/阿們',
    historyTabMessage: '私信',
    historyLoading: '載入通知中...',
    historyEmptyTitle: '沒有相關通知 🕊️',
    historyEmptyDesc: '有新動態時將會顯示於此。',
    timeJustNow: '剛剛',
    timeMinAgo: (m: number) => `${m}分鐘前`,
    timeHourAgo: (h: number) => `${h}小時前`,
    timeDayAgo: (d: number) => `${d}天前`,
    typeComment: '文章留言',
    typeAmen: '我也同心禱告 (阿們)',
    typeUrgentPrayer: '🚨 緊急代禱',
    typeMessage: '✉️ 私信',
    typeSystem: '系統公告',
    viewAction: '前往查看',
    deleteAction: '刪除',

    installGuideTitle: '📱 AAMEN 智能手機網頁應用安裝與推播通知指南',
    installGuideDesc: '1秒內將AAMEN應用加到手機主畫面，即時接收代禱回應與最新消息通知！',
    installGuideBadge: '無需應用商店',
    installTabAndroid: 'Android (三星/Chrome)',
    installTabIos: 'iPhone (iOS/Safari)',
    installTabPush: '開啟通知與疑難排解',

    androidStepTitle: 'Android (三星瀏覽器或Chrome) 安裝步驟 (3步)',
    androidStep1Title: '點選選單或安裝按鈕',
    androidStep1Desc: '點選瀏覽器網址列右側的 [安裝 ⬇️] 圖示，或開啟右上角的更多選單 (⋮)。',
    androidStep2Title: '選擇 [加至主畫面]',
    androidStep2Desc: '從選單中選擇 [加至主畫面] 或 [安裝應用]，然後確認新增。',
    androidStep3Title: '如原生App般啟動！',
    androidStep3Desc: '點選主畫面上的 AAMEN 圖示，即可享受無網址列的清爽全螢幕體驗。',
    samsungTip: '若使用三星瀏覽器：點選底部的三條線選單 (≡) → [新增頁面至] → [主畫面] 最為便捷。',

    iosStepTitle: 'iPhone/iPad (Safari瀏覽器) 安裝步驟 (3步)',
    iosStep1Title: '點選Safari底部的分享按鈕',
    iosStep1Desc: '請務必使用Safari瀏覽器開啟，點選螢幕底部中央的分享圖示 (方框加向上箭頭 ⬆️)。',
    iosStep2Title: '選擇 [加至主畫面]',
    iosStep2Desc: '向下滑動選單並點選 [加至主畫面 ➕]，接著點選右上角的 [新增]。',
    iosStep3Title: '從主畫面圖示啟動！',
    iosStep3Desc: '點選主畫面上的 AAMEN 應用圖示，即可如原生App般流暢運行。',
    iosNoticeTitle: '⚠️ iPhone (iOS) 用戶必讀說明',
    iosNoticeDesc: '根據Apple規範，iOS 16.4以上支援Web推播，且必須從 [加至主畫面] 的圖示開啟才能接收推播。',

    pushStepTitle: '開啟瀏覽器推播通知與疑難排解',
    pushStep1Title: '第1步：點選開啟通知並在瀏覽器中選擇 [允許]',
    pushStep1Desc: '點選下方按鈕，並在瀏覽器彈出的詢問視窗中點選 [允許 (Allow)]。',
    pushStep2Title: '第2步：點選 [🔔 測試通知] 確認正常接收',
    pushStep2Desc: '點選測試按鈕，若手機頂部彈出測試通知，即表示設定完成！',
    pushFaqTitle: '問：已允許但收不到通知怎麼辦？',
    pushFaqDesc: '請檢查手機 [設定] → [通知] → [瀏覽器/AAMEN] 是否開啟通知許可權，並確認未處於勿擾模式。',
    pushEnableBtn: '立即開啟通知權限',
    pushTestBtn: '🔔 發送測試通知',

    telegramIdSub: '＊ 輸入您的 Telegram 數字 Chat ID',
    telegramBotNoticeBadge: '💡 啟動機器人 (接收通知必備)',
    telegramPolicyLabel: 'Telegram 安全規範',
    telegramPolicyDesc: '依據 Telegram 規範，您必須先在機器人對話視窗點選 [開始(Start)]，AAMEN 機器人才能向您發送通知。',
    telegramOpenBotBtn: '👉 開啟 @aamen13_bot 並點選 [開始(Start)]',
  },
  en: {
    historyTitle: 'Real-time Notifications',
    historyDesc: 'Check and manage latest notifications for prayers, comments, and messages.',
    historyUnreadBadge: 'unread',
    historyRefresh: 'Refresh',
    historyMarkAllRead: 'Mark all read',
    historyDeleteAll: 'Delete all',
    historyTabAll: 'All',
    historyTabUnread: 'Unread',
    historyTabComment: 'Comments',
    historyTabPrayer: 'Prayers',
    historyTabMessage: 'Messages',
    historyLoading: 'Loading notifications...',
    historyEmptyTitle: 'No notifications in this category 🕊️',
    historyEmptyDesc: 'New activities will appear here.',
    timeJustNow: 'Just now',
    timeMinAgo: (m: number) => `${m}m ago`,
    timeHourAgo: (h: number) => `${h}h ago`,
    timeDayAgo: (d: number) => `${d}d ago`,
    typeComment: 'Comment',
    typeAmen: 'I will pray (Amen)',
    typeUrgentPrayer: '🚨 Urgent Prayer',
    typeMessage: '✉️ Message',
    typeSystem: 'System Notice',
    viewAction: 'View',
    deleteAction: 'Delete',

    installGuideTitle: '📱 Smartphone Web App & Push Notification Guide',
    installGuideDesc: 'Install AAMEN directly on your smartphone home screen and receive real-time prayer & message notifications!',
    installGuideBadge: 'PWA App',
    installTabAndroid: 'Android (Galaxy/Chrome)',
    installTabIos: 'iPhone (iOS/Safari)',
    installTabPush: 'Notification Setup',

    androidStepTitle: 'Android Installation Steps (3 Steps)',
    androidStep1Title: 'Tap Install Button',
    androidStep1Desc: 'Tap the [Install ⬇️] icon in the address bar or open the browser menu (⋮).',
    androidStep2Title: 'Add to Home Screen',
    androidStep2Desc: 'Select [Add to Home screen] or [Install App] and confirm.',
    androidStep3Title: 'Launch like an App!',
    androidStep3Desc: 'Tap the created AAMEN icon on your home screen to enjoy a standalone full-screen experience.',
    samsungTip: 'Samsung Internet tip: Tap the bottom menu (≡) → [Add page to] → [Home screen].',

    iosStepTitle: 'iPhone/iPad (Safari) Installation Steps (3 Steps)',
    iosStep1Title: 'Tap Safari Share Button',
    iosStep1Desc: 'Open in Safari and tap the Share button (square with arrow ⬆️) at the bottom center.',
    iosStep2Title: 'Add to Home Screen',
    iosStep2Desc: 'Scroll down the menu, tap [Add to Home Screen ➕], and tap [Add] on the top right.',
    iosStep3Title: 'Launch from Home Screen',
    iosStep3Desc: 'Tap the newly created AAMEN icon on your iPhone home screen to open the app.',
    iosNoticeTitle: '⚠️ Important Notice for iPhone Users',
    iosNoticeDesc: 'Apple supports web push on iOS 16.4+. You must launch the app from the Home Screen icon to enable push notifications.',

    pushStepTitle: 'Push Notification Activation & Troubleshooting',
    pushStep1Title: 'Step 1: Click Enable & Allow',
    pushStep1Desc: 'Click the [Enable Push] button below and select [Allow] when prompted by your browser.',
    pushStep2Title: 'Step 2: Test Notification',
    pushStep2Desc: 'Click the [Test Push] button to verify that a notification alert appears on your device.',
    pushFaqTitle: 'Q. Allowed but not receiving notifications?',
    pushFaqDesc: "Check your phone's Settings → Notifications → Browser (or AAMEN) to ensure notifications are allowed.",
    pushEnableBtn: 'Enable Notifications Now',
    pushTestBtn: '🔔 Test Push Notification',

    telegramIdSub: '* Enter your numeric Telegram Chat ID',
    telegramBotNoticeBadge: '💡 Start Bot (Required to Receive Alerts)',
    telegramPolicyLabel: 'Telegram Policy',
    telegramPolicyDesc: 'Under Telegram policy, you must click [Start] in the bot chat first so the AAMEN bot can deliver messages to you.',
    telegramOpenBotBtn: '👉 Open @aamen13_bot and Click [Start]',
  },
  id: {
    historyTitle: 'Riwayat Notifikasi Real-time',
    historyDesc: 'Periksa dan kelola notifikasi terbaru untuk doa, komentar, dan pesan.',
    historyUnreadBadge: 'belum dibaca',
    historyRefresh: 'Segarkan',
    historyMarkAllRead: 'Tandai semua dibaca',
    historyDeleteAll: 'Hapus semua',
    historyTabAll: 'Semua',
    historyTabUnread: 'Belum dibaca',
    historyTabComment: 'Komentar',
    historyTabPrayer: 'Doa/Amin',
    historyTabMessage: 'Pesan',
    historyLoading: 'Memuat notifikasi...',
    historyEmptyTitle: 'Tidak ada notifikasi dalam kategori ini 🕊️',
    historyEmptyDesc: 'Aktivitas baru akan muncul di sini.',
    timeJustNow: 'Baru saja',
    timeMinAgo: (m: number) => `${m}m yang lalu`,
    timeHourAgo: (h: number) => `${h}j yang lalu`,
    timeDayAgo: (d: number) => `${d}h yang lalu`,
    typeComment: 'Komentar',
    typeAmen: 'Saya juga berdoa (Amin)',
    typeUrgentPrayer: '🚨 Doa Mendesak',
    typeMessage: '✉️ Pesan',
    typeSystem: 'Pemberitahuan Sistem',
    viewAction: 'Buka',
    deleteAction: 'Hapus',

    installGuideTitle: '📱 Panduan Pemasangan Web App Ponsel & Notifikasi Push AAMEN',
    installGuideDesc: 'Pasang aplikasi AAMEN di layar utama ponsel dalam 1 detik, dan terima pemberitahuan doa serta kabar terbaru!',
    installGuideBadge: 'Tanpa App Store',
    installTabAndroid: 'Android (Galaxy/Chrome)',
    installTabIos: 'iPhone (iOS/Safari)',
    installTabPush: 'Pengaturan Notifikasi',

    androidStepTitle: 'Langkah Pemasangan Android (3 Langkah)',
    androidStep1Title: 'Ketuk Tombol Pasang',
    androidStep1Desc: 'Ketuk ikon [Pasang ⬇️] di bilah alamat atau buka menu browser (⋮).',
    androidStep2Title: 'Tambahkan ke Layar Utama',
    androidStep2Desc: 'Pilih [Tambahkan ke Layar utama] atau [Pasang Aplikasi] dan konfirmasi.',
    androidStep3Title: 'Buka Seperti Aplikasi!',
    androidStep3Desc: 'Ketuk ikon AAMEN di layar utama untuk menikmati pengalaman layar penuh.',
    samsungTip: 'Tips Samsung Internet: Ketuk menu bawah (≡) → [Tambah halaman ke] → [Layar utama].',

    iosStepTitle: 'Langkah Pemasangan iPhone/iPad (Safari)',
    iosStep1Title: 'Ketuk Tombol Bagikan Safari',
    iosStep1Desc: 'Buka di Safari dan ketuk tombol Bagikan (kotak dengan panah ke atas ⬆️) di bagian bawah.',
    iosStep2Title: 'Tambahkan ke Layar Utama',
    iosStep2Desc: 'Gulir ke bawah, ketuk [Tambahkan ke Layar Utama ➕], lalu ketuk [Tambah] di kanan atas.',
    iosStep3Title: 'Buka dari Layar Utama',
    iosStep3Desc: 'Ketuk ikon AAMEN yang baru dibuat di layar utama iPhone Anda.',
    iosNoticeTitle: '⚠️ Pemberitahuan Penting untuk Pengguna iPhone',
    iosNoticeDesc: 'Apple mendukung push web di iOS 16.4+. Anda harus meluncurkan aplikasi dari ikon Layar Utama.',

    pushStepTitle: 'Aktivasi Notifikasi Push & Solusi Masalah',
    pushStep1Title: 'Langkah 1: Klik Aktifkan & Izinkan',
    pushStep1Desc: 'Klik tombol di bawah dan pilih [Izinkan] saat diminta oleh browser Anda.',
    pushStep2Title: 'Langkah 2: Uji Notifikasi',
    pushStep2Desc: 'Klik tombol [Uji Notifikasi] untuk memastikan peringatan muncul di perangkat Anda.',
    pushFaqTitle: 'T. Diizinkan tetapi tidak menerima notifikasi?',
    pushFaqDesc: 'Periksa Pengaturan → Notifikasi → Browser di ponsel Anda untuk memastikan notifikasi diizinkan.',
    pushEnableBtn: 'Aktifkan Izin Notifikasi Sekarang',
    pushTestBtn: '🔔 Uji Notifikasi Push',

    telegramIdSub: '* Masukkan Chat ID angka Telegram Anda',
    telegramBotNoticeBadge: '💡 Mulai Bot (Wajib untuk Terima Pesan)',
    telegramPolicyLabel: 'Kebijakan Telegram',
    telegramPolicyDesc: 'Sesuai kebijakan Telegram, Anda harus menekan [Mulai (Start)] di chat bot terlebih dahulu agar bot AAMEN dapat mengirimkan pesan kepada Anda.',
    telegramOpenBotBtn: '👉 Buka @aamen13_bot dan Klik [Mulai (Start)]',
  },
  vi: {
    historyTitle: 'Lịch sử thông báo thời gian thực',
    historyDesc: 'Kiểm tra và quản lý các thông báo mới nhất về lời cầu nguyện, bình luận và tin nhắn.',
    historyUnreadBadge: 'chưa đọc',
    historyRefresh: 'Làm mới',
    historyMarkAllRead: 'Đánh dấu đã đọc',
    historyDeleteAll: 'Xóa tất cả',
    historyTabAll: 'Tất cả',
    historyTabUnread: 'Chưa đọc',
    historyTabComment: 'Bình luận',
    historyTabPrayer: 'Cầu nguyện/Amen',
    historyTabMessage: 'Tin nhắn',
    historyLoading: 'Đang tải thông báo...',
    historyEmptyTitle: 'Không có thông báo nào trong mục này 🕊️',
    historyEmptyDesc: 'Các hoạt động mới sẽ xuất hiện ở đây.',
    timeJustNow: 'Vừa xong',
    timeMinAgo: (m: number) => `${m} phút trước`,
    timeHourAgo: (h: number) => `${h} giờ trước`,
    timeDayAgo: (d: number) => `${d} ngày trước`,
    typeComment: 'Bình luận',
    typeAmen: 'Tôi cũng hiệp ý cầu nguyện (Amen)',
    typeUrgentPrayer: '🚨 Cầu nguyện khẩn cấp',
    typeMessage: '✉️ Tin nhắn',
    typeSystem: 'Thông báo hệ thống',
    viewAction: 'Xem',
    deleteAction: 'Xóa',

    installGuideTitle: '📱 Hướng dẫn cài đặt Web App điện thoại & Thông báo Push AAMEN',
    installGuideDesc: 'Thêm ứng dụng AAMEN vào màn hình chính trong 1 giây để nhận thông báo trả lời cầu nguyện và tin mới nhất!',
    installGuideBadge: 'Không cần App Store',
    installTabAndroid: 'Android (Galaxy/Chrome)',
    installTabIos: 'iPhone (iOS/Safari)',
    installTabPush: 'Bật thông báo & Khắc phục',

    androidStepTitle: 'Các bước cài đặt Android (3 bước)',
    androidStep1Title: 'Chạm vào nút Cài đặt',
    androidStep1Desc: 'Nhấn vào biểu tượng [Cài đặt ⬇️] trên thanh địa chỉ hoặc mở menu (⋮).',
    androidStep2Title: 'Thêm vào màn hình chính',
    androidStep2Desc: 'Chọn [Thêm vào màn hình chính] hoặc [Cài đặt ứng dụng] và xác nhận.',
    androidStep3Title: 'Mở như ứng dụng!',
    androidStep3Desc: 'Chạm vào biểu tượng AAMEN trên màn hình chính để trải nghiệm toàn màn hình.',
    samsungTip: 'Mẹo Samsung Internet: Chạm menu dưới (≡) → [Thêm trang vào] → [Màn hình chính].',

    iosStepTitle: 'Các bước cài đặt iPhone/iPad (Safari)',
    iosStep1Title: 'Chạm vào nút Chia sẻ của Safari',
    iosStep1Desc: 'Mở bằng Safari và chạm vào biểu tượng Chia sẻ (ô vuông có mũi tên ⬆️) ở giữa phía dưới.',
    iosStep2Title: 'Thêm vào màn hình chính',
    iosStep2Desc: 'Cuộn xuống, chạm [Thêm vào màn hình chính ➕], rồi chạm [Thêm] ở góc trên bên phải.',
    iosStep3Title: 'Mở từ màn hình chính',
    iosStep3Desc: 'Chạm vào biểu tượng AAMEN đã tạo trên màn hình chính để mở ứng dụng.',
    iosNoticeTitle: '⚠️ Lưu ý quan trọng cho người dùng iPhone',
    iosNoticeDesc: 'Apple hỗ trợ push web từ iOS 16.4+. Bạn phải mở ứng dụng từ biểu tượng Màn hình chính.',

    pushStepTitle: 'Kích hoạt thông báo Push & Khắc phục sự cố',
    pushStep1Title: 'Bước 1: Nhấn Bật & Cho phép',
    pushStep1Desc: 'Nhấn nút bên dưới và chọn [Cho phép (Allow)] khi trình duyệt hỏi.',
    pushStep2Title: 'Bước 2: Thử nghiệm thông báo',
    pushStep2Desc: 'Nhấn nút [Thử nghiệm] để kiểm tra thông báo có xuất hiện trên thiết bị không.',
    pushFaqTitle: 'Hỏi: Đã cho phép nhưng không nhận được thông báo?',
    pushFaqDesc: 'Vào Cài đặt → Thông báo → Trình duyệt trên điện thoại để đảm bảo quyền thông báo đã được bật.',
    pushEnableBtn: 'Bật quyền thông báo ngay',
    pushTestBtn: '🔔 Gửi thông báo thử nghiệm',

    telegramIdSub: '* Nhập số Chat ID Telegram của bạn',
    telegramBotNoticeBadge: '💡 Khởi động Bot (Bắt buộc để nhận tin)',
    telegramPolicyLabel: 'Chính sách Telegram',
    telegramPolicyDesc: 'Theo chính sách Telegram, bạn phải nhấn [Bắt đầu (Start)] trong hộp thoại bot trước để bot AAMEN có thể gửi tin nhắn cho bạn.',
    telegramOpenBotBtn: '👉 Mở @aamen13_bot và bấm [Bắt đầu (Start)]',
  },
  tl: {
    historyTitle: 'Mga Real-time na Notipikasyon',
    historyDesc: 'Suriin at pamahalaan ang pinakabagong mga abiso para sa mga panalangin, komento, at mensahe.',
    historyUnreadBadge: 'hindi pa nababasa',
    historyRefresh: 'I-refresh',
    historyMarkAllRead: 'Markahan lahat bilang nabasa',
    historyDeleteAll: 'Tanggalin lahat',
    historyTabAll: 'Lahat',
    historyTabUnread: 'Hindi pa nababasa',
    historyTabComment: 'Mga Komento',
    historyTabPrayer: 'Panalangin/Amen',
    historyTabMessage: 'Mensahe',
    historyLoading: 'Naglo-load ng mga abiso...',
    historyEmptyTitle: 'Walang mga abiso sa kategoryang ito 🕊️',
    historyEmptyDesc: 'Lalabas dito ang mga bagong aktibidad.',
    timeJustNow: 'Kani-kanina lang',
    timeMinAgo: (m: number) => `${m}m ang nakalipas`,
    timeHourAgo: (h: number) => `${h}h ang nakalipas`,
    timeDayAgo: (d: number) => `${d}d ang nakalipas`,
    typeComment: 'Komento',
    typeAmen: 'Mananalangin din ako (Amen)',
    typeUrgentPrayer: '🚨 Agarang Panalangin',
    typeMessage: '✉️ Mensahe',
    typeSystem: 'Abiso ng Sistema',
    viewAction: 'Tingnan',
    deleteAction: 'Tanggalin',

    installGuideTitle: '📱 Gabay sa Pag-install ng Smartphone Web App at Push Notification ng AAMEN',
    installGuideDesc: 'I-install ang AAMEN app sa home screen ng iyong telepono sa loob ng 1 segundo, at makatanggap ng mga update!',
    installGuideBadge: 'Hindi kailangan ng App Store',
    installTabAndroid: 'Android (Galaxy/Chrome)',
    installTabIos: 'iPhone (iOS/Safari)',
    installTabPush: 'I-on ang Notipikasyon at Ayusin',

    androidStepTitle: 'Mga Hakbang sa Pag-install sa Android (3 Hakbang)',
    androidStep1Title: 'Pindutin ang Install Button',
    androidStep1Desc: 'Pindutin ang [Install ⬇️] icon sa address bar o buksan ang menu (⋮).',
    androidStep2Title: 'Idagdag sa Home Screen',
    androidStep2Desc: 'Piliin ang [Add to Home screen] o [Install App] at kumpirmahin.',
    androidStep3Title: 'Buksan Tulad ng isang App!',
    androidStep3Desc: 'Pindutin ang nilikhang AAMEN icon sa home screen para sa full-screen na karanasan.',
    samsungTip: 'Tip sa Samsung Internet: Pindutin ang menu sa ibaba (≡) → [Add page to] → [Home screen].',

    iosStepTitle: 'Mga Hakbang sa Pag-install sa iPhone/iPad (Safari)',
    iosStep1Title: 'Pindutin ang Share Button ng Safari',
    iosStep1Desc: 'Buksan sa Safari at pindutin ang Share button (parisukat na may pataas na arrow ⬆️) sa ibaba.',
    iosStep2Title: 'Idagdag sa Home Screen',
    iosStep2Desc: 'Mag-scroll pababa, pindutin ang [Add to Home Screen ➕], at pindutin ang [Add] sa kanang itaas.',
    iosStep3Title: 'Buksan mula sa Home Screen',
    iosStep3Desc: 'Pindutin ang AAMEN icon sa home screen ng iyong iPhone upang buksan ang app.',
    iosNoticeTitle: '⚠️ Mahalagang Paalala para sa mga Gumagamit ng iPhone',
    iosNoticeDesc: 'Sinusuportahan ng Apple ang web push sa iOS 16.4+. Kailangang buksan ang app mula sa icon ng Home Screen.',

    pushStepTitle: 'Pag-activate ng Push Notification at Pag-aayos',
    pushStep1Title: 'Hakbang 1: I-click ang Enable & Allow',
    pushStep1Desc: 'I-click ang button sa ibaba at piliin ang [Allow] kapag hiniling ng browser.',
    pushStep2Title: 'Hakbang 2: Subukan ang Notipikasyon',
    pushStep2Desc: 'I-click ang button upang subukan kung lumalabas ang alerto sa iyong device.',
    pushFaqTitle: 'T. Pinayagan ngunit hindi tumatanggap ng mga abiso?',
    pushFaqDesc: 'Suriin ang Mga Setting → Mga Notipikasyon → Browser upang matiyak na pinapayagan ang mga ito.',
    pushEnableBtn: 'I-on ang Pahintulot sa Notipikasyon Ngayon',
    pushTestBtn: '🔔 Magpadala ng Test Notification',

    telegramIdSub: '* Ilagay ang iyong numeric Telegram Chat ID',
    telegramBotNoticeBadge: '💡 Simulan ang Bot (Kailangan upang Makatanggap)',
    telegramPolicyLabel: 'Patakaran ng Telegram',
    telegramPolicyDesc: 'Ayon sa patakaran ng Telegram, dapat mong pindutin ang [Simulan (Start)] sa chat ng bot muna upang makapagpadala ang AAMEN bot ng mga alerto.',
    telegramOpenBotBtn: '👉 Buksan ang @aamen13_bot at Pindutin ang [Simulan (Start)]',
  },
  th: {
    historyTitle: 'ประวัติการแจ้งเตือนแบบเรียลไทม์',
    historyDesc: 'ตรวจสอบและจัดการการแจ้งเตือนล่าสุดสำหรับคำอธิษฐาน ความคิดเห็น และข้อความ',
    historyUnreadBadge: 'ยังไม่ได้อ่าน',
    historyRefresh: 'รีเฟรช',
    historyMarkAllRead: 'ทำเครื่องหมายว่าอ่านแล้วทั้งหมด',
    historyDeleteAll: 'ลบทั้งหมด',
    historyTabAll: 'ทั้งหมด',
    historyTabUnread: 'ยังไม่ได้อ่าน',
    historyTabComment: 'ความคิดเห็น',
    historyTabPrayer: 'อธิษฐาน/อาเมน',
    historyTabMessage: 'ข้อความ',
    historyLoading: 'กำลังโหลดการแจ้งเตือน...',
    historyEmptyTitle: 'ไม่มีการแจ้งเตือนในหมวดหมู่นี้ 🕊️',
    historyEmptyDesc: 'กิจกรรมใหม่จะปรากฏที่นี่',
    timeJustNow: 'เมื่อสักครู่',
    timeMinAgo: (m: number) => `${m} นาทีที่แล้ว`,
    timeHourAgo: (h: number) => `${h} ชม. ที่แล้ว`,
    timeDayAgo: (d: number) => `${d} วันที่แล้ว`,
    typeComment: 'ความคิดเห็น',
    typeAmen: 'ร่วมอธิษฐาน (อาเมน)',
    typeUrgentPrayer: '🚨 คำอธิษฐานเร่งด่วน',
    typeMessage: '✉️ ข้อความ',
    typeSystem: 'ประกาศจากระบบ',
    viewAction: 'ดู',
    deleteAction: 'ลบ',

    installGuideTitle: '📱 คู่มือติดตั้งเว็บแอปและแจ้งเตือนพุชของ AAMEN',
    installGuideDesc: 'ติดตั้งแอป AAMEN บนหน้าจอหลักของสมาร์ทโฟนได้ใน 1 วินาที และรับการแจ้งเตือนคำอธิษฐานและข่าวสารใหม่ๆ!',
    installGuideBadge: 'ไม่ต้องใช้ App Store',
    installTabAndroid: 'Android (Galaxy/Chrome)',
    installTabIos: 'iPhone (iOS/Safari)',
    installTabPush: 'ตั้งค่าการแจ้งเตือน',

    androidStepTitle: 'ขั้นตอนการติดตั้งบน Android (3 ขั้นตอน)',
    androidStep1Title: 'แตะปุ่มติดตั้งหรือเมนู',
    androidStep1Desc: 'แตะไอคอน [ติดตั้ง ⬇️] ในแถบที่อยู่ หรือเปิดเมนู (⋮)',
    androidStep2Title: 'เพิ่มไปยังหน้าจอหลัก',
    androidStep2Desc: 'เลือก [เพิ่มไปยังหน้าจอหลัก] หรือ [ติดตั้งแอป] แล้วยืนยัน',
    androidStep3Title: 'เปิดใช้งานเหมือนแอปจริง!',
    androidStep3Desc: 'แตะไอคอน AAMEN บนหน้าจอหลักเพื่อเพลิดเพลินกับประสบการณ์เต็มหน้าจอ',
    samsungTip: 'เคล็ดลับ Samsung Internet: แตะเมนูด้านล่าง (≡) → [เพิ่มหน้าไปยัง] → [หน้าจอหลัก]',

    iosStepTitle: 'ขั้นตอนการติดตั้งบน iPhone/iPad (Safari)',
    iosStep1Title: 'แตะปุ่มแชร์ของ Safari',
    iosStep1Desc: 'เปิดใน Safari และแตะปุ่มแชร์ (สี่เหลี่ยมที่มีลูกศรชี้ขึ้น ⬆️) ตรงกลางด้านล่าง',
    iosStep2Title: 'เพิ่มไปยังหน้าจอหลัก',
    iosStep2Desc: 'เลื่อนลงมา แตะ [เพิ่มไปยังหน้าจอหลัก ➕] แล้วแตะ [เพิ่ม] ที่มุมขวาบน',
    iosStep3Title: 'เปิดจากหน้าจอหลัก',
    iosStep3Desc: 'แตะไอคอน AAMEN บนหน้าจอหลักเพื่อเปิดแอป',
    iosNoticeTitle: '⚠️ ข้อควรระวังสำหรับผู้ใช้ iPhone',
    iosNoticeDesc: 'Apple รองรับเว็บพุชบน iOS 16.4+ โดยต้องเปิดใช้งานแอปจากไอคอนหน้าจอหลักเท่านั้น',

    pushStepTitle: 'การเปิดใช้งานการแจ้งเตือนพุชและวิธีแก้ปัญหา',
    pushStep1Title: 'ขั้นตอนที่ 1: คลิกเปิดใช้งานและอนุญาต',
    pushStep1Desc: 'คลิกปุ่มด้านล่างและเลือก [อนุญาต (Allow)] เมื่อเบราว์เซอร์แจ้งเตือน',
    pushStep2Title: 'ขั้นตอนที่ 2: ทดสอบการแจ้งเตือน',
    pushStep2Desc: 'คลิกปุ่ม [ทดสอบการแจ้งเตือน] เพื่อยืนยันว่าการแจ้งเตือนแสดงผลบนอุปกรณ์ของคุณ',
    pushFaqTitle: 'ถาม: อนุญาตแล้วแต่ไม่ได้รับการแจ้งเตือน?',
    pushFaqDesc: 'ตรวจสอบในการตั้งค่าโทรศัพท์ → การแจ้งเตือน → เบราว์เซอร์ เพื่อให้แน่ใจว่าได้รับอนุญาต',
    pushEnableBtn: 'เปิดการอนุญาตการแจ้งเตือนทันที',
    pushTestBtn: '🔔 ส่งการแจ้งเตือนทดสอบ',

    telegramIdSub: '* กรอกหมายเลข Telegram Chat ID ของคุณ',
    telegramBotNoticeBadge: '💡 เริ่มบอท (จำเป็นสำหรับการรับการแจ้งเตือน)',
    telegramPolicyLabel: 'นโยบายความปลอดภัย Telegram',
    telegramPolicyDesc: 'ตามนโยบาย Telegram คุณต้องกด [เริ่ม (Start)] ในแชทของบอทก่อน เพื่อให้บอท AAMEN สามารถส่งการแจ้งเตือนถึงคุณได้',
    telegramOpenBotBtn: '👉 เปิด @aamen13_bot และกด [เริ่ม (Start)]',
  },
}

export function getNotificationGuideTexts(locale: string): NotificationGuideTexts {
  const clean = (locale || 'ko').toLowerCase()
  if (NOTIFICATION_GUIDE_TEXTS[locale]) return NOTIFICATION_GUIDE_TEXTS[locale]
  if (clean.startsWith('zh')) {
    return clean.includes('hk') ? NOTIFICATION_GUIDE_TEXTS['zh-HK'] : NOTIFICATION_GUIDE_TEXTS['zh-TW']
  }
  const prefix = clean.split('-')[0]
  if (NOTIFICATION_GUIDE_TEXTS[prefix]) return NOTIFICATION_GUIDE_TEXTS[prefix]
  return NOTIFICATION_GUIDE_TEXTS.en || NOTIFICATION_GUIDE_TEXTS.ko
}
