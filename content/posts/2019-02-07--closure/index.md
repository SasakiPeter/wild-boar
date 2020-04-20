---
title: クロージャって何？
category: "Python"
cover: close.jpg
author: sasaki peter
---

## クロージャとは

たまによく聞くクロージャ。人に説明できないので、まとめてみた。

呼び出す度に、1,2,3...となる関数を作る。

みたいなことができる、状態を持っている、保持することができる関数のことをクロージャというらしい。

Reactでよくステートレスファンクショナルコンポーネントとか作るけど、クロージャ使うとステートアルファンクショナルコンポーネントになるのか(笑)

クロージャの例はこんな感じ。

```javascript
function outer() {
  let x = 0;
  function inner() {
    x++;
    return x;
  }
  return inner;
}
```

今風に書き直すとこんな感じ。

```javascript
const outer = () => {
  let x = 0;
  return () => {
    x++;
    return x;
  };
};
```

これをこう使う。

```javascript
const f = outer();

for (let i = 0; i < 10; i++) {
  console.log(f());
}
```

最初の一行で*f*という関数を生成しているが、これはinnerのことだ。

そのinner関数をforループで呼び出しているが、クロージャが発動していて、あたかも状態を持っている関数のように見える。

これをfを生成せずに、いきなりinnerにアクセスするような記述をするとうまく作動しない。

```javascript
for (let i = 0; i < 10; i++) {
  console.log(outer()());
}
```

これだと1,1,1,1,1...になってしまう。

まぁ、冷静に考えれば当たり前だが。

あと、関数内関数という点において、Pythonのデコレータとして使ったメモ化関数とよく似ている。

Pythonのメモ化関数は以下のような感じ。

```python
def memoize(func):
  memo = {}
  def inner(*args):
    if args not in memo:
      memo[args] = func(*args)
    return memo[args]
  return inner
```

よくみたら、これクロージャだった。

クロージャを利用して、memoという辞書にすでに実行した関数の返り値を格納している。

この関数は普段デコレータとして使っている。

```python
@memoize
def fibo(n):
  if n<=1:
    return 1
  return fibo(n-2)+fibo(n-1)

hoge = [fibo(i) for i in range(10)]
print(hoge)
```

それの意味は多分こういうこと。

```python
def fibo(n):
  if n<=1:
    return 1
  return fibo(n-2)+fibo(n-1)

tmp = memoize(fibo)
fuga = [tmp(i) for i in range(10)]
print(fuga)
```

つまり、デコレータはなんとなくデコレートしたい関数を別の関数でラップするようなイメージだったけれど、正確にはラップする関数にラップしたい関数を引数として与えて、別の関数を生成しているっていうことになる。

つまり、こういう記述を書けば、それがわかる。

```python
def hoge(f):
  return "hoge"

@hoge
def fuga():
  return "fuga"

print(fuga)
```

もちろん返り値は*"hoge"*になる。

なぜならデコレータはこういう働きをしているはずだから。

```python
def hoge(f):
  return "hoge"

def fuga():
  return "fuga"

# ↓この一行がデコレータのしていること
tmp = hoge(fuga)
print(tmp) # 普通はhoge関数は別の関数を返す関数なのでtmp()となる
```

デコレータについて理解した。

まぁそれはそれとして、先のカウントアップするクロージャをPythonで記述すると、実はうまく動作しない。

```python
def counter(f):
  count = 0
  def inner():
    count+=1
    print(count)
    return f()
  return inner

@counter
def hoge():
  return "hoge"

print(hoge())
```

こうなる

```shell
UnboundLocalError: local variable 'count' referenced before assignment
```

スコープ的に、innerはcounterの変数を参照できないからだ。JavaScriptの場合、その辺はいい加減だが。

簡単な例でいうと

```python
def fuga():
  s = "hoge"
  def hoge():
    print(locals())
  hoge()
fuga()
```

この場合、出力は`{}`が返ってくる。`locals()`はそのスコープ内での変数を出力する関数である。

ここまでは当たり前。

