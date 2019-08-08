---
title: Django認証
category: "django"
cover: auth.jpg
author: sasaki peter
---

## Djangoの認証機能の実装

ログイン後にリダイレクトするURLを設定することができるらしい。

Settings.py

```python
LOGIN_REDIRECT_URL = '/'
```

また、汎用ビューを使用する場合はurls.pyに次のビューを追加する必要がある。

```python
from django.urls import include, path

urlpatterns = [
    path('accounts/', include('django.contrib.auth.urls')), # 大体の認証システム用
    path('accounts/', include('accounts.urls')) # signupview用
]
```

urlと書いてあるが、これは認証関連のビュー。

Django-private-storageと同じ感じ。

そして、これらのビューのテンプレートへのパスは、決められている！！

* Templates/registration/login.html →ログイン画面
* Templates/registration/logged_out.html →ログアウト画面

```jinja2
{% extends "base.html" %}

{% block content %}

{% if form.errors %}
<p>Your username and password didn't match. Please try again.</p>
{% endif %}

{% if next %}
    {% if user.is_authenticated %}
    <p>Your account doesn't have access to this page. To proceed,
    please login with an account that has access.</p>
    {% else %}
    <p>Please login to see this page.</p>
    {% endif %}
{% endif %}

<form method="post" action="{% url 'login' %}">
{% csrf_token %}
<table>
<tr>
    <td>{{ form.username.label_tag }}</td>
    <td>{{ form.username }}</td>
</tr>
<tr>
    <td>{{ form.password.label_tag }}</td>
    <td>{{ form.password }}</td>
</tr>
</table>

<input type="submit" value="login" />
<input type="hidden" name="next" value="{{ next }}" />
</form>

{# Assumes you setup the password_reset view in your URLconf #}
<p><a href="{% url 'password_reset' %}">Lost password?</a></p>

{% endblock %}
```

コンテキストとしてあらかじめ

* form
* Next ←謎

が渡されている模様。

さらに、password_resetというurlにアクセスすると、それに対応するViewが勝手に起動しそう。

### SignUpの実装

これが大変なはず！！！

と思ったら、フォームはあらかじめ提供されている模様←UserCreationForm

```python
from django.contrib.auth import UserCreationForm
from django.urls import reverse_lazy
from django.views import generic

class SignUpView(generic.CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('login') # ユーザー作成したら、遷移するとこと
    template_name = 'accounts/signup.html'

```

テンプレート

```jinja2
{% extends 'base.html' %}

{% block content %}
<h1>Sign up</h1>
<section class="common-form">
    <form method="post">
        {% csrf_token %}
        {{ form.as_p }}
        <button type="submit" class="submit">Sign up</button>
    </form>
</section>
{% endblock %}
```

あんまり大変じゃない？

## デコレータ

@login_required

認証していないときにリダイレクトする先は**settings.LOGIN_URL**に定義できる。

クラスビューの場合

```python
from django.contrib.auth.mixins import LoginRequiredMixin

class HogeView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'redirect_to'
```

##  よく使うテクニック

コンテキストに明記しなくてもrequestは渡っている？
これはパブリックな記事を設置する場合に有効な記述。

```jinja2
{% if request.user.id == diary.user.id %}
<section>
	<a class="act" href="{% url 'blogs:update' post.pk %}">Edit</a>
    <a class="act" href="{% url 'blogs:delete' post.pk %}">Delete</a>
</section>
{% endif %}
```

## 認証フォームでEmailフィールドの実装

[参考](http://hujimi.seesaa.net/article/258686626.html)
[公式](https://github.com/django/django/blob/master/django/contrib/auth/forms.py)

デフォルトで備わっているフォームを継承してemail付きのフォームを作成する。

```python
from django.contrib.auth.forms import UserCreationForm
from django.utils.translation import ugettext, ugettext_lazy as _


class SignUpForm(UserCreationForm):
    email = forms.EmailField(label=_('メールアドレス'), required=True)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email')

    def clean_email(self):
        email = self.cleaned_data['email']
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return email
        raise forms.ValidationError(
            _('同じメールアドレスが既に登録済みです。'))
```

## Emailでのユーザー認証

実装したアプリを乗せておく。

[Github 56gen](<https://github.com/SasakiPeter/56gen/blob/master/accounts/views.py>)