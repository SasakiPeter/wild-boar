---
title: DIGITSについて
category: "data-science"
cover: robot.jpg
author: sasaki peter
---

## DIGITS

DIGITSっていうのは、NVIDIAが作成した画像の転移学習ができるプラットフォーム。

## TL; DR

最初は自分でDIGITSが使えるイメージを作成しようと試みたが、あまりにも面倒すぎて挫折。公式がすでにイメージを提供してくれていることに気づき、Dockerfile書く前に、イメージがないか調べようという教訓を得た。


```shell
$ docker run --name digits -it ubuntu:16.04
```

ubuntuコンテナ内

```shell
$ apt-get update
$ apt-get install sudo wget
```

```shell
# For Ubuntu 16.04
$ CUDA_REPO_PKG=http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/cuda-repo-ubuntu1604_8.0.61-1_amd64.deb
$ ML_REPO_PKG=http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1604/x86_64/nvidia-machine-learning-repo-ubuntu1604_1.0.0-1_amd64.deb

# Install repo packages
$ wget "$CUDA_REPO_PKG" -O /tmp/cuda-repo.deb && sudo dpkg -i /tmp/cuda-repo.deb && rm -f /tmp/cuda-repo.deb
$ wget "$ML_REPO_PKG" -O /tmp/ml-repo.deb && sudo dpkg -i /tmp/ml-repo.deb && rm -f /tmp/ml-repo.deb

# Download new list of packages
$ sudo apt-get update
```

```shell
$ sudo apt-get install --no-install-recommends git graphviz python-dev python-flask python-flaskext.wtf python-gevent python-h5py python-numpy python-pil python-pip python-scipy python-tk
```

### Caffe

```shell
$ sudo apt-get install --no-install-recommends build-essential cmake git gfortran libatlas-base-dev libboost-filesystem-dev libboost-python-dev libboost-system-dev libboost-thread-dev libgflags-dev libgoogle-glog-dev libhdf5-serial-dev libleveldb-dev liblmdb-dev libopencv-dev libsnappy-dev python-all-dev python-dev python-h5py python-matplotlib python-numpy python-opencv python-pil python-pip python-pydot python-scipy python-skimage python-sklearn
```

```shell
$ export CAFFE_ROOT=/lib/caffe
$ git clone https://github.com/NVIDIA/caffe.git $CAFFE_ROOT -b 'caffe-0.15'
```



```shell
# For Ubuntu 16.04
CUDA_REPO_PKG=http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/cuda-repo-ubuntu1604_8.0.61-1_amd64.deb
ML_REPO_PKG=http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1604/x86_64/nvidia-machine-learning-repo-ubuntu1604_1.0.0-1_amd64.deb

# Install repo packages
wget "$CUDA_REPO_PKG" -O /tmp/cuda-repo.deb && sudo dpkg -i /tmp/cuda-repo.deb && rm -f /tmp/cuda-repo.deb
wget "$ML_REPO_PKG" -O /tmp/ml-repo.deb && sudo dpkg -i /tmp/ml-repo.deb && rm -f /tmp/ml-repo.deb

# Download new list of packages
sudo apt-get update
```

### UbuntuにPython入れたイメージを作る

Dockerfileをこしらえる。

```dockerfile
FROM ubuntu:16.04

# refs. Install Python3.7 in ubuntu 16.04
# https://medium.com/@manivannan_data/install-python3-7-in-ubuntu-16-04-dfd9b4f11e5c
RUN apt update && apt-get install -y \
    build-essential \
    checkinstall \
    libreadline-gplv2-dev \
    libncursesw5-dev \
    libssl-dev \
    libsqlite3-dev \
    tk-dev \
    libgdbm-dev \
    libc6-dev \
    libbz2-dev \
    zlib1g-dev \
    openssl \
    libffi-dev \
    python3-dev \
    python3-setuptools \
    wget \
    && mkdir /tmp/Python37
WORKDIR tmp/Python37
RUN wget https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tar.xz \
    && tar xvf Python-3.7.0.tar.xz
WORKDIR /tmp/Python37/Python-3.7.0
RUN ./configure --enable-optimizations \
    && make altinstall \
    && mkdir /usr/local/Python
WORKDIR /usr/local/Python
```

ビルドする。

```shell
$ docker build -t digits .
```

コンテナを起動する。

