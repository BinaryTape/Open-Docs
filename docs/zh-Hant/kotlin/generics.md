[//]: # (title: 泛型：in, out, where)

Kotlin 中的類別可以擁有類型參數，就像在 Java 中一樣：

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

要建立此類別的實例，只需提供類型引數：

```kotlin
val box: Box<Int> = Box<Int>(1)
```

但如果參數可以被推斷，例如從建構函數引數推斷，則可以省略類型引數：

```kotlin
val box = Box(1) // 1 的類型是 Int，因此編譯器會推斷出它是 Box<Int>
```

## 變異

Java 類型系統中最棘手的方面之一是萬用字元類型（請參閱 [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)）。Kotlin 沒有這些。相反地，Kotlin 擁有宣告處變異和類型投影。

### Java 中的變異和萬用字元

讓我們思考一下為什麼 Java 需要這些神秘的萬用字元。首先，Java 中的泛型類型是 _不變的_，這表示 `List<String>` _不是_ `List<Object>` 的子類型。如果 `List` 不是 _不變的_，它將不會比 Java 的陣列更好，因為以下程式碼將會編譯通過，但在執行時期引發例外：

```java
// Java
List<String> strs = new ArrayList<String>();

// Java 在編譯時期在此報告類型不匹配。
List<Object> objs = strs;

// 如果沒有呢？
// 我們就能夠將 Integer 放入 String 列表。
objs.add(1);

// 然後在執行時期，Java 會拋出
// ClassCastException：Integer 無法轉換為 String
String s = strs.get(0); 
```

Java 禁止此類事情以保證執行時期安全。但這產生了影響。例如，考慮 `Collection` 介面中的 `addAll()` 方法。此方法的簽章是什麼？直觀地，你會這樣寫：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

但這樣，你將無法執行以下操作（這完全是安全的）：

```java
// Java

// 以下使用 addAll 的天真宣告將無法編譯：
// Collection<String> 不是 Collection<Object> 的子類型
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

這就是為什麼 `addAll()` 的實際簽章如下：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

_萬用字元類型引數_ `? extends E` 表示此方法接受 `E` 物件的集合，_或 `E` 的子類型_ 的集合，而不僅僅是 `E` 本身。這意味著你可以安全地從項目中 _讀取_ `E`（此集合的元素是 E 子類的實例），但 _無法寫入_ 其中，因為你不知道哪些物件符合該未知的 `E` 子類型。作為此限制的回報，你將獲得期望的行為：`Collection<String>` _是_ `Collection<? extends Object>` 的子類型。換句話說，帶有 _extends_ 界限（_上限_）的萬用字元使類型變成 _協變型_。

理解其工作原理的關鍵相當簡單：如果你只能從集合中 _取出_ 項目，那麼使用 `String` 的集合並從中讀取 `Object` 是可以的。相反地，如果你只能將項目 _放入_ 集合，那麼取一個 `Object` 集合並將 `String` 放入其中也是可以的：在 Java 中有 `List<? super String>`，它接受 `String` 或其任何超類型。

後者被稱為 _逆變型_，你只能在 `List<? super String>` 上呼叫接受 `String` 作為引數的方法（例如，你可以呼叫 `add(String)` 或 `set(int, String)`）。如果你呼叫 `List<T>` 中返回 `T` 的方法，你不會得到 `String`，而是 `Object`。

Joshua Bloch 在他的書 [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html) 中很好地解釋了這個問題（項目 31：「使用有界萬用字元來增加 API 彈性」）。他將你只 _讀取_ 的物件命名為 _生產者_，將你只 _寫入_ 的物件命名為 _消費者_。他建議：

>「為了最大彈性，在代表生產者或消費者的輸入參數上使用萬用字元類型。」

然後他提出了以下助記符：_PECS_ 代表 _Producer-Extends, Consumer-Super_（生產者-extends，消費者-super）。

> 如果你使用生產者物件，例如 `List<? extends Foo>`，則不允許在此物件上呼叫 `add()` 或 `set()`，但這並不意味著它不可變：例如，沒有什麼能阻止你呼叫 `clear()` 以從列表中移除所有項目，因為 `clear()` 根本不接受任何參數。
>
> 萬用字元（或其他類型的變異）唯一保證的是 _類型安全_。不可變性是一個完全不同的故事。
>
{style="note"}

### 宣告處變異

假設有一個泛型介面 `Source<T>`，它沒有任何方法將 `T` 作為參數，只有返回 `T` 的方法：

```java
// Java
interface Source<T> {
    T nextT();
}
```

那麼，將 `Source<String>` 實例的引用儲存在 `Source<Object>` 類型的變數中將是完全安全的——沒有消費者方法可以呼叫。但 Java 不知道這一點，並且仍然禁止它：

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! 在 Java 中不允許
    // ...
}
```

為了修正此問題，你應該宣告類型為 `Source<? extends Object>` 的物件。這樣做是無意義的，因為你仍然可以在這樣的變數上呼叫所有相同的方法，所以更複雜的類型沒有增加任何價值。但編譯器不知道這一點。

在 Kotlin 中，有一種方法可以向編譯器解釋此類事情。這被稱為 _宣告處變異_：你可以註解 `Source` 的 _類型參數_ `T`，以確保它只從 `Source<T>` 的成員中 _返回_（生產），從不被消費。要做到這一點，請使用 `out` 修飾符：

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // 這是可以的，因為 T 是一個 out-參數
    // ...
}
```

一般規則是：當類別 `C` 的類型參數 `T` 被宣告為 `out` 時，它只能出現在 `C` 成員的 _out_ 位置，但作為回報，`C<Base>` 可以安全地成為 `C<Derived>` 的超類型。

換句話說，你可以說類別 `C` 在參數 `T` 上是 _協變型_，或者 `T` 是一個 _協變型_ 類型參數。你可以將 `C` 視為 `T` 的 _生產者_，而不是 `T` 的 _消費者_。

`out` 修飾符被稱為 _變異註解_，由於它是在類型參數宣告處提供的，因此它提供了 _宣告處變異_。這與 Java 的 _使用點變異_ 形成對比，在 Java 中類型使用中的萬用字元使類型協變。

除了 `out`，Kotlin 還提供了一個互補的變異註解：`in`。它使類型參數 _逆變型_，這表示它只能被消費而從不被生產。`Comparable` 是一個逆變型的好例子：

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 的類型是 Double，它是 Number 的子類型
    // 因此，你可以將 x 賦值給類型為 Comparable<Double> 的變數
    val y: Comparable<Double> = x // OK!
}
```

