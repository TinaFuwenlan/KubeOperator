GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
BASEPATH := $(shell pwd)
BUILDDIR=$(BASEPATH)/dist
GOGINDATA=go-bindata

KO_SERVER_NAME=ko-server
KO_CONFIG_DIR=etc/ko
KO_BIN_DIR=usr/local/bin
KO_DATA_DIR=usr/local/lib/ko


GOPROXY="https://goproxy.cn,direct"


build_server_linux:
#	GOOS=linux GOARCH=amd64  $(GOGINDATA) -o ./pkg/i18n/locales.go -pkg i18n ./locales/...
	GOOS=linux GOARCH=amd64  $(GOBUILD) -o $(BUILDDIR)/$(KO_BIN_DIR)/$(KO_SERVER_NAME) main.go
	mkdir -p $(BUILDDIR)/$(KO_CONFIG_DIR) && cp -r  $(BASEPATH)/conf/app.yaml $(BUILDDIR)/$(KO_CONFIG_DIR)
	mkdir -p $(BUILDDIR)/$(KO_DATA_DIR)
	cp -r  $(BASEPATH)/plugin $(BUILDDIR)/$(KO_DATA_DIR)
	cp -r  $(BASEPATH)/migration $(BUILDDIR)/$(KO_DATA_DIR)


docker_ui:
	docker build -t kubeoperator/ui:master  ./ui

docker_server:
	docker build -t kubeoperator/server:master --build-arg GOPROXY=$(GOPROXY) .

clean:
	rm -fr ./dist
	go clean
