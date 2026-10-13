import json, re

with open(r'C:\Dev\AAMEN\extracted_lessons.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# File to slug mapping
file_slug_map = {
    'Lesson Plan #1 - God.docx': ('god', 'Theme 1', 'God'),
    'Lesson Plan #2 - Jesus.docx': ('jesus', 'Theme 2', 'Jesus'),
    'Lesson Plan #3 - Holy Spirit and Church.docx': ('spirit', 'Theme 3', 'Holy Spirit'),
    'Lesson Plan #4 - Bible.docx': ('church', 'Theme 4', 'The Bible'),
    'Lesson Plan #5 - Peacemaker.docx': ('peace', 'Theme 5', 'Peace, Justice, and Reconciliation'),
    'Lesson Plan #6 - Worship.docx': ('community', 'Theme 6', 'Worship'),
    'Lesson Plan #7 - Global Family.docx': ('unity', 'Theme 7', 'Global Family'),
}

parsed_lessons = {}

for fname, lines in raw_data.items():
    slug, theme_num, theme_title = file_slug_map[fname]
    print(f"Processing {fname} -> {slug} ({theme_num}: {theme_title})")
    
    quote = ""
    overall_obj = ""
    session_obj = ""
    materials = []
    readings = []
    timeline = []
    
    current_section = None
    current_step = None
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Check Quote (usually line 1)
        if i == 1 or (line.startswith('“') or line.startswith('"')) and not quote:
            quote = line.strip('“”" \t\r\n')
            i += 1
            continue
            
        # Overall Objective
        if line.startswith('Overall Objective:'):
            overall_obj = line.replace('Overall Objective:', '').strip()
            i += 1
            continue
            
        # Session Objective
        if line.startswith('One-Hour Session Objective:'):
            session_obj = line.replace('One-Hour Session Objective:', '').strip()
            i += 1
            continue
            
        # Materials marker
        if line.lower() == 'materials:':
            current_section = 'materials'
            i += 1
            continue
            
        # Required / Readings marker
        if line.lower().startswith('required:'):
            current_section = 'readings'
            i += 1
            continue
            
        # Lesson Plan marker
        if 'lesson plan (' in line.lower() or 'lesson plan:' in line.lower():
            current_section = 'lesson_plan'
            i += 1
            continue
            
        if current_section == 'materials':
            if line.lower().startswith('required:') or 'lesson plan' in line.lower():
                continue # will be caught in next loop check
            materials.append(line)
            i += 1
            continue
            
        if current_section == 'readings':
            if 'lesson plan' in line.lower():
                continue
            readings.append(line)
            i += 1
            continue
            
        if current_section == 'lesson_plan':
            # Check if this line is a step title, e.g. "Welcome and Opening Reflection (5 minutes)"
            step_match = re.search(r'^(.*?)\s*\((\d+\s*minutes?)\)$', line, re.IGNORECASE)
            if step_match:
                step_title = step_match.group(1).strip()
                step_duration = step_match.group(2).strip()
                current_step = {
                    'title': step_title,
                    'duration': step_duration,
                    'items': []
                }
                timeline.append(current_step)
            elif current_step is not None:
                current_step['items'].append(line)
            else:
                # header before first step
                pass
            i += 1
            continue
            
        i += 1
        
    parsed_lessons[slug] = {
        'slug': slug,
        'themeNum': theme_num,
        'themeTitle': theme_title,
        'quote': quote,
        'overallObjective': overall_obj,
        'sessionObjective': session_obj,
        'materials': materials,
        'readings': readings,
        'timeline': timeline
    }

with open(r'C:\Dev\AAMEN\parsed_en_lessons.json', 'w', encoding='utf-8') as out:
    json.dump(parsed_lessons, out, ensure_ascii=False, indent=2)

print("Parsed successfully and saved to parsed_en_lessons.json!")
