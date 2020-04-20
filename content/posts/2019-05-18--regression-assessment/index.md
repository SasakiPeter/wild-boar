---
title: 回帰モデルの評価指標
category: "data-science"
cover: critic.jpg
author: sasaki peter
---

回帰問題の評価指標を紹介する。

## 決定係数 R^2

定義が色々あるのかもしれないが、回帰で最もよくみる評価指標。相関係数とは違う。

分類器でいうところのROC-AUCのような立ち位置だと勝手に思っている。

寄与率とも呼ばれるらしい。

1だと、完全に観測値に予測値がフィットしていることになるので、オーバフィットしているかもしれない。

```python
from sklearn.metrics import r2_score

r2 = r2_score(y_true, y_pred)
```

$$
R^2 = 1 - \sum^n_{i=1} \frac{(y_i - \hat{y_i})^2} {(y_i - \bar{y})^2} = \sum^n_{i=1} \frac{(\hat{y_i} - \bar{y})^2}{(y_i - \bar{y})^2}
$$

## 平均二乗誤差(MSE)

$$
MSE(y, \hat{y}) = \frac{1}{n}\sum^n_{i=1}(y_i - \hat{y_i})^2
$$

残差平方和の平均。  

```python
from sklearn.metrics import mean_square_error

MSE = mean_square_error(y_true, y_pred)
```

MAEというのもある。

## 二乗平均平方根誤差(RMSE)

残差平方和の平均にルートとったやつ。

これらの指標は全て、目的変数の分布が正規分布している時によく用いられる。対数分布している時は、目的変数を対数変換してRMSEで評価するか、評価関数自体をRMSLEにするという２つの方針がある。

t

