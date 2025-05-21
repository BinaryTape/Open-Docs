---
title: "从 Kotlin 中调用 Java"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 在设计时就考虑到了与 Java 的互操作性。现有的 Java 代码可以以自然的方式从 Kotlin 中调用，并且 Kotlin 代码也可以相当顺畅地从 Java 中使用。在本节中，我们将详细介绍从 Kotlin 中调用 Java 代码的一些细节。

几乎所有的 Java 代码都可以毫无问题地使用：

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 'for' 循环适用于 Java 集合：
    for (item in source) {
        list.add(item)
    }
    // 运算符约定也适用：
    for (i in 0..source.size - 1) {
        list[i] = source[i] // 调用 get 和 set
    }
}
```

## Getter 和 Setter

遵循 Java 的 getter 和 setter 约定的方法（以 `get` 开头的无参数方法和以 `set` 开头的单参数方法）在 Kotlin 中表示为属性。这些属性也称为 _合成属性_（synthetic properties）。`Boolean` 访问器方法（getter 的名称以 `is` 开头，setter 的名称以 `set` 开头）表示为与 getter 方法同名的属性。

```kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) { // 调用 getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY // 调用 setFirstDayOfWeek()
    }
    if (!calendar.isLenient) { // 调用 isLenient()
        calendar.isLenient = true // 调用 setLenient()
    }
}
```

上面的 `calendar.firstDayOfWeek` 是一个合成属性的例子。

请注意，如果 Java 类只有 setter，那么它在 Kotlin 中是不可见的，因为 Kotlin 不支持仅有 setter 的属性。

## Java 合成属性引用

:::note
此功能是 [实验性的](components-stability#stability-levels-explained)。它可能随时被删除或更改。
我们建议您仅将其用于评估目的。

从 Kotlin 1.8.20 开始，您可以创建对 Java 合成属性的引用。 考虑以下 Java 代码：

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

Kotlin 始终允许您编写 `person.age`，其中 `age` 是一个合成属性。 现在，您还可以创建对 `Person::age` 和 `person::age` 的引用。 这同样适用于 `name`。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // 调用对 Java 合成属性的引用：
        .sortedBy(Person::age)
         // 通过 Kotlin 属性语法调用 Java getter：
        .forEach { person `->` println(person.name) }
```

### 如何启用 Java 合成属性引用

要启用此功能，请设置 `-language-version 2.1` 编译器选项。 在 Gradle 项目中，您可以通过将以下内容添加到您的 `build.gradle(.kts)` 中来实现：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
            )
    }
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion
            = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
}
```

</TabItem>
</Tabs>

在 Kotlin 1.9.0 之前，要启用此功能，您必须设置 `-language-version 1.9` 编译器选项。

:::

## 返回 void 的方法

如果 Java 方法返回 `void`，那么从 Kotlin 中调用它时将返回 `Unit`。如果有人碰巧使用了该返回值，Kotlin 编译器将在调用点分配它，因为该值本身是提前知道的（即 `Unit`）。

## 转义 Kotlin 关键字的 Java 标识符

一些 Kotlin 关键字在 Java 中是有效的标识符：`in`、`object`、`is` 等。如果 Java 库使用 Kotlin 关键字作为方法名，您仍然可以调用该方法，并用反引号 (`) 字符转义它：

```kotlin
foo.`is`(bar)
```

## Null 安全和平台类型

