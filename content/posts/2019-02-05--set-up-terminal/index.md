---
title: ターミナルの設定
category: "terminal"
cover: terminal.jpg
author: sasaki peter
---

MacOSで使用しているターミナルの設定を紹介する。

## Homebrewを入れる

```shell
$ xcode-select --install
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

> ここで`brew`コマンドでインストールするものは、最初にまとめて入れておくと良い。
>
> ```shell
> $ brew install ricty wget zsh git
> $ brew update
> ```

## Rictyフォントを入れる

```shell
$ brew install ricty
$ cp -f /usr/local/opt/ricty/share/fonts/Ricty*.ttf ~/Library/Fonts/
$ fc-cache -vf
```

あとは、Terminal.appの環境設定から変更できるはず。

> もしかしたら、最初に以下のコマンドが必要かも。
>
> ```shell
> $ brew tap sanemat/font
> ```

## [Iceberg](http://cocopon.github.io/iceberg.vim/)を入れる

```shell
$ brew install wget
$ wget https://gist.github.com/cocopon/a04be63f5e0856daa594702299c13160/archive/dd2499198fd1f5e1373167769f7da28a7e1a2152.zip -O temp.zip && unzip temp.zip && rm -f temp.zip
```

Terminal.appの環境設定→プロファイル→設定→読み込み→Iceburg.terminalを選択

## zshを入れる

### installation

```shell
$ brew install zsh
$ sudo sh -c "echo '/usr/local/bin/zsh' >> /etc/shells"
$ chsh -s /usr/local/bin/zsh
```

### Setting

```shell
$ vi ~/.zshrc
export PATH="$PATH:$HOME/Applications/Visual Studio Code.app/Contents/Resources/app/bin"↲
autoload -Uz compinit && compinit↲
alias typora="open -a typora"
mkcd(){mkdir $1 && cd $1}↲
$ source ~/.zshrc
```

## Preztoを入れる

### Installation

```shell
$ brew install git
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
