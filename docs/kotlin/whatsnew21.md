：改进了字符串字面值中 `$ ` 的处理方式）。](#multi-dollar-string-interpolation)

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
改进了字符串字面值中美元符号 (`$`