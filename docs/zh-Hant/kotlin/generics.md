[//]: # (title: 泛型：in、out、where)

Kotlin 中的類別可以擁有型別參數，就像 Java 一樣：

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

要建立這類類別的實例，只需提供型別引數即可：

```kotlin
val box: Box<Int> = Box<Int>(1)
```

但如果參數可以被推斷出來，例如從建構函式引數推斷，你可以省略型別引數：

```kotlin
val box = Box(1) // 1 的型別是 Int，所以編譯器會判斷它是 Box<Int>
```

## 變型 (Variance)

Java 型別系統中最棘手的面向之一是萬用字元型別 (wildcard types) (參閱 [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html))。
Kotlin 沒有這些。相反地，Kotlin 擁有宣告處變型 (declaration-site variance) 和型別投影 (type projections)。

### Java 中的變型與萬用字元

讓我們思考 Java 為何需要這些神秘的萬用字元。首先，Java 中的泛型型別是_不變型 (invariant)_ 的，
這意味著 `List<String>` _不是_ `List<Object>` 的子型別。如果 `List` 不是_不變型_，它就不會比 Java 的陣列好到哪裡去，因為以下程式碼雖然能編譯但會在執行時導致異常：

```java
// Java
List<String> strs = new ArrayList<String>();

// Java 會在這裡的編譯時報告型別不符。
List<Object> objs = strs;

// 如果它沒有呢？
// 我們就能夠將一個 Integer 放入一個字串列表。
objs.add(1);

// 然後在執行時，Java 會拋出
// ClassCastException: Integer cannot be cast to String
String s = strs.get(0); 
```

Java 禁止此類行為以確保執行時安全。但這會產生影響。例如，
考慮 `Collection` 介面中的 `addAll()` 方法。此方法的簽名是什麼？直覺上，
你會這樣寫：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

但這樣一來，你就無法執行以下操作（這絕對是安全的）：

```java
// Java

// 若使用 addAll 的原始宣告，以下將無法編譯：
// Collection<String> 不是 Collection<Object> 的子型別
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

這就是 `addAll()` 的實際簽名如下的原因：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

_萬用字元型別引數_ `? extends E` 表示此方法接受 `E` 型別的物件集合，_或是 `E` 的子型別_，而不僅僅是 `E` 本身。
這表示你可以安全地從項目中 _讀取_ `E` (此集合的元素是 `E` 的子類別實例)，但_不能寫入_，因為你不知道哪些物件符合該未知的 `E` 子型別。
作為此限制的回報，你會得到所需的行為：`Collection<String>` _是_ `Collection<? extends Object>` 的子型別。
換句話說，帶有 _extends_ 邊界 (_上限_) 的萬用字元使型別成為 _共變型 (covariant)_。

理解其運作原理的關鍵相當簡單：如果你只能從集合中 _取出_ 項目，
那麼使用 `String` 集合並從中讀取 `Object` 是可以的。相反地，如果你只能將項目
_放入_ 集合，則接受 `Object` 集合並將 `String` 放入其中也是可以的：在 Java 中有
`List<? super String>`，它接受 `String` 或其任何超型別。

後者被稱為_逆變型 (contravariance)_，你只能在 `List<? super String>` 上呼叫接受 `String` 作為引數的方法
（例如，你可以呼叫 `add(String)` 或 `set(int, String)`）。如果你呼叫在 `List<T>` 中返回 `T` 的東西，
你得到的不是 `String`，而是 `Object`。

Joshua Bloch 在他的書 [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html) 中很好地解釋了這個問題
（第 31 項：「使用有界萬用字元來增加 API 彈性」）。他將你只_讀取_的物件命名為_生產者 (Producers)_，將你只_寫入_的物件命名為_消費者 (Consumers)_。他建議：

> 「為了獲得最大彈性，請在代表生產者或消費者的輸入參數上使用萬用字元型別。」

然後他提出以下助記詞：_PECS_ 代表 _生產者-延伸，消費者-超類別 (Producer-Extends, Consumer-Super)_。

> 如果你使用生產者物件，例如 `List<? extends Foo>`，則不允許在此物件上呼叫 `add()` 或 `set()`，
> 但這不代表它_不可變_：例如，沒有什麼能阻止你呼叫 `clear()`
> 來從列表中移除所有項目，因為 `clear()` 根本不接受任何參數。
>
> 萬用字元（或其他型別變型）唯一保證的是_型別安全_。不變性是完全不同的問題。
>
{style="note"}

### 宣告處變型 (Declaration-site variance)

假設有一個泛型介面 `Source<T>`，它沒有任何接受 `T` 作為參數的方法，只有返回 `T` 的方法：

```java
// Java
interface Source<T> {
    T nextT();
}
```

那麼，將 `Source<String>` 實例的參照儲存在 `Source<Object>` 型別的變數中將是完全安全的——沒有消費者方法可供呼叫。但 Java 並不知道這一點，仍然禁止它：

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! Java 不允許
    // ...
}
```

為了解決這個問題，你應該宣告 `Source<? extends Object>` 型別的物件。這樣做是沒有意義的，
因為你可以在這樣的變數上呼叫與之前相同的所有方法，所以更複雜的型別並沒有增加任何價值。
但編譯器並不知道這一點。

在 Kotlin 中，有一種方法可以向編譯器解釋這種情況。這被稱為_宣告處變型 (declaration-site variance)_：
你可以註解 `Source` 的_型別參數_ `T`，以確保它只從 `Source<T>` 的成員中_返回_（生產），且從不消費。
為此，請使用 `out` 修飾符：

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // 這沒問題，因為 T 是一個 out-參數
    // ...
}
```

一般規則是：當類別 `C` 的型別參數 `T` 被宣告為 `out` 時，它只能出現在 `C` 成員的 _out_ 位置，
但作為回報，`C<Base>` 可以安全地成為 `C<Derived>` 的超型別。

換句話說，你可以說類別 `C` 在參數 `T` 上是_共變型 (covariant)_ 的，或者說 `T` 是一個_共變型_型別參數。
你可以將 `C` 視為 `T` 的_生產者_，而不是 `T` 的_消費者_。

`out` 修飾符被稱為_變型註解 (variance annotation)_，由於它在型別參數宣告處提供，
因此它提供了_宣告處變型_。
這與 Java 的_使用處變型 (use-site variance)_ 形成對比，後者透過型別用法中的萬用字元使型別具有共變性。

除了 `out`，Kotlin 還提供了一個互補的變型註解：`in`。它使型別參數_逆變型 (contravariant)_，這意味著
它只能被消費而從不生產。逆變型型別的一個好例子是 `Comparable`：

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 的型別是 Double，它是 Number 的子型別
    // 因此，你可以將 x 賦值給 Comparable<Double> 型別的變數
    val y: Comparable<Double> = x // OK!
}
```

