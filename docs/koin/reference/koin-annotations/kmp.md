---
title: Kotlin Multiplatform 应用中的定义和模块注解
---

## KSP 设置

请按照官方文档中描述的 KSP 设置步骤进行操作：[KSP 与 Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

你也可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 项目，了解 Koin 注解的基本设置。

添加 KSP 插件

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

在 common API 中使用注解库：

```kotlin
sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            api(libs.koin.annotations)
            // ...
        }
}
```

并且别忘了在正确的 `sourceSet` 上配置 KSP：

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## 声明通用模块和 KMP Expect 组件

在你的 `commonMain` `sourceSet` 中，你只需声明一个模块来扫描包含 `expect` 类或函数的原生实现的包。

下面我们有一个 `PlatformModule`，它扫描 `com.jetbrains.kmpapp.platform` 包，其中包含 `PlatformHelper` `expect` 类。该模块类使用 `@Module` 和 `@ComponentScan` 注解进行标注。

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
生成代码是在每个平台实现中完成的。模块包扫描将收集正确的平台实现。
:::

## 注解原生组件

在每个实现 `sourceSet` 中，你现在可以定义正确的平台实现。这些实现都使用 `@Single` 注解进行标注（也可以是其他定义注解）：

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