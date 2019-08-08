---
title: 回帰モデルの評価指標
category: "data-science"
cover: critic.jpg
author: sasaki peter
---

回帰問題の評価指標を紹介する。

## 決定係数 R^2

定義が色々あるのかもしれないが、最もよくみる評価指標

分類器でいうところのROC-AUCのような立ち位置だと勝手に思っている。

寄与率とも呼ばれるらしい。

1だと、完全に観測値に予測値がフィットしていることになるので、オーバフィットしているかもしれない。

```python
from sklearn.metrics import r2_score, make_scorer

scorer = makescorer(r2_score)
```
こんな感じにして`GridSearchCV`にでも突っ込めばいいのかな。


$$
R^2 = 1 - \sum^n_{i=1} \frac{(y_i - \hat{y_i})^2} {(y_i - \bar{y})^2} = \sum^n_{i=1} \frac{(\hat{y_i} - \bar{y})^2}{(y_i - \bar{y})^2}
$$

## 平均二乗誤差(MSE)

$$
MSE(y, \hat{y}) = \frac{1}{n}\sum^n_{i=1}(y_i - \hat{y_i})^2
$$

残差平方和の平均。  
よくわかった。

```python
from sklearn.metrics import mean_square_error

MSE = mean_square_error(y_test, y_pred)
```

MAEってやつもあるらしい。

## 二乗平均平方根誤差(RMSE)


残差平方和の平均にルートとったやつ。

