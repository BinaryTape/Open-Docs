---
title: 泛型：in、out、where
---
Kotlin 中的類別可以像 Java 一樣擁有類型參數 (type parameters)：

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

要建立此類別的實例，只需提供類型引數：

```kotlin
val box: Box<Int> = Box<Int>(1)
```

但是，如果可以推斷參數，例如從建構函式引數中推斷，則可以省略類型引數：

```kotlin
val box = Box(1) // 1 的類型為 Int，所以編譯器會判斷它是 Box<Int>
```

## 變異數 (Variance)

Java 類型系統中最棘手的方面之一是萬用字元類型 (wildcard types)（請參閱 [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)）。
Kotlin 沒有這些。取而代之的是，Kotlin 具有宣告點變異數 (declaration-site variance) 和類型投影 (type projections)。

### Java 中的變異數和萬用字元

讓我們想想為什麼 Java 需要這些神秘的萬用字元。首先，Java 中的泛型類型是 _不變的 (invariant)_，
這表示 `List<String>` _不是_ `List<Object>` 的子類型。如果 `List` 不是 _不變的_，那麼它
不會比 Java 的陣列好多少，因為以下程式碼可以編譯，但在執行時會導致例外：

```java
// Java
List<String> strs = new ArrayList<String>();

// Java 在編譯時在此處報告類型不符。
List<Object> objs = strs;

// 如果沒有會怎樣？
// 我們就可以將 Integer 放入 String 的列表中。
objs.add(1);

// 然後在執行時，Java 會拋出
// ClassCastException：Integer 無法轉換為 String
String s = strs.get(0); 
```

Java 禁止這種情況以保證執行時安全性。但這會產生影響。例如，
考慮 `Collection` 介面中的 `addAll()` 方法。這個方法的簽名是什麼？直觀地說，
你會這樣寫：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

但是這樣，你將無法執行以下操作（這是完全安全的）：

```java
// Java

// 使用 addAll 的簡單宣告無法編譯以下內容：
// Collection<String> 不是 Collection<Object> 的子類型
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

這就是為什麼 `addAll()` 的實際簽名如下：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

_萬用字元類型引數 (wildcard type argument)_ `? extends E` 表示此方法接受 `E` 的物件集合
_或是 `E` 的子類型_，而不僅僅是 `E` 本身。這表示你可以安全地從 items 中 _讀取_ `E`
（此集合的元素是 E 的子類別的實例），但 _無法寫入_ 到
它，因為你不知道哪些物件符合 `E` 的未知子類型。
作為此限制的回報，你將獲得所需的行為：`Collection<String>` _是_ `Collection<? extends Object>` 的子類型。
換句話說，具有 _extends_-bound（_上限 (upper)_ bound）的萬用字元使類型 _協變 (covariant)_。

理解為什麼這有效的原因很簡單：如果你只能從集合中 _取得_ 項目，
那麼使用 `String` 的集合並從中讀取 `Object` 是可以的。相反，如果你只能將項目 _放入_ 集合中，
那麼取得 `Object` 的集合並將 `String` 放入其中是可以的：在 Java 中有
`List<? super String>`，它接受 `String` 或其任何父類型 (supertypes)。

後者稱為 _逆變 (contravariance)_，並且你只能在 `List<? super String>` 上呼叫將 `String` 作為引數的方法
（例如，你可以呼叫 `add(String)` 或 `set(int, String)`）。如果你在 `List<T>` 中呼叫返回 `T` 的內容，
你不會得到 `String`，而是得到 `Object`。

Joshua Bloch 在他的著作 [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html) 中，很好地解釋了這個問題
（項目 31："使用有界萬用字元來增加 API 的靈活性"）。他將僅 _從中讀取_ 的物件命名為 _Producer (生產者)_，將僅 _寫入_ 的物件命名為 _Consumer (消費者)_。他建議：

:::note
"為了獲得最大的靈活性，請在表示生產者或消費者的輸入參數上使用萬用字元類型。"

然後他提出了以下助記符：_PECS_ 代表 _Producer-Extends, Consumer-Super_。

如果你使用生產者物件，例如 `List<? extends Foo>`，則不允許在此物件上呼叫 `add()` 或 `set()`，
但這並不表示它是 _不可變的 (immutable)_：例如，沒有什麼可以阻止你呼叫 `clear()`
以從列表中移除所有項目，因為 `clear()` 根本不接受任何參數。

萬用字元（或其他變異數類型）保證的唯一一件事是 _類型安全 (type safety)_。不可變性是一個完全不同的故事。

:::

### 宣告點變異數

假設有一個泛型介面 `Source<T>`，它沒有任何將 `T` 作為參數的方法，只有返回 `T` 的方法：

```java
// Java
interface Source<T> {
    T nextT();
}
```

然後，將 `Source<String>` 實例的參考儲存在 `Source<Object>` 類型的變數中是完全安全的，
因為沒有可呼叫的消費者方法。但是 Java 不知道這一點，仍然禁止它：

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! 在 Java 中不允許
    // ...
}
```

