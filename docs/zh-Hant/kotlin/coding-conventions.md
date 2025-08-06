[//]: # (title: 編碼慣例)

普遍認可且易於遵循的編碼慣例對於任何程式語言都至關重要。
在此，我們為使用 Kotlin 的專案提供了關於程式碼風格和程式碼組織的指導原則。

## 在 IDE 中配置風格

兩種最受歡迎的 Kotlin IDE - [IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Android Studio](https://developer.android.com/studio/)
為程式碼風格提供了強大的支援。您可以將它們配置為自動根據
給定的程式碼風格一致地格式化您的程式碼。

### 應用風格指南

1. 導覽至 **Settings/Preferences | Editor | Code Style | Kotlin**。
2. 點擊 **Set from...**。
3. 選擇 **Kotlin style guide**。

### 驗證您的程式碼是否符合風格指南

1. 導覽至 **Settings/Preferences | Editor | Inspections | General**。
2. 開啟 **Incorrect formatting** 檢查。
其他驗證風格指南中描述的其他問題（例如命名慣例）的檢查預設為啟用。

## 原始碼組織

### 目錄結構

在純 Kotlin 專案中，建議的目錄結構遵循套件（package）結構，並省略
共同的根套件。例如，如果專案中所有程式碼都位於 `org.example.kotlin` 套件及其
子套件中，則帶有 `org.example.kotlin` 套件的檔案應直接放在原始碼根目錄下，而
`org.example.kotlin.network.socket` 中的檔案應放在原始碼根目錄的 `network/socket` 子目錄中。

>On JVM: 在 Kotlin 與 Java 同時使用的專案中，Kotlin 原始碼檔案應與 Java 原始碼檔案位於相同的
>原始碼根目錄中，並遵循相同的目錄結構：每個檔案應儲存在與每個套件語句
>相對應的目錄中。
>
{style="note"}

### 原始檔名

如果一個 Kotlin 檔案只包含一個類別（class）或介面（interface）（可能帶有相關的頂層宣告），其名稱應與
該類別的名稱相同，並附加 `.kt` 副檔名。這適用於所有類型的類別和介面。
如果一個檔案包含多個類別，或僅包含頂層宣告，則選擇一個描述檔案內容的名稱，並相應地命名檔案。
使用 [大駝峰式命名法 (upper camel case)](https://en.wikipedia.org/wiki/Camel_case)，其中每個單字的首字母大寫。
例如，`ProcessDeclarations.kt`。

檔案的名稱應該描述檔案中的程式碼所執行的操作。因此，您應該避免在檔案名中使用無意義的
單字，例如 `Util`。

#### 多平台專案

在多平台專案中，平台特定原始碼集中的頂層宣告檔案應帶有與
原始碼集名稱相關聯的後綴。例如：

* **jvm**Main/kotlin/Platform.**jvm**.kt
* **android**Main/kotlin/Platform.**android**.kt
* **ios**Main/kotlin/Platform.**ios**.kt

至於共同原始碼集，頂層宣告檔案不應帶有後綴。例如，`commonMain/kotlin/Platform.kt`。

##### 技術細節 {initial-collapse-state="collapsed" collapsible="true"}

我們建議在多平台專案中遵循此檔案命名方案，因為 JVM 的限制：它不允許
頂層成員（函式、屬性）。

為了解決這個問題，Kotlin JVM 編譯器會創建包裝類別（所謂的「檔案外觀 (file facades)」），其中包含頂層
成員宣告。檔案外觀的內部名稱源自檔案名稱。

反過來，JVM 不允許多個具有相同完整限定名稱（FQN）的類別。這可能導致以下情況：
Kotlin 專案無法編譯到 JVM：

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

在這裡，兩個 `Platform.kt` 檔案都在同一個套件中，因此 Kotlin JVM 編譯器會產生兩個檔案外觀，兩者都具有
FQN `myPackage.PlatformKt`。這會產生「Duplicate JVM classes」錯誤。

最簡單的避免方法是根據上述指南重新命名其中一個檔案。此命名方案有助於
避免衝突，同時保持程式碼可讀性。

> 有兩種情況可能使得這些建議顯得多餘，但我們仍然建議遵循它們：
>
> * 非 JVM 平台沒有重複檔案外觀的問題。然而，此命名方案可以幫助您保持
> 檔案命名一致。
> * 在 JVM 上，如果原始碼檔案沒有頂層宣告，則不會產生檔案外觀，您也就不會遇到
> 命名衝突。
>
> 儘管如此，此命名方案可以幫助您避免簡單的重構
> 或新增內容可能包含頂層函式並導致相同的「Duplicate JVM classes」錯誤的情況。
>
{style="tip"}

### 原始檔組織

鼓勵將多個宣告（類別、頂層函式或屬性）放在同一個 Kotlin 原始碼檔案中，
只要這些宣告在語義上彼此密切相關，並且檔案大小保持合理
（不超過幾百行）。

特別是，當為一個類別定義對該類別的所有客戶端都相關的擴充函式時，
將它們放在與該類別本身相同的檔案中。當定義僅對
特定客戶端有意義的擴充函式時，將它們放在該客戶端的程式碼旁邊。避免創建只用於容納
某個類別所有擴充功能的檔案。

### 類別佈局

類別的內容應按以下順序排列：

1. 屬性宣告和初始化區塊
2. 次要建構函式
3. 方法宣告
4. 伴隨物件

不要按字母順序或可見性排序方法宣告，也不要將常規方法
與擴充方法分開。相反，將相關內容放在一起，以便從上到下閱讀類別的人可以
遵循邏輯流程。選擇一個順序（高層次內容優先，或反之），並堅持下去。

將巢狀類別放在使用這些類別的程式碼旁邊。如果這些類別旨在外部使用且未在
類別內部引用，則將它們放在末尾，伴隨物件之後。

### 介面實作佈局

實作介面時，保持實作成員的順序與介面成員的順序相同（如有必要，
可穿插用於實作的其他私有方法）。

### 重載佈局

始終將重載（overload）放在類別中彼此相鄰。

## 命名規則

Kotlin 中的套件和類別命名規則非常簡單：

* 套件名稱始終為小寫，不使用底線 (`_`) (`org.example.project`)。通常不鼓勵使用多個單字
的名稱，但如果確實需要使用多個單字，可以將它們連接在一起
或使用駝峰式命名法 (`org.example.myProject`)。

* 類別和物件的名稱使用大駝峰式命名法：

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 函式名稱

函式、屬性和局部變數的名稱以小寫字母開頭，並使用不帶底線的駝峰式命名法：

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

例外：用於創建類別實例的工廠函式可以與抽象返回類型同名：

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### 測試方法名稱

在測試中（且**僅**在測試中），您可以使用包含在反引號中的帶空格的方法名稱。
請注意，此類方法名稱僅從 API 等級 30 起由 Android 執行時支援。
測試程式碼中也允許方法名稱中使用底線。

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }
     
     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 屬性名稱

常數（標記為 `const` 的屬性，或沒有自定義 `get` 函式且持有深度不可變資料的頂層或物件 `val` 屬性）的名稱應使用全大寫、底線分隔的名稱，遵循 [screaming snake case](https://en.wikipedia.org/wiki/Snake_case) 慣例：

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

持有具有行為或可變資料的物件的頂層或物件屬性名稱應使用駝峰式命名法：

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

持有單例物件引用的屬性名稱可以與 `object` 宣告使用相同的命名風格：

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

對於列舉常數，可以使用全大寫、底線分隔的 ([screaming snake case](https://en.wikipedia.org/wiki/Snake_case)) 名稱
(`enum class Color { RED, GREEN }`) 或大駝峰式命名法，具體取決於用法。

### 支援屬性名稱 (Backing Properties)

如果一個類別有兩個概念上相同但其中一個是公共 API 的一部分而另一個是實作細節的屬性，則在私有屬性名稱前使用底線作為前綴：

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 選擇好名稱

類別的名稱通常是一個名詞或名詞片語，解釋該類別**是**什麼：`List`、`PersonReader`。

方法的名稱通常是一個動詞或動詞片語，說明該方法**做**什麼：`close`、`readPersons`。
名稱還應該暗示該方法是變動物件還是返回一個新物件。例如，`sort` 是
就地排序集合，而 `sorted` 是返回集合的排序副本。

名稱應清楚地說明實體的目的，因此最好避免在名稱中使用無意義的單字
（`Manager`、`Wrapper`）。

當使用縮寫作為宣告名稱的一部分時，請遵循以下規則：

* 對於兩個字母的縮寫，兩個字母都使用大寫。例如，`IOStream`。
* 對於兩個以上字母的縮寫，只將第一個字母大寫。例如，`XmlFormatter` 或 `HttpInputStream`。

## 格式化

### 縮排

使用四個空格進行縮排。不要使用 Tab 鍵。

對於花括號，將開括號放在建構開始的那一行的末尾，並將閉括號
放在單獨一行，與開括號水平對齊。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

>在 Kotlin 中，分號是可選的，因此換行符是重要的。語言設計假定
>Java 風格的括號，如果您嘗試使用不同的格式風格，可能會遇到意外行為。
>
{style="note"}

### 水平空白

* 在二元運算符周圍放置空格 (`a + b`)。例外：不要在「範圍」運算符 (`0..i`) 周圍放置空格。
* 不要在單元運算符周圍放置空格 (`a++`)。
* 在控制流程關鍵字 (`if`, `when`, `for`, 和 `while`) 和相應的開圓括號之間放置空格。
* 在主建構函式宣告、方法宣告或方法呼叫中的開圓括號之前不要放置空格。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

* 絕不在 `(`, `[` 之後或 `]`, `)` 之前放置空格。
* 絕不在 `.` 或 `?.` 周圍放置空格：`foo.bar().filter { it > 2 }.joinToString()`、`foo?.bar()`。
* 在 `//` 之後放置一個空格：`// This is a comment`。
* 不要將空格放在用於指定類型參數的尖括號周圍：`class Map<K, V> { ... }`。
* 不要將空格放在 `::` 周圍：`Foo::class`、`String::length`。
* 在用於標記可空類型 `?` 之前不要放置空格：`String?`。

作為一般規則，避免任何類型的水平對齊。將識別符號重新命名為不同長度的名稱
不應影響宣告或任何用法的格式。

### 冒號

在以下情況中，在 `:` 前放置一個空格：

* 當它用於分隔類型和超類型時。
* 當委託給超類別建構函式或同一類別的不同建構函式時。
* 在 `object` 關鍵字之後。

當 `:` 分隔宣告及其類型時，不要在 `:` 前放置空格。

在 `:` 後始終放置一個空格。

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

帶有少量主建構函式參數的類別可以寫在一行中：

```kotlin
class Person(id: Int, name: String)
```

標頭較長的類別應格式化，使每個主建構函式參數位於單獨的行，並有縮排。
此外，閉圓括號應位於新行。如果使用繼承，超類別建構函式呼叫或
已實作介面列表應與圓括號位於同一行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

對於多個介面，超類別建構函式呼叫應首先放置，然後每個介面應
位於不同的行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

對於超類型列表很長的類別，在冒號後換行，並將所有超類型名稱水平對齊：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

為了清楚地分隔類別標頭和主體，當類別標頭很長時，可以在
類別標頭後放置一個空行（如上例所示），或者將開花括號放在單獨的行：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

建構函式參數使用常規縮排（四個空格）。這確保在主建構函式中宣告的屬性與
在類別主體中宣告的屬性具有相同的縮排。

### 修飾符順序

如果宣告有多個修飾符，請始終按以下順序放置：

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

除非您正在開發函式庫，否則請省略冗餘修飾符（例如 `public`）。

### 註解

將註解放在單獨的行上，位於它們所附加的宣告之前，並具有相同的縮排：

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

檔案註解放置在檔案註釋（如果有的話）之後，`package` 語句之前，
並與 `package` 用一個空行分隔（以強調它們是針對檔案而不是套件的）。

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 函式

如果函式簽名不適合單行，請使用以下語法：

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

函式參數使用常規縮排（四個空格）。這有助於確保與建構函式參數的一致性。

對於主體由單個表達式組成的函式，優先使用表達式主體。

```kotlin
fun foo(): Int {     // bad
    return 1 
}

fun foo() = 1        // good
```

### 表達式主體

如果函式有一個表達式主體，其第一行不適合與宣告在同一行，則將 `=` 符號放在第一行
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

對於帶有初始化器的屬性，如果初始化器很長，則在 `=` 符號後添加換行符
並將初始化器縮排四個空格：

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 控制流程語句

如果 `if` 或 `when` 語句的條件是多行，則始終在語句主體周圍使用花括號。
將條件的每個後續行相對於語句開始縮排四個空格。
將條件的閉圓括號與開花括號放在單獨的行上：

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

這有助於對齊條件和語句主體。

將 `else`、`catch`、`finally` 關鍵字以及 `do-while` 循環的 `while` 關鍵字，放在
前面花括號的同一行：

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

將短分支放在與條件同一行，不帶括號。

```kotlin
when (foo) {
    true -> bar() // good
    false -> { baz() } // bad
}
```

### 方法呼叫

在長參數列表中，在開圓括號後換行。參數縮排四個空格。
將多個密切相關的參數分組在同一行。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

在分隔參數名稱和值的 `=` 符號周圍放置空格。

### 包裝鏈式呼叫

包裝鏈式呼叫時，將 `.` 字元或 `?.` 運算符放在下一行，並單次縮排：

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

鏈中的第一次呼叫通常應在其前面換行，但如果程式碼這樣更有意義，則可以省略。

### Lambda 表達式

在 lambda 表達式中，花括號周圍以及分隔參數與主體的箭頭周圍應使用空格。
如果呼叫只接受一個 lambda，盡可能將其傳遞到圓括號之外。

```kotlin
list.filter { it > 10 }
```

如果為 lambda 指派標籤，請不要在標籤和開花括號之間放置空格：

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

在多行 lambda 中宣告參數名稱時，將名稱放在第一行，然後是箭頭和換行符：

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

如果參數列表太長，無法容納在一行中，則將箭頭放在單獨的行上：

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

### 尾隨逗號

尾隨逗號是元素系列中最後一個項目之後的逗號符號：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

使用尾隨逗號有幾個好處：

* 它使版本控制差異更清晰——所有焦點都集中在更改的值上。
* 它使得添加和重新排序元素變得容易——如果您操作元素，則無需添加或刪除逗號。
* 它簡化了程式碼生成，例如用於物件初始化器。最後一個元素也可以帶逗號。

尾隨逗號完全是可選的——您的程式碼即使沒有它們也能正常工作。Kotlin 風格指南鼓勵在宣告處使用尾隨逗號，並將其在呼叫處的決定權留給您。

要在 IntelliJ IDEA 格式化程式中啟用尾隨逗號，請前往 **Settings/Preferences | Editor | Code Style | Kotlin**，
開啟 **Other** 標籤並選擇 **Use trailing comma** 選項。

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

#### 函式值參數 {initial-collapse-state="collapsed" collapsible="true"}

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

#### 帶可選類型參數（包括設定器） {initial-collapse-state="collapsed" collapsible="true"}

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

#### 索引後綴 {initial-collapse-state="collapsed" collapsible="true"}

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

#### Lambda 中的參數 {initial-collapse-state="collapsed" collapsible="true"}

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

#### 解構宣告 {initial-collapse-state="collapsed" collapsible="true"}

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

對於較長的文件註釋，將開頭的 `/**` 放在單獨的行上，並以星號開頭每一後續行：

```kotlin
/**
 * This is a documentation comment
 * on multiple lines.
 */
```

簡短註釋可以放在單行中：

```kotlin
/** This is a short documentation comment. */
```

通常，避免使用 `@param` 和 `@return` 標籤。相反，將參數和返回值描述
直接整合到文件註釋中，並在提及參數的地方添加連結。
僅在需要冗長描述且不適合主文本流時才使用 `@param` 和 `@return`。

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

通常，如果 Kotlin 中某些語法結構是可選的且被 IDE 標記為冗餘，
則應在程式碼中省略它。不要為了「清晰」而將不必要的語法元素留在程式碼中。

### Unit 返回類型

如果函式返回 Unit，則應省略返回類型：

```kotlin
fun foo() { // ": Unit" is omitted here

}
```

### 分號

盡可能省略分號。

### 字串模板

將簡單變數插入字串模板時不要使用花括號。僅對較長的表達式使用花括號：

```kotlin
println("$name has ${children.size} children")
```

使用 [多美元字串內插 (multi-dollar string interpolation)](strings.md#multi-dollar-string-interpolation)
將美元符號 `$` 視為字串字面量：

```kotlin
val KClass<*>.jsonSchema : String
get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta",
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

## 慣用語法特性使用

### 不變性

優先使用不可變資料而非可變資料。如果局部變數和屬性在初始化後
未被修改，則始終將其宣告為 `val` 而非 `var`。

始終使用不可變集合介面 (`Collection`, `List`, `Set`, `Map`) 來宣告不會
被變動的集合。當使用工廠函式創建集合實例時，如果可能，請始終使用返回
不可變集合類型的函式：

```kotlin
// Bad: 對不會被變動的值使用了可變集合類型
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// Good: 改用不可變集合類型
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// Bad: arrayListOf() 返回 ArrayList<T>，這是一個可變集合類型
val allowedValues = arrayListOf("a", "b", "c")

// Good: listOf() 返回 List<T>
val allowedValues = listOf("a", "b", "c")
```

### 預設參數值

優先宣告帶有預設參數值的函式，而非宣告重載函式。

```kotlin
// Bad
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// Good
fun foo(a: String = "a") { /*...*/ }
```

### 類型別名

如果您的程式碼庫中多次使用了函式類型或帶有類型參數的類型，請優先為其定義
類型別名：

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```
如果您使用私有或內部類型別名來避免名稱衝突，請優先使用
[套件和匯入 (Packages and Imports)](packages.md) 中提及的 `import ... as ...`。

### Lambda 參數

在簡短且不巢狀的 lambda 中，建議使用 `it` 慣例，而不是顯式宣告參數。
在帶有參數的巢狀 lambda 中，始終顯式宣告參數。

### Lambda 中的回傳

避免在 lambda 中使用多個帶標籤的回傳。考慮重構 lambda，使其具有單一退出點。
如果這不可能或不夠清晰，請考慮將 lambda 轉換為匿名函式。

不要為 lambda 中的最後一個語句使用帶標籤的回傳。

### 具名引數

當方法接受多個相同基本類型的參數，或 `Boolean` 類型的參數時，
使用具名引數語法，除非所有參數的意義從上下文來看絕對清晰。

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 條件語句

優先使用 `try`、`if` 和 `when` 的表達式形式。

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 -> "zero"
    else -> "nonzero"
}
```

以上比以下形式更受歡迎：

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

### if 與 when

對於二元條件，優先使用 `if` 而非 `when`。
例如，使用帶 `if` 的以下語法：

```kotlin
if (x == null) ... else ...
```

而不是帶 `when` 的以下語法：

```kotlin
when (x) {
    null -> // ...
    else -> // ...
}
```

如果有三個或更多選項，優先使用 `when`。

### when 表達式中的守衛條件

在 `when` 表達式或語句中結合多個布林表達式與 [守衛條件 (guard conditions)](control-flow.md#guard-conditions-in-when-expressions) 時，使用圓括號：

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

如果需要在條件語句中使用可空的 `Boolean`，請使用 `if (value == true)` 或 `if (value == false)` 檢查。

### 循環

優先使用高階函式（`filter`、`map` 等）而非循環。例外：`forEach`（除非 `forEach` 的接收者是可空的，或者 `forEach` 用作較長呼叫鏈的一部分，否則優先使用常規 `for` 循環）。

在複雜表達式使用多個高階函式和循環之間做出選擇時，請了解每種情況下執行的操作成本，並將效能考慮因素牢記在心。

### 範圍上的循環

使用 `..<` 運算符來循環開放範圍：

```kotlin
for (i in 0..n - 1) { /*...*/ }  // bad
for (i in 0..<n) { /*...*/ }  // good
```

### 字串

優先使用字串模板而非字串串接。

優先使用多行字串而非將 `
` 逸出序列嵌入到常規字串字面量中。

為了在多行字串中保持縮排，當結果字串不需要任何內部縮排時使用 `trimIndent`，
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

了解 [Java 和 Kotlin 多行字串](java-to-kotlin-idioms-strings.md#use-multiline-strings) 之間的差異。

### 函式與屬性

在某些情況下，不帶引數的函式可能與只讀屬性互換。
儘管語義相似，但在何時偏好哪一種方面有一些風格慣例。

當底層演算法符合以下條件時，優先使用屬性而不是函式：

* 不會拋出例外。
* 計算成本低廉（或在第一次執行時快取）。
* 如果物件狀態未改變，則在多次呼叫時返回相同的結果。

### 擴充函式

自由地使用擴充函式。每次您有一個主要作用於物件的函式時，考慮將其
作為接受該物件作為接收者的擴充函式。為了最大程度地減少 API 污染，
盡可能地限制擴充函式的可見性。根據需要，使用局部擴充函式、成員擴充函式，
或帶有私有可見性的頂層擴充函式。

### 中綴函式

僅當函式作用於兩個扮演相似角色的物件時，才將其宣告為 `infix`。好的範例：`and`、`to`、`zip`。
壞的範例：`add`。

如果中綴函式會變動接收者物件，則不要將其宣告為 `infix`。

### 工廠函式

如果為一個類別宣告工廠函式，避免給它與類別本身相同的名稱。優先使用獨特的名稱，
清楚說明工廠函式的行為為何特殊。只有在確實沒有特殊語義時，
才能使用與類別相同的名稱。

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

如果您有一個具有多個重載建構函式，這些建構函式不呼叫不同的超類別建構函式，並且
無法簡化為包含預設值參數的單一建構函式，則優先將重載建構函式替換為
工廠函式。

### 平台類型

返回平台類型表達式的公共函式/方法必須明確宣告其 Kotlin 類型：

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

任何用平台類型表達式初始化的屬性（套件級或類別級）都必須明確宣告其 Kotlin 類型：

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

用平台類型表達式初始化的局部變數可以宣告其類型，也可以不宣告：

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### 作用域函式 apply/with/run/also/let

Kotlin 提供了一組函式，用於在給定物件的上下文中執行程式碼區塊：`let`、`run`、`with`、`apply` 和 `also`。
有關如何為您的情況選擇正確作用域函式的指導，請參閱 [作用域函式 (Scope Functions)](scope-functions.md)。

## 函式庫編碼慣例

編寫函式庫時，建議遵循一套額外的規則以確保 API 穩定性：

 * 始終顯式指定成員可見性（以避免意外地將宣告公開為公共 API）。
 * 始終顯式指定函式返回類型和屬性類型（以避免在實作更改時意外更改返回類型）。
 * 為所有公共成員提供 [KDoc](kotlin-doc.md) 註釋，除了不需要任何新文件說明的重寫成員之外
   （以支援為函式庫生成文件）。

在 [函式庫作者指南 (Library authors' guidelines)](api-guidelines-introduction.md) 中了解更多關於編寫函式庫 API 的最佳實踐和應考慮的點。