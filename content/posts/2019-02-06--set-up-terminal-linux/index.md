---
title: Linuxサーバーでzsh使いたい
category: "terminal"
cover: penguin.jpg
author: Sasaki Peter
---

ssh接続したLinux上だとbrew使えないし、その代替品を入れたり`sudo`コマンドを使う権限がない場合、ssh接続先で自分でコンパイルしないといけないので少々面倒。

ローカルではzsh使えるようにしても、いざLinuxサーバーに入ると、bashになってしまって悲しい。

## [Iceberg](http://cocopon.github.io/iceberg.vim/)を入れる

```shell
$ wget https://gist.github.com/cocopon/a04be63f5e0856daa594702299c13160/archive/dd2499198fd1f5e1373167769f7da28a7e1a2152.zip -O temp.zip && unzip temp.zip && rm -f temp.zip
```

Terminal.appの環境設定→プロファイル→設定→読み込み→Iceburg.terminalを選択

## zshを入れる

### Installation

```shell
$ cd src
$ wget https://sourceforge.net/projects/zsh/files/zsh/5.7.1/zsh-5.7.1.tar.xz/download -O zsh-5.7.1.tar.xz;tar xvf zsh-5.7.1.tar.xz;rm zsh-5.7.1.tar.xz;cd zsh-5.7.1;
$ ./configure
$ make
$ cd bin;ln -s /home/username/src/zsh zsh
```

### Setting

```shell
$ vi ~/.zshrc
export PATH=$PATH:/home/username/bin
autoload -Uz compinit && compinit↲
mkcd(){mkdir $1 && cd $1}↲
$ source ~/.zshrc
```

## Preztoを入れる

### Installation

```shell
$ git clone --recursive https://github.com/sorin-ionescu/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"
$ setopt EXTENDED_GLOB
for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^README.md(.N); do
  ln -s "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
done
```

### Updating

```shell
$ cd $ZPREZTODIR
$ git pull
$ git submodule update --init --recursive
```

### Setting

```shell
$ vi ~/.zpreztorc

# Set the prompt theme to load.
# Setting it to 'random' loads a random theme.
# Auto set to 'off' on dumb terminals.
zstyle ':prezto:module:prompt' theme 'pure' # ここを変更

# Set the Prezto modules to load (browse modules).
# The order matters.
zstyle ':prezto:load' pmodule \
  'environment' \
  'terminal' \
  'editor' \
  'history' \
  'directory' \
  'spectrum' \
  'utility' \
  'completion' \
  'syntax-highlighting' \ # 追加
  'autosuggestions' \ # 追加
  'prompt' \

$ source ~/.zpreztorc
```

