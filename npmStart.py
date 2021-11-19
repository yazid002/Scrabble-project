import os
import shlex
import subprocess
from pathlib import Path

folders = ['client', 'server']
print(folders)
for folder in folders:
    os.chdir(folder)
    cmd = 'npm start'
    cmds = cmd.split(cmd)
    subprocess.Popen(["powershell", "npm", "start"],start_new_session=True)
    os.chdir(Path(Path.cwd()).parent)

while(1):
    input()
