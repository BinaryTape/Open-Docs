[//]: # (title: 函數式 (SAM) 介面)

只有一個抽象成員函式的介面稱為 _函數式介面_，或 _單一抽象方法 (SAM) 介面_。函數式介面可以有多個非抽象成員函式，但只能有一個抽象成員函式。

要在 Kotlin 中宣告一個函數式介面，請使用 `fun` 修飾符。

```kotlin
fun interface KRunnable {
    fun invoke()
}
```

## SAM 轉換

對於函數式介面，您可以使用 SAM 轉換，透過使用 [lambda 表達式](lambdas.md#lambda-expressions-and-anonymous-functions) 來使您的程式碼更簡潔易讀。

您可以使用 lambda 表達式，而不是手動建立一個實作函數式介面的類別。透過 SAM 轉換，Kotlin 可以將任何其簽章與介面單一方法簽章相符的 lambda 表達式，轉換為動態實例化該介面實作的程式碼。

例如，考慮以下 Kotlin 函數式介面：

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}
```

如果您不使用 SAM 轉換，您將需要編寫以下程式碼：

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
    override fun accept(i: Int): Boolean {
        return i % 2 == 0
    }
}
```

藉由利用 Kotlin 的 SAM 轉換，您可以改為編寫以下等效程式碼：

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

一個簡短的 lambda 表達式取代了所有不必要的程式碼。

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

## 從具有建構函式的介面遷移到函數式介面

從 1.6.20 版本開始，Kotlin 支援函數式介面建構函式的 [可呼叫參考](reflection.md#callable-references)，這提供了一種原始碼相容的方式，可以從具有建構函式的介面遷移到函數式介面。
考慮以下程式碼：

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer {
    override fun print() = block()
}
```

啟用函數式介面建構函式的可呼叫參考後，這段程式碼可以替換為單純的函數式介面宣告：

```kotlin
fun interface Printer { 
    fun print()
}
```

其建構函式將會隱式建立，並且任何使用 `::Printer` 函式參考的程式碼都將會編譯成功。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```

透過使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 註解並設定 `DeprecationLevel.HIDDEN` 來標記舊有的 `Printer` 函式，以保留二進位相容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 函數式介面與型別別名

您也可以簡單地使用函式型別的 [型別別名](type-aliases.md) 來重寫上述內容：

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
    println("Is 7 even? - ${isEven(7)}")
}
```

然而，函數式介面和 [型別別名](type-aliases.md) 的用途不同。
型別別名只是現有型別的名稱 – 它們不會建立一個新類型，而函數式介面則會。
您可以提供特定於某個函數式介面的擴充功能，使其不適用於普通函式或其型別別名。

型別別名只能有一個成員，而函數式介面可以有多個非抽象成員函式和一個抽象成員函式。
函數式介面也可以實作並擴充其他介面。

函數式介面比型別別名更靈活，並提供更多功能，但它們在語法上和執行時期可能更耗費資源，因為它們可能需要轉換為特定的介面。
當您在程式碼中選擇使用哪一個時，請考慮您的需求：
*   如果您的 API 需要接受一個具有特定參數和返回型別的函式（任何函式）——請使用簡單的函式型別或定義一個型別別名來為相應的函式型別提供一個更短的名稱。
*   如果您的 API 接受一個比函式更複雜的實體——例如，它具有非平凡的契約和/或在其上的操作不能在函式型別的簽章中表達——則為其宣告一個單獨的函數式介面。