[//]: # (title: Java 与 Kotlin 中的可空性)

<web-summary>了解如何将 Java 中的可空结构迁移到 Kotlin。本指南涵盖了 Kotlin 对可空类型的支持、Kotlin 如何处理来自 Java 的可空注解等内容。</web-summary>

_可空性_ 指变量可持有 `null` 值的特性。
当变量包含 `null` 时，尝试解引用该变量会导致 `NullPointerException`。
有许多方法可以编写代码，以最大程度地降低收到空指针异常的概率。

本指南涵盖了 Java 与 Kotlin 在处理可能可空变量方面的不同方法。
它将帮助你从 Java 迁移到 Kotlin，并以原汁原味的 Kotlin 风格编写代码。

本指南的第一部分涵盖了最重要的区别——Kotlin 对可空类型的支持以及
Kotlin 如何处理[来自 Java 代码的类型](#platform-types)。第二部分，从
[检查函数调用的结果](#checking-the-result-of-a-function-call)开始，探讨了几个具体案例来解释某些差异。

[详细了解 Kotlin 中的空安全](null-safety.md)。

## 对可空类型的支持

Kotlin 与 Java 类型系统之间最重要的区别是 Kotlin 对[可空类型](null-safety.md)的显式支持。
这是一种表明哪些变量可能持有 `null` 值的方式。
如果变量可能为 `null`，则在该变量上调用方法是不安全的，因为这可能导致 `NullPointerException`。
Kotlin 在编译期禁止此类调用，从而防止了许多可能的异常。
在运行时，可空类型对象与非空类型对象被同等对待：
可空类型不是非空类型的包装器。所有检测都在编译期执行。
这意味着在 Kotlin 中使用可空类型几乎没有运行时开销。

> 我们说“几乎”是因为，即使[内建](https://en.wikipedia.org/wiki/Intrinsic_function)检测确实会生成，
其开销也微乎其微。
>
{style="note"}

在 Java 中，如果你不编写 `null` 检测，方法可能会抛出 `NullPointerException`：

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // 抛出 `NullPointerException`
}
```
{id="get-length-of-null-java"}

此调用将产生以下输出：

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

在 Kotlin 中，除非你显式将其标记为可空，否则所有常规类型默认都是非空的。
如果你不期望 `a` 为 `null`，请按如下方式声明 `stringLength()` 函数：

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

参数 `a` 的类型为 `String`，这在 Kotlin 中意味着它必须始终包含 `String` 实例，并且不能包含 `null`。
Kotlin 中的可空类型用问号 `?` 标记，例如 `String?`。
如果在运行时 `a` 的类型是 `String`，则 `NullPointerException` 的情况是不可能发生的，因为编译器强制执行
`stringLength()` 的所有实参都不能为 `null` 的规则。

尝试将 `null` 值传递给 `stringLength(a: String)` 函数将导致编译期错误：
“Null 不能是非空类型 String 的值”：

![将 null 传递给非空函数时的错误](passing-null-to-function.png){width=700}

如果你希望此函数能接受任何实参（包括 `null`），请在实参类型 `String?` 后使用问号，
并在函数体内部进行检测以确保实参的值不为 `null`：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

在检测成功通过后，编译器将在执行检测的作用域内将该变量视为非空类型 `String`。

如果你不执行此检测，代码将无法编译，并显示以下消息：
“Only [safe (?.)](null-safety.md#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety.md#not-null-assertion-operator) are allowed
on a [nullable receiver](extensions.md#nullable-receivers) of type String?”。

你可以写得更短——使用[安全调用操作符 ?.（非空即else 速记）](idioms.md#if-not-null-shorthand)，
它允许你将 `null` 检测和方法调用合并为单个操作：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## 平台类型

在 Java 中，你可以使用注解来表明变量是否可以为 `null`。
此类注解不属于标准库的一部分，但你可以单独添加它们。
例如，你可以使用 JetBrains 注解 `@Nullable` 和 `@NotNull`（来自 `org.jetbrains.annotations` 包），
[JSpecify](https://jspecify.dev/) 中的注解（`org.jspecify.annotations`），或 Eclipse 的注解（`org.eclipse.jdt.annotation`）。
当你[从 Kotlin 代码调用 Java 代码](java-interop.md#nullability-annotations)时，Kotlin 可以识别此类注解，
并将根据其注解处理类型。

如果你的 Java 代码没有这些注解，那么 Kotlin 将把 Java 类型视为_平台类型_。
但由于 Kotlin 没有这些类型的可空性信息，其编译器将允许对其进行所有操作。
你需要决定是否执行 `null` 检测，因为：

*   与 Java 中一样，如果你尝试对 `null` 执行操作，将得到 `NullPointerException`。
*   编译器不会高亮显示任何冗余的 `null` 检测，而当你在非空类型的值上执行空安全操作时，它通常会这样做。

详细了解[从 Kotlin 调用 Java（关于空安全和平台类型）](java-interop.md#null-safety-and-platform-types)。

## 对确定非空类型的支持

在 Kotlin 中，如果你想覆盖一个 Java 方法，并且该方法包含 `@NotNull` 作为实参，则你需要 Kotlin 的确定非空类型。

例如，考虑 Java 中的这个 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

为了在 Kotlin 中成功覆盖 `load()` 方法，你需要将 `T1` 声明为确定非空类型（`T1 & Any`）：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

详细了解[确定非空](generics.md#definitely-non-nullable-types)的泛型。

## 检查函数调用的结果

最常见的需要检测 `null` 的情况之一是当你从函数调用中获取结果时。

在以下示例中，有两个类：`Order` 和 `Customer`。`Order` 持有 `Customer` 实例的引用。
函数 `findOrder()` 返回 `Order` 类的实例，如果找不到订单则返回 `null`。
目标是处理检索到的订单的客户实例。

以下是 Java 中的类：

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

在 Java 中，调用函数并对结果执行 if-not-null 检测，以便继续解引用所需的属性：

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

将上述 Java 代码直接转换为 Kotlin 代码，结果如下：

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

结合标准库中的任何[作用域函数](scope-functions.md)，使用[安全调用操作符 `?.`（非空即else 速记）](idioms.md#if-not-null-shorthand)。
通常为此使用 `let` 函数：

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

这是更短的版本：

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## 默认值而非 null

检测 `null` 通常与[设置默认值](functions.md#parameters-with-default-values)结合使用，以防 `null` 检测成功。

带 `null` 检测的 Java 代码：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

要在 Kotlin 中表达相同内容，请使用 [Elvis 操作符（非空即else 速记）](null-safety.md#elvis-operator)：

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 返回值或 null 的函数

在 Java 中，处理列表元素时需要小心。在使用元素之前，应始终检测特定索引处是否存在元素：

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```
{id="functions-returning-null-java"}

Kotlin 标准库通常提供一些函数，其名称表明它们是否可能返回 `null` 值。
这在集合 API 中尤其常见：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // 与 Java 中相同的代码：
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // 如果集合为空，可能会抛出 IndexOutOfBoundsException
    //numbers.get(5)     // 异常！

    // 更多功能：
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 聚合操作

当你需要获取最大元素（如果没有元素则为 `null`）时，在 Java 中你会使用
[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)：

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```
{id="aggregate-functions-java"}

在 Kotlin 中，使用[聚合操作](collection-aggregate.md)：

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```
{id="aggregate-functions-kotlin"}

详细了解[Java 与 Kotlin 中的集合](java-to-kotlin-collections-guide.md)。

## 安全类型转换

当你需要安全地转换类型时，在 Java 中你会使用 `instanceof` 操作符，然后检测其效果：

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // 打印 `-1`
}
```
{id="casting-types-java"}

为了在 Kotlin 中避免异常，请使用[安全转换操作符](typecasts.md#safe-nullable-cast-operator) `as?`，它在失败时返回 `null`：

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // 打印 `-1`
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // null
    return x?.length ?: -1 // 因为 `x` 为 null，所以返回 -1
}
```
{kotlin-runnable="true" id="casting-types-kotlin"}

> 在上述 Java 示例中，函数 `getStringLength()` 返回原语类型 `int` 的结果。
为了使其返回 `null`，你可以使用[_装箱_类型](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`。
然而，让此类函数返回负值然后检测该值会更节省资源——你无论如何都会执行该检测，但这样不会执行额外的装箱操作。
>
{style="note"}

将 Java 代码迁移到 Kotlin 时，你可能希望最初使用带有可空类型的常规转换操作符 `as`，以保留代码的原始语义。
但是，我们建议你调整代码以使用安全转换操作符 `as?`，以实现更安全、更惯用的方法。例如，如果你有以下 Java 代码：

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

直接使用 `as` 操作符迁移会得到：

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? {
    if (profile == null) {
        return null
    }
    return profile.data as String?
}
```

在这里，`profile.data` 使用 `as String?` 被转换为可空字符串。

我们建议更进一步，使用 `as? String` 来安全地转换该值。这种方法在失败时返回 `null`，而不是抛出 `ClassCastException`：

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? =
  profile?.data as? String
```

此版本将 `if` 表达式替换为[安全调用操作符](null-safety.md#safe-call-operator) `?.`，它在尝试转换之前安全地访问了 `data` 属性。

## 接下来？

*   浏览其他 [Kotlin 惯用法](idioms.md)。
*   了解如何使用 [Java-to-Kotlin (J2K) 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 将现有 Java 代码转换为 Kotlin。
*   查阅其他迁移指南：
    *   [Java 与 Kotlin 中的字符串](java-to-kotlin-idioms-strings.md)
    *   [Java 与 Kotlin 中的集合](java-to-kotlin-collections-guide.md)

如果你有喜欢的惯用法，请随时通过发送[拉取请求](pull request)与我们分享！