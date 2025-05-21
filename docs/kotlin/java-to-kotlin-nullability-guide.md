---
title: "Java 和 Kotlin 中的可空性"
description: "了解如何将 Java 中的可空结构迁移到 Kotlin。本指南涵盖了 Kotlin 中对可空类型的支持、Kotlin 如何处理来自 Java 的可空注解等等。"
---
_可空性 (Nullability)_ 是指变量可以持有 `null` 值的能力。当变量包含 `null` 时，尝试解引用该变量会导致 `NullPointerException`。有很多方法可以编写代码，以最大限度地降低收到空指针异常的可能性。

本指南涵盖了 Java 和 Kotlin 在处理可能为空的变量方面的差异。它将帮助您从 Java 迁移到 Kotlin，并以地道的 Kotlin 风格编写代码。

本指南的第一部分涵盖了最重要的区别 - Kotlin 中对 [可空类型](null-safety) 的支持以及 Kotlin 如何处理来自 [Java 代码的类型](#platform-types)。第二部分，从 [检查函数调用的结果](#checking-the-result-of-a-function-call) 开始，检查几个特定案例以解释某些差异。

[了解更多关于 Kotlin 中的 null 安全](null-safety)。

## 对可空类型的支持

Kotlin 和 Java 类型系统之间最重要的区别是 Kotlin 对 [可空类型](null-safety) 的显式支持。这是一种指示哪些变量可能持有 `null` 值的方式。如果变量可以为 `null`，那么在该变量上调用方法是不安全的，因为这可能会导致 `NullPointerException`。Kotlin 在编译时禁止此类调用，从而避免了许多可能的异常。在运行时，可空类型的对象和非可空类型的对象被同等对待：可空类型不是非可空类型的包装器。所有检查都在编译时执行。这意味着在 Kotlin 中使用可空类型几乎没有运行时开销。

:::note
我们说“几乎”，因为即使生成了 [内联 (intrinsic)](https://en.wikipedia.org/wiki/Intrinsic_function) 检查，它们的开销也很小。

:::

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

此调用将具有以下输出：

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

在 Kotlin 中，所有常规类型默认都是非空的，除非您显式地将它们标记为可空。如果您不希望 `a` 为 `null`，请按如下方式声明 `stringLength()` 函数：

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```

参数 `a` 具有 `String` 类型，在 Kotlin 中，这意味着它必须始终包含一个 `String` 实例，并且不能包含 `null`。Kotlin 中的可空类型用问号 `?` 标记，例如 `String?`。如果 `a` 是 `String`，则在运行时出现 `NullPointerException` 的情况是不可能的，因为编译器强制执行 `stringLength()` 的所有参数都不能为 `null` 的规则。

尝试将 `null` 值传递给 `stringLength(a: String)` 函数将导致编译时错误“Null can not be a value of a non-null type String”：

<img src="/img/passing-null-to-function.png" alt="传递 null 给非可空函数的错误" width="700" style={{verticalAlign: 'middle'}}/>

如果您想将此函数与任何参数（包括 `null`）一起使用，请在参数类型 `String?` 之后使用问号，并在函数体内部进行检查，以确保参数的值不为 `null`：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```

在成功通过检查后，编译器会将该变量视为非可空类型 `String`，在编译器执行检查的范围内。

如果您不执行此检查，代码将无法编译，并显示以下消息：“Only [safe (?.)](null-safety#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety#not-null-assertion-operator) are allowed on a [nullable receiver](extensions#nullable-receiver) of type String?”。

您可以编写相同的更短的代码 – 使用 [安全调用操作符 ?. (If-not-null shorthand)](idioms#if-not-null-shorthand)，它允许您将 null 检查和方法调用组合成一个操作：

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```

## 平台类型 (Platform types)

在 Java 中，您可以使用注解来显示变量是否可以为 `null`。此类注解不是标准库的一部分，但您可以单独添加它们。例如，您可以使用 JetBrains 注解 `@Nullable` 和 `@NotNull`（来自 `org.jetbrains.annotations` 包）或来自 Eclipse 的注解 (`org.eclipse.jdt.annotation`)。当您从 [Kotlin 代码调用 Java 代码](java-interop#nullability-annotations) 时，Kotlin 可以识别此类注解，并将根据它们的注解处理类型。

如果您的 Java 代码没有这些注解，那么 Kotlin 会将 Java 类型视为 _平台类型 (platform types)_。但是由于 Kotlin 没有此类类型的可空性信息，因此其编译器将允许对它们执行所有操作。您需要决定是否执行 null 检查，因为：

* 就像在 Java 中一样，如果您尝试对 `null` 执行操作，您将收到 `NullPointerException`。
* 编译器不会突出显示任何冗余的 null 检查，通常情况下，当您对非可空类型的值执行 null 安全操作时，它会这样做。

了解更多关于 [从 Kotlin 调用 Java 关于 null 安全和平台类型](java-interop#null-safety-and-platform-types)。

## 对明确非空类型的支持

在 Kotlin 中，如果您想覆盖一个 Java 方法，该方法包含 `@NotNull` 作为参数，您需要 Kotlin 的明确非空类型。

例如，考虑 Java 中的这个 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

为了在 Kotlin 中成功地覆盖 `load()` 方法，您需要将 `T1` 声明为明确非空 (`T1 & Any`)：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

了解更多关于 [明确非空](generics#definitely-non-nullable-types) 的泛型类型。

## 检查函数调用的结果

您需要检查 `null` 的最常见情况之一是，当您从函数调用中获得结果时。

在以下示例中，有两个类，`Order` 和 `Customer`。 `Order` 具有对 `Customer` 实例的引用。如果 `findOrder()` 函数找不到订单，则返回 `Order` 类的实例，否则返回 `null`。目标是处理检索到的订单的 customer 实例。

以下是 Java 中的类：

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

在 Java 中，调用该函数并对结果执行 if-not-null 检查，以继续进行所需属性的解引用：

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```

将上面的 Java 代码直接转换为 Kotlin 代码会得到以下结果：

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

使用 [安全调用操作符 `?.` (If-not-null shorthand)](idioms#if-not-null-shorthand) 与标准库中的任何 [作用域函数 (scope functions)](scope-functions) 结合使用。`let` 函数通常用于此目的：

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```

以下是相同的代码的更短版本：

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```

## 默认值代替 null

通常将检查 `null` 与 [设置默认值](functions#default-arguments) 结合使用，以防 null 检查成功。

带有 null 检查的 Java 代码：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```

要在 Kotlin 中表达相同的意思，请使用 [Elvis 操作符 (If-not-null-else shorthand)](null-safety#elvis-operator)：

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```

## 返回值或 null 的函数

在 Java 中，使用列表元素时需要小心。在尝试使用元素之前，您应该始终检查索引处是否存在元素：

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```

Kotlin 标准库通常提供函数，其名称指示它们是否可能返回值 `null`。这在集合 API 中尤其常见：

```kotlin
fun main() {

    // Kotlin
    // 与 Java 中相同的代码：
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // 如果集合为空，则可以抛出 IndexOutOfBoundsException
    //numbers.get(5)     // Exception!

    // 更多功能：
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null

}
```

## 聚合操作 (Aggregate operations)

当您需要获取最大的元素，或者如果没有元素则获取 `null` 时，在 Java 中您将使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)：

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```

在 Kotlin 中，使用 [聚合操作 (aggregate operations)](collection-aggregate)：

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```

了解更多关于 [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide)。

## 安全地转换类型

当您需要安全地转换类型时，在 Java 中您将使用 `instanceof` 操作符，然后检查其工作情况：

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // 打印 `-1`
}
```

为了避免 Kotlin 中的异常，请使用 [安全转换操作符 (safe cast operator)](typecasts#safe-nullable-cast-operator) `as?`，它在失败时返回 `null`：

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

:::note
在上面的 Java 示例中，函数 `getStringLength()` 返回原始类型 `int` 的结果。要使其返回 `null`，您可以使用 [_boxed_ 类型](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`。但是，使此类函数返回负值然后检查该值更节省资源 - 您无论如何都会进行检查，但是不会执行额外的装箱。

:::

## 接下来做什么？

* 浏览其他 [Kotlin 习惯用法](idioms)。
* 了解如何使用 [Java-to-Kotlin (J2K) 转换器](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k) 将现有的 Java 代码转换为 Kotlin。
* 查看其他迁移指南：
  * [Java 和 Kotlin 中的字符串](java-to-kotlin-idioms-strings)
  * [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide)

如果您有喜欢的习惯用法，请随时发送 pull request 与我们分享！