---
title: "Kotlin 2.1.0 中的新增功能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已发布：2024 年 11 月 27 日](releases#release-details)_

Kotlin 2.1.0 版本已发布！以下是主要亮点：

* **预览中的新语言特性**：[带有主语的 `when` 表达式中的守卫条件](#guard-conditions-in-when-with-a-subject)，
  [非局部 `break` 和 `continue`](#non-local-break-and-continue)，以及 [多美元字符串插值](#multi-dollar-string-interpolation)。
* **K2 编译器更新**：[围绕编译器检查的更多灵活性](#extra-compiler-checks) 和 [对 kapt 实现的改进](#improved-k2-kapt-implementation)。
* **Kotlin 多平台（Kotlin Multiplatform）**：引入了 [对 Swift 导出的基本支持](#basic-support-for-swift-export)，
  [用于编译器选项的稳定的 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)，以及更多。
* **Kotlin/Native**：[改进了对 `iosArm64` 的支持](#iosarm64-promoted-to-tier-1) 和其他更新。
* **Kotlin/Wasm**：多项更新，包括 [对增量编译的支持](#support-for-incremental-compilation)。
* **Gradle 支持**：[提高了与较新版本 Gradle 和 Android Gradle 插件的兼容性](#gradle-improvements)，
  以及 [Kotlin Gradle 插件 API 的更新](#new-api-for-kotlin-gradle-plugin-extensions)。
* **文档**：[Kotlin 文档的重大改进](#documentation-updates)。

## IDE 支持

支持 2.1.0 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
你无需在 IDE 中更新 Kotlin 插件。
你只需在构建脚本中将 Kotlin 版本更改为 2.1.0 即可。

有关详细信息，请参见 [更新到新的 Kotlin 版本](releases#update-to-a-new-kotlin-version)。

## 语言

在发布了带有 K2 编译器的 Kotlin 2.0.0 之后，JetBrains 团队正专注于通过新特性来改进语言。
在此版本中，我们很高兴地宣布几项新的语言设计改进。

这些特性以预览版提供，我们鼓励你尝试它们并分享你的反馈：

* [带有主语的 `when` 表达式中的守卫条件](#guard-conditions-in-when-with-a-subject)
* [非局部 `break` 和 `continue`](#non-local-break-and-continue)
* [多美元插值：改进了字符串字面量中 `$` 的处理](#multi-dollar-string-interpolation)

:::note
所有特性都在最新的 2024.3 版本的 IntelliJ IDEA 中启用了 K2 模式的 IDE 支持。

在 [IntelliJ IDEA 2024.3 博客文章](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/) 中了解更多信息。

[查看 Kotlin 语言设计特性和提案的完整列表](kotlin-language-features-and-proposals)。

此版本还带来了以下语言更新：

* [](#support-for-requiring-opt-in-to-extend-apis)
* [](#improved-overload-resolution-for-functions-with-generic-types)
* [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### 带有主语的 when 表达式中的守卫条件

此特性为 [预览版](kotlin-evolution-principles#pre-stable-features)，
并且需要选择启用（请参见以下详细信息）。

我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140) 中提供的反馈。

从 2.1.0 开始，你可以在带有主语的 `when` 表达式或语句中使用守卫条件。

守卫条件允许你为 `when` 表达式的分支包含多个条件，
从而使复杂的控制流更明确、更简洁，并展平代码结构。

要在分支中包含守卫条件，请将其放在主条件之后，用 `if` 分隔：

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
        // 仅具有主条件的分支。当 `Animal` 为 `Dog` 时返回 `feedDog()`
        is Animal.Dog `->` animal.feedDog()
        // 具有主条件和守卫条件的分支。当 `Animal` 为 `Cat` 且不是 `mouseHunter` 时返回 `feedCat()`
        is Animal.Cat if !animal.mouseHunter `->` animal.feedCat()
        // 如果以上任何条件都不匹配，则返回 "Unknown animal"
        else `->` println("Unknown animal")
    }
}
```

在单个 `when` 表达式中，你可以组合具有和不具有守卫条件的分支。
只有当主条件和守卫条件都为 `true` 时，才运行带有守卫条件的分支中的代码。
如果主条件不匹配，则不评估守卫条件。
此外，守卫条件支持 `else if`。

要在你的项目中启用守卫条件，请在命令行中使用以下编译器选项：

```bash
kotlinc -Xwhen-guards main.kt
```

或者将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 非局部 break 和 continue

此特性为 [预览版](kotlin-evolution-principles#pre-stable-features)，
并且需要选择启用（请参见以下详细信息）。

我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 中提供的反馈。

Kotlin 2.1.0 添加了另一个期待已久的特性的预览版，即使用非局部 `break` 和 `continue` 的能力。
此特性扩展了你可以在内联函数范围内使用的工具集，并减少了项目中的样板代码。

以前，你只能使用非局部返回。
现在，Kotlin 还支持非局部的 `break` 和 `continue` [跳转表达式](returns)。
这意味着你可以在作为参数传递给包含循环的内联函数的 lambda 表达式中使用它们：

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true // 如果 variable 为零，则返回 true
    }
    return false
}
```

要在你的项目中尝试此特性，请在命令行中使用 `-Xnon-local-break-continue` 编译器选项：

```bash
kotlinc -Xnon-local-break-continue main.kt
```

或者将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

我们计划在未来的 Kotlin 版本中使此特性稳定。
如果你在使用非局部 `break` 和 `continue` 时遇到任何问题，
请将其报告给我们的 [问题跟踪器](https://youtrack.jetbrains.com/issue/KT-1436)。

### 多美元字符串插值

此特性为 [预览版](kotlin-evolution-principles#pre-stable-features)，
并且需要选择启用（请参见以下详细信息）。

我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 中提供的反馈。

Kotlin 2.1.0 引入了对多美元字符串插值的支持，
改进了美元符号 (`$`) 在字符串字面量中的处理方式。
此特性在需要多个美元符号的上下文中非常有用，
例如模板引擎、JSON 模式或其他数据格式。

Kotlin 中的字符串插值使用单个美元符号。
但是，在字符串中使用字面量美元符号（这在金融数据和模板系统中很常见）需要使用诸如 `${'$'}` 之类的解决方法。
启用多美元插值特性后，你可以配置触发插值所需的美元符号数量，
较少的美元符号将被视为字符串字面量。

以下是如何使用 `$` 生成带有占位符的 JSON 模式多行字符串的示例：

```kotlin
val KClass<*>.jsonSchema : String
    get() = $$"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "$${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

在此示例中，初始 `$$` 表示你需要**两个美元符号** (`$$`) 才能触发插值。
它可以防止 `$schema`、`$id` 和 `$dynamicAnchor` 被解释为插值标记。

当与使用美元符号作为占位符语法的系统一起工作时，此方法特别有用。

要启用此特性，请在命令行中使用以下编译器选项：

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者，更新你的 Gradle 构建文件的 `compilerOptions {}` 块：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

如果你的代码已经使用带有单个美元符号的标准字符串插值，则无需进行任何更改。
你可以在需要字符串中的字面量美元符号时随时使用 `$$`。

### 支持要求选择启用以扩展 API

Kotlin 2.1.0 引入了 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解，
它允许库作者要求显式选择启用，然后用户才能实现实验性接口或扩展实验性类。

当库 API 足够稳定可以使用，但可能会随着新的抽象函数而发展时，此特性会很有用，
这使得它对于继承来说是不稳定的。

要将选择启用要求添加到 API 元素，请使用 `@SubclassOptInRequired`
注解，并引用注解类：

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

在此示例中，`CoreLibraryApi` 接口要求用户在实现它之前选择启用。
用户可以像这样选择启用：

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

当你使用 `@SubclassOptInRequired` 注解来要求选择启用时，
该要求不会传播到任何 [内部或嵌套类](nested-classes)。

:::

有关如何在你的 API 中使用 `@SubclassOptInRequired` 注解的真实示例，
请查看 `kotlinx.coroutines` 库中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)
接口。

### 改进了具有泛型类型的函数的重载解析

以前，如果你有一个函数的多个重载，其中一些具有泛型类型的值参数，
而另一些在相同位置具有函数类型，则解析行为有时可能不一致。

这导致了不同的行为，具体取决于你的重载是成员函数还是扩展函数。
例如：

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () `->` V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1 
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () `->` V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // 成员函数
    kvs.store("", 1)    // 解析为 1
    kvs.store("") { 1 } // 解析为 2

    // 扩展函数
    kvs.storeExtension("", 1)    // 解析为 1
    kvs.storeExtension("") { 1 } // 无法解析
}
```

在此示例中，`KeyValueStore` 类具有 `store()` 函数的两个重载，
其中一个重载具有带有泛型类型 `K` 和 `V` 的函数参数，
而另一个重载具有返回泛型类型 `V` 的 lambda 函数。
同样，扩展函数 `storeExtension()` 也有两个重载。

当使用和不使用 lambda 函数调用 `store()` 函数时，
编译器成功解析了正确的重载。
但是，当使用 lambda 函数调用扩展函数 `storeExtension()` 时，
编译器未解析正确的重载，因为它错误地认为两个重载都适用。

为了解决这个问题，我们引入了一种新的启发式方法，以便当具有泛型类型的函数参数无法根据来自不同参数的信息接受 lambda 函数时，编译器可以放弃可能的重载。
此更改使成员函数和扩展函数的行为保持一致，
并且默认情况下在 Kotlin 2.1.0 中启用。

### 改进了具有密封类的 `when` 表达式的穷举性检查

在以前的 Kotlin 版本中，即使 `sealed class` 层次结构中的所有情况都已涵盖，
编译器也需要在具有密封上限的类型参数的 `when` 表达式中使用 `else` 分支。
此行为已在 Kotlin 2.1.0 中得到解决和改进，
从而使穷举性检查更加强大，并允许你删除冗余的 `else` 分支，
从而使 `when` 表达式更简洁、更直观。

以下示例演示了此更改：

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error `->` "Error!"
    is Success `->` result.value
    // 不需要 else 分支
}
```

## Kotlin K2 编译器

使用 Kotlin 2.1.0，K2 编译器现在在 [使用编译器检查时提供了更大的灵活性](#extra-compiler-checks)
和 [警告](#global-warning-suppression)，以及 [改进了对 kapt 插件的支持](#improved-k2-kapt-implementation)。

### 额外的编译器检查

使用 Kotlin 2.1.0，你现在可以在 K2 编译器中启用额外的检查。
这些是额外的声明、表达式和类型检查，这些检查通常对于编译来说不是至关重要的，
但如果你想验证以下情况，它们仍然很有用：

| 检查类型                                            | 注释                                                                                             |
|-------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE`                                  | 使用了 `Boolean??` 而不是 `Boolean?`                                                              |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                     | 使用了 `java.lang.String` 而不是 `kotlin.String`                                                  |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | 使用了 `arrayOf("") == arrayOf("")` 而不是 `arrayOf("").contentEquals(arrayOf(""))`                  |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`                 | 使用了 `42.toInt()` 而不是 `42`                                                                  |
| `USELESS_CALL_ON_NOT_NULL`                            | 使用了 `"".orEmpty()` 而不是 `""`                                                                  |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`         | 使用了 `"$string"` 而不是 `string`                                                                |
| `UNUSED_ANONYMOUS_PARAMETER`                          | 在 lambda 表达式中传递了一个参数，但从未使用过                                                     |
| `REDUNDANT_VISIBILITY_MODIFIER`                       | 使用了 `public class Klass` 而不是 `class Klass`                                                   |
| `REDUNDANT_MODALITY_MODIFIER`                         | 使用了 `final class Klass` 而不是 `class Klass`                                                    |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                     | 使用了 `set(value: Int)` 而不是 `set(value)`                                                      |
| `CAN_BE_VAL`                                          | 定义了 `var local = 0` 但从未重新赋值，可以改为 `val local = 42`                                   |
| `ASSIGNED_VALUE_IS_NEVER_READ`                        | 定义了 `val local = 42` 但之后从未在代码中使用过                                                   |
| `UNUSED_VARIABLE`                                     | 定义了 `val local = 0` 但从未在代码中使用过                                                       |
| `REDUNDANT_RETURN_UNIT_TYPE`                          | 使用了 `fun foo(): Unit {}` 而不是 `fun foo() {}`                                                  |
| `UNREACHABLE_CODE`                                    | 存在代码语句，但永远无法执行                                                                     |

如果检查为真，你将收到一条编译器警告，其中包含有关如何解决问题的建议。

默认情况下，额外的检查处于禁用状态。
要启用它们，请在命令行中使用 `-Wextra` 编译器选项，或者在你的 Gradle 构建文件的 `compilerOptions {}` 块中指定 `extraWarnings`：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

有关如何定义和使用编译器选项的更多信息，
请参见 [Kotlin Gradle 插件中的编译器选项](gradle-compiler-options)。

### 全局警告抑制

在 2.1.0 中，Kotlin 编译器收到了一个高度请求的功能——全局抑制警告的能力。

你现在可以通过在命令行中使用 `-Xsuppress-warning=WARNING_NAME` 语法或在构建文件的 `compilerOptions {}` 块中使用 `freeCompilerArgs` 属性来抑制整个项目中的特定警告。

例如，如果在你的项目中启用了 [额外的编译器检查](#extra-compiler-checks)，但想抑制其中一个检查，请使用：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

如果你想抑制一个警告但不知道它的名称，请选择该元素并单击灯泡图标（或使用 <shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>）：

<img src="/img/warning-name-intention.png" alt="警告名称意图" width="500" style={{verticalAlign: 'middle'}}/>

新的编译器选项目前是 [实验性的](components-stability#stability-levels-explained)。
以下细节也值得注意：

* 不允许抑制错误。
* 如果你传递一个未知的警告名称，编译将导致错误。
* 你可以一次指定多个警告：

   <Tabs>
   <TabItem value="Command line" label="命令行">

   ```bash
   kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
   ```

   </TabItem>
   <TabItem value="Build file" label="构建文件">

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

   </TabItem>
   </Tabs>

### 改进的 K2 kapt 实现

:::note
用于 K2 编译器的 kapt 插件（K2 kapt）处于 [Alpha](components-stability#stability-levels-explained) 阶段。
它可能随时更改。

我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) 中提供的反馈。

目前，使用 [kapt](kapt) 插件的项目默认使用 K1 编译器，
支持 Kotlin 版本最高到 1.9。

在 Kotlin 1.9.20 中，我们启动了 K2 编译器的 kapt 插件（K2 kapt）的实验性实现。
我们现在改进了 K2 kapt 的内部实现，以减轻技术和性能问题。

虽然新的 K2 kapt 实现没有引入新功能，
但与之前的 K2 kapt 实现相比，其性能已得到显着提高。
此外，K2 kapt 插件的行为现在更接近 K1 kapt 的行为。

要使用新的 K2 kapt 插件实现，请像启用之前的 K2 kapt 插件一样启用它。
将以下选项添加到你的项目的 `gradle.properties` 文件中：

```kotlin
kapt.use.k2=true
```

在即将发布的版本中，K2 kapt 实现将默认启用而不是 K1 kapt，
因此你将不再需要手动启用它。

在新实现稳定之前，我们非常感谢你的 [反馈](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### 解决无符号类型和非原始类型之间的重载冲突

此版本解决了重载冲突的解析问题，
当函数重载了无符号类型和非原始类型时，可能会在以前的版本中发生重载冲突，
如以下示例所示：

#### 重载的扩展函数

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Kotlin 2.1.0 之前的重载解析歧义
}
```

在早期版本中，调用 `uByte.doStuff()` 导致歧义，因为 `Any` 和 `UByte` 扩展都适用。

#### 重载的顶层函数

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Kotlin 2.1.0 之前的重载解析歧义
}
```

类似地，调用 `doStuff(uByte)` 也是模棱两可的，因为编译器无法决定是使用 `Any` 版本还是 `UByte` 版本。
使用 2.1.0，编译器现在可以正确处理这些情况，通过优先考虑更具体的类型（在本例中为 `UByte`）来解决歧义。

## Kotlin/JVM

从 2.1.0 版本开始，编译器可以生成包含 Java 23 字节码的类。

### 将 JSpecify 可空性不匹配诊断的严重性更改为严格

Kotlin 2.1.0 强制执行来自 `org.jspecify.annotations` 的可空性注解的严格处理，
从而提高了 Java 互操作性的类型安全性。

以下可空性注解受到影响：

* `org.jspecify.annotations.Nullable`
* `org.jspecify.annotations.NonNull`
* `org.jspecify.annotations.NullMarked`
* `org.jspecify.nullness` 中的旧注解（JSpecify 0.2 及更早版本）

从 Kotlin 2.1.0 开始，默认情况下，可空性不匹配会从警告提升为错误。
这确保了在类型检查期间强制执行诸如 `@NonNull` 和 `@Nullable` 之类的注解，
从而防止了在运行时出现意外的可空性问题。

`@NullMarked` 注解也会影响其范围内所有成员的可空性，
从而使你在使用带注解的 Java 代码时，行为更可预测。

以下示例演示了新的默认行为：

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

    // 在默认的严格模式下引发错误，因为结果是可空的
    // 要避免此错误，请改用 ?.length
    sjc.bar().length
}
```

你可以手动控制这些注解的诊断的严重性。
为此，请使用 `-Xnullability-annotations` 编译器选项来选择一种模式：

* `ignore`：忽略可空性不匹配。
* `warning`：报告可空性不匹配的警告。
* `strict`：报告可空性不匹配的错误（默认模式）。

有关更多信息，请参见 [可空性注解](java-interop#nullability-annotations)。

## Kotlin 多平台（Kotlin Multiplatform）

Kotlin 2.1.0 引入了 [对 Swift 的基本导出支持](#basic-support-for-swift-export)，并使
[发布 Kotlin 多平台库更容易](#ability-to-publish-kotlin-libraries-from-any-host)。
它还专注于围绕 Gradle 的改进，这些改进稳定了 [用于配置编译器选项的新 DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)，
并带来了 [隔离项目特性的预览](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

### 用于配置多平台项目中编译器选项的新 Gradle DSL 升级为 Stable

在 Kotlin 2.0.0 中，[我们引入了一个新的实验性 Gradle DSL](whatsnew20#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)，
以简化跨多平台项目的编译器选项配置。
在 Kotlin 2.1.0 中，此 DSL 已升级为 Stable。

整个项目配置现在有三个层。最高层是扩展级别，
然后是目标级别，最低层是编译单元（通常是编译任务）：

<img src="/img/compiler-options-levels.svg" alt="Kotlin 编译器选项级别" width="700" style={{verticalAlign: 'middle'}}/>

要了解有关不同级别以及如何在它们之间配置编译器选项的更多信息，
请参见 [编译器选项](multiplatform-dsl-reference#compiler-options)。

### 在 Kotlin 多平台（Kotlin Multiplatform）中预览 Gradle 的隔离项目

此特性是 [实验性的](components-stability#stability-levels-explained)，并且目前处于 Gradle 的 pre-Alpha 状态。
仅应将其与 Gradle 8.10 版本一起用于评估目的。该特性可能随时被删除或更改。

我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中提供的反馈。
需要选择启用（请参见以下详细信息）。

在 Kotlin 2.1.0 中，
你可以在多平台项目中预览 Gradle 的 [隔离项目](https://docs.gradle.org/current/userguide/isolated_projects.html)
特性。

Gradle 中的隔离项目特性通过“隔离”来提高构建性能
各个 Gradle 项目的配置彼此隔离。
每个项目的构建逻辑都被限制直接访问其他项目的可变状态，
从而允许它们安全地并行运行。
为了支持此特性，我们对 Kotlin Gradle 插件的模型进行了一些更改，
并且我们有兴趣在预览阶段了解你的体验。

有两种方法可以启用 Kotlin Gradle 插件的新模型：

* 选项 1：**在不启用隔离项目的情况下测试兼容性** –
  要在不启用隔离项目特性的情况下检查与 Kotlin Gradle 插件新模型的兼容性，
  请将以下 Gradle 属性添加到你的项目的 `gradle.properties` 文件中：

  ```none
  # gradle.properties
  kotlin.kmp.isolated-projects.support=enable
  ```

* 选项 2：**使用启用的隔离项目进行测试** –
  在 Gradle 中启用隔离项目特性会自动配置 Kotlin Gradle 插件以使用新模型。
  要启用隔离项目特性，请 [设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。
  在这种情况下，你无需将 Kotlin Gradle 插件的 Gradle 属性添加到你的项目中。

### 对 Swift 的基本导出支持

此特性目前处于开发的早期阶段。它可能随时被删除或更改。
需要选择启用（请参见以下详细信息），并且你应仅将其用于评估目的。
我们感谢你在 [YouTrack](https://kotl.in/issue) 中提供的反馈。

版本 2.1.0 迈出了支持 Kotlin 中 Swift 导出的第一步，
允许你将 Kotlin 源码直接导出到 Swift 接口，而无需使用 Objective-C 标头。
这应使 Apple 目标的多平台开发更容易。

当前的基本支持包括以下功能：

* 将多个 Gradle 模块从 Kotlin 直接导出到 Swift。
* 使用 `moduleName` 属性定义自定义 Swift 模块名称。
* 使用 `flattenPackage` 属性设置包结构的折叠规则。

你可以使用项目中的以下构建文件作为设置 Swift 导出的起点：

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
        // 从生成的 Swift 代码中删除包前缀
        flattenPackage = "com.example.sandbox"

        // 导出外部模块
        export(project(":subproject")) {
            // 导出的模块名称
            moduleName = "Subproject"
            // 折叠导出的依赖项规则
            flattenPackage = "com.subproject.library"
        }
    }
}
```

你还可以克隆我们已经设置了 Swift 导出的 [公共示例](https://github.com/Kotlin/swift-export-sample)。

编译器会自动生成所有必要的文件（包括 `swiftmodule` 文件、
静态 `a` 库以及标头和 `modulemap` 文件），并将它们复制到应用的构建目录中，
你可以从 Xcode 访问该目录。

#### 如何启用 Swift 导出

请记住，该特性目前仅处于开发的早期阶段。

Swift 导出目前适用于使用
[直接集成](multiplatform-direct-integration) 将 iOS 框架连接到 Xcode 项目的项目。
这是在 Android Studio 中或通过 [Web 向导](https://kmp.jetbrains.com/) 创建的 Kotlin 多平台项目的标准配置。

要尝试在你的项目中进行 Swift 导出：

1. 将以下 Gradle 选项添加到你的 `gradle.properties` 文件中：

   ```none
   # gradle.properties
   kotlin.experimental.swift-export.enabled=true
   ```

2. 在 Xcode 中，打开项目设置。
3. 在 **Build Phases** 选项卡上，找到带有 `embedAndSignAppleFrameworkForXcode` 任务的 **Run Script** 阶段。
4. 调整脚本以在运行脚本阶段改为包含 `embedSwiftExportForXcode` 任务：

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   <img src="/img/xcode-swift-export-run-script-phase.png" alt="添加 Swift 导出脚本" width="700" style={{verticalAlign: 'middle'}}/>

#### 留下有关 Swift 导出的反馈

我们计划在未来的 Kotlin 版本中扩展和稳定 Swift 导出支持。
请在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-64572) 中留下你的反馈。

### 能够从任何主机发布 Kotlin 库

此特性目前是 [实验性的](components-stability#stability-levels-explained)。
需要选择启用（请参见以下详细信息），并且你应仅将其用于评估目的。
我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中提供的反馈。

Kotlin 编译器生成 `.klib` 工件用于发布 Kotlin 库。
以前，你可以从任何主机获取必要的工件，但 Apple 平台目标除外，后者需要 Mac 机器。
这给以 iOS、macOS、tvOS 和 watchOS 目标为目标的 Kotlin 多平台项目带来了一种特殊的限制。

Kotlin 2.1.0 解除了此限制，增加了对交叉编译的支持。
现在你可以使用任何主机来生成 `.klib` 工件，
这应大大简化 Kotlin 和 Kotlin 多平台库的发布过程。

#### 如何启用从任何主机发布库

要尝试在你的项目中进行交叉编译，请将以下二进制选项添加到你的 `gradle.properties` 文件中：

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

此特性目前是实验性的，并且有一些限制。如果出现以下情况，你仍然需要使用 Mac 机器：

* 你的库具有 [cinterop 依赖项](native-c-interop)。
* 你在项目中设置了 [CocoaPods 集成](native-cocoapods)。
* 你需要为 Apple 目标构建或测试 [最终二进制文件](multiplatform-build-native-binaries)。

#### 留下有关从任何主机发布库的反馈

我们计划稳定此特性并在未来的 Kotlin 版本中进一步改进库发布。
请在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中留下你的反馈。

有关更多信息，请参见 [发布多平台库](multiplatform-publish-lib)。

### 支持非打包 klib

Kotlin 2.1.0 使得生成非打包 `.klib` 文件工件成为可能。
这使你可以选择直接配置对 klib 的依赖项，而不是先解压缩它们。

此更改还可以提高性能，
从而减少你的 Kotlin/Wasm、Kotlin/JS 和 Kotlin/Native 项目中的编译和链接时间。

例如，
我们的基准测试显示，在具有 1 个链接和 10 个编译任务的项目中，总构建时间大约提高了 3%
（该项目构建了一个依赖于 9 个简化项目的单个本机可执行二进制文件）。
但是，对构建时间的实际影响取决于子项目的数量及其各自的大小。

#### 如何设置你的项目

默认情况下，Kotlin 编译和链接任务现在配置为使用新的非打包工件。

如果你已经设置了用于解析 klib 的自定义构建逻辑并且想要使用新的未打包工件，
你需要明确指定在你的 Gradle 构建文件中首选的 klib 包解析变体：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {

    // 对于新的非打包配置：
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // 对于之前的打包配置：