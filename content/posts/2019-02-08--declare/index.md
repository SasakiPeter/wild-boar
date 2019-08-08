---
title: JSとPythonのクロージャについてまとめ
category: "Python"
cover: declare.jpg
author: sasaki peter
---

### JSとPythonの比較

```javascript
function hoge(){
    let x = 0;
    function fuga(){
        x += 1; // 代入
        return x;
    }
    return fuga;
}
```

```python
def hoge():
    x = 0
    def fuga():
        x += 1 # 宣言
        return x
    return fuga
```

上は動作するけど、下はエラー吐く。
Python自体は嫌いじゃないけど、変数宣言と代入が同じ記述なの嫌い。
