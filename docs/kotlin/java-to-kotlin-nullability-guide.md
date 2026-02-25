[//]: # (title: Java 与 Kotlin 中的为 null 性)

<web-summary>了解如何将可空结构从 Java 迁移到 Kotlin。本指南涵盖了 Kotlin 对可空类型的支持、Kotlin 如何处理 Java 的为 null 性注解等内容。</web-summary>

“为 null 性”是指变量持有 `null` 值的能力。
当变量包含 `null` 时，尝试对该变量进行解引用会导致 `NullPointerException`。
有许多种编写代码的方式可以尽可能降低发生空指针异常的概率。

本指南涵盖了 Java 和 Kotlin 在处理可能为空的变量时的做法差异。
它将帮助您从 Java 迁移到 Kotlin，并以地道的 Kotlin 风格编写代码。

本指南的第一部分涵盖了最重要的区别 —— Kotlin 对可空类型的支持以及 Kotlin 如何处理 [来自 Java 代码的类型](#platform-types)。第二部分从 [检查函数调用的结果](#checking-the-result-of-a-function-call) 开始，通过几个具体的案例来解释特定的差异。

[详细了解 Kotlin 中的空安全](null-safety.md)。

## 对可空类型的支持

Kotlin 与 Java 类型系统之间最重要的区别在于 Kotlin 对 [可空类型](null-safety.md) 的显式支持。
这是一种指明哪些变量可能持有 `null` 值的方式。
如果一个变量可能为 `null`，那么在该变量上调用方法是不安全的，因为这会导致 `NullPointerException`。
Kotlin 在编译时禁止此类调用，从而防止了许多可能的异常。
在运行时，可空类型的对象和不可空类型的对象处理方式相同：
可空类型并不是不可空类型的包装器。所有检查都在编译时执行。
这意味着在 Kotlin 中使用可空类型几乎没有运行时开销。

> 我们说“几乎”，是因为尽管 *生成了* [内部](https://en.wikipedia.org/wiki/Intrinsic_function) 检查，但它们的开销是极小的。
>
{style="note"}

在 Java 中，如果您不编写 null 检查，方法可能会抛出 `NullPointerException`：

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

在 Kotlin 中，所有常规类型默认都是不可空的，除非您显式地将它们标记为可空。
如果您不希望 `a` 为 `null`，请如下声明 `stringLength()` 函数：

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

形参 `a` 的类型为 `String`，在 Kotlin 中这意味着它必须始终包含一个 `String` 实例，并且不能包含 `null`。
Kotlin 中的可空类型用问号 `?` 标记，例如 `String?`。
如果 `a` 是 `String` 类型，那么在运行时出现 `NullPointerException` 是不可能的，因为编译器强制执行了 `stringLength()` 的所有实参都不能为 `null` 的规则。

尝试向 `stringLength(a: String)` 函数传递 `null` 值将导致编译错误：
"Null can not be a value of a non-null type String"（Null 不能作为非空类型 String 的值）：

![向不可空函数传递 null 的错误](passing-null-to-function.png){width=700}

如果您想对包含 `null` 在内的任何实参使用此函数，请在实参类型 `String?` 后使用问号，并在函数体内部进行检查，以确保实参的值不是 `null`：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

在成功通过检查后，编译器会在其执行检查的作用域内将该变量视为不可空类型 `String`。

如果您不执行此检查，代码将无法通过编译，并显示以下消息：
"Only [safe (?.)](null-safety.md#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety.md#not-null-assertion-operator) are allowed on a [nullable receiver](extensions.md#nullable-receivers) of type String?"（在类型为 String? 的 [可空接收者](extensions.md#nullable-receivers) 上只允许 [安全 (?.)](null-safety.md#safe-call-operator) 或 [非空断言 (!!.) 调用](null-safety.md#not-null-assertion-operator)）。

您可以编写更简短的同等代码 —— 使用 [安全调用运算符 ?.（If-not-null 简写）](idioms.md#if-not-null-shorthand)，它允许您将 null 检查和方法调用合并为一个操作：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## 平台类型

在 Java 中，您可以使用注解来显示变量是否可以为 `null`。
此类注解不属于标准库，但您可以单独添加它们。
例如，您可以使用 JetBrains 注解 `@Nullable` 和 `@NotNull`（来自 `org.jetbrains.annotations` 软件包）、来自 [JSpecify](https://jspecify.dev/) 的注解 (`org.jspecify.annotations`) 或来自 Eclipse 的注解 (`org.eclipse.jdt.annotation`)。
当您 [从 Kotlin 代码调用 Java 代码](java-interop.md#nullability-annotations) 时，Kotlin 可以识别这些注解，并根据其注解处理类型。

如果您的 Java 代码没有这些注解，那么 Kotlin 会将 Java 类型视为 *平台类型*。
但由于 Kotlin 没有此类类型的为 null 性信息，其编译器将允许对其进行所有操作。
您需要决定是否执行 null 检查，因为：

* 就像在 Java 中一样，如果您尝试在 `null` 上执行操作，您将得到一个 `NullPointerException`。
* 编译器不会高亮显示任何冗余的 null 检查，而当您在不可空类型的值上执行空安全操作时，编译器通常会这样做。

详细了解 [关于空安全和平台类型的 Java 与 Kotlin 互操作](java-interop.md#null-safety-and-platform-types)。

## 对绝对不可空类型的支持

在 Kotlin 中，如果您想重写一个包含 `@NotNull` 作为实参的 Java 方法，您需要 Kotlin 的绝对不可空类型。

例如，考虑 Java 中的这个 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功重写 `load()` 方法，您需要将 `T1` 声明为绝对不可空 (`T1 & Any`)：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 是绝对不可空的
  override fun load(x: T1 & Any): T1 & Any
}
```

详细了解 [绝对不可空](generics.md#definitely-non-nullable-types) 的泛型类型。

## 检查函数调用的结果

需要检查 `null` 最常见的情况之一是当您从函数调用中获取结果时。

在以下示例中，有两个类 `Order` 和 `Customer`。`Order` 拥有对 `Customer` 实例的引用。
`findOrder()` 函数返回 `Order` 类的实例，如果找不到订单则返回 `null`。
目标是处理检索到的订单的客户实例。

以下是 Java 中的类：

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

在 Java 中，调用函数并对结果进行 if-not-null 检查，以继续对所需属性进行解引用：

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

将上述 Java 代码直接转换为 Kotlin 代码的结果如下：

```kotlin
// Kotlin
data class Order(val customer: Customer)

data class Customer(val name: String)

val order = findOrder()

// 直接转换
if (order != null){
    processCustomer(order.customer)
}
```
{id="process-customer-if-not-null-kotlin"}

使用 [安全调用运算符 `?.`（If-not-null 简写）](idioms.md#if-not-null-shorthand) 结合标准库中的任何 [作用域函数](scope-functions.md)。
通常使用 `let` 函数来实现：

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

这是同一个操作的更短版本：

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## 使用默认值替代 null

检查 `null` 通常与在 null 检查成功的情况下 [设置默认值](functions.md#parameters-with-default-values) 结合使用。

带有 null 检查的 Java 代码：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

要在 Kotlin 中表达相同的内容，请使用 [Elvis 运算符（If-not-null-else 简写）](null-safety.md#elvis-operator)：

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 返回值或 null 的函数

在 Java 中，处理列表元素时需要小心。在尝试使用元素之前，您应该始终检查索引处是否存在元素：

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // 异常！
```
{id="functions-returning-null-java"}

Kotlin 标准库经常提供一些函数，其名称指明了它们是否可能返回 `null` 值。
这在集合 API 中尤其常见：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // 与 Java 相同的代码：
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // 如果集合为空，可能抛出 IndexOutOfBoundsException
    //numbers.get(5)     // 异常！

    // 更多能力：
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 聚合操作

当您需要获取最大的元素，或者在没有元素时获取 `null` 时，在 Java 中您会使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)：

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

详细了解 [Java 与 Kotlin 中的集合](java-to-kotlin-collections-guide.md)。

## 安全地进行类型转换

当您需要安全地转换类型时，在 Java 中您会使用 `instanceof` 运算符，然后检查其工作情况：

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

为了在 Kotlin 中避免异常，请使用 [安全转换运算符](typecasts.md#unsafe-cast-operator) `as?`，它在失败时返回 `null`：

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // 打印 `-1`
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // null
    return x?.length ?: -1 // 返回 -1，因为 `x` 为 null
}
```
{kotlin-runnable="true" id="casting-types-kotlin"}

> 在上面的 Java 示例中，函数 `getStringLength()` 返回原始类型 `int` 的结果。
要使其返回 `null`，您可以使用 [*装箱* 类型](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`。
然而，让此类函数返回一个负值然后检查该值在资源利用率上更高 —— 您无论如何都会进行检查，但这样不会执行额外的装箱操作。
>
{style="note"}

在将 Java 代码迁移到 Kotlin 时，您可能最初想使用带有可空类型的常规转换运算符 `as`，以保留代码的原始语义。但是，我们建议调整您的代码以使用安全转换运算符 `as?`，这是一种更安全、更地道的方法。例如，如果您有以下 Java 代码：

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

使用 `as` 运算符直接迁移会得到：

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

我们建议更进一步，使用 `as? String` 来安全地转换值。这种方法在失败时返回 `null`，而不是抛出 `ClassCastException`：

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? =
  profile?.data as? String
```

此版本用 [安全调用运算符](null-safety.md#safe-call-operator) `?.` 替换了 `if` 表达式，该运算符在尝试转换之前安全地访问 data 属性。

## 下一步

* 浏览其他 [Kotlin 常用语法](idioms.md)。
* 了解如何使用 [Java-to-Kotlin (J2K) 转换器](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin) 将现有 Java 代码转换为 Kotlin。
* 查看其他迁移指南：
  * [Java 与 Kotlin 中的字符串](java-to-kotlin-idioms-strings.md)
  * [Java 与 Kotlin 中的集合](java-to-kotlin-collections-guide.md)

如果您有喜欢的常用语法，欢迎通过发送拉取请求 (PR) 的方式与我们分享！