Java 中的任何引用都可能是 `null`，这使得 Kotlin 对严格的 null 安全性的要求对于来自 Java 的对象来说是不切实际的。Java 声明的类型在 Kotlin 中以一种特殊的方式处理，并被称为 *平台类型*（platform types）。对于这些类型，Null 检查被放宽，因此它们的安全性保证与 Java 中相同（请参阅下面的更多信息 [below](#mapped-types)）。

考虑以下示例：

```kotlin
val list = ArrayList<String>() // non-null (构造函数结果)
list.add("Item")
val size = list.size // non-null (基本类型 int)
val item = list[0] // 推断的平台类型 (普通 Java 对象)
```

当您在平台类型的变量上调用方法时，Kotlin 不会在编译时发出可空性错误，但由于空指针异常或 Kotlin 生成的用于防止 null 传播的断言，调用可能会在运行时失败：

```kotlin
item.substring(1) // 允许，如果 item == null 则抛出异常
```

平台类型是 *不可表示的*（non-denotable），这意味着您不能在语言中显式地写下它们。当平台值被分配给 Kotlin 变量时，您可以依赖类型推断（变量将具有推断的平台类型，如上面的示例中 `item` 所具有的那样），或者您可以选择您期望的类型（允许使用可空类型和不可空类型）：

```kotlin
val nullable: String? = item // 允许，总是有效
val notNull: String = item // 允许，可能在运行时失败
```

如果您选择一个不可空类型，编译器将在赋值时发出一个断言。这可以防止 Kotlin 的不可空变量持有 null 值。当您将平台值传递给期望非 null 值的 Kotlin 函数以及其他情况下，也会发出断言。总的来说，编译器会尽最大努力防止 null 值在程序中传播，尽管有时不可能完全消除，因为泛型。

### 平台类型的表示法

如上所述，平台类型不能在程序中显式地提及，因此该语言中没有它们的语法。然而，编译器和 IDE 有时需要显示它们（例如，在错误消息或参数信息中），因此有一种助记符表示法：

* `T!` 表示 "`T` 或 `T?`"，
* `(Mutable)Collection<T>!` 表示 "Java 的 `T` 集合可能是可变的或不可变的，可能是可空的或不可空的"，
* `Array<(out) T>!` 表示 "Java 的 `T`（或 `T` 的子类型）数组，可空的或不可空的"

### 可空性注解

具有可空性注解的 Java 类型不表示为平台类型，而是表示为实际的可空或不可空 Kotlin 类型。编译器支持几种可空性注解，包括：

  * [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)（来自 `org.jetbrains.annotations` 包的 `@Nullable` 和 `@NotNull`）
  * [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`)
  * Android (`com.android.annotations` 和 `android.support.annotations`)
  * JSR-305 (`javax.annotation`，更多细节见下文)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`)
  * RxJava 3 (`io.reactivex.rxjava3.annotations`)

您可以指定编译器是否根据特定类型的可空性注解中的信息报告可空性不匹配。使用编译器选项 `-Xnullability-annotations=@<package-name>:<report-level>`。在参数中，指定完全限定的可空性注解包和以下报告级别之一：
* `ignore` 忽略可空性不匹配
* `warn` 报告警告
* `strict` 报告错误

请参阅 [Kotlin 编译器源代码](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt) 中支持的可空性注解的完整列表。

### 注解类型参数和类型形参

您可以注解泛型类型的类型参数和类型形参，以便为它们提供可空性信息。

:::note
本节中的所有示例都使用来自 `org.jetbrains.annotations` 包的 JetBrains 可空性注解。

:::

#### 类型参数

考虑 Java 声明上的这些注解：

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

它们在 Kotlin 中产生以下签名：

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

当类型参数中缺少 `@NotNull` 注解时，您将获得一个平台类型：

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlin 还会考虑基类和接口的类型参数上的可空性注解。例如，有两个 Java 类，其签名如下：

```java
public class Base<T> {}
```

```java
public class Derived extends Base<@Nullable String> {}
```

在 Kotlin 代码中，在假定 `Base<String>` 的地方传递 `Derived` 的实例会产生警告。

```kotlin
fun takeBaseOfNotNullStrings(x: Base<String>) {}

fun main() {
    takeBaseOfNotNullStrings(Derived()) // 警告：可空性不匹配
}
```

`Derived` 的上限设置为 `Base<String?>`，这与 `Base<String>` 不同。

了解更多关于 [Kotlin 中的 Java 泛型](java-interop#java-generics-in-kotlin)。

#### 类型形参

默认情况下，Kotlin 和 Java 中普通类型形参的可空性都是未定义的。 在 Java 中，您可以使用可空性注解来指定它。 让我们注解 `Base` 类的类型形参：

```java
public class Base<@NotNull T> {}
```

从 `Base` 继承时，Kotlin 期望一个不可空的类型参数或类型形参。
因此，以下 Kotlin 代码会产生警告：

```kotlin
class Derived<K> : Base<K> {} // 警告：K 的可空性未定义
```

您可以通过指定上限 `K : Any` 来修复它。

Kotlin 也支持 Java 类型形参的边界上的可空性注解。 让我们向 `Base` 添加边界：

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlin 将其翻译如下：

```kotlin
class BaseWithBound<T : Number> {}
```

因此，将可空类型作为类型参数或类型形参传递会产生警告。

注解类型参数和类型形参适用于 Java 8 目标或更高版本。 此功能要求可空性注解支持 `TYPE_USE` 目标（`org.jetbrains.annotations` 在 15 及更高版本中支持此目标）。

:::note
如果可空性注解除了 `TYPE_USE` 目标之外还支持其他适用于类型的目标，则 `TYPE_USE` 优先。 例如，如果 `@Nullable` 同时具有 `TYPE_USE` 和 `METHOD` 目标，则 Java 方法签名 `@Nullable String[] f()` 在 Kotlin 中变为 `fun f(): Array<String?>!`。

:::

### JSR-305 支持

[JSR-305](https://jcp.org/en/jsr/detail?id=305) 中定义的 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html) 注解支持表示 Java 类型的可空性。

如果 `@Nonnull(when = ...)` 值为 `When.ALWAYS`，则注解类型被视为不可空；`When.MAYBE` 和 `When.NEVER` 表示可空类型；`When.UNKNOWN` 强制类型为 [平台类型](#null-safety-and-platform-types)。

一个库可以针对 JSR-305 注解进行编译，但没有必要使注解构件（例如 `jsr305.jar`）成为库使用者的编译依赖项。 Kotlin 编译器可以从库中读取 JSR-305 注解，而无需在类路径上提供注解。

[自定义可空性限定符 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers) 也受支持（见下文）。

#### 类型限定符昵称

如果一个注解类型同时使用
[`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html)
和 JSR-305 `@Nonnull`（或其另一个昵称，例如 `@CheckForNull`）进行注解，则注解类型本身用于
检索精确的可空性，并且具有与该可空性注解相同的含义：

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // 另一个类型限定符昵称的昵称
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNullable {
}

interface A {
    @MyNullable String foo(@MyNonnull String x);
    // 在 Kotlin 中（严格模式）：`fun foo(x: String): String?`

    String bar(List<@MyNonnull String> x);
    // 在 Kotlin 中（严格模式）：`fun bar(x: List<String>!): String!`
}
```

#### 类型限定符默认值

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html)
允许引入注解，这些注解在应用时，定义带注解的元素范围内默认的可空性。

这种注解类型本身应该使用 `@Nonnull`（或其昵称）和 `@TypeQualifierDefault(...)`
以及一个或多个 `ElementType` 值进行注解：

* `ElementType.METHOD` 用于方法的返回类型
* `ElementType.PARAMETER` 用于值参数
* `ElementType.FIELD` 用于字段
* `ElementType.TYPE_USE` 用于任何类型，包括类型参数、类型形参的上限和通配符类型

当类型本身没有被可空性注解注解时，会使用默认的可空性，默认的可空性由带注解的类型限定符默认注解的、与类型使用匹配的 `ElementType` 的最内层封闭元素确定。

```java
@Nonnull
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
public @interface NonNullApi {
}

@Nonnull(when = When.MAYBE)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE_USE})
public @interface NullableApi {
}

@NullableApi
interface A {
    String foo(String x); // fun foo(x: String?): String?

    @NotNullApi // 覆盖接口的默认值
    String bar(String x, @Nullable String y); // fun bar(x: String, y: String?): String

    // 由于 `@NullableApi` 具有 `TYPE_USE` 元素类型，因此 List<String> 类型参数被视为可空
    String baz(List<String> x); // fun baz(List<String?>?): String?

    // 由于存在显式的 UNKNOWN 标记的可空性注解，因此 `x` 参数的类型仍然是平台类型
    String qux(@Nonnull(when = When.UNKNOWN) String x); // fun baz(x: String!): String?
}
```

:::note
此示例中的类型仅在启用严格模式时才生效； 否则，平台类型仍然存在。
请参阅 [`@UnderMigration` 注解](#undermigration-annotation) 和 [编译器配置](#compiler-configuration) 部分。

:::

还支持包级别的默认可空性：

```java
// FILE: test/package-info.java
@NonNullApi // 声明包“test”中的所有类型默认为不可空
package test;
```

#### @UnderMigration 注解

库维护者可以使用 `@UnderMigration` 注解（在单独的构件 `kotlin-annotations-jvm` 中提供）来定义可空性类型限定符的迁移状态。

`@UnderMigration(status = ...)` 中的状态值指定编译器如何处理 Kotlin 中带注解的类型的不适当用法（例如，将 `@MyNullable` 注解的类型值用作非空值）：

* `MigrationStatus.STRICT` 使注解像任何普通的可空性注解一样工作，即报告不适当的用法中的错误，并影响注解声明中的类型，因为它们在 Kotlin 中可见
* `MigrationStatus.WARN`：不适当的用法被报告为编译警告而不是错误，但注解声明中的类型仍然是平台类型
* `MigrationStatus.IGNORE` 使编译器完全忽略可空性注解

库维护者可以将 `@UnderMigration` 状态添加到类型限定符昵称和类型限定符默认值：

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// 类中的类型是不可空的，但仅报告警告
// 因为 `@NonNullApi` 使用 `@UnderMigration(status = MigrationStatus.WARN)` 注解
@NonNullApi
public class Test {}
```

:::note
可空性注解的迁移状态不会被其类型限定符昵称继承，但会应用于其在默认类型限定符中的用法。

:::

如果默认类型限定符使用类型限定符昵称，并且它们都使用 `@UnderMigration`，则使用默认类型限定符中的状态。

#### 编译器配置

可以通过添加带有以下选项（及其组合）的 `-Xjsr305` 编译器标志来配置 JSR-305 检查：

* `-Xjsr305=\{strict|warn|ignore\}` 用于设置非 `@UnderMigration` 注解的行为。
自定义可空性限定符，尤其是
`@TypeQualifierDefault`，已经遍布许多众所周知的库，并且用户可能需要在更新到包含 JSR-305 支持的 Kotlin 版本时顺利迁移。 自 Kotlin 1.1.60 起，此标志仅影响非 `@UnderMigration` 注解。

* `-Xjsr305=under-migration:\{strict|warn|ignore\}` 用于覆盖 `@UnderMigration` 注解的行为。
用户可能对库的迁移状态有不同的看法：
他们可能希望在官方迁移状态为 `WARN` 时出现错误，反之亦然，
他们可能希望推迟某些错误的报告，直到他们完成迁移为止。

* `-Xjsr305=@<fq.name>:\{strict|warn|ignore\}` 用于覆盖单个注解的行为，其中 `<fq.name>`
是注解的完全限定类名。 对于不同的注解可能会出现多次。 这对于管理特定库的迁移状态很有用。

`strict`、`warn` 和 `ignore` 值与 `MigrationStatus` 的值具有相同的含义，
并且只有 `strict` 模式会影响注解声明中的类型，因为它们在 Kotlin 中可见。

:::note
注意：内置的 JSR-305 注解 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)、
[`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html) 和
[`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html) 始终启用并影响 Kotlin 中带注解的声明的类型，而与使用 `-Xjsr305` 标志的编译器配置无关。

:::

例如，将 `-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn` 添加到
编译器参数会使编译器为 `@org.library.MyNullable` 注解的类型的不适当用法生成警告，并忽略所有其他 JSR-305 注解。

默认行为与 `-Xjsr305=warn` 相同。
`strict` 值应被视为实验性的（将来可能会向其添加更多检查）。

## 映射类型

Kotlin 以特定的方式处理某些 Java 类型。这些类型不会从 Java 中 "按原样" 加载，而是 _映射_ 到相应的 Kotlin 类型。
映射仅在编译时重要，运行时表示保持不变。
 Java 的基本类型映射到相应的 Kotlin 类型（记住 [平台类型](#null-safety-and-platform-types)）：

| **Java 类型** | **Kotlin 类型**  |
|---------------|------------------|
| `byte`        | `kotlin.Byte`    |
| `short`       | `kotlin.Short`   |
| `int`         | `kotlin.Int`     |
| `long`        | `kotlin.Long`    |
| `char`        | `kotlin.Char`    |
| `float`       | `kotlin.Float`   |
| `double`      | `kotlin.Double`  |
| `boolean`     | `kotlin.Boolean` |

一些非基本内置类也被映射：

| **Java 类型** | **Kotlin 类型**  |
|---------------|------------------|
| `java.lang.Object`       | `kotlin.Any!`    |
| `java.lang.Cloneable`    | `kotlin.Cloneable!`    |
| `java.lang.Comparable`   | `kotlin.Comparable!`    |
| `java.lang.Enum`         | `kotlin.Enum!`    |
| `java.lang.annotation.Annotation`   | `kotlin.Annotation!`    |
| `java.lang.CharSequence` | `kotlin.CharSequence!`   |
| `java.lang.String`       | `kotlin.String!`   |
| `java.lang.Number`       | `kotlin.Number!`     |
| `java.lang.Throwable`    | `kotlin.Throwable!`    |

Java 的装箱基本类型映射到可空的 Kotlin 类型：

| **Java 类型**           | **Kotlin 类型**  |
|-------------------------|------------------|
| `java.lang.Byte`        | `kotlin.Byte?`   |
| `java.lang.Short`       | `kotlin.Short?`  |
| `java.lang.Integer`     | `kotlin.Int?`    |
| `java.lang.Long`        | `kotlin.Long?`   |
| `java.lang.Character`   | `kotlin.Char?`   |
| `java.lang.Float`       | `kotlin.Float?`  |
| `java.lang.Double`      | `kotlin.Double?`  |
| `java.lang.Boolean`     | `kotlin.Boolean?` |

请注意，用作类型参数的装箱基本类型映射到平台类型：
例如，`List<java.lang.Integer>` 在 Kotlin 中变为 `List<Int!>`。

集合类型在 Kotlin 中可能是只读的或可变的，因此 Java 的集合映射如下
（此表中的所有 Kotlin 类型都位于包 `kotlin.collections` 中）：

| **Java 类型** | **Kotlin 只读类型**  | **Kotlin 可变类型** | **加载的平台类型** |
|---------------|----------------------------|-------------------------|--------------------------|
| `Iterator<T>`        | `Iterator<T>`        | `MutableIterator<T>`            | `(Mutable)Iterator<T>!`            |
| `Iterable<T>`        | `Iterable<T>`        | `MutableIterable<T>`            | `(Mutable)Iterable<T>!`            |
| `Collection<T>`      | `Collection<T>`      | `MutableCollection<T>`          | `(Mutable)Collection<T>!`          |
| `Set<T>`             | `Set<T>`             | `MutableSet<T>`                 | `(Mutable)Set<T>!`                 |
| `List<T>`            | `List<T>`            | `MutableList<T>`                | `(Mutable)List<T>!`                |
| `ListIterator<T>`    | `ListIterator<T>`    | `MutableListIterator<T>`        | `(Mutable)ListIterator<T>!`        |
| `Map<K, V>`          | `Map<K, V>`          | `MutableMap<K, V>`              | `(Mutable)Map<K, V>!`              |
| `Map.Entry<K, V>`    | `Map.Entry<K, V>`    | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |

Java 的数组如 [下文](java-interop#java-arrays) 所述进行映射：

| **Java 类型** | **Kotlin 类型**                |
|---------------|--------------------------------|
| `int[]`       | `kotlin.IntArray!`             |
| `String[]`    | `kotlin.Array<(out) String!>!` |
:::note
Kotlin 类型的 [伴生对象](object-declarations#companion-objects) 上无法直接访问这些 Java 类型的静态成员。
要调用它们，请使用 Java 类型的完全限定名称，例如 `java.lang.Integer.toHexString(foo)`。

:::

## Kotlin 中的 Java 泛型

Kotlin 的泛型与 Java 的泛型略有不同（请参阅 [泛型](generics)）。
将 Java 类型导入 Kotlin 时，会执行以下转换：

* Java 的通配符转换为类型投影：
  * `Foo<? extends Bar>` 变为 `Foo<out Bar!>!`
  * `Foo<? super Bar>` 变为 `Foo<in Bar!>!`

* Java 的原始类型转换为星号投影：
  * `List` 变为 `List<*>!`，即 `List<out Any?>!`

与 Java 一样，Kotlin 的泛型不会在运行时保留：对象不携带传递给其构造函数的实际类型参数的信息。
例如，`ArrayList<Integer>()` 与 `ArrayList<Character>()` 无法区分。
这使得无法执行考虑泛型的 `is` 检查。
Kotlin 只允许对星号投影的泛型类型进行 `is` 检查：

```kotlin
if (a is List<Int>) // 错误：无法检查它是否真的是 Ints 的 List
// 但是
if (a is List<*>) // 好的：不保证列表的内容
```

## Java 数组

Kotlin 中的数组是不变的，这与 Java 不同。这意味着 Kotlin 不允许您将 `Array<String>` 分配给 `Array<Any>`，
这可以防止可能的运行时故障。禁止将子类的数组作为超类的数组传递给 Kotlin 方法，
但对于 Java 方法，这可以通过 `Array<(out) String>!` 形式的 [平台类型](#null-safety-and-platform-types) 来实现。

数组与 Java 平台上的基本数据类型一起使用，以避免装箱/拆箱操作的成本。
由于 Kotlin 隐藏了这些实现细节，因此需要一种解决方法来与 Java 代码进行交互。
每种类型的基本数组都有专门的类（`IntArray`、`DoubleArray`、`CharArray` 等）来处理这种情况。
它们与 `Array` 类无关，并且被编译为 Java 的基本数组，以获得最大的性能。

假设有一个 Java 方法接受一个 int 类型的索引数组：

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

要传递基本类型值的数组，您可以在 Kotlin 中执行以下操作：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // 将 int[] 传递给方法
```

当编译为 JVM 字节码时，编译器会优化对数组的访问，因此不会引入任何开销：

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // 没有生成对 get() 和 set() 的实际调用
for (x in array) { // 没有创建迭代器
    print(x)
}
```

即使您使用索引进行导航，也不会引入任何开销：

```kotlin
for (i in array.indices) { // 没有创建迭代器
    array[i] += 2
}
```

最后，`in` 检查也没有任何开销：

```kotlin
if (i in array.indices) { // 与 (i >= 0 && i < array.size) 相同
    print(array[i])
}
```

## Java 可变参数

Java 类有时使用带有可变数量参数 (varargs) 的索引方法声明：

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

在这种情况下，您需要使用展开运算符 `*` 来传递 `IntArray`：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## 运算符

由于 Java 无法标记适合使用运算符语法的方法，因此 Kotlin 允许将任何具有正确名称和签名（`invoke()` 等）的 Java 方法用作运算符重载和其他约定。不允许使用中缀调用语法调用 Java 方法。

## 受检异常

在 Kotlin 中，所有 [异常都是未受检的](exceptions)，这意味着编译器不会强制您捕获任何异常。
因此，当您调用声明了受检异常的 Java 方法时，Kotlin 不会强制您执行任何操作：

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java 会要求我们在此处捕获 IOException
    }
}
```

## 对象方法

当 Java 类型导入到 Kotlin 中时，类型 `java.lang.Object` 的所有引用都将转换为 `Any`。
由于 `Any` 不是平台特定的，因此它仅声明 `toString()`、`hashCode()` 和 `equals()` 作为其成员，
因此为了使 `java.lang.Object` 的其他成员可用，Kotlin 使用 [扩展函数](extensions)。

### wait()/notify()

方法 `wait()` 和 `notify()` 在类型 `Any` 的引用上不可用。通常不鼓励使用它们
而推荐使用 `java.util.concurrent`。如果您确实需要调用这些方法，则可以转换为 `java.lang.Object`：

```kotlin
(foo as java.lang.Object).wait()
```

### getClass()

要检索对象的 Java 类，请在 [类引用](reflection#class-references) 上使用 `java` 扩展属性：

```kotlin
val fooClass = foo::class.java
```

上面的代码使用 [绑定类引用](reflection#bound-class-references)。您也可以使用 `javaClass` 扩展属性：

```kotlin
val fooClass = foo.javaClass
```

### clone()

要重写 `clone()`，您的类需要扩展 `kotlin.Cloneable`：

```kotlin
class Example : Cloneable {
    override fun clone(): Any { ... }
}
```

不要忘记 [Effective Java, 3rd Edition](https://www.oracle.com/technetwork/java/effectivejava-136174.html),
Item 13: *谨慎地重写 clone*。

### finalize()

要重写 `finalize()`，您只需声明它，而无需使用 `override` 关键字：

```kotlin
class C {
    protected fun finalize() {
        // 终结逻辑
    }
}
```

根据 Java 的规则，`finalize()` 不得为 `private`。

## 从 Java 类继承

最多一个 Java 类（以及任意数量的 Java 接口）可以是 Kotlin 中类的超类型。

## 访问静态成员

Java 类的静态成员形成这些类的“伴生对象”。您不能将这样的“伴生对象”作为值传递，但可以显式访问成员，例如：

```kotlin
if (Character.isLetter(a)) { ... }
```

要访问 [映射](#mapped-types) 到 Kotlin 类型的 Java 类型的静态成员，请使用 Java 类型的完全限定名称：`java.lang.Integer.bitCount(foo)`。

## Java 反射

Java 反射适用于 Kotlin 类，反之亦然。如上所述，您可以使用 `instance::class.java`、
`ClassName::class.java` 或 `instance.javaClass` 通过 `java.lang.Class` 进入 Java 反射。
不要为此目的使用 `ClassName.javaClass`，因为它指的是 `ClassName` 的伴生对象类，
它与 `ClassName.Companion::class.java` 相同，而不是 `ClassName::class.java`。

对于每种基本类型，都有两个不同的 Java 类，Kotlin 提供了获取这两者的方法。例如，
`Int::class.java` 将返回表示基本类型本身的类实例，
对应于 Java 中的 `Integer.TYPE`。要获取相应包装器类的类，请使用
`Int::class.javaObjectType`，它等效于 Java 的 `Integer.class`。

支持的其他情况包括获取 Kotlin 属性的 Java getter/setter 方法或后备字段，Java 字段的 `KProperty`，Java 方法或构造函数对应于 `KFunction`，反之亦然。

## SAM 转换

Kotlin 支持 Java 和 [Kotlin 接口](fun-interfaces) 的 SAM 转换。
对 Java 的这种支持意味着 Kotlin 函数字面量可以自动转换为
具有单个非默认方法的 Java 接口的实现，只要接口方法的参数类型
与 Kotlin 函数的参数类型匹配即可。

您可以使用它来创建 SAM 接口的实例：

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

...以及在方法调用中：

```kotlin
val executor = ThreadPoolExecutor()
// Java 签名：void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

如果 Java 类有多个接受函数式接口的方法，您可以通过
使用将 lambda 转换为特定 SAM 类型的适配器函数来选择需要调用的方法。那些适配器函数也是
在需要时由编译器生成的：

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

:::note
SAM 转换仅适用于接口，而不适用于抽象类，即使那些抽象类也只有一个
抽象方法。

:::

## 将