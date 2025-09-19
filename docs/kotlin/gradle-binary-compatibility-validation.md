[//]: # (title: Kotlin Gradle 插件中的二进制兼容性验证)

<primary-label ref="experimental-general"/>

二进制兼容性验证可帮助库作者确保用户在升级到新版本时不会破坏其代码。这不仅对于提供顺畅的升级体验很重要，而且对于与用户建立长期信任和鼓励持续采用该库也至关重要。

> 二进制兼容性意味着库的两个版本的编译后字节码无需重新编译即可互换运行。
> 
{style="tip"}

从 2.2.0 版本开始，Kotlin Gradle 插件支持二进制兼容性验证。启用后，它会从当前代码生成应用二进制接口 (ABI) 转储文件，并将其与之前的转储文件进行比较以突出显示差异。你可以审阅这些更改以查找任何潜在的二进制不兼容修改，并采取措施解决它们。

## 如何启用

要启用二进制兼容性验证，请在 `build.gradle.kts` 文件中的 `kotlin{}` 代码块中添加以下内容：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // Use the set() function to ensure compatibility with older Gradle versions
        enabled.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        enabled = true
    }
}
```

</tab>
</tabs>

如果你的项目有多个模块需要检测二进制兼容性，请单独配置每个模块。

## 检测二进制兼容性问题

要检测代码更改后潜在的二进制不兼容问题，请在 IntelliJ IDEA 中运行 `checkLegacyAbi` Gradle 任务，或在你的项目目录中使用以下命令：

```bash
./gradlew checkLegacyAbi
```

该任务会比较 ABI 转储文件，并将所有检测到的差异作为错误打印出来。仔细检查输出，查看你是否需要更改代码以保持二进制兼容性。

## 更新参考 ABI 转储文件

要更新 Gradle 用来检测最新更改的参考 ABI 转储文件，请在 IntelliJ IDEA 中运行 `updateLegacyAbi` 任务，或在你的项目目录中使用以下命令：

```bash
./gradlew updateLegacyAbi
```

仅在你确信你的更改与上一版本保持二进制兼容性时，才更新参考转储文件。

## 配置过滤器

你可以定义过滤器来控制 ABI 转储文件包含哪些类、属性和函数。使用 `filters {}` 代码块，分别通过 `excluded {}` 和 `included {}` 代码块添加排除和包含规则。

Gradle 仅在声明不匹配任何排除规则时，才将其包含在 ABI 转储文件中。当定义了包含规则时，声明必须匹配其中之一，或至少有一个成员匹配。

规则可以基于：

*   类、属性或函数的完全限定名 (`byNames`)。
*   具有 BINARY 或 RUNTIME [保留策略](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/-retention/) 的注解名称 (`annotatedWith`)。

> 你可以在名称规则中使用通配符 `**`、`*` 和 `?`：
> *   `**` 匹配零个或多个字符，包括句点。
> *   `*` 匹配零个或多个字符，不包括句点。用于指定单个类名。
> *   `?` 匹配一个字符。
> 
{style = "tip"}

例如：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
</tabs>

此示例：

*   排除：
    *   `InternalUtils` 类。
    *   用 `@InternalApi` 注解的声明。
*   包含：
    *   `com.example.api` 包中的所有内容。
    *   用 `@PublicApi` 注解的声明。

要了解有关过滤的更多信息，请参见 [Kotlin Gradle 插件 API 参考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/-abi-filters-spec/)。

## 防止不支持的目标平台的推断更改

在多平台项目中，如果你的主机系统无法编译所有目标平台，Kotlin Gradle 插件会尝试从可用的目标平台中推断 ABI 更改。这有助于避免当你之后切换到支持更多目标平台的主机时出现虚假失败。

要禁用此行为，请将以下内容添加到你的 `build.gradle.kts` 文件中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets.set(false)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

</tab>
</tabs>

如果目标平台不受支持且推断被禁用，`checkLegacyAbi` 任务将失败，因为它无法生成完整的 ABI 转储文件。这种行为可能很有用，如果你更希望任务失败而不是冒着错过二进制不兼容更改的风险。