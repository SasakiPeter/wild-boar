---
title: Kaggle入門
category: "data-science"
cover: compe.jpg
author: sasaki peter
---

kaggleに入門したときのメモ。

## GCP

GCP上で計算するのが通のkagglerらしい。

* Big Query
* Compute Engine
  * VMインスタンス
    * インスタンスを生成する
    * コア4
    * メモリ30位とか
    * 今回はザコい感じで
    * セキュリティからキーを登録できる
    * 今回はキーを作成した
* Storage
  * プロジェクト作る
  * inputフォルダ作る
  * データあげる
  * 日付フォルダ作って、途中のコードをスクショとっておくといいらしい

## VMインスタンス

ssh接続

```shell
$ sudo apt update -y
$ sudo apt install -y git emacs vim build-essential tmux htop
```

`tmux`と`screen`は同じ役割

### Anaconda

この辺から探す
[https://repo.continuum.io/archive/](https://repo.continuum.io/archive/)

```shell
$ wget https://repo.continuum.io/archive/Anaconda3-5.3.1-Linux-x86_64.sh
$ sh Anaconda3-5.3.1-Linux-x86_64.sh
```

環境できたら、githubリポジトリをクローンして、中にinputディレクトリを作り、GCPのStoreの中身を持ってくる

```shell
$ gsutil -m cp -r gs://kaggle-porto-peter/input/* /input
```

解凍

```shell
$ sudo apt install -y unzip p7zip-full
```

```shell
$ 7z x hoge.7z
```


これでnumpy配列


```shell
$ df['col'].values
```

```shell
$ pip install xgboost autopep8
```



## tqdm

`for`文の進捗がわかるライブラリ

## XGBoost

* min_child_weight
  * 汎化性能
  * 大きいほど高いらしい
* colsample_bylevel
  * 木の深さによって、特徴を変える

最初はフィーチャーエンジニアリングに専念して、学習率は最後に落とせばいい。

一個一個の学習器が、そんなに説明力持たない方がいい。

## One Hot Encoding

ラベル（カテゴリ）を数値（バイナリ）に直すやつ。

* Scikit-learn

  * ラベルエンコーダー
* Pandas
  * pd.get_dummies(df)
  * カテゴリ別にone hot が作成される
  * pd.get_dummies(df, col)
    みたいに、第二引数をつけると、それがprefixになる

XGBoostはOneHotEncodingしないほうがいい。
LogisticRegressionの場合は、した方がいい。

## XGBoost

```python
params = {
    'predictor': 'gpu_predictor',
    'tree_method': 'gpu_hist',
}

clf = xgb(**params)
clf.fit(x_train, y_train, eval_metric=auc)

# ベストなイテレーションの時のprobabilityを算出する
clf.predict_proba(val_x, ntree_limit = clf.best_iteration + 1)[:, 1]
```

## 送信

```shell
$ gsutil -m cp result_tmp/submit.csv gs://kaggle-porto-peter/submits/submit_test.csv
```

パーミッションで弾かれたら、VMインスタンスを停止して、権限を与える必要がある模様。

一回ダウンロードしてkaggleに投稿
この時に、loggerを貼り付けておくといいらしい。

## LightGBM

XGBoostよりも、LightGBMの方がはるかに軽いらしい

GPU使う時、これで回るらしい。

```python
all_params = {
    'device': ['gpu']
}
```

## 用語

* ブートストラップ
  * ランダムにデータをサンプリングすること
* ブースティング
  * 構成済みの学習器の誤りを反映して、次段の弱学習器を作成すること
* スタッキング
  * 初段の学習器の出力を、次段の学習器の入力とすること

## pythonでデバッグ

```python
import pdb
pdb.set_trace()
```

デバッグ中は`step`や`p hoge`を使う

`l`も使える

