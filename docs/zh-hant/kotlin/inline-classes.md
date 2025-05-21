---
title: "行內值類別 (Inline value classes)"
---
有時，將數值包裝在類別中以建立更特定於網域的類型會很有用。但是，它會因額外的堆積記憶體配置而引入執行時額外負荷。此外，如果包裝的類型是基本類型，則效能損失會很顯著，因為基本類型通常由執行時高度最佳化，而它們的包裝器 (wrapper) 不會獲得任何特殊處理。

為了要解決這些問題，Kotlin 引入了一種特殊的類別，稱為 *inline class*（內聯類別）。內聯類別是 [value-based classes](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes)（基於值的類別）的一個子集。它們沒有識別標記 (identity)，只能保存數值。

要宣告一個內聯類別，請在類別名稱之前使用 `value` 修飾符：

```kotlin
value class Password(private val s: String)
```

要為 JVM 後端宣告一個內聯類別，請在類別宣告之前使用 `value` 修飾符以及 `@JvmInline` 註解：

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

一個內聯類別必須在主要建構函式中初始化一個單一屬性。在執行時，內聯類別的實例將使用這個單一屬性來表示（請參閱[下方](#representation)有關執行時表示的詳細資訊）：

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production") 
```

這是內聯類別的主要特點，它啟發了 *inline*（內聯）這個名稱：類別的資料會 *inlined*（內聯）到它的用法中（類似於 [inline functions](inline-functions)（內聯函式）的內容如何內聯到呼叫點）。

## 成員 (Members)

內聯類別支援常規類別的一些功能。特別是，它們允許宣告屬性和函式，具有 `init` 區塊和 [secondary constructors](classes#secondary-constructors)（次要建構函式）：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    init {
        require(fullName.isNotEmpty()) {
            "Full name shouldn't be empty"
        }
    }

    constructor(firstName: String, lastName: String) : this("$firstName $lastName") {
        require(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }

    val length: Int
        get() = fullName.length

    fun greet() {
        println("Hello, $fullName")
    }
}

fun main() {
    val name1 = Person("Kotlin", "Mascot")
    val name2 = Person("Kodee")
    name1.greet() // the `greet()` function is called as a static method
    println(name2.length) // property getter is called as a static method
}
```

內聯類別屬性不能有 [backing fields](properties#backing-fields)（後備欄位）。它們只能有簡單的可計算屬性（沒有 `lateinit`/委託屬性）。

## 繼承 (Inheritance)

內聯類別允許從介面繼承：

```kotlin
interface Printable {
    fun prettyPrint(): String
}

@JvmInline
value class Name(val s: String) : Printable {
    override fun prettyPrint(): String = "Let's $s!"
}

fun main() {
    val name = Name("Kotlin")
    println(name.prettyPrint()) // Still called as a static method
}
```

禁止內聯類別參與類別層級結構。這意味著內聯類別不能擴展其他類別，並且始終是 `final`（最終類別）。

## 表示 (Representation)

在產生的程式碼中，Kotlin 編譯器為每個內聯類別保留一個 *wrapper*（包裝器）。內聯類別實例可以在執行時表示為包裝器或作為底層類型。這類似於 `Int` 如何 [represented](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine)（表示）為基本類型 `int` 或作為包裝器 `Integer`。

Kotlin 編譯器會優先使用底層類型而不是包裝器，以產生效能最高且最佳化的程式碼。但是，有時有必要保留包裝器。作為經驗法則，當內聯類別用作另一種類型時，它們會被裝箱 (boxed)。

```kotlin
interface I

@JvmInline
value class Foo(val i: Int) : I

fun asInline(f: Foo) {}
fun <T> asGeneric(x: T) {}
fun asInterface(i: I) {}
fun asNullable(i: Foo?) {}

fun <T> id(x: T): T = x

fun main() {
    val f = Foo(42) 
    
    asInline(f)    // unboxed: used as Foo itself
    asGeneric(f)   // boxed: used as generic type T
    asInterface(f) // boxed: used as type I
    asNullable(f)  // boxed: used as Foo?, which is different from Foo
    
    // below, 'f' first is boxed (while being passed to 'id') and then unboxed (when returned from 'id') 
    // In the end, 'c' contains unboxed representation (just '42'), as 'f' 
    val c = id(f)  
}
```

由於內聯類別可以表示為底層數值和包裝器，因此 [referential equality](equality#referential-equality)（引用相等性）對它們來說毫無意義，因此是被禁止的。

內聯類別也可以具有泛型類型參數作為底層類型。在這種情況下，編譯器會將其映射到 `Any?`，或者通常映射到類型參數的上限。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // compiler generates fun compute-<hashcode>(s: Any?)
```

### Mangling（名稱修飾）

由於內聯類別會編譯為它們的底層類型，因此可能會導致各種模糊的錯誤，例如意外的平台簽章衝突：

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

為了減輕這些問題，使用內聯類別的函式會被 *mangled*（修飾），方法是在函式名稱中新增一些穩定的雜湊碼 (hashcode)。因此，`fun compute(x: UInt)` 將表示為 `public final void compute-<hashcode>(int x)`，這解決了衝突問題。

### 從 Java 程式碼呼叫 (Calling from Java code)

您可以從 Java 程式碼呼叫接受內聯類別的函式。為此，您應該手動停用名稱修飾：在函式宣告之前新增 `@JvmName` 註解：

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

## 內聯類別 vs 類型別名 (Inline classes vs type aliases)

乍看之下，內聯類別看起來與 [type aliases](type-aliases)（類型別名）非常相似。事實上，兩者似乎都引入了一種新類型，並且兩者都將在執行時表示為底層類型。

但是，關鍵的區別在於類型別名與它們的底層類型（以及具有相同底層類型的其他類型別名）是 *assignment-compatible*（賦值相容），而內聯類別則不然。

換句話說，內聯類別引入了一種真正的 *new*（新）類型，與類型別名相反，類型別名僅為現有類型引入一個替代名稱（別名）：

```kotlin
typealias NameTypeAlias = String

@JvmInline
value class NameInlineClass(val s: String)

fun acceptString(s: String) {}
fun acceptNameTypeAlias(n: NameTypeAlias) {}
fun acceptNameInlineClass(p: NameInlineClass) {}

fun main() {
    val nameAlias: NameTypeAlias = ""
    val nameInlineClass: NameInlineClass = NameInlineClass("")
    val string: String = ""

    acceptString(nameAlias) // OK: pass alias instead of underlying type
    acceptString(nameInlineClass) // Not OK: can't pass inline class instead of underlying type

    // And vice versa:
    acceptNameTypeAlias(string) // OK: pass underlying type instead of alias
    acceptNameInlineClass(string) // Not OK: can't pass underlying type instead of inline class
}
```

## 內聯類別和委託 (Inline classes and delegation)

允許透過委託將介面的實作委託給內聯類別中內聯的值：

```kotlin
interface MyInterface {
    fun bar()
    fun foo() = "foo"
}

@JvmInline
value class MyInterfaceWrapper(val myInterface: MyInterface) : MyInterface by myInterface

fun main() {
    val my = MyInterfaceWrapper(object : MyInterface {
        override fun bar() {
            // body
        }
    })
    println(my.foo()) // prints "foo"
}
```