[//]: # (title: Java 和 Kotlin 中的可為空性)

<web-summary>了解如何將 Java 中可為空 (nullable) 的建構遷移到 Kotlin。本指南涵蓋了 Kotlin 對可為空型別的支援、Kotlin 如何處理來自 Java 的可為空註解等等。</web-summary>

_可為空性_ 是一個變數能夠持有 `null` 值的特性。
當變數包含 `null` 時，嘗試解除參照該變數會導致 `NullPointerException`。
有許多方法可以編寫程式碼，以最大程度地降低收到 null 指標例外 (null pointer exceptions) 的可能性。

本指南介紹了 Java 和 Kotlin 在處理可能為空 (possibly nullable) 變數方面的不同方法。
它將幫助您從 Java 遷移到 Kotlin，並以純正的 Kotlin 風格編寫您的程式碼。

本指南的第一部分涵蓋了最重要的區別——Kotlin 中對 [可為空型別](null-safety.md) 的支援，以及 Kotlin 如何處理 [來自 Java 程式碼的型別](#platform-types)。第二部分從
[檢查函式呼叫的結果](#checking-the-result-of-a-function-call) 開始，探討了幾個具體案例來解釋某些差異。

[深入了解 Kotlin 中的 null 安全](null-safety.md)。

## 對可為空型別的支援

Kotlin 和 Java 型別系統之間最重要的區別是 Kotlin 對 [可為空型別](null-safety.md) 的明確支援。
這是一種指示哪些變數可能持有 `null` 值的方法。
如果變數可以為 `null`，則不安全地在該變數上呼叫方法，因為這可能導致 `NullPointerException`。
Kotlin 在編譯時期禁止此類呼叫，從而防止了許多可能的例外。
在執行時期，可為空型別的物件和非空型別的物件處理方式相同：
可為空型別並非非空型別的包裝器。所有檢查均在編譯時期執行。
這意味著在 Kotlin 中使用可為空型別幾乎沒有執行時期開銷。

> 我們說「幾乎」，因為儘管 [內建](https://en.wikipedia.org/wiki/Intrinsic_function) 檢查_確實_會產生，
但它們的開銷極小。
>
{style="note"}

在 Java 中，如果您不編寫 null 檢查，方法可能會拋出 `NullPointerException`：

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // 拋出 `NullPointerException`
}
```
{id="get-length-of-null-java"}

此呼叫將產生以下輸出：

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

在 Kotlin 中，所有常規型別預設為非空，除非您明確將其標記為可為空。
如果您不期望 `a` 為 `null`，請如下宣告 `stringLength()` 函式：

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

參數 `a` 的型別是 `String`，這在 Kotlin 中表示它必須始終包含一個 `String` 實例，並且不能包含 `null`。
Kotlin 中的可為空型別以問號 `?` 標記，例如 `String?`。
如果 `a` 是 `String`，則在執行時期出現 `NullPointerException` 的情況是不可能的，因為編譯器強制執行 `stringLength()` 的所有參數不能為 `null` 的規則。

嘗試將 `null` 值傳遞給 `stringLength(a: String)` 函式將導致編譯時期錯誤，「Null 不能是 String 非空型別的值」：

![傳遞 null 值給非空函式的錯誤](passing-null-to-function.png){width=700}

如果您想將此函式與任何引數（包括 `null`）一起使用，請在引數型別 `String?` 後使用問號，並在函式主體內檢查以確保引數的值不為 `null`：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

檢查成功通過後，編譯器在執行檢查的範圍內將該變數視為非空型別 `String`。

如果您不執行此檢查，程式碼將無法編譯並顯示以下訊息：
「僅允許在 String 型別的 [可為空接收者](extensions.md#nullable-receiver) 上執行 [安全呼叫 (?. )](null-safety.md#safe-call-operator) 或 [非空斷言 (!!.) 呼叫](null-safety.md#not-null-assertion-operator)。」

您可以寫得更短——使用 [安全呼叫運算子 ?. (If-not-null 簡寫)](idioms.md#if-not-null-shorthand)，它允許您將 null 檢查和方法呼叫組合到一個操作中：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## 平台型別

在 Java 中，您可以使用註解來表示變數是否可以為 `null`。
此類註解不屬於標準函式庫，但您可以單獨添加它們。
例如，您可以使用 JetBrains 的 `@Nullable` 和 `@NotNull` 註解（來自 `org.jetbrains.annotations` 套件）
或來自 Eclipse 的註解（`org.eclipse.jdt.annotation`）。
當您 [從 Kotlin 程式碼呼叫 Java 程式碼](java-interop.md#nullability-annotations) 時，Kotlin 可以識別此類註解，並根據其註解處理型別。

如果您的 Java 程式碼沒有這些註解，則 Kotlin 會將 Java 型別視為 _平台型別_。
但由於 Kotlin 沒有此類型別的可為空性資訊，其編譯器將允許對它們執行所有操作。
您將需要決定是否執行 null 檢查，因為：

*   就像在 Java 中一樣，如果您嘗試對 `null` 執行操作，您將會收到 `NullPointerException`。
*   編譯器不會標示任何冗餘的 null 檢查，而當您對非空型別的值執行 null 安全操作時，它通常會這樣做。

深入了解 [從 Kotlin 呼叫 Java 有關 null 安全和平台型別的資訊](java-interop.md#null-safety-and-platform-types)。

## 對絕對非空型別的支援

在 Kotlin 中，如果您想覆寫一個包含 `@NotNull` 作為引數的 Java 方法，您需要 Kotlin 的絕對非空型別。

例如，考慮 Java 中的這個 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

為了成功地在 Kotlin 中覆寫 `load()` 方法，您需要將 `T1` 宣告為絕對非空 (`T1 & Any`)：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 是絕對非空
  override fun load(x: T1 & Any): T1 & Any
}
```

深入了解 [絕對非空](generics.md#definitely-non-nullable-types) 的泛型型別。

## 檢查函式呼叫的結果

您需要檢查 `null` 的最常見情況之一是從函式呼叫中取得結果時。

在以下範例中，有兩個類別：`Order` 和 `Customer`。`Order` 具有對 `Customer` 實例的參照。
`findOrder()` 函式傳回 `Order` 類別的實例，如果找不到訂單則傳回 `null`。
目標是處理檢索到的訂單中的客戶實例。

以下是 Java 中的類別：

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

在 Java 中，呼叫函式並對結果執行 if-not-null 檢查，以繼續解除參照所需屬性：

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

將上述 Java 程式碼直接轉換為 Kotlin 程式碼會得到以下結果：

```kotlin
// Kotlin
data class Order(val customer: Customer)

data class Customer(val name: String)

val order = findOrder()

// 直接轉換
if (order != null){
    processCustomer(order.customer)
}
```
{id="process-customer-if-not-null-kotlin"}

結合標準函式庫中的任何 [作用域函式](scope-functions.md) 使用 [安全呼叫運算子 `?.` (If-not-null 簡寫)](idioms.md#if-not-null-shorthand)。
通常為此使用 `let` 函式：

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

這是相同的較短版本：

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## 預設值而不是 null

檢查 `null` 通常與 [設定預設值](functions.md#parameters-with-default-values) 結合使用，以防 null 檢查成功。

帶有 null 檢查的 Java 程式碼：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

要在 Kotlin 中表達相同含義，請使用 [Elvis 運算子 (If-not-null-else 簡寫)](null-safety.md#elvis-operator)：

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 傳回值或 null 的函式

在 Java 中，處理列表元素時需要小心。在使用元素之前，您應該始終檢查索引處是否存在元素：

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // 例外！
```
{id="functions-returning-null-java"}

Kotlin 標準函式庫通常提供名稱指示是否可能傳回 `null` 值的函式。
這在集合 API 中尤其常見：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // 與 Java 中相同的程式碼：
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // 如果集合為空，可能會拋出 IndexOutOfBoundsException
    //numbers.get(5)     // 例外！

    // 更多功能：
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 聚合操作

當您需要取得最大元素或在沒有元素時取得 `null`，在 Java 中您會使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)：

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```
{id="aggregate-functions-java"}

在 Kotlin 中，使用 [聚合操作](collection-aggregate.md)：

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```
{id="aggregate-functions-kotlin"}

深入了解 [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide.md)。

## 安全地轉型

當您需要安全地轉型時，在 Java 中您會使用 `instanceof` 運算子，然後檢查其效果如何：

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // 輸出 `-1`
}
```
{id="casting-types-java"}

為了避免 Kotlin 中的例外，請使用 [安全轉型運算子](typecasts.md#safe-nullable-cast-operator) `as?`，它在失敗時傳回 `null`：

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // 輸出 `-1`
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // null
    return x?.length ?: -1 // 傳回 -1，因為 `x` 為 null
}
```
{kotlin-runnable="true" id="casting-types-kotlin"}

> 在上述 Java 範例中，函式 `getStringLength()` 傳回基本型別 `int` 的結果。
為了使其傳回 `null`，您可以使用 [_裝箱_ 型別](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`。
然而，讓此類函式傳回負值然後檢查該值會更有效率，因為無論如何您都會執行檢查，而且這種方式不會執行額外的裝箱。
>
{style="note"}

## 接下來？

*   瀏覽其他 [Kotlin 慣用語](idioms.md)。
*   了解如何使用 [Java-to-Kotlin (J2K) 轉換器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 將現有 Java 程式碼轉換為 Kotlin。
*   查看其他遷移指南：
    *   [Java 和 Kotlin 中的字串](java-to-kotlin-idioms-strings.md)
    *   [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide.md)

如果您有喜歡的慣用語，歡迎透過傳送拉取請求 (pull request) 與我們分享！