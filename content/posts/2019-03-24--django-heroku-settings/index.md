---
title: DjangoをHerokuにデプロイする
category: "django"
cover: heron.jpg
author: sasaki peter
---

## Djangoを Heroku上で動かしたい

DjangoをHerokuにデプロイするのはそんなに大変じゃないんだけど、データベースをちゃんと使えるようにするのに割と苦労した時のメモ。

### 環境変数一括設定

Heroku上のvariablesをimport

```python
import dj_database_url

DATABASE['default'] = dj_databaseurl.config()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
```

### HerokuをCLIから操作

```shell
$ heroku login
$ heroku apps
$ heroku apps:info diary-and-analysis
$ heroku run -a diary-and-analysis python manage.py migrate
```

なんかうまくいかない。

`makemigrations`してもうまくいかない

### Heroku上のDBの中身を確認する

```shell
$ brew install postgresql
$ which psql
```

```shell
$ heroku pg:psql -a diary-and-analysis
--> Connecting to postgresql-crystalline-48982
psql (11.2)
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
Type "help" for help.

diary-and-analysis::DATABASE=> \z
                                              Access privileges
 Schema |                 Name                  |   Type   | Access privileges | Column privileges | Policies
--------+---------------------------------------+----------+-------------------+-------------------+----------
 public | accounts_user                         | table    |                   |                   |
 public | accounts_user_groups                  | table    |                   |                   |
 public | accounts_user_groups_id_seq           | sequence |                   |                   |
 public | accounts_user_id_seq                  | sequence |                   |                   |
 public | accounts_user_user_permissions        | table    |                   |                   |
 public | accounts_user_user_permissions_id_seq | sequence |                   |                   |
 public | auth_group                            | table    |                   |                   |
 public | auth_group_id_seq                     | sequence |                   |                   |
 public | auth_group_permissions                | table    |                   |                   |
 public | auth_group_permissions_id_seq         | sequence |                   |                   |
 public | auth_permission                       | table    |                   |                   |
 public | auth_permission_id_seq                | sequence |                   |                   |
 public | django_admin_log                      | table    |                   |                   |
 public | django_admin_log_id_seq               | sequence |                   |                   |
 public | django_content_type                   | table    |                   |                   |
 public | django_content_type_id_seq            | sequence |                   |                   |
 public | django_migrations                     | table    |                   |                   |
 public | django_migrations_id_seq              | sequence |                   |                   |
 public | django_session                        | table    |                   |                   |
(19 rows)
```

### バックアップを取る

```shell
$ heroku pg:backups:capture -a diary-and-analysis
$ heroku pg:backups:download -a diary-and-analysis
```

```shell
$ less latest.dump

    "id" integer NOT NULL,
    "password" character varying(128) NOT NULL,
    "last_login" timestamp with time zone,
    "is_superuser" boolean NOT NULL,
    "username" character varying(150) NOT NULL,
    "first_name" character varying(30) NOT NULL,
    "last_name" character varying(150) NOT NULL,
    "email" character varying(254) NOT NULL,
    "is_staff" boolean NOT NULL,
    "is_active" boolean NOT NULL,
```

Userモデルをカスタムしたはずなのに、それができていない。なぜ？

```shell
$  heroku run -a diary-and-analysis less -N accounts/migrations/0001_initial.py

Running less -N accounts/migrations/0001_initial.py on ⬢ diary-and-analysis... up, run.7986 (Free)
accounts/migrations/0001_initial.py: No such file or directory
```

は？

```shell
$ heroku run -a diary-and-analysis ls accounts
Running ls accounts on ⬢ diary-and-analysis... up, run.2184 (Free)
admin.py  apps.py  authbackend.py  forms.py  __init__.py  models.py  __pycache__  tests.py  urls.py  views.py
```

できてないやんけ。

```shell
$ heroku run -a diary-and-analysis mkdir accounts/migrations
```

```shell
$ heroku run -a diary-and-analysis ls accounts
Running ls accounts on ⬢ diary-and-analysis... up, run.2183 (Free)
admin.py  apps.py  authbackend.py  forms.py  __init__.py  models.py  __pycache__  tests.py  urls.py  views.py
```

heroku上にファイル作ったりできんのか！？！？！？！？