為了修復這個問題，你應該宣告 `Source<? extends Object>` 類型的物件。這樣做沒有意義，
因為你可以在這樣的變數上呼叫與以前相同的所有方法，因此更複雜的類型沒有增加任何價值。
但是編譯器不知道。

在 Kotlin 中，有一種方法可以向編譯器解釋這類事情。這稱為 _宣告點變異數 (declaration-site variance)_：
你可以註解 `Source` 的 _類型參數 (type parameter)_ `T`，以確保它僅從 `Source<T>` 的成員中 _返回_（產生），
而從不被使用 (consumed)。
為此，請使用 `out` 修飾符：

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // 這是 OK 的，因為 T 是一個 out-parameter
    // ...
}
```

一般規則是：當類別 `C` 的類型參數 `T` 宣告為 `out` 時，它可能只會出現在 `C` 的成員中的 _out_-position 中，
但作為回報，`C<Base>` 可以安全地成為 `C<Derived>` 的父類型。

換句話說，你可以說類別 `C` 在參數 `T` 中是 _協變的 (covariant)_，或者說 `T` 是一個 _協變類型參數 (covariant type parameter)_。
你可以將 `C` 視為 `T` 的 _生產者_，而不是 `T` 的 _消費者_。

`out` 修飾符稱為 _變異數註解 (variance annotation)_，並且由於它是在類型參數宣告位置提供的，
因此它提供了 _宣告點變異數_。
這與 Java 的 _使用點變異數 (use-site variance)_ 形成對比，在 Java 中，類型用法中的萬用字元使類型協變。

除了 `out` 之外，Kotlin 還提供了一個互補的變異數註解：`in`。它使類型參數 _逆變的 (contravariant)_，這表示
它只能被使用，而永遠不會被產生。逆變類型的一個很好的例子是 `Comparable`：

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 的類型為 Double，它是 Number 的子類型
    // 因此，你可以將 x 指派給 Comparable<Double> 類型的變數
    val y: Comparable<Double> = x // OK!
}
```

`in` 和 `out` 這兩個詞似乎是不言自明的（因為它們已經在 C# 中成功使用了很長時間），
因此實際上不需要上面提到的助記符。事實上，可以在更高的抽象層級重新表述：

