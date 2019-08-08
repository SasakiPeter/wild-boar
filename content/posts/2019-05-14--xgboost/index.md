---
title: XGBoostについて
category: "data-science"
cover: tree.jpg
author: sasaki peter
---

## 概要

XGBoostとは、Gradient Boosting（勾配ブースティング）とRandom Forestを組み合わせたアンサンブル学習。

つまり、ランダムフォレストのバギングでは、決定木と呼ばれる弱学習器をバギングによってランダムに生成していく。しかし、これに勾配ブースティングの考え方を融合させ、新しい弱学習器を作る際に、これまでに構築された全ての弱学習器の結果を利用する。

どのようにするかというと、うまく予測できない弱学習器は重みを小さくし、よく予測できる弱学習器は重みを大きくすることで、

これにより、弱学習器が直列につながり、あたかもニューラルネットワークのような構造になるという感じかな？

## ハイパーパラメータ

* max_depth
  * 木の深さ
  * 深すぎると過学習を起こす
* min_child_weight
  * 葉の重みの下限
  * つまりは、足切り
  * この深さ未満の木は切りますよって感じ
* subsample
  * 各ステップの木の構築に用いるデータの割合
  * よくわからない
* colsample_bytree
  * 各ステップの木ごとに用いる特徴量の割合



XGBoostはアンサンブル学習ではなく、弱学習器の数が、いわばイテレーション数みたいな感じ。弱学習器を生成するたびに、パラメータの更新が行われているようなイメージで、どんどんひとつの木を大きく育てていく。