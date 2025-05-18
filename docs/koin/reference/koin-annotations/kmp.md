---
title: "Kotlin 多平台应用中定义和模块的注解"
---
## KSP 设置

请按照官方文档中的 KSP 设置进行操作：[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

您还可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 项目，其中包含 Koin Annotations 的基本设置。

添加 KSP 插件

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

在 common API 中使用 annotations 库：

```kotlin
sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            api(libs.koin.annotations)
            // ...
        }
}
```

并且不要忘记在正确的 sourceSet 上配置 KSP：

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## 声明通用模块（Common Modules） & KMP Expect 组件

在您的 `commonMain` sourceSet 中，您只需要声明一个 Module 来扫描将具有您的 expect 类或函数的原生实现的包。

下面我们有一个 `PlatformModule`，在 `com.jetbrains.kmpapp.platform` 包中扫描，其中我们有 `PlatformHelper` expect 类。Module 类使用 `@Module` 和 `@ComponentScan` 注解进行注解。

```kotlin
// in commonMain

@Module
@ComponentScan("com.jetbrains.kmpapp.platform")
class PlatformModule

// package com.jetbrains.kmpapp.platform 

@Single
expect class PlatformHelper {
    fun getName() : String
}
```

:::note
生成的代码是在每个平台实现中完成的。Module 包扫描将收集正确的平台实现。
:::

## 注解原生组件

在每个实现 sourceSet 中，您现在可以定义正确的平台实现。这些实现使用 `@Single` 注解进行注解（也可以是其他的定义注解）：

```kotlin
// in androidMain
// package com.jetbrains.kmpapp.platform

@Single
actual class PlatformHelper(
    val context: Context
){
    actual fun getName(): String = "I'm Android - $context"
}

// in nativeMain
// package com.jetbrains.kmpapp.platform

@Single
actual class PlatformHelper(){
    actual fun getName(): String = "I'm Native"
}
```