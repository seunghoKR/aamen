import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for loc in ['mn', 'vi', 'ja', 'th', 'km']:
    god = d[loc]['god']['meta']
    print(f"=== {loc.upper()} GOD ===")
    print("Title:", god['title'])
    print("Quote:", god['quote'][:60] + "...")
    print("Overall Obj:", god['overallObjective'][:60] + "...")
    print("Session Obj:", god['sessionObjective'][:60] + "...")
    print("Timeline Step 1:", god['timeline'][0]['duration'], "|", god['timeline'][0]['title'])
    print("  Item 1:", god['timeline'][0]['items'][0][:60] + "...")
