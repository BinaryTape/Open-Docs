---
title: "套件 (Packages) 與引入 (imports)"
---
一個原始碼檔案可能會以套件宣告（package declaration）開始：

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

原始碼檔案的所有內容，例如類別（classes）和函式（functions），都包含在這個套件中。
因此，在上面的範例中，`printMessage()` 的完整名稱是 `org.example.printMessage`，
而 `Message` 的完整名稱是 `org.example.Message`。

如果未指定套件，則此類檔案的內容屬於沒有名稱的 _預設_ 套件（_default_ package）。

## 預設匯入（Default imports）

預設情況下，許多套件會匯入到每個 Kotlin 檔案中：

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

根據目標平台，會匯入其他套件：

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## 匯入（Imports）

除了預設匯入之外，每個檔案都可以包含自己的 `import` 指令。

您可以匯入單個名稱：

```kotlin
import org.example.Message // Message 現在無需限定詞即可存取
```

或匯入範圍內的所有可存取內容：套件、類別、物件等等：

```kotlin
import org.example.* // 'org.example' 中的所有內容都可存取
```

如果存在名稱衝突，您可以使用 `as` 關鍵字來重新命名發生衝突的實體，以消除歧義：

```kotlin
import org.example.Message // Message 可存取
import org.test.Message as TestMessage // TestMessage 代表 'org.test.Message'
```

`import` 關鍵字不限於匯入類別；您也可以使用它來匯入其他宣告：

  * 頂層（top-level）函式和屬性
  * 在 [物件宣告（object declarations）](object-declarations#object-declarations-overview) 中宣告的函式和屬性
  * [列舉常數（enum constants）](enum-classes)

## 頂層宣告的可見性（Visibility of top-level declarations）

如果頂層宣告標記為 `private`，則它對於宣告它的檔案是私有的（請參閱 [可見性修飾詞（Visibility modifiers）](visibility-modifiers)）。