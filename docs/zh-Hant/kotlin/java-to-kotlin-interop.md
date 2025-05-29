[//]: # (title: 從 Java 呼叫 Kotlin)

Kotlin 程式碼可以輕鬆地從 Java 呼叫。例如，Kotlin 類別的實例可以在 Java 方法中無縫地建立和操作。然而，Java 和 Kotlin 之間存在一些差異，在將 Kotlin 程式碼整合到 Java 時需要注意。在此頁面上，我們將描述如何調整 Kotlin 程式碼與其 Java 用戶端的互通性 (interop)。

## 屬性 (Properties)

Kotlin 屬性 (property) 會編譯為以下 Java 元素：

*   一個 getter 方法，其名稱是透過在前面加上 `get` 前綴來計算的
*   一個 setter 方法，其名稱是透過在前面加上 `set` 前綴來計算的（僅適用於 `var` 屬性）
*   一個私有欄位 (field)，其名稱與屬性名稱相同（僅適用於具有後端欄位 (backing field) 的屬性）

例如，`var firstName: String` 會編譯為以下 Java 宣告：

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

如果屬性名稱以 `is` 開頭，則會使用不同的名稱映射規則：getter 的名稱將與屬性名稱相同，而 setter 的名稱則透過將 `is` 替換為 `set` 取得。例如，對於屬性 `isOpen`，getter 將被呼叫為 `isOpen()`，setter 將被呼叫為 `setOpen()`。此規則適用於任何類型的屬性，而不僅僅是 `Boolean`。

## 套件級別函式 (Package-level functions)

檔案 `app.kt` 中、套件 `org.example` 內宣告的所有函式 (function) 和屬性，包括擴充函式 (extension function)，都會編譯為名為 `org.example.AppKt` 的 Java 類別的靜態方法 (static method)。

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

擁有多個具有相同產生 Java 類別名稱（相同套件和相同名稱或相同 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 註解）的檔案通常會產生錯誤。然而，編譯器可以產生一個單一的 Java 外觀類別 (facade class)，該類別具有指定的名稱並包含來自所有具有該名稱的檔案的所有宣告。若要啟用此類外觀的產生，請在所有此類檔案中使用 [`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html) 註解。

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

如果您需要將 Kotlin 屬性作為 Java 中的欄位公開，請使用 [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 註解對其進行標註。該欄位將具有與底層屬性相同的可見性 (visibility)。您可以在符合以下條件時，使用 `@JvmField` 標註一個屬性：
*   具有後端欄位
*   不是私有的 (private)
*   沒有 `open`、`override` 或 `const` 修飾符 (modifier)
*   不是委託屬性 (delegated property)

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

[延遲初始化 (Late-Initialized)](properties.md#late-initialized-properties-and-variables) 的屬性也會作為欄位公開。該欄位的可見性將與 `lateinit` 屬性 setter 的可見性相同。

## 靜態欄位 (Static fields)

在命名物件 (named object) 或伴隨物件 (companion object) 中宣告的 Kotlin 屬性將在該命名物件或包含伴隨物件的類別中具有靜態後端欄位。

通常這些欄位是私有的，但它們可以透過以下方式之一公開：

*   [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 註解
*   `lateinit` 修飾符
*   `const` 修飾符

使用 `@JvmField` 註解此類屬性會使其成為靜態欄位，並具有與屬性本身相同的可見性。

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

物件或伴隨物件中的 [延遲初始化](properties.md#late-initialized-properties-and-variables) 屬性具有與屬性 setter 相同可見性的靜態後端欄位。

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

宣告為 `const` 的屬性（在類別中以及頂層 (top level)）在 Java 中會變成靜態欄位：

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

如上所述，Kotlin 將套件級別函式表示為靜態方法。如果您將命名物件或伴隨物件中定義的函式標註為 [`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html)，Kotlin 也可以為其生成靜態方法。如果您使用此註解，編譯器將在物件的封裝類別 (enclosing class) 中生成一個靜態方法，並在物件本身中生成一個實例方法 (instance method)。例如：

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

命名物件也一樣：

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

從 Kotlin 1.3 開始，`@JvmStatic` 也適用於介面 (interface) 的伴隨物件中定義的函式。此類函式會編譯為介面中的靜態方法。請注意，介面中的靜態方法是在 Java 1.8 中引入的，因此請務必使用相應的目標。

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

`@JvmStatic` 註解也可以應用於物件或伴隨物件的屬性，使其 getter 和 setter 方法成為該物件或包含伴隨物件的類別中的靜態成員。

## 介面中的預設方法 (Default methods in interfaces)

>預設方法 (Default method) 僅適用於 JVM 1.8 及以上目標。
>
{style="note"}

從 JDK 1.8 開始，Java 中的介面可以包含[預設方法](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)。若要使 Kotlin 介面的所有非抽象成員對於實作 (implement) 它們的 Java 類別來說是預設的，請使用 `-Xjvm-default=all` 編譯器選項編譯 Kotlin 程式碼。

這是一個帶有預設方法的 Kotlin 介面範例：

```kotlin
// compile with -Xjvm-default=all

interface Robot {
    fun move() { println("~walking~") }  // 在 Java 介面中將是預設的
    fun speak(): Unit
}
```

預設實作 (implementation) 可供實作該介面的 Java 類別使用。

```java
//Java implementation
public class C3PO implements Robot {
    // Robot 中的 move() 實作隱式可用
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
    // 自己的預設方法實作
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

>在 Kotlin 1.4 之前，為了生成預設方法，您可以在這些方法上使用 `@JvmDefault` 註解。在 1.4+ 中使用 `-Xjvm-default=all` 進行編譯通常等同於您使用 `@JvmDefault` 註解了介面的所有非抽象方法，並使用 `-Xjvm-default=enable` 進行了編譯。然而，在某些情況下它們的行為會有所不同。有關 Kotlin 1.4 中預設方法生成變化的詳細資訊，請參閱 Kotlin 部落格上的 [這篇文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。
>
{style="note"}

### 預設方法的相容性模式 (Compatibility modes for default methods)

如果有用戶端使用未經 `-Xjvm-default=all` 選項編譯的 Kotlin 介面，那麼它們可能與使用此選項編譯的程式碼二進制不相容 (binary-incompatible)。為了避免破壞與此類用戶端的相容性 (compatibility)，請使用 `-Xjvm-default=all` 模式並使用 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/) 註解標記介面。這允許您將此註解一次性新增到公共 API (public API) 中的所有介面，並且對於新的非公共程式碼，您將無需使用任何註解。

>從 Kotlin 1.6.20 開始，您可以以預設模式（`-Xjvm-default=disable` 編譯器選項）編譯模組 (module)，以與使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式編譯的模組相對。
>
{style="note"}

深入了解相容性模式：

#### disable {initial-collapse-state="collapsed" collapsible="true"}

預設行為。不生成 JVM 預設方法並禁止使用 `@JvmDefault` 註解。

#### all {initial-collapse-state="collapsed" collapsible="true"}

為模組中所有帶有主體 (body) 的介面宣告生成 JVM 預設方法。不要為帶有主體的介面宣告生成 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 存根 (stub)，這些存根在 `disable` 模式下會預設生成。

如果介面從在 `disable` 模式下編譯的介面繼承了一個帶有主體的方法且不覆寫它，則會為其生成一個 `DefaultImpls` 存根。

如果某些用戶端程式碼依賴於 `DefaultImpls` 類別的存在，則會**破壞二進制相容性**。

>如果使用介面委託 (delegation)，所有介面方法都會被委託。唯一的例外是標註了已棄用 (deprecated) 的 `@JvmDefault` 註解的方法。
>
{style="note"}

#### all-compatibility {initial-collapse-state="collapsed" collapsible="true"}

除了 `all` 模式之外，還在 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 類別中生成相容性存根。相容性存根對於函式庫 (library) 和執行時 (runtime) 作者來說可能很有用，以便為針對先前函式庫版本編譯的現有用戶端保持向後二進制相容性 (backward binary compatibility)。`all` 和 `all-compatibility` 模式正在改變函式庫的 ABI 表面 (ABI surface)，用戶端在重新編譯函式庫後將使用該表面。從這個意義上說，用戶端可能與先前的函式庫版本不相容。這通常意味著您需要適當的函式庫版本控制，例如 SemVer 中的主要版本增加。

編譯器會為 `DefaultImpls` 的所有成員生成 `@Deprecated` 註解：您不應該在 Java 程式碼中使用這些成員，因為編譯器生成它們僅用於相容性目的。

如果從以 `all` 或 `all-compatibility` 模式編譯的 Kotlin 介面繼承，`DefaultImpls` 相容性存根將以標準 JVM 執行時解析語義 (runtime resolution semantics) 呼叫介面的預設方法。

對繼承泛型介面 (generic interfaces) 的類別執行額外的相容性檢查，在某些情況下，`disable` 模式會生成帶有專用簽名 (specialized signatures) 的額外隱式方法：與 `disable` 模式不同，如果您不顯式覆寫此類方法並且不使用 `@JvmDefaultWithoutCompatibility` 註解類別，編譯器將報告錯誤（有關更多詳細資訊，請參閱 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-39603)）。

## 可見性 (Visibility)

Kotlin 可見性修飾符 (visibility modifier) 映射到 Java 的方式如下：

*   `private` 成員會編譯為 `private` 成員
*   `private` 頂層宣告會編譯為 `private` 頂層宣告。如果從類別內部存取，也會包含套件私有 (package-private) 存取器 (accessor)。
*   `protected` 保持 `protected`（請注意，Java 允許從相同套件中的其他類別存取受保護成員，而 Kotlin 不允許，因此 Java 類別將對程式碼擁有更廣泛的存取權限）
*   `internal` 宣告在 Java 中變為 `public`。`internal` 類別的成員會經過名稱重整 (name mangling)，以使其更難從 Java 意外使用，並允許為根據 Kotlin 規則彼此不可見的具有相同簽名 (signature) 的成員進行重載 (overloading)。
*   `public` 保持 `public`

## KClass

有時您需要呼叫帶有 `KClass` 類型參數的 Kotlin 方法。`Class` 到 `KClass` 沒有自動轉換，因此您必須透過呼叫等同於 `Class<T>.kotlin` 擴充屬性的方式手動執行：

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## 處理與 @JvmName 的簽名衝突 (Handling signature clashes with @JvmName)

有時我們在 Kotlin 中有一個命名函式，但我們需要在位元組碼 (bytecode) 中為其指定不同的 JVM 名稱。最突出的例子是由於*類型擦除 (type erasure)* 引起的：

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

這兩個函式不能並排定義，因為它們的 JVM 簽名相同：`filterValid(Ljava/util/List;)Ljava/util/List;`。如果我們真的希望它們在 Kotlin 中具有相同的名稱，我們可以將其中一個（或兩個）用 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 註解標註，並指定一個不同的名稱作為參數：

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

從 Kotlin，它們將以相同的名稱 `filterValid` 存取，但從 Java 則會是 `filterValid` 和 `filterValidInt`。

當我們需要一個屬性 `x` 以及一個函式 `getX()` 時，也適用相同的技巧：

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

若要更改未顯式實作 getter 和 setter 的屬性所生成的存取器方法名稱，您可以使用 `@get:JvmName` 和 `@set:JvmName`：

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## 重載生成 (Overloads generation)

通常，如果您編寫一個帶有預設參數值 (default parameter value) 的 Kotlin 函式，它在 Java 中將僅作為完整簽名可見，其中包含所有參數。如果您希望向 Java 呼叫者公開多個重載 (overload)，可以使用 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 註解。

該註解也適用於建構函式 (constructor)、靜態方法等等。它不能用於抽象方法 (abstract method)，包括介面中定義的方法。

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

對於每個帶有預設值的參數，這將生成一個額外的重載，該重載移除了此參數及其在參數列表中右側的所有參數。在此範例中，將生成以下內容：

```java
// 建構函式：
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// 方法
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

請注意，如 [次要建構函式 (Secondary constructors)](classes.md#secondary-constructors) 中所述，如果一個類別的所有建構函式參數都有預設值，則會為其生成一個無參數的公共建構函式。即使未指定 `@JvmOverloads` 註解，這也有效。

## 受檢查例外 (Checked exceptions)

Kotlin 沒有受檢查例外 (checked exception)。因此，通常 Kotlin 函式的 Java 簽名不會宣告拋出例外。因此，如果您在 Kotlin 中有這樣一個函式：

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

並且您想從 Java 呼叫它並捕獲例外 (exception)：

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // 錯誤：writeToFile() 未在 throws 列表中宣告 IOException
    // ...
}
```

您會從 Java 編譯器收到錯誤訊息，因為 `writeToFile()` 未宣告 `IOException`。為了解決這個問題，請在 Kotlin 中使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html) 註解：

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## 空安全 (Null-safety)

從 Java 呼叫 Kotlin 函式時，沒有人能阻止我們將 `null` 作為不可為空 (non-nullable) 的參數傳遞。這就是為什麼 Kotlin 為所有期望非空值的公共函式生成運行時檢查 (runtime check)。這樣我們就會立即在 Java 程式碼中得到 `NullPointerException`。

## 變異泛型 (Variant generics)

當 Kotlin 類別使用 [宣告處變異 (declaration-site variance)](generics.md#declaration-site-variance) 時，它們在 Java 程式碼中的使用方式有兩種選擇。例如，想像您有以下類別和兩個使用它的函式：

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

將這些函式翻譯為 Java 的一種樸素 (naive) 方法是：

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

問題在於，在 Kotlin 中您可以編寫 `unboxBase(boxDerived(Derived()))`，但在 Java 中這是不可能的，因為在 Java 中，類別 `Box` 在其參數 `T` 上是*不變的 (invariant)*，因此 `Box<Derived>` 不是 `Box<Base>` 的子類型 (subtype)。為了讓這在 Java 中起作用，您必須將 `unboxBase` 定義如下：

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

這個宣告使用 Java 的*萬用字元類型 (wildcards types)* (`? extends Base`) 來透過使用處變異 (use-site variance) 模擬宣告處變異，因為這是 Java 唯一擁有的。

為了讓 Kotlin API 在 Java 中運作，當 `Box<Super>` 作為參數出現時，編譯器會為協變定義 (covariantly defined) 的 `Box` 生成 `Box<? extends Super>`（或為逆變定義 (contravariantly defined) 的 `Foo` 生成 `Foo<? super Bar>`）。當它是回傳值時，不會生成萬用字元，因為否則 Java 用戶端將不得不處理它們（這與常見的 Java 編碼風格相悖）。因此，我們範例中的函式實際翻譯如下：

```java

// 回傳類型 - 無萬用字元
Box<Derived> boxDerived(Derived value) { ... }
 
// 參數 - 萬用字元
Base unboxBase(Box<? extends Base> box) { ... }
```

>當參數類型是 final 時，通常沒有必要生成萬用字元，因此無論它處於何種位置，`Box<String>` 始終是 `Box<String>`。
>
{style="note"}

如果您需要在預設情況下不生成萬用字元的地方使用萬用字元，請使用 `@JvmWildcard` 註解：

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// 翻譯為 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

相反地，如果您不需要在生成萬用字元的地方使用它們，請使用 `@JvmSuppressWildcards`：

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// 翻譯為 
// Base unboxBase(Box<Base> box) { ... }
```

>`@JvmSuppressWildcards` 不僅可以用於單個類型參數，還可以用於整個宣告，例如函式或類別，導致其中所有萬用字元都被抑制。
>
{style="note"}

### Nothing 類型的翻譯 (Translation of type Nothing)

類型 [`Nothing`](exceptions.md#the-nothing-type) 是特殊的，因為它在 Java 中沒有天然的對應物 (counterpart)。實際上，每個 Java 引用類型 (reference type)，包括 `java.lang.Void`，都接受 `null` 作為值，而 `Nothing` 甚至不接受 `null`。因此，這種類型無法在 Java 世界中被精確表示。這就是為什麼當使用 `Nothing` 類型的參數時，Kotlin 會生成一個原始類型 (raw type)：

```kotlin
fun emptyList(): List<Nothing> = listOf()
// 翻譯為
// List emptyList() { ... }
```