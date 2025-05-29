[//]: # (title: 內聯值類別)

有時，將值包裝在類別中以建立更具領域特定性 (domain-specific) 的型別會很有用。然而，這會由於額外的堆 (heap) 記憶體分配而引入執行時 (runtime) 開銷。此外，如果被包裝的型別是基本型別 (primitive type)，效能影響將會很顯著，因為基本型別通常會被執行時環境大幅優化，而其包裝器 (wrapper) 則不會獲得任何特殊處理。

為了解決這些問題，Kotlin 引入了一種特殊的類別，稱為 _內聯類別 (inline class)_。內聯類別是 [基於值的類別 (value-based classes)](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md) 的子集。它們沒有獨立的身份 (identity)，並且只能持有值。

若要宣告內聯類別，請在類別名稱前使用 `value` 修飾符：

```kotlin
value class Password(private val s: String)
```

若要為 JVM 後端宣告內聯類別，請在類別宣告前使用 `value` 修飾符以及 `@JvmInline` 註解：

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

內聯類別必須在主要建構子 (primary constructor) 中初始化單一屬性。在執行時，內聯類別的實例 (instance) 將使用此單一屬性表示（詳細資訊請參閱 [下方](#representation) 的執行時表示）：

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production")
```

這是內聯類別的主要特性，也正是其名稱 *inline* 的靈感來源：類別的資料會被 *內聯* 到其使用處（類似於 [內聯函數 (inline functions)](inline-functions.md) 的內容如何被內聯到呼叫點 (call sites)）。

## 成員

內聯類別支援常規類別的一些功能。特別是，它們可以宣告屬性 (property) 和函數 (function)，擁有 `init` 區塊和 [次要建構子 (secondary constructor)](classes.md#secondary-constructors)：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

內聯類別的屬性不能擁有 [支援欄位 (backing field)](properties.md#backing-fields)。它們只能擁有簡單的可計算屬性 (computable property)（不能有 `lateinit`/委託屬性 (delegated property)）。

## 繼承

內聯類別允許繼承自介面 (interface)：

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

內聯類別禁止參與類別層次結構 (class hierarchy)。這表示內聯類別不能擴展其他類別，並且始終是 `final` 的。

## 表示

在生成的程式碼中，Kotlin 編譯器為每個內聯類別保留一個 *包裝器 (wrapper)*。內聯類別實例在執行時可以表示為包裝器或底層型別 (underlying type)。這類似於 `Int` 如何被 [表示](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine) 為基本型別 `int` 或包裝器 `Integer`。

Kotlin 編譯器將優先使用底層型別而非包裝器，以產生最高效能和最佳化的程式碼。然而，有時必須保留包裝器。通常來說，內聯類別在作為另一種型別使用時會被裝箱 (boxed)。

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

因為內聯類別可以同時表示為底層值和包裝器，所以 [引用相等性 (referential equality)](equality.md#referential-equality) 對它們沒有意義，因此被禁止。

內聯類別也可以將泛型型別參數 (generic type parameter) 作為底層型別。在這種情況下，編譯器會將其映射到 `Any?`，或者通常是映射到型別參數的上限 (upper bound)。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // compiler generates fun compute-<hashcode>(s: Any?)
```

### 名稱混淆 (Mangling)

由於內聯類別會被編譯成其底層型別，這可能導致各種不明顯的錯誤，例如意外的平台簽名衝突 (platform signature clash)：

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

為了緩解此類問題，使用內聯類別的函數會透過在函數名稱中添加一些穩定的哈希碼 (hashcode) 來進行 _名稱混淆 (mangled)_。因此，`fun compute(x: UInt)` 將表示為 `public final void compute-<hashcode>(int x)`，這解決了衝突問題。

### 從 Java 程式碼呼叫

您可以從 Java 程式碼呼叫接受內聯類別的函數。為此，您應該手動禁用名稱混淆：在函數宣告前添加 `@JvmName` 註解：

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

## 內聯類別與型別別名

乍看之下，內聯類別與 [型別別名 (type alias)](type-aliases.md) 似乎非常相似。確實，兩者都似乎引入了新的型別，並且都會在執行時表示為底層型別。

然而，關鍵的區別在於型別別名與其底層型別（以及與具有相同底層型別的其他型別別名）是 *賦值兼容 (assignment-compatible)* 的，而內聯類別則不然。

換句話說，內聯類別引入了一個真正 _新_ 的型別，與僅為現有型別引入替代名稱（別名）的型別別名相反：

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

## 內聯類別與委託

透過委託 (delegation) 給內聯類別的內聯值進行實作 (implementation) 在介面中是允許的：

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