---
title: XGBoostについて
category: "data-science"
cover: tree.jpg
author: sasaki peter
---

## 概要

XGBoostとは、Gradient Boosting（勾配ブースティング）と決定木を組み合わせたアンサンブル学習法。

ランダムフォレストのバギングでは、決定木と呼ばれる弱学習器をバギングによってランダムに生成し、多数決をとるという並列処理によって精度を向上させたが、XGBoostでは勾配ブースティングの考え方用いて、新しい弱学習器を作る際にこれまでに構築された全ての弱学習器の結果を考慮する。


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


