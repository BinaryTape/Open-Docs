[//]: # (title: 套件與匯入)

原始碼檔案可以從套件宣告開始：

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

原始碼檔案的所有內容（例如類別與函式）都包含在該套件中。
因此，在上述範例中，`printMessage()` 的全名為 `org.example.printMessage`，
而 `Message` 的全名為 `org.example.Message`。

如果未指定套件，則此檔案的內容屬於無名稱的 _預設_ 套件。

## 預設匯入

許多套件預設會匯入到每個 Kotlin 檔案中：

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

視目標平台而定，會匯入額外的套件：

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## 匯入

除了預設匯入外，每個檔案也可以包含自己的 `import` 指示詞。

您可以匯入單一名稱：

```kotlin
import org.example.Message // 現在可以不使用限定符直接存取 Message
```

或者匯入某個作用域（套件、類別、物件等）中所有可存取的內容：

```kotlin
import org.example.* // 'org.example' 中的所有內容皆可存取
```

如果發生名稱衝突，您可以使用 `as` 關鍵字在本地重新命名衝突的實體來消除歧義：

```kotlin
import org.example.Message // Message 可存取
import org.test.Message as TestMessage // TestMessage 代表 'org.test.Message'
```

`import` 關鍵字不僅限於匯入類別；您還可以使用它來匯入其他宣告：

  * 頂層函式與屬性
  * 在 [物件宣告](object-declarations.md#object-declarations-overview) 中宣告的函式與屬性
  * [列舉常數](enum-classes.md)

## 頂層宣告的可見性

如果頂層宣告被標記為 `private`，則它對於其所宣告的檔案是私有的（請參閱 [可見性修飾詞](visibility-modifiers.md)）。