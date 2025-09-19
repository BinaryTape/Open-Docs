[//]: # (title: 內聯值類別)

有時將值封裝在類別中以建立更具領域特定性的型別會很有用。然而，這會因為額外的堆積記憶體分配而引入執行時期開銷。此外，如果被封裝的型別是基本型別，效能損失會非常顯著，因為基本型別通常會被執行時期高度最佳化，而其包裝器則不會得到任何特殊處理。

為了解決這些問題，Kotlin 引入了一種特殊型別的類別，稱為 _內聯類別_。內聯類別是 [基於值的類別](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md) 的子集。它們沒有身份，並且只能持有值。

要宣告一個內聯類別，請在類別名稱前使用 `value` 修飾符：

```kotlin
value class Password(private val s: String)
```

對於 JVM 後端，在類別宣告前使用 `value` 修飾符以及 `@JvmInline` 註解來宣告內聯類別：

```kotlin
// 適用於 JVM 後端
@JvmInline
value class Password(private val s: String)
```

內聯類別必須在主建構函數中初始化一個單一屬性。在執行時期，內聯類別的實例將使用此單一屬性表示（有關執行時期表示的詳細資訊，請參閱 [下方](#representation)）：

```kotlin
// 類別 'Password' 實際上並未被實例化
// 在執行時期，'securePassword' 僅包含 'String'
val securePassword = Password("Don't try this in production")
```

這是內聯類別的主要特性，它啟發了 *inline* 這個名稱：類別的資料被 *內聯* 到其使用之處（類似於 [內聯函數](inline-functions.md) 的內容如何被內聯到呼叫點）。

## 成員

內聯類別支援常規類別的一些功能。特別是，它們允許宣告屬性和函數，擁有 `init` 區塊和 [次級建構函數](classes.md#secondary-constructors)：

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
    name1.greet() // `greet()` 函數作為靜態方法被呼叫
    println(name2.length) // 屬性 getter 作為靜態方法被呼叫
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

內聯類別屬性不能有 [後備欄位](properties.md#backing-fields)。它們只能有簡單的可計算屬性（沒有 `lateinit`/委託屬性）。

## 繼承

內聯類別允許繼承介面：

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
    println(name.prettyPrint()) // 仍作為靜態方法被呼叫
}
```

內聯類別禁止參與類別階層。這意味著內聯類別不能繼承其他類別，並且總是 `final` 的。

## 表示

在生成的程式碼中，Kotlin 編譯器為每個內聯類別保留一個 *包裝器*。內聯類別實例在執行時期可以表示為包裝器或底層型別。這類似於 `Int` 如何可以 [表示](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine) 為基本型別 `int` 或包裝器 `Integer`。

Kotlin 編譯器將偏好使用底層型別而不是包裝器，以產生最高效能和最佳化的程式碼。然而，有時必須保留包裝器。根據經驗法則，當內聯類別被用作另一種型別時，它們會被裝箱。

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

    asInline(f)    // 未裝箱：作為 Foo 本身使用
    asGeneric(f)   // 已裝箱：作為泛型型別 T 使用
    asInterface(f) // 已裝箱：作為型別 I 使用
    asNullable(f)  // 已裝箱：作為 Foo? 使用，這與 Foo 不同

    // 下方，'f' 在傳遞給 'id' 時首先被裝箱，然後在從 'id' 返回時被拆箱
    // 最終，'c' 包含未裝箱的表示（僅為 '42'），就像 'f' 一樣
    val c = id(f)
}
```

因為內聯類別可以同時表示為底層值和包裝器，所以對它們來說 [引用相等性](equality.md#referential-equality) 是毫無意義的，因此被禁止。

內聯類別也可以將泛型型別參數作為底層型別。在這種情況下，編譯器將其映射到 `Any?`，或者通常映射到型別參數的上界。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 編譯器生成函數 compute-<hashcode>(s: Any?)
```

### 名稱混淆

由於內聯類別被編譯為其底層型別，這可能導致各種難以理解的錯誤，例如意外的平台簽名衝突：

```kotlin
@JvmInline
value class UInt(val x: Int)

// 在 JVM 上表示為 'public final void compute(int x)'
fun compute(x: Int) { }

// 在 JVM 上也表示為 'public final void compute(int x)'！
fun compute(x: UInt) { }
```

為緩解這些問題，使用內聯類別的函數會通過在函數名稱中添加一些穩定的雜湊碼來進行 _名稱混淆_。因此，`fun compute(x: UInt)` 將被表示為 `public final void compute-<hashcode>(int x)`，這解決了衝突問題。

### 從 Java 程式碼呼叫

您可以從 Java 程式碼呼叫接受內聯類別的函數。為此，您應該手動禁用名稱混淆：在函數宣告前添加 `@JvmName` 註解：

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

預設情況下，Kotlin 會使用**未裝箱表示**來編譯內聯類別，這使得它們難以從 Java 存取。要了解如何將內聯類別編譯成可從 Java 存取的**已裝箱表示**，請參閱 [從 Java 呼叫 Kotlin](java-to-kotlin-interop.md#inline-value-classes) 指南。

## 內聯類別與型別別名

乍看之下，內聯類別與 [型別別名](type-aliases.md) 似乎非常相似。事實上，兩者似乎都引入了新類型，並且兩者在執行時期都將被表示為底層型別。

然而，關鍵區別在於，型別別名與其底層型別（以及與相同底層型別的其他型別別名）是 *賦值相容* 的，而內聯類別則不是。

換句話說，內聯類別引入了真正 _新_ 型別，這與型別別名不同，型別別名僅為現有型別引入了替代名稱（別名）：

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

    acceptString(nameAlias) // OK：傳遞別名而非底層型別
    acceptString(nameInlineClass) // 不 OK：不能傳遞內聯類別而非底層型別

    // 反之亦然：
    acceptNameTypeAlias(string) // OK：傳遞底層型別而非別名
    acceptNameInlineClass(string) // 不 OK：不能傳遞底層型別而非內聯類別
}
```

## 內聯類別與委託

允許對內聯類別的內聯值進行委託實作，前提是涉及介面：

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
    println(my.foo()) // 印出 "foo"
}