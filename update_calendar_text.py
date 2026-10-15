import re

filepath = r'C:\Dev\AAMEN\renewal\frontend\src\data\networkTranslations.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace ko schedulePage
ko_old = """    schedulePage: {
      badge: '공식 캘린더 & 사역 일정',
      title: 'AAMEN 월간 주요 일정',
      desc: '13개국 연합 컨퍼런스, 정기 온라인 기도회, 지도자 워크숍 등 아시아 전역의 사역 일정을 확인하고 내 구글 캘린더에 연동하세요.',
      googleCalendarTitle: '구글 캘린더 (Google Calendar)',
      googleCalendarSubtitle: '월간 일정 기준으로 실시간 동기화되는 AAMEN 공식 캘린더입니다.',
      openGoogleCalendarBtn: '구글 캘린더에서 크게 보기',
      addToGoogleCalendarBtn: '내 구글 캘린더에 추가',
      shareWhatsappBtn: 'WhatsApp으로 일정 공유',
      allMonths: '연간 전체',
      monthSuffix: '월',
      locationLabel: '장소/방식',
      timeLabel: '시간',
      organizerLabel: '주관',
      emptyMonth: '해당 월에 예정된 공식 일정이 없습니다.',
      backToNetwork: '네트워크 메인으로 돌아가기',
    },"""

ko_new = """    schedulePage: {
      badge: '공식 캘린더 & 사역 일정',
      title: 'AAMEN 월간 주요 일정',
      desc: '13개국 연합 컨퍼런스, 정기 온라인 기도회, 지도자 워크숍 등 아시아 전역의 주요 사역 일정을 한눈에 확인하세요.',
      googleCalendarTitle: 'AAMEN 공식 캘린더',
      googleCalendarSubtitle: '월간 일정 기준으로 실시간 동기화되는 AAMEN 공식 사역 캘린더입니다.',
      openGoogleCalendarBtn: '새 창에서 전체 보기',
      addToGoogleCalendarBtn: '내 캘린더에 일정 추가',
      shareWhatsappBtn: 'WhatsApp으로 일정 공유',
      allMonths: '연간 전체',
      monthSuffix: '월',
      locationLabel: '장소/방식',
      timeLabel: '시간',
      organizerLabel: '주관',
      emptyMonth: '해당 월에 예정된 공식 일정이 없습니다.',
      backToNetwork: '네트워크 메인으로 돌아가기',
    },"""

if ko_old in content:
    content = content.replace(ko_old, ko_new)

# Replace en schedulePage
en_old = """    schedulePage: {
      badge: 'OFFICIAL CALENDAR & MINISTRY SCHEDULE',
      title: 'AAMEN Monthly Schedule',
      desc: 'Discover Asian regional conferences, regular online prayer meetings, and peace leadership workshops, and sync them with your Google Calendar.',
      googleCalendarTitle: 'Google Calendar',
      googleCalendarSubtitle: 'Official AAMEN calendar synced in real-time on a monthly basis.',
      openGoogleCalendarBtn: 'Open in Google Calendar',
      addToGoogleCalendarBtn: 'Add to Google Calendar',
      shareWhatsappBtn: 'Share via WhatsApp',
      allMonths: 'All Year',
      monthSuffix: '',
      locationLabel: 'Location',
      timeLabel: 'Time',
      organizerLabel: 'Organizer',
      emptyMonth: 'No official events scheduled for this month.',
      backToNetwork: 'Back to Network Main',
    },"""

en_new = """    schedulePage: {
      badge: 'OFFICIAL CALENDAR & MINISTRY SCHEDULE',
      title: 'AAMEN Monthly Schedule',
      desc: 'Discover Asian regional conferences, regular online prayer meetings, and peace leadership workshops across all 13 nations.',
      googleCalendarTitle: 'AAMEN Official Calendar',
      googleCalendarSubtitle: 'Official AAMEN ministry calendar synced in real-time on a monthly basis.',
      openGoogleCalendarBtn: 'Open Full Calendar',
      addToGoogleCalendarBtn: 'Add to My Calendar',
      shareWhatsappBtn: 'Share via WhatsApp',
      allMonths: 'All Year',
      monthSuffix: '',
      locationLabel: 'Location',
      timeLabel: 'Time',
      organizerLabel: 'Organizer',
      emptyMonth: 'No official events scheduled for this month.',
      backToNetwork: 'Back to Network Main',
    },"""

if en_old in content:
    content = content.replace(en_old, en_new)

# Replace other languages googleCalendarTitle
content = re.sub(r"googleCalendarTitle: 'Google [^']+'", "googleCalendarTitle: 'AAMEN Official Calendar'", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated networkTranslations.ts successfully!')
