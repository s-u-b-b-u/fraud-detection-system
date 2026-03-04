import os
import re

file_path = r'c:\Users\LENOVO\Desktop\fraud-detection-system\frontend\src\index.css'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: .listening-pulse blocks
content = re.sub(r'\.\s*listening-pulse\s*\{[^{}]*\}', '', content, flags=re.DOTALL)

# Pattern 2: @keyframes listening-glow blocks
# This is trickier because of nested braces.
pattern = r'@\s*keyframes\s+listening-glow\s*\{[^{}]*\{[^{}]*\}[^{}]*\{[^{}]*\}[^{}]*\{[^{}]*\}[^{}]*\}'
content = re.sub(pattern, '', content, flags=re.DOTALL)

# Pattern 3: Any leftover empty rules or just extra newlines
content = re.sub(r'\n+', '\n', content)

# Final cleanup
final_css = content.strip() + """

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

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(final_css)

print("Final CSS Cleanup successful.")
