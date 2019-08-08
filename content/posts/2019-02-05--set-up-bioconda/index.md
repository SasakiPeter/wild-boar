---
title: Biocondaの入れ方
category: "bio-infomatics"
cover: python.jpg
author: Sasaki Peter
---

## Biocondaとは

*bioconda*とは*Anaconda*や*Miniconda*でインストールできるディストリビューションの内、バイオ系に特化したチャンネルのことを指す。そのため、あらかじめ`conda`が使えるようにしておく必要がある。

## インストールの仕方

最初に[Miniconda](https://conda.io/en/latest/miniconda.html)を入れる。

バイオ系のパッケージは*defaults*のチャンネルには見つからない。

```shell
$ conda search ngmlr
```

`config`コマンドで*bioconda*のチャンネルを追加する。

```shell
$ conda config --add channnels conda-forge
$ conda config --add channnels defaults
$ conda config --add channnels r
$ conda config --add channnels bioconda
```

以上のコマンドで優先順位が下から順番になる。すなわち、最優先チャンネルが*bioconda*で、最後が*conda-forge*。扱っている数が少ない順。

*default*のチャンネルよりも、*conda-forge*チャンネルの方が扱っているパッケージ数が多い。

以下のコマンドでも良い。

```shell
$ conda config --append channnels conda-forge
$ conda config --add channnels r
$ conda config --add channnels bioconda
```

削除したいときは`--add`を`--remove`に、最後(優先順位低)に追加したいときは`--append`に変える。

> ### 現在のチャンネルの確認方法
>
> ```shell
> $ conda config --get channels
> ```
>
> システムワイドも見られるが、こちらはいじらない方が良い。
>
> ```shell
> $ conda config --get channels --system
> ```
>
> 個人環境の方は
>
> ```shell
> $ vi ~/.condarc
> ```
>
> でも編集できる。
