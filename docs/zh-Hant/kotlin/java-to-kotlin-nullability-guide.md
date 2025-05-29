[//]: # (title: Java 和 Kotlin 中的可空性)
[//]: # (description: 瞭解如何將 Java 中的可空結構遷移到 Kotlin。本指南涵蓋 Kotlin 對可空類型的支援、Kotlin 如何處理來自 Java 的可空註解，以及更多內容。)

_可空性 (Nullability)_ 是變數能否儲存 `null` 值的能力。
當變數包含 `null` 時，嘗試對該變數進行解參考會導致 `NullPointerException` (空指標例外)。
有許多方法可以編寫程式碼，以最大程度地降低收到空指標例外的機率。

本指南涵蓋 Java 和 Kotlin 處理可能可空的變數的方法差異。
它將幫助您從 Java 遷移到 Kotlin，並以道地的 Kotlin 風格編寫程式碼。

本指南的第一部分涵蓋最重要的差異——Kotlin 對 [可空類型](null-safety.md) 的明確支援，以及 Kotlin 如何處理 [來自 Java 程式碼的類型](#platform-types)。第二部分從 [檢查函式呼叫的結果](#checking-the-result-of-a-function-call) 開始，探討了幾個具體案例來解釋某些差異。

[深入瞭解 Kotlin 中的空安全](null-safety.md)。

## 可空類型的支援

Kotlin 和 Java 類型系統之間最重要的差異是 Kotlin 對 [可空類型](null-safety.md) 的明確支援。
這是一種指示哪些變數可能持有 `null` 值的方法。
如果變數可以為 `null`，則對該變數呼叫方法是不安全的，因為這可能導致 `NullPointerException`。
Kotlin 在編譯時期禁止此類呼叫，從而防止了許多可能的例外。
在執行時期，可空類型物件和非空類型物件的處理方式相同：
可空類型不是非空類型的包裝器。所有檢查都在編譯時期執行。
這意味著在 Kotlin 中使用可空類型幾乎沒有執行時期開銷。

> 我們說「幾乎」，是因為即使會生成 [內建 (intrinsic)](https://en.wikipedia.org/wiki/Intrinsic_function) 檢查，
它們的開銷也是微乎其微的。
>
{style="note"}

在 Java 中，如果您不編寫 null 檢查，方法可能會拋出 `NullPointerException`：

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // Throws a `NullPointerException`
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

在 Kotlin 中，所有常規類型預設都是非空的，除非您明確將其標記為可空。
如果您不期望 `a` 為 `null`，請如下宣告 `stringLength()` 函式：

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

參數 `a` 的類型為 `String`，這在 Kotlin 中意味著它必須始終包含 `String` 實例，並且不能包含 `null`。
Kotlin 中的可空類型用問號 `?` 標記，例如 `String?`。
如果 `a` 是 `String`，則在執行時期發生 `NullPointerException` 的情況是不可能發生的，因為編譯器強制執行 `stringLength()` 的所有引數都不能為 `null` 的規則。

嘗試將 `null` 值傳遞給 `stringLength(a: String)` 函式將導致編譯時期錯誤：
「Null can not be a value of a non-null type String (null 不能是非 null 類型 String 的值)」。

![Passing null to a non-nullable function error](passing-null-to-function.png){width=700}

如果您想將此函式與任何引數（包括 `null`）一起使用，請在引數類型 `String?` 後使用問號，並在函式主體內檢查以確保引數的值不是 `null`：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

檢查成功通過後，編譯器會在執行檢查的作用域內將該變數視為非空類型 `String`。

如果您不執行此檢查，程式碼將無法編譯，並顯示以下訊息：
「Only [safe (?.)](null-safety.md#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety.md#not-null-assertion-operator) are allowed
on a [nullable receiver](extensions.md#nullable-receiver) of type String? (只有安全呼叫 (?.) 或非空斷言 (!!.) 呼叫才允許在 String? 類型的可空接收器上)」。

您可以更簡潔地編寫相同程式碼——使用 [安全呼叫運算子 `?.` (If-not-null shorthand)](idioms.md#if-not-null-shorthand)，它允許您將 null 檢查和方法呼叫組合成一個單一操作：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## 平台類型

在 Java 中，您可以使用註解 (annotation) 來指示變數是否可以為 `null`。
此類註解不是標準函式庫的一部分，但您可以單獨添加它們。
例如，您可以使用 JetBrains 的 `@Nullable` 和 `@NotNull` 註解 (來自 `org.jetbrains.annotations` 套件)
或 Eclipse 的註解 (`org.eclipse.jdt.annotation`)。
當您 [從 Kotlin 程式碼呼叫 Java 程式碼](java-interop.md#nullability-annotations) 時，Kotlin 可以識別此類註解，並將根據其註解處理類型。

如果您的 Java 程式碼沒有這些註解，那麼 Kotlin 將把 Java 類型視為 _平台類型 (platform types)_。
但是，由於 Kotlin 沒有此類類型的可空性資訊，其編譯器將允許對它們進行所有操作。
您將需要決定是否執行 null 檢查，因為：

*   就像在 Java 中一樣，如果您嘗試對 `null` 執行操作，將會得到 `NullPointerException`。
*   編譯器不會高亮顯示任何多餘的 null 檢查，而通常在您對非空類型的值執行 null 安全操作時，它會這樣做。

深入瞭解 [在空安全和平台類型方面從 Kotlin 呼叫 Java](java-interop.md#null-safety-and-platform-types)。

## 明確非空類型的支援

在 Kotlin 中，如果您想覆寫一個包含 `@NotNull` 作為引數的 Java 方法，您需要 Kotlin 的明確非空類型 (definitely non-nullable types)。

例如，考慮 Java 中的這個 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功覆寫 `load()` 方法，您需要將 `T1` 宣告為明確非空 (`T1 & Any`)：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

深入瞭解 [明確非空](generics.md#definitely-non-nullable-types) 的泛型類型。

## 檢查函式呼叫的結果

最常見的需要檢查 `null` 的情況之一是從函式呼叫取得結果時。

在以下範例中，有兩個類別 `Order` 和 `Customer`。`Order` 具有對 `Customer` 實例的參考。
`findOrder()` 函式回傳 `Order` 類別的實例，如果找不到訂單則回傳 `null`。
目標是處理檢索到的訂單的客戶實例。

以下是 Java 中的類別：

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

在 Java 中，呼叫函式並對結果執行 if-not-null 檢查，以繼續對所需屬性進行解參考：

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

將上述 Java 程式碼直接轉換為 Kotlin 程式碼會產生以下結果：

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
{id="process-customer-if-not-null-kotlin"}

結合標準函式庫中的任何 [作用域函式 (scope functions)](scope-functions.md)，使用 [安全呼叫運算子 `?.` (If-not-null shorthand)](idioms.md#if-not-null-shorthand)。
`let` 函式通常用於此目的：

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

這是相同程式碼的更簡潔版本：

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## 預設值而非 null

檢查 `null` 通常與在 null 檢查成功時 [設定預設值](functions.md#default-arguments) 結合使用。

包含 null 檢查的 Java 程式碼：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

要在 Kotlin 中表達相同內容，請使用 [Elvis 運算子 (If-not-null-else shorthand)](null-safety.md#elvis-operator)：

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 回傳值或 null 的函式

在 Java 中，處理列表元素時需要小心。在使用元素之前，您應該始終檢查元素是否在索引處存在：

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```
{id="functions-returning-null-java"}

Kotlin 標準函式庫通常提供名稱指示是否可能回傳 `null` 值的函式。
這在集合 API 中尤為常見：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // The same code as in Java:
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // Can throw IndexOutOfBoundsException if the collection is empty
    //numbers.get(5)     // Exception!

    // More abilities:
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 聚合操作

當您需要取得最大元素，或者如果沒有元素則取得 `null` 時，在 Java 中您會使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)：

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

深入瞭解 [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide.md)。

## 安全地轉換類型

當您需要安全地轉換類型時，在 Java 中您會使用 `instanceof` 運算子，然後檢查它是否運作良好：

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // Prints `-1`
}
```
{id="casting-types-java"}

為了避免 Kotlin 中的例外，請使用 [安全轉型運算子 (safe cast operator)](typecasts.md#safe-nullable-cast-operator) `as?`，它在失敗時回傳 `null`：

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
{kotlin-runnable="true" id="casting-types-kotlin"}

> 在上面的 Java 範例中，函式 `getStringLength()` 回傳基本類型 `int` 的結果。
要使其回傳 `null`，您可以使用 [_裝箱 (boxed)_ 類型](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`。
然而，讓此類函式回傳負值然後檢查該值更具資源效率——您無論如何都會進行檢查，但這樣不會執行額外的裝箱。
>
{style="note"}

## 接下來？

*   瀏覽其他 [Kotlin 慣用語](idioms.md)。
*   瞭解如何使用 [Java 到 Kotlin (J2K) 轉換器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 將現有的 Java 程式碼轉換為 Kotlin。
*   查看其他遷移指南：
    *   [Java 和 Kotlin 中的字串](java-to-kotlin-idioms-strings.md)
    *   [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide.md)

如果您有喜歡的慣用語，請隨時透過發送合併請求 (pull request) 與我們分享！