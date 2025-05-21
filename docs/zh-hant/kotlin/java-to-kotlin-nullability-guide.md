---
title: "Java 和 Kotlin 中的可空性 (Nullability)"
description: "了解如何將可空結構 (nullable constructions) 從 Java 遷移到 Kotlin。本指南涵蓋 Kotlin 中對可空類型 (nullable types) 的支援、Kotlin 如何處理來自 Java 的可空註解 (nullable annotations) 等。"
---
_可空性 (Nullability)_ 是一種變數可以持有 `null` 值的特性。
當一個變數包含 `null` 時，嘗試對該變數進行解引用 (dereference) 會導致 `NullPointerException`。
有很多編寫程式碼的方式可以最大限度地減少收到空指針異常 (null pointer exceptions) 的機率。

本指南涵蓋 Java 和 Kotlin 在處理可能為可空變數 (nullable variables) 的方法之間的差異。
它將幫助你從 Java 遷移到 Kotlin，並以道地的 Kotlin 風格編寫程式碼。

本指南的第一部分涵蓋了最重要的差異 - Kotlin 中對可空型別 (nullable types) 的支援，以及 Kotlin 如何處理來自 [Java 程式碼的型別](#platform-types)。
第二部分，從[檢查函數呼叫的結果](#checking-the-result-of-a-function-call) 開始，檢視幾個特定案例以解釋某些差異。

[了解更多關於 Kotlin 中的 Null 安全性](null-safety)。

## 對可空型別的支援

Kotlin 和 Java 型別系統之間最重要的區別是 Kotlin 對[可空型別](null-safety)的顯式支援。
它是一種指示哪些變數可能持有 `null` 值的方法。
如果一個變數可以是 `null`，那麼對該變數呼叫方法是不安全的，因為這可能會導致 `NullPointerException`。
Kotlin 在編譯時禁止這種呼叫，從而避免了許多可能的異常。
在執行時，可空型別的物件和不可空型別的物件被同等對待：
可空型別不是不可空型別的包裝器 (wrapper)。所有檢查都在編譯時執行。
這意味著在 Kotlin 中使用可空型別幾乎沒有執行時的開銷。

:::note
我們說「幾乎」，因為即使生成了[內在 (intrinsic)](https://en.wikipedia.org/wiki/Intrinsic_function) 檢查，
它們的開銷也是最小的。

:::

在 Java 中，如果你不編寫 null 檢查，方法可能會拋出 `NullPointerException`：

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // Throws a `NullPointerException`
}
```

這個呼叫將有以下輸出：

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

在 Kotlin 中，所有常規型別預設都是不可空的，除非你明確地將它們標記為可空。
如果你不希望 `a` 為 `null`，請宣告 `stringLength()` 函數如下：

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```

參數 `a` 具有 `String` 型別，在 Kotlin 中，這意味著它必須始終包含一個 `String` 實例，並且不能包含 `null`。
Kotlin 中的可空型別用問號 `?` 標記，例如 `String?`。
如果 `a` 是 `String`，則在執行時出現 `NullPointerException` 的情況是不可能的，因為編譯器強制執行
`stringLength()` 的所有參數都不能為 `null` 的規則。

嘗試將 `null` 值傳遞給 `stringLength(a: String)` 函數將導致編譯時錯誤
"Null can not be a value of a non-null type String"（Null 不能是非空型別 String 的值）：

<img src="/img/passing-null-to-function.png" alt="Passing null to a non-nullable function error" width="700" style={{verticalAlign: 'middle'}}/>

如果你想將此函數與任何參數（包括 `null`）一起使用，請在參數型別 `String?` 後使用問號
並在函數體內檢查以確保參數的值不是 `null`：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```

在成功通過檢查後，編譯器會將變數視為非空型別 `String`，
在編譯器執行檢查的範圍內。

如果你不執行此檢查，程式碼將無法編譯，並顯示以下訊息：
"Only [safe (?.)](null-safety#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety#not-null-assertion-operator) are allowed
on a [nullable receiver](extensions#nullable-receiver) of type String?"（只允許在 String 型別的 [可空接收者](extensions#nullable-receiver) 上使用 [安全呼叫 (?.)](null-safety#safe-call-operator) 或 [非空斷言 (!!.) 呼叫](null-safety#not-null-assertion-operator)）。

你可以編寫相同的更短的程式碼 – 使用 [安全呼叫運算符 ?. (If-not-null shorthand)](idioms#if-not-null-shorthand)，
它允許你將 null 檢查和方法呼叫組合到一個操作中：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```

## 平台型別 (Platform types)

在 Java 中，你可以使用註解來表明變數是否可以為 `null`。
這種註解不是標準函式庫的一部分，但你可以單獨添加它們。
例如，你可以使用 JetBrains 註解 `@Nullable` 和 `@NotNull`（來自 `org.jetbrains.annotations` 套件）
或來自 Eclipse 的註解 (`org.eclipse.jdt.annotation`)。
當你[從 Kotlin 程式碼呼叫 Java 程式碼](java-interop#nullability-annotations)時，Kotlin 可以識別這些註解，
並將根據其註解處理型別。

如果你的 Java 程式碼沒有這些註解，那麼 Kotlin 會將 Java 型別視為 *平台型別*。
但由於 Kotlin 沒有此類型別的空性 (nullability) 資訊，因此其編譯器將允許對它們執行所有操作。
你需要決定是否執行 null 檢查，因為：

* 就像在 Java 中一樣，如果你嘗試對 `null` 執行操作，你將收到 `NullPointerException`。
* 編譯器不會突出顯示任何多餘的 null 檢查，通常在你對非空型別的值執行 null 安全操作時會這樣做。

了解更多關於[從 Kotlin 呼叫 Java 中關於 null 安全性和平台型別的資訊](java-interop#null-safety-and-platform-types)。

## 對絕對不可空型別的支援

在 Kotlin 中，如果你想覆寫 (override) 一個包含 `@NotNull` 作為參數的 Java 方法，你需要 Kotlin 的絕對
不可空型別。

例如，考慮 Java 中的這個 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

要成功地覆寫 Kotlin 中的 `load()` 方法，你需要將 `T1` 宣告為絕對
不可空 (`T1 & Any`)：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

了解更多關於[絕對不可空](generics#definitely-non-nullable-types)的泛型型別。

## 檢查函數呼叫的結果

你需要檢查 `null` 的最常見情況之一是當你從函數呼叫中獲得結果時。

在以下範例中，有兩個類別 `Order` 和 `Customer`。`Order` 有一個對 `Customer` 實例的引用。
如果 `findOrder()` 函數找不到訂單，則返回 `Order` 類別的實例，或 `null`。
目標是處理檢索到的訂單的客戶實例。

以下是 Java 中的類別：

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

在 Java 中，呼叫該函數並對結果執行 if-not-null 檢查，以繼續解引用所需的屬性：

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```

將上面的 Java 程式碼直接轉換為 Kotlin 程式碼會得到以下結果：

```kotlin
// Kotlin
data class Order(val customer: Customer)

data class Customer(val name: String)

val order = findOrder()

// Direct conversion
if (order != null){
    processCustomer(order.customer)
}
```

使用 [安全呼叫運算符 `?.` (If-not-null shorthand)](idioms#if-not-null-shorthand)
與標準函式庫中的任何 [作用域函數 (scope functions)](scope-functions) 結合使用。
`let` 函數通常用於此目的：

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```

這是相同程式碼的更短版本：

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```

## 預設值而不是 null

`null` 檢查通常與[設定預設值](functions#default-arguments)結合使用，
以防 null 檢查成功。

具有 null 檢查的 Java 程式碼：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```

要在 Kotlin 中表達相同的意思，請使用 [Elvis 運算符 (If-not-null-else shorthand)](null-safety#elvis-operator)：

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```

## 函數返回一個值或 null

在 Java 中，使用列表元素時需要小心。在嘗試使用元素之前，應始終檢查元素是否存在於
索引處：

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```

Kotlin 標準函式庫通常提供函數，其名稱指示它們是否可能返回 `null` 值。
這在集合 API 中尤其常見：

```kotlin
fun main() {

    // Kotlin
    // 與 Java 中相同的程式碼：
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // 如果集合為空，則可能拋出 IndexOutOfBoundsException
    //numbers.get(5)     // Exception!

    // 更多功能：
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null

}
```

## 聚合操作 (Aggregate operations)

當你需要獲取最大的元素，如果沒有元素則獲取 `null` 時，在 Java 中你會使用
[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)：

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```

在 Kotlin 中，使用[聚合操作](collection-aggregate)：

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```

了解更多關於 [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide)。

## 安全地轉換型別

當你需要安全地轉換型別時，在 Java 中你會使用 `instanceof` 運算符，然後檢查它的效果如何：

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // Prints `-1`
}
```

為了避免 Kotlin 中的異常，請使用[安全轉換運算符](typecasts#safe-nullable-cast-operator) `as?`，它在失敗時返回 `null`：

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // Prints `-1`
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // null
    return x?.length ?: -1 // Returns -1 because `x` is null
}
```

:::note
在上面的 Java 範例中，函數 `getStringLength()` 返回原始型別 `int` 的結果。
要使其返回 `null`，可以使用[_封箱 (boxed)_ 型別](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`。
但是，使此類函數返回負值然後檢查該值更具資源效率 –
你無論如何都會進行檢查，但這樣就不會執行額外的封箱。

:::

## 接下來是什麼？

* 瀏覽其他 [Kotlin 慣用寫法 (idioms)](idioms)。
* 學習如何使用 [Java-to-Kotlin (J2K) 轉換器](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k) 將現有的 Java 程式碼轉換為 Kotlin。
* 查看其他遷移指南：
  * [Java 和 Kotlin 中的字串](java-to-kotlin-idioms-strings)
  * [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide)

如果你有喜歡的慣用寫法，請隨時發送 pull request 與我們分享！