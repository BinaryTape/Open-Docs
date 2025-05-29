[//]: # (title: 擴充功能)

Kotlin 提供了擴充類別或介面以新增功能的能力，而無需繼承該類別或使用諸如 _裝飾器 (Decorator)_ 等設計模式。這是透過稱為 _擴充功能 (extensions)_ 的特殊宣告來完成的。

例如，你可以為一個無法修改的第三方函式庫中的類別或介面編寫新函式。這些函式可以像原始類別的方法一樣，以慣常方式呼叫。此機制稱為 _擴充函式 (extension function)_。還有 _擴充屬性 (extension properties)_，它們讓你能夠為現有類別定義新屬性。

## 擴充函式

要宣告擴充函式，請在其名稱前加上一個 _接收者類型 (receiver type)_，這指的是被擴充的類型。以下為 `MutableList<Int>` 新增了一個 `swap` 函式：

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 對應於該列表
    this[index1] = this[index2]
    this[index2] = tmp
}
```

擴充函式內的 `this` 關鍵字對應於接收者物件（即在點號前傳遞的物件）。現在，你可以在任何 `MutableList<Int>` 上呼叫此類函式：

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'this' 在 'swap()' 內部將會持有 'list' 的值
```

此函式適用於任何 `MutableList<T>`，你可以將其泛型化：

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 對應於該列表
    this[index1] = this[index2]
    this[index2] = tmp
}
```

你需要將泛型類型參數宣告在函式名稱之前，以使其在接收者類型表達式中可用。有關泛型的更多資訊，請參閱[泛型函式](generics.md)。

## 擴充功能是 _靜態 (statically)_ 解析的

擴充功能實際上並未修改它們所擴充的類別。透過定義擴充功能，你並不是將新成員插入類別中，而只是讓新函式能夠透過點號表示法 (dot-notation) 在此類型的變數上呼叫。

擴充函式是 _靜態_ 派發的。因此，哪個擴充函式被呼叫已在編譯時根據接收者類型得知。例如：

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

此範例印出 _Shape_，因為被呼叫的擴充函式僅取決於參數 `s` 的宣告類型，即 `Shape` 類別。

如果一個類別有一個成員函式，並且定義了一個具有相同接收者類型、相同名稱且適用於給定引數的擴充函式，那麼 _成員永遠勝出_。例如：

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

這段程式碼印出 _Class method_。

然而，擴充函式多載具有相同名稱但不同簽章的成員函式是完全沒問題的：

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

## 可為 null 的接收者

請注意，擴充功能可以定義為可為 null 的接收者類型。即使其值為 null，這些擴充功能也可以在物件變數上呼叫。如果接收者為 `null`，則 `this` 也為 `null`。因此，當定義具有可為 null 的接收者類型的擴充功能時，我們建議在函式主體內執行 `this == null` 檢查，以避免編譯器錯誤。

在 Kotlin 中，你無需檢查 `null` 即可呼叫 `toString()`，因為檢查已在擴充函式內部發生：

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // 在 null 檢查之後，'this' 被自動轉型為非 null 類型，因此下面的 toString()
    // 解析為 Any 類別的成員函式
    return toString()
}
```

## 擴充屬性

Kotlin 支援擴充屬性，就像它支援函式一樣：

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

> 由於擴充功能實際上並未將成員插入類別中，因此擴充屬性無法有效率地擁有[支援欄位](properties.md#backing-fields)。這就是為什麼_擴充屬性不允許使用初始化器 (initializers)_。它們的行為只能透過明確提供 getter/setter 來定義。
>
{style="note"}

範例：

```kotlin
val House.number = 1 // 錯誤：擴充屬性不允許使用初始化器
```

## 伴隨物件擴充功能

如果一個類別定義了[伴隨物件](object-declarations.md#companion-objects)，你也可以為伴隨物件定義擴充函式和屬性。就像伴隨物件的常規成員一樣，它們可以僅使用類別名稱作為限定符呼叫：

```kotlin
class MyClass {
    companion object { }  // 將被稱為 "Companion"
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 擴充功能的作用域

在大多數情況下，你在頂層，直接在套件 (packages) 下定義擴充功能：

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/ }
```

要在其宣告的套件外部使用擴充功能，請在呼叫處匯入 (import) 它：

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

有關更多資訊，請參閱[匯入](packages.md#imports)。

## 將擴充功能宣告為成員

你可以在另一個類別內部為一個類別宣告擴充功能。在此類擴充功能內部，有多個 _隱式接收者 (implicit receivers)_——無需限定符即可存取其成員的物件。宣告擴充功能的類別實例稱為 _派發接收者 (dispatch receiver)_，而擴充方法的接收者類型實例稱為 _擴充接收者 (extension receiver)_。

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // 呼叫 Host.printHostname()
        print(":")
        printPort()   // 呼叫 Connection.printPort()
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // 呼叫擴充函式
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // 錯誤，擴充函式在 Connection 外部不可用
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果派發接收者和擴充接收者的成員之間存在名稱衝突，則擴充接收者優先。要引用派發接收者的成員，你可以使用[限定的 `this` 語法](this-expressions.md#qualified-this)。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // 呼叫 Host.toString()
        this@Connection.toString()  // 呼叫 Connection.toString()
    }
}
```

宣告為成員的擴充功能可以宣告為 `open` 並在子類別中覆寫。這表示此類函式的派發對於派發接收者類型是虛擬的，但對於擴充接收者類型是靜態的。

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
        b.printFunctionInfo()   // 呼叫擴充函式
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
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - 派發接收者虛擬解析
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - 擴充接收者靜態解析
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 可見性注意事項

擴充功能利用與在相同作用域 (scope) 中宣告的常規函式相同的[可見性修飾符 (visibility modifiers)]。例如：

* 宣告在檔案頂層的擴充功能可以存取同一檔案中其他 `private` 頂層宣告。
* 如果擴充功能在其接收者類型外部宣告，則無法存取接收者的 `private` 或 `protected` 成員。