_in_ 和 _out_ 這些詞似乎不言自明（因為它們在 C# 中已經成功使用了很長時間），
因此上面提到的助記詞並非真正需要。它實際上可以在更抽象的層次上重新表述：

**[存在主義式](https://zh.wikipedia.org/wiki/%E5%AD%98%E5%9C%A8%E4%B8%BB%E4%B9%89)轉換：消費者 `in`，生產者 `out`！** :-)

## 型別投影 (Type projections)

### 使用處變型 (Use-site variance)：型別投影

將型別參數 `T` 宣告為 `out` 並避免在使用處出現子型別問題是非常容易的，
但有些類別實際上_不能_只限制為返回 `T`！
`Array` 就是一個很好的例子：

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

這個類別在 `T` 上既不能是共變型也不能是逆變型。這會帶來某些不靈活性。考慮以下函式：

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

這個函式旨在將項目從一個陣列複製到另一個陣列。讓我們嘗試在實際中應用它：

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ 型別是 Array<Int> 但預期是 Array<Any>
```

在這裡你遇到了同樣熟悉的問題：`Array<T>` 在 `T` 上是_不變型_的，因此 `Array<Int>` 和 `Array<Any>` 都不是對方的子型別。為什麼不呢？同樣，這是因為 `copy` 可能會產生意外行為，例如，它可能會嘗試向 `from` 寫入 `String`，如果你實際傳入一個 `Int` 陣列，稍後就會拋出 `ClassCastException`。

為了禁止 `copy` 函式向 `from` _寫入_，你可以執行以下操作：

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

這就是_型別投影 (type projection)_，這意味著 `from` 不是一個簡單的陣列，而是一個受限的 (_投影的_) 陣列。
你只能呼叫返回型別參數 `T` 的方法，這在這種情況下意味著你只能呼叫 `get()`。
這是我們處理_使用處變型_的方法，它對應於 Java 的 `Array<? extends Object>`，同時稍微更簡單。

你也可以使用 `in` 投影型別：

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>` 對應於 Java 的 `Array<? super String>`。這意味著你可以將 `String`、`CharSequence` 或 `Object` 的陣列傳遞給 `fill()` 函式。

### 星號投影 (Star-projections)

有時你希望表示你對型別引數一無所知，但你仍然希望以安全的方式使用它。
這裡的安全方式是定義泛型型別的這樣一個投影，即該泛型型別的每個具體實例都將是該投影的子型別。

Kotlin 為此提供了所謂的_星號投影 (star-projection)_ 語法：

- 對於 `Foo<out T : TUpper>`，其中 `T` 是具有上限 `TUpper` 的共變型型別參數，`Foo<*>`
  等同於 `Foo<out TUpper>`。這意味著當 `T` 未知時，你可以安全地從 `Foo<*>` 中_讀取_ `TUpper` 的值。
- 對於 `Foo<in T>`，其中 `T` 是逆變型型別參數，`Foo<*>` 等同於 `Foo<in Nothing>`。這意味著
  當 `T` 未知時，你無法以安全的方式向 `Foo<*>` _寫入_ 任何內容。
- 對於 `Foo<T : TUpper>`，其中 `T` 是具有上限 `TUpper` 的不變型型別參數，`Foo<*>`
  對於讀取值等同於 `Foo<out TUpper>`，對於寫入值等同於 `Foo<in Nothing>`。

如果一個泛型型別有多個型別參數，每個參數都可以獨立投影。
例如，如果型別被宣告為 `interface Function<in T, out U>`，你可以使用以下星號投影：

* `Function<*, String>` 表示 `Function<in Nothing, String>`。
* `Function<Int, *>` 表示 `Function<Int, out Any?>`。
* `Function<*, *>` 表示 `Function<in Nothing, out Any?>`。

> 星號投影非常類似於 Java 的原始型別 (raw types)，但更安全。
>
{style="note"}

## 泛型函式 (Generic functions)

類別並不是唯一可以擁有型別參數的宣告。函式也可以。型別參數位於函式名稱_之前_：

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // 擴充函式
    // ...
}
```

要呼叫泛型函式，請在呼叫處的函式名稱_之後_指定型別引數：

```kotlin
val l = singletonList<Int>(1)
```

如果型別引數可以從上下文推斷出來，則可以省略它們，因此以下範例也有效：

```kotlin
val l = singletonList(1)
```

## 泛型約束 (Generic constraints)

可以替換給定型別參數的所有可能型別的集合可能會受到_泛型約束 (generic constraints)_ 的限制。

### 上限 (Upper bounds)

最常見的約束型別是_上限 (upper bound)_，它對應於 Java 的 `extends` 關鍵字：

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

冒號後指定的型別是_上限_，表示只有 `Comparable<T>` 的子型別才能替換 `T`。例如：

```kotlin
sort(listOf(1, 2, 3)) // OK。Int 是 Comparable<Int> 的子型別
sort(listOf(HashMap<Int, String>())) // 錯誤：HashMap<Int, String> 不是 Comparable<HashMap<Int, String>> 的子型別
```

預設上限（如果沒有指定）是 `Any?`。只能在角括號內指定一個上限。
如果同一個型別參數需要多個上限，你需要一個單獨的 _where_ 子句：

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

傳入的型別必須同時滿足 `where` 子句的所有條件。在上述範例中，`T` 型別
必須同時實作 `CharSequence` 和 `Comparable`。

## 明確非空型別 (Definitely non-nullable types)

為了讓與泛型 Java 類別和介面的互通性更容易，Kotlin 支援將泛型型別參數宣告為**明確非空 (definitely non-nullable)**。

要將泛型型別 `T` 宣告為明確非空，請使用 `& Any` 宣告型別。例如：`T & Any`。

明確非空型別必須具有可空 (nullable) [上限](#upper-bounds)。

宣告明確非空型別最常見的用例是當你想要覆寫包含 `@NotNull` 作為引數的 Java 方法時。例如，考慮 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

為了成功地在 Kotlin 中覆寫 `load()` 方法，你需要將 `T1` 宣告為明確非空：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 是明確非空
    override fun load(x: T1 & Any): T1 & Any
}
```

