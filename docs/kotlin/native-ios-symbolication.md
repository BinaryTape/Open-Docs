[//]: # (title: iOS 崩溃报告符号化)

调试 iOS 应用程序崩溃有时涉及分析崩溃报告。
更多关于崩溃报告的信息可以在 [Apple 文档](https://developer.apple.com/library/archive/technotes/tn2151/_index.html)中找到。

崩溃报告通常需要符号化才能变得可读性良好：符号化将机器代码地址转换为人类可读的源代码位置。
以下文档描述了使用 Kotlin 符号化 iOS 应用程序崩溃报告的一些具体细节。

## 为发布 Kotlin 二进制文件生成 .dSYM

要符号化 Kotlin 代码中的地址（例如，针对 Kotlin 代码对应的堆栈跟踪元素），针对 Kotlin 代码的 .dSYM bundle 是必需的。

默认情况下，Kotlin/Native 编译器会在 Darwin 平台为发布（即优化过的）二进制文件生成 .dSYM。这可以通过 `-Xadd-light-debug=disable` 编译器标志禁用。同时，此选项默认针对其他平台禁用。要启用它，请使用 `-Xadd-light-debug=enable` 编译器选项。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
</tabs>

在从 IntelliJ IDEA 或 AppCode 模板创建的项目中，这些 .dSYM bundle 随后会被 Xcode 自动发现。

## 使用从 bitcode 重建时将框架设为静态

从 bitcode 重建 Kotlin 生成的框架会使原始的 .dSYM 失效。
如果在本地执行此操作，请确保在符号化崩溃报告时使用更新后的 .dSYM。

如果在 App Store 端执行重建，则重建的 *动态* 框架的 .dSYM 似乎会被丢弃，并且无法从 App Store Connect 下载。
在这种情况下，可能需要将框架设为静态。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</tab>
</tabs>