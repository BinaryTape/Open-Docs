[//]: # (title: 功能 (SAM) 介面)

只有一個抽象成員函數的介面被稱為 _功能介面_，或 _單一抽象方法 (SAM) 介面_。功能介面可以有多個非抽象成員函數，但只有一個抽象成員函數。

在 Kotlin 中宣告功能介面時，請使用 `fun` 修飾符。

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAM 轉換

對於功能介面，您可以使用 SAM 轉換，透過使用 [Lambda 表達式](lambdas.md#lambda-expressions-and-anonymous-functions) 來幫助您的程式碼更簡潔、可讀性更高。

您可以使用 Lambda 表達式，而不是手動建立一個實作功能介面的類別。透過 SAM 轉換，Kotlin 可以將任何簽章與介面單一方法簽章相符的 Lambda 表達式轉換為程式碼，該程式碼會動態實例化介面實作。

例如，考慮以下 Kotlin 功能介面：

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

如果您不使用 SAM 轉換，您需要編寫如下程式碼：

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

透過利用 Kotlin 的 SAM 轉換，您可以改為編寫以下等效程式碼：

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

簡短的 Lambda 表達式取代了所有不必要的程式碼。

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

您也可以將 [SAM 轉換用於 Java 介面](java-interop.md#sam-conversions)。

## 從帶建構函數的介面遷移到功能介面

從 1.6.20 版本開始，Kotlin 支援功能介面建構函數的 [可呼叫參考](reflection.md#callable-references)，這提供了一種原始碼相容的方式，可以從帶建構函數的介面遷移到功能介面。考慮以下程式碼：

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

啟用功能介面建構函數的可呼叫參考後，此程式碼可以僅用一個功能介面宣告取代：

```kotlin
fun interface Printer { 
    fun print()
}
```

它的建構函數將會被隱式建立，並且任何使用 `::Printer` 函數參考的程式碼都將會編譯成功。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```

透過使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 註解並將 `DeprecationLevel.HIDDEN` 標記在遺留函數 `Printer` 上，來保持二進位相容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 功能介面 與 型別別名

您也可以簡單地使用功能型別的 [型別別名](type-aliases.md) 來重寫上述內容：

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven(7)}")
}
```

然而，功能介面和 [型別別名](type-aliases.md) 服務於不同的目的。型別別名僅僅是現有型別的名稱 – 它們不會建立新型別，而功能介面會。您可以提供專用於特定功能介面的擴充功能，使其不適用於普通函數或其型別別名。

型別別名只能有一個成員，而功能介面可以有多個非抽象成員函數和一個抽象成員函數。功能介面還可以實作並擴充其他介面。

功能介面比型別別名更靈活，並提供更多功能，但它們在語法上和執行時都可能代價更高，因為它們可能需要轉換為特定的介面。
當您在程式碼中選擇使用哪一個時，請考慮您的需求：
*   如果您的 API 需要接受一個帶有特定參數和回傳型別的函數（任何函數）– 使用簡單的功能型別，或定義一個型別別名來為對應的功能型別提供更短的名稱。
*   如果您的 API 接受一個比函數更複雜的實體 – 例如，它具有非平凡的契約和/或無法在功能型別簽章中表達的操作 – 請為其宣告一個單獨的功能介面。