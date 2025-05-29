[//]: # (title: Java 和 Kotlin 中的可空性)
[//]: # (description: 了解如何将 Java 中的可空结构迁移到 Kotlin。本指南涵盖 Kotlin 对可空类型的支持、Kotlin 如何处理来自 Java 的可空注解等内容。)

_可空性_ 是指变量能够持有 `null` 值的特性。
当变量包含 `null` 时，尝试解引用该变量会导致 `NullPointerException`。
有许多方法可以编写代码，以最大限度地减少出现空指针异常的可能性。

本指南涵盖了 Java 和 Kotlin 在处理可能为空的变量方面的不同方法。
它将帮助您从 Java 迁移到 Kotlin，并以地道的 Kotlin 风格编写代码。

本指南的第一部分涵盖了最重要的区别——Kotlin 中对可空类型的支持，
以及 Kotlin 如何处理[来自 Java 代码的类型](#platform-types)。第二部分，从
[检查函数调用的结果](#checking-the-result-of-a-function-call)开始，探讨了几个具体案例来解释某些差异。

[了解更多关于 Kotlin 中的空安全信息](null-safety.md)。

## 对可空类型的支持

Kotlin 和 Java 类型系统之间最重要的区别在于 Kotlin 对[可空类型](null-safety.md)的显式支持。
这是一种指示哪些变量可能持有 `null` 值的方式。
如果一个变量可以是 `null`，那么在该变量上调用方法是不安全的，因为这可能导致 `NullPointerException`。
Kotlin 在编译时禁止此类调用，从而防止了许多可能的异常。
在运行时，可空类型的对象和非空类型的对象被视为相同：
可空类型不是非空类型的包装器。所有检查都在编译时执行。
这意味着在 Kotlin 中使用可空类型几乎没有运行时开销。

> 之所以说“几乎”，是因为即使[内部 (intrinsic)](https://en.wikipedia.org/wiki/Intrinsic_function) 检查_确实_ 生成了，
它们的开销也是微乎其微的。
>
{style="note"}

在 Java 中，如果您不编写空检查，方法可能会抛出 `NullPointerException`：

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

此调用将产生以下输出：

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

在 Kotlin 中，所有常规类型默认都是非空的，除非您显式地将其标记为可空。
如果您不期望 `a` 为 `null`，请按如下方式声明 `stringLength()` 函数：

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

参数 `a` 的类型是 `String`，这在 Kotlin 中意味着它必须始终包含一个 `String` 实例，并且不能包含 `null`。
Kotlin 中的可空类型用问号 `?` 标记，例如 `String?`。
如果 `a` 是 `String` 类型，那么在运行时出现 `NullPointerException` 的情况是不可能发生的，因为编译器强制执行
所有 `stringLength()` 函数的参数都不能为 `null` 的规则。

尝试将 `null` 值传递给 `stringLength(a: String)` 函数将导致编译时错误，
“Null can not be a value of a non-null type String”：

![向非空函数传递 null 值错误](passing-null-to-function.png){width=700}

如果您希望此函数能够使用包括 `null` 在内的任何参数，请在参数类型 `String?` 后添加问号，
并在函数体内进行检查，以确保参数的值不为 `null`：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

检查成功通过后，编译器会将该变量视为非空类型 `String`，
在编译器执行检查的作用域内。

如果您不执行此检查，代码将编译失败并显示以下消息：
“Only [安全调用 (?.)](null-safety.md#safe-call-operator) or [非空断言 (!!.) 调用](null-safety.md#not-null-assertion-operator) are allowed
on a [可空接收者](extensions.md#nullable-receiver) of type String?”。

您可以使用更简洁的方式编写相同代码——使用[安全调用操作符 ?. (非空简写)](idioms.md#if-not-null-shorthand)，
它允许您将空检查和方法调用组合成一个单个操作：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## 平台类型

在 Java 中，您可以使用指示变量是否可以为 `null` 的注解。
此类注解不属于标准库的一部分，但您可以单独添加它们。
例如，您可以使用 JetBrains 的 `@Nullable` 和 `@NotNull` 注解（来自 `org.jetbrains.annotations` 包），
或来自 Eclipse 的注解（`org.eclipse.jdt.annotation`）。
当您[从 Kotlin 代码调用 Java 代码](java-interop.md#nullability-annotations)时，Kotlin 可以识别此类注解，
并会根据它们的注解来处理类型。

如果您的 Java 代码没有这些注解，那么 Kotlin 将把 Java 类型视为_平台类型_。
但由于 Kotlin 没有这些类型的可空性信息，其编译器将允许对其执行所有操作。
您将需要决定是否执行空检查，因为：

*   正如在 Java 中一样，如果您尝试对 `null` 执行操作，将获得 `NullPointerException`。
*   编译器不会突出显示任何冗余的空检查，而当您对非空类型的值执行空安全操作时，它通常会这样做。

了解更多关于[从 Kotlin 调用 Java（关于空安全和平台类型）](java-interop.md#null-safety-and-platform-types)的信息。

## 对明确非空类型的支持

在 Kotlin 中，如果您想重写一个参数包含 `@NotNull` 的 Java 方法，则需要 Kotlin 的明确非空类型。

例如，考虑 Java 中的 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功重写 `load()` 方法，您需要将 `T1` 声明为明确非空 (`T1 & Any`)：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

了解更多关于[明确非空](generics.md#definitely-non-nullable-types)的泛型类型信息。

## 检查函数调用的结果

最常见的需要检查 `null` 的情况之一是当您从函数调用中获取结果时。

在以下示例中，有两个类：`Order` 和 `Customer`。`Order` 持有 `Customer` 实例的引用。
`findOrder()` 函数返回 `Order` 类的一个实例，如果找不到该订单则返回 `null`。
目标是处理检索到的订单的客户实例。

以下是 Java 中的类：

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

在 Java 中，调用函数并对结果进行非空检查，以继续解引用所需属性：

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

将上述 Java 代码直接转换为 Kotlin 代码会得到以下结果：

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

结合标准库中的[作用域函数](scope-functions.md)，使用[安全调用操作符 `?.` (非空简写)](idioms.md#if-not-null-shorthand)。
通常为此目的使用 `let` 函数：

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

以下是其更短的版本：

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## 用默认值代替 null

检查 `null` 通常与[设置默认值](functions.md#default-arguments)结合使用，以在存在 `null` 时提供默认值。

带空检查的 Java 代码：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

为了在 Kotlin 中表达相同含义，请使用[Elvis 操作符 (非空即取简写)](null-safety.md#elvis-operator)：

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 返回值或 null 的函数

在 Java 中，在使用列表元素时需要小心。您应该始终检查某个索引处是否存在元素，
然后再尝试使用该元素：

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```
{id="functions-returning-null-java"}

Kotlin 标准库通常提供一些函数，其名称指示它们是否可能返回 `null` 值。
这在集合 API 中尤其常见：

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

当您需要获取最大元素，或者在没有元素时获取 `null` 时，在 Java 中您会使用
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

了解更多关于[Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide.md)信息。

## 安全地进行类型转换

当您需要安全地进行类型转换时，在 Java 中您会使用 `instanceof` 操作符，然后检查其效果：

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

为了在 Kotlin 中避免异常，请使用[安全类型转换操作符](typecasts.md#safe-nullable-cast-operator) `as?`，它在失败时返回 `null`：

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

> 在上面的 Java 示例中，函数 `getStringLength()` 返回基本类型 `int` 的结果。
要使其返回 `null`，可以使用[_装箱_ 类型](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`。
然而，让此类函数返回负值然后检查该值会更节省资源——
无论如何您都会进行检查，而且这种方式不会执行额外的装箱操作。
>
{style="note"}

## 接下来？

*   浏览其他[Kotlin 惯用法](idioms.md)。
*   了解如何使用 [Java 到 Kotlin (J2K) 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)将现有 Java 代码转换为 Kotlin。
*   查看其他迁移指南：
    *   [Java 和 Kotlin 中的字符串](java-to-kotlin-idioms-strings.md)
    *   [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide.md)

如果您有喜欢的惯用法，欢迎通过发送拉取请求与我们分享！