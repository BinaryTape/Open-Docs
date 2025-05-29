[//]: # (title: 編碼規範)

普遍認可且易於遵循的編碼規範對任何程式語言都至關重要。
在此，我們為使用 Kotlin 的專案提供程式碼風格和程式碼組織的準則。

## 在 IDE 中配置風格

兩種最流行的 Kotlin IDE — [IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Android Studio](https://developer.android.com/studio/)
為程式碼風格設定提供了強大的支援。您可以將其配置為自動格式化您的程式碼，使其與
給定的程式碼風格保持一致。

### 應用風格指南

1.  前往 **設定/偏好設定 | 編輯器 | 程式碼風格 | Kotlin**。
2.  點擊 **設定來源...**。
3.  選擇 **Kotlin 風格指南**。

### 驗證您的程式碼是否遵循風格指南

1.  前往 **設定/偏好設定 | 編輯器 | 檢查 | 一般**。
2.  開啟 **不正確的格式** 檢查。
用於驗證風格指南中描述的其他問題（例如命名慣例）的額外檢查預設為啟用。

## 原始碼組織

### 目錄結構

在純 Kotlin 專案中，建議的目錄結構遵循套件結構，並省略通用根套件。例如，如果專案中的所有程式碼都位於 `org.example.kotlin` 套件及其
子套件中，則 `org.example.kotlin` 套件的檔案應直接放置在原始碼根目錄下，而
`org.example.kotlin.network.socket` 中的檔案應位於原始碼根目錄的 `network/socket` 子目錄中。

>在 JVM 上：在 Kotlin 與 Java 一起使用的專案中，Kotlin 原始碼檔應與 Java 原始碼檔位於相同的
>原始碼根目錄中，並遵循相同的目錄結構：每個檔案應儲存在與其套件宣告相對應的
>目錄中。
>
{style="note"}

### 原始碼檔案名稱

如果 Kotlin 檔案只包含一個類別或介面（可能包含相關的頂層宣告），其名稱應與
類別名稱相同，並附加 `.kt` 副檔名。這適用於所有類型的類別和介面。
如果檔案包含多個類別，或僅包含頂層宣告，則選擇一個描述檔案內容的名稱，並相應地命名檔案。
使用[大駝峰式命名法 (Upper Camel Case)](https://en.wikipedia.org/wiki/Camel_case)，其中每個單字的第一個字母都大寫。
例如，`ProcessDeclarations.kt`。

檔案的名稱應描述檔案中的程式碼所做的事情。因此，您應避免在檔案名稱中使用無意義的
單字，例如 `Util`。

#### 多平台專案

在多平台專案中，平台特定原始碼集中帶有頂層宣告的檔案應具有一個
與原始碼集名稱相關的尾碼。例如：

*   **jvm**Main/kotlin/Platform.**jvm**.kt
*   **android**Main/kotlin/Platform.**android**.kt
*   **ios**Main/kotlin/Platform.**ios**.kt

至於通用原始碼集，帶有頂層宣告的檔案不應有尾碼。例如，`commonMain/kotlin/Platform.kt`。

##### 技術細節 {initial-collapse-state="collapsed" collapsible="true"}

我們建議在多平台專案中遵循此檔案命名方案，因為 JVM 存在限制：它不允許
頂層成員（函數、屬性）。

為了解決這個問題，Kotlin JVM 編譯器會建立包裝類別（所謂的「檔案外觀類別 (file facades)」），其中包含頂層
成員宣告。檔案外觀類別具有從檔案名稱派生的內部名稱。

反之，JVM 不允許具有相同完全限定名稱 (FQN) 的多個類別。這可能導致 Kotlin 專案無法編譯為 JVM 的情況：

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

這裡兩個 `Platform.kt` 檔案都位於相同的套件中，因此 Kotlin JVM 編譯器會產生兩個檔案外觀類別，兩者
都具有 FQN `myPackage.PlatformKt`。這會產生「重複的 JVM 類別 (Duplicate JVM classes)」錯誤。

避免這種情況最簡單的方法是根據上述準則重新命名其中一個檔案。這個命名方案有助於
避免衝突，同時保持程式碼的可讀性。

> 有兩種情況下，這些建議可能看起來是多餘的，但我們仍然建議遵循它們：
>
> *   非 JVM 平台沒有重複檔案外觀類別的問題。然而，這個命名方案可以幫助您保持
>     檔案命名一致。
> *   在 JVM 上，如果原始碼檔沒有頂層宣告，則檔案外觀類別不會生成，您也不會面臨
>     命名衝突。
>
>     然而，這個命名方案可以幫助您避免當簡單的重構
>     或新增一個頂層函數時，導致相同的「重複的 JVM 類別」錯誤。
>
{style="tip"}

### 原始碼檔案組織

鼓勵將多個宣告（類別、頂層函數或屬性）放置在同一個 Kotlin 原始碼檔中，
只要這些宣告在語義上彼此密切相關，並且檔案大小保持合理
（不超過幾百行）。

特別是，當為一個類別定義對該類別的所有客戶端都相關的擴展函數時，
將它們放在與類別本身相同的檔案中。當定義僅對特定客戶端有意義的擴展函數時，
將它們放在該客戶端的程式碼旁邊。避免僅為了存放
某個類別的所有擴展函數而建立檔案。

### 類別佈局

類別的內容應按以下順序排列：

1.  屬性宣告和初始化器區塊
2.  次級建構子
3.  方法宣告
4.  伴生物件 (Companion Object)

不要按字母順序或可見性排序方法宣告，也不要將常規方法
與擴展方法分開。相反，將相關內容放在一起，以便從上到下閱讀類別的人可以
遵循正在發生的邏輯。選擇一個順序（高層次內容優先，反之亦然），並堅持下去。

將巢狀類別放在那些使用這些類別的程式碼旁邊。如果這些類別旨在外部使用且未在類別內部被引用，
則將它們放在末尾，伴生物件之後。

### 介面實現佈局

實現介面時，將實現成員保持與介面成員相同的順序（如有必要，
可穿插用於實現的額外私有方法）。

### 重載佈局

始終將重載放在類別中彼此相鄰的位置。

## 命名規則

Kotlin 中的套件和類別命名規則相當簡單：

*   套件名稱總是小寫，不使用底線（`org.example.project`）。一般不鼓勵使用多詞名稱，
    但如果確實需要使用多個單字，您可以直接將它們連接在一起
    或使用駝峰式命名法 (Camel Case)（`org.example.myProject`）。

*   類別和物件的名稱使用大駝峰式命名法：

    ```kotlin
    open class DeclarationProcessor { /*...*/ }
    
    object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
    ```

### 函數名稱

函數、屬性和局部變數的名稱以小寫字母開頭，並使用不帶底線的駝峰式命名法：

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

例外：用於建立類別實例的工廠函數可以與抽象回傳類型同名：

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### 測試方法名稱

在測試中（且**僅**在測試中），您可以使用以反引號括起來的帶空格的方法名稱。
請注意，此類方法名稱僅從 API level 30 開始由 Android 執行時支援。在方法名稱中使用底線
在測試程式碼中也允許。

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }
     
     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 屬性名稱

常數（標記為 `const` 的屬性，或沒有自訂 `get` 函數的頂層或物件 `val` 屬性，它們持有深度不可變資料）的名稱
應使用全大寫、以底線分隔的名稱，遵循[尖叫蛇形命名法 (Screaming Snake Case)](https://en.wikipedia.org/wiki/Snake_case)
慣例：

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

持有帶行為或可變資料的物件的頂層或物件屬性的名稱應使用駝峰式命名法：

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

持有單例物件引用的屬性名稱可以使用與 `object` 宣告相同的命名風格：

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

對於列舉常數，可以使用全大寫、以底線分隔的名稱（[尖叫蛇形命名法](https://en.wikipedia.org/wiki/Snake_case)）
（`enum class Color { RED, GREEN }`）或大駝峰式命名法，具體取決於用途。

### 後援屬性 (Backing Properties) 的名稱

如果一個類別有兩個概念上相同但其中一個是公共 API 的一部分，另一個是實現
細節的屬性，則將底線作為私有屬性名稱的字首：

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 選擇好的名稱

類別的名稱通常是名詞或名詞片語，解釋該類別「是什麼」：`List`、`PersonReader`。

方法的名稱通常是動詞或動詞片語，說明該方法「做什麼」：`close`、`readPersons`。
名稱還應暗示該方法是變更物件還是回傳一個新物件。例如，`sort` 是
原地排序一個集合，而 `sorted` 是回傳集合的排序副本。

名稱應明確實體的用途，因此最好避免在名稱中使用無意義的單字
（`Manager`、`Wrapper`）。

當使用縮寫詞作為宣告名稱的一部分時，請遵循以下規則：

*   對於兩個字母的縮寫詞，兩個字母都使用大寫。例如，`IOStream`。
*   對於超過兩個字母的縮寫詞，只將第一個字母大寫。例如，`XmlFormatter` 或 `HttpInputStream`。

## 格式化

### 縮排

使用四個空格進行縮排。不要使用 Tab 鍵。

對於大括號，將開括號放在構造開始的行尾，並將閉括號
放在單獨一行，並與開括號的構造水平對齊。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

>在 Kotlin 中，分號是可選的，因此斷行很重要。語言設計假定
>Java 風格的大括號，如果您嘗試使用不同的格式風格，可能會遇到令人意外的行為。
>
{style="note"}

### 水平空白字元

*   在二元運算子 (`a + b`) 周圍留空格。例外：不要在「範圍至」運算子 (`0..i`) 周圍留空格。
*   不要在一元運算子 (`a++`) 周圍留空格。
*   在控制流關鍵字（`if`、`when`、`for` 和 `while`）與相應的開括號之間留空格。
*   在主建構子宣告、方法宣告或方法呼叫中的開括號之前不要留空格。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

*   在 `(`、`[` 之後或 `]`、`)` 之前不要留空格。
*   在 `.` 或 `?.` 周圍不要留空格：`foo.bar().filter { it > 2 }.joinToString()`、`foo?.bar()`。
*   在 `//` 之後留一個空格：`// This is a comment`。
*   在用於指定類型參數的角括號周圍不要留空格：`class Map<K, V> { ... }`。
*   在 `::` 周圍不要留空格：`Foo::class`、`String::length`。
*   在用於標記可空類型 (Nullable Type) 的 `?` 之前不要留空格：`String?`。

作為一般規則，避免任何形式的水平對齊。將識別符號重新命名為不同長度的名稱
不應影響宣告或任何用法的格式。

### 冒號

在以下情況下，冒號 `:` 之前留一個空格：

*   當它用於分隔類型和超類型時。
*   當委託給超類別建構子或同一個類別的不同建構子時。
*   在 `object` 關鍵字之後。

當冒號 `:` 分隔宣告及其類型時，冒號前不要留空格。

冒號後始終留一個空格。

```kotlin
abstract class Foo<out T : Any> : IFoo {
    abstract fun foo(a: Int): T
}

class FooImpl : Foo() {
    constructor(x: String) : this(x) { /*...*/ }
    
    val x = object : IFoo { /*...*/ } 
} 
```

### 類別標頭

帶有少量主建構子參數的類別可以寫在單行中：

```kotlin
class Person(id: Int, name: String)
```

帶有較長標頭的類別應格式化為每個主建構子參數都在單獨一行並帶有縮排。
此外，閉括號應在新的一行。如果您使用繼承，超類別建構子呼叫，或
實現的介面列表應與括號位於同一行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

對於多個介面，超類別建構子呼叫應先放置，然後每個介面應
位於不同行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

對於帶有長超類型列表的類別，在冒號後換行並水平對齊所有超類型名稱：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

為了清楚地分隔類別標頭和主體，當類別標頭很長時，可以在
類別標頭後留一個空行（如上例所示），或者將開大括號放在單獨一行：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

對建構子參數使用常規縮排（四個空格）。這確保了在主建構子中宣告的屬性與在類別主體中宣告的屬性具有相同的縮排。

### 修飾符順序

如果一個宣告有多個修飾符，請始終按以下順序放置它們：

```kotlin
public / protected / private / internal
expect / actual
final / open / abstract / sealed / const
external
override
lateinit
tailrec
vararg
suspend
inner
enum / annotation / fun // as a modifier in `fun interface` 
companion
inline / value
infix
operator
data
```

將所有註解 (Annotations) 放在修飾符之前：

```kotlin
@Named("Foo")
private val foo: Foo
```

除非您正在開發函式庫，否則省略冗餘的修飾符（例如，`public`）。

### 註解

將註解放在單獨的行上，位於它們所附著的宣告之前，並使用相同的縮排：

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

不帶參數的註解可以放在同一行：

```kotlin
@JsonExclude @JvmField
var x: String
```

單個不帶參數的註解可以放在相應宣告的同一行：

```kotlin
@Test fun foo() { /*...*/ }
```

### 檔案註解

檔案註解放在檔案註釋之後（如果有的話），在 `package` 語句之前，
並與 `package` 語句之間用空行隔開（以強調它們是針對檔案而非套件）。

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 函數

如果函數簽名不適合放在單行中，請使用以下語法：

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

對函數參數使用常規縮排（四個空格）。這有助於確保與建構子參數的一致性。

對於主體由單一表達式組成的函數，傾向於使用表達式主體。

```kotlin
fun foo(): Int {     // bad
    return 1 
}

fun foo() = 1        // good
```

### 表達式主體

如果函數具有表達式主體，且第一行與宣告不在同一行，則將 `=` 符號放在第一行
並將表達式主體縮排四個空格。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 屬性

對於非常簡單的只讀屬性，請考慮單行格式：

```kotlin
val isEmpty: Boolean get() = size == 0
```

對於更複雜的屬性，始終將 `get` 和 `set` 關鍵字放在單獨的行上：

```kotlin
val foo: String
    get() { /*...*/ }
```

對於帶有初始化器的屬性，如果初始化器很長，則在 `=` 符號後換行
並將初始化器縮排四個空格：

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 控制流語句

如果 `if` 或 `when` 語句的條件是多行的，則始終在語句主體周圍使用大括號。
將條件的每個後續行相對於語句開頭縮排四個空格。
將條件的閉括號與開大括號放在單獨一行：

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

這有助於對齊條件和語句主體。

將 `else`、`catch`、`finally` 關鍵字，以及 `do-while` 循環的 `while` 關鍵字，與
前一個大括號放在同一行：

```kotlin
if (condition) {
    // body
} else {
    // else part
}

try {
    // body
} finally {
    // cleanup
}
```

在 `when` 語句中，如果分支超過單行，請考慮用空行將其與相鄰的 case 區塊分開：

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken ->
            callback.visitValue(propName, token.value)

        Token.LBRACE -> { // ...
        }
    }
}
```

將短分支與條件放在同一行，不使用大括號。

```kotlin
when (foo) {
    true -> bar() // good
    false -> { baz() } // bad
}
```

### 方法呼叫

在長的參數列表中，在開括號後換行。將參數縮排四個空格。
將多個密切相關的參數分組在同一行。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

在分隔參數名稱和值的 `=` 符號周圍留空格。

### 換行鏈式呼叫

換行鏈式呼叫時，將 `.` 字元或 `?.` 運算子放在下一行，並帶有單一縮排：

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

鏈中的第一個呼叫通常在其之前換行，但如果這樣做程式碼更清晰，則可以省略。

### Lambda 表達式 (Lambdas)

在 Lambda 表達式中，大括號周圍應使用空格，以及分隔參數
與主體的箭頭周圍。如果呼叫接受單個 Lambda 表達式，則盡可能將其作為括號外的參數傳遞。

```kotlin
list.filter { it > 10 }
```

為 Lambda 表達式指定標籤時，標籤與開大括號之間不要留空格：

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

在多行 Lambda 表達式中宣告參數名稱時，將名稱放在第一行，然後是箭頭和換行符：

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

如果參數列表太長無法放在一行中，則將箭頭放在單獨一行：

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

### 尾隨逗號 (Trailing Commas)

尾隨逗號是指一系列元素的最後一個項目之後的逗號符號：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

使用尾隨逗號有幾個好處：

*   它使版本控制差異更清晰——因為所有焦點都在變更的值上。
*   它使新增和重新排序元素變得容易——如果您操作元素，則無需新增或刪除逗號。
*   它簡化了程式碼生成，例如，對於物件初始化器。最後一個元素也可以有逗號。

尾隨逗號是完全可選的——您的程式碼在沒有它們的情況下仍可運行。Kotlin 風格指南鼓勵在宣告處使用尾隨逗號，並由您自行決定是否在呼叫處使用。

要在 IntelliJ IDEA 格式化程式中啟用尾隨逗號，請前往 **設定/偏好設定 | 編輯器 | 程式碼風格 | Kotlin**，
開啟 **其他 (Other)** 標籤並選擇 **使用尾隨逗號 (Use trailing comma)** 選項。

#### 列舉 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // trailing comma
}
```

#### 值參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // trailing comma
)
val colors = listOf(
    "red",
    "green",
    "blue", // trailing comma
)
```

#### 類別屬性和參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Customer(
    val name: String,
    val lastName: String, // trailing comma
)
class Customer(
    val name: String,
    lastName: String, // trailing comma
)
```

#### 函數值參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun powerOf(
    number: Int, 
    exponent: Int, // trailing comma
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // trailing comma
) {}
fun print(
    vararg quantity: Int,
    description: String, // trailing comma
) {}
```

#### 帶有可選類型（包括設定器）的參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
val sum: (Int, Int, Int) -> Int = fun(
    x,
    y,
    z, // trailing comma
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### 索引尾碼 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // trailing comma
    ]
```

