import os

file_path = r'c:\Users\LENOVO\Desktop\fraud-detection-system\frontend\src\index.css'

# I'll try to find a known good state or just clean it up.
# Since I don't have a backup, I'll have to rely on the fact that 
# every single '}' was turned into '}\n\n.listening-pulse...'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# This is what I injected many times:
bad_block = """
.listening-pulse {
  animation: listening-glow 1.5s infinite !important;
  background: rgba(239, 68, 68, 0.1) !important;
  border-radius: 50% !important;
}

@keyframes listening-glow {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
"""

# I need to be careful. Every '}' followed by this block should have the block removed.
# Actually, I'll just remove all instances of the blocks.

# Normalize line endings for easier regex
content = content.replace('\r\n', '\n')

# This regex matches the pulse block and the keyframes block
pattern = r'\n\.listening-pulse\s*\{[^}]*\}\n\n@keyframes\s+listening-glow\s*\{[^{}]*\{[^{}]*\}[^{}]*\{[^{}]*\}[^{}]*\{[^{}]*\}[^{}]*\}'

import re
clean_content = re.sub(pattern, '', content)

# Also check for partials or multiple newlines
clean_content = re.sub(r'\n+', '\n', clean_content) # This might be too aggressive but safe for CSS if I restore basic structure.
# Actually, let's just remove the exact bad string.
exact_bad = """
.listening-pulse {
  animation: listening-glow 1.5s infinite !important;
  background: rgba(239, 68, 68, 0.1) !important;
  border-radius: 50% !important;
}

@keyframes listening-glow {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
"""
clean_content = content.replace(exact_bad, "")

# Now I'll add it ONCE at the very end.
final_css = clean_content.strip() + "\n\n" + exact_bad.strip() + "\n"

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(final_css)

print("CSS cleaned up.")
