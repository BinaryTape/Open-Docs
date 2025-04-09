---
title: "從 Java 呼叫 Kotlin"
---
Kotlin 程式碼可以很容易地從 Java 呼叫。
例如，Kotlin 類別的實例可以無縫地在 Java 方法中建立和操作。
然而，Java 和 Kotlin 之間存在一些差異，在將 Kotlin 程式碼整合到 Java 中時需要注意。
在本頁中，我們將描述如何調整 Kotlin 程式碼與其 Java 客户端的互操作性。

## 屬性 (Properties)

一個 Kotlin 屬性會被編譯成以下的 Java 元素：

 * 一個 getter 方法，其名稱透過在屬性名稱前加上 `get` 前綴來計算
 * 一個 setter 方法，其名稱透過在屬性名稱前加上 `set` 前綴來計算 (僅適用於 `var` 屬性)
 * 一個私有 (private) 欄位，與屬性名稱相同 (僅適用於具有 backing field 的屬性)

例如，`var firstName: String` 會被編譯成以下的 Java 宣告：

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

如果屬性的名稱以 `is` 開頭，則會使用不同的名稱映射規則：getter 的名稱將與屬性名稱相同，而 setter 的名稱將透過將 `is` 替換為 `set` 來獲得。
例如，對於屬性 `isOpen`，getter 將被呼叫為 `isOpen()`，而 setter 將被呼叫為 `setOpen()`。
此規則適用於任何類型的屬性，而不僅僅是 `Boolean`。

## 頂層函式 (Package-level functions)

在 package `org.example` 內的檔案 `app.kt` 中宣告的所有函式和屬性，包括擴充函式 (extension functions)，都會被編譯成名為 `org.example.AppKt` 的 Java 類別的靜態 (static) 方法。

```kotlin
// app.kt
package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.AppKt.getTime();
```

若要為產生的 Java 類別設定自訂名稱，請使用 `@JvmName` 註解 (annotation)：

```kotlin
@file:JvmName("DemoUtils")

package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.DemoUtils.getTime();
```

