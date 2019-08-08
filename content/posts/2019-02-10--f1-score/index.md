---
title: F1-score
category: "data-science"
cover: f1.jpg
author: sasaki peter
---

## F値とは

分類問題における予測性能の評価尺度の一つで、感度（再現率）と精度（陽性的中率、適合率）の調和平均で表される。

$$
\frac{2 * Recall * Precision}{Recall + Precision}
$$

scikit-learnの学習器の中には、デフォルトの評価指標がF値であるものがあったような気がするが、F値は分母に0を取ることがあり、エラーを吐くことがあるので、個人的には評価指標(metric)は分類ならROC-AUCを使って、カットオフ値を求めるときは特に何もなければACCかBACを使うようにしている。

分類問題の時、その予測結果は以下のような分割表を書くことができる。

|       | 真1                          | 真0                    |
| ----- | ---------------------------- | ---------------------- |
| 予測1 | TP（真陽性） | FP（偽陽性）         |
| 予測0 | FN（偽陰性）               | TN（真陰性） |

再現率(Recall, Sensitivity: 感度)とは真陽性率(True Positive Rate: TPR)のことである。上の表を縦に見たとき、つまり真1のラベルを分母にしたときの予測の正解率である。

$$
Recall = TPR = \frac{TP}{TP + FN}
$$

精度(Precision, 陽性的中率, Positive Predictive Value: PPV)は、逆に上の表を横に見る。1と予測したもののうち本当に1だったものの割合である。

$$
Precision = \frac{TP}{TP + FP}
$$

以下に参考にした個人的に分かりやすかったサイトを掲載しておく。  
[参考](https://data.gunosy.io/entry/2016/08/05/115345)