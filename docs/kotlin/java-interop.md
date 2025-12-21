[//]: # (title: 从 Kotlin 调用 Java)

Kotlin 的设计考虑了 Java 互操作性。现有的 Java 代码可以很自然地从 Kotlin 中调用，Kotlin 代码也可以相当流畅地从 Java 中使用。本节将详细介绍从 Kotlin 调用 Java 代码的一些细节。

几乎所有的 Java 代码都可以毫无问题地使用：

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 'for' 循环适用于 Java 集合：
    for (item in source) {
        list.add(item)
    }
    // 操作符约定也同样适用：
    for (i in 0..source.size - 1) {
        list[i] = source[i] // 调用 get 和 set
    }
}
```

## Getters 和 setters

遵循 Java getter 和 setter 约定的方法（无实参且名称以 `get` 开头的方法，以及单个实参且名称以 `set` 开头的方法）在 Kotlin 中表示为属性。此类属性也称为 _合成属性_。`Boolean` 访问器方法（其中 getter 的名称以 `is` 开头，setter 的名称以 `set` 开头）表示为与 getter 方法同名的属性。

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

上述 `calendar.firstDayOfWeek` 是合成属性的一个示例。

请注意，如果 Java 类只包含一个 setter，则它在 Kotlin 中不会显示为属性，因为 Kotlin 不支持仅有 setter 的属性。

## Java 合成属性引用

> 此特性是 [实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。我们建议您仅将其用于求值目的。
>
{style="warning"}

从 Kotlin 1.8.20 开始，你可以创建对 Java 合成属性的引用。考虑以下 Java 代码：

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

Kotlin 一直允许你编写 `person.age`，其中 `age` 是一个合成属性。现在，你还可以创建对 `Person::age` 和 `person::age` 的引用。`name` 也适用同样的情况。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // 调用对 Java 合成属性的引用：
        .sortedBy(Person::age)
         // 通过 Kotlin 属性语法调用 Java getter：
        .forEach { person -> println(person.name) }
```

### 如何启用 Java 合成属性引用 {initial-collapse-state="collapsed" collapsible="true"}

要启用此特性，请设置 `-language-version 2.1` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 中来完成：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion
            = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
}
```

</tab>
</tabs>

> 在 Kotlin 1.9.0 之前，要启用此特性，你需要设置 `-language-version 1.9` 编译器选项。
>
{style="note"}

## 返回 void 的方法

如果 Java 方法返回 `void`，则从 Kotlin 调用时它将返回 `Unit`。如果有人使用了该返回值，Kotlin 编译器将在调用处为其赋值，因为该值本身是预先已知的（即 `Unit`）。

## 转义 Kotlin 关键字的 Java 标识符

一些 Kotlin 关键字在 Java 中是有效的标识符：`in`、`object`、`is` 等。如果 Java 库使用 Kotlin 关键字作为方法名，你仍然可以使用反引号（`）字符将其转义来调用该方法：

```kotlin
foo.`is`(bar)
```

## 空安全和平台类型

