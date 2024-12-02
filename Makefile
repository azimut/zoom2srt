FRONT := hsl(24,10%,5%)
BACK  := hsl(24,100%,98%)
ICONS := public/dark-mode-favicon.ico public/dark-mode-apple-touch-icon.png public/light-mode-favicon.ico public/light-mode-apple-touch-icon.png

.PHONY: all
all: $(ICONS)

$(ICONS):
	convert -size 1024x1024 \
		xc:none \
		-undercolor none \
		-font FreeSerif-Bold-Italic -pointsize 970 \
		-draw "fill $(FRONT) roundrectangle 0,0,1024,1024,100,100" \
		-fill '$(BACK)' -annotate +220+840 'Z' \
		\( -clone 0 -resize 180x180 -write public/dark-mode-apple-touch-icon.png \) \
		\( -clone 0 -define icon:auto-resize=64,48,32,16 -write public/dark-mode-favicon.ico \) \
		null:
	convert -size 1024x1024 \
		xc:none \
		-undercolor none \
		-font FreeSerif-Bold-Italic -pointsize 970 \
		-draw "fill $(BACK) roundrectangle 0,0,1024,1024,100,100" \
		-fill '$(FRONT)' -annotate +220+840 'Z' \
		\( -clone 0 -resize 180x180 -write public/light-mode-apple-touch-icon.png \) \
		\( -clone 0 -define icon:auto-resize=64,48,32,16 -write public/light-mode-favicon.ico \) \
		null:

.PHONY: clean
clean:; rm -vf $(ICONS)
