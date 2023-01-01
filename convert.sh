ffmpeg -y -i ~/Videos/s-process.webm -vf palettegen ~/Videos/palette.png
ffmpeg -y -i ~/Videos/s-process.webm -i ~/Videos/palette.png -filter_complex paletteuse -r 10 ~/Videos/s-process.gif
mv ~/Videos/s-process.* public
