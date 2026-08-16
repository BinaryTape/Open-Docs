[//]: # (title: 程式碼慣例)

眾所周知且易於遵循的程式碼慣例對於任何程式語言都至關重要。
在此我們為使用 Kotlin 的專案提供程式碼風格和程式碼組織指南。

## 在 IDE 中設定風格

Kotlin 最受歡迎的兩個 IDE —— [IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Android Studio](https://developer.android.com/studio/) —— 對程式碼樣式提供了強大的支援。您可以設定它們以自動格式化您的程式碼，使其與指定的程式碼風格保持一致。

### 套用樣式指南

1. 前往 **Settings/Preferences | Editor | Code Style | Kotlin**。
2. 點擊 **Set from...**。
3. 選擇 **Kotlin style guide**。

### 驗證您的程式碼是否遵循樣式指南

1. 前往 **Settings/Preferences | Editor | Inspections | General**。
2. 開啟 **Incorrect formatting** 檢查。
其餘驗證樣式指南中描述的其他問題（如命名慣例）的額外檢查均為預設啟用。

<!-- Replace with an external link when the guide is moved -->

如需更多資訊，請參閱 [使用 IntelliJ IDEA 遷移至 Kotlin 程式碼風格](code-style-migration-guide.md) 指南。

## 原始碼組織

### 目錄結構

在純 Kotlin 專案中，建議的目錄結構遵循套件結構，並省略共同的根套件。例如，如果專案中所有的程式碼都在 `org.example.kotlin` 套件及其子套件中，則 `org.example.kotlin` 套件下的檔案應直接放置在原始碼根目錄下，而 `org.example.kotlin.network.socket` 中的檔案應放在原始碼根目錄的 `network/socket` 子目錄中。

> 在 JVM 上：在 Kotlin 與 Java 混合使用的專案中，Kotlin 原始碼檔案應與 Java 原始碼檔案位於相同的原始碼根目錄下，並遵循相同的目錄結構：每個檔案都應儲存在與每個套件陳述式相對應的目錄中。
>
{style="note"}

### 原始程式檔名稱

如果一個 Kotlin 檔案包含單個類別或介面（可能包含相關的頂層宣告），其名稱應與類別名稱相同，並附加 `.kt` 擴充套件。這適用於所有型別的類別和介面。
如果一個檔案包含多個類別或僅包含頂層宣告，請選擇一個描述檔案內容的名稱，並相應地為檔案命名。
使用 [大駝峰式大小寫 (Upper Camel Case)](https://en.wikipedia.org/wiki/Camel_case)，即每個單字的首字母都大寫。
例如：`ProcessDeclarations.kt`。

檔案名稱應描述檔案中的程式碼用途。因此，應避免在檔案名稱中使用如 `Util` 之類無意義的單字。

#### 多平台專案

在多平台專案中，平台專屬原始碼集中具有頂層宣告的檔案，應具有與原始碼集名稱相關聯的後綴。例如：

* **jvm**Main/kotlin/Platform.**jvm**.kt
* **android**Main/kotlin/Platform.**android**.kt
* **ios**Main/kotlin/Platform.**ios**.kt

至於共同原始碼集（common source set），具有頂層宣告的檔案不應有後綴。例如：`commonMain/kotlin/Platform.kt`。

##### 技術細節 {initial-collapse-state="collapsed" collapsible="true"}

由於 JVM 的限制，我們建議在多平台專案中遵循此檔案命名方案：JVM 不允許頂層成員（函式、屬性）。

為了解決這個問題，Kotlin JVM 編譯器會建立包裝類別（所謂的「檔案外觀 (file facades)」），其中包含頂層成員宣告。檔案外觀具有一個源自檔案名稱的內部名稱。

反之，JVM 不允許具有相同完全限定名稱 (FQN) 的多個類別。這可能會導致 Kotlin 專案無法編譯為 JVM 的情況：

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // 包含 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // 包含 'fun multiply() { }'
```

在這裡，兩個 `Platform.kt` 檔案都在同一個套件中，因此 Kotlin JVM 編譯器會產生兩個檔案外觀，兩者的 FQN 均為 `myPackage.PlatformKt`。這會產生 "Duplicate JVM classes" 錯誤。

避免這種情況最簡單的方法是根據上述指南重新命名其中一個檔案。這種命名方案有助於避免衝突，同時保持程式碼的可讀性。

> 在以下兩種情況下，這些建議似乎是多餘的，但我們仍然建議遵循它們：
> 
> * 非 JVM 平台不存在重複檔案外觀的問題。然而，這種命名方案可以幫助您保持檔案命名的一致性。
> * 在 JVM 上，如果原始程式檔沒有頂層宣告，則不會產生檔案外觀，您也不會面臨命名衝突。
> 
>   然而，這種命名方案可以幫助您避免在進行簡單重構或添加內容時，因包含頂層函式而導致相同的 "Duplicate JVM classes" 錯誤。
> 
{style="tip"}

### 原始程式檔組織

只要多個宣告（類別、頂層函式或屬性）在語義上密切相關，且檔案大小保持在合理範圍內（不超過幾百行），我們鼓勵將它們放在同一個 Kotlin 原始程式檔中。

特別是，當為某個類別定義對該類別的所有用戶端都相關的擴充函式時，請將它們與類別本身放在同一個檔案中。當定義僅對特定用戶端有意義的擴充函式時，請將它們放在該用戶端的程式碼旁邊。避免僅為了存放某個類別的所有擴充功能而建立檔案。

### 類別配置

類別的內容應按以下順序排列：

1. 屬性宣告和初始化區塊
2. 次要建構函式
3. 方法宣告
4. 伴生物件

不要按字母順序或可見性對方法宣告進行排序，也不要將一般方法與擴充方法分開。相反地，應將相關內容放在一起，以便從上到下閱讀類別的人可以遵循正在發生的邏輯。選擇一種順序（高階內容在前，反之亦然）並堅持執行。

將巢狀類別放在使用這些類別的程式碼旁邊。如果這些類別打算在外部使用且未在類別內部被引用，請將它們放在最後，即伴生物件之後。

### 介面實作配置

實作介面時，請保持實作成員的順序與介面成員的順序相同（如有必要，可以在其中插入用於實作的額外私有方法）。

### 多載配置

在類別中，始終將多載函式放在一起。

## 命名規則

Kotlin 中的套件和類別命名規則非常簡單：

* 套件名稱一律小寫且不使用底線 (`org.example.project`)。一般不鼓勵使用多個單字的名稱，但如果確實需要使用多個單字，您可以直接將它們連接在一起，或使用駝峰式大小寫 (`org.example.myProject`)。

* 類別和物件的名稱使用大駝峰式大小寫：

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 函式名稱
 
函式、屬性和區域變數的名稱以小寫字母開頭，並使用駝峰式大小寫，不使用底線：

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

### 類別式函式的名稱

有兩種例外情況，函式名稱應遵循類別命名慣例。這類函式通常定義在頂層。

* 建立類別執行個體的工廠函式可以與抽象傳回型別具有相同的名稱：

   ```kotlin
   interface Foo { /*...*/ }

   class FooImpl : Foo { /*...*/ }

   fun Foo(): Foo { return FooImpl() }
   ```

* 傳回 `Unit` 的 `@Composable` 函式：

   ```kotlin
   @Composable fun TabHeader { /*...*/ }
   ```

### 測試方法的名稱

在測試中（且**僅**在測試中），您可以使用包含在反引號中、帶有空格的方法名稱。請注意，此類方法名稱僅從 API 級別 30 開始受 Android 執行階段支援。測試程式碼中也允許在方法名稱中使用底線。

```kotlin
class MyTestCase {
    @Test fun `ensure everything works`() { /*...*/ }

    @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 屬性名稱

常數的名稱（標記為 `const` 的屬性，或不具有自訂 `get` 函式且持有深層不可變資料的頂層或物件 `val` 屬性）應遵循 [SCREAMING_SNAKE_CASE](https://en.wikipedia.org/wiki/Snake_case) 慣例，使用全大寫並以底線分隔：

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

持有具有行為的物件或可變資料的頂層或物件屬性名稱應使用駝峰式大小寫名稱：

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

持有單例物件參照的屬性名稱可以使用與 `object` 宣告相同的命名樣式：

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

對於列舉常數，根據用法，可以使用全大寫、底線分隔的名稱 ([SCREAMING_SNAKE_CASE](https://en.wikipedia.org/wiki/Snake_case)) (`enum class Color { RED, GREEN }`) 或大駝峰式大小寫名稱。
   
### 支援屬性的名稱

如果一個類別有兩個在概念上相同但一個是公開 API 的一部分而另一個是實作細節的屬性，請使用底線作為私有屬性名稱的前綴：

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
        get() = _elementList
}
```

### 選擇好的名稱

類別的名稱通常是名詞或名詞片語，解釋類別「是什麼」：`List`、`PersonReader`。

方法的名稱通常是動詞或動詞片語，說明方法「做什麼」：`close`、`readPersons`。
名稱還應暗示該方法是修改物件還是傳回一個新物件。例如，`sort` 是對集合進行原地排序，而 `sorted` 是傳回集合的已排序副本。

名稱應清楚說明實體的目的，因此最好避免在名稱中使用無意義的單字（`Manager`、`Wrapper`）。

當使用縮寫作為宣告名稱的一部分時，請遵循以下規則：

* 對於兩個字母的縮寫，兩個字母都使用大寫。例如：`IOStream`。
* 對於超過兩個字母的縮寫，僅將第一個字母大寫。例如：`XmlFormatter` 或 `HttpInputStream`。

## 格式化

### 縮排

使用四個空格進行縮排。不要使用 Tab 鍵。

對於花括號，將起始花括號放在結構開始行的末尾，並將結束花括號放在單獨的一行，且與起始結構水平對齊。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

> 在 Kotlin 中，分號是可選的，因此換行符號具有重要意義。語言設計採用 Java 風格的花括號，如果您嘗試使用不同的格式化風格，可能會遇到意外行為。
>
{style="note"}

### 水平空白字元

* 在二元運算子前後放置空格 (`a + b`)。例外：不要在 "range to" 運算子 (`0..i`) 前後放置空格。
* 不要在單元運算子前後放置空格 (`a++`)。
* 在控制流關鍵字（`if`、`when`、`for` 和 `while`）與相對應的起始圓括號之間放置空格。
* 不要在主建構函式宣告、方法宣告或方法呼叫的起始圓括號前放置空格。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

* 永遠不要在 `(`、`[` 之後或 `]`、`)` 之前放置空格。
* 永遠不要在 `.` 或 `?.` 前後放置空格：`foo.bar().filter { it > 2 }.joinToString()`、`foo?.bar()`。
* 在 `//` 之後放置空格：`// 這是一條註解`。
* 不要在用於指定型別參數的尖括號前後放置空格：`class Map<K, V> { ... }`。
* 不要在 `::` 前後放置空格：`Foo::class`、`String::length`。
* 不要在用於標記可 null 型別的 `?` 之前放置空格：`String?`。

作為一般規則，避免任何形式的水平對齊。將識別符重新命名為不同長度的名稱不應影響宣告或任何用法的格式化。

### 冒號

在以下情況下，在 `:` 之前放置空格：

* 當它用於分隔型別與超型別時。
* 當委派給超類別建構函式或同一個類別的不同建構函式時。
* 在 `object` 關鍵字之後。
    
當 `:` 分隔宣告及其型別時，不要在之前放置空格。
 
始終在 `:` 之後放置空格。

```kotlin
abstract class Foo<out T : Any> : IFoo {
    abstract fun foo(a: Int): T
}

class FooImpl : Foo() {
    constructor(x: String) : this(x) { /*...*/ }

    val x = object : IFoo { /*...*/ } 
}
```

### 類別頁首

具有少量主建構函式參數的類別可以寫在同一行：

```kotlin
class Person(id: Int, name: String)
```

具有較長頁首的類別應進行格式化，使每個主建構函式參數都位於單獨的縮排行。此外，結束圓括號應位於新行。如果您使用繼承，則超類別建構函式呼叫或實作的介面清單應與圓括號位於同一行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

對於多個介面，應先放置超類別建構函式呼叫，然後將每個介面放置在不同的行中：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

對於具有長超型別清單的類別，在冒號後換行並水平對齊所有超型別名稱：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

為了在類別頁首較長時清楚地分隔類別頁首和主體，可以在類別頁首後放置一個空行（如上例所示），或者將起始花括號放在單獨的一行：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

對建構函式參數使用一般縮排（四個空格）。這可確保在主建構函式中宣告的屬性與在類別主體中宣告的屬性具有相同的縮排。

### 修飾詞順序

如果一個宣告有多個修飾詞，始終按以下順序排列：

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
enum / annotation / fun // 作為 `fun interface` 中的修飾詞 
companion
inline / value
infix
operator
data
```

將所有註解放在修飾詞之前：

```kotlin
@Named("Foo")
private val foo: Foo
```

除非您正在開發程式庫，否則請省略多餘的修飾詞（例如 `public`）。

### 註解

將註解放在它們所附加的宣告之前的單獨行中，並使用相同的縮排：

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

不帶引數的註解可以放在同一行：

```kotlin
@JsonExclude @JvmField
var x: String
```

單個不帶引數的註解可以與相應的宣告放在同一行：

```kotlin
@Test fun foo() { /*...*/ }
```

### 檔案註解

檔案註解放在檔案註解（如有）之後、`package` 陳述式之前，並用空行與 `package` 分隔（以強調它們針對的是檔案而不是套件）。

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 函式

如果函式簽章在一行內放不下，請使用以下語法：

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // 主體
}
```

對函式參數使用一般縮排（四個空格）。這有助於確保與建構函式參數的一致性。

對於主體由單個運算式組成的函式，優先使用運算式主體。

```kotlin
fun foo(): Int {     // 差
    return 1 
}

fun foo() = 1        // 好
```

### 運算式主體

如果函式具有運算式主體，且其第一行與宣告不在同一行，請將 `=` 號放在第一行，並將運算式主體縮排四個空格。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 屬性

對於非常簡單的唯讀屬性，考慮單行格式：

```kotlin
val isEmpty: Boolean get() = size == 0
```

對於更複雜的屬性，始終將 `get` 和 `set` 關鍵字放在單獨的行中：

```kotlin
val foo: String
    get() { /*...*/ }
```

對於具有初始設定式的屬性，如果初始設定式較長，請在 `=` 號後換行，並將初始設定式縮排四個空格：

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 控制流陳述式

如果 `if` 或 `when` 陳述式的條件是多行的，請務必在陳述式主體周圍使用花括號。將條件的每個後續行相對於陳述式開始處縮排四個空格。將條件的結束圓括號與起始花括號一起放在單獨的一行：

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

這有助於對齊條件和陳述式主體。

將 `else`、`catch`、`finally` 關鍵字以及 `do-while` 迴圈的 `while` 關鍵字放在與前一個花括號相同的行上：

```kotlin
if (condition) {
    // 主體
} else {
    // else 部分
}

try {
    // 主體
} finally {
    // 清理
}
```

在 `when` 陳述式中，如果一個分支超過一行，考慮用空行將其與相鄰的情況區塊分隔開：

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

將簡短的分支與條件放在同一行，不帶花括號。

```kotlin
when (foo) {
    true -> bar() // 好
    false -> { baz() } // 差
}
```

### 方法呼叫

在長引數清單中，在起始圓括號後換行。將引數縮排四個空格。將多個密切相關的引數分組在同一行。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

在分隔引數名稱和值的 `=` 號前後放置空格。

### 鏈式呼叫換行

包裝鏈式呼叫時，將 `.` 字元或 `?.` 運算子放在下一行，並使用單個縮排：

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

鏈中的第一個呼叫通常應在其之前換行，但如果這樣做程式碼更有意義，也可以省略。

### Lambda

在 Lambda 運算式中，應在花括號前後以及分隔參數與主體的箭頭前後使用空格。如果一個呼叫接受單個 Lambda，請儘可能將其傳遞到圓括號之外。

```kotlin
list.filter { it > 10 }
```

如果為 Lambda 分配標籤，不要在標籤和起始花括號之間放置空格：

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

在多行 Lambda 中宣告參數名稱時，將名稱放在第一行，後跟箭頭和換行：

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

如果參數清單太長而無法放在一行，請將箭頭放在單獨的一行：

```kotlin
foo {
    context: Context,
    environment: Env
    ->
    context.configureEnv(environment)
}
```

### 尾隨逗號

尾隨逗號是指在一系列元素中的最後一項之後的逗號符號：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // 尾隨逗號
)
```

使用尾隨逗號有幾個好處：

* 它使版本控制的 diff 更乾淨 —— 因為所有的焦點都在更改後的值上。
* 它使添加和重新排序元素變得容易 —— 如果您操作元素，則無需添加或刪除逗號。
* 它簡化了程式碼產生，例如對物件初始設定式。最後一個元素也可以有一個逗號。

尾隨逗號完全是可選的 —— 沒有它們，您的程式碼仍然可以運作。Kotlin 樣式指南鼓勵在宣告處使用尾隨逗號，而在呼叫處則由您自行決定。

若要在 IntelliJ IDEA 格式化程式中啟用尾隨逗號，請前往 **Settings/Preferences | Editor | Code Style | Kotlin**，開啟 **Other** 分頁並選擇 **Use trailing comma** 選項。

#### 列舉 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // 尾隨逗號
}
```

#### 值引數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // 尾隨逗號
)
val colors = listOf(
    "red",
    "green",
    "blue", // 尾隨逗號
)
```

#### 類別屬性和參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Customer(
    val name: String,
    val lastName: String, // 尾隨逗號
)
class Customer(
    val name: String,
    lastName: String, // 尾隨逗號
)
```

#### 函式值參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun powerOf(
    number: Int, 
    exponent: Int, // 尾隨逗號
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // 尾隨逗號
) {}
fun print(
    vararg quantity: Int,
    description: String, // 尾隨逗號
) {}
```

#### 具有可選型別的參數（包括 setter） {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
val sum: (Int, Int, Int) -> Int = fun(
    x,
    y,
    z, // 尾隨逗號
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
        yValue, // 尾隨逗號
    ]
```

#### Lambda 中的參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // 尾隨逗號
        ->
        println("1")
    }
    println(x)
}
```

#### when 項目 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // 尾隨逗號
        -> true
    else -> false
}
```

#### 集合常值（在註解中） {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // 尾隨逗號
])
fun run() {}
```

#### 型別引數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // 尾隨逗號
            >()
}
```

