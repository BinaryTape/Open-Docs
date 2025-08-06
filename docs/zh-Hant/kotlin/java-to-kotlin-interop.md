[//]: # (title: 從 Java 呼叫 Kotlin)

Kotlin 程式碼可以輕鬆地從 Java 中呼叫。
例如，Kotlin 類別的實例可以在 Java 方法中無縫地建立和操作。
然而，Java 和 Kotlin 之間存在一些差異，在將 Kotlin 程式碼整合到 Java 時需要注意。
在此頁面上，我們將描述如何調整 Kotlin 程式碼與其 Java 用戶端的互通性。

## 屬性

Kotlin 屬性會被編譯成以下 Java 元素：

 * 一個 getter 方法，其名稱是透過在其前面加上 `get` 前綴來計算的。
 * 一個 setter 方法，其名稱是透過在其前面加上 `set` 前綴來計算的（僅適用於 `var` 屬性）。
 * 一個私有欄位，其名稱與屬性名稱相同（僅適用於具有支援欄位的屬性）。

例如，`var firstName: String` 會被編譯成以下 Java 宣告：

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

如果屬性名稱以 `is` 開頭，則會使用不同的名稱對應規則：getter 的名稱與屬性名稱相同，而 setter 的名稱則是將 `is` 替換為 `set` 獲得。
例如，對於屬性 `isOpen`，getter 被呼叫為 `isOpen()`，setter 被呼叫為 `setOpen()`。
此規則適用於任何類型的屬性，而不僅僅是 `Boolean`。

## 套件級別函數

在 `app.kt` 檔案中、`org.example` 套件內宣告的所有函數和屬性，包括擴充函數，都會被編譯成名為 `org.example.AppKt` 的 Java 類別的靜態方法。

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

若要為生成的 Java 類別設定自訂名稱，請使用 `@JvmName` 註解：

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

多個檔案具有相同的生成 Java 類別名稱（相同的套件和相同的名稱，或相同的 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 註解）通常會導致錯誤。
然而，編譯器可以生成一個單一的 Java facade 類別，該類別具有指定的名稱，並包含所有具有該名稱的檔案中的所有宣告。
若要啟用此類 facade 的生成，請在所有此類檔案中使用 [`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html) 註解。

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

## 實例欄位

如果您需要將 Kotlin 屬性作為 Java 中的欄位公開，請使用 [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 註解對其進行註解。
該欄位具有與底層屬性相同的可見性。您可以對符合以下條件的屬性使用 `@JvmField` 註解：
* 具有支援欄位
* 不是 private
* 沒有 `open`、`override` 或 `const` 修飾符
* 不是委派屬性

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

[延遲初始化](properties.md#late-initialized-properties-and-variables) 的屬性也會作為欄位公開。
該欄位的可見性與 `lateinit` 屬性 setter 的可見性相同。

## 靜態欄位

在具名物件或伴生物件中宣告的 Kotlin 屬性，會在其具名物件或包含伴生物件的類別中具有靜態支援欄位。

通常這些欄位是 private 的，但可以透過以下方式之一公開：

 - [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 註解
 - `lateinit` 修飾符
 - `const` 修飾符
 
使用 `@JvmField` 註解標記此類屬性，使其成為具有與屬性本身相同可見性的靜態欄位。

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

物件或伴生物件中的 [延遲初始化](properties.md#late-initialized-properties-and-variables) 屬性，具有與屬性 setter 相同可見性的靜態支援欄位。

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

宣告為 `const` 的屬性（無論是在類別中還是在頂層）在 Java 中都會轉變為靜態欄位：

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

## 靜態方法

如前所述，Kotlin 將套件級別的函數表示為靜態方法。
如果您將在具名物件或伴生物件中定義的函數註解為 [`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html)，Kotlin 也可以為它們生成靜態方法。
如果您使用此註解，編譯器將在物件的封裝類別中生成一個靜態方法，並在物件本身中生成一個實例方法。例如：

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

現在，`callStatic()` 在 Java 中是靜態的，而 `callNonStatic()` 則不是：

```java

C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```

同樣地，對於具名物件：

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

從 Kotlin 1.3 開始，`@JvmStatic` 也適用於介面伴生物件中定義的函數。
此類函數會編譯為介面中的靜態方法。請注意，介面中的靜態方法是在 Java 1.8 中引入的，因此請務必使用對應的目標。

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

您也可以將 `@JvmStatic` 註解應用於物件或伴生物件的屬性，使其 getter 和 setter 方法成為該物件或包含伴生物件的類別中的靜態成員。

## 介面中的預設方法

當目標為 JVM 時，Kotlin 會將介面中宣告的函數編譯為 [預設方法](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)，除非 [另行配置](#compatibility-modes-for-default-methods)。
這些是介面中的具體方法，Java 類別可以直接繼承，無需重新實作。

以下是一個帶有預設方法的 Kotlin 介面範例：

```kotlin
interface Robot {
    fun move() { println("~walking~") }  // will be default in the Java interface
    fun speak(): Unit
}
```

預設實作可用於實作該介面的 Java 類別。

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

介面的實作可以覆寫預設方法。

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

### 預設方法的相容性模式

Kotlin 提供了三種模式來控制介面中的函數如何編譯為 JVM 預設方法。
這些模式決定了編譯器是否會生成相容性橋接器和 `DefaultImpls` 類別中的靜態方法。

您可以使用 `-jvm-default` 編譯器選項來控制此行為：

> `-jvm-default` 編譯器選項取代了已棄用的 `-Xjvm-default` 選項。
>
{style="note"}

了解更多關於相容性模式：

#### enable {initial-collapse-state="collapsed" collapsible="true"}

預設行為。
在介面中生成預設實作，並包含相容性橋接器和 `DefaultImpls` 類別。
此模式保持與舊版已編譯 Kotlin 程式碼的相容性。

#### no-compatibility {initial-collapse-state="collapsed" collapsible="true"}

僅在介面中生成預設實作。
跳過相容性橋接器和 `DefaultImpls` 類別。
將此模式用於不與依賴 `DefaultImpls` 類別的程式碼互動的新程式碼庫。
這可能會破壞與舊版 Kotlin 程式碼的二進位制相容性。

> 如果使用介面委派，所有介面方法都會被委派。
>
{style="note"}

#### disable {initial-collapse-state="collapsed" collapsible="true"}

禁用介面中的預設實作。
僅生成相容性橋接器和 `DefaultImpls` 類別。

## 可見性

Kotlin 的可見性修飾符與 Java 的對應方式如下：

* `private` 成員會被編譯成 `private` 成員。
* `private` 頂層宣告會被編譯成 `private` 頂層宣告。如果從類別內部存取，也會包含套件私有存取器。
* `protected` 保持 `protected`。（請注意，Java 允許從同一套件中的其他類別存取 protected 成員，而 Kotlin 不允許，因此 Java 類別將對程式碼具有更廣泛的存取權限。）
* `internal` 宣告在 Java 中變為 `public`。`internal` 類別的成員會經過名稱重整，以使其更難從 Java 意外使用，並允許為根據 Kotlin 規則彼此不可見的具有相同簽名的成員進行重載。
* `public` 保持 `public`。

## KClass

有時您需要呼叫一個帶有 `KClass` 類型參數的 Kotlin 方法。
沒有從 `Class` 到 `KClass` 的自動轉換，因此您必須透過呼叫 `Class<T>.kotlin` 擴充屬性的等效內容來手動執行此操作：

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## 使用 @JvmName 處理簽名衝突

有時我們在 Kotlin 中有一個具名函數，其在位元組碼中需要不同的 JVM 名稱。
最顯著的例子是由於 *類型擦除* 造成的：

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

這兩個函數不能並存定義，因為它們的 JVM 簽名相同：`filterValid(Ljava/util/List;)Ljava/util/List;`。
如果我們真的希望它們在 Kotlin 中具有相同的名稱，我們可以將其中一個（或兩個）用 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 註解，並將不同的名稱指定為參數：

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

在 Kotlin 中，它們以相同的名稱 `filterValid` 存取，但在 Java 中，它們是 `filterValid` 和 `filterValidInt`。

同樣的技巧也適用於我們需要一個屬性 `x` 以及一個函數 `getX()` 的情況：

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

若要變更未明確實作 getter 和 setter 的屬性所生成的存取器方法的名稱，您可以使用 `@get:JvmName` 和 `@set:JvmName`：

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## 重載生成

通常，如果您編寫一個帶有預設參數值的 Kotlin 函數，它在 Java 中只能以完整簽名的形式可見，所有參數都必須存在。如果您希望向 Java 呼叫者公開多個重載，可以使用 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 註解。

此註解也適用於建構函數、靜態方法等等。它不能用於抽象方法，包括在介面中定義的方法。

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

對於每個帶有預設值的參數，這會生成一個額外的重載，其中移除了此參數以及參數列表右側的所有參數。在此範例中，生成了以下內容：

```java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

請注意，如 [次要建構函數](classes.md#secondary-constructors) 中所述，如果一個類別的所有建構函數參數都具有預設值，則會為其生成一個無參數的 public 建構函數。這即使未指定 `@JvmOverloads` 註解也有效。

## 受檢異常

Kotlin 沒有受檢異常。
因此，通常 Kotlin 函數的 Java 簽名不宣告拋出的異常。
因此，如果您有這樣一個 Kotlin 函數：

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

而您想從 Java 中呼叫它並捕獲異常：

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // error: writeToFile() does not declare IOException in the throws list
    // ...
}
```

您會收到來自 Java 編譯器的錯誤訊息，因為 `writeToFile()` 未宣告 `IOException`。
為了解決這個問題，請在 Kotlin 中使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html) 註解：

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## 空安全

從 Java 呼叫 Kotlin 函數時，沒有什麼能阻止我們將 `null` 作為非空參數傳遞。
這就是為什麼 Kotlin 會為所有期望非空的 public 函數生成運行時檢查。
這樣我們就會立即在 Java 程式碼中得到一個 `NullPointerException`。

## 變異泛型

當 Kotlin 類別使用 [宣告處變異](generics.md#declaration-site-variance) 時，有兩種選項可以讓它們的用法從 Java 程式碼中看到。例如，想像您有以下類別和兩個使用它的函數：

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

將這些函數翻譯成 Java 的一種簡單方式將是這樣：

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

問題是，在 Kotlin 中您可以編寫 `unboxBase(boxDerived(Derived()))`，但在 Java 中這是不可能的，因為在 Java 中，類別 `Box` 在其參數 `T` 上是 *不變* 的，因此 `Box<Derived>` 不是 `Box<Base>` 的子類型。
為了讓這在 Java 中起作用，您必須將 `unboxBase` 定義如下：

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

此宣告使用 Java 的 *萬用字元類型* (`? extends Base`) 來透過使用處變異模擬宣告處變異，因為這是 Java 僅有的。

為了使 Kotlin API 在 Java 中工作，編譯器會將協變定義的 `Box` 的 `Box<Super>`（或逆變定義的 `Foo` 的 `Foo<? super Bar>`）生成為 `Box<? extends Super>`，當它作為 *參數* 出現時。當它是回傳值時，不會生成萬用字元，因為否則 Java 客戶端將不得不處理它們（這與常見的 Java 編碼風格相悖）。因此，我們範例中的函數實際上會被翻譯成以下內容：

```java

// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```

> 當引數類型是 final 時，通常沒有必要生成萬用字元，因此 `Box<String>` 始終是 `Box<String>`，無論它處於何種位置。
>
{style="note"}

如果您在預設情況下不生成萬用字元的地方需要萬用字元，請使用 `@JvmWildcard` 註解：

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

在相反的情況下，如果您在生成萬用字元的地方不需要萬用字元，請使用 `@JvmSuppressWildcards`：

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

>`@JvmSuppressWildcards` 不僅可以用於單個類型引數，還可以用於整個宣告，例如函數或類別，導致其中所有的萬用字元都被抑制。
>
{style="note"}

### Nothing 類型的翻譯
 
類型 [`Nothing`](exceptions.md#the-nothing-type) 很特殊，因為它在 Java 中沒有天然的對應物。確實，每個 Java 引用類型，包括 `java.lang.Void`，都接受 `null` 作為值，而 `Nothing` 甚至不接受 `null`。因此，這種類型無法在 Java 世界中被精確表示。這就是為什麼當使用 `Nothing` 類型的引數時，Kotlin 會生成一個原始類型：

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```

## 內聯值類別

<primary-label ref="experimental-general"/>

如果您希望 Java 程式碼能與 Kotlin 的 [內聯值類別](inline-classes.md) 順暢協作，您可以使用 [`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/) 註解或 `-Xjvm-expose-boxed` 編譯器選項。這些方法確保 Kotlin 生成 Java 互通性所需的裝箱表示。

預設情況下，Kotlin 會將內聯值類別編譯為使用**未裝箱表示**，這通常無法從 Java 存取。
例如，您無法從 Java 呼叫 `MyInt` 類別的建構函數：

```kotlin
@JvmInline
value class MyInt(val value: Int)
```

因此以下 Java 程式碼會失敗：

```java
MyInt input = new MyInt(5);
```

您可以使用 `@JvmExposeBoxed` 註解，以便 Kotlin 生成一個您可以從 Java 直接呼叫的 public 建構函數。
您可以將此註解應用於以下層級，以確保對公開給 Java 的內容進行細粒度控制：

* 類別
* 建構函數
* 函數

在程式碼中使用 `@JvmExposeBoxed` 註解之前，您必須透過使用 `@OptIn(ExperimentalStdlibApi::class)` 來選擇啟用。
例如：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

有了這些註解，Kotlin 會為 `MyInt` 類別生成一個 Java 可存取的建構函數，**以及**一個使用值類別裝箱形式的擴充函數變體。因此以下 Java 程式碼會成功運行：

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

若要將此行為應用於模組內的所有內聯值類別以及使用它們的函數，請使用 `-Xjvm-expose-boxed` 選項進行編譯。
使用此選項進行編譯的效果，等同於模組中的每個宣告都具有 `@JvmExposeBoxed` 註解。

### 繼承的函數

`@JvmExposeBoxed` 註解不會自動為繼承的函數生成裝箱表示。
 
若要為繼承的函數生成必要的表示，請在實作或擴充類別中覆寫它：
 
```kotlin
interface IdTransformer {
    fun transformId(rawId: UInt): UInt = rawId
}

// Doesn't generate a boxed representation for the transformId() function
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
class LightweightTransformer : IdTransformer

// Generates a boxed representation for the transformId() function
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
class DefaultTransformer : IdTransformer {
    override fun transformId(rawId: UInt): UInt = super.transformId(rawId)
}
```

若要了解 Kotlin 中的繼承如何運作以及如何使用 `super` 關鍵字呼叫超類別實作，請參閱 [繼承](inheritance.md#calling-the-superclass-implementation)。