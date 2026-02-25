[//]: # (title: 函式 (SAM) 介面)

僅包含一個抽象成員函式的介面稱為 *函式介面*，或稱為 *單一抽象方法 (SAM) 介面*。函式介面可以有多個非抽象成員函式，但只能有一個抽象成員函式。

若要在 Kotlin 中宣告函式介面，請使用 `fun` 修飾詞。

```kotlin
fun interface KRunnable {
    fun invoke()
}
```

## SAM 轉換

對於函式介面，您可以使用 SAM 轉換，透過 [Lambda 運算式](lambdas.md#lambda-expressions-and-anonymous-functions) 使您的程式碼更加簡潔且易讀。

您可以使用 Lambda 運算式，而不必手動建立實作函式介面的類別。透過 SAM 轉換，Kotlin 可以將簽章與介面的單一方法簽章相符的任何 Lambda 運算式轉換為動態具現化介面實作的程式碼。

例如，考慮以下 Kotlin 函式介面：

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}
```

如果您不使用 SAM 轉換，則需要編寫如下程式碼：

```kotlin
// 建立類別的執行個體
val isEven = object : IntPredicate {
    override fun accept(i: Int): Boolean {
        return i % 2 == 0
    }
}
```

藉由利用 Kotlin 的 SAM 轉換，您可以改為編寫以下等效程式碼：

```kotlin
// 使用 Lambda 建立執行個體
val isEven = IntPredicate { it % 2 == 0 }
```

簡短的 Lambda 運算式取代了所有不必要的程式碼。

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

您也可以對 [Java 介面使用 SAM 轉換](java-interop.md#sam-conversions)。

## 從具有建構函式的介面遷移到函式介面

從 1.6.20 開始，Kotlin 支援對函式介面建構函式的 [可呼叫參照](reflection.md#callable-references)，這增加了一種原始碼相容的方式，可以從具有建構函式的介面遷移到函式介面。考慮以下程式碼：

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer {
    override fun print() = block()
}
```

在啟用函式介面建構函式的可呼叫參照後，此程式碼可以僅用函式介面宣告來取代：

```kotlin
fun interface Printer { 
    fun print()
}
```

它的建構函式將會隱含地建立，並且任何使用 `::Printer` 函式參照的程式碼都能編譯。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```

透過將舊版函式 `Printer` 標記為 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 註解，並將 `DeprecationLevel` 設定為 `HIDDEN`，來保持二進制相容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 函式介面 vs. 型別別名

您也可以使用函式型別的 [型別別名](type-aliases.md) 簡單地改寫上述內容：

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
    println("Is 7 even? - ${isEven(7)}")
}
```

然而，函式介面與 [型別別名](type-aliases.md) 的用途不同。型別別名只是現有型別的名稱——它們不會建立新型別，而函式介面會。您可以提供特定於特定函式介面的擴充，使其不適用於一般函式或其型別別名。

型別別名只能有一個成員，而函式介面可以有多個非抽象成員函式和一個抽象成員函式。函式介面也可以實作及繼承其他介面。

函式介面比型別別名更具彈性且提供更多功能，但在語法和執行時的成本可能更高，因為它們可能需要轉換為特定的介面。當您在程式碼中選擇使用哪一個時，請考慮您的需求：
* 如果您的 API 需要接受具有特定參數和傳回型別的函式（任何函式）——請使用簡單的函式型別或定義型別別名來為對應的函式型別提供較短的名稱。
* 如果您的 API 接受比函式更複雜的實體——例如，它具有非顯著的契約和/或無法在函式型別的簽章中表達的操作——請為其宣告一個獨立的函式介面。