```shell
$ docker run --name digits -it -d digits
$ docker exec -it digits /bin/bash
```

一度わざわざデタッチしてからアタッチしているのは、`exit`コマンドで気軽に抜けられるようにするため。

このコンテナの中に、digitsを入れる。

```shell
$ ln -s /usr/local/bin/pip3.7 /usr/local/bin/pip
$ ln -s /usr/local/bin/python3.7 /usr/local/bin/python
$ pip install --upgrade pip setuptools
```

```shell
$ apt-get install sudo
```



```shell
# For Ubuntu 16.04
CUDA_REPO_PKG=http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/cuda-repo-ubuntu1604_8.0.61-1_amd64.deb
ML_REPO_PKG=http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1604/x86_64/nvidia-machine-learning-repo-ubuntu1604_1.0.0-1_amd64.deb

# Install repo packages
wget "$CUDA_REPO_PKG" -O /tmp/cuda-repo.deb && sudo dpkg -i /tmp/cuda-repo.deb && rm -f /tmp/cuda-repo.deb
wget "$ML_REPO_PKG" -O /tmp/ml-repo.deb && sudo dpkg -i /tmp/ml-repo.deb && rm -f /tmp/ml-repo.deb

# Download new list of packages
sudo apt-get update

# -y しよう
sudo apt-get install --no-install-recommends git graphviz python-dev python-flask python-flaskext.wtf python-gevent python-h5py python-numpy python-pil python-pip python-scipy python-tk

sudo apt-get install --no-install-recommends build-essential cmake git gfortran libatlas-base-dev libboost-filesystem-dev libboost-python-dev libboost-system-dev libboost-thread-dev libgflags-dev libgoogle-glog-dev libhdf5-serial-dev libleveldb-dev liblmdb-dev libopencv-dev libsnappy-dev python-all-dev python-dev python-h5py python-matplotlib python-numpy python-opencv python-pil python-pip python-pydot python-scipy python-skimage python-sklearn

export CAFFE_ROOT=/usr/local/src/caffe
git clone https://github.com/NVIDIA/caffe.git $CAFFE_ROOT -b 'caffe-0.15'

sudo pip install -r $CAFFE_ROOT/python/requirements.txt

sudo apt-get install libprotobuf-dev protobuf-compiler

cd $CAFFE_ROOT
mkdir build
cd build
cmake ..
make -j"$(nproc)"
make install
```

digits

```shell
DIGITS_ROOT=/usr/local/src/digits
git clone https://github.com/NVIDIA/DIGITS.git $DIGITS_ROOT
sudo pip install -r $DIGITS_ROOT/requirements.txt

sudo pip install -e $DIGITS_ROOT
```

path通したい。

```shell
ln -s /usr/local/src/digits/digits-devserver /usr/local/bin/digits-devserver
```

起動

```shell
$ digits-devserver
```





## やり直し

よくわからん`Dockerfile`作らないでほしい。

```dockerfile
FROM python:3.7
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
```

イメージビルドして、コンテナ立てる

```shell
$ docker run --name digits -d -it digits.python
$ docker exec -it digits /bin/bash
```

```shell
$ cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

まじか。ubuntuじゃないのね。

いいの持ってきた
[参考](https://gist.github.com/monkut/c4c07059444fd06f3f8661e13ccac619)

[エラー解消](https://github.com/pypa/pip/issues/5367)

```dockerfile
FROM ubuntu:16.04

RUN apt-get update && \
        apt-get install -y software-properties-common vim && \
        add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update -y

RUN apt-get install -y build-essential python3.6 python3.6-dev python3-pip python3.6-venv && \
        apt-get install -y git

RUN python3.6 -m pip install pip --upgrade && \
        python3.6 -m pip install wheel
```

別にマウントビルドする必要もなさそうだし、とりあえず、さっきのやつは消してこれでいく。

イメージがいい感じにビルドできたので、コンテナを立てて、中身を見てみる

```shell
$ docker run --name digits -it -d digits.python
$ docker exec -it digits /bin/bash
```

中を見た感じ、pythonコマンドにバインドがないため、python3.6のシンボリックリンクとしておく。

```shell
$ ln -s /usr/bin/python3.6 /usr/bin/python
$ mv /usr/local/bin/pip /usr/local/bin/pip2
$ ln -s /usr/local/bin/pip3.6 /usr/local/bin/pip
```

## よし、Digitsに必要なもの入れるぞ！！！

まずはこれ

```shell
# For Ubuntu 16.04
CUDA_REPO_PKG=http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/cuda-repo-ubuntu1604_8.0.61-1_amd64.deb
ML_REPO_PKG=http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1604/x86_64/nvidia-machine-learning-repo-ubuntu1604_1.0.0-1_amd64.deb

