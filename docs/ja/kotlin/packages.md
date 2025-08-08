[//]: # (title: パッケージとインポート)

ソースファイルはパッケージ宣言で始まることがあります：

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

ソースファイルのクラスや関数など、すべての内容は、このパッケージに含まれます。
そのため、上記の例では、`printMessage()` の完全な名前は `org.example.printMessage` であり、`Message` の完全な名前は `org.example.Message` です。

パッケージが指定されていない場合、そのようなファイルの内容は、名前のない_デフォルト_パッケージに属します。

## デフォルトのインポート

多数のパッケージが、すべてのKotlinファイルにデフォルトでインポートされます：

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

ターゲットプラットフォームに応じて、追加のパッケージがインポートされます：

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## インポート

デフォルトのインポートとは別に、各ファイルは独自の `import` ディレクティブを含むことができます。

単一の名前をインポートできます：

```kotlin
import org.example.Message // Message は修飾なしでアクセス可能になりました
```

または、パッケージ、クラス、オブジェクトなど、スコープ内のアクセス可能なすべての内容をインポートできます：

```kotlin
import org.example.* // 'org.example' 内のすべてにアクセス可能になります
```

名前が衝突する場合、`as` キーワードを使用して衝突しているエンティティをローカルでリネームすることで、曖昧さを解消できます：

```kotlin
import org.example.Message // Message にアクセス可能
import org.test.Message as TestMessage // TestMessage は 'org.test.Message' を表します
```

`import` キーワードはクラスのインポートに限定されません。他の宣言をインポートするためにも使用できます：

  * トップレベルの関数とプロパティ
  * [オブジェクト宣言](object-declarations.md#object-declarations-overview)で宣言された関数とプロパティ
  * [enum 定数](enum-classes.md)

## トップレベル宣言の可視性

トップレベル宣言が `private` とマークされている場合、それは宣言されたファイルに対してプライベートになります（[可視性修飾子](visibility-modifiers.md)を参照）。