有多個具有相同產生的 Java 類別名稱（相同的套件和相同的名稱或相同的
[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 註解）的檔案通常是一個錯誤。
然而，編譯器可以產生一個單一的 Java facade 類別，該類別具有指定的名稱，並包含來自所有具有該名稱的檔案的所有宣告。
若要啟用此 facade 的產生，請在所有此類檔案中使用 [`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html)
註解。

```kotlin
// oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getTime() { /*...*/ }
```

```kotlin
// newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getDate() { /*...*/ }
```

```java
// Java
org.example.Utils.getTime();
org.example.Utils.getDate();
```

## 實例欄位 (Instance fields)

如果您需要將 Kotlin 屬性作為 Java 中的欄位公開，請使用 [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 註解對其進行註解。
該欄位將具有與基礎屬性相同的可見性 (visibility)。如果屬性符合以下條件，您可以將屬性與 `@JvmField` 註解：
* 具有 backing field
* 不是私有 (private) 的
* 沒有 `open`、`override` 或 `const` 修飾符 (modifiers)
* 不是委託屬性 (delegated property)

```kotlin
class User(id: String) {
    @JvmField val ID = id
}
```

```java

// Java
class JavaClient {
    public String getID(User user) {
        return user.ID;
    }
}
```

[延遲初始化](properties#late-initialized-properties-and-variables)的屬性也會作為欄位公開。
欄位的可見性將與 `lateinit` 屬性 setter 的可見性相同。

## 靜態欄位 (Static fields)

在 named object 或伴生物件 (companion object) 中宣告的 Kotlin 屬性將在該 named object 或包含伴生物件的類別中具有靜態 backing field。

通常，這些欄位是私有的，但它們可以透過以下方式之一公開：

 - [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 註解
 - `lateinit` 修飾符
 - `const` 修飾符
 
使用 `@JvmField` 註解這樣的屬性會使其成為靜態欄位，其可見性與屬性本身相同。

```kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```

```java
// Java
Key.COMPARATOR.compare(key1, key2);
// public static final field in Key class
```

物件或伴生物件中的 [延遲初始化](properties#late-initialized-properties-and-variables) 屬性具有與屬性 setter 相同的可見性的靜態 backing field。

```kotlin
object Singleton {
    lateinit var provider: Provider
}
```

```java

// Java
Singleton.provider = new Provider();
// public static non-final field in Singleton class
```

宣告為 `const` 的屬性（在類別中以及在頂層）會轉換為 Java 中的靜態欄位：

```kotlin
// file example.kt

object Obj {
    const val CONST = 1
}

class C {
    companion object {
        const val VERSION = 9
    }
}

const val MAX = 239
```

在 Java 中：

```java

int constant = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```

## 靜態方法 (Static methods)

如上所述，Kotlin 將頂層函式表示為靜態方法。
如果您使用 [`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html) 註解這些函式，Kotlin 也可以為在 named object 或伴生物件中定義的函式產生靜態方法。
如果您使用此註解，編譯器將在物件的封閉類別中產生一個靜態方法，並在物件本身中產生一個實例方法。例如：

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

現在，`callStatic()` 在 Java 中是靜態的，而 `callNonStatic()` 不是：

```java

C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```

對於 named object 也是如此：

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

在 Java 中：

```java

Obj.callStatic(); // works fine
Obj.callNonStatic(); // error
Obj.INSTANCE.callNonStatic(); // works, a call through the singleton instance
Obj.INSTANCE.callStatic(); // works too
```

從 Kotlin 1.3 開始，`@JvmStatic` 也適用於在介面 (interface) 的伴生物件中定義的函式。
這樣的函式會編譯為介面中的靜態方法。請注意，介面中的靜態方法是在 Java 1.8 中引入的，因此請務必使用相應的目標。

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

`@JvmStatic` 註解也可以應用於物件或伴生物件的屬性，使其 getter 和 setter 方法成為該物件或包含伴生物件的類別中的靜態成員。

## 介面中的預設方法 (Default methods in interfaces)

:::note
預設方法僅適用於目標 JVM 1.8 及更高版本。

:::

從 JDK 1.8 開始，Java 中的介面可以包含[預設方法](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)。
若要使 Kotlin 介面的所有非抽象成員對於實作它們的 Java 類別都是預設的，請使用 `-Xjvm-default=all` 編譯器選項編譯 Kotlin
程式碼。

以下是一個具有預設方法的 Kotlin 介面的範例：

```kotlin
// compile with -Xjvm-default=all

interface Robot {
    fun move() { println("~walking~") }  // will be default in the Java interface
    fun speak(): Unit
}
```

預設實作 (implementation) 可用於實作該介面的 Java 類別。

```java
//Java implementation
public class C3PO implements Robot {
    // move() implementation from Robot is available implicitly
    @Override
    public void speak() {
        System.out.println("I beg your pardon, sir");
    }
}
```

```java
C3PO c3po = new C3PO();
c3po.move(); // default implementation from the Robot interface
c3po.speak();
```

介面的實作可以覆寫 (override) 預設方法。

```java
//Java
public class BB8 implements Robot {
    //own implementation of the default method
    @Override
    public void move() {
        System.out.println("~rolling~");
    }

    @Override
    public void speak() {
        System.out.println("Beep-beep");
    }
}
```

:::note
在 Kotlin 1.4 之前，若要產生預設方法，您可以在這些方法上使用 `@JvmDefault` 註解。
在 1.4+ 中使用 `-Xjvm-default=all` 進行編譯通常就像您使用 `@JvmDefault` 註解介面的所有非抽象方法並使用 `-Xjvm-default=enable` 進行編譯一樣。
但是，在某些情況下，它們的行為有所不同。
有關 Kotlin 1.4 中預設方法產生變更的詳細資訊，請參閱 Kotlin 部落格上的[此文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

:::

### 預設方法的相容性模式 (Compatibility modes for default methods)

如果有些客户端使用您在沒有 `-Xjvm-default=all` 選項的情況下編譯的 Kotlin 介面，那麼它們可能與使用此選項編譯的程式碼在二進位上不相容。
若要避免與此類客户端中斷相容性，請使用 `-Xjvm-default=all` 模式，並使用 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/) 註解標記介面。
這允許您一次將此註解新增到 public API 中的所有介面，並且您不需要為新的非 public 程式碼使用任何註解。

:::note
從 Kotlin 1.6.20 開始，您可以使用預設模式（`-Xjvm-default=disable` 編譯器選項）針對使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式編譯的模組編譯模組。

:::

瞭解有關相容性模式的更多資訊：

#### disable

預設行為。不要產生 JVM 預設方法並禁止使用 `@JvmDefault` 註解。

#### all

為模組中所有帶有主體的介面宣告產生 JVM 預設方法。不要為帶有主體的介面宣告產生 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 存根 (stubs)，
這些存根預設在 `disable` 模式下產生。

如果介面從在 `disable` 模式下編譯的介面繼承一個帶有主體的方法，並且不覆寫它，
則將為其產生一個 `DefaultImpls` 存根。

如果某些客户端程式碼依賴於 `DefaultImpls` 類別的存在，則會__破壞二進位相容性__。

:::note
如果使用介面委託 (delegation)，則會委託所有介面方法。唯一的例外是使用已棄用的 `@JvmDefault` 註解註解的方法。

:::

#### all-compatibility

除了 `all` 模式之外，還會在 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)
類別中產生相容性存根。相容性存根對於
庫和執行時期作者來說可能很有用，可以為針對先前庫版本編譯的現有客户端保持向後二進位相容性。
`all` 和 `all-compatibility` 模式正在變更庫 ABI 介面，客户端在重新編譯庫後將使用該介面。
從這個意義上講，客户端可能與先前的庫版本不相容。
這通常意味著您需要正確的庫版本控制，例如 SemVer 中的主要版本增加。

