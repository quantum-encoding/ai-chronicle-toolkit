CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -O2
LDFLAGS = -lm

PREFIX ?= /usr/local
BINDIR = $(PREFIX)/bin

TARGET = aiquery
MD2JSON = md2json
OBJS = json_parser.o query_engine.o query_cli.o
MD_OBJS = md_parser.o md2json.o

all: $(TARGET) $(MD2JSON)

$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $(TARGET) $(LDFLAGS)

json_parser.o: json_parser.c json_parser.h
	$(CC) $(CFLAGS) -c json_parser.c -o json_parser.o

query_engine.o: query_engine.c query_engine.h json_parser.h
	$(CC) $(CFLAGS) -c query_engine.c -o query_engine.o

query_cli.o: query_cli.c query_engine.h json_parser.h
	$(CC) $(CFLAGS) -c query_cli.c -o query_cli.o

$(MD2JSON): $(MD_OBJS)
	$(CC) $(MD_OBJS) -o $(MD2JSON) $(LDFLAGS)

md_parser.o: md_parser.c md_parser.h
	$(CC) $(CFLAGS) -c md_parser.c -o md_parser.o

md2json.o: md2json.c md_parser.h
	$(CC) $(CFLAGS) -c md2json.c -o md2json.o

clean:
	rm -f $(TARGET) $(MD2JSON) $(OBJS) $(MD_OBJS)

install: $(TARGET) $(MD2JSON)
	install -d $(BINDIR)
	install -m 755 $(TARGET) $(BINDIR)/$(TARGET)
	install -m 755 $(MD2JSON) $(BINDIR)/$(MD2JSON)

uninstall:
	rm -f $(BINDIR)/$(TARGET)
	rm -f $(BINDIR)/$(MD2JSON)

.PHONY: all clean install uninstall