[//]: # (title: 套件與匯入)

原始碼檔案可以以套件宣告開始：

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

原始碼檔案中的所有內容，例如類別和函式，都包含在此套件中。
因此，在上面的範例中，`printMessage()` 的完整名稱是 `org.example.printMessage`，
而 `Message` 的完整名稱是 `org.example.Message`。

如果未指定套件，此類檔案的內容屬於沒有名稱的_預設_套件。

## 預設匯入

許多套件會預設匯入到每個 Kotlin 檔案中：

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

根據目標平台，會匯入額外的套件：

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## 匯入

除了預設匯入之外，每個檔案都可以包含自己的 `import` 指示詞。

您可以匯入單一名稱：

```kotlin
import org.example.Message // Message 現在無需限定即可存取
```

或匯入範圍內所有可存取的內容：套件、類別、物件等等：

```kotlin
import org.example.* // 'org.example' 中的所有內容都變得可存取
```

如果存在名稱衝突，您可以透過使用 `as` 關鍵字來局部重新命名衝突的實體以消除歧義：

```kotlin
import org.example.Message // Message 可存取
import org.test.Message as TestMessage // TestMessage 代表 'org.test.Message'
```

`import` 關鍵字不限於匯入類別；您也可以用它來匯入其他宣告：

  * 頂層函式與屬性
  * 在 [物件宣告](object-declarations.md#object-declarations-overview) 中宣告的函式與屬性
  * [列舉常數](enum-classes.md)

## 頂層宣告的可視性

如果頂層宣告被標記為 `private`，則它對於宣告它的檔案是私有的（請參閱 [可視性修飾符](visibility-modifiers.md)）。