**[存在主義](https://en.wikipedia.org/wiki/Existentialism) 轉換：消費者 in，生產者 out！** :-)

## 類型投影

### 使用點變異數：類型投影

將類型參數 `T` 宣告為 `out` 並避免在使用位置出現子類型問題非常容易，
但某些類別實際上 _無法_ 限制為僅返回 `T`！
一個很好的例子是 `Array`：

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

這個類別在 `T` 中既不能是協變的也不能是逆變的。這會帶來一定程度的不靈活性。考慮以下函式：

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

此函式應該將項目從一個陣列複製到另一個陣列。讓我們嘗試在實務中應用它：

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ 類型為 Array<Int>，但預期為 Array<Any>
```

在這裡，你遇到了同樣熟悉的難題：`Array<T>` 在 `T` 中是 _不變的_，因此 `Array<Int>` 和 `Array<Any>`
都不是對方的子類型。為什麼不呢？同樣，這是因為 `copy` 可能會有意想不到的行為，例如，它可能會嘗試將
`String` 寫入 `from`，如果你實際上傳遞了一個 `Int` 陣列，稍後將會拋出 `ClassCastException`。

為了禁止 `copy` 函式 _寫入_ 到 `from`，你可以執行以下操作：

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

這就是 _類型投影 (type projection)_，這表示 `from` 不是一個簡單的陣列，而是一個受限制的（_投影的_）陣列。
你只能呼叫返回類型參數 `T` 的方法，在這種情況下，這表示你只能呼叫 `get()`。
這是我們處理 _使用點變異數_ 的方法，它對應於 Java 的 `Array<? extends Object>`，但稍微簡單一些。

你也可以使用 `in` 投影類型：

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>` 對應於 Java 的 `Array<? super String>`。這表示你可以將 `String`、`CharSequence` 或
`Object` 的陣列傳遞給 `fill()` 函式。

### Star-projections (星號投影)

有時你想說你對類型引數一無所知，但你仍然想以安全的方式使用它。
這裡安全的方式是定義泛型類型的這種投影，該泛型類型的每個具體實例都將是該投影的子類型。

Kotlin 為此提供了所謂的 _星號投影 (star-projection)_ 語法：

- 對於 `Foo<out T : TUpper>`，其中 `T` 是一個具有上限 `TUpper` 的協變類型參數，`Foo<*>` 等同於 `Foo<out TUpper>`。
  這表示當 `T` 未知時，你可以安全地從 `Foo<*>` _讀取_ `TUpper` 的值。
- 對於 `Foo<in T>`，其中 `T` 是一個逆變類型參數，`Foo<*>` 等同於 `Foo<in Nothing>`。這表示
  當 `T` 未知時，沒有什麼可以安全地 _寫入_ 到 `Foo<*>`。
- 對於 `Foo<T : TUpper>`，其中 `T` 是一個具有上限 `TUpper` 的不變類型參數，`Foo<*>` 等同於
  讀取值的 `Foo<out TUpper>` 和寫入值的 `Foo<in Nothing>`。

如果泛型類型具有多個類型參數，則可以獨立地投影每個類型參數。
例如，如果類型宣告為 `interface Function<in T, out U>`，則可以使用以下星號投影：

* `Function<*, String>` 表示 `Function<in Nothing, String>`。
* `Function<Int, *>` 表示 `Function<Int, out Any?>`。
* `Function<*, *>` 表示 `Function<in Nothing, out Any?>`。

:::note
星號投影非常像 Java 的原始類型 (raw types)，但更安全。

:::

## 泛型函式 (Generic functions)

並非只有類別可以具有類型參數。函式也可以。類型參數位於函式名稱 _之前_：

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // 擴充函式 (extension function)
    // ...
}
```

要呼叫泛型函式，請在呼叫位置 _在_ 函式名稱 _之後_ 指定類型引數：

```kotlin
val l = singletonList<Int>(1)
```

如果可以從上下文中推斷出類型引數，則可以省略它們，因此以下範例也有效：

```kotlin
val l = singletonList(1)
```

## 泛型約束 (Generic constraints)

可以替換給定類型參數的所有可能類型的集合可能會受到 _泛型約束 (generic constraints)_ 的限制。

### 上限

最常見的約束類型是 _上限 (upper bound)_，它對應於 Java 的 `extends` 關鍵字：

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

冒號後指定的類型是 _上限_，表示只有 `Comparable<T>` 的子類型才能替換 `T`。例如：

```kotlin
sort(listOf(1, 2, 3)) // OK。Int 是 Comparable<Int> 的子類型
sort(listOf(HashMap<Int, String>())) // 錯誤：HashMap<Int, String> 不是 Comparable<HashMap<Int, String>> 的子類型
```

預設上限（如果未指定）是 `Any?`。只能在角括號內指定一個上限。
如果同一個類型參數需要多個上限，則需要一個單獨的 _where_-clause：

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

傳遞的類型必須同時滿足 `where` 子句的所有條件。在上面的範例中，`T` 類型
必須 _同時_ 實作 `CharSequence` 和 `Comparable`。

## 絕對不可為 null 的類型 (Definitely non-nullable types)

為了更容易與泛型 Java 類別和介面進行互通，Kotlin 支援將泛型類型參數宣告為
**絕對不可為 null 的 (definitely non-nullable)**。

要將泛型類型 `T` 宣告為絕對不可為 null 的，請使用 `& Any` 宣告類型。例如：`T & Any`。

絕對不可為 null 的類型必須具有可為 null 的 [上限](#upper-bounds)。

宣告絕對不可為 null 的類型最常見的用例是當你想要覆寫 (override) 包含 `@NotNull` 作為引數的 Java 方法時。例如，考慮 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

為了在 Kotlin 中成功覆寫 `load()` 方法，你需要將 `T1` 宣告為絕對不可為 null 的：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 絕對不可為 null
    override fun load(x: T1 & Any): T1 & Any
}
```

