SRC = src
DST = dst
BIN = ./node_modules/.bin/
default: copyfiles
	$(BIN)webpack --watch

copyfiles:
	mkdir -p $(DST)
	cp $(SRC)/index.html $(DST)/index.html

clean:
	rm -r dst/
