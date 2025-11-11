import pathlib, re
files = ["sharestayfrontend/src/pages/Rooms.tsx", "sharestayfrontend/src/pages/Home.tsx"]
for file in files:
    text = pathlib.Path(file).read_text(encoding='utf-8')
    matches = re.findall(r'"([^"\n]*\?[^\n"]*)"', text)
    print(file)
    for item in sorted(set(matches)):
        print(' ', repr(item))