#### Lambda 表達式中的參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // trailing comma
        ->
        println("1")
    }
    println(x)
}
```

#### when 條目 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // trailing comma
        -> true
    else -> false
}
```

#### 集合字面量（在註解中） {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // trailing comma
])
fun run() {}
```

#### 類型參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // trailing comma
            >()
}
```

#### 類型參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class MyMap<
        MyKey,
        MyValue, // trailing comma
        > {}
```

#### 解構宣告 (Destructuring Declarations) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // trailing comma
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // trailing comma
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## 文件註釋

對於較長的文件註釋，將開頭的 `/**` 放在單獨一行，並將每個後續行
以星號開頭：

```kotlin
/**
 * This is a documentation comment
 * on multiple lines.
 */
```

短註釋可以放在單行：

```kotlin
/** This is a short documentation comment. */
```

通常，避免使用 `@param` 和 `@return` 標籤。而是直接將參數和回傳值的描述
納入文件註釋中，並在提到參數的地方新增連結。僅在需要詳細描述且不適合主文本流時使用
`@param` 和 `@return`。

```kotlin
// Avoid doing this:

/**
 * Returns the absolute value of the given number.
 * @param number The number to return the absolute value for.
 * @return The absolute value.
 */
fun abs(number: Int): Int { /*...*/ }