當只使用 Kotlin 時，你不太可能需要明確宣告明確非空型別，因為
Kotlin 的型別推斷會為你處理這一切。

## 型別擦除 (Type erasure)

Kotlin 對泛型宣告使用執行型別安全檢查是在編譯時完成的。
在執行時，泛型型別的實例不包含有關其實際型別引數的任何資訊。
型別資訊據稱被_擦除 (erased)_。例如，`Foo<Bar>` 和 `Foo<Baz?>` 的實例被擦除為
僅僅是 `Foo<*>`。

### 泛型型別檢查和轉換

由於型別擦除，沒有一般的方法可以檢查泛型型別的實例是否在執行時以某些型別引數建立，
並且編譯器禁止諸如 `ints is List<Int>` 或 `list is T`（型別參數）這樣的 `is`-檢查。
但是，你可以根據星號投影型別 (star-projected type) 檢查實例：

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // 項目被型別化為 `Any?`
}
```

同樣地，當你已經靜態（在編譯時）檢查了實例的型別引數時，
你可以進行涉及型別非泛型部分的 `is`-檢查或轉換。請注意，
在這種情況下會省略角括號：

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` 被智慧轉換為 `ArrayList<String>`
    }
}
```

可以使用相同的語法，但省略型別引數，用於不考慮型別引數的轉換：`list as ArrayList`。

泛型函式呼叫的型別引數也只在編譯時檢查。在函式體內，
型別參數不能用於型別檢查，並且對型別參數的型別轉換（`foo as T`）是未檢查的。
唯一的例外是具有[具體化型別參數](inline-functions.md#reified-type-parameters)的內聯函式，
它們的實際型別引數在每個呼叫處內聯。這使得型別參數的型別檢查和轉換成為可能。
但是，上述限制仍然適用於在檢查或轉換中使用的泛型型別實例。
例如，在型別檢查 `arg is T` 中，如果 `arg` 本身是泛型型別的實例，其型別引數仍會被擦除。

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
val stringToStringList = somePair.asPairOf<String, List<String>>() // 編譯但破壞型別安全！
// 展開範例以了解更多詳情

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 這會拋出 ClassCastException，因為列表項目不是 String
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 未檢查的轉換 (Unchecked casts)

對具有具體型別引數的泛型型別進行型別轉換，例如 `foo as List<String>`，在執行時無法檢查。
當高階程式邏輯暗示型別安全但編譯器無法直接推斷時，可以使用這些未檢查的轉換。
請參閱以下範例。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("Read a mapping of strings to arbitrary elements.")
}

// 我們將一個帶有 Int 的映射保存到此檔案中
val intsFile = File("ints.dictionary")

// 警告：未檢查的轉換：`Map<String, *>` 到 `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```
最後一行的轉換會出現警告。編譯器無法在執行時完全檢查它，並且不保證映射中的值是 `Int`。

為了避免未檢查的轉換，你可以重新設計程式結構。在上面的範例中，你可以使用
`DictionaryReader<T>` 和 `DictionaryWriter<T>` 介面，為不同的型別提供型別安全的實作。
你可以引入合理的抽象來將未檢查的轉換從呼叫處移到實作細節中。
正確使用[泛型變型](#variance)也有幫助。

對於泛型函式，使用[具體化型別參數](inline-functions.md#reified-type-parameters)會使 `arg as T` 這樣的轉換被檢查，
除非 `arg` 的型別有_它自己的_型別引數被擦除。

可以透過使用 `@Suppress("UNCHECKED_CAST")` [註解](annotations.md)出現警告的語句或宣告來抑制未檢查的轉換警告：

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

>**在 JVM 上**：[陣列型別](arrays.md)（`Array<Foo>`）保留有關其元素被擦除型別的資訊，
>並且對陣列型別的型別轉換會部分檢查：元素的型別的可空性 (nullability) 和實際型別引數仍會被擦除。例如，
>如果 `foo` 是一個持有任何 `List<*>` 的陣列，無論它是否可空，轉換 `foo as Array<List<String>?>` 都會成功。
>
{style="note"}

## 型別引數的底線運算子 (Underscore operator for type arguments)

底線運算子 `_` 可以用於型別引數。在明確指定其他型別時，使用它來自動推斷引數的型別：

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
    // T 被推斷為 String，因為 SomeImplementation 派生自 SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T 被推斷為 Int，因為 OtherImplementation 派生自 SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```