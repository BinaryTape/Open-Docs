[//]: # (title: 擴充功能)

Kotlin 提供了為類別或介面擴充新功能的能力，而無需繼承該類別或使用諸如 _裝飾器模式_ 之類的設計模式。
這透過稱為 _擴充功能_ 的特殊宣告來完成。

例如，您可以為您無法修改的第三方函式庫中的類別或介面撰寫新函式。
這些函式可以像原始類別的方法一樣，以通常的方式呼叫。
這種機制稱為 _擴充函式_。還存在 _擴充屬性_，讓您可以為現有類別定義新屬性。

## 擴充函式

要宣告一個擴充函式，請在其名稱前加上一個 _接收者類型_，它指的是被擴充的類型。
以下將 `swap` 函式新增到 `MutableList<Int>`：

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' corresponds to the list
    this[index1] = this[index2]
    this[index2] = tmp
}
```

擴充函式內的 `this` 關鍵字對應於接收者物件（即點號前傳遞的物件）。
現在，您可以在任何 `MutableList<Int>` 上呼叫此類函式：

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'list'
```

此函式適用於任何 `MutableList<T>`，您可以使其泛型化：

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' corresponds to the list
    this[index1] = this[index2]
    this[index2] = tmp
}
```

您需要將泛型類型參數宣告在函式名稱之前，以使其在接收者類型表達式中可用。
有關泛型的更多資訊，請參閱 [泛型函式](generics.md)。

## 擴充功能是 _靜態_ 解析的

擴充功能並未真正修改它們所擴充的類別。透過定義擴充功能，您並非在類別中插入新成員，而僅是使該類型的變數能夠透過點符號呼叫新函式。

擴充函式是 _靜態分派_ 的。因此，哪個擴充函式被呼叫在編譯時就已根據接收者類型確定。例如：

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

這個範例印出 _Shape_，因為被呼叫的擴充函式僅取決於參數 `s` 的宣告類型，即 `Shape` 類別。

如果一個類別有一個成員函式，並且定義了一個具有相同接收者類型、相同名稱且適用於給定引數的擴充函式，那麼 _成員函式總是優先_。例如：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此程式碼印出 _Class method_。

然而，擴充函式可以完全正常地重載與成員函式同名但簽名不同的函式：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function #$i") }
    
    Example().printFunctionType(1)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 可空接收者

請注意，擴充功能可以定義為可空接收者類型。即使物件變數的值為 null，也可以呼叫這些擴充功能。如果接收者為 `null`，則 `this` 也為 `null`。因此，在定義具有可空接收者類型的擴充功能時，我們建議在函式主體內執行 `this == null` 檢查，以避免編譯器錯誤。

在 Kotlin 中，您可以直接呼叫 `toString()` 而無需檢查 `null`，因為檢查已在擴充函式內部進行：

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // After the null check, 'this' is autocast to a non-nullable type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```

## 擴充屬性

Kotlin 支援擴充屬性，就像它支援函式一樣：

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

> 由於擴充功能並未真正將成員插入類別中，因此擴充屬性沒有有效的方法來擁有 [支援欄位](properties.md#backing-fields)。這就是為什麼 _擴充屬性不允許使用初始化器_。它們的行為只能透過明確提供 getter/setter 來定義。
>
{style="note"}

範例：

```kotlin
val House.number = 1 // error: initializers are not allowed for extension properties
```

## 伴動物件擴充

如果一個類別定義了 [伴動物件](object-declarations.md#companion-objects)，您也可以為該伴動物件定義擴充函式和屬性。就像伴動物件的常規成員一樣，它們可以使用類別名稱作為限定符來呼叫：

```kotlin
class MyClass {
    companion object { }  // will be called "Companion"
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 擴充的範圍

在大多數情況下，您在頂層（直接在套件下）定義擴充功能：

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

要在其宣告套件之外使用擴充功能，請在呼叫點匯入它：

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

有關更多資訊，請參閱 [匯入](packages.md#imports)。

## 將擴充功能宣告為成員

您可以在一個類別內部宣告另一個類別的擴充功能。在此類擴充功能內部，存在多個 _隱式接收者_ ——它們的成員無需限定符即可存取。宣告擴充功能的類別的實例稱為 _分派接收者_，而擴充方法的接收者類型的實例稱為 _擴充接收者_。

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // calls Host.printHostname()
        print(":")
        printPort()   // calls Connection.printPort()
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // calls the extension function
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // error, the extension function is unavailable outside Connection
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果分派接收者和擴充接收者的成員之間存在名稱衝突，則擴充接收者優先。要引用分派接收者的成員，您可以使用 [限定的 `this` 語法](this-expressions.md#qualified-this)。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // calls Host.toString()
        this@Connection.toString()  // calls Connection.toString()
    }
}
```

宣告為成員的擴充功能可以宣告為 `open` 並在子類別中覆寫。這意味著此類函式的分派對於分派接收者類型是虛擬的，但對於擴充接收者類型是靜態的。

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
        b.printFunctionInfo()   // call the extension function
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
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - dispatch receiver is resolved virtually
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - extension receiver is resolved statically
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 可見性說明

擴充功能利用與在相同範圍內宣告的常規函式相同的 [可見性修飾符](visibility-modifiers.md)。
例如：

* 宣告在檔案頂層的擴充功能可以存取同檔案中的其他 `private` 頂層宣告。
* 如果擴充功能宣告在其接收者類型之外，則它無法存取接收者的 `private` 或 `protected` 成員。