# Install repo packages
wget "$CUDA_REPO_PKG" -O /tmp/cuda-repo.deb && sudo dpkg -i /tmp/cuda-repo.deb && rm -f /tmp/cuda-repo.deb
wget "$ML_REPO_PKG" -O /tmp/ml-repo.deb && sudo dpkg -i /tmp/ml-repo.deb && rm -f /tmp/ml-repo.deb

# Download new list of packages
sudo apt-get update
```



シェルスクリプトにして実行したら、`wget`と`sudo`がないって怒られる。権限を777に変えるのを忘れないように。

```shell
$ apt-get install sudo wget
```

入れたらOK



お次はこれ
```shell
$ sudo apt-get install --no-install-recommends git graphviz python-dev python-flask python-flaskext.wtf python-gevent python-h5py python-numpy python-pil python-pip python-scipy python-tk
```
なんかこんなものを聞かれた

```
Please select the geographic area in which you live. Subsequent configuration questions will narrow this down by presenting a list of cities,
representing the time zones in which they are located.

  1. Africa   3. Antarctica  5. Arctic  7. Atlantic  9. Indian    11. SystemV  13. Etc
  2. America  4. Australia   6. Asia    8. Europe    10. Pacific  12. US
Geographic area:
```

さらにこれ
```
Please select the city or region corresponding to your time zone.

  1. Aden      13. Barnaul     25. Dushanbe     37. Jerusalem     49. Macau         61. Pyongyang      73. Taipei         85. Vientiane
  2. Almaty    14. Beirut      26. Famagusta    38. Kabul         50. Magadan       62. Qatar          74. Tashkent       86. Vladivostok
  3. Amman     15. Bishkek     27. Gaza         39. Kamchatka     51. Makassar      63. Qostanay       75. Tbilisi        87. Yakutsk
  4. Anadyr    16. Brunei      28. Harbin       40. Karachi       52. Manila        64. Qyzylorda      76. Tehran         88. Yangon
  5. Aqtau     17. Chita       29. Hebron       41. Kashgar       53. Muscat        65. Rangoon        77. Tel_Aviv       89. Yekaterinburg
  6. Aqtobe    18. Choibalsan  30. Ho_Chi_Minh  42. Kathmandu     54. Nicosia       66. Riyadh         78. Thimphu        90. Yerevan
  7. Ashgabat  19. Chongqing   31. Hong_Kong    43. Khandyga      55. Novokuznetsk  67. Sakhalin       79. Tokyo
  8. Atyrau    20. Colombo     32. Hovd         44. Kolkata       56. Novosibirsk   68. Samarkand      80. Tomsk
  9. Baghdad   21. Damascus    33. Irkutsk      45. Krasnoyarsk   57. Omsk          69. Seoul          81. Ujung_Pandang
  10. Bahrain  22. Dhaka       34. Istanbul     46. Kuala_Lumpur  58. Oral          70. Shanghai       82. Ulaanbaatar
  11. Baku     23. Dili        35. Jakarta      47. Kuching       59. Phnom_Penh    71. Singapore      83. Urumqi
  12. Bangkok  24. Dubai       36. Jayapura     48. Kuwait        60. Pontianak     72. Srednekolymsk  84. Ust-Nera