// Do this instead:

/**
 * Returns the absolute value of the given [number].
 */
fun abs(number: Int): Int { /*...*/ }
```

## 避免冗餘結構

一般來說，如果 Kotlin 中的某些語法結構是可選的，並且被 IDE 標記為冗餘，
您應該在程式碼中省略它。不要僅僅為了「清晰」而保留程式碼中不必要的語法元素。

### Unit 回傳類型

如果函數回傳 Unit，應省略回傳類型：

```kotlin
fun foo() { // ": Unit" is omitted here

}
```

### 分號

盡可能省略分號。

### 字串模板 (String Templates)

將簡單變數插入字串模板時，不要使用大括號。僅對較長的表達式使用大括號。

```kotlin
println("$name has ${children.size} children")
```

## 語言功能的慣用語法

### 不可變性

傾向於使用不可變資料而非可變資料。如果局部變數和屬性在初始化後不被修改，
則始終將其宣告為 `val` 而非 `var`。

始終使用不可變集合介面（`Collection`、`List`、`Set`、`Map`）來宣告不會被修改的集合。
當使用工廠函數建立集合實例時，盡可能使用回傳不可變
集合類型的函數：

```kotlin
// Bad: use of a mutable collection type for value which will not be mutated
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// Good: immutable collection type used instead
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// Bad: arrayListOf() returns ArrayList<T>, which is a mutable collection type
val allowedValues = arrayListOf("a", "b", "c")

