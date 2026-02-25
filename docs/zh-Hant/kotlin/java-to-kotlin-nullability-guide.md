[//]: # (title: Java 與 Kotlin 中的可 null 性)

<web-summary>了解如何將可 null 結構從 Java 遷移到 Kotlin。本指南涵蓋了 Kotlin 對可 null 型別的支援、Kotlin 如何處理來自 Java 的可 null 註解等內容。</web-summary>

_可 null 性 (Nullability)_ 是指變數持有 `null` 值的能力。
當變數包含 `null` 時，嘗試解取引用 (dereference) 該變數會導致 `NullPointerException`。
有許多撰寫程式碼的方法可以最大限度地降低收到空指標例外的機率。

本指南涵蓋了 Java 與 Kotlin 在處理可能為可 null 變數時的方法差異。
這將幫助您從 Java 遷移到 Kotlin，並以道地的 Kotlin 風格撰寫程式碼。

本指南的第一部分涵蓋了最重要的區別 —— Kotlin 對可 null 型別的支援，以及
Kotlin 如何處理 [來自 Java 程式碼的型別](#platform-types)。第二部分從
[檢查函式呼叫的結果](#checking-the-result-of-a-function-call) 開始，檢視了幾個具體案例來解釋某些差異。

[進一步了解 Kotlin 中的 null 安全性](null-safety.md)。

## 對可 null 型別的支援

Kotlin 與 Java 型別系統最重要的區別在於 Kotlin 對 [可 null 型別](null-safety.md) 的明確支援。
這是一種標示哪些變數可能持有 `null` 值的方法。
如果變數可以為 `null`，則在該變數上呼叫方法是不安全的，因為這可能會導致 `NullPointerException`。
Kotlin 在編譯期禁止此類呼叫，從而防止了許多可能的例外。
在執行期，可 null 型別的物件和不可 null 型別的物件被同等對待：
可 null 型別不是不可 null 型別的包裝器 (wrapper)。所有檢查都在編譯期執行。
這意味著在 Kotlin 中使用可 null 型別幾乎沒有執行期開銷。

> 我們說「幾乎」，是因為儘管 [固有 (intrinsic)](https://en.wikipedia.org/wiki/Intrinsic_function) 檢查「確實」會產生，
但它們的開銷微乎其微。
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

此呼叫將具有以下輸出：

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

在 Kotlin 中，所有常規型別預設都是不可 null 的，除非您明確將其標記為可 null。
如果您不預期 `a` 為 `null`，請如下宣告 `stringLength()` 函式：

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

參數 `a` 具有 `String` 型別，這在 Kotlin 中意味著它必須始終包含一個 `String` 執行個體，且不能包含 `null`。
Kotlin 中的可 null 型別標有問號 `?`，例如 `String?`。
如果 `a` 是 `String`，則在執行期發生 `NullPointerException` 的情況是不可能的，因為編譯器強制執行
`stringLength()` 的所有引數都不能為 `null` 的規則。

嘗試向 `stringLength(a: String)` 函式傳遞 `null` 值將導致編譯期錯誤：
"Null can not be a value of a non-null type String"：

![將 null 傳遞給不可 null 函式錯誤](passing-null-to-function.png){width=700}

如果您想將此函式用於任何引數（包括 `null`），請在引數型別 `String?` 後使用問號，
並在函式體內進行檢查，以確保引數的值不為 `null`：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

在檢查成功通過後，編譯器在執行檢查的作用域內會將該變數視為不可 null 型別 `String`。

如果您不執行此檢查，程式碼將無法通過編譯，並顯示以下訊息：
"Only [safe (?.)](null-safety.md#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety.md#not-null-assertion-operator) are allowed
on a [nullable receiver](extensions.md#nullable-receivers) of type String?"。

您可以寫得更簡短 —— 使用 [安全呼叫運算子 ?. (If-not-null 簡寫)](idioms.md#if-not-null-shorthand)，
它允許您將 null 檢查和方法呼叫組合成單個操作：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## 平台型別

在 Java 中，您可以使用註解來顯示變數是否可以為 `null`。
此類註解不是標準程式庫的一部分，但您可以單獨新增它們。
例如，您可以使用 JetBrains 註解 `@Nullable` 和 `@NotNull`（來自 `org.jetbrains.annotations` 套件）、
來自 [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`) 的註解或來自 Eclipse (`org.eclipse.jdt.annotation`) 的註解。
當您 [從 Kotlin 程式碼呼叫 Java 程式碼](java-interop.md#nullability-annotations) 時，Kotlin 可以辨識此類註解，
並根據其註解處理型別。

如果您的 Java 程式碼沒有這些註解，那麼 Kotlin 會將 Java 型別視為*平台型別 (platform types)*。
但由於 Kotlin 沒有此類型別的可 null 性資訊，其編譯器將允許對其進行所有操作。
您需要決定是否執行 null 檢查，因為：

* 就像在 Java 中一樣，如果您嘗試在 `null` 上執行操作，您將得到 `NullPointerException`。
* 編譯器不會醒目提示任何冗餘的 null 檢查，而當您在不可 null 型別的值上執行 null 安全操作時，編譯器通常會這樣做。

進一步了解 [關於 null 安全性和平台型別的 Java 呼叫 Kotlin 說明](java-interop.md#null-safety-and-platform-types)。

## 對絕對不可 null 型別的支援

在 Kotlin 中，如果您想覆寫一個包含 `@NotNull` 作為引數的 Java 方法，您需要 Kotlin 的絕對不可 null 型別。

例如，考慮 Java 中的這個 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功覆寫 `load()` 方法，您需要將 `T1` 宣告為絕對不可 null (`T1 & Any`)：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 是絕對不可 null 的
  override fun load(x: T1 & Any): T1 & Any
}
```

進一步了解 [絕對不可 null](generics.md#definitely-non-nullable-types) 的泛型型別。

## 檢查函式呼叫的結果

最常需要檢查 `null` 的情況之一是當您從函式呼叫中取得結果時。

在以下範例中，有兩個類別：`Order` 和 `Customer`。`Order` 具有對 `Customer` 執行個體的參照。
`findOrder()` 函式傳回 `Order` 類別的執行個體，如果找不到該訂單則傳回 `null`。
目標是處理檢索到的訂單的客戶執行個體。

以下是 Java 中的類別：

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

在 Java 中，呼叫該函式並對結果進行 if-not-null 檢查，以繼續對所需屬性進行解取引用：

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

將上述 Java 程式碼直接轉換為 Kotlin 程式碼如下：

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

使用 [安全呼叫運算子 `?.` (If-not-null 簡寫)](idioms.md#if-not-null-shorthand) 
結合標準程式庫中的任何 [作用域函式](scope-functions.md)。
通常使用 `let` 函式：

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

以下是相同內容的簡短版本：

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## 使用預設值代替 null

檢查 `null` 經常與 [設定預設值](functions.md#parameters-with-default-values) 結合使用，以防 null 檢查成功。

帶有 null 檢查的 Java 程式碼：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

要在 Kotlin 中表達相同的內容，請使用 [Elvis 運算子 (If-not-null-else 簡寫)](null-safety.md#elvis-operator)：

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 傳回值或 null 的函式

在 Java 中，處理清單元素時需要小心。在嘗試使用元素之前，您應該始終檢查該索引處是否存在元素：

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // 例外！
```
{id="functions-returning-null-java"}

Kotlin 標準程式庫通常會提供名稱中標示是否可能傳回 `null` 值的函式。
這在集合 API 中尤其常見：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // 與 Java 相同的程式碼：
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // 如果集合為空，可能會拋出 IndexOutOfBoundsException
    //numbers.get(5)     // 例外！

    // 更多能力：
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 聚合操作

當您需要取得最大的元素，或者在沒有元素時取得 `null`，在 Java 中您會使用
[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)：

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

進一步了解 [Java 與 Kotlin 中的集合](java-to-kotlin-collections-guide.md)。

## 安全地轉換型別

當您需要安全地轉換型別時，在 Java 中您會使用 `instanceof` 運算子，然後檢查其運作情況：

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // 印出 `-1`
}
```
{id="casting-types-java"}

為了避免 Kotlin 中的例外，請使用 [安全轉換運算子](typecasts.md#unsafe-cast-operator) `as?`，它在失敗時傳回 `null`：

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // 印出 `-1`
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // null
    return x?.length ?: -1 // 傳回 -1，因為 `x` 為 null
}
```
{kotlin-runnable="true" id="casting-types-kotlin"}

> 在上面的 Java 範例中，函式 `getStringLength()` 傳回基本型別 `int` 的結果。
要讓它傳回 `null`，您可以使用 [裝箱 (boxed) 型別](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`。
然而，讓此類函式傳回負值然後檢查該值會更有效率地利用資源 —— 
反正您都要進行檢查，但這樣做不會執行額外的裝箱。
>
{style="note"}

將 Java 程式碼遷移到 Kotlin 時，您最初可能希望將常規轉換運算子 `as` 與可 null 型別一起使用，
以保留程式碼的原始語意。但是，我們建議調整您的程式碼以使用安全轉換運算子 `as?`，
這是一種更安全且更道地的方法。例如，如果您有以下 Java 程式碼：

```java
public class UserProfile {
    Object data;

    public static String getUsername(UserProfile profile) {
        if (profile == null) {
            return null;
        }
        return (String) profile.data;
    }
}
```

使用 `as` 運算子直接遷移會得到：

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? {
    if (profile == null) {
        return null
    }
    return profile.data as String?
}
```

在這裡，`profile.data` 使用 `as String?` 轉換為可 null 字串。

我們建議更進一步，使用 `as? String` 來安全地轉換值。這種方法在失敗時會傳回 `null`，
而不是拋出 `ClassCastException`：

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? =
  profile?.data as? String
```

此版本將 `if` 運算式替換為 [安全呼叫運算子](null-safety.md#safe-call-operator) `?.`，它在嘗試轉換之前安全地存取 data 屬性。

## 下一步？

* 瀏覽其他 [Kotlin 慣用法](idioms.md)。
* 了解如何使用 [Java 到 Kotlin (J2K) 轉換器](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin) 將現有 Java 程式碼轉換為 Kotlin。
* 查看其他遷移指南：
  * [Java 與 Kotlin 中的字串](java-to-kotlin-idioms-strings.md)
  * [Java 與 Kotlin 中的集合](java-to-kotlin-collections-guide.md)

如果您有喜歡的慣用法，歡迎透過傳送提取要求 (PR) 與我們分享！