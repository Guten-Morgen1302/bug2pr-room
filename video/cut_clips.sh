#!/usr/bin/env bash
# Cuts the two raw recordings (video/raw, not in git) into the sped-up clips the video uses, and writes src/clips.json with each clip's duration.
# Real footage is only cropped, sped up (setpts) and blurred where private; nothing is re-enacted. VS Code stretches are never used.
#   name  source  start  end  speed  kind
set -euo pipefail
cd "$(dirname "$0")"
PC="raw/pc-screen.mkv"; PH="raw/phone-github.mp4"
mkdir -p public/clips
# browser content: drop the browser chrome (tabs, bookmarks) and the left strip of other Discord servers
BROWSER="crop=1222:600:58:116,setpts=PTS/%s,fps=30,scale=1528:750"
CONSOLE="setpts=PTS/%s,fps=30,scale=1500:844"
PHONE="setpts=PTS/%s,fps=30,scale=480:1072"
cut() { # name src start end speed vf-template
  local vf; vf=$(printf "$6" "$5")
  ffmpeg -v error -y -ss "$3" -to "$4" -i "$2" -an -vf "$vf" -c:v libx264 -preset veryfast -crf 17 -pix_fmt yuv420p "public/clips/$1.mp4"
}
cut c01_repo    $PC 0:04    0:10.5  1.1 "$BROWSER"
cut c02a_tpl    $PC 0:29.6  0:32.6  1.1 "$CONSOLE"
cut c02u_use    $PC 0:40    0:44    1.4 "$CONSOLE"
cut c02b_create $PC 0:58.2  1:02.4  1.2 "$CONSOLE"
cut c03_join    $PC 2:26    2:50    4   "$BROWSER"
cut c04a_bug    $PC 3:26    3:40    2   "$BROWSER"
cut c04b_repro  $PC 4:38    5:20    6   "$BROWSER"
cut c05_rule    $PC 5:46    5:56    1.6 "$BROWSER"
cut c06_patch   $PC 10:52   11:28   4   "$BROWSER"
cut c07_reject  $PC 12:09   12:22.2 1.2 "$BROWSER"
cut c08a_fix    $PC 13:38   13:58   4   "$BROWSER"
cut c08b_422    $PC 14:09   14:21   2.4 "$BROWSER"
cut c09_accept  $PC 17:40   17:52   1.7 "$BROWSER"
cut c10a_softy  $PC 18:54   19:12   2.5 "$BROWSER"
cut c10b_creator $PC 20:00  20:09   1.5 "$BROWSER"
cut c11_merge   $PC 20:22   20:52   3   "$BROWSER"
cut c12_closed  $PC 23:14   23:34   3   "$BROWSER"
cut c13_readme  $PC 23:51   24:00   1   "$BROWSER"
cut p1_profile  $PH 0:00.3  0:10.5  1.6 "$PHONE"
cut p2_email    $PH 0:16.6  0:21    2.5 "$PHONE"
# blur the machine name ("harshpatil13") in the Console task list (clip seconds: the whole clip)
ffmpeg -v error -y -i public/clips/c02b_create.mp4 -filter_complex \
  "[0:v]split[a][b];[b]crop=140:190:845:455,boxblur=14:3[bl];[a][bl]overlay=845:455" \
  -c:v libx264 -preset veryfast -crf 17 -pix_fmt yuv420p public/clips/c02b.tmp.mp4
mv public/clips/c02b.tmp.mp4 public/clips/c02b_create.mp4
# durations → src/clips.json
python - <<'PY'
import json, subprocess, glob, os
d = {}
for f in sorted(glob.glob("public/clips/*.mp4")):
    n = os.path.basename(f)[:-4]
    d[n] = round(float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f])), 3)
json.dump(d, open("src/clips.json","w"), indent=1)
print(d)
PY
