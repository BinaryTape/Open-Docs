[//]: # (title: Kotlin 2.1.0 新特性)

_[发布日期：2024 年 11 月 27 日](releases.md#release-details)_

Kotlin 2.1.0 版本现已发布！以下是主要亮点：

*   **新语言特性预览**：[带主题的 `when` 表达式中的守卫条件](#guard-conditions-in-when-with-a-subject)、[非局部 `break` 和 `continue`](#non-local-break-and-continue) 以及[多美元符号字符串内插](#multi-dollar-string-interpolation)。
*   **K2 编译器更新**：[编译器检测的更多灵活性](#extra-compiler-checks)和 [kapt 实现的改进](#improved-k2-kapt-implementation)。
*   **Kotlin Multiplatform**：引入了 [Swift 导出的基本支持](#basic-support-for-swift-export)、[用于编译器选项的稳定 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable) 等。
*   **Kotlin/Native**：[改进了对 `iosArm64` 的支持](#iosarm64-promoted-to-tier-1)以及其他更新。
*   **Kotlin/Wasm**：多项更新，包括[支持增量编译](#support-for-incremental-compilation)。
*   **Gradle 支持**：[改进了与更新版 Gradle 和 Android Gradle 插件的兼容性](#gradle-improvements)，以及 [Kotlin Gradle 插件 API 的更新](#new-api-for-kotlin-gradle-plugin-extensions)。
*   **文档**：[Kotlin 文档的显著改进](#documentation-updates)。

## IDE 支持

支持 2.1.0 的 Kotlin 插件已捆绑在最新版 IntelliJ IDEA 和 Android Studio 中。你无需更新 IDE 中的 Kotlin 插件。你只需在构建脚本中将 Kotlin 版本更改为 2.1.0 即可。

关于详情，请参见[更新到新的 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

在发布了带 K2 编译器的 Kotlin 2.0.0 之后，JetBrains 团队正致力于通过新特性来改进该语言。在此版本中，我们很高兴宣布多项新的语言设计改进。

这些特性在预览版中可用，我们鼓励你试用并分享你的反馈：

*   [带主题的 `when` 表达式中的守卫条件](#guard-conditions-in-when-with-a-subject)
*   [非局部 `break` 和 `continue`](#non-local-break-and-continue)
*   [多美元符号内插：改进了字符串字面值中美元符号 (`$`) 的处理方式](#multi-dollar-string-interpolation)

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
        // 仅包含主条件的分支。当 `animal` 为 `Dog` 时调用 `feedDog()`
        is Animal.Dog -> animal.feedDog()
        // 同时包含主条件和守卫条件的分支。当 `animal` 为 `Cat` 且不是 `mouseHunter` 时调用 `feedCat()`
        is Animal.Cat if !animal.mouseHunter -> animal.feedCat()
        // 如果上述条件均不匹配，则打印 “Unknown animal”
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
        if (variable == 0) return true // 如果变量为零，则返回 true
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
此特性在需要多个美元符号的场景中非常有用，
例如模板引擎、JSON 模式或其他数据格式。

Kotlin 中的字符串内插使用单个美元符号。
然而，在字符串中使用字面美元符号（这在金融数据和模板系统中很常见）需要像 `${'$'}` 这样的变通方法。
启用多美元符号内插特性后，你可以配置需要多少个美元符号才能触发内插，
较少的美元符号将被视为字符串字面值。

下面是一个使用 `$$` 通过占位符生成 JSON 模式多行字符串的示例：

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

在此示例中，起始的 `$$` 意味着你需要**两个美元符号** (`$$`) 来触发内插。
这可以防止 `$schema`、`$id` 和 `$dynamicAnchor` 被解释为内插标记。

当处理使用美元符号作为占位符语法的系统时，这种方法特别有用。

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

如果你的代码已使用单个美元符号的标准字符串内插，则无需进行任何更改。
每当你需要在字符串中使用字面美元符号时，都可以使用 `$$`。

### 支持要求选择加入以扩展 API

Kotlin 2.1.0 引入了 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解，
它允许库作者要求用户在实现实验性接口或扩展实验性类之前进行显式选择加入。

当库 API 足够稳定可以但可能因新的抽象函数而演变，从而使其在继承方面不稳定时，此特性会很有用。

要向 API 元素添加选择加入要求，请使用 `@SubclassOptInRequired`
注解并引用该注解类：

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

在此示例中，`CoreLibraryApi` 接口要求用户在实现它之前选择加入。
用户可以这样选择加入：

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

> 当你使用 `@SubclassOptInRequired` 注解要求选择加入时，
> 此要求不会传播到任何[内部或嵌套类](nested-classes.md)。
>
{style="note"}

有关如何在你的 API 中使用 `@SubclassOptInRequired` 注解的实际示例，
请查看 `kotlinx.coroutines` 库中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 接口。

### 改进了带泛型类型的函数的重载解析

以前，如果你有一个函数的多个重载，其中一些具有泛型类型的值形参，而另一些在相同位置具有函数类型，则解析行为有时会不一致。

这导致了不同的行为，具体取决于你的重载是成员函数还是扩展函数。
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
    kvs.store("", 1)    // 解析到 1
    kvs.store("") { 1 } // 解析到 2

    // Extension functions
    kvs.storeExtension("", 1)    // 解析到 1
    kvs.storeExtension("") { 1 } // 无法解析
}
```

在此示例中，`KeyValueStore` 类有两个 `store()` 函数的重载，
其中一个重载具有泛型类型 `K` 和 `V` 的函数形参，
而另一个具有返回泛型类型 `V` 的 lambda 函数。
同样，扩展函数 `storeExtension()` 也有两个重载。

当 `store()` 函数在带和不带 lambda 函数的情况下被调用时，
编译器成功解析了正确的重载。
然而，当扩展函数 `storeExtension()` 在带 lambda 函数的情况下被调用时，
编译器没有解析正确的重载，因为它错误地认为两个重载都适用。

为了解决此问题，我们引入了一种新的启发式方法，以便编译器可以在具有泛型类型的函数形参无法根据来自不同实参的信息接受 lambda 函数时，丢弃可能的重载。
此更改使成员函数和扩展函数的行为保持一致，
并且在 Kotlin 2.1.0 中默认启用。

### 改进了 `when` 表达式中带密封类的穷尽性检测

在以前的 Kotlin 版本中，编译器要求 `when`
表达式中带密封上限的类型形参需要 `else` 分支，即使 `sealed class` 层次结构中的所有情况都已覆盖。
Kotlin 2.1.0 解决了并改进了此行为，
使穷尽性检测更加强大，并允许你移除冗余的 `else` 分支，
从而使 `when` 表达式更简洁、更直观。

下面是一个演示此更改的示例：

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // 无需 `else` 分支
}
```

## Kotlin K2 编译器

随着 Kotlin 2.1.0 的发布，K2 编译器现在提供了[编译器检测](#extra-compiler-checks)
和[警告](#global-warning-suppression)方面更大的灵活性，以及[对 kapt 插件的改进支持](#improved-k2-kapt-implementation)。

### 额外的编译器检测

借助 Kotlin 2.1.0，你现在可以在 K2 编译器中启用额外的检测。
这些是额外的声明、表达式和类型检测，通常对编译并不关键，
但如果你想验证以下情况，仍然会很有用：

| 检测类型 | 注释 |
|:------------------------------------------------------|:-----------------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE` | 使用了 `Boolean??` 而非 `Boolean?` |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN` | 使用了 `java.lang.String` 而非 `kotlin.String` |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | 使用了 `arrayOf("") == arrayOf("")` 而非 `arrayOf("").contentEquals(arrayOf(""))` |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD` | 使用了 `42.toInt()` 而非 `42` |
| `USELESS_CALL_ON_NOT_NULL` | 使用了 `"".orEmpty()` 而非 `""` |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE` | 使用了 `"$string"` 而非 `string` |
| `UNUSED_ANONYMOUS_PARAMETER` | 在 lambda 表达式中传递了一个形参但从未被使用 |
| `REDUNDANT_VISIBILITY_MODIFIER` | 使用了 `public class Klass` 而非 `class Klass` |
| `REDUNDANT_MODALITY_MODIFIER` | 使用了 `final class Klass` 而非 `class Klass` |
| `REDUNDANT_SETTER_PARAMETER_TYPE` | 使用了 `set(value: Int)` 而非 `set(value)` |
| `CAN_BE_VAL` | 定义了 `var local = 0` 但从未重新赋值，可以改为 `val local = 42` |
| `ASSIGNED_VALUE_IS_NEVER_READ` | 定义了 `val local = 42` 但之后在代码中从未被使用 |
| `UNUSED_VARIABLE` | 定义了 `val local = 0` 但在代码中从未被使用 |
| `REDUNDANT_RETURN_UNIT_TYPE` | 使用了 `fun foo(): Unit {}` 而非 `fun foo() {}` |
| `UNREACHABLE_CODE` | 存在代码语句但永远不会被执行 |

如果检测结果为真，你将收到一个编译器警告，其中包含如何解决此问题的建议。

额外检测默认禁用。
要启用它们，请在命令行中使用 `-Wextra` 编译器选项，或在 Gradle 构建文件的 `compilerOptions {}` 代码块中指定 `extraWarnings`：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

有关如何定义和使用编译器选项的更多信息，
请参见 [Kotlin Gradle 插件中的编译器选项](gradle-compiler-options.md)。

### 全局警告抑制

在 2.1.0 中，Kotlin 编译器收到了一项呼声很高的特性——全局抑制警告的能力。

你现在可以通过在命令行中使用 `-Xsuppress-warning=WARNING_NAME`
语法或在构建文件的 `compilerOptions {}` 代码块中使用 `freeCompilerArgs` 属性来抑制整个项目中的特定警告。

例如，如果你的项目中启用了[额外编译器检测](#extra-compiler-checks)但又想抑制其中一个，请使用：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

如果你想抑制某个警告但不知道其名称，请选择该元素并点击灯泡图标（或使用 <shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>）：

![警告名称意图](warning-name-intention.png){width=500}

新的编译器选项目前是[实验性的](components-stability.md#stability-levels-explained)。
以下详情也值得注意：

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

> K2 编译器的 kapt 插件 (K2 kapt) 处于 [Alpha](components-stability.md#stability-levels-explained) 阶段。
> 它随时可能更改。
>
> 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) 中提供你的反馈。
>
{style="warning"}

目前，使用 [kapt](kapt.md) 插件的项目默认使用 K1 编译器，
支持 Kotlin 版本最高达 1.9。

在 Kotlin 1.9.20 中，我们推出了带 K2 编译器的 kapt 插件 (K2 kapt) 的实验性实现。
我们现在改进了 K2 kapt 的内部实现，以缓解技术和性能问题。

虽然新的 K2 kapt 实现没有引入新特性，
但其性能与之前的 K2 kapt 实现相比已显著提高。
此外，K2 kapt 插件的行为现在更接近于 K1 kapt。

要使用新的 K2 kapt 插件实现，请像启用之前的 K2 kapt 插件一样启用它。
将以下选项添加到你的项目的 `gradle.properties` 文件中：

```kotlin
kapt.use.k2=true
```

在即将发布的版本中，K2 kapt 实现将默认启用，取代 K1 kapt，
因此你将不再需要手动启用它。

在新实现稳定之前，我们非常感谢你的[反馈](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### 解决无符号类型与非原语类型之间的重载冲突

此版本解决了以前版本中可能发生的无符号类型与非原语类型之间重载冲突的问题，
示例如下：

#### 重载扩展函数

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // 在 Kotlin 2.1.0 之前存在重载解析歧义
}
```

在早期版本中，调用 `uByte.doStuff()` 导致歧义，因为 `Any` 和 `UByte` 扩展都适用。

#### 重载顶层函数

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // 在 Kotlin 2.1.0 之前存在重载解析歧义
}
```

类似地，对 `doStuff(uByte)` 的调用也存在歧义，因为编译器无法决定是使用 `Any` 版本还是 `UByte` 版本。
在 2.1.0 中，编译器现在可以正确处理这些情况，通过优先选择更具体的类型（在此情况下是 `UByte`）来解决歧义。

## Kotlin/JVM

从 2.1.0 版本开始，编译器可以生成包含 Java 23 字节码的类。

### JSpecify 可空性不匹配诊断级别更改为严格

Kotlin 2.1.0 强制严格处理来自 `org.jspecify.annotations` 的可空性注解，
从而提高了 Java 互操作的类型安全。

以下可空性注解受影响：

*   `org.jspecify.annotations.Nullable`
*   `org.jspecify.annotations.NonNull`
*   `org.jspecify.annotations.NullMarked`
*   `org.jspecify.nullness` 中的旧式注解（JSpecify 0.2 及更早版本）

从 Kotlin 2.1.0 开始，可空性不匹配默认从警告提升为错误。
这确保了像 `@NonNull` 和 `@Nullable` 这样的注解在类型检测期间得到强制执行，
从而防止运行时出现意外的可空性问题。

`@NullMarked` 注解还会影响其作用域内所有成员的可空性，
从而使你在处理带注解的 Java 代码时，行为更具可预测性。

下面是一个演示新默认行为的示例：

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
    // 访问非空结果，这是允许的
    sjc.foo().length

    // 在默认严格模式下会引发错误，因为结果是可空的
    // 为避免此错误，请改用 ?.length
    sjc.bar().length
}
```

你可以手动控制这些注解的诊断严重级别。
为此，请使用 `-Xnullability-annotations` 编译器选项选择一种模式：

*   `ignore`：忽略可空性不匹配。
*   `warning`：报告可空性不匹配的警告。
*   `strict`：报告可空性不匹配的错误（默认模式）。

有关更多信息，请参见[可空性注解](java-interop.md#nullability-annotations)。

## Kotlin Multiplatform

Kotlin 2.1.0 引入了[对 Swift 导出的基本支持](#basic-support-for-swift-export)，并使得[发布 Kotlin Multiplatform 库变得更容易](#ability-to-publish-kotlin-libraries-from-any-host)。
它还侧重于围绕 Gradle 的改进，这些改进稳定了[用于配置编译器选项的新 DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable) 并带来了 [Isolated Projects 特性的预览](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

### 用于多平台项目中编译器选项的新 Gradle DSL 已升级到稳定版

在 Kotlin 2.0.0 中，[我们引入了一个新的实验性 Gradle DSL](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)，
以简化跨多平台项目的编译器选项配置。
在 Kotlin 2.1.0 中，此 DSL 已升级到稳定版。

整个项目配置现在分为三层。最高层是扩展层，
其次是目标层，最低层是编译单元（通常是一个编译任务）：

![Kotlin 编译器选项级别](compiler-options-levels.svg){width=700}

要了解有关不同级别以及如何在它们之间配置编译器选项的更多信息，
请参见[编译器选项](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#compiler-options)。

### 预览 Kotlin Multiplatform 中的 Gradle Isolated Projects

> 此特性是[实验性的](components-stability.md#stability-levels-explained)，目前在 Gradle 中处于 pre-Alpha 阶段。
> 仅在 Gradle 8.10 版本中使用，并且仅用于评估目的。此特性随时可能被移除或更改。
>
> 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中提供反馈。
> 需要选择加入（详见下文）。
>
{style="warning"}

在 Kotlin 2.1.0 中，
你可以在多平台项目中预览 Gradle 的 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 特性。

Gradle 中的 Isolated Projects 特性通过“隔离”
各个 Gradle 项目的配置来提高构建性能。
每个项目的构建逻辑被限制为不能直接访问其他项目的可变状态，
从而使它们可以安全地并行运行。
为了支持此特性，我们对 Kotlin Gradle 插件的模型进行了一些更改，
我们有兴趣听取你在此预览阶段的体验。

有两种方法可以启用 Kotlin Gradle 插件的新模型：

*   选项 1：**在不启用 Isolated Projects 的情况下测试兼容性** –
    要在不启用 Isolated Projects 特性的情况下检查与 Kotlin Gradle 插件新模型的兼容性，
    请在你的项目的 `gradle.properties` 文件中添加以下 Gradle 属性：

    ```none
    # gradle.properties
    kotlin.kmp.isolated-projects.support=enable
    ```

*   选项 2：**在启用 Isolated Projects 的情况下测试** –
    在 Gradle 中启用 Isolated Projects 特性会自动配置 Kotlin Gradle 插件以使用新模型。
    要启用 Isolated Projects 特性，请[设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。
    在这种情况下，你无需向项目添加 Kotlin Gradle 插件的 Gradle 属性。

### 对 Swift 导出的基本支持

> 此特性目前处于开发的早期阶段。它随时可能被移除或更改。
> 需要选择加入（详见下文），并且你应仅将其用于评估目的。
> 欢迎在 [YouTrack](https://kotl.in/issue) 中提供反馈。
>
{style="warning"}

2.1.0 版本迈出了在 Kotlin 中提供 Swift 导出支持的第一步，
允许你将 Kotlin 源代码直接导出到 Swift 接口，而无需使用 Objective-C 头文件。
这应该会使 Apple 目标的多平台开发更加容易。

当前的基本支持包括能够：

*   将多个 Gradle 模块从 Kotlin 直接导出到 Swift。
*   使用 `moduleName` 属性定义自定义 Swift 模块名称。
*   使用 `flattenPackage` 属性为包结构设置折叠规则。

你可以在项目中使用以下构建文件作为设置 Swift 导出的起点：

```kotlin
// build.gradle.kts 
kotlin {

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    @OptIn(ExperimentalSwiftExportDsl::class)
    swiftExport {
        // 根模块名称
        moduleName = "Shared"

        // 折叠规则
        // 从生成的 Swift 代码中移除包前缀
        flattenPackage = "com.example.sandbox"

        // 导出外部模块
        export(project(":subproject")) {
            // 导出模块名称
            moduleName = "Subproject"
            // 折叠导出的依赖项规则
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

请记住，此特性目前仅处于开发的早期阶段。

Swift 导出目前适用于使用
[直接集成](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html)将 iOS 框架连接到 Xcode 项目的项目。
这是在 Android Studio 或通过 [web 向导](https://kmp.jetbrains.com/)创建的 Kotlin Multiplatform 项目的标准配置。

要在你的项目中试用 Swift 导出：

1.  将以下 Gradle 选项添加到你的 `gradle.properties` 文件中：

    ```none
    # gradle.properties
    kotlin.experimental.swift-export.enabled=true
    ```

2.  在 Xcode 中，打开项目设置。
3.  在 **Build Phases** 选项卡上，找到带有 `embedAndSignAppleFrameworkForXcode` 任务的 **Run Script** 阶段。
4.  调整脚本，改为在运行脚本阶段中包含 `embedSwiftExportForXcode` 任务：

    ```bash
    ./gradlew :<共享模块名称>:embedSwiftExportForXcode
    ```

    ![添加 Swift 导出脚本](xcode-swift-export-run-script-phase.png){width=700}

#### 留下关于 Swift 导出的反馈

我们计划在未来的 Kotlin 版本中扩展和稳定 Swift 导出支持。
请在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-64572)中留下你的反馈。

### 从任何主机发布 Kotlin 库的能力

> 此特性目前是[实验性的](components-stability.md#stability-levels-explained)。
> 需要选择加入（详见下文），并且你应仅将其用于评估目的。
> 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中提供反馈。
>
{style="warning"}

Kotlin 编译器生成 `.klib` 构件用于发布 Kotlin 库。
以前，你可以从任何主机获取必要的构件，但 Apple 平台目标除外，它们需要 Mac 机器。
这给面向 iOS、macOS、tvOS 和 watchOS 目标的 Kotlin Multiplatform 项目带来了特殊限制。

Kotlin 2.1.0 解除了此限制，增加了对交叉编译的支持。
现在你可以使用任何[受支持的主机](native-target-support.md#hosts)来生成 `.klib` 构件，
这应该会大大简化 Kotlin 和 Kotlin Multiplatform 库的发布过程。

#### 如何启用从任何主机发布库

要在项目中试用交叉编译，请将以下二进制选项添加到你的 `gradle.properties` 文件中：

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

此特性目前是实验性的，并且有一些限制。如果你符合以下情况，你仍然需要使用 Mac 机器：

*   你的库有 [cinterop 依赖项](native-c-interop.md)。
*   你的项目中设置了 [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)。
*   你需要为 Apple 目标构建或测试[最终二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。

#### 留下关于从任何主机发布库的反馈

我们计划在未来的 Kotlin 版本中稳定此特性并进一步改进库发布。
请在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中留下你的反馈。

有关更多信息，请参见[发布多平台库](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)。

### 支持非打包 klib

Kotlin 2.1.0 使得生成非打包的 `.klib` 文件构件成为可能。
这使你能够直接配置对 klib 的依赖项，而无需先解包它们。

此更改还可以提高性能，
减少 Kotlin/Wasm、Kotlin/JS 和 Kotlin/Native 项目中的编译和链接时间。

例如，
我们的基准测试显示，在一个包含 1 个链接任务和 10 个编译任务的项目中，总构建时间约有 3% 的性能提升
（该项目构建一个依赖于 9 个简化项目的单个原生可执行二进制文件）。
然而，对构建时间的实际影响取决于子项目的数量及其各自的大小。

#### 如何设置你的项目

默认情况下，Kotlin 编译和链接任务现在配置为使用新的非打包构件。

如果你已设置自定义构建逻辑来解析 klib 并希望使用新的非打包构件，
你需要在 Gradle 构建文件中显式指定 klib 包解析的首选变体：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {

    // 对于新的非打包配置：
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // 对于以前的打包配置：
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.PACKED))
}
```

非打包的 `.klib` 文件在项目的构建目录中生成，路径与以前打包文件相同。
反过来，打包的 klib 现在位于 `build/libs` 目录中。

如果未指定属性，则使用打包变体。
你可以使用以下控制台命令检查可用属性和变体的列表：

```shell
./gradlew outgoingVariants
```

欢迎在 [YouTrack](https://kotl.in/issue) 中提供此特性的反馈。

### 旧 `android` 目标的进一步弃用

在 Kotlin 2.1.0 中，旧 `android` 目标名称的弃用警告已升级为错误。

目前，我们建议在面向 Android 的 Kotlin Multiplatform 项目中使用 `androidTarget` 选项。
这是一个临时解决方案，旨在为即将推出的 Google Android/KMP 插件释放 `android` 名称。

新插件可用时，我们将提供进一步的迁移说明。
Google 的新 DSL 将成为 Kotlin Multiplatform 中 Android 目标支持的首选选项。

有关更多信息，
请参见 [Kotlin Multiplatform 兼容性指南](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#rename-of-android-target-to-androidtarget)。

### 移除了对声明多个同类型目标的支持

在 Kotlin 2.1.0 之前，你可以在多平台项目中声明多个同类型目标。
然而，这使得区分目标和有效支持共享源代码集变得具有挑战性。
在大多数情况下，更简单的设置（例如使用单独的 Gradle 项目）效果更好。
有关详细指导和迁移示例，
请参见 Kotlin Multiplatform 兼容性指南中的[声明多个相似目标](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#declaring-several-similar-targets)。

如果你的多平台项目中声明了多个同类型目标，Kotlin 1.9.20 会触发弃用警告。
在 Kotlin 2.1.0 中，此弃用警告现在对于除 Kotlin/JS 目标之外的所有目标都是错误。
要了解有关 Kotlin/JS 目标为何豁免的更多信息，
请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的此问题。

## Kotlin/Native

Kotlin 2.1.0 包含了 [`iosArm64` 目标支持的升级](#iosarm64-promoted-to-tier-1)、
[改进的 cinterop 缓存过程](#changes-to-caching-in-cinterop)以及其他更新。

### `iosArm64` 升级为一级支持

对 [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 开发至关重要的 `iosArm64` 目标已升级为一级支持。
这是 Kotlin/Native 编译器中最高级别的支持。

这意味着该目标会在 CI 流水线上定期进行测试，以确保其能够编译和运行。
我们还为该目标提供了编译器版本之间的源和二进制兼容性。

有关目标层级的更多信息，请参见 [Kotlin/Native 目标支持](native-target-support.md)。

### LLVM 从 11.1.0 更新到 16.0.0

在 Kotlin 2.1.0 中，我们将 LLVM 从 11.1.0 版本更新到 16.0.0。
新版本包括错误修复和安全更新。
在某些情况下，它还提供了编译器优化和更快的编译速度。

如果你的项目中有 Linux 目标，
请注意 Kotlin/Native 编译器现在默认对所有 Linux 目标使用 `lld` 链接器。

此更新不应影响你的代码，但如果你遇到任何问题，请向我们的[问题跟踪器](http://kotl.in/issue)报告。

### cinterop 缓存的更改

在 Kotlin 2.1.0 中，我们正在更改 cinterop 缓存过程。它不再具有
[`CacheableTask`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/CacheableTask.html) 注解类型。
新的推荐方法是使用 [`cacheIf`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.tasks/-task-outputs/cache-if.html)
输出类型来缓存任务结果。

这应该可以解决 `UP-TO-DATE`
检测未能检测到 [定义文件](native-definition-file.md) 中指定的头文件更改的问题，
从而防止构建系统重新编译代码。

### 弃用 mimalloc 内存分配器

早在 Kotlin 1.9.0 中，我们引入了新的内存分配器，然后在 Kotlin 1.9.20 中默认启用了它。
新的分配器旨在提高垃圾回收效率
并改善 Kotlin/Native 内存管理器的运行时性能。

新的内存分配器取代了之前的默认分配器 [mimalloc](https://github.com/microsoft/mimalloc)。
现在，是时候在 Kotlin/Native 编译器中弃用 mimalloc 了。

你现在可以从构建脚本中移除 `-Xallocator=mimalloc` 编译器选项。
如果你遇到任何问题，请向我们的[问题跟踪器](http://kotl.in/issue)报告。

有关 Kotlin 中内存分配器和垃圾回收的更多信息，
请参见 [Kotlin/Native 内存管理](native-memory-manager.md)。

## Kotlin/Wasm

Kotlin/Wasm 收到了多项更新，并[支持增量编译](#support-for-incremental-compilation)。

### 支持增量编译

以前，当你更改 Kotlin 代码中的某些内容时，Kotlin/Wasm 工具链必须重新编译整个代码库。

从 2.1.0 开始，Wasm 目标支持增量编译。
在开发任务中，编译器现在只重新编译与上次编译更改相关的文件，
这显著减少了编译时间。

此更改目前使编译速度提高了一倍，并计划在未来版本中进一步改进。

在当前设置中，Wasm 目标的增量编译默认禁用。
要启用增量编译，请将以下行添加到你的项目的 `local.properties` 或 `gradle.properties` 文件中：

```none
# gradle.properties
kotlin.incremental.wasm=true
```

试用 Kotlin/Wasm 增量编译
并[分享你的反馈](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。
你的见解将有助于更快地使此特性稳定并默认启用。

### 浏览器 API 已移至 kotlinx-browser 独立库

以前，Web API 和相关目标工具的声明是 Kotlin/Wasm 标准库的一部分。

在此版本中，`org.w3c.*`
声明已从 Kotlin/Wasm 标准库移至新的 [kotlinx-browser 库](https://github.com/kotlin/kotlinx-browser)。
此库还包括其他与 Web 相关的包，例如 `org.khronos.webgl`、`kotlin.dom` 和 `kotlinx.browser`。

这种分离提供了模块化，支持在 Kotlin 发布周期之外独立更新与 Web 相关的 API。
此外，Kotlin/Wasm 标准库现在只包含在任何 JavaScript 环境中可用的声明。

要使用已移动包中的声明，
你需要将 `kotlinx-browser` 依赖项添加到你的项目的构建配置文件中：

```kotlin
// build.gradle.kts
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```

### 改进的 Kotlin/Wasm 调试体验

以前，在 Web 浏览器中调试 Kotlin/Wasm 代码时，你可能会在调试界面中遇到
变量值的低级表示形式。
这通常使得跟踪应用程序的当前状态变得具有挑战性。

![Kotlin/Wasm 旧调试器](wasm-old-debugger.png){width=700}

为改善此体验，变量视图中添加了自定义格式化程序。
此实现使用了 [自定义格式化程序 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)，
该 API 受 Firefox 和基于 Chromium 的主要浏览器支持。

通过此更改，你现在可以以更用户友好和易于理解的方式显示和定位变量值。

![改进的 Kotlin/Wasm 调试器](wasm-debugger-improved.png){width=700}

要试用新的调试体验：

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

2.  在浏览器中启用自定义格式化程序：

    *   在 Chrome DevTools 中，可通过 **Settings | Preferences | Console** 访问：

        ![在 Chrome 中启用自定义格式化程序](wasm-custom-formatters-chrome.png){width=700}

    *   在 Firefox DevTools 中，可通过 **Settings | Advanced settings** 访问：

        ![在 Firefox 中启用自定义格式化程序](wasm-custom-formatters-firefox.png){width=700}

### 减小 Kotlin/Wasm 二进制文件大小

生产构建生成的 Wasm 二进制文件大小将减少高达 30%，
你可能会看到一些性能改进。
这是因为 `--closed-world`、`--type-ssa` 和 `--type-merging`
Binaryen 选项现在被认为对所有 Kotlin/Wasm 项目都安全可用，并且默认启用。

### 改进了 Kotlin/Wasm 中的 JavaScript 数组互操作性

虽然 Kotlin/Wasm 的标准库为 JavaScript 数组提供了 `JsArray<T>` 类型，
但没有直接的方法将 `JsArray<T>` 转换为 Kotlin 的原生 `Array` 或 `List` 类型。

此空白需要创建用于数组转换的自定义函数，使 Kotlin 和 JavaScript 代码之间的互操作性复杂化。

此版本引入了一个适配器函数，可自动将 `JsArray<T>` 转换为 `Array<T>`，反之亦然，
从而简化了数组操作。

下面是一个泛型类型之间转换的示例：Kotlin `List<T>` 和 `Array<T>` 到 JavaScript `JsArray<T>`。

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// 使用 .toJsArray() 将 List 或 Array 转换为 JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// 使用 .toArray() 和 .toList() 将其转换回 Kotlin 类型 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

类似的方法可用于将类型化数组转换为其 Kotlin 等效项
（例如 `IntArray` 和 `Int32Array`）。有关详细信息和实现，
请参见 [`kotlinx-browser` 版本库]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

下面是一个类型化数组之间转换的示例：Kotlin `IntArray` 到 JavaScript `Int32Array`。

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // 使用 .toInt32Array() 将 Kotlin IntArray 转换为 JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // 使用 toIntArray() 将 JavaScript Int32Array 转换回 Kotlin IntArray
    val kotlinIntArray: IntArray = jsInt32Array.toIntArray()
```

### 支持在 Kotlin/Wasm 中访问 JavaScript 异常详情

以前，当 Kotlin/Wasm 中发生 JavaScript 异常时，
`JsException` 类型仅提供一个通用消息，而不包含原始 JavaScript 错误的详细信息。

从 Kotlin 2.1.0 开始，你可以通过启用特定的编译器选项来配置 `JsException`，
使其包含原始错误消息和堆栈跟踪。
这提供了更多上下文，有助于诊断源自 JavaScript 的问题。

此行为取决于 `WebAssembly.JSTag` API，该 API 仅在某些浏览器中可用：

*   **Chrome**：从 115 版开始支持
*   **Firefox**：从 129 版开始支持
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

下面是一个演示新行为的示例：

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: 意外的令牌 'a'，"an invalid JSON" 不是有效的 JSON

        println("Message: ${e.message}")
        // 消息: 意外的令牌 'a'，"an invalid JSON" 不是有效的 JSON

        println("Stacktrace:")
        // 堆栈跟踪：

        // 打印完整的 JavaScript 堆栈跟踪 
        e.printStackTrace()
    }
}
```

启用 `-Xwasm-attach-js-exception` 选项后，`JsException` 会提供 JavaScript 错误的具体详细信息。
如果未启用此选项，`JsException` 只会包含一条通用消息，说明在运行 JavaScript 代码时抛出了异常。

### 弃用默认导出

作为迁移到命名导出的一部分，
以前在 JavaScript 中对 Kotlin/Wasm 导出使用默认导入时，控制台会打印错误。

在 2.1.0 中，默认导入已完全移除，以全面支持命名导出。

现在，当为 Kotlin/Wasm 目标编写 JavaScript 代码时，你需要使用相应的命名导入而不是默认导入。

此更改标志着迁移到命名导出的弃用周期的最后阶段：

**在 2.0.0 版本中：** 控制台会打印一条警告消息，解释通过默认导出方式导出实体已被弃用。

**在 2.0.20 版本中：** 发生错误，要求使用相应的命名导入。

**在 2.1.0 版本中：** 默认导入的使用已完全移除。

### 子项目特有的 Node.js 设置

你可以通过为 `rootProject` 定义 `NodeJsRootPlugin` 类的属性来配置项目的 Node.js 设置。
在 2.1.0 中，你可以使用新类 `NodeJsPlugin` 为每个子项目配置这些设置。
下面是一个演示如何为子项目设置特定 Node.js 版本的示例：

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

以前，Kotlin/JS 不允许使用以反引号括起来的带空格的[测试方法名称](coding-conventions.md#names-for-test-methods)。

同样，也无法访问包含 Kotlin 标识符中不允许的字符（例如连字符或空格）的 JavaScript 对象属性：

```kotlin
external interface Headers {
    var accept: String?

    // 因连字符而导致的无效 Kotlin 标识符
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// 因属性名称中的连字符而导致错误
val length = headers.`content-length`
```

此行为与 JavaScript 和 TypeScript 不同，它们允许使用非标识符字符访问此类属性。

从 Kotlin 2.1.0 开始，此特性默认启用。
Kotlin/JS 现在允许你使用反引号 (``) 和 `@JsName` 注解
来与包含非标识符字符的 JavaScript 属性进行交互，并使用测试方法名称。

此外，
你可以使用 `@JsName` 和 `@JsQualifier` 注解将 Kotlin 属性名称映射到 JavaScript 等效项：

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
    // 在 JavaScript 中，这会编译成 Bar.property_example_HASH
    println(Bar.`property example`)
    // 在 JavaScript 中，这会编译成 fooNamespace["property example"]
    println(Foo.`property example`)
    // 在 JavaScript 中，这会编译成 Baz["property example"]
    println(Baz.`property example`)
}
```

### 支持生成 ES2015 箭头函数

在 Kotlin 2.1.0 中，Kotlin/JS 引入了对生成 ES2015 箭头函数（例如 `(a, b) => expression`）的支持，
而非匿名函数。

使用箭头函数可以减小项目的捆绑包大小，
尤其是在使用实验性的 `-Xir-generate-inline-anonymous-functions` 模式时。
这也使得生成的代码更符合现代 JS 规范。

此特性在面向 ES2015 时默认启用。
或者，你可以通过使用 `-Xes-arrow-functions` 命令行参数来启用它。

在[官方文档](https://262.ecma-international.org/6.0/)中了解有关 [ES2015 (ECMAScript 2015, ES6)] 的更多信息。

## Gradle 改进

Kotlin 2.1.0 完全兼容 Gradle 7.6.3 到 8.6。
Gradle 8