Java 中的任何引用都可能是 `null`，这使得 Kotlin 严格的空安全要求对于来自 Java 的对象来说不切实际。Java 声明的类型在 Kotlin 中以特定方式处理，并称为 *平台类型*。对于此类类型，空检测会放宽，因此它们的安全性保证与 Java 中相同（详见[下文](#mapped-types)）。

考虑以下示例：

```kotlin
val list = ArrayList<String>() // 非空的（构造函数结果）
list.add("Item")
val size = list.size // 非空的（原生 int）
val item = list[0] // 推断为平台类型（普通 Java 对象）
```

当你调用平台类型变量上的方法时，Kotlin 不会在编译期发出空性错误，但调用可能会在运行时失败，因为出现空指针异常或 Kotlin 为防止空值传播而生成的断言：

```kotlin
item.substring(1) // 允许，如果 item == null 则抛出异常
```

平台类型是*不可表示的*，这意味着你无法在语言中显式地写下它们。当平台值被赋值给 Kotlin 变量时，你可以依赖类型推断（变量将具有推断的平台类型，如上例中的 `item`），或者你可以选择你期望的类型（允许可空和非空类型）：

```kotlin
val nullable: String? = item // 允许，始终有效
val notNull: String = item // 允许，可能在运行时失败
```

如果你选择非空类型，编译器将在赋值时发出断言。这可以防止 Kotlin 的非空变量持有空值。当你将平台值传递给期望非空值的 Kotlin 函数以及其他情况下，也会发出断言。总的来说，编译器会尽力防止空值在程序中传播太远，尽管有时由于泛型，这不可能完全消除。

### 平台类型的表示法

如上所述，平台类型无法在程序中显式提及，因此语言中没有它们的语法。尽管如此，编译器和 IDE 有时需要显示它们（例如，在错误消息或参数信息中），因此存在一种助记符表示法：

*   `T!` 表示 "`T` 或 `T?`"，
*   `(Mutable)Collection<T>!` 表示 "Java 集合的 `T` 可能可变也可能不可变，可能可空也可能不可空"，
*   `Array<(out) T>!` 表示 "Java 数组的 `T`（或 `T` 的子类型），可空或不可空"

### 可空性注解

带有可空性注解的 Java 类型不会表示为平台类型，而是表示为实际可空或非空的 Kotlin 类型。编译器支持多种可空性注解，包括：

*   [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html) (`@Nullable` 和 `@NotNull` 来自 `org.jetbrains.annotations` 包)
*   [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`)
*   Android (`com.android.annotations` 和 `android.support.annotations`)
*   JSR-305 (`javax.annotation`，详见下文)
*   FindBugs (`edu.umd.cs.findbugs.annotations`)
*   Eclipse (`org.eclipse.jdt.annotation`)
*   Lombok (`lombok.NonNull`)
*   RxJava 3 (`io.reactivex.rxjava3.annotations`)

你可以根据来自特定类型的可空性注解信息，指定编译器是否报告可空性不匹配。使用编译器选项 `-Xnullability-annotations=@<package-name>:<report-level>`。在实参中，指定完全限定的可空性注解包名和以下报告级别之一：
*   `ignore` 忽略可空性不匹配
*   `warn` 报告警告
*   `strict` 报告错误。

有关支持的可空性注解的完整列表，请参见 [Kotlin 编译器源代码](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt)。

### 注解类型实参和类型形参

你还可以注解泛型类型的类型实参和类型形参，以便为它们提供可空性信息。

> 本节中的所有示例都使用 `org.jetbrains.annotations` 包中的 JetBrains 可空性注解。
>
{style="note"}

#### 类型实参

考虑 Java 声明上的这些注解：

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

它们在 Kotlin 中会产生以下签名：

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

当类型实参缺少 `@NotNull` 注解时，你将获得平台类型：

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlin 还会考虑基类和接口的类型实参上的可空性注解。例如，有两个 Java 类，其签名如下：

```java
public class Base<T> {}
```

```java
public class Derived extends Base<@Nullable String> {}
```

在 Kotlin 代码中，将 `Derived` 实例传递到假定 `Base<String>` 的地方会产生警告。

```kotlin
fun takeBaseOfNotNullStrings(x: Base<String>) {}

fun main() {
    takeBaseOfNotNullStrings(Derived()) // warning: nullability mismatch
}
```

`Derived` 的上界设置为 `Base<String?>`，这与 `Base<String>` 不同。

了解更多关于 [Kotlin 中的 Java 泛型](#java-generics-in-kotlin)。

#### 类型形参

默认情况下，Kotlin 和 Java 中普通类型形参的可空性是未定义的。在 Java 中，你可以使用可空性注解来指定它。让我们注解 `Base` 类的类型形参：

```java
public class Base<@NotNull T> {}
```

当从 `Base` 继承时，Kotlin 期望一个非空的类型实参或类型形参。因此，以下 Kotlin 代码会产生警告：

```kotlin
class Derived<K> : Base<K> {} // warning: K has undefined nullability
```

你可以通过指定上界 `K : Any` 来修复它。

Kotlin 还支持 Java 类型形参的边界上的可空性注解。让我们为 `Base` 添加边界：

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlin 将其翻译如下：

```kotlin
class BaseWithBound<T : Number> {}
```

因此，将可空类型作为类型实参或类型形参传递会产生警告。

注解类型实参和类型形参适用于 Java 8 或更高版本。此特性要求可空性注解支持 `TYPE_USE` 目标（`org.jetbrains.annotations` 在版本 15 及更高版本中支持此功能）。

> 如果可空性注解支持除 `TYPE_USE` 目标外还适用于类型的其他目标，则 `TYPE_USE` 具有优先权。例如，如果 `@Nullable` 同时具有 `TYPE_USE` 和 `METHOD` 目标，则 Java 方法签名 `@Nullable String[] f()` 在 Kotlin 中变为 `fun f(): Array<String?>!`。
>
{style="note"}

### JSR-305 支持

[JSR-305](https://jcp.org/en/jsr/detail?id=305) 中定义的 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html) 注解支持用于表示 Java 类型的可空性。

如果 `@Nonnull(when = ...)` 的值为 `When.ALWAYS`，则被注解的类型被视为非空的；`When.MAYBE` 和 `When.NEVER` 表示可空类型；`When.UNKNOWN` 则强制类型为[平台类型](#null-safety-and-platform-types)。

库可以针对 JSR-305 注解进行编译，但无需将注解构件（例如 `jsr305.jar`）作为库使用者的编译依赖项。Kotlin 编译器可以在不依赖类路径中注解的情况下从库中读取 JSR-305 注解。

[自定义可空性限定符 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers.md) 也受支持（见下文）。

#### 类型限定符别名

如果注解类型同时被 [`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html) 和 JSR-305 `@Nonnull`（或其另一个别名，例如 `@CheckForNull`）注解，则该注解类型本身用于检索精确的可空性，并具有与该可空性注解相同的含义：

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // 另一个类型限定符别名的别名
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

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html) 允许引入注解，当应用时，这些注解定义了被注解元素作用域内的默认可空性。

