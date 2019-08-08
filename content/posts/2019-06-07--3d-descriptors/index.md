---
title: 3D記述子について
category: "chemo-infomatics"
cover: chemical.jpg
author: sasaki peter
---

ケモインフォの特徴量はよく記述子といい、分子から計算した科学的物性を数値化したものを扱う。たまに、計算できないものがあるから、なんでだろうと思って調べたときのメモ。

## 2D記述子

### ATS系

Moreau-broto Autocorrelation（ Autocorrelation of a Topological Structure :ATS）とか言うもの。ATSがNaNになるか、ATSがなかったりすると、計算できない。

ATS系には以下の記述子が含まれる

* AATS
* GATS

これらはATSが0になると計算できず、Missing Errorを吐く
それはATSを参照して、算出される記述子だが、その計算は0であることを想定していないため。
0で埋めればいいと思われる。

### ATSC系

ATS系の亜種
AATS系には次の記述子が含まれる

* AATSC
* MATS

これもATSCが0になると計算できない。
0で埋めればいいと思われる。

### Gasteiger Charge系

Gasteiger Chargeを重みとして計算されている記述子が存在する

* ATSC
* AATSC
* BCUT

これらはGasteiger Chargeが計算できないとエラーをはく。
Gasteiger Chargeとは水素を除く原子の電荷を数値化したもの。
どうすればいいかは検討中。

### N系、S系、MAX系、MIN系

N(count)何ちゃらS(sum)何ちゃらMAX何ちゃらとかMIN何ちゃらとかはAtomTypeEStateとか言うモジュールの派生２D記述子でelectrotopological index、つまり、原子の電子分布を表しているらしい。
その後に続く原子の電子分布を示しているため、存在しない原子の電子分布を求めようとすると〜emptyとなるので、MAXとMINは0で埋めれば良さそう

### MDE系(Molecular Distance Edge)

2D記述子で条件を満たす元素が存在しないと、そもそも計算できない。その場合はDivision by zeroになるようだが、これは0にしてしまって良さそう

## ３D記述子

- MDECならCC間の距離、MDEOならOO間の距離、MDENならNN間の距離で、-11なら一級同士、-22なら二級同士とかそんな感じ。
- Mor系は３D-MoRSEとか言う原子間の距離によって変化する値で、距離が大きいほど0に収束しているから、とりあえず計算できないのは0で埋めとけば良さそう。
- GRAV系はGravitationalIndexとか言う３D記述子で、heavyとpairのオンオフによって３つの記述子に派生している。
  重力場がどうとかって言う意味わからん記述子なので、0で埋めるのは良くなさそう
  Divide by zeroならmax、変な感じだったら中央値とかで埋めるといいかも
