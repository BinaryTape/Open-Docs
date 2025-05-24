---
title: iOS崩溃报告符号化
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

调试 iOS 应用程序崩溃有时需要分析崩溃报告。有关崩溃报告的更多信息，请参见 [Apple 文档](https://developer.apple.com/library/archive/technotes/tn2151/_index.html)。

通常，崩溃报告需要经过符号化才能正确读取：符号化将机器码地址转换为人类可读的源代码位置。以下文档描述了使用 Kotlin 符号化来自 iOS 应用程序的崩溃报告的一些特定细节。

## 为 release Kotlin 二进制文件生成 .dSYM

为了符号化 Kotlin 代码中的地址（例如，与 Kotlin 代码相对应的堆栈跟踪元素），需要 Kotlin 代码的 `.dSYM` 捆绑包（bundle）。

默认情况下，Kotlin/Native 编译器会在 Darwin 平台上为 release（即，优化过的）二进制文件生成 `.dSYM`。可以使用 `-Xadd-light-debug=disable` 编译器标志禁用此功能。同时，对于其他平台，此选项默认处于禁用状态。要启用它，请使用 `-Xadd-light-debug=enable` 编译器选项。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=\{enable|disable\}"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=\{enable|disable\}"
        }
    }
}
```

</TabItem>
</Tabs>

在从 IntelliJ IDEA 或 AppCode 模板创建的项目中，这些 `.dSYM` 捆绑包随后会被 Xcode 自动发现。

## 使用从 bitcode 重建时，使 framework 成为静态的

从 bitcode 重建 Kotlin 生成的 framework 会使原始 `.dSYM` 失效。 如果在本地执行重建，请确保在符号化崩溃报告时使用更新后的 `.dSYM`。

如果在 App Store 端执行重建，则重建的*动态* framework 的 `.dSYM` 似乎会被丢弃，并且无法从 App Store Connect 下载。 在这种情况下，可能需要使 framework 成为静态的。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</TabItem>
</Tabs>