此类注解类型本身应该同时被 `@Nonnull`（或其别名）和 `@TypeQualifierDefault(...)` 注解，并带有一个或多个 `ElementType` 值：

*   `ElementType.METHOD` 用于方法的返回类型
*   `ElementType.PARAMETER` 用于值形参
*   `ElementType.FIELD` 用于字段
*   `ElementType.TYPE_USE` 用于任何类型，包括类型实参、类型形参的上界和通配符类型

当类型本身没有被可空性注解时，将使用默认可空性，默认值由最内层封闭元素确定，该元素被带有一个类型限定符默认注解，并且其 `ElementType` 与类型用法匹配。

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

    // 由于 `@NullableApi` 具有 `TYPE_USE` 元素类型，List<String> 类型实参被视为可空：
    String baz(List<String> x); // fun baz(List<String?>?): String?

    // `x` 形参的类型仍然是平台类型，因为存在显式标记为 UNKNOWN 的可空性注解：
    String qux(@Nonnull(when = When.UNKNOWN) String x); // fun baz(x: String!): String?
}
```

> 此示例中的类型仅在严格模式启用时才生效；否则，平台类型保持不变。请参阅 [`@UnderMigration` 注解](#undermigration-annotation) 和 [编译器配置](#compiler-configuration) 部分。
>
{style="note"}

也支持包级别默认可空性：

```java
// FILE: test/package-info.java
@NonNullApi // 默认将包 'test' 中的所有类型声明为非空的
package test;
```

#### @UnderMigration 注解

`@UnderMigration` 注解（在单独的构件 `kotlin-annotations-jvm` 中提供）可供库维护者用于定义可空性类型限定符的迁移状态。

`@UnderMigration(status = ...)` 中的 status 值指定了编译器如何处理 Kotlin 中被注解类型的不当用法（例如，将 `@MyNullable` 注解类型的值用作非空）：

*   `MigrationStatus.STRICT` 使注解像任何普通的可空性注解一样工作，即报告不当用法的错误，并影响 Kotlin 中被注解声明中的类型
*   `MigrationStatus.WARN`：不当用法作为编译警告而不是错误报告，但被注解声明中的类型仍为平台类型
*   `MigrationStatus.IGNORE` 使编译器完全忽略可空性注解

库维护者可以将 `@UnderMigration` 状态添加到类型限定符别名和类型限定符默认值中：

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// 类中的类型是非空的，但仅报告警告
// 因为 `@NonNullApi` 被注解为 `@UnderMigration(status = MigrationStatus.WARN)`
@NonNullApi
public class Test {}
```

> 可空性注解的迁移状态不会被其类型限定符别名继承，但会应用于其在默认类型限定符中的用法。
>
{style="note"}

