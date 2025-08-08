[//]: # (title: テスト容易性)

[ライブラリのテスト](api-guidelines-consistency.md#maintain-conventions-and-quality)に加えて、ライブラリを使用するコードもテスト可能であることを確認してください。

## グローバル状態と状態を持つトップレベル関数を避ける

ライブラリは、グローバル変数内の状態に依存したり、パブリックAPIの一部として状態を持つトップレベル関数を提供したりするべきではありません。
このような変数や関数は、テストがこれらのグローバル値を制御する方法を見つける必要があるため、ライブラリを使用するコードのテストを困難にします。

たとえば、ライブラリは現在時刻へのアクセスを提供するグローバルにアクセス可能な関数を定義するかもしれません：

```kotlin
val instant: Instant = Clock.now()
println(instant)
```

このAPIを使用するコードはテストが困難になります。なぜなら、`now()` 関数の呼び出しは常に実際の現在時刻を返しますが、テストでは偽の値を返すことが望ましい場合が多いためです。

テスト容易性を有効にするため、[`kotlinx-datetime`](https://github.com/Kotlin/kotlinx-datetime) ライブラリは、ユーザーが `Clock` インスタンスを取得し、それを使用して現在時刻を取得できるAPIを持っています：

```kotlin
val clock: Clock = Clock.System
val instant: Instant = clock.now()
println(instant)
```

これにより、ライブラリのユーザーは自身のクラスに `Clock` インスタンスを注入し、テスト中に実際の実装を偽の実装に置き換えることができます。

## 次のステップ

まだ行っていない場合は、これらのページも確認することを検討してください：

*   [後方互換性](api-guidelines-backward-compatibility.md)ページで、後方互換性の維持について学びましょう。
*   効果的なドキュメント作成のプラクティスに関する広範な概要については、[有益なドキュメント](api-guidelines-informative-documentation.md)を参照してください。