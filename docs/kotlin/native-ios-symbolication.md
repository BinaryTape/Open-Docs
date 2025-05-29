[//]: # (title: 符号化 iOS 崩溃报告)

调试 iOS 应用崩溃有时需要分析崩溃报告。有关崩溃报告的更多信息可在 [Apple 文档](https://developer.apple.com/library/archive/technotes/tn2151/_index.html) 中找到。

崩溃报告通常需要符号化才能变得正常可读：符号化将机器码地址转换为人类可读的源位置。以下文档描述了符号化来自使用 Kotlin 的 iOS 应用崩溃报告的一些具体细节。

## 为 Kotlin 发布二进制文件生成 .dSYM

为了符号化 Kotlin 代码中的地址（例如，对于与 Kotlin 代码对应的堆栈跟踪元素），需要 Kotlin 代码的 `.dSYM` 包。

默认情况下，Kotlin/Native 编译器在 Darwin 平台为发布（即优化）二进制文件生成 `.dSYM`。这可以通过 `-Xadd-light-debug=disable` 编译器标志禁用。同时，对于其他平台，此选项默认禁用。要启用它，请使用 `-Xadd-light-debug=enable` 编译器选项。

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

在由 IntelliJ IDEA 或 AppCode 模板创建的项目中，这些 `.dSYM` 包随后会被 Xcode 自动发现。

## 当从比特码重建时，使框架静态化

从比特码重建 Kotlin 生成的框架会使原始的 `.dSYM` 失效。如果在本地执行，请确保在符号化崩溃报告时使用更新的 `.dSYM`。

如果在 App Store 端执行重建，那么重建的 *动态* 框架的 `.dSYM` 似乎会被丢弃，并且无法从 App Store Connect 下载。在这种情况下，可能需要将框架设为静态。

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