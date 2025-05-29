[//]: # (title: パッケージとインポート)

ソースファイルはパッケージ宣言で始まることがあります。

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

ソースファイルのクラスや関数などのすべての内容は、このパッケージに含まれます。
そのため、上記の例では、`printMessage()` の完全修飾名は `org.example.printMessage` であり、
`Message` の完全修飾名は `org.example.Message` です。

パッケージが指定されていない場合、そのファイルの内容は、名前のない_デフォルト_パッケージに属します。

## デフォルトのインポート

多数のパッケージが、すべてのKotlinファイルにデフォルトでインポートされます。

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

ターゲットプラットフォームに応じて、追加のパッケージがインポートされます。

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## インポート

デフォルトのインポートとは別に、各ファイルは独自の `import` ディレクティブを含むことができます。

単一の名前をインポートすることもできます。

```kotlin
import org.example.Message // Message is now accessible without qualification
```

または、スコープ（パッケージ、クラス、オブジェクトなど）のアクセス可能なすべての内容をインポートすることもできます。

```kotlin
import org.example.* // everything in 'org.example' becomes accessible
```

名前の衝突がある場合は、`as` キーワードを使用して衝突するエンティティをローカルで名前変更することで、曖昧さを解消できます。

```kotlin
import org.example.Message // Message is accessible
import org.test.Message as TestMessage // TestMessage stands for 'org.test.Message'
```

`import` キーワードはクラスのインポートに限定されません。他の宣言をインポートするためにも使用できます。

  * トップレベルの関数とプロパティ
  * [オブジェクト宣言](object-declarations.md#object-declarations-overview)で宣言された関数とプロパティ
  * [enum定数](enum-classes.md)

## トップレベル宣言の可視性

トップレベル宣言が `private` とマークされている場合、その宣言は宣言されたファイルに対してプライベートになります（[可視性修飾子](visibility-modifiers.md)を参照）。