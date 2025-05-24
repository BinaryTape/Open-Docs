---
title: "擴充功能 (Extensions)"
---
Kotlin 提供了使用新功能擴展類別（Class）或介面（Interface）的能力，而無需繼承該類別或使用諸如 _Decorator_ 之類的設計模式。
這是通過稱為 _擴展（extensions）_ 的特殊宣告來完成的。

例如，您可以為來自第三方函式庫的類別或介面編寫新的函數，而您無法修改它們。
這些函數可以像原始類別的方法一樣，以通常的方式調用。
這種機制稱為 _擴展函數（extension function）_。 還有 _擴展屬性（extension properties）_，可讓您為現有類別定義新的屬性。

## 擴展函數（Extension functions）

要宣告一個擴展函數，請在其名稱前加上一個 _接收者類型（receiver type）_，它指的是要擴展的類型。
以下程式碼將 `swap` 函數添加到 `MutableList<Int>`：

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 對應於列表
    this[index1] = this[index2]
    this[index2] = tmp
}
```

擴展函數中的 `this` 關鍵字對應於接收者物件（在點之前傳遞的物件）。
現在，您可以在任何 `MutableList<Int>` 上調用此函數：

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'swap()' 內的 'this' 將持有 'list' 的值
```

這個函數對於任何 `MutableList<T>` 都有意義，您可以將其設為泛型：

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 對應於列表
    this[index1] = this[index2]
    this[index2] = tmp
}
```

您需要在函數名稱之前宣告泛型類型參數，使其在接收者類型表達式中可用。
有關泛型的更多資訊，請參閱 [泛型函數（generic functions）](generics)。

## 擴展是 _靜態_ 解析的

擴展實際上並沒有修改它們擴展的類別。 通過定義擴展，您不會將新成員插入到類別中，而只是使新的函數可以使用點表示法在這種型別的變數上調用。

擴展函數是 _靜態_ 分派的。 因此，調用哪個擴展函數在編譯時已經基於接收者類型已知。 例如：

```kotlin
fun main() {

    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())

}
```

這個範例列印 _Shape_，因為調用的擴展函數僅取決於參數 `s` 的宣告類型，即 `Shape` 類別。

如果一個類別有一個成員函數，並且定義了一個具有相同接收者類型、相同名稱並且適用於給定參數的擴展函數，則 _成員始終優先_。 例如：

```kotlin
fun main() {

    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()

}
```

此程式碼列印 _Class method_。

但是，擴展函數重載具有相同名稱但不同簽名的成員函數是完全可以的：

```kotlin
fun main() {

    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function #$i") }
    
    Example().printFunctionType(1)

}
```

## 可為空的接收者（Nullable receiver）

請注意，可以使用可為空的接收者類型定義擴展。 即使物件變數的值為 null，也可以在該變數上調用這些擴展。 如果接收者是 `null`，則 `this` 也是 `null`。 因此，在定義具有可為空的接收者類型的擴展時，我們建議在函數體內執行 `this == null` 檢查，以避免編譯器錯誤。

您可以在 Kotlin 中調用 `toString()`，而無需檢查 `null`，因為該檢查已經在擴展函數內部進行：

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // 在 null 檢查之後，'this' 會自動轉換為非可空類型，因此下面的 toString()
    // 解析為 Any 類別的成員函數
    return toString()
}
```

## 擴展屬性（Extension properties）

Kotlin 支援擴展屬性，就像它支援函數一樣：

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

:::note
由於擴展實際上並沒有將成員插入到類別中，因此擴展屬性沒有有效的方法來擁有[後備欄位（backing field）](properties#backing-fields)。 這就是 _不允許擴展屬性使用初始化器_ 的原因。 它們的行為只能通過顯式提供 getter/setter 來定義。

:::

範例：

```kotlin
val House.number = 1 // 錯誤：不允許擴展屬性使用初始化器
```

## 伴生物件擴展（Companion object extensions）

如果一個類別定義了[伴生物件（companion object）](object-declarations#companion-objects)，您也可以為伴生物件定義擴展函數和屬性。 就像伴生物件的常規成員一樣，它們可以僅使用類別名稱作為限定符來調用：

```kotlin
class MyClass {
    companion object { }  // 將被稱為 "Companion"
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```

## 擴展的作用域（Scope of extensions）

在大多數情況下，您在頂層（直接在套件（package）下）定義擴展：

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

要在其宣告套件之外使用擴展，請在調用位置匯入它：

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

有關更多資訊，請參閱 [匯入（Imports）](packages#imports)。

## 將擴展宣告為成員（Declaring extensions as members）

您可以在一個類別中宣告另一個類別的擴展。 在這樣的擴展中，存在多個 _隱式接收者（implicit receivers）_ - 可以無需限定符訪問其成員的物件。 宣告擴展的類別的實例稱為 _分發接收者（dispatch receiver）_，而擴展方法的接收者類型的實例稱為 _擴展接收者（extension receiver）_。

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // 調用 Host.printHostname()
        print(":")
        printPort()   // 調用 Connection.printPort()
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // 調用擴展函數
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // 錯誤，擴展函數在 Connection 外部不可用
}
```

如果分發接收者的成員和擴展接收者的成員之間存在名稱衝突，則擴展接收者優先。 要引用分發接收者的成員，您可以使用[限定的 `this` 語法（qualified `this` syntax）](this-expressions#qualified-this)。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // 調用 Host.toString()
        this@Connection.toString()  // 調用 Connection.toString()
    }
}
```

宣告為成員的擴展可以宣告為 `open` 並且可以在子類別中覆寫。 這意味著此類函數的分派對於分發接收者類型是虛擬的，但對於擴展接收者類型是靜態的。

```kotlin
open class Base { }

class Derived : Base() { }

open class BaseCaller {
    open fun Base.printFunctionInfo() {
        println("Base extension function in BaseCaller")
    }

    open fun Derived.printFunctionInfo() {
        println("Derived extension function in BaseCaller")
    }

    fun call(b: Base) {
        b.printFunctionInfo()   // 調用擴展函數
    }
}

class DerivedCaller: BaseCaller() {
    override fun Base.printFunctionInfo() {
        println("Base extension function in DerivedCaller")
    }

    override fun Derived.printFunctionInfo() {
        println("Derived extension function in DerivedCaller")
    }
}

fun main() {
    BaseCaller().call(Base())   // "Base extension function in BaseCaller"
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - 分發接收者是虛擬解析的
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - 擴展接收者是靜態解析的
}
```

## 關於可見性的說明（Note on visibility）

擴展使用與在相同作用域中宣告的常規函數相同的[可見性修飾符（visibility modifiers）](visibility-modifiers)。
例如：

* 在文件頂層宣告的擴展可以訪問同一文件中的其他 `private` 頂層宣告。
* 如果在接收者類型外部宣告擴展，則它無法訪問接收者的 `private` 或 `protected` 成員。