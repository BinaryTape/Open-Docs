[//]: # (title: 套件與匯入)

原始碼檔案可能以套件宣告開頭：

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

原始碼檔案中的所有內容，例如類別和函數，都包含在此套件中。因此，在上述範例中，`printMessage()` 的完整名稱是 `org.example.printMessage`，而 `Message` 的完整名稱是 `org.example.Message`。

如果未指定套件，則此類檔案的內容屬於 _預設_（無名稱）套件。

## 預設匯入

每個 Kotlin 檔案都會預設匯入多個套件：

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

根據目標平台，還會匯入額外套件：

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## 匯入

除了預設匯入之外，每個檔案還可以包含自己的 `import` 指令。

您可以匯入單一名稱：

```kotlin
import org.example.Message // 現在 Message 無需限定即可存取
```

或匯入作用域（套件、類別、物件等等）中所有可存取的內容：

```kotlin
import org.example.* // 'org.example' 中的所有內容都變得可存取
```

如果存在名稱衝突，您可以使用 `as` 關鍵字來本地重新命名衝突實體以消除歧義：

```kotlin
import org.example.Message // Message 可存取
import org.test.Message as TestMessage // TestMessage 代表 'org.test.Message'
```

`import` 關鍵字不僅限於匯入類別；您還可以用它來匯入其他宣告：

  * 頂層函數和屬性
  * 在 [物件宣告](object-declarations.md#object-declarations-overview) 中宣告的函數和屬性
  * [列舉常數](enum-classes.md)

## 頂層宣告的可見性

如果頂層宣告標記為 `private`，則它對於宣告該宣告的檔案是私有的（請參閱 [可見性修飾符](visibility-modifiers.md)）。