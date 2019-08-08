---
title: Sniffles
category: "bio-infomatics"
cover: flu.jpg
author: sasaki peter
---

## Snifflesとは

*Sniffles*はDNAの構造変異(Structure Variant: SV)の検出に用いるOSS。
SV検出の前に、シーケンサーから出力されたDNA配列の断片をアラインメント(マッピングともいう)と言って、重複の無いようにつなぎ合わせる作業が必要になる。

ロングリードシーケンサーの場合、このアラインメントには*ngmlr*や*minimap2*といったOSSが使用できる。その出力結果は*SAM*というファイル形式で得られるが、そのファイルの前処理から行う。

## samtools

*Sniffles*はSAM形式のファイルを入力として受け付けていないので、バイナリ形式のBAMに変換するために*samtools*を用いる。

### インストール

#### コンパイルする場合

```shell
$ git clone git://github.com/samtools/samtools.git
$ make
```

#### バイナリファイルを直接ダウンロードする場合

```shell
$ wget https://sourceforge.net/projects/samtools/files/samtools/1.0/samtools-bcftools-htslib-1.0_x64-linux.tar.bz2/download -O samtools
```

#### Biocondaを使う場合

conda-forgeチャンネルが優先されていない環境でインストールすると`libcrypto.so.1.0.0`がないとエラーが出る。

```shell
dyld: Library not loaded: @rpath/libcrypto.1.0.0.dylib
  Referenced from: /Users/sasakipeter/miniconda3/bin/samtools
  Reason: image not found
```

```shell
$ conda config --get channels
--add channels 'r'   # lowest priority
--add channels 'defaults'
--add channels 'bioconda'
--add channels 'conda-forge'   # highest priority
$ conda install samtools
```

> 使うかもしれなかったコマンド
>
> ```shell
> $ conda update -n base -c defaults conda
> $ ldd $(which samtools)
> $ otool -L $(which samtools)
> $ cd ~/miniconda3/envs/genome/lib
> $ ln -s libcrypto.so.1.1 libcrypto.so.1.0.0
> $ brew install openssl
> $ ln -s /usr/local/opt/openssl/lib/libcrypto.1.0.0.dylib /usr/local/lib/
> $ ln -s /usr/local/opt/openssl/lib/libssl.1.0.0.dylib /usr/local/lib/
> ```

他のライブラリを入れて、samtoolsが動かなくなったら、以下のコマンドでだいたいうまくいく

```shell
$ conda update --all
```

[参考](http://yfuruta.sakura.ne.jp/blog/?p=884)

### 実行

```shell
$ samtools view -Sb test.sam > test.bam
```

sortしてからSVをコールしたほうがいいのかもしれない。

[参考](http://kazumaxneo.hatenablog.com/entry/2018/04/21/124950)

samtoolsの使い方について要調査。

## Sniffles

### 実行

```shell
$ sniffles -s 10 -m test.bam -v output.vcf
```

データが少なすぎると警告が出る模様。