當僅使用 Kotlin 時，你不太可能需要明確宣告絕對不可為 null 的類型，因為
Kotlin 的類型推斷 (type inference) 會為你處理這個問題。

## Type erasure (類型擦除)

Kotlin 對泛型宣告用法執行的類型安全檢查是在編譯時完成的。
在執行時，泛型類型的實例不保存有關其實際類型引數的任何資訊。
類型資訊被稱為 _被擦除 (erased)_。例如，`Foo<Bar>` 和 `Foo<Baz?>` 的實例被擦除為
僅僅是 `Foo<*>`。

### Generics type checks and casts (泛型類型檢查和轉換)

由於類型擦除，沒有通用的方法來檢查泛型類型的實例是否在執行時使用某些類型
引數建立，並且編譯器禁止諸如 `ints is List<Int>` 或 `list is T`（類型參數）之類的 `is`-checks。但是，你可以根據星號投影類型檢查實例：

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // 項目類型為 `Any?`
}
```

同樣，當你已經靜態地（在編譯時）檢查了實例的類型引數時，
你可以進行 `is`-check 或轉換，其中涉及該類型的非泛型部分。請注意，
在這種情況下，會省略角括號：

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` 智慧轉換為 `ArrayList<String>`
    }
}
```

相同的語法，但省略了類型引數，可用於不考慮類型引數的轉換：`list as ArrayList`。

泛型函式呼叫的類型引數也僅在編譯時檢查。在函式本體中，
類型參數不能用於類型檢查，並且對類型參數的類型轉換（`foo as T`）未經檢查。
唯一的例外是具有 [具體化類型參數](inline-functions#reified-type-parameters) 的內聯函式，
它們在每個呼叫位置都內聯了其實際類型引數。這使得可以對類型參數進行類型檢查和轉換。
但是，上述限制仍然適用於檢查或轉換中使用的泛型類型的實例。
例如，在類型檢查 `arg is T` 中，如果 `arg` 本身是泛型類型的實例，則其類型引數仍會被擦除。

```kotlin

inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // 編譯但會破壞類型安全！
// 展開範例以取得更多詳細資訊

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 這將拋出 ClassCastException，因為列表項目不是 String
}
```

### Unchecked casts (未經檢查的轉換)

無法在執行時檢查對具有具體類型引數的泛型類型（例如 `foo as List<String>`）的類型轉換。
當高階程式邏輯暗示類型安全，但編譯器無法直接推斷時，可以使用這些未經檢查的轉換。請參閱下面的範例。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("Read a mapping of strings to arbitrary elements.")
}

// 我們將帶有 `Int` 的對應儲存到此檔案中
val intsFile = File("ints.dictionary")

// 警告：未經檢查的轉換：`Map<String, *>` 到 `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```

最後一行的轉換會顯示警告。編譯器無法在執行時完全檢查它，並且不保證對應中的值是 `Int`。

為了避免未經檢查的轉換，你可以重新設計程式結構。在上面的範例中，你可以使用
具有不同類型安全實作的 `DictionaryReader<T>` 和 `DictionaryWriter<T>` 介面。
你可以引入合理的抽象概念，以將未經檢查的轉換從呼叫位置移動到實作細節。
正確使用 [泛型變異數](#variance) 也有幫助。

對於泛型函式，使用 [具體化類型參數](inline-functions#reified-type-parameters) 使得諸如
`arg as T` 之類的轉換被檢查，除非 `arg` 的類型有 *自己的* 被擦除的類型引數。

可以使用 `@Suppress("UNCHECKED_CAST")` [註解](annotations) 發生語句或宣告來隱藏未經檢查的轉換警告：

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

:::note
**在 JVM 上**：[陣列類型](arrays) (`Array<Foo>`) 保留有關其元素擦除類型
的資訊，並且對陣列類型的類型轉換會進行部分檢查：
元素類型的可為 null 性和實際類型引數仍會被擦除。例如，
如果 `foo` 是一個包含任何 `List<*>` 的陣列，則轉換 `foo as Array<List<String>?>` 將成功，無論它是可為 null 的還是不可為 null 的。

:::

## Underscore operator for type arguments (用於類型引數的底線運算子)

底線運算子 `_` 可用於類型引數。當其他類型明確指定時，請使用它來自動推斷引數的類型：

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
    // T 推斷為 String，因為 SomeImplementation 繼承自 SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T 推斷為 Int，因為 OtherImplementation 繼承自 SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```