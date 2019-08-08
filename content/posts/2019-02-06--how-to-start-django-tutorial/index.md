---
title: Django入れ方等
category: "django"
cover: laptop.jpg
author: Sasaki Peter
---

## Python本体とpipenvを入れる

### mac

```shell
$ brew install pipenv
$ brew install python
```

### windows

pythonは入っている前提でpipenvを入れる場合

```shell
$ pip install --user pipenv
```

[参考](pip install --user pipenv)

> windowsでは、python自体は[chocolatey](https://chocolatey.org/)を使うと楽
>
> Powershellから以下のコマンドを実行
>
> ```shell
> $ Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
> ```
>
> そして、次のコマンドでPythonが入る。
>
> ```shell
> $ cinst python
> ```

## 新しいプロジェクトを作成する。

```shell
$ mkdir django_tutorial && cd djando_tutorial
$ pipenv install django　#djangoをインストール
$ pipenv shell　#仮想環境を起動
```

こんな感じになればいい。

```shell
|- django_tutorial
	|- Pipfile
	|- Pipfile.lock
```

> [pipenv](https://pipenv-ja.readthedocs.io/ja/translate-ja/basics.htmls)は仮想環境の構築と、パッケージのインストールを同時にやってくれるツール。

## [チュートリアル](https://docs.djangoproject.com/ja/2.1/intro/)

基本的にこの[チュートリアル](https://docs.djangoproject.com/ja/2.1/intro/)を進めるといい。

最初のコマンド

```shell
$ django-admin startproject mysite .
```

を実行すると、こうなるはず。

```shell
|- django_tutorial
	|- mysite
	|- manage.py
	|- Pipfile
	|- Pipfile.lock
```

日本語版で意味がおかしい場合は英語版を見る。