// Good: listOf() returns List<T>
val allowedValues = listOf("a", "b", "c")
```

### 預設參數值

傾向於宣告帶有預設參數值的函數，而不是宣告重載函數。

```kotlin
// Bad
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// Good
fun foo(a: String = "a") { /*...*/ }
```

### 類型別名 (Type Aliases)

如果您有一個函數類型或帶有類型參數的類型在程式碼庫中多次使用，傾向於為其定義
類型別名：

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```
如果您為避免名稱衝突而使用私有或內部類型別名，則傾向於使用
[套件和匯入](packages.md) 中提到的 `import ... as ...`。

### Lambda 表達式參數

在簡短且不巢狀的 Lambda 表達式中，建議使用 `it` 慣例，而不是顯式宣告參數。
在帶參數的巢狀 Lambda 表達式中，始終顯式宣告參數。

### Lambda 表達式中的回傳

避免在 Lambda 表達式中使用多個帶標籤的回傳。考慮重構 Lambda 表達式，使其只有一個出口點。
如果無法實現或不夠清晰，請考慮將 Lambda 表達式轉換為匿名函數。

不要將帶標籤的回傳用於 Lambda 表達式中的最後一個語句。

### 具名參數 (Named Arguments)

當方法接受多個相同[基本類型 (Primitive Type)](https://www.kotlinlang.org/docs/basic-types.html)的參數，
或布林 (Boolean) 類型的參數時，請使用具名參數語法，
除非所有參數的含義從上下文中絕對清晰。

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 條件語句

傾向於使用 `try`、`if` 和 `when` 的表達式形式。

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 -> "zero"
    else -> "nonzero"
}
```

以上方式優於：

```kotlin
if (x)
    return foo()