Time zone: 79
```

やばない？

次にCaffe入れる！！！



### Caffe

```shell
$ sudo apt-get install -y --no-install-recommends build-essential cmake git gfortran libatlas-base-dev libboost-filesystem-dev libboost-python-dev libboost-system-dev libboost-thread-dev libgflags-dev libgoogle-glog-dev libhdf5-serial-dev libleveldb-dev liblmdb-dev libopencv-dev libsnappy-dev python-all-dev python-dev python-h5py python-matplotlib python-numpy python-opencv python-pil python-pip python-pydot python-scipy python-skimage python-sklearn
```

お次はこれ

```shell
# example location - can be customized
export CAFFE_ROOT=~/caffe
git clone https://github.com/NVIDIA/caffe.git $CAFFE_ROOT -b 'caffe-0.15'
```

その前に、 `~/`はどこになっているのか気になったので
```shell
$ cd; pwd
```
で調べたら`/root`でした。ここに`bashrc`とかもあるようで。

ここでいいのでさっきのクローンを実行する。

お次はpip

```shell
$ sudo pip install -r $CAFFE_ROOT/python/requirements.txt
```

エラーおじさん

```
matplotlib 3.0.3 has requirement python-dateutil>=2.1, but you'll have python-dateutil 1.5 which is incompatible.
pandas 0.24.2 has requirement numpy>=1.12.0, but you'll have numpy 1.11.0 which is incompatible.
pandas 0.24.2 has requirement python-dateutil>=2.5.0, but you'll have python-dateutil 1.5 which is incompatible.
```

```shell
$ pip install --upgrade python-dateutil numpy
```

```shell
cd $CAFFE_ROOT
mkdir build
cd build
cmake ..
make -j"$(nproc)"
make install
```

```shell
$ cmake ..
-- Boost version: 1.58.0
-- Found the following Boost libraries:
--   system
--   thread
--   filesystem
--   chrono
--   date_time
--   atomic
-- Found gflags  (include: /usr/include, library: /usr/lib/x86_64-linux-gnu/libgflags.so)
-- Found glog    (include: /usr/include, library: /usr/lib/x86_64-linux-gnu/libglog.so)
CMake Error at /usr/share/cmake-3.5/Modules/FindPackageHandleStandardArgs.cmake:148 (message):
  Could NOT find Protobuf (missing: PROTOBUF_LIBRARY PROTOBUF_INCLUDE_DIR)
Call Stack (most recent call first):
  /usr/share/cmake-3.5/Modules/FindPackageHandleStandardArgs.cmake:388 (_FPHSA_FAILURE_MESSAGE)
  /usr/share/cmake-3.5/Modules/FindProtobuf.cmake:308 (FIND_PACKAGE_HANDLE_STANDARD_ARGS)
  cmake/ProtoBuf.cmake:4 (find_package)
  cmake/Dependencies.cmake:24 (include)
  CMakeLists.txt:58 (include)


-- Configuring incomplete, errors occurred!
See also "/root/caffe/build/CMakeFiles/CMakeOutput.log".
See also "/root/caffe/build/CMakeFiles/CMakeError.log".
```

ここでエラーを吐く。
Protobufが見つからないとか言われているので、入れる。

```shell
$ sudo apt-get install -y libprotobuf-dev protobuf-compiler
```

うまくいったので続きから。

```shell
$ make -j"$(nproc)"
$ make install
```





## Digits

```shell
DIGITS_ROOT=~/digits
git clone https://github.com/NVIDIA/DIGITS.git $DIGITS_ROOT
```



```shell
sudo pip install -r $DIGITS_ROOT/requirements.txt
```

うまくいかない

[pydotのせい](https://github.com/NVIDIA/DIGITS/issues/1461)

[まだ開かれたIssueとしてDigitsのレポジトリに上がってる](https://github.com/NVIDIA/DIGITS/issues/1931)

```
pydot>=1.0.28,<=1.0.29
```

ここを消して様子を見る



matplotlib pillow

```shell
$ passwd
$ usermod -l new old
```

こんなことしなくても、普通にDockerhubにイメージが上がっていました。

```shell
$ docker pull nvidia/digits:6.0
$ docker run --name digits -p 5000:5000 -p 6006:6006 -v $(pwd)/jobs:/jobs -v $(pwd)/data:/data -d nvidia/digits:6.0
$ docker exec -it digits /bin/bash
$ python -m digits.download_data mnist ~/mnist
```

```shell
root@69fcb48e9863:/# less etc/os-release

NAME="Ubuntu"
VERSION="14.04.5 LTS, Trusty Tahr"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 14.04.5 LTS"
VERSION_ID="14.04"
HOME_URL="http://www.ubuntu.com/"
SUPPORT_URL="http://help.ubuntu.com/"
BUG_REPORT_URL="http://bugs.launchpad.net/ubuntu/"

root@69fcb48e9863:/# python --version
Python 2.7.6
root@69fcb48e9863:/# which python
/usr/bin/python
```

