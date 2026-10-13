import json

with open(r'C:\Dev\AAMEN\parsed_en_lessons.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for slug, item in d.items():
    print(f"=== {slug} ({item['themeNum']}: {item['themeTitle']}) ===")
    print("Quote:", item['quote'][:80], "...")
    print("Overall Obj:", item['overallObjective'][:80], "...")
    print("Session Obj:", item['sessionObjective'][:80], "...")
    print("Materials count:", len(item['materials']))
    print("Readings count:", len(item['readings']))
    print("Timeline steps:", len(item['timeline']))
    for step in item['timeline']:
        print(f"  - {step['title']} ({step['duration']}), items: {len(step['items'])}")