else
    return bar()
```

```kotlin
when(x) {
    0 -> return "zero"
    else -> return "nonzero"
}    
```

### if 對比 when

傾向於使用 `if` 處理二元條件，而不是 `when`。
例如，對 `if` 使用這種語法：

```kotlin
if (x == null) ... else ...
```

而不是 `when` 的這種語法：

```kotlin
when (x) {
    null -> // ...
    else -> // ...
}
```

如果有多於兩個選項，傾向於使用 `when`。

### when 表達式中的守衛條件 (Guard Conditions)

在 `when` 表達式或帶有[守衛條件](control-flow.md#guard-conditions-in-when-expressions)的語句中組合多個布林表達式時使用括號：

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty() || status.info.id == null) -> "no information"
}
```

而不是：

```kotlin
when (status) {
    is Status.Ok if status.info.isEmpty() || status.info.id == null -> "no information"
}
```

### 條件中的可空布林值

如果需要在條件語句中使用可空 `Boolean`，請使用 `if (value == true)` 或 `if (value == false)` 檢查。

### 循環

傾向於使用高階函數（`filter`、`map` 等）而非循環。例外：`forEach`（傾向於使用常規 `for` 循環，
除非 `forEach` 的接收者是可空的，或者 `forEach` 作為較長呼叫鏈的一部分使用）。