如果默认类型限定符使用类型限定符别名，并且它们都处于 `@UnderMigration` 状态，则使用默认类型限定符的状态。

#### 编译器配置

JSR-305 检测可以通过添加 `-Xjsr305` 编译器标志并带以下选项（及其组合）进行配置：

*   `-Xjsr305={strict|warn|ignore}` 用于设置非 `@UnderMigration` 注解的行为。自定义可空性限定符，特别是 `@TypeQualifierDefault`，已广泛应用于许多知名库中，用户在更新到包含 JSR-305 支持的 Kotlin 版本时可能需要平稳迁移。自 Kotlin 1.1.60 起，此标志仅影响非 `@UnderMigration` 注解。

*   `-Xjsr305=under-migration:{strict|warn|ignore}` 用于覆盖 `@UnderMigration` 注解的行为。用户可能对库的迁移状态有不同的看法：他们可能希望在官方迁移状态为 `WARN` 时出现错误，反之，他们可能希望将某些错误的报告推迟到完成迁移之后。

*   `-Xjsr305=@<fq.name>:{strict|warn|ignore}` 用于覆盖单个注解的行为，其中 `<fq.name>` 是注解的完全限定类名。可以为不同的注解出现多次。这对于管理特定库的迁移状态很有用。

`strict`、`warn` 和 `ignore` 值具有与 `MigrationStatus` 相同的含义，并且只有 `strict` 模式会影响 Kotlin 中被注解声明中的类型。

> 注意：内置的 JSR-305 注解 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)、[`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html) 和 [`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html) 始终启用，并影响 Kotlin 中被注解声明的类型，无论 `-Xjsr305` 标志的编译器配置如何。
>
{style="note"}

例如，将 `-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn` 添加到编译器实参中，会使编译器对 `@org.library.MyNullable` 注解类型的不当用法生成警告，并忽略所有其他 JSR-305 注解。

默认行为与 `-Xjsr305=warn` 相同。`strict` 值应被视为实验性的（将来可能会添加更多检测）。

## 映射类型