```python
def fuga():
  s = "hoge"
  def hoge():
    print(locals())
    print(s)
  hoge()
fuga()
```

こうすると、出力は

```shell
{'s': 'hoge'}
hoge
```

こうなる。

つまり、hoge関数のスコープ内で宣言されていない変数は、呼び出されたスコープでの変数と解釈する仕様となっている。

しかし、以下のようにすると

```python
def fuga():
  s = "hoge"
  def hoge():
    print(locals())
    s = "fuga"
    print(locals())
    print(s)
  hoge()
fuga()
```

この場合、出力は

```shell
{}
{'s': 'fuga'}
fuga
```

こうなる。すなわち、hoge関数内でsを定義した瞬間に、hoge関数のスコープの変数を参照するため、呼び出された先での変数とは別物となる。

したがって、

```python
def fuga():
  s = "hoge"
  def hoge():
    print(locals())
    s = s + "fuga"
    print(locals())
    print(s)
  hoge()
fuga()
```

これはエラーとなる。hoge関数内の`s = s + "fuga"`は代入ではなく、hogeスコープ内での変数宣言とみなされるからだ。

つまり、以下の場合、

```python
def counter(f):
  count = 0
  def inner():
    count+=1
    print(count)
    return f()
  return inner

@counter
def hoge():
  return "hoge"

print(hoge())
```

inner関数内のスコープでの`count += 1`は変数宣言とみなされ、count変数が定義されていないため、エラーとなる。

しかし、以下のように呼び出すだけなら、呼び出された先でのスコープが適用されるためエラーとならない。

```python
def counter(f):
  count = 0
  def inner():
    print(count)
    return f()
  return inner

@counter
def hoge():
  return "hoge"

print(hoge())
```

まとめると、ある変数をあるスコープで定義しなかった場合、**呼び出された先でのスコープ**が適応される。

ここで疑問に思う人もいるかもしれない。

先のメモ化関数の場合はどうなっているのか？

```python
def memoize(func):
  memo = {}
  def inner(*args):
    if args not in memo:
      memo[args] = func(*args)
    return memo[args]
  return inner
```

この記述はinner関数内で未定義であるmemo変数を使用しているため、memo変数はmemoize関数のスコープを参照している。`memo[args] = func(*args)`の記述は変数宣言としてみなされないのか？

例えば、このような場合。

```python
def counter(f):
  hoge = {"count":0}
  def inner():
    print(locals())
    hoge["count"]+=1
    print(hoge["count"])
    return f()
  return inner

@counter
def hoge():
  return "hoge"

print(hoge())
```

先の説明だと、inner関数内の`hoge["count"] += 1`は変数宣言とみなされ、`hoge["count"]`はinner関数のスコープでは宣言されていないため、エラーとなるはずだが、この場合エラーにならない。

なぜなら、この場合は`hoge["count"] += 1`はちゃんと代入としてみなされているからである。ちゃんと代入としてみなされ、counterスコープで宣言されているhoge変数を参照している。

どうして、str型やint型の場合は宣言としてみなされるのに、dict型だと代入として認識されるのか？

それはstrやintはimmutableでdictはmutableだからである。

言い換えると、dictの場合は、変数そのものではなく、変数(dict)のメンバ変数を書き換えているため、代入としてみなされ、nonlocalのスコープを自動的に参照していると理解できる。

[参考](https://stackoverflow.com/questions/13060605/python-scope-dictionary-and-variables-difference)

ちなみに、immutable変数の場合でも、スコープを操れば実装できる。

```python
def counter(f):
  count = 0
  def inner():
    nonlocal count
    count+=1
    print(count)
    return f()
  return inner
```

このようにinner関数内で使用する変数をcounterで宣言したものであると指定しておく方法がある。

もしくはクラス変数を使うと解決できる。

```python
def counter(f):
  class count:
    count = 0
  def inner():
    count.count+=1
    print(count.count)
    return f()
  return inner
```

思っていた以上にPythonは深いと感じた1日だった。