_in_ 和 _out_ 這些詞似乎不言自明（因為它們已經在 C# 中成功使用了相當長的時間），因此上面提到的助記符並不是真正需要。事實上，它可以在更高的抽象層次上重新措辭：

**[存在主義](https://en.wikipedia.org/wiki/Existentialism) 轉變：消費者 in，生產者 out！** :-)

## 類型投影

### 使用點變異：類型投影

將類型參數 `T` 宣告為 `out` 並避免使用點上的子類型問題非常容易，但有些類別實際上 _無法_ 被限制為只返回 `T`！`Array` 就是一個很好的例子：

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

此類別在 `T` 上既不是協變型也不是逆變型。這造成了某些不靈活性。考慮以下函數：

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

此函數應該將項目從一個陣列複製到另一個陣列。讓我們嘗試在實踐中應用它：

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ 類型為 Array<Int>，但預期為 Array<Any>
```

在這裡你遇到了同樣熟悉的問題：`Array<T>` 在 `T` 上是 _不變的_，因此 `Array<Int>` 和 `Array<Any>` 都不是彼此的子類型。為什麼不？同樣，這是因為 `copy` 可能會有意想不到的行為，例如，它可能會嘗試向 `from` 寫入 `String`，如果你實際傳遞一個 `Int` 陣列到那裡，稍後將會拋出 `ClassCastException`。

為了禁止 `copy` 函數向 `from` _寫入_，你可以執行以下操作：

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

這是 _類型投影_，這意味著 `from` 不是一個簡單的陣列，而是一個受限的（_投影的_）陣列。你只能呼叫返回類型參數 `T` 的方法，在此情況下表示你只能呼叫 `get()`。這是我們處理 _使用點變異_ 的方法，它對應於 Java 的 `Array<? extends Object>`，同時稍微簡單一些。

你也可以使用 `in` 投影類型：

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>` 對應於 Java 的 `Array<? super String>`。這意味著你可以將 `String`、`CharSequence` 或 `Object` 的陣列傳遞給 `fill()` 函數。

### 星號投影

有時候你希望表示你對類型引數一無所知，但你仍然希望以安全的方式使用它。這裡的安全方式是定義這樣一個泛型類型的投影，使該泛型類型的每個具體實例化都將是該投影的子類型。

Kotlin 為此提供了所謂的 _星號投影_ 語法：

- 對於 `Foo<out T : TUpper>`，其中 `T` 是具有上限 `TUpper` 的協變型類型參數，`Foo<*>` 等同於 `Foo<out TUpper>`。這表示當 `T` 未知時，你可以安全地從 `Foo<*>` 中 _讀取_ `TUpper` 的值。
- 對於 `Foo<in T>`，其中 `T` 是逆變型類型參數，`Foo<*>` 等同於 `Foo<in Nothing>`。這表示當 `T` 未知時，你無法安全地向 `Foo<*>` _寫入_ 任何內容。
- 對於 `Foo<T : TUpper>`，其中 `T` 是具有上限 `TUpper` 的不變型類型參數，`Foo<*>` 等同於用於讀取值的 `Foo<out TUpper>` 和用於寫入值的 `Foo<in Nothing>`。

如果泛型類型有多個類型參數，每個類型參數都可以獨立投影。例如，如果類型被宣告為 `interface Function<in T, out U>`，你可以使用以下星號投影：

*   `Function<*, String>` 表示 `Function<in Nothing, String>`。
*   `Function<Int, *>` 表示 `Function<Int, out Any?>`。
*   `Function<*, *>` 表示 `Function<in Nothing, out Any?>`。

> 星號投影非常像 Java 的原始類型，但更安全。
>
{style="note"}

## 泛型函數

類別並不是唯一可以擁有類型參數的宣告。函數也可以。類型參數放置在函數名稱的 _前面_：

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // extension function
    // ...
}
```

要呼叫泛型函數，請在呼叫點的函數名稱 _之後_ 指定類型引數：

```kotlin
val l = singletonList<Int>(1)
```

如果類型引數可以從上下文中推斷出來，則可以省略它們，因此以下範例也有效：

```kotlin
val l = singletonList(1)
```

## 泛型約束

可以替換給定類型參數的所有可能類型的集合可能會受到 _泛型約束_ 的限制。

### 上限

最常見的約束類型是 _上限_，它對應於 Java 的 `extends` 關鍵字：

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

冒號後指定的類型是 _上限_，表示只有 `Comparable<T>` 的子類型才能替換 `T`。例如：

```kotlin
sort(listOf(1, 2, 3)) // OK。Int 是 Comparable<Int> 的子類型
sort(listOf(HashMap<Int, String>())) // 錯誤：HashMap<Int, String> 不是 Comparable<HashMap<Int, String>> 的子類型
```

預設上限（如果沒有指定）是 `Any?`。在尖括號內只能指定一個上限。如果同一個類型參數需要多個上限，則需要一個單獨的 _where_ 子句：

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

傳遞的類型必須同時滿足 `where` 子句的所有條件。在上述範例中，`T` 類型必須同時實作 `CharSequence` 和 `Comparable`。

## 絕對非空類型

為了更容易與泛型 Java 類別和介面互通，Kotlin 支援將泛型類型參數宣告為 **絕對非空**。

要將泛型類型 `T` 宣告為絕對非空，請使用 `& Any` 宣告類型。例如：`T & Any`。

絕對非空類型必須具有可為空的 [上限](#upper-bounds)。

宣告絕對非空類型的最常見用例是當你想要覆寫一個 Java 方法，該方法包含 `@NotNull` 作為引數時。例如，考慮 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功覆寫 `load()` 方法，你需要將 `T1` 宣告為絕對非空：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 是絕對非空的
    override fun load(x: T1 & Any): T1 & Any
}
```