[回答](https://teratail.com/questions/166439)

### 真面目にPostgresqlでの開発に全面的に切り替える必要があります。

postgresqlで行なった`migrations`をheroku上に持っていかないと、正しく`migrate`できない。

```shell
$ brew install postgresql
```

```shell
$ brew info postgresql
postgresql: stable 11.2 (bottled), HEAD
Object-relational database system
https://www.postgresql.org/
Conflicts with:
  postgres-xc (because postgresql and postgres-xc install the same binaries.)
/usr/local/Cellar/postgresql/11.2 (3,186 files, 35.4MB) *
  Poured from bottle on 2019-03-20 at 18:07:28
From: https://github.com/Homebrew/homebrew-core/blob/master/Formula/postgresql.rb
==> Dependencies
Build: pkg-config ✔
Required: icu4c ✔, openssl ✔, readline ✔
==> Options
--HEAD
	Install HEAD version
==> Caveats
To migrate existing data from a previous major version of PostgreSQL run:
  brew postgresql-upgrade-database

To have launchd start postgresql now and restart at login:
  brew services start postgresql
Or, if you don't want/need a background service you can just run:
  pg_ctl -D /usr/local/var/postgres start
==> Analytics
install: 84,642 (30 days), 236,127 (90 days), 754,771 (365 days)
install_on_request: 75,641 (30 days), 208,395 (90 days), 652,972 (365 days)
build_error: 0 (30 days)
```

書いてある通りに、

```shell
$ pg_ctl -D /usr/local/var/postgres start
```

を実行すると、データベースサーバーが起動し、

```shell
$ pg_ctl -D /usr/local/var/postgres stop
```

を実行すると、停止する。

`/usr/local/var/postgres`には設定ファイルが入っており、これを引数に与えないと、サーバーを起動することはできない。

この`pg_ctl`コマンドは`postgres`コマンドのラッパーであり、タスクを単純化してくれている。

ログを出力しながら使用するのが良いらしい。

```shell
$ pg_ctl -D /usr/local/var/postgres start -l logfile.log
```

なお書いておる通り

```shell
$ brew services start postgresql
```

を実行しても、サーバーを起動できるようだが、こちらはPCにログインするたびに勝手に起動するようになる。勝手にプロセスが起動しているのは好みではないので、使わない。

この起動したサーバーから、以下のコマンドで、指定したデータベースにアクセスすることができる。

```shell
$ psql -d postgres
```

この場合だと、`postgres`という名前のデータベースにアクセスしたことになる。

デフォルトでは`<username>`のデータベースにアクセスするコマンドのようだが、`brew`インストールした場合は、うまく動作しないようだ。しかし、`createdb`コマンドにより、作成することで動作する模様。

[参考](https://stackoverflow.com/questions/17633422/psql-fatal-database-user-does-not-exist)

しかしながら、`postgres`という名前のデータベースは、初期から存在しているので、まずここに入るのが一般的らしい。

そして、その`postgres`というデータベースから、別の任意のデータベースを作成することで、プロジェクト毎の新たなデータベースを生み出す。

```shell
$ psql -d postgres
psql (11.2)
Type "help" for help.

postgres=# CREATE DATABASE hoge;
CREATE DATABASE
postgres=# \c hoge
You are now connected to database "hoge" as user "username".
hoge=# \q
```

こんなことしなくても、素直に

```shell
$ createdb hoge
```

で作成して

```shell
$ dropdb hoge
```

で削除すればええやんって思う。

それで

```shell
$ psql -d hoge
```

ってやればそのDBに入ってごにょごにょできるんでしょ？

しかし、どうやらデータベースに入った後に、ごにょごにょするコマンドに精通している人が多いからか、とりあえずデータベースに入れみたいな風潮があるように見受けられる。

### Postgresql走査

データベース一覧は、データベースに入った後、次のコマンドで確認できる。

```shell
hoge=# \l
```

管理ユーザーを作成する

```shell
hoge=# CREATE USER username WITH PASSWORD 'password'
hoge=# \du
```

usernameには`'`はいらないのに、passwordには`'`が必要。

```shell
diana=# ALTER ROLE sasakipeter SET client_encoding TO 'utf8';
ALTER ROLE
diana=# ALTER ROLE sasakipeter SET default_transaction_isolation TO 'read committed';
ALTER ROLE
diana=# ALTER ROLE sasakipeter SET timezone TO 'Asia/Tokyo';
ALTER ROLE
diana=# GRANT ALL PRIVILEGES ON DATABASE diana TO sasakipeter;
GRANT
```

あとは`local_settings.py`にでも

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'diana',
        'USER': 'username',
        'PASSWORD': '*********',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```

とかって書いて、

```shell
$ pipenv install psycopg2-binary
```

すればローカルでPostgresqlが使える。普通に`makemigrations`して`migrate`すれば、そこはpostgresqlの中。

### Heroku上のDB初期化

なんかHeroku上で`migrate`うまくいかないと思ったら、sqlite時代のmigrateが残っていることに気づいた。

```shell
$ heroku pg:reset DATABASE
```

