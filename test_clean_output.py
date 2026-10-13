import urllib.request

url = 'http://localhost:3000/en/convictions/god'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

if 'God is known' in html:
    print('SUCCESS: Found "God is known" cleanly without single quote bug!')
elif "'G'o'd'" in html:
    print('WARNING: Still found quotes bug!')
else:
    print('Response length:', len(html))
