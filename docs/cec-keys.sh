#!/bin/bash

#
# this is a script to map the cec inputs to
# commonly used shortcuts on streaming sites
# specifically for raspberry pis with cec-utils
#
# requires cec-client installed
# apt install cec-client
#
# make it executable
# chmod +x cec-keys.sh
#
# run it in the background or whatever
# ./cec-keys.sh &

cec-client -d 1 -t p | while read -r line; do
  case "$line" in
    *"key pressed: up"*) xdotool key Up ;;
    *"key pressed: down"*) xdotool key Down ;;
    *"key pressed: left"*) xdotool key Left ;;
    *"key pressed: right"*) xdotool key Right ;;
    *"key pressed: select"*) xdotool key Return ;;
    *"key pressed: back"*) xdotool key BackSpace ;;
    *"key pressed: play"*) xdotool key k ;;
    *"key pressed: pause"*) xdotool key k ;;
    *"key pressed: exit"*) xdotool key Escape ;;
    *"key pressed: root menu"*) xdotool key F11 ;;  # toggle fullscreen
  esac
done