[//]: # (title: パッケージとインポート)

ソースファイルはパッケージ宣言から始まる場合があります。

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

クラスや関数といったソースファイルのすべての内容は、このパッケージに含まれます。
したがって、上記の例では、`printMessage()` の完全修飾名は `org.example.printMessage` となり、
`Message` の完全修飾名は `org.example.Message` となります。

パッケージが指定されていない場合、そのファイルの内容は名前のない「デフォルト（default）」パッケージに属します。

## デフォルトのインポート

デフォルトで、多数のパッケージがすべての Kotlin ファイルにインポートされます。

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

デフォルトのインポートに加えて、各ファイルには独自の `import` ディレクティブを含めることができます。

単一の名前をインポートすることもできます：

```kotlin
import org.example.Message // これで Message に修飾なしでアクセスできるようになります
```

あるいは、パッケージ、クラス、オブジェクトといったスコープ内のすべてのアクセス可能な内容をインポートすることもできます：

```kotlin
import org.example.* // 'org.example' 内のすべてのものにアクセスできるようになります
```

名前の衝突がある場合は、`as` キーワードを使用して衝突するエンティティをローカルでリネームすることで、曖昧さを解消できます：

```kotlin
import org.example.Message // Message がアクセス可能
import org.test.Message as TestMessage // TestMessage は 'org.test.Message' を指す
```

`import` キーワードはクラスのインポートだけに限定されません。他の宣言をインポートするためにも使用できます：

  * トップレベルの関数とプロパティ
  * [オブジェクト宣言](object-declarations.md#object-declarations-overview)で宣言された関数とプロパティ
  * [enum 定数](enum-classes.md)

## トップレベル宣言の可視性

トップレベルの宣言が `private` としてマークされている場合、それは宣言されているファイル内に対してプライベートになります（[可視性修飾子](visibility-modifiers.md)を参照）。