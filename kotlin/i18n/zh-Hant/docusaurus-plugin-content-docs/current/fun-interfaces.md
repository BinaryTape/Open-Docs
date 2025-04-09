---
title: "函數介面 (SAM)"
---
只有一個抽象成員函式的介面稱作 _functional interface_ (函式介面)，或 _Single Abstract Method (SAM) interface_ (單一抽象方法介面)。 函式介面可以有多個非抽象成員函式，但只能有一個抽象成員函式。

若要在 Kotlin 中宣告函式介面，請使用 `fun` 修飾詞。

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAM 轉換 (SAM conversions)

對於函式介面，您可以使用 SAM 轉換 (SAM conversions)，透過使用 [lambda 運算式](lambdas#lambda-expressions-and-anonymous-functions)來幫助您的程式碼更簡潔易讀。

您可以使用 lambda 運算式，而不需要手動建立一個類別來實作函式介面。 透過 SAM 轉換 (SAM conversion)，Kotlin 可以將任何簽章符合介面單一方法簽章的 lambda 運算式轉換為程式碼，該程式碼會動態地實例化介面實作。

例如，考慮以下 Kotlin 函式介面：

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

如果您不使用 SAM 轉換 (SAM conversion)，您將需要編寫如下的程式碼：

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

透過利用 Kotlin 的 SAM 轉換 (SAM conversion)，您可以改為編寫以下等效的程式碼：

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

簡短的 lambda 運算式取代了所有不必要的程式碼。

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven.accept(7)}")
}
```

您也可以將 [SAM 轉換 (SAM conversions) 用於 Java 介面](java-interop#sam-conversions)。

## 從具有建構子函式的介面遷移到函式介面 (Migration from an interface with constructor function to a functional interface)

從 1.6.20 開始，Kotlin 支援對函式介面建構子的 [可調用引用](reflection#callable-references)，這增加了一種原始碼相容的方式，可以從具有建構子函式的介面遷移到函式介面。
請考慮以下程式碼：

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () `->` Unit): Printer = object : Printer { override fun print() = block() }
```

啟用對函式介面建構子的可調用引用後，此程式碼可以用函式介面宣告替換：

```kotlin
fun interface Printer { 
    fun print()
}
```

它的建構子將被隱式地建立，並且任何使用 `::Printer` 函式引用的程式碼都將被編譯。 例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```

透過使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)
註解和 `DeprecationLevel.HIDDEN` 標記舊版函式 `Printer`，以保留二進位相容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 函式介面 vs. 型別別名 (Functional interfaces vs. type aliases)

您也可以簡單地使用 [型別別名](type-aliases) 來重寫上述程式碼：

```kotlin
typealias IntPredicate = (i: Int) `->` Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven(7)}")
}
```

然而，函式介面和[型別別名](type-aliases)有不同的用途。
型別別名只是現有型別的名稱 – 它們不會建立新的型別，而函式介面則會。
您可以提供特定於特定函式介面的擴充，使其不適用於普通函式或其型別別名。

型別別名只能有一個成員，而函式介面可以有多個非抽象成員函式和一個抽象成員函式。
函式介面也可以實作和擴充其他介面。

函式介面比型別別名更靈活，並提供更多功能，但它們在語法和運行時上的成本可能更高，因為它們可能需要轉換為特定的介面。
當您選擇在程式碼中使用哪一個時，請考慮您的需求：
* 如果您的 API 需要接受具有某些特定參數和傳回型別的函式（任何函式）– 請使用簡單的函式型別或定義型別別名，以便為相應的函式型別提供更短的名稱。
* 如果您的 API 接受比函式更複雜的實體 – 例如，它具有非平凡的合約和/或對它的操作，這些操作無法在函式型別的簽章中表達 – 請為其宣告一個單獨的函式介面。