當只使用 Kotlin 時，你不太可能需要明確宣告絕對非空類型，因為 Kotlin 的類型推斷會為你處理。

## 類型擦除

Kotlin 對泛型宣告用法執行的類型安全檢查是在編譯時期完成的。在執行時期，泛型類型的實例不包含有關其實際類型引數的任何資訊。類型資訊被稱為被 _擦除_。例如，`Foo<Bar>` 和 `Foo<Baz?>` 的實例被擦除為 `Foo<*>`。

### 泛型類型檢查和轉換

由於類型擦除，沒有一般方法可以檢查泛型類型的實例是否在執行時期使用某些類型引數建立，並且編譯器禁止此類 `is` 檢查，例如 `ints is List<Int>` 或 `list is T`（類型參數）。但是，你可以檢查實例是否符合星號投影類型：

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // 這些項目的類型是 `Any?`
}
```

類似地，當你已經靜態（在編譯時期）檢查了實例的類型引數時，你可以進行涉及類型非泛型部分的 `is` 檢查或轉換。請注意，在這種情況下，尖括號被省略：

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` 被智慧轉換為 `ArrayList<String>`
    }
}
```

相同的語法但省略了類型引數的用法，也可用於不考慮類型引數的轉換：`list as ArrayList`。

泛型函數呼叫的類型引數也僅在編譯時期檢查。在函數主體內部，類型參數不能用於類型檢查，並且向類型參數的類型轉換（`foo as T`）是未經檢查的。唯一的例外是具有 [具體化類型參數](inline-functions.md#reified-type-parameters) 的內聯函數，它們的實際類型引數在每個呼叫點都被內聯。這使得類型參數的類型檢查和轉換成為可能。但是，上述限制仍然適用於在檢查或轉換中使用的泛型類型實例。例如，在類型檢查 `arg is T` 中，如果 `arg` 本身是泛型類型的實例，則其類型引數仍然被擦除。

```kotlin
//sampleStart
inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // 可編譯但破壞類型安全！
// 展開範例以獲取更多詳細資訊

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 這將拋出 ClassCastException，因為列表項目不是 String
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 未經檢查的轉換

