---
title: "編碼慣例 (Coding conventions)"
---
程式語言而言，常見且易於遵循的程式碼慣例至關重要。
在此，我們為使用 Kotlin 的專案提供關於程式碼風格和程式碼組織的指南。

## 在 IDE 中配置風格

兩個最受歡迎的 Kotlin IDE - [IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Android Studio](https://developer.android.com/studio/)
為程式碼風格提供了強大的支援。您可以配置它們以自動格式化您的程式碼，使其與
給定的程式碼風格保持一致。

### 應用風格指南

1. 前往 **Settings/Preferences | Editor | Code Style | Kotlin**。
2. 點擊 **Set from...**。
3. 選擇 **Kotlin style guide**。

### 驗證您的程式碼是否遵循風格指南

1. 前往 **Settings/Preferences | Editor | Inspections | General**。
2. 開啟 **Incorrect formatting** 檢查。
其他檢查，用於驗證風格指南中描述的其他問題（例如命名慣例）預設為啟用。

## 原始碼組織

### 目錄結構

在純 Kotlin 專案中，建議的目錄結構遵循套件 (package) 結構，並省略常見的根套件 (root package)。例如，如果專案中的所有程式碼都在 `org.example.kotlin` 套件及其
子套件中，則帶有 `org.example.kotlin` 套件的檔案應直接放置在原始碼根目錄下，並且
`org.example.kotlin.network.socket` 中的檔案應位於原始碼根目錄的 `network/socket` 子目錄中。

:::note
在 JVM 上：在 Kotlin 與 Java 一起使用的專案中，Kotlin 原始碼檔案應與 Java 原始碼檔案位於相同的
原始碼根目錄中，並遵循相同的目錄結構：每個檔案應儲存在與每個套件 (package) 宣告相對應的
目錄中。

:::

### 原始碼檔案名稱

如果一個 Kotlin 檔案包含一個單一類別或介面（可能帶有相關的頂層宣告），則其名稱應與
類別的名稱相同，並附加 `.kt` 副檔名。這適用於所有類型的類別和介面。
如果一個檔案包含多個類別，或僅包含頂層宣告，則選擇一個描述檔案內容的名稱，並相應地命名該檔案。
使用 [upper camel case](https://en.wikipedia.org/wiki/Camel_case)，其中每個單字的第一個字母大寫。
例如，`ProcessDeclarations.kt`。

檔案的名稱應描述檔案中的程式碼的作用。因此，您應避免在檔案名稱中使用無意義的
單字，例如 `Util`。

#### 多平台專案

在多平台專案中，在平台特定原始碼集中具有頂層宣告的檔案應具有與原始碼集名稱相關聯的後綴。例如：

* **jvm**Main/kotlin/Platform.**jvm**.kt
* **android**Main/kotlin/Platform.**android**.kt
* **ios**Main/kotlin/Platform.**ios**.kt

至於通用原始碼集，具有頂層宣告的檔案不應具有後綴。例如，`commonMain/kotlin/Platform.kt`。

##### 技術細節

由於 JVM 限制，我們建議在多平台專案中遵循此檔案命名方案：它不允許
頂層成員（函式、屬性）。

為了解決這個問題，Kotlin JVM 編譯器會建立包含頂層
成員宣告的包裝類別（所謂的「檔案外觀 (file facades)」）。檔案外觀 (file facades) 具有從檔案名稱衍生的內部名稱。

反過來，JVM 不允許具有相同完整限定名稱 (fully qualified name, FQN) 的多個類別。這可能會導致 Kotlin 專案無法編譯為 JVM 的情況：

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

這裡的 `Platform.kt` 檔案都在同一個套件 (package) 中，因此 Kotlin JVM 編譯器會產生兩個檔案外觀 (file facades)，它們都
具有 FQN `myPackage.PlatformKt`。這會產生「重複的 JVM 類別」錯誤。

避免這種情況的最簡單方法是根據上述指南重新命名其中一個檔案。這種命名方案有助於
避免衝突，同時保持程式碼的可讀性。

:::note
在兩種情況下，這些建議可能看起來是多餘的，但我們仍然建議遵循它們：

* 非 JVM 平台沒有複製檔案外觀 (file facades) 的問題。但是，這種命名方案可以幫助您保持
檔案命名的一致性。
* 在 JVM 上，如果原始碼檔案沒有頂層宣告，則不會產生檔案外觀 (file facades)，並且您不會面臨
命名衝突。

但是，這種命名方案可以幫助您避免簡單的重構
或新增可能會包含頂層函式並導致相同的「重複的 JVM 類別」錯誤的情況。

### 原始碼檔案組織

鼓勵將多個宣告（類別、頂層函式或屬性）放置在同一個 Kotlin 原始碼檔案中，
只要這些宣告在語義上彼此密切相關，並且檔案大小保持合理
（不超過幾百行）。

特別是，當為一個類別定義擴充函式時，這些函式與該類別的所有客戶端相關，
將它們與該類別本身放在同一個檔案中。當定義僅對特定客戶端有意義的擴充函式時，
將它們放在該客戶端的程式碼旁邊。避免建立僅用於保存
某些類別的所有擴充的檔案。

### 類別佈局

類別的內容應按以下順序排列：

1. 屬性宣告和初始化程式碼塊
2. 次要建構函式 (secondary constructors)
3. 方法宣告
4. 伴生物件 (companion object)

不要按字母順序或可見性對方法宣告進行排序，也不要將常規方法與擴充方法分開。
相反，將相關內容放在一起，以便從上到下閱讀類別的人可以
遵循正在發生的邏輯。選擇一個順序（先是較高層次的內容，反之亦然）並堅持下去。

將巢狀類別放在使用這些類別的程式碼旁邊。如果這些類別旨在外部使用並且未在類別內部引用，
則將它們放在末尾，在伴生物件 (companion object) 之後。

### 介面實作佈局

當實作一個介面時，保持實作成員與介面成員的順序相同（如果需要，
穿插用於實作的其他私有方法）。

### 重載佈局

始終將重載 (overload) 放在類別中彼此相鄰的位置。

## 命名規則

Kotlin 中的套件 (package) 和類別命名規則非常簡單：

* 套件 (package) 的名稱始終小寫，並且不使用底線 (`org.example.project`)。通常不鼓勵使用多個單字的
名稱，但如果您確實需要使用多個單字，您可以將它們連接在一起或使用駝峰式大小寫 (`org.example.myProject`)。

* 類別和物件的名稱使用 upper camel case：

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 函式名稱

函式、屬性和區域變數的名稱以小寫字母開頭，並使用駝峰式大小寫，不帶底線：

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

例外：用於建立類別實例的工廠函式可以與抽象返回類型具有相同的名稱：

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### 測試方法名稱

在測試中（並且**僅**在測試中），您可以使用包含在反引號中的帶有空格的方法名稱。
請注意，從 API level 30 開始，Android runtime 僅支援此類方法名稱。在測試程式碼中也允許使用方法名稱中的底線。

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }
     
     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 屬性名稱

常數的名稱（標記為 `const` 的屬性，或具有沒有自訂 `get` 函式的頂層或物件 `val` 屬性，
這些屬性持有深度不可變的資料）應使用全大寫、底線分隔的名稱，遵循 ([screaming snake case](https://en.wikipedia.org/wiki/Snake_case))
慣例：

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

持有具有行為或可變資料的物件的頂層或物件屬性的名稱應使用駝峰式大小寫名稱：

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

持有對單例物件 (singleton object) 的引用的屬性的名稱可以使用與 `object` 宣告相同的命名風格：

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

對於列舉常數 (enum constants)，可以使用全大寫、底線分隔的 ([screaming snake case](https://en.wikipedia.org/wiki/Snake_case)) 名稱
(`enum class Color { RED, GREEN }`) 或 upper camel case 名稱，具體取決於用法。

### 後端屬性名稱

如果一個類別有兩個在概念上相同的屬性，但其中一個是公共 API 的一部分，而另一個是實作
細節，則使用底線作為私有屬性名稱的前綴：

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 選擇好的名稱

類別的名稱通常是一個名詞或名詞短語，用於解釋類別_是什麼_：`List`、`PersonReader`。

方法的名稱通常是一個動詞或動詞短語，用於說明方法_做什麼_：`close`、`readPersons`。
如果方法正在修改物件或返回一個新物件，則名稱也應提示。例如，`sort` 正在
就地排序一個集合，而 `sorted` 正在返回該集合的排序副本。

名稱應清楚地說明實體 (entity) 的用途，因此最好避免在名稱中使用無意義的單字
（`Manager`、`Wrapper`）。

當使用縮寫作為宣告名稱的一部分時，請遵循以下規則：

* 對於兩個字母的縮寫，請對兩個字母使用大寫。例如，`IOStream`。
* 對於長度超過兩個字母的縮寫，僅將第一個字母大寫。例如，`XmlFormatter` 或 `HttpInputStream`。

## 格式化

### 縮排

使用四個空格進行縮排。請勿使用 Tab 鍵。

對於大括號，將左大括號放在建構開始行的末尾，並將右大括號
放在與開頭建構水平對齊的單獨一行上。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

在 Kotlin 中，分號是可選的，因此換行符號很重要。語言設計假定為
Java 風格的大括號，如果您嘗試使用不同的格式化風格，可能會遇到令人驚訝的行為。

:::

### 水平空格

* 在二元運算符周圍放置空格 (`a + b`)。例外：不要在「範圍到 (range to)」運算符周圍放置空格 (`0..i`)。
* 不要在單元運算符周圍放置空格 (`a++`)。
* 在控制流程關鍵字 (`if`、`when`、`for` 和 `while`) 和對應的左括號之間放置空格。
* 不要在主要建構函式宣告、方法宣告或方法呼叫中的左括號之前放置空格。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

* 切勿在 `(`、`[` 之後或在 `]`、`)` 之前放置空格。
* 切勿在 `.` 或 `?.` 周圍放置空格：`foo.bar().filter { it > 2 }.joinToString()`、`foo?.bar()`。
* 在 `//` 之後放置一個空格：`// This is a comment`。
* 不要在用於指定類型參數的角括號周圍放置空格：`class Map<K, V> { ... }`。
* 不要在 `::` 周圍放置空格：`Foo::class`、`String::length`。
* 不要在用於標記可為空類型 (nullable type) 的 `?` 之前放置空格：`String?`。

作為一般規則，避免任何形式的水平對齊。將識別碼重新命名為具有不同長度的名稱
不應影響宣告或任何用法的格式。

### 冒號

在以下情況下，在 `:` 之前放置一個空格：

* 當它用於分隔類型和超類型時。
* 當委託給超類別建構函式或同一類別的不同建構函式時。
* 在 `object` 關鍵字之後。

當 `:` 分隔宣告及其類型時，不要在 `:` 之前放置空格。

始終在 `:` 之後放置一個空格。

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

具有少量主要建構函式參數的類別可以用單行編寫：

```kotlin
class Person(id: Int, name: String)
```

具有較長標頭的類別應進行格式化，以便每個主要建構函式參數都在單獨的行中，並帶有縮排。
此外，右括號應位於新的一行上。如果您使用繼承，則超類別建構函式呼叫或
已實作介面的清單應與括號位於同一行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

對於多個介面，超類別建構函式呼叫應位於第一行，然後每個介面應
位於不同的行中：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

對於具有長超類型清單的類別，在冒號後放置一個換行符，並水平對齊所有超類型名稱：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

為了在類別標頭很長時清楚地分隔類別標頭和主體，請在類別標頭後放置一個空白行
（如上例所示），或將左大括號放在單獨的一行上：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

對建構函式參數使用常規縮排（四個空格）。這可確保在主要建構函式中宣告的屬性與在
類別主體中宣告的屬性具有相同的縮排。

### 修飾符順序

如果一個宣告具有多個修飾符，請始終將它們按以下順序排列：

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

將所有註解放在修飾符之前：

```kotlin
@Named("Foo")
private val foo: Foo
```

除非您正在開發一個函式庫，否則請省略多餘的修飾符（例如，`public`）。

### 註解

將註解放在它們所附加的宣告之前的單獨行上，並使用相同的縮排：

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

沒有參數的註解可以放在同一行上：

```kotlin
@JsonExclude @JvmField
var x: String
```

沒有參數的單個註解可以與相應的宣告放在同一行上：

```kotlin
@Test fun foo() { /*...*/ }
```

### 檔案註解

檔案註解放在檔案註解（如果有的話）之後，在 `package` 語句之前，
並與 `package` 用一個空白行分隔開（以強調它們針對檔案而不是套件 (package) 的事實）。

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 函式

如果函式簽名不適合放在單行上，請使用以下語法：

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

對函式參數使用常規縮排（四個空格）。它有助於確保與建構函式參數的一致性。

對於主體僅包含單個表達式的函式，首選使用表達式主體。

```kotlin
fun foo(): Int {     // bad
    return 1 
}

fun foo() = 1        // good
```

### 表達式主體

如果函式具有表達式主體，並且該主體的第一行不適合與宣告放在同一行上，則將 `=` 符號放在第一行
並將表達式主體縮排四個空格。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 屬性

對於非常簡單的唯讀屬性，請考慮單行格式：

```kotlin
val isEmpty: Boolean get() = size == 0
```

對於更複雜的屬性，始終將 `get` 和 `set` 關鍵字放在單獨的行上：

```kotlin
val foo: String
    get() { /*...*/ }
```

對於帶有初始化程式碼的屬性，如果初始化程式碼很長，請在 `=` 符號後新增一個換行符
並將初始化程式碼縮排四個空格：

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 控制流程語句

如果 `if` 或 `when` 語句的條件是多行的，請始終在大括號內放置語句的主體。
相對於語句的開頭，將條件的每個後續行縮排四個空格。
將條件的右括號與左大括號放在單獨的一行上：

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

這有助於對齊條件和語句主體。

將 `else`、`catch`、`finally` 關鍵字以及 `do-while` 迴圈的 `while` 關鍵字放在與
前面的左大括號相同的行上：

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

在 `when` 語句中，如果一個分支超過一行，請考慮用一個空白行將其與相鄰的 case 區塊分隔開：

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken `->`
            callback.visitValue(propName, token.value)

        Token.LBRACE `->` { // ...
        }
    }
}
```

將簡短的分支放在與條件相同的行上，不帶大括號。

```kotlin
when (foo) {
    true `->` bar() // good
    false `->` { baz() } // bad
}
```

### 方法呼叫

在長參數清單中，在左括號後放置一個換行符。將參數縮排四個空格。
將多個密切相關的參數分組在同一行上。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

在分隔參數名稱和值的 `=` 符號周圍放置空格。

### 包裝鏈式呼叫

當包裝鏈式呼叫時，將 `.` 字元或 `?.` 運算符放在下一行，並帶有單個縮排：

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

鏈中的第一個呼叫通常應該在它之前有一個換行符，但是如果程式碼以這種方式更有意義，則可以省略它。

### Lambda

在 lambda 表達式中，應在大括號周圍以及分隔參數與主體的箭頭周圍使用空格。
如果一個呼叫採用單個 lambda，請盡可能將其傳遞到括號之外。

```kotlin
list.filter { it > 10 }
```

如果為 lambda 指定一個標籤，請勿在標籤和左大括號之間放置空格：

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

在多行 lambda 中宣告參數名稱時，將名稱放在第一行，然後是箭頭和換行符：

```kotlin
appendCommaSeparated(properties) { prop `->`
    val propertyValue = prop.get(obj)  // ...
}
```

如果參數清單太長，無法放在一行上，請將箭頭放在單獨的一行上：

```kotlin
foo {
   context: Context,
   environment: Env
   `->`
   context.configureEnv(environment)
}
```

### 尾隨逗號

尾隨逗號是元素系列中最後一個專案後的逗號符號：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

使用尾隨逗號有幾個好處：

* 它使版本控制差異 (version-control diffs) 更清晰 – 因為所有焦點都集中在已更改的值上。
* 它使新增和重新排序元素變得容易 – 如果您操作元素，則無需新增或刪除逗號。
* 它簡化了程式碼產生，例如，對於物件初始化程式。最後一個元素也可以有一個逗號。

尾隨逗號是完全可選的 – 您的程式碼在沒有它們的情況下仍然可以工作。Kotlin 風格指南鼓勵在宣告站點使用尾隨逗號，並將其留給您自行決定是否在呼叫站點使用。

要在 IntelliJ IDEA 格式化程式中啟用尾隨逗號，請轉到 **Settings/Preferences | Editor | Code Style | Kotlin**，
開啟 **Other** 標籤並選擇 **Use trailing comma** 選項。

#### 列舉

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // trailing comma
}
```

#### 值參數

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

#### 類別屬性和參數

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

#### 函式值參數

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

#### 帶有可選類型的參數（包括 setter）

```kotlin
val sum: (Int, Int, Int) `->` Int = fun(
    x,
    y,
    z, // trailing comma
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### 索引後綴

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

#### Lambda 中的參數

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // trailing comma
        `->`
        println("1")
    }
    println(x)
}
```

#### when 條目

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // trailing comma
        `->` true
    else `->` false
}
```

#### 集合文字（在註解中）

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

#### 類型參數

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // trailing comma
            >()
}
```

#### 類型參數

```kotlin
class MyMap<
        MyKey,
        MyValue, // trailing comma
        > {}
```

#### 解構宣告

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

## 文件註解 (documentation comments)

對於較長的文件註解 (documentation comments)，請將開頭的 `/**` 放在單獨的一行上，並以星號開頭的後續每一行：

```kotlin
/**
 * This is a documentation comment
 * on multiple lines.
 */
```

簡短的註解可以放在單行上：

```kotlin
/** This is a short documentation comment. */
```

通常，避免使用 `@param` 和 `@return` 標籤。相反，將參數和傳回值的描述直接合併到文件註解 (documentation comments) 中，
並在提及參數的任何地方新增連結。僅當需要不適合主文字流程的冗長描述時，才使用 `@param` 和 `@return`。

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

## 避免多餘的建構

一般來說，如果 Kotlin 中的某個語法建構是可選的並且被 IDE
標記為多餘的，則您應該在您的程式碼中省略它。不要僅僅為了「清晰」而在程式碼中留下不必要的語法元素。

### Unit 傳回類型

如果函式傳回 Unit，則應省略傳回類型：

```kotlin
fun foo() { // ": Unit" is omitted here

}
```

### 分號

盡可能省略分號。

### 字串模板

當將一個簡單的變數插入到字串模板中時，不要使用大括號。僅對較長的表達式使用大括號。

```kotlin
println("$name has ${children.size} children")
```

## 慣用的語言功能用法

### 不可變性 (immutability)

首選使用不可變資料而不是可變資料。如果
在初始化後沒有修改區域變數和屬性，請始終將它們宣告為 `val` 而不是 `var`。

始終使用不可變的集合介面 (`Collection`、`List`、`Set`、`Map`) 來宣告未被
修改的集合。當使用工廠函式建立集合實例時，盡可能始終使用傳回不可變
集合類型的函式：

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

首選使用帶有預設參數值的函式宣告，而不是宣告重載函式。

```kotlin
// Bad
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// Good
fun foo(a: String = "a") { /*...*/ }
```

### 類型別名

如果您有一個函式類型或一個帶有類型參數的類型，該類型在程式碼庫中多次使用，則首選為其定義
一個類型別名：

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) `->` Unit
typealias PersonIndex = Map<String, Person>
```
如果您使用私有或內部類型別名來避免名稱衝突，請首選 [套件 (package) 和導入](packages) 中提到的 `import ... as ...`。

### Lambda 參數

在簡短且未巢狀的 lambda 中，建議使用 `it` 慣例，而不是顯式地宣告參數。
在帶有參數的巢狀 lambda 中，始終顯式地宣告參數。

### Lambda 中的傳回

避免在 lambda 中使用多個標記的傳回。考慮重構 lambda，使其只有一個退出點。
如果這不可能或不夠清楚，請考慮將 lambda 轉換為匿名函式。

不要對 lambda 中的最後一個語句使用標記的傳回。

### 具名參數

當一個方法採用多個相同基本類型的參數時，或者對於 `Boolean` 類型的參數，請使用具名參數語法，
除非從上下文中可以完全清楚地了解所有參數的含義。

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 條件語句

首選使用 `try`、`if` 和 `when` 的表達式形式。

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 `->` "zero"
    else `->` "nonzero"
}
```

以上優於：

```kotlin
if (x)
    return foo()
else
    return bar()
```

```kotlin
when(x) {
    0 `->` return "zero"
    else `->` return "nonzero"
}    
```

### if 與 when

對於二元條件，首選使用 `if` 而不是 `when`。
例如，使用 `if` 的這種語法：

```kotlin
if (x == null) ... else ...
```

而不是 `when` 的這種語法：

```kotlin
when (x) {
    null `->` // ...
    else `->` // ...
}
```

如果存在三個或更多選項，則首選使用 `when`。

### when 表達式中的守衛條件

在 `when` 表達式或語句中使用 [守衛條件](control-flow#guard-conditions-in-when-expressions) 組合多個布林表達式時，請使用括號：

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty() || status.info.id == null) `->` "no information"
}
```

而不是：

```kotlin
when (status) {
    is Status.Ok if status.info.isEmpty() || status.info.id == null `->` "no information"
}
```

### 條件中的可為空的布林值 (nullable Boolean)

如果需要在條件語句中使用可為空的 `Boolean`，請使用 `if (value == true)` 或 `if (value == false)` 檢查。

### 迴圈

首選使用高階函式 (`filter`、`map` 等) 而不是迴圈。例外：`forEach`（首選使用常規 `for` 迴圈，
除非 `forEach` 的接收者 (receiver) 可以為空，或者 `forEach` 用作較長呼叫鏈的一部分）。

當在高階函式和迴圈中使用複雜表達式之間進行選擇時，請了解
在每種情況下執行的操作的成本，並牢記效能方面的考慮。

### 範圍上的迴圈

使用 `..<` 運算符在一個開放式範圍上迴圈：

```kotlin
for (i in 0..n - 1) { /*...*/ }  // bad
for (i in 0..<n) { /*...*/ }  // good
```

### 字串

首選字串模板而不是字串串聯。

首選多行字串而不是將 `
` 逸出序列嵌入到常規字串文字中。

為了保持多行字串中的縮排，當結果字串不需要任何內部
縮排時，請使用 `trimIndent`，或者當需要內部縮排時，請使用 `trimMargin`：

```kotlin
fun main() {

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
          |if(a > 1)