Kotlin 对某些 Java 类型进行了特殊处理。这些类型不会“原样”从 Java 加载，而是*映射*到相应的 Kotlin 类型。此映射仅在编译期有意义，运行时表示保持不变。Java 的原生类型映射到相应的 Kotlin 类型（请记住[平台类型](#null-safety-and-platform-types)）：

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

一些非原生内置类也被映射：

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

Java 的包装原生类型映射到可空的 Kotlin 类型：

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

请注意，用作类型形参的包装原生类型会映射到平台类型：例如，`List<java.lang.Integer>` 在 Kotlin 中变为 `List<Int!>`。

集合类型在 Kotlin 中可以是只读的或可变的，因此 Java 的集合映射如下（此表中的所有 Kotlin 类型都位于 `kotlin.collections` 包中）：

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

Java 的数组映射如下文[所述](#java-arrays)：

| **Java 类型** | **Kotlin 类型**                |
|---------------|--------------------------------|
| `int[]`       | `kotlin.IntArray!`             |
| `String[]`    | `kotlin.Array<(out) String!>!` |

> 这些 Java 类型的静态成员无法直接访问 Kotlin 类型的[伴生对象](object-declarations.md#companion-objects)。要调用它们，请使用 Java 类型的完全限定名称，例如 `java.lang.Integer.toHexString(foo)`。
>
{style="note"}

## Kotlin 中的 Java 泛型

Kotlin 的泛型与 Java 的略有不同（请参见[泛型](generics.md)）。将 Java 类型导入到 Kotlin 时，会进行以下转换：

*   Java 的通配符转换为类型投影：
    *   `Foo<? extends Bar>` 变为 `Foo<out Bar!>!`
    *   `Foo<? super Bar>` 变为 `Foo<in Bar!>!`

*   Java 的原始类型转换为星投影：
    *   `List` 变为 `List<*>!`，即 `List<out Any?>!`

与 Java 类似，Kotlin 的泛型在运行时不会保留：对象不携带关于传递给其构造函数的实际类型实参的信息。例如，`ArrayList<Integer>()` 与 `ArrayList<Character>()` 是无法区分的。这使得执行考虑泛型的 `is` 检测成为不可能。Kotlin 只允许对星投影泛型类型进行 `is` 检测：

```kotlin
if (a is List<Int>) // 错误：无法检测它是否真的是 List<Int>
// 但是
if (a is List<*>) // OK：不保证列表内容
```

## Java 数组

Kotlin 中的数组是不变型的，这与 Java 不同。这意味着 Kotlin 不允许你将 `Array<String>` 赋值给 `Array<Any>`，这可以防止可能的运行时失败。将子类数组作为超类数组传递给 Kotlin 方法也是禁止的，但对于 Java 方法，通过 `Array<(out) String>!` 形式的[平台类型](#null-safety-and-platform-types)是允许的。

Java 平台上的原生数据类型数组被使用以避免装箱/拆箱操作的开销。由于 Kotlin 隐藏了这些实现细节，因此需要一种变通方法来与 Java 代码进行接口。每种原生数组类型都有专门的类（`IntArray`、`DoubleArray`、`CharArray` 等）来处理这种情况。它们与 `Array` 类无关，并被编译为 Java 的原生数组以实现最佳性能。

假设有一个 Java 方法接受一个 int 数组作为索引：

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

要在 Kotlin 中传递原生值数组，你可以这样做：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // 将 int[] 传递给方法
```

编译为 JVM 字节码时，编译器会优化数组访问，因此不会引入任何开销：

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // 没有实际生成对 get() 和 set() 的调用
for (x in array) { // 没有创建迭代器
    print(x)
}
```

即使你使用索引导航，它也不会引入任何开销：

```kotlin
for (i in array.indices) { // 没有创建迭代器
    array[i] += 2
}
```

最后，`in` 检测也没有开销：

```kotlin
if (i in array.indices) { // 等同于 (i >= 0 && i < array.size)
    print(array[i])
}
```

## Java 可变参数

Java 类有时会使用带有可变数量实参（varargs）的索引方法声明：

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

在这种情况下，你需要使用展开操作符 `*` 来传递 `IntArray`：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## 操作符

由于 Java 无法标记哪些方法适合使用操作符语法，Kotlin 允许将任何具有正确名称和签名的 Java 方法用作操作符重载和其他约定（如 `invoke()` 等）。不允许使用中缀调用语法调用 Java 方法。

## 受检异常

在 Kotlin 中，所有[异常都是非受检的](exceptions.md)，这意味着编译器不会强制你捕获任何异常。因此，当你调用声明了受检异常的 Java 方法时，Kotlin 不会强制你做任何事情：

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java 在此处会要求我们捕获 IOException
    }
}
```

## Object 方法

当 Java 类型导入到 Kotlin 时，所有 `java.lang.Object` 类型的引用都转换为 `Any`。由于 `Any` 不是平台特有的，它只声明 `toString()`、`hashCode()` 和 `equals()` 作为其成员，因此为了使 `java.lang.Object` 的其他成员可用，Kotlin 使用了[扩展函数](extensions.md)。

### wait()/notify()

`wait()` 和 `notify()` 方法在 `Any` 类型的引用上不可用。通常不建议使用它们，而推荐使用 `java.util.concurrent`。

如果你确实需要调用这些方法，可以通过 Java 对象访问它们，并抑制 `PLATFORM_CLASS_MAPPED_TO_KOTLIN` 警告：

```kotlin
import java.util.LinkedList

class SimpleBlockingQueue<T>(private val capacity: Int) {
    private val queue = LinkedList<T>()

    // java.lang.Object is used specifically to access wait() and notify()
    // In Kotlin, the standard 'Any' type does not expose these methods.
    @Suppress("PLATFORM_CLASS_MAPPED_TO_KOTLIN")
    private val lock = Object()

    fun put(item: T) {
        synchronized(lock) {
            while (queue.size >= capacity) {
                lock.wait()
            }
            queue.add(item)
            println("Produced: $item")

            lock.notifyAll()
        }
    }

    fun take(): T {
        synchronized(lock) {
            while (queue.isEmpty()) {
                lock.wait()
            }
            val item = queue.removeFirst()
            println("Consumed: $item")

            lock.notifyAll()
            return item
        }
    }
}
```

或者显式转换为 `java.lang.Object` 并抑制 `PLATFORM_CLASS_MAPPED_TO_KOTLIN` 警告：

```kotlin
@Suppress("PLATFORM_CLASS_MAPPED_TO_KOTLIN")
(foo as java.lang.Object).wait()
```

### getClass()

要检索对象的 Java 类，请在[类引用](reflection.md#class-references)上使用 `java` 扩展属性：

```kotlin
val fooClass = foo::class.java
```

上面的代码使用了[绑定类引用](reflection.md#bound-class-references)。你也可以使用 `javaClass` 扩展属性：

```kotlin
val fooClass = foo.javaClass
```

### clone()

要覆盖 `clone()`，你的类需要扩展 `kotlin.Cloneable`：

```kotlin
class Example : Cloneable {
    override fun clone(): Any { ... }
}
```

不要忘记[《Effective Java，第 3 版》](https://www.oracle.com/technetwork/java/effectivejava-136174.html)中的第 13 条：*明智地覆盖 clone*。

### finalize()

要覆盖 `finalize()`，你只需声明它，而无需使用 `override` 关键字：

```kotlin
class C {
    protected fun finalize() {
        // 终结逻辑
    }
}
```

根据 Java 的规则，`finalize()` 不得为 `private`。

## 继承 Java 类

一个 Kotlin 类最多只能有一个 Java 类作为超类型（以及任意数量的 Java 接口）。

## 访问静态成员

Java 类的静态成员构成了这些类的“伴生对象”。你不能将此类“伴生对象”作为值传递，但可以显式访问其成员，例如：

```kotlin
if (Character.isLetter(a)) { ... }
```

要访问[映射](#mapped-types)到 Kotlin 类型的 Java 类型的静态成员，请使用 Java 类型的完全限定名称：`java.lang.Integer.bitCount(foo)`。

## Java 反射

Java 反射适用于 Kotlin 类，反之亦然。如上所述，你可以使用 `instance::class.java`、`ClassName::class.java` 或 `instance.javaClass` 进入 Java 反射，通过 `java.lang.Class`。不要将 `ClassName.javaClass` 用于此目的，因为它引用的是 `ClassName` 的伴生对象类，这与 `ClassName.Companion::class.java` 相同，而非 `ClassName::class.java`。

对于每种原生类型，都有两个不同的 Java 类，Kotlin 提供了获取两者的方法。例如，`Int::class.java` 将返回表示原生类型本身的类实例，这对应于 Java 中的 `Integer.TYPE`。要获取相应包装器类型的类，请使用 `Int::class.javaObjectType`，这等效于 Java 的 `Integer.class`。

其他支持的场景包括获取 Kotlin 属性的 Java getter/setter 方法或幕后字段，Java 字段的 `KProperty`，Java 方法或构造函数的 `KFunction`，反之亦然。

## SAM 转换

Kotlin 支持 Java 和 [Kotlin 接口](fun-interfaces.md)的 SAM 转换。对 Java 的此支持意味着 Kotlin 函数字面值可以自动转换为具有单个非默认方法的 Java 接口的实现，只要接口方法的形参类型与 Kotlin 函数的形参类型匹配。

你可以使用此功能创建 SAM 接口的实例：

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

……并在方法调用中使用：

```kotlin
val executor = ThreadPoolExecutor()
// Java 签名：void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

如果 Java 类有多个接受函数式接口的方法，你可以通过使用将 lambda 转换为特定 SAM 类型的适配器函数来选择你需要调用的方法。这些适配器函数也会在需要时由编译器生成：

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

> SAM 转换仅适用于接口，不适用于抽象类，即使这些抽象类也只有一个抽象方法。
>
{style="note"}

## 在 Kotlin 中使用 JNI

要声明一个在原生 (C 或 C++) 代码中实现的函数，你需要用 `external` 修饰符标记它：

```kotlin
external fun foo(x: Int): Double
```

其余过程与 Java 中的完全相同。

你还可以将属性的 getter 和 setter 标记为 `external`：

```kotlin
var myProperty: String
    external get
    external set
```

在幕后，这将创建两个函数 `getMyProperty` 和 `setMyProperty`，两者都被标记为 `external`。

## 在 Kotlin 中使用 Lombok 生成的声明

你可以在 Kotlin 代码中使用 Java 的 Lombok 生成的声明。如果你需要在同一个混合 Java/Kotlin 模块中生成和使用这些声明，你可以在 [Lombok 编译器插件页面](lombok.md)上了解如何操作。如果你从另一个模块调用此类声明，则无需使用此插件来编译该模块。