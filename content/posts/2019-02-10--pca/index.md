---
title: 主成分分析(PCA)について
category: "data-science"
cover: principal.jpg
author: sasaki peter
---

## PCAとは

主成分分析（Principle Component Analysis）とは次元圧縮の手法の一つ。

分散が最大となるような主成分（軸）を見つける。仮定した軸との残差平方和が最小になるようにすることで、主成分を探索することができる。

sklearnに実装されているもので言うと、その削減後の次元数を設定するのが`n_components`というハイパーパラメータで、好きな次元に圧縮できる。