在包含多個高階函數的複雜表達式和循環之間做出選擇時，了解在每種情況下執行操作的成本，
並將效能考慮納入考量。

### 範圍循環

使用 `..<` 運算子來循環遍歷一個[開區間 (Open-Ended Range)](https://kotlinlang.org/docs/ranges.html#open-ended-ranges)：

```kotlin
for (i in 0..n - 1) { /*...*/ }  // bad
for (i in 0..<n) { /*...*/ }  // good
```

### 字串

傾向於使用字串模板而非字串串聯。

傾向於使用多行字串，而不是將 `
` 跳脫序列嵌入到常規字串字面量中。

為了保持多行字串中的縮排，當結果字串不需要任何內部縮排時使用 `trimIndent`，
或當需要內部縮排時使用 `trimMargin`：

```kotlin
fun main() {
//sampleStart
   println("""
    Not
    trimmed
    text
    """
   )

   println("""
    Trimmed
    text
    """.trimIndent()
   )

   println()

   val a = """Trimmed to margin text:
          |if(a > 1) {
          |    return a
          |}""".trimMargin()

   println(a)
//sampleEnd
}
```
{kotlin-runnable="true"}

了解[Java 和 Kotlin 多行字串](java-to-kotlin-idioms-strings.md#use-multiline-strings)之間的差異。

### 函數與屬性

在某些情況下，無參數的函數可能與只讀屬性互換使用。
儘管語義相似，但關於何時偏好其中一個存在一些風格慣例。

當底層演算法符合以下條件時，優先選擇屬性而非函數：

*   不會拋出異常。
*   計算成本低（或在首次運行時快取）。
*   如果物件狀態未更改，則在多次呼叫中回傳相同結果。

### 擴展函數

自由地使用擴展函數。每當您有一個主要作用於一個物件的函數時，考慮將其作為接收該物件的擴展函數。
為了最小化 API 污染，在有意義的範圍內限制擴展函數的可見性。如有必要，
使用局部擴展函數、成員擴展函數或具有私有可見性的頂層擴展函數。

### 中綴函數 (Infix Functions)

僅當函數作用於兩個扮演相似角色的物件時，才將其宣告為 `infix` 函數。好的例子：`and`、`to`、`zip`。
壞例子：`add`。

如果方法會修改接收者物件，則不要將其宣告為 `infix` 函數。

### 工廠函數

如果您為類別宣告工廠函數，請避免給它與類別本身相同的名稱。傾向於使用一個獨特的名稱，
明確說明工廠函數的行為為何特殊。僅當確實沒有特殊語義時，
您才可以使用與類別相同的名稱。

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

如果您有一個具有多個重載建構子的物件，這些建構子不呼叫不同的超類別建構子，並且
無法簡化為帶有預設參數值的單一建構子，則傾向於用工廠函數替換這些重載建構子。

### 平台類型 (Platform Types)

回傳平台類型表達式的公共函數/方法必須顯式宣告其 Kotlin 類型：

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

任何以平台類型表達式初始化的屬性（套件級或類別級）都必須顯式宣告其 Kotlin 類型：

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

以平台類型表達式初始化的局部值可以有也可以沒有類型宣告：

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### 作用域函數 (Scope Functions) apply/with/run/also/let

Kotlin 提供了一組函數，用於在給定物件的上下文中執行程式碼塊：`let`、`run`、`with`、`apply` 和 `also`。
關於如何為您的情況選擇正確作用域函數的指南，請參閱 [作用域函數](scope-functions.md)。

## 函式庫的編碼規範

編寫函式庫時，建議遵循一套額外的規則以確保 API 穩定性：

*   始終顯式指定成員可見性（以避免意外地將宣告公開為公共 API）。
*   始終顯式指定函數回傳類型和屬性類型（以避免在實現變更時意外地更改回傳類型）。
*   為所有公共成員提供 [KDoc](kotlin-doc.md) 註釋，除了不需要任何新文件說明的覆寫
    （以支援生成函式庫的文件）。

在為您的函式庫編寫 API 時，了解更多關於最佳實踐和應考慮的想法，請參閱[函式庫作者指南](api-guidelines-introduction.md)。