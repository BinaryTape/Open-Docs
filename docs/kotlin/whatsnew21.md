[//]: # (title: Kotlin 2.1.0 有哪些新特性)

_[发布日期：2024 年 11 月 27 日](releases.md#release-details)_

Kotlin 2.1.0 版本现已发布！以下是主要亮点：

*   **新的语言特性抢先体验预览**：[带主题的 `when` 表达式中的守卫条件](#guard-conditions-in-when-with-a-subject)、
    [非局部 `break` 和 `continue`](#non-local-break-and-continue)，以及[多美元符号字符串内插](#multi-dollar-string-interpolation)。
*   **K2 编译器更新**：[编译器检测方面更大的灵活性](#extra-compiler-checks)以及 [kapt 实现的改进](#improved-k2-kapt-implementation)。
*   **Kotlin Multiplatform**：引入了 [Swift 导出基础支持](#basic-support-for-swift-export)，
    [适用于编译器选项的稳定 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable) 等。
*   **Kotlin/Native**：[改进了对 `iosArm64` 的支持](#iosarm64-promoted-to-tier-1)及其他更新。
*   **Kotlin/Wasm**：多项更新，包括[对增量编译的支持](#support-for-incremental-compilation)。
*   **Gradle 支持**：[改进了与更新版 Gradle 和 Android Gradle 插件的兼容性](#gradle-improvements)，
    同时[更新了 Kotlin Gradle 插件 API](#new-api-for-kotlin-gradle-plugin-extensions)。
*   **文档**：[Kotlin 文档的显著改进](#documentation-updates)。

## IDE 支持

支持 2.1.0 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
你无需在 IDE 中更新 Kotlin 插件。
你只需在构建脚本中将 Kotlin 版本更改为 2.1.0 即可。

关于详情，请参见 [更新到新的 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

在发布包含 K2 编译器的 Kotlin 2.0.0 之后，JetBrains 团队正致力于通过新特性来改进语言。
在此版本中，我们很高兴地宣布几项新的语言设计改进。

这些特性已在抢先体验预览中提供，我们鼓励你尝试并分享你的反馈：

*   [带主题的 `when` 表达式中的守卫条件](#guard-conditions-in-when-with-a-subject)
*   [非局部 `break` 和 `continue`](#non-local-break-and-continue)
*   [多美元符号内插：改进了字符串字面值中 `$ ` 的处理](#multi-dollar-string-interpolation)

> 所有特性均已在最新 2024.3 版 IntelliJ IDEA 中提供 IDE 支持，且 K2 模式已启用。
>
> 欲了解更多，请参阅 [IntelliJ IDEA 2024.3 博客文章](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/)。
>
{style="tip"}

[查看 Kotlin 语言设计特性与提案的完整列表](kotlin-language-features-and-proposals.md)。

此版本还带来了以下语言更新：

*   [](#support-for-requiring-opt-in-to-extend-apis)
*   [](#improved-overload-resolution-for-functions-with-generic-types)
*   [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### 带主题的 `when` 表达式中的守卫条件

> 此特性为[抢先体验预览](kotlin-evolution-principles.md#pre-stable-features)特性，
> 需要显式选择加入（详见下文）。
>
> 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140) 中提供你的反馈。
>
{style="warning"}

从 2.1.0 开始，你可以在带主题的 `when` 表达式或语句中使用守卫条件。

守卫条件允许你为 `when` 表达式的分支包含多个条件，
使复杂的控制流更加显式和简洁，并扁平化代码结构。

要在分支中包含守卫条件，请将其置于主条件之后，用 `if` 分隔：

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal {
        fun feedCat() {}
    }

    data class Dog(val breed: String) : Animal {
        fun feedDog() {}
    }
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // Branch with only the primary condition. Calls `feedDog()` when `animal` is `Dog`
        is Animal.Dog -> animal.feedDog()
        // Branch with both primary and guard conditions. Calls `feedCat()` when `animal` is `Cat` and is not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter -> animal.feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else -> println("Unknown animal")
    }
}
```

在一个 `when` 表达式中，你可以组合包含守卫条件和不含守卫条件的分支。
包含守卫条件的分支中的代码仅当主条件和守卫条件都为 `true` 时才会运行。
如果主条件不匹配，则不会求值守卫条件。
此外，守卫条件支持 `else if`。

要在你的项目中启用守卫条件，请在命令行中使用以下编译器选项：

```bash
kotlinc -Xwhen-guards main.kt
```

或者将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 非局部 `break` 和 `continue`

> 此特性为[抢先体验预览](kotlin-evolution-principles.md#pre-stable-features)特性，
> 需要显式选择加入（详见下文）。
>
> 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 中提供你的反馈。
>
{style="warning"}

Kotlin 2.1.0 添加了另一个期待已久的特性预览：使用非局部 `break` 和 `continue` 的能力。
此特性扩展了你在内联函数作用域内可以使用的工具集，并减少了项目中的样板代码。

以前，你只能使用非局部返回。
现在，Kotlin 还支持非局部 `break` 和 `continue` [跳转表达式](returns.md)。
这意味着你可以将它们应用于作为参数传递给包含循环的内联函数的 lambda 表达式中：

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true // If variable is zero, return true
    }
    return false
}
```

要在你的项目中尝试此特性，请在命令行中使用 `-Xnon-local-break-continue` 编译器选项：

```bash
kotlinc -Xnon-local-break-continue main.kt
```

或者将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

我们计划在未来的 Kotlin 版本中将此特性稳定化。
如果你在使用非局部 `break` 和 `continue` 时遇到任何问题，
请向我们的[问题跟踪器](https://youtrack.jetbrains.com/issue/KT-1436)报告。

### 多美元符号字符串内插

> 此特性为[抢先体验预览](kotlin-evolution-principles.md#pre-stable-features)特性，
> 需要显式选择加入（详见下文）。
>
> 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 中提供你的反馈。
>
{style="warning"}

Kotlin 2.1.0 引入了对多美元符号字符串内插的支持，
改进了字符串字面值中美元符号 (`$`) 的处理方式。
此特性在需要多个美元符号的上下文（例如模板引擎、JSON schema 或其他数据格式）中非常有用。

Kotlin 中的字符串内插使用单个美元符号。
然而，在字符串中使用字面值美元符号（在金融数据和模板系统中很常见）需要变通方法，例如 `${'$'}`。
启用多美元符号内插特性后，你可以配置需要多少个美元符号才能触发内插，
较少的美元符号将被视为字符串字面值。

以下是如何使用多美元符号字符串内插生成带有占位符的 JSON schema 多行字符串的示例：

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

在此示例中，开头的 `$` 表示你需要**两个美元符号** (`$$`) 才能触发内插。
它防止 `$schema`、`$id` 和 `$dynamicAnchor` 被解释为内插标记。

当处理使用美元符号作为占位符语法的系统时，此方法尤其有用。

要启用此特性，请在命令行中使用以下编译器选项：

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者，更新你的 Gradle 构建文件的 `compilerOptions {}` 代码块：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

如果你的代码已经使用单个美元符号的标准字符串内插，则无需更改。
你可以在需要字符串中字面值美元符号时使用 `$`。

### 支持要求显式选择加入才能扩展 API

Kotlin 2.1.0 引入了 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解，
它允许库作者要求用户在实现实验性接口或扩展实验性类之前进行显式选择加入。

当库 API 足够稳定可以但可能会随新的抽象函数而演进，
从而导致其继承不稳定时，此特性可能很有用。

要向 API 元素添加显式选择加入要求，请使用 `@SubclassOptInRequired`
注解并引用注解类：

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

在此示例中，`CoreLibraryApi` 接口要求用户在实现它之前进行显式选择加入。
用户可以这样进行选择加入：

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

> 当你使用 `@SubclassOptInRequired` 注解要求显式选择加入时，
> 该要求不会传播到任何[嵌套类或内部类](nested-classes.md)。
>
{style="note"}

要查看如何在 API 中使用 `@SubclassOptInRequired` 注解的实际示例，
请查看 `kotlinx.coroutines` 库中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 接口。

### 改进了泛型函数重载解析

以前，如果你有多个函数重载，其中一些具有泛型的值形参，
而另一些在相同位置具有函数类型，则解析行为有时可能不一致。

这导致了成员函数和扩展函数的不同行为。
例如：

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () -> V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () -> V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // Member functions
    kvs.store("", 1)    // Resolves to 1
    kvs.store("") { 1 } // Resolves to 2

    // Extension functions
    kvs.storeExtension("", 1)    // Resolves to 1
    kvs.storeExtension("") { 1 } // Doesn't resolve
}
```

在此示例中，`KeyValueStore` 类有两个 `store()` 函数的重载，
其中一个重载具有泛型类型 `K` 和 `V` 的函数形参，
另一个具有返回泛型类型 `V` 的 lambda 函数。
类似地，扩展函数 `storeExtension()` 也有两个重载。

当调用 `store()` 函数时，无论是否带 lambda 函数，
编译器都能成功解析正确的重载。
然而，当扩展函数 `storeExtension()` 在调用时带 lambda 函数时，
编译器未能解析正确的重载，因为它错误地认为两个重载都适用。

为了解决这个问题，我们引入了一个新的启发式方法，以便编译器可以在函数形参（带有泛型类型）无法根据不同实参的信息接受 lambda 函数时，
丢弃一个可能的重载。
此更改使成员函数和扩展函数的行为保持一致，
并且默认在 Kotlin 2.1.0 中启用。

### 改进了 `when` 表达式对密封类的穷尽性检测

在以前的 Kotlin 版本中，即使 `sealed class` 层次结构中的所有情况都已覆盖，
编译器也要求 `when` 表达式的类型形参具有密封上限时，添加 `else` 分支。
Kotlin 2.1.0 解决了并改进了此行为，
使穷尽性检测功能更强大，并允许你移除冗余的 `else` 分支，
使 `when` 表达式更简洁、更直观。

以下是演示此更改的示例：

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // Requires no else branch
}
```

## Kotlin K2 编译器

借助 Kotlin 2.1.0，K2 编译器现在在[处理编译器检测](#extra-compiler-checks)
和[警告](#global-warning-suppression)时提供了更大的灵活性，并[改进了对 kapt 插件的支持](#improved-k2-kapt-implementation)。

### 额外编译器检测

借助 Kotlin 2.1.0，你现在可以在 K2 编译器中启用额外检测。
这些是额外的声明、表达式和类型检测，通常对编译来说并非关键，
但如果你想验证以下情况，它们仍然很有用：

| 检测类型                                            | 备注                                                                                  |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `REDUNDANT_NULLABLE`                                  | 使用 `Boolean??` 而非 `Boolean?`                                                    |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                     | 使用 `java.lang.String` 而非 `kotlin.String`                                        |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | 使用 `arrayOf("") == arrayOf("")` 而非 `arrayOf("").contentEquals(arrayOf(""))`         |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`                 | 使用 `42.toInt()` 而非 `42`                                                         |
| `USELESS_CALL_ON_NOT_NULL`                            | 使用 `"".orEmpty()` 而非 `""`                                                       |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`         | 使用 `"$string"` 而非 `string`                                                      |
| `UNUSED_ANONYMOUS_PARAMETER`                          | lambda 表达式中传递了形参但从未使用                                                    |
| `REDUNDANT_VISIBILITY_MODIFIER`                       | 使用 `public class Klass` 而非 `class Klass`                                        |
| `REDUNDANT_MODALITY_MODIFIER`                         | 使用 `final class Klass` 而非 `class Klass`                                         |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                     | 使用 `set(value: Int)` 而非 `set(value)`                                            |
| `CAN_BE_VAL`                                          | 定义了 `var local = 0` 但从不重新赋值，可以改为 `val local = 42`                       |
| `ASSIGNED_VALUE_IS_NEVER_READ`                        | 定义了 `val local = 42` 但之后在代码中从未使用                                          |
| `UNUSED_VARIABLE`                                     | 定义了 `val local = 0` 但在代码中从未使用                                             |
| `REDUNDANT_RETURN_UNIT_TYPE`                          | 使用 `fun foo(): Unit {}` 而非 `fun foo() {}`                                       |
| `UNREACHABLE_CODE`                                    | 代码语句存在但从不能执行                                                                  |

如果检测为 `true`，你将收到编译器警告并附带问题修复建议。

额外检测默认禁用。
要启用它们，请在命令行中使用 `-Wextra` 编译器选项，或在你的 Gradle 构建文件的 `compilerOptions {}` 代码块中指定 `extraWarnings`：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

有关如何定义和使用编译器选项的更多信息，
请参阅 [Kotlin Gradle 插件中的编译器选项](gradle-compiler-options.md)。

### 全局警告抑制

在 2.1.0 中，Kotlin 编译器获得了一项高度请求的特性——全局抑制警告的能力。

你现在可以通过在命令行中使用 `-Xsuppress-warning=WARNING_NAME`
语法或在构建文件的 `compilerOptions {}` 代码块中使用 `freeCompilerArgs` 属性，
来在整个项目中抑制特定警告。

例如，如果你的项目中启用了[额外编译器检测](#extra-compiler-checks)但想抑制其中一个，请使用：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

如果你想抑制警告但不知道其名称，请选择元素并点击灯泡图标（或使用 <shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>）：

![警告名称意图](warning-name-intention.png){width=500}

新的编译器选项目前是[实验性的](components-stability.md#stability-levels-explained)。
以下详细信息也值得注意：

*   不允许抑制错误。
*   如果你传递了未知的警告名称，编译将导致错误。
*   你可以一次指定多个警告：

    <tabs>
    <tab title="命令行">

    ```bash
    kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
    ```

    </tab>
    <tab title="构建文件">

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.addAll(
                listOf(
                    "-Xsuppress-warning=NOTHING_TO_INLINE",
                    "-Xsuppress-warning=NO_TAIL_CALLS_FOUND"
                )
            )
        }
    }
    ```

    </tab>
    </tabs>

### 改进的 K2 kapt 实现

> K2 编译器的 kapt 插件 (K2 kapt) 处于 [Alpha](components-stability.md#stability-levels-explained) 状态。
> 它可能随时更改。
>
> 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) 中提供你的反馈。
>
{style="warning"}

目前，使用 [kapt](kapt.md) 插件的项目默认使用 K1 编译器，
支持 Kotlin 版本高达 1.9。

在 Kotlin 1.9.20 中，我们推出了 K2 编译器的 kapt 插件 (K2 kapt) 的实验性实现。
我们现在改进了 K2 kapt 的内部实现，以缓解技术和性能问题。

虽然新的 K2 kapt 实现没有引入新特性，
但与之前的 K2 kapt 实现相比，其性能显著提高。
此外，K2 kapt 插件的行为现在更接近 K1 kapt。

要使用新的 K2 kapt 插件实现，请像之前启用 K2 kapt 插件一样启用它。
将以下选项添加到项目的 `gradle.properties` 文件中：

```kotlin
kapt.use.k2=true
```

在未来的版本中，K2 kapt 实现将默认启用，而不是 K1 kapt，
因此你将不再需要手动启用它。

在新实现稳定之前，我们非常感谢你的[反馈](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### 针对无符号类型与非原语类型之间重载冲突的解析

此版本解决了在先前版本中可能发生的无符号类型和非原语类型函数重载冲突的解析问题，
例如以下示例：

#### 重载扩展函数

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Overload resolution ambiguity before Kotlin 2.1.0
}
```

在早期版本中，调用 `uByte.doStuff()` 会导致歧义，因为 `Any` 和 `UByte` 扩展都适用。

#### 重载顶层函数

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Overload resolution ambiguity before Kotlin 2.1.0
}
```

类似地，调用 `doStuff(uByte)` 也存在歧义，因为编译器无法决定是使用 `Any` 版本还是 `UByte` 版本。
在 2.1.0 中，编译器现在可以正确处理这些情况，通过优先选择更具体的类型（在本例中为 `UByte`）来解决歧义。

## Kotlin/JVM

从 2.1.0 版本开始，编译器可以生成包含 Java 23 字节码的类。

### JSpecify 可空性不匹配诊断的严重性更改为严格

Kotlin 2.1.0 强制严格处理 `org.jspecify.annotations` 中的可空性注解，
从而提高了 Java 互操作的类型安全。

以下可空性注解受影响：

*   `org.jspecify.annotations.Nullable`
*   `org.jspecify.annotations.NonNull`
*   `org.jspecify.annotations.NullMarked`
*   `org.jspecify.nullness` 中的旧版注解（JSpecify 0.2 及更早版本）

从 Kotlin 2.1.0 开始，可空性不匹配默认从警告提升为错误。
这确保了在类型检测期间强制执行 `@NonNull` 和 `@Nullable` 等注解，
从而防止运行时意外的可空性问题。

`@NullMarked` 注解还会影响其作用域内所有成员的可空性，
当你处理带注解的 Java 代码时，行为更可预测。

以下是演示新默认行为的示例：

```java
// Java
import org.jspecify.annotations.*;
public class SomeJavaClass {
    @NonNull
    public String foo() { //...
    }

    @Nullable
    public String bar() { //...
    }
}
```

```kotlin
// Kotlin
fun test(sjc: SomeJavaClass) {
    // Accesses a non-null result, which is allowed
    sjc.foo().length

    // Raises an error in the default strict mode because the result is nullable
    // To avoid the error, use ?.length instead
    sjc.bar().length
}
```

你可以手动控制这些注解的诊断严重性。
为此，请使用 `-Xnullability-annotations` 编译器选项来选择模式：

*   `ignore`：忽略可空性不匹配。
*   `warning`：报告可空性不匹配的警告。
*   `strict`：报告可空性不匹配的错误（默认模式）。

更多信息，请参阅[可空性注解](java-interop.md#nullability-annotations)。

## Kotlin Multiplatform

Kotlin 2.1.0 引入了 [Swift 导出基础支持](#basic-support-for-swift-export)，并使
[发布 Kotlin Multiplatform 库更容易](#ability-to-publish-kotlin-libraries-from-any-host)。
它还专注于 Gradle 方面的改进，以稳定[配置编译器选项的新 DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)，
并带来了 [Isolated Projects 特性的预览](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

### 适用于多平台项目中编译器选项的新 Gradle DSL 已提升至稳定

在 Kotlin 2.0.0 中，[我们引入了一个新的实验性 Gradle DSL](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)，
以简化多平台项目中编译器选项的配置。
在 Kotlin 2.1.0 中，此 DSL 已提升至稳定。

整体项目配置现在分为三层。最高层是扩展层，
然后是目标层，最低层是编译单元（通常是编译任务）：

![Kotlin 编译器选项级别](compiler-options-levels.svg){width=700}

要了解有关不同级别以及如何在它们之间配置编译器选项的更多信息，
请参阅 [编译器选项](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compiler-options)。

### 预览 Gradle 的 Kotlin Multiplatform 中的 Isolated Projects

> 此特性为[实验性的](components-stability.md#stability-levels-explained)，目前在 Gradle 中处于 pre-Alpha 状态。
> 仅应与 Gradle 8.10 版本一起使用，并且仅用于评估目的。该特性可能随时被移除或更改。
>
> 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中提供你的反馈。
> 需要显式选择加入（详见下文）。
>
{style="warning"}

在 Kotlin 2.1.0 中，
你可以在多平台项目中预览 Gradle 的 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 特性。

Gradle 中的 Isolated Projects 特性通过“隔离”
各个 Gradle 项目的配置来提高构建性能。
每个项目的构建逻辑被限制为不能直接访问其他项目的可变状态，
从而允许它们安全地并行运行。
为了支持此特性，我们对 Kotlin Gradle 插件的模型做了一些更改，
我们很乐意在此预览阶段听取你的经验。

有两种方法可以启用 Kotlin Gradle 插件的新模型：

*   选项 1：**不启用 Isolated Projects 进行兼容性测试** –
    要检测与 Kotlin Gradle 插件新模型的兼容性而不启用 Isolated Projects 特性，
    请将以下 Gradle 属性添加到项目的 `gradle.properties` 文件中：

    ```none
    # gradle.properties
    kotlin.kmp.isolated-projects.support=enable
    ```

*   选项 2：**启用 Isolated Projects 进行测试** –
    在 Gradle 中启用 Isolated Projects 特性会自动配置 Kotlin Gradle 插件以使用新模型。
    要启用 Isolated Projects 特性，请[设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。
    在这种情况下，你无需将 Kotlin Gradle 插件的 Gradle 属性添加到你的项目中。

### Swift 导出基础支持

> 此特性目前处于早期开发阶段。它可能随时被移除或更改。
> 需要显式选择加入（详见下文），并且你应仅将其用于评估目的。
> 欢迎在 [YouTrack](https://kotl.in/issue) 中提供你的反馈。
>
{style="warning"}

2.1.0 版本朝着提供 Kotlin 中的 Swift 导出迈出了第一步，
允许你将 Kotlin 源代码直接导出到 Swift 接口而无需使用 Objective-C 头文件。
这应该会使 Apple 目标的跨平台开发变得更容易。

当前的基础支持包括以下功能：

*   将 Kotlin 的多个 Gradle 模块直接导出到 Swift。
*   使用 `moduleName` 属性定义自定义 Swift 模块名称。
*   使用 `flattenPackage` 属性设置包结构的折叠规则。

你可以在你的项目中使用以下构建文件作为设置 Swift 导出的起点：

```kotlin
// build.gradle.kts
kotlin {

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    @OptIn(ExperimentalSwiftExportDsl::class)
    swiftExport {
        // Root module name
        moduleName = "Shared"

        // Collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Export external modules
        export(project(":subproject")) {
            // Exported module name
            moduleName = "Subproject"
            // Collapse exported dependency rule
            flattenPackage = "com.subproject.library"
        }
    }
}
```

你也可以克隆我们已设置好 Swift 导出的[公共示例](https://github.com/Kotlin/swift-export-sample)。

编译器会自动生成所有必要的文件（包括 `swiftmodule` 文件、
静态 `a` 库以及头文件和 `modulemap` 文件），并将它们复制到应用的构建目录中，
你可以从 Xcode 访问该目录。

#### 如何启用 Swift 导出

请记住，此特性目前仍处于早期开发阶段。

Swift 导出目前适用于使用[直接集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)
连接 iOS framework 到 Xcode 项目的项目。
这是在 Android Studio 或通过 [web wizard](https://kmp.jetbrains.com/) 创建的 Kotlin Multiplatform 项目的标准配置。

要在你的项目中尝试 Swift 导出：

1.  将以下 Gradle 选项添加到你的 `gradle.properties` 文件中：

    ```none
    # gradle.properties
    kotlin.experimental.swift-export.enabled=true
    ```

2.  在 Xcode 中，打开项目设置。
3.  在 **Build Phases** 选项卡中，找到带有 `embedAndSignAppleFrameworkForXcode` 任务的 **Run Script** 阶段。
4.  调整脚本，在运行脚本阶段使用 `embedSwiftExportForXcode` 任务代替：

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![添加 Swift 导出脚本](xcode-swift-export-run-script-phase.png){width=700}

#### 对 Swift 导出提供反馈

我们计划在未来的 Kotlin 版本中扩展和稳定 Swift 导出支持。
请在[此 YouTrack 问题](https://youtl.in/issue)中留下你的反馈。

### 从任何主机发布 Kotlin 库的能力

> 此特性目前为[实验性的](components-stability.md#stability-levels-explained)。
> 需要显式选择加入（详见下文），并且你应仅将其用于评估目的。
> 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中提供你的反馈。
>
{style="warning"}

Kotlin 编译器生成 `.klib` 构件以发布 Kotlin 库。
以前，你可以从任何主机获取必要的构件，除了需要 Mac 机器的 Apple 平台目标。
这给面向 iOS、macOS、tvOS 和 watchOS 目标的 Kotlin Multiplatform 项目带来了特殊限制。

Kotlin 2.1.0 解除了这一限制，增加了对交叉编译的支持。
现在你可以使用任何主机来生成 `.klib` 构件，
这应该会大大简化 Kotlin 和 Kotlin Multiplatform 库的发布过程。

#### 如何启用从任何主机发布库

要在你的项目中尝试交叉编译，请将以下二进制选项添加到你的 `gradle.properties` 文件中：

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

此特性目前为实验性，并存在一些限制。你仍然需要使用 Mac 机器，如果：

*   你的库具有 [cinterop 依赖项](native-c-interop.md)。
*   你在项目中设置了 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)。
*   你需要为 Apple 目标构建或测试[最终二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。

#### 对从任何主机发布库提供反馈

我们计划在未来的 Kotlin 版本中稳定此特性并进一步改进库发布。
请在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中留下你的反馈。

更多信息，请参阅 [发布多平台库](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)。

### 支持非打包 klib

Kotlin 2.1.0 允许生成非打包的 `.klib` 文件构件。
这使你可以选择直接配置 klib 的依赖项，而无需先将其解包。

此更改还可以提高性能，
减少 Kotlin/Wasm、Kotlin/JS 和 Kotlin/Native 项目的编译和链接时间。

例如，
我们的基准测试显示，在包含 1 个链接任务和 10 个编译任务的项目中，总构建时间提高了大约 3%
（该项目构建一个依赖于 9 个简化项目的单个原生可执行二进制文件）。
然而，对构建时间的实际影响取决于子项目的数量及其各自的大小。

#### 如何设置你的项目

默认情况下，Kotlin 编译和链接任务现在配置为使用新的非打包构件。

如果你已经设置了用于解析 klib 的自定义构建逻辑，并且想要使用新的解包构件，
你需要在你的 Gradle 构建文件中显式指定 klib 包解析的首选变体：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {

    // For the new non-packed configuration:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // For the previous packed configuration:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.PACKED))
}
```

非打包的 `.klib` 文件生成在项目构建目录中与之前打包文件相同的路径下。
反过来，打包的 klib 现在位于 `build/libs` 目录中。

如果未指定属性，则使用打包变体。
你可以使用以下控制台命令查看可用属性和变体的列表：

```shell
./gradlew outgoingVariants
```

欢迎在 [YouTrack](https://kotl.in/issue) 中提供对此特性的反馈。

### 旧 `android` 目标的进一步弃用

在 Kotlin 2.1.0 中，旧 `android` 目标名称的弃用警告已提升为错误。

目前，我们建议你在面向 Android 的 Kotlin Multiplatform 项目中使用 `androidTarget` 选项。
这是一个临时解决方案，是为了即将到来的 Google Android/KMP 插件腾出 `android` 名称所必需的。

当新插件可用时，我们将提供进一步的迁移说明。
来自 Google 的新 DSL 将是 Kotlin Multiplatform 中 Android 目标支持的首选选项。

更多信息，
请参阅 [Kotlin Multiplatform 兼容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#rename-of-android-target-to-androidtarget)。

### 移除了对声明相同类型多个目标的支持

在 Kotlin 2.1.0 之前，你可以在多平台项目中声明相同类型的多个目标。
然而，这使得区分目标和有效支持共享源代码集变得具有挑战性。
在大多数情况下，更简单的设置（例如使用单独的 Gradle 项目）效果更好。
有关详细指导和迁移示例，
请参阅 Kotlin Multiplatform 兼容性指南中的[声明多个类似目标](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#declaring-several-similar-targets)。

Kotlin 1.9.20 在你的多平台项目中声明相同类型的多个目标时会触发弃用警告。
在 Kotlin 2.1.0 中，此弃用警告现在对于除 Kotlin/JS 目标之外的所有目标都是一个错误。
要了解有关 Kotlin/JS 目标为何豁免的更多信息，
请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的此问题。

## Kotlin/Native

Kotlin 2.1.0 包含对 [`iosArm64` 目标支持的升级](#iosarm64-promoted-to-tier-1)、
[cinterop 中缓存过程的改进](#changes-to-caching-in-cinterop)以及其他更新。

### iosArm64 提升至 Tier 1

`iosArm64` 目标对于 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 开发至关重要，
现已提升至 Tier 1。这是 Kotlin/Native 编译器中最高级别的支持。

这意味着该目标会在 CI 流水线中定期进行检测，以确保其能够编译和运行。
我们还为该目标在编译器版本之间提供源代码和二进制兼容性。

有关目标层级的更多信息，请参阅 [Kotlin/Native 目标支持](native-target-support.md)。

### LLVM 从 11.1.0 更新到 16.0.0

在 Kotlin 2.1.0 中，我们将 LLVM 从 11.1.0 版本更新到 16.0.0。
新版本包含错误修复和安全更新。
在某些情况下，它还提供了编译器优化和更快的编译速度。

如果你的项目中有 Linux 目标，
请注意 Kotlin/Native 编译器现在默认对所有 Linux 目标使用 `lld` 链接器。

此更新不应影响你的代码，但如果你遇到任何问题，请向我们的[问题跟踪器](http://kotl.in/issue)报告。

### cinterop 中缓存的更改

在 Kotlin 2.1.0 中，我们正在对 cinterop 缓存过程进行更改。它不再具有
[`CacheableTask`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/CacheableTask.html) 注解类型。
新的推荐方法是使用 [`cacheIf`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.tasks/-task-outputs/cache-if.html)
输出类型来缓存任务结果。

这应该能解决 `UP-TO-DATE`
检测未能检测到[定义文件](native-definition-file.md)中指定头文件更改的问题，
从而阻止构建系统重新编译代码。

### mimalloc 内存分配器的弃用

早在 Kotlin 1.9.0 中，我们就引入了新的内存分配器，然后在 Kotlin 1.9.20 中默认启用了它。
新的分配器旨在提高垃圾回收效率，
并改进 Kotlin/Native 内存管理器的运行时性能。

新的内存分配器取代了以前的默认分配器 [mimalloc](https://github.com/microsoft/mimalloc)。
现在，是时候弃用 Kotlin/Native 编译器中的 mimalloc 了。

你现在可以从构建脚本中移除 `-Xallocator=mimalloc` 编译器选项。
如果你遇到任何问题，请向我们的[问题跟踪器](http://kotl.in/issue)报告。

有关 Kotlin 中内存分配器和垃圾回收的更多信息，
请参阅 [Kotlin/Native 内存管理](native-memory-manager.md)。

## Kotlin/Wasm

Kotlin/Wasm 收到多项更新，并[支持增量编译](#support-for-incremental-compilation)。

### 支持增量编译

以前，当你更改 Kotlin 代码时，Kotlin/Wasm 工具链必须重新编译整个代码库。

从 2.1.0 开始，Wasm 目标支持增量编译。
在开发任务中，编译器现在只重新编译与上次编译更改相关的文件，
这显著减少了编译时间。

此更改目前将编译速度提高了一倍，并计划在未来版本中进一步改进。

在当前设置中，Wasm 目标的增量编译默认禁用。
要启用增量编译，请将以下行添加到你的项目的 `local.properties` 或 `gradle.properties` 文件中：

```none
# gradle.properties
kotlin.incremental.wasm=true
```

试用 Kotlin/Wasm 增量编译
并[分享你的反馈](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。
你的见解将有助于更快地稳定此特性并默认启用。

### 浏览器 API 已移至 kotlinx-browser 独立库

以前，Web API 及相关目标工具的声明是 Kotlin/Wasm 标准库的一部分。

在此版本中，`org.w3c.*`
声明已从 Kotlin/Wasm 标准库移至新的 [kotlinx-browser 库](https://github.com/kotlin/kotlinx-browser)。
此库还包括其他 Web 相关包，例如 `org.khronos.webgl`、`kotlin.dom` 和 `kotlinx.browser`。

这种分离提供了模块化，允许 Web 相关 API 独立于 Kotlin 的发布周期进行更新。
此外，Kotlin/Wasm 标准库现在仅包含任何 JavaScript 环境中可用的声明。

要使用已移动包中的声明，
你需要将 `kotlinx-browser` 依赖项添加到你的项目构建配置文件中：

```kotlin
// build.gradle.kts
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```

### 改进了 Kotlin/Wasm 的调试体验

以前，在 Web 浏览器中调试 Kotlin/Wasm 代码时，你可能会遇到
调试界面中变量值的低级表示。
这通常使得跟踪应用程序的当前状态变得具有挑战性。

![Kotlin/Wasm 旧版调试器](wasm-old-debugger.png){width=700}

为了改善这种体验，变量视图中添加了自定义格式化程序。
此实现使用 [custom formatters API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)，
该 API 在 Firefox 和基于 Chromium 的主要浏览器中均受支持。

通过此更改，你现在可以以更用户友好和易于理解的方式显示和查找变量值。

![Kotlin/Wasm 改进版调试器](wasm-debugger-improved.png){width=700}

要尝试新的调试体验：

1.  将以下编译器选项添加到 `wasmJs {}` 编译器选项中：

    ```kotlin
    // build.gradle.kts
    kotlin {
        wasmJs {
            // ...

            compilerOptions {
                freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
            }
        }
    }
    ```

2.  在你的浏览器中启用自定义格式化程序：

    *   在 Chrome DevTools 中，可通过 **Settings | Preferences | Console** 访问：

        ![在 Chrome 中启用自定义格式化程序](wasm-custom-formatters-chrome.png){width=700}

    *   在 Firefox DevTools 中，可通过 **Settings | Advanced settings** 访问：

        ![在 Firefox 中启用自定义格式化程序](wasm-custom-formatters-firefox.png){width=700}

### 减小 Kotlin/Wasm 二进制文件的大小

你的生产构建生成的 Wasm 二进制文件大小将减少高达 30%，
并且你可能会看到一些性能改进。
这是因为 `--closed-world`、`--type-ssa` 和 `--type-merging`
Binaryen 选项现在被认为对所有 Kotlin/Wasm 项目来说都是安全的，并默认启用。

### 改进了 Kotlin/Wasm 中的 JavaScript 数组互操作性

虽然 Kotlin/Wasm 的标准库为 JavaScript 数组提供了 `JsArray<T>` 类型，
但没有直接的方法将 `JsArray<T>` 转换为 Kotlin 的原生 `Array` 或 `List` 类型。

这一空白需要创建自定义函数来进行数组转换，从而使 Kotlin 和 JavaScript 代码之间的互操作性变得复杂。

此版本引入了一个适配器函数，可自动将 `JsArray<T>` 转换为 `Array<T>`，反之亦然，
从而简化了数组操作。

以下是泛型类型之间转换的示例：Kotlin `List<T>` 和 `Array<T>` 到 JavaScript `JsArray<T>`。

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

类似的函数可用于将类型化数组转换为其 Kotlin 等效类型
（例如，`IntArray` 和 `Int32Array`）。有关详细信息和实现，
请参阅 [`kotlinx-browser` 版本库](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

以下是类型化数组之间转换的示例：Kotlin `IntArray` 到 JavaScript `Int32Array`。

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)

    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()

    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlinIntArray: IntArray = jsInt32Array.toIntArray()
```

### 支持在 Kotlin/Wasm 中访问 JavaScript 异常详细信息

以前，当 JavaScript 异常在 Kotlin/Wasm 中发生时，
`JsException` 类型仅提供通用消息，没有来自原始 JavaScript 错误的详细信息。

从 Kotlin 2.1.0 开始，你可以配置 `JsException`
以包含原始错误消息和堆栈跟踪，方法是启用特定的编译器选项。
这提供了更多上下文，有助于诊断源自 JavaScript 的问题。

此行为取决于 `WebAssembly.JSTag` API，该 API 仅在某些浏览器中可用：

*   **Chrome**：从版本 115 开始支持
*   **Firefox**：从版本 129 开始支持
*   **Safari**：尚未支持

要启用此特性（默认禁用），
请将以下编译器选项添加到你的 `build.gradle.kts` 文件中：

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

以下是演示新行为的示例：

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // Prints the full JavaScript stack trace
        e.printStackTrace()
    }
}
```

启用 `-Xwasm-attach-js-exception` 选项后，`JsException` 会提供来自 JavaScript 错误的具体详细信息。
如果没有此选项，`JsException` 仅包含一条通用消息，说明在运行 JavaScript 代码时抛出了异常。

### 弃用默认导出

作为迁移到命名导出的一部分，
以前在 JavaScript 中对 Kotlin/Wasm 导出使用默认导入时，控制台会打印错误。

在 2.1.0 中，默认导入已完全移除，以完全支持命名导出。

当针对 Kotlin/Wasm 目标进行 JavaScript 编码时，你现在需要使用相应的命名导入而不是默认导入。

此更改标志着迁移到命名导出的弃用周期的最后一个阶段：

**在 2.0.0 版本中**：控制台打印一条警告消息，解释通过默认导出导出实体已被弃用。

**在 2.0.20 版本中**：发生错误，要求使用相应的命名导入。

**在 2.1.0 版本中**：已完全移除默认导入的使用。

### 子项目特有的 Node.js 设置

你可以通过定义 `rootProject` 的 `NodeJsRootPlugin` 类的属性来配置项目的 Node.js 设置。
在 2.1.0 中，你可以使用新类 `NodeJsPlugin` 为每个子项目配置这些设置。
以下是演示如何为子项目设置特定 Node.js 版本的示例：

```kotlin
// build.gradle.kts
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "22.0.0"
}
```

要将新类用于整个项目，请在 `allprojects {}` 代码块中添加相同的代码：

```kotlin
// build.gradle.kts
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

你还可以使用 Gradle 约定插件将设置应用于特定的子项目集。

## Kotlin/JS

### 支持属性中的非标识符字符

Kotlin/JS 以前不允许在反引号中包含空格的[测试方法名称](coding-conventions.md#names-for-test-methods)。

类似地，也无法访问包含 Kotlin 标识符中不允许的字符（例如连字符或空格）的 JavaScript 对象属性：

```kotlin
external interface Headers {
    var accept: String?

    // Invalid Kotlin identifier due to hyphen
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// Causes error due to the hyphen in property name
val length = headers.`content-length`
```

此行为与 JavaScript 和 TypeScript 不同，后者允许使用非标识符字符访问此类属性。

从 Kotlin 2.1.0 开始，此特性默认启用。
Kotlin/JS 现在允许你使用反引号 (``) 和 `@JsName` 注解
与包含非标识符字符的 JavaScript 属性进行交互，并使用测试方法名称。

此外，
你可以使用 `@JsName` 和 ` @JsQualifier` 注解将 Kotlin 属性名称映射到 JavaScript 等效名称：

```kotlin
object Bar {
    val `property example`: String = "bar"
}

@JsQualifier("fooNamespace")
external object Foo {
    val `property example`: String
}

@JsExport
object Baz {
    val `property example`: String = "bar"
}

fun main() {
    // In JavaScript, this is compiled into Bar.property_example_HASH
    println(Bar.`property example`)
    // In JavaScript, this is compiled into fooNamespace["property example"]
    println(Foo.`property example`)
    // In JavaScript, this is compiled into Baz["property example"]
    println(Baz.`property example`)
}
```

### 支持生成 ES2015 箭头函数

在 Kotlin 2.1.0 中，Kotlin/JS 引入了对生成 ES2015 箭头函数（例如 `(a, b) => expression`）的支持，
而不是匿名函数。

使用箭头函数可以减小项目的捆绑包大小，
尤其是在使用实验性的 `-Xir-generate-inline-anonymous-functions` 模式时。
这还使得生成的代码更符合现代 JS。

此特性在目标为 ES2015 时默认启用。
或者，你可以通过使用 `-Xes-arrow-functions` 命令行实参来启用它。

了解更多关于 [ES2015 (ECMAScript 2015, ES6) 的官方文档](https://262.ecma-international.org/6.0/)。

## Gradle 改进

Kotlin 2.1.0 完全兼容 Gradle 7.6.3 到 8.6。
Gradle 8.7 到 8.10 也受支持，只有一个例外。
如果你使用 Kotlin Multiplatform Gradle 插件，
你可能会在调用 JVM 目标中的 `withJava()` 函数的多平台项目中看到弃用警告。
我们计划尽快解决此问题。

更多信息，
请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542) 中的相关问题。

你也可以使用最新 Gradle 版本及更高版本，
但如果你这样做，请记住你可能会遇到弃用警告或某些新的 Gradle 特性可能无法正常工作。

### 最低支持 AGP 版本提升至 7.3.1

从 Kotlin 2.1.0 开始，最低支持的 Android Gradle 插件版本为 7.3.1。

### 最低支持 Gradle 版本提升至 7.6.3

从 Kotlin 2.1.0 开始，最低支持的 Gradle 版本为 7.6.3。

### Kotlin Gradle 插件扩展的新 API

Kotlin 2.1.0 引入了一个新 API，使其更容易创建你自己的插件来配置 Kotlin Gradle 插件。
此更改弃用了 `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig`
接口，并为插件作者引入了以下接口：

| 名称                     | 描述                                                                                                                                                                                                                                                                  |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `KotlinBaseExtension`    | 用于配置整个项目的通用 Kotlin JVM、Android 和 Multiplatform 插件选项的插件 DSL 扩展类型：<list><li>`org.jetbrains.kotlin.jvm`</li><li>`org.jetbrains.kotlin.android`</li><li>`org.jetbrains.kotlin.multiplatform`</li></list> |
| `KotlinJvmExtension`     | 用于配置整个项目的 Kotlin **JVM** 插件选项的插件 DSL 扩展类型。                                                                                                                                                                                           |
| `KotlinAndroidExtension` | 用于配置整个项目的 Kotlin **Android** 插件选项的插件 DSL 扩展类型。                                                                                                                                                                                       |

例如，如果你想同时为 JVM 和 Android 项目配置编译器选项，请使用 `KotlinBaseExtension`：

```kotlin
configure<KotlinBaseExtension> {
    if (this is HasConfigurableKotlinCompilerOptions<*>) {
        with(compilerOptions) {
            if (this is KotlinJvmCompilerOptions) {
                jvmTarget.set(JvmTarget.JVM_17)
            }
        }
    }
}
```

这会将 JVM 目标设置为 17，同时适用于 JVM 和 Android 项目。

要专门为 JVM 项目配置编译器选项，请使用 `KotlinJvmExtension`：

```kotlin
configure<KotlinJvmExtension> {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }

    target.mavenPublication {
        groupId = "com.example"
        artifactId = "example-project"
        version = "1.0-SNAPSHOT"
    }
}
```

此示例类似地将 JVM 目标设置为 17，适用于 JVM 项目。
它还为项目配置了 Maven publication，以便其输出发布到 Maven 版本库。

你可以完全相同地使用 `KotlinAndroidExtension`。

### 编译器符号从 Kotlin Gradle 插件 API 中隐藏

以前，KGP 在其运行时依赖项中包含了 `org.jetbrains.kotlin:kotlin-compiler-embeddable`，
这使得内部编译器符号在构建脚本类路径中可用。
这些符号仅供内部使用。

从 Kotlin 2.1.0 开始，KGP 将 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 的子集类文件捆绑到其 JAR 文件中并逐步移除它们。
此更改旨在防止兼容性问题并简化 KGP 的维护。

如果构建逻辑的其他部分（例如 `kotlinter` 等插件）依赖于与 KGP 捆绑版本不同的 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 版本，
则可能导致冲突和运行时异常。

为了防止此类问题，KGP 现在会显示警告，如果 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 与 KGP 同时出现在构建类路径中。

作为长期解决方案，如果你是使用 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 类的插件作者，我们建议你在独立的类加载器中运行它们。
例如，你可以使用 [Gradle Workers API](https://docs.gradle.org/current/userguide/worker_api.html) 实现类加载器或进程隔离。

#### 使用 Gradle Workers API

此示例演示了如何在生成 Gradle 插件的项目中安全地使用 Kotlin 编译器。
首先，在你的构建脚本中添加一个 compile-only 依赖项。
这使得符号仅在编译时可用：

```kotlin
// build.gradle.kts
dependencies {
    compileOnly("org.jetbrains.kotlin:kotlin-compiler-embeddable:%kotlinVersion%")
}
```

接下来，定义一个 Gradle 工作操作以打印 Kotlin 编译器版本：

```kotlin
import org.gradle.workers.WorkAction
import org.gradle.workers.WorkParameters
import org.jetbrains.kotlin.config.KotlinCompilerVersion
abstract class ActionUsingKotlinCompiler : WorkAction<WorkParameters.None> {
    override fun execute() {
        println("Kotlin compiler version: ${KotlinCompilerVersion.getVersion()}")
    }
}
```

现在创建一个任务，使用类加载器隔离将此操作提交给 worker 执行器：

```kotlin
import org.gradle.api.DefaultTask
import org.gradle.api.file.ConfigurableFileCollection
import org.gradle.api.tasks.Classpath
import org.gradle.api.tasks.TaskAction
import org.gradle.workers.WorkerExecutor
import javax.inject.Inject
abstract class TaskUsingKotlinCompiler: DefaultTask() {
    @get:Inject
    abstract val executor: WorkerExecutor

    @get:Classpath
    abstract val kotlinCompiler: ConfigurableFileCollection

    @TaskAction
    fun compile() {
        val workQueue = executor.classLoaderIsolation {
            classpath.from(kotlinCompiler)
        }
        workQueue.submit(ActionUsingKotlinCompiler::class.java) {}
    }
}
```

最后，在你的 Gradle 插件中配置 Kotlin 编译器类路径：

```kotlin
import org.gradle.api.Plugin
import org.gradle.api.Project
abstract class MyPlugin: Plugin<Project> {
    override fun apply(target: Project) {
        val myDependencyScope = target.configurations.create("myDependencyScope")
        target.dependencies.add(myDependencyScope.name, "$KOTLIN_COMPILER_EMBEDDABLE:$KOTLIN_COMPILER_VERSION")
        val myResolvableConfiguration = target.configurations.create("myResolvable") {
            extendsFrom(myDependencyScope)
        }
        target.tasks.register("myTask", TaskUsingKotlinCompiler::class.java) {
            kotlinCompiler.from(myResolvableConfiguration)
        }
    }

    companion object {
        const val KOTLIN_COMPILER_EMBEDDABLE = "org.jetbrains.kotlin:kotlin-compiler-embeddable"
        const val KOTLIN_COMPILER_VERSION = "%kotlinVersion%"
    }
}
```

## Compose 编译器更新

### 支持多个稳定性配置文件

Compose 编译器可以解析多个稳定性配置文件，
但 Compose Compiler Gradle 插件的 `stabilityConfigurationFile` 选项以前只允许
指定单个文件。
在 Kotlin 2.1.0 中，此功能经过重构，允许你为单个模块使用多个稳定性配置文件：

*   `stabilityConfigurationFile` 选项已弃用。
*   新增选项 `stabilityConfigurationFiles`，类型为 `ListProperty<RegularFile>`。

以下是如何使用新选项将多个文件传递给 Compose 编译器：

```kotlin
// build.gradle.kt
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

### 可暂停组合

可暂停组合是一项新的实验性特性，它改变了编译器生成可跳过函数的方式。
启用此特性后，组合可以在运行时在跳过点暂停，
允许长时间运行的组合过程在多个帧之间拆分。
可暂停组合用于惰性列表和其他性能密集型组件，用于预取可能导致帧在阻塞方式执行时丢弃的内容。

要试用可暂停组合，请在 Compose 编译器的 Gradle 配置中添加以下特性标志：

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.PausableComposition
    )
}
```

> 此特性的运行时支持已在 `androidx.compose.runtime` 的 1.8.0-alpha02 版本中添加。
> 与旧版本运行时一起使用时，此特性标志无效。
>
{style="note"}

### 开放和覆盖的 `@Composable` 函数的更改

虚拟（`open`、`abstract` 和 `overridden`）的 `@Composable` 函数不再可重启。
可重启组的代码生成会生成[无法正确](https://issuetracker.google.com/329477544)与继承配合使用的调用，
导致运行时崩溃。

这意味着虚拟函数不会被重启或跳过：
每当它们的状态失效时，运行时将重新组合它们的父级可组合项。
如果你的代码对重组敏感，你可能会注意到运行时行为的变化。

### 性能改进

Compose 编译器过去会创建模块 IR 的完整副本以转换 `@Composable` 类型。
除了复制与 Compose 无关的元素时增加内存消耗外，
此行为在[某些边缘情况](https://issuetracker.google.com/365066530)下也会破坏下游编译器插件。

此复制操作已被移除，从而可能带来更快的编译时间。

## 标准库

### 标准库 API 弃用严重性的更改

在 Kotlin 2.1.0 中，我们正在提高几个标准库 API 的弃用严重性级别，从警告提升为错误。
如果你的代码依赖于这些 API，你需要更新它以确保兼容性。
最显著的更改包括：

*   **`Char` 和 `String` 的区域敏感大小写转换函数已弃用**：
    `Char.toLowerCase()`、`Char.toUpperCase()`、`String.toUpperCase()` 和
    `String.toLowerCase()` 等函数现在已弃用，使用它们会导致错误。
    请将它们替换为区域无关的函数替代方案或其他大小写转换机制。
    如果你想继续使用默认区域，请将 `String.toLowerCase()` 等调用替换为
    `String.lowercase(Locale.getDefault())`，显式指定区域。
    对于区域无关的转换，请将它们替换为 `String.lowercase()`，后者默认使用不变区域。

*   **Kotlin/Native 冻结 API 已弃用**：
    使用以前标记为 `@FreezingIsDeprecated` 注解的冻结相关声明现在会导致错误。
    此更改反映了 Kotlin/Native 中从传统内存管理器到新内存模型的过渡，
    传统内存管理器需要冻结对象才能在线程之间共享。
    要了解如何在新的内存模型中从冻结相关 API 迁移，
    请参阅 [Kotlin/Native 迁移指南](native-migration-guide.md#update-your-code)。
    有关更多信息，请参阅[关于冻结弃用的公告](whatsnew1720.md#freezing)。

*   **`appendln()` 已弃用，取而代之的是 `appendLine()`**：
    `StringBuilder.appendln()` 和 `Appendable.appendln()` 函数现在已弃用，使用它们会导致错误。
    要替换它们，请使用 `StringBuilder.appendLine()` 或 `Appendable.appendLine()` 函数。
    `appendln()` 函数被弃用是因为，在 Kotlin/JVM 上，它使用 `line.separator` 系统属性，
    该属性在每个操作系统上都有不同的默认值。在 Kotlin/JVM 上，此属性在 Windows 上默认为 `\r
` (CR LF)，在其他系统上默认为 `
` (LF)。
    另一方面，`appendLine()` 函数始终使用 `
` (LF) 作为行分隔符，确保在不同平台上的行为一致。

有关此版本中受影响 API 的完整列表，请参阅 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) YouTrack 问题。

### `java.nio.file.Path` 的稳定文件树遍历扩展

Kotlin 1.7.20 引入了 [`java.nio.file.Path` 类](extensions.md#extension-functions)的实验性扩展函数，
允许你遍历文件树。
在 Kotlin 2.1.0 中，以下文件树遍历扩展现在已[稳定](components-stability.md#stability-levels-explained)：

*   `walk()` 惰性遍历以指定路径为根的文件树。
*   `fileVisitor()` 使得可以单独创建 `FileVisitor`。
    `FileVisitor` 指定在遍历过程中对目录和文件执行的操作。
*   `visitFileTree(fileVisitor: FileVisitor, ...)` 遍历文件树，
    在每个遇到的条目上调用指定的 `FileVisitor`，它在底层使用 `java.nio.file.Files.walkFileTree()` 函数。
*   `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` 使用提供的 `builderAction` 创建 `FileVisitor`
    并调用 `visitFileTree(fileVisitor, ...)` 函数。
*   `sealed interface FileVisitorBuilder` 允许你定义自定义 `FileVisitor` 实现。
*   `enum class PathWalkOption` 为 `Path.walk()` 函数提供遍历选项。

以下示例演示了如何使用这些文件遍历 API 创建自定义 `FileVisitor` 行为，
这允许你定义访问文件和目录的特定操作。

例如，你可以显式创建 `FileVisitor` 并稍后使用它：

```kotlin
val cleanVisitor = fileVisitor {
    onPreVisitDirectory { directory, attributes ->
        // Placeholder: Add logic on visiting directories
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // Placeholder: Add logic on visiting files
        FileVisitResult.CONTINUE
    }
}

// Placeholder: Add logic here for general setup before traversal
projectDirectory.visitFileTree(cleanVisitor)
```

你也可以使用 `builderAction` 创建 `FileVisitor` 并立即将其用于遍历：

```kotlin
projectDirectory.visitFileTree {
    // Defines the builderAction:
    onPreVisitDirectory { directory, attributes ->
        // Some logic on visiting directories
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // Some logic on visiting files
        FileVisitResult.CONTINUE
    }
}
```

此外，你可以使用 `walk()` 函数遍历以指定路径为根的文件树：

```kotlin
fun traverseFileTree() {
    val cleanVisitor = fileVisitor {
        onPreVisitDirectory { directory, _ ->
            if (directory.name == "build") {
                directory.toFile().deleteRecursively()
                FileVisitResult.SKIP_SUBTREE
            } else {
                FileVisitResult.CONTINUE
            }
        }

        // Deletes files with the .class extension
        onVisitFile { file, _ ->
            if (file.extension == "class") {
                file.deleteExisting()
            }
            FileVisitResult.CONTINUE
        }
    }

    // Sets up the root directory and files
    val rootDirectory = createTempDirectory("Project")

    // Creates the src directory with A.kt and A.class files
    rootDirectory.resolve("src").let { srcDirectory ->
        srcDirectory.createDirectory()
        srcDirectory.resolve("A.kt").createFile()
        srcDirectory.resolve("A.class").createFile()
    }

    // Creates the build directory with a Project.jar file
    rootDirectory.resolve("build").let { buildDirectory ->
        buildDirectory.createDirectory()
        buildDirectory.resolve("Project.jar").createFile()
    }

    // Uses the walk() function:
    val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructure)
    // "[, build, build/Project.jar, src, src/A.class, src/A.kt]"

    // Traverses the file tree with cleanVisitor, applying the rootDirectory.visitFileTree(cleanVisitor) cleanup rules
    val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructureAfterClean)
    // "[, src, src/A.kt]"
}
```

## 文档更新

Kotlin 文档有一些显著的更改：

### 语言概念

*   改进的 [空安全](null-safety.md) 页面 – 了解如何安全地处理代码中的 `null` 值。
*   改进的 [对象声明和表达式](object-declarations.md) 页面 –
    了解如何一步定义类和创建实例。
*   改进的 [When 表达式和语句](control-flow.md#when-expressions-and-statements) 部分 –
    了解 `when` 条件以及如何使用它。
*   更新的 [Kotlin 路线图](roadmap.md)、[Kotlin 演进原则](kotlin-evolution-principles.md) 和
    [Kotlin 语言特性和提案](kotlin-language-features-and-proposals.md) 页面 –
    了解 Kotlin 的计划、持续发展和指导原则。

### Compose 编译器

*   [Compose 编译器文档](compose-compiler-migration-guide.md) 现在位于“编译器和插件”部分 –
    了解 Compose 编译器、编译器选项和迁移步骤。

### API 参考

*   新的 [Kotlin Gradle 插件 API 参考](https://kotlinlang.org/api/kotlin-gradle-plugin) –
    探索 Kotlin Gradle 插件和 Compose 编译器 Gradle 插件的 API 参考。

### 多平台开发

*   新的 [构建 Kotlin 库以用于多平台](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html) 页面 –
    了解如何为 Kotlin Multiplatform 设计你的 Kotlin 库。
*   新的 [Kotlin Multiplatform 简介](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 页面 – 了解 Kotlin Multiplatform 的关键概念、依赖项、库等。
*   更新的 [Kotlin Multiplatform 概览](multiplatform.topic) 页面 – 浏览 Kotlin Multiplatform 的要点和常见用例。
*   新的 [iOS 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-integration-overview.html) 部分 – 了解如何将 Kotlin Multiplatform 共享模块集成到你的 iOS 应用中。
*   新的 [Kotlin/Native 的定义文件](native-definition-file.md) 页面 – 了解如何创建定义文件以使用 C 和 Objective-C 库。
*   [WASI 入门](wasm-wasi.md) –
    了解如何在各种 WebAssembly 虚拟机中使用 WASI 运行简单的 Kotlin/Wasm 应用程序。

### 工具

*   [新的 Dokka 迁移指南](dokka-migration.md) – 了解如何迁移到 Dokka Gradle 插件 v2。

## Kotlin 2.1.0 兼容性指南

Kotlin 2.1.0 是一个特性版本，因此
可能会带来与你为早期语言版本编写的代码不兼容的更改。
在 [Kotlin 2.1.0 兼容性指南](compatibility-guide-21.md) 中找到这些更改的详细列表。

## 安装 Kotlin 2.1.0

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为
捆绑插件包含在你的 IDE 中。这意味着你无法再从 JetBrains Marketplace 安装插件。

要更新到新的 Kotlin 版本，请在你的构建脚本中将 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version) 为 2.1.0。