向帶有具體類型引數的泛型類型進行類型轉換，例如 `foo as List<String>`，無法在執行時期檢查。這些未經檢查的轉換可以用於當高階程式邏輯暗示類型安全，但編譯器無法直接推斷時。請參閱下面的範例。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("讀取字串到任意元素的映射。")
}

// 我們將包含 Int 的映射儲存到此檔案中
val intsFile = File("ints.dictionary")

// 警告：未經檢查的轉換：`Map<String, *>` 到 `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```
在最後一行中，轉換會出現警告。編譯器無法在執行時期完全檢查它，並且不保證映射中的值是 `Int`。

為了避免未經檢查的轉換，你可以重新設計程式結構。在上面的範例中，你可以使用 `DictionaryReader<T>` 和 `DictionaryWriter<T>` 介面，它們具有針對不同類型的類型安全實作。你可以引入合理的抽象，將未經檢查的轉換從呼叫點轉移到實作細節。適當使用 [泛型變異](#variance) 也有幫助。

對於泛型函數，使用 [具體化類型參數](inline-functions.md#reified-type-parameters) 會使像 `arg as T` 這樣的轉換被檢查，除非 `arg` 的類型具有 *它自己* 被擦除的類型引數。

未經檢查的轉換警告可以透過使用 `@Suppress("UNCHECKED_CAST")` 註解發生該情況的語句或宣告來抑制：

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

>**在 JVM 上**：[陣列類型](arrays.md) (`Array<Foo>`) 保留有關其元素擦除類型的信息，並且向陣列類型的類型轉換會被部分檢查：元素類型的可為空性和實際類型引數仍然被擦除。例如，如果 `foo` 是包含任何 `List<*>` 的陣列（無論是否可為空），則轉換 `foo as Array<List<String>?>` 將成功。
>
{style="note"}

## 類型引數的底線運算符

底線運算符 `_` 可用於類型引數。當其他類型被明確指定時，使用它來自動推斷引數的類型：

```kotlin
abstract class SomeClass<T> {
    abstract fun execute() : T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run() : T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // T 被推斷為 String，因為 SomeImplementation 繼承自 SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T 被推斷為 Int，因為 OtherImplementation 繼承自 SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```