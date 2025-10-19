import os


js_files_paths = []
for path, folders, filenames in os.walk("static/"):
    for filename in filenames:
        if filename.endswith(".js"):
            js_file_path = os.path.join(path, filename)
            js_files_paths.append(js_file_path)


to_delete = "http://127.0.0.1:5050"

for js_file_path in js_files_paths:
    with open(js_file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if to_delete in content:
        content = content.replace(to_delete, "")
        with open(js_file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Updated: {js_file_path}\n   → Removed '{to_delete}' from paths.\n")