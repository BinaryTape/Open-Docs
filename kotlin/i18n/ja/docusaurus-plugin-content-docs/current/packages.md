---
title: パッケージとインポート
---
ソースファイルは、package宣言で始まる場合があります。

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

ソースファイルのクラスや関数などのすべてのコンテンツは、このpackageに含まれます。
したがって、上記の例では、`printMessage()`のフルネームは`org.example.printMessage`であり、
`Message`のフルネームは`org.example.Message`です。

packageが指定されていない場合、そのようなファイルの内容は名前のない_default_ packageに属します。

## Default imports

多くのpackageは、デフォルトでKotlinのすべてのファイルにインポートされます。

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

ターゲットプラットフォームに応じて、追加のpackageがインポートされます。

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## Imports

デフォルトのimportsとは別に、各ファイルには独自の`import`ディレクティブを含めることができます。

単一の名前をインポートできます。

```kotlin
import org.example.Message // Messageは修飾なしでアクセス可能になりました
```

または、スコープのアクセス可能なすべてのコンテンツ（package、クラス、オブジェクトなど）をインポートできます。

```kotlin
import org.example.* // 'org.example'のすべてがアクセス可能になります
```

名前の衝突がある場合は、`as`キーワードを使用して衝突するエンティティをローカルで名前変更することで、あいまいさを解消できます。

```kotlin
import org.example.Message // Messageはアクセス可能です
import org.test.Message as TestMessage // TestMessageは'org.test.Message'を表します
```

`import`キーワードは、クラスのインポートに限定されません。他の宣言をインポートするためにも使用できます。

  * トップレベルの関数とプロパティ
  * [オブジェクト宣言](object-declarations#object-declarations-overview)で宣言された関数とプロパティ
  * [enum定数](enum-classes)

## Visibility of top-level declarations

トップレベルの宣言が`private`とマークされている場合、それは宣言されているファイルに対してprivateです（[Visibility modifiers](visibility-modifiers)を参照）。