編譯器使用 `@Deprecated` 註解產生 `DefaultImpls` 的所有成員：您不應在 Java 程式碼中使用這些
成員，因為編譯器僅為了相容性目的而產生它們。

如果從以 `all` 或 `all-compatibility` 模式編譯的 Kotlin 介面繼承，
`DefaultImpls` 相容性存根將使用標準 JVM 執行時期解析語義呼叫介面的預設方法。

對繼承泛型 (generic) 介面的類別執行額外的相容性檢查，在某些情況下，在 `disable` 模式下會產生具有特殊簽名的額外隱式方法：
與 `disable` 模式不同，如果您不顯式覆寫此類方法並且不使用 `@JvmDefaultWithoutCompatibility` 註解該類別，則編譯器將報告錯誤（有關更多詳細資訊，請參閱[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-39603)）。

## 可見性 (Visibility)

Kotlin 可見性修飾符 (modifiers) 以以下方式映射到 Java：

* `private` 成員被編譯為 `private` 成員
* `private` 頂層宣告被編譯為 `private` 頂層宣告。如果從類別中存取，則還包括 package-private 存取器。
* `protected` 保持 `protected`（請注意，Java 允許從同一套件中的其他類別存取 protected 成員，
而 Kotlin 不允許，因此 Java 類別將具有更廣泛的程式碼存取權）
* `internal` 宣告在 Java 中變為 `public`。 `internal` 類別的成員會經過名稱修改 (name mangling)，以使其
更難以從 Java 中意外使用它們，並允許為具有相同簽名 (signature) 且根據 Kotlin 規則看不到彼此的成員重載。
* `public` 保持 `public`

## KClass

有時您需要使用 `KClass` 類型的參數呼叫 Kotlin 方法。
沒有從 `Class` 到 `KClass` 的自動轉換，因此您必須透過呼叫等效於
`Class<T>.kotlin` 擴充屬性的方式手動執行此操作：

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## 使用 @JvmName 處理簽名衝突 (Handling signature clashes with @JvmName)

有時我們在 Kotlin 中有一個 named function，我們需要在位元碼 (bytecode) 中為其提供不同的 JVM 名稱。
最突出的例子是由於*類型擦除* (type erasure) 造成的：

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