#### 型別參數 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class MyMap<
        MyKey,
        MyValue, // 尾隨逗號
        > {}
```

#### 解構宣告 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // 尾隨逗號
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // 尾隨逗號
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## 文件註解

對於較長的文件註解，將起始的 `/**` 放在單獨的一行，並以星號開始後續的每一行：

```kotlin
/**
 * 這是一條多行
 * 的文件註解。
 */
```

簡短的註解可以放在單一行中：

```kotlin
/** 這是一條簡短的文件註解。 */
```

通常，避免使用 `@param` 和 `@return` 標籤。相反地，應將參數和傳回值的描述直接納入文件註解中，並在提及參數的地方添加連結。僅當需要不適合主文流的冗長描述時，才使用 `@param` 和 `@return`。

```kotlin
// 避免這樣做：

/**
 * 傳回給定數字的絕對值。
 * @param number 要傳回絕對值的數字。
 * @return 絕對值。
 */
fun abs(number: Int): Int { /*...*/ }

// 改為這樣做：

/**
 * 傳回給定 [number] 的絕對值。
 */
fun abs(number: Int): Int { /*...*/ }
```

## 避免冗餘結構

一般而言，如果 Kotlin 中的某個語法結構是可選的，且被 IDE 醒目提示為冗餘，則應在程式碼中將其省略。不要僅僅「為了清楚起見」而在程式碼中保留不必要的語法元素。

### Unit 傳回型別

如果函式傳回 Unit，則應省略傳回型別：

```kotlin
fun foo() { // 這裡省略了 ": Unit"

}
```

### 分號

儘可能省略分號。

### 字串範本

在字串範本中插入簡單變數時，不要使用花括號。僅對較長的運算式使用花括號：

```kotlin
println("$name has ${children.size} children")
```

使用 [多美元符號字串插值](strings.md#multi-dollar-string-interpolation)
來處理美元符號字元。