[//]: # (title: テスト容易性)

[ライブラリ自体のテスト](api-guidelines-consistency.md#maintain-conventions-and-quality)に加えて、ライブラリを使用するコードもテスト可能であることを確認してください。

## グローバルな状態とステートフルなトップレベル関数を避ける

ライブラリはグローバル変数の状態に依存したり、パブリック API の一部としてステートフルなトップレベル関数を提供したりすべきではありません。
このような変数や関数は、テストにおいてこれらのグローバルな値を制御する方法を見つける必要があるため、ライブラリを使用するコードのテストを困難にします。

例えば、あるライブラリが現在時刻へのアクセスを提供する、グローバルにアクセス可能な関数を定義しているとします。

```kotlin
val instant: Instant = Clock.now()
println(instant)
```

この API を使用するコードはテストが困難になります。なぜなら、`now()` 関数の呼び出しは常に実際の現在時刻を返す一方で、テストでは代わりにフェイクの値を返すことが望ましい場合が多いためです。

テスト容易性を高めるために、[`kotlinx-datetime`](https://github.com/Kotlin/kotlinx-datetime) ライブラリには、ユーザーが `Clock` インスタンスを取得し、それを使用して現在時刻を取得できるようにする API が用意されています。

```kotlin
val clock: Clock = Clock.System
val instant: Instant = clock.now()
println(instant)
```

これにより、ライブラリのユーザーは `Clock` インスタンスを自身のクラスに注入し、テスト中に実際のインプリメンテーションをフェイクのものに置き換えることができます。

## 次のステップ

まだ確認していない場合は、以下のページを参照することを検討してください。

* [後方互換性](api-guidelines-backward-compatibility.md) ページで、後方互換性の維持について学びます。
* 効果的なドキュメント作成の実践に関する詳細な概要については、[情報の豊富なドキュメント](api-guidelines-informative-documentation.md) を参照してください。