這兩個函式不能並排定義，因為它們的 JVM 簽名相同：`filterValid(Ljava/util/List;)Ljava/util/List;`。
如果我們真的希望它們在 Kotlin 中具有相同的名稱，我們可以使用
[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 註解其中一個（或兩個）函式，並指定不同的名稱
作為參數：

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

從 Kotlin 中，它們將可透過相同的名稱 `filterValid` 存取，但從 Java 中，它們將是 `filterValid` 和 `filterValidInt`。

當我們需要同時具有屬性 `x` 和函式 `getX()` 時，也適用相同的技巧：

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

若要變更未顯式實作 getter 和 setter 的屬性的產生的存取器方法 (accessor methods) 的名稱，
您可以使用 `@get:JvmName` 和 `@set:JvmName`：

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## 重載產生 (Overloads generation)

通常，如果您編寫一個具有預設參數值的 Kotlin 函式，它在 Java 中將僅顯示為完整的
簽名，並顯示所有存在的參數。如果您希望向 Java 呼叫者公開多個重載 (overloads)，您可以使用
[`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 註解。

該註解也適用於建構函式 (constructors)、靜態方法等。它不能用於抽象方法，包括
在介面中定義的方法。

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

對於每個具有預設值的參數，這將產生一個額外的重載，該重載具有此參數和
參數清單中位於其右側的所有參數都已移除。在此範例中，將產生以下內容：

```java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

請注意，如[次要建構函式](classes#secondary-constructors)中所述，如果類別的所有建構函式參數都具有預設
值，則將為其產生一個沒有參數的 public 建構函式。即使未指定 `@JvmOverloads` 註解，這也有效。

## 受檢例外 (Checked exceptions)

Kotlin 沒有受檢例外。
因此，通常 Kotlin 函式的 Java 簽名不宣告引發的例外。
因此，如果您在 Kotlin 中有一個這樣的函式：

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

並且您想從 Java 呼叫它並捕獲 (catch) 例外：

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // error: writeToFile() does not declare IOException in the throws list
    // ...
}
```

您會收到 Java 編譯器的錯誤訊息，因為 `writeToFile()` 沒有宣告 `IOException`。
若要解決此問題，請在 Kotlin 中使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html)
註解：

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## 空值安全 (Null-safety)

從 Java 呼叫 Kotlin 函式時，沒有人阻止我們將 `null` 作為非可空 (non-nullable) 參數傳遞。
這就是為什麼 Kotlin 會為所有需要非空值的 public 函式產生執行時期檢查。
這樣我們就可以立即在 Java 程式碼中得到 `NullPointerException`。

## 變異泛型 (Variant generics)

當 Kotlin 類別使用[宣告點變異](generics#declaration-site-variance)時，從 Java 程式碼中看到它們的用法有兩種
選項。例如，假設您有以下類別和使用它的兩個函式：

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

將這些函式轉換為 Java 的一種簡單方法是：

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

問題在於，在 Kotlin 中，您可以編寫 `unboxBase(boxDerived(Derived()))`，但在 Java 中，這是不可能的，
因為在 Java 中，類別 `Box` 在其參數 `T` 中是*不變的* (invariant)，因此 `Box<Derived>` 不是 `Box<Base>` 的子類型。
若要使其在 Java 中工作，您必須將 `unboxBase` 定義如下：

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

此宣告使用 Java 的 *萬用字元類型* (`? extends Base`) 透過使用點 (use-site)
變異來模擬宣告點變異，因為這就是 Java 所擁有的全部。

若要使 Kotlin API 在 Java 中工作，當 `Box<Super>` 作為*參數*出現時，編譯器會將其產生為 `Box<? extends Super>`，以便協變地定義 `Box`
（或對於逆變地定義的 `Foo`，產生為 `Foo<? super Bar>`）。當它是傳回值時，
不會產生萬用字元，因為否則 Java 客户端將不得不處理它們（並且這違反了常見的
Java 編碼風格）。因此，我們範例中的函式實際上轉換如下：

```java

// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```

:::note
當參數類型是 final 時，通常沒有產生萬用字元的意義，因此 `Box<String>` 始終是 `Box<String>`，
無論它處於什麼位置。

:::

如果您需要在預設情況下未產生萬用字元的地方使用萬用字元，請使用 `@JvmWildcard` 註解：

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

相反，如果您不需要在產生萬用字元的地方使用萬用字元，請使用 `@JvmSuppressWildcards`：

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

:::note
`@JvmSuppressWildcards` 不僅可以用於個別類型參數，還可以用於整個宣告，例如函式
或類別，導致抑制其中的所有萬用字元。

:::

### 類型 Nothing 的轉換 (Translation of type Nothing)
 
類型 [`Nothing`](exceptions#the-nothing-type) 很特別，因為它在 Java 中沒有自然的對應物。事實上，每個 Java 參考類型，包括
`java.lang.Void`，都接受 `null` 作為值，而 `Nothing` 甚至不接受它。因此，這種型別無法在 Java 世界中準確表示。這就是為什麼 Kotlin 在使用 `Nothing` 類型的參數時產生原始類型 (raw type) 的原因：

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```