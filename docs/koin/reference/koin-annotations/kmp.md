---
title: Kotlin Multiplatform - 定义和模块注解
---

## KSP 设置

请按照官方文档中描述的 KSP 设置步骤进行操作：[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

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

并且别忘了在正确的 sourceSet 上配置 KSP：

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## 在通用代码中定义和模块

在你的 `commonMain` sourceSet 中，声明你的模块，扫描定义，或者将函数定义为常规的 Kotlin Koin 声明。请参阅 [定义](definitions.md) 和 [模块](./modules.md)。

## 共享模式

在本节中，我们将一起探讨几种通过定义和模块共享组件的方式。

在 Kotlin Multiplatform 应用程序中，某些组件必须针对每个平台进行特定实现。你可以在定义级别共享这些组件，通过对给定类（定义或模块）使用 expect/actual。你可以通过 expect/actual 实现来共享定义，或者共享一个带有 expect/actual 的模块。

请查阅 [Multiplatform Expect & Actual 规则](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) 文档，获取通用的 Kotlin 指导。

### 为原生实现共享定义

:::info
我们以通用模块 + Expect/Actual 类定义为目标进行共享。
:::

对于这种经典的模式，你可以使用带 `@ComponentScan` 的定义扫描，或者将定义声明为模块类函数。

请注意，要使用 `expect/actual` 定义，你将使用相同的构造函数（无论是默认构造函数还是自定义构造函数）。此构造函数必须在所有平台上保持一致。

#### 扫描 Expect/Actual 定义

在 commonMain 中：
```kotlin
// commonMain

@Module
@ComponentScan("com.jetbrains.kmpapp.native")
class NativeModuleA()

// package com.jetbrains.kmpapp.native
@Factory
expect class PlatformComponentA() {
    fun sayHello() : String
}
```

在原生源码中，实现我们的实际类：

```kotlin
// androidMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA {
    actual fun sayHello() : String = "I'm Android - A"
}

// iOSMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA {
    actual fun sayHello() : String = "I'm iOS - A"
}
```

#### 声明 Expect/Actual 函数定义

在 commonMain 中：
```kotlin
// commonMain

@Module
class NativeModuleB() {

    @Factory
    fun providesPlatformComponentB() : PlatformComponentB = PlatformComponentB()
}

expect class PlatformComponentB() {
    fun sayHello() : String
}
```

在原生源码中，实现我们的实际类：

```kotlin
// androidMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentB {
    actual fun sayHello() : String = "I'm Android - B"
}

// iOSMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentB {
    actual fun sayHello() : String = "I'm iOS - A"
}
```

### 通过不同的原生实现共享定义

:::info
我们以 Expect/Actual 通用模块 + 通用接口 + 原生实现为目标进行共享。
:::

在某些情况下，你可能需要在每个原生实现上使用不同的构造函数参数。此时，Expect/Actual 类就不是你的解决方案。你需要使用一个 `interface` 在每个平台上进行实现，并使用一个 Expect/Actual 类模块，让该模块定义正确的平台实现：

在 commonMain 中：
```kotlin
// commonMain

expect class NativeModuleD() {
    @Factory
    fun providesPlatformComponentD(scope : org.koin.core.scope.Scope) : PlatformComponentD
}

interface PlatformComponentD {
    fun sayHello() : String
}
```

在原生源码中，实现我们的实际类：

```kotlin
// androidMain

@Module
actual class NativeModuleD {
    @Factory
    actual fun providesPlatformComponentD(scope : org.koin.core.scope.Scope) : PlatformComponentD = PlatformComponentDAndroid(ctx)
}

class PlatformComponentDAndroid(scope : org.koin.core.scope.Scope) : PlatformComponentD{
    val context : Context = scope.get()
    override fun sayHello() : String = "I'm Android - D - with ${ctx.context}"
}

// iOSMain
@Module
actual class NativeModuleD {
    @Factory
    actual fun providesPlatformComponentD(scope : org.koin.core.scope.Scope) : PlatformComponentD = PlatformComponentDiOS()
}

class PlatformComponentDiOS : PlatformComponentD{
    override fun sayHello() : String = "I'm iOS - D"
}
```

:::note
每次你手动访问 Koin 作用域时，都是在进行动态连接。编译安全无法覆盖此类连接。
:::

### 使用平台包装器安全地跨平台共享

:::info
将特定的平台组件包装成一个“平台包装器”。
:::

你可以将特定的平台组件包装成一个“平台包装器”，以帮助你最小化动态注入。

例如，我们可以创建一个 `ContextWrapper`，它允许我们在需要时注入 Android `Context`，但不会影响 iOS 端。

在 commonMain 中：
```kotlin
// commonMain

expect class ContextWrapper

@Module
expect class ContextModule() {

    @Single
    fun providesContextWrapper(scope : Scope) : ContextWrapper
}
```

在原生源码中，实现我们的实际类：

```kotlin
// androidMain
actual class ContextWrapper(val context: Context)

@Module
actual class ContextModule {
    
    // needs androidContext() to be setup at start
    @Single
    actual fun providesContextWrapper(scope : Scope) : ContextWrapper = ContextWrapper(scope.get())
}

// iOSMain
actual class ContextWrapper

@Module
actual class ContextModule {

    @Single
    actual fun providesContextWrapper(scope : Scope) : ContextWrapper = ContextWrapper()
}
```

:::info
通过这种方式，你可以将动态平台连接最小化到一个定义中，并在整个系统中安全注入。
:::

你现在可以从通用代码中使用 `ContextWrapper`，并轻松地将其传递到你的 Expect/Actual 类中：

在 commonMain 中：
```kotlin
// commonMain

@Module
@ComponentScan("com.jetbrains.kmpapp.native")
class NativeModuleA()

// package com.jetbrains.kmpapp.native
@Factory
expect class PlatformComponentA(ctx : ContextWrapper) {
    fun sayHello() : String
}
```

在原生源码中，实现我们的实际类：

```kotlin
// androidMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA actual constructor(val ctx : ContextWrapper) {
    actual fun sayHello() : String = "I'm Android - A - with context: ${ctx.context"
}

// iOSMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA actual constructor(val ctx : ContextWrapper) {
    actual fun sayHello() : String = "I'm iOS - A"
}
```

### 共享 Expect/Actual 模块 - 依赖原生模块扫描

:::info
从通用模块中依赖原生模块。
:::

在某些情况下，你可能不希望有任何限制，并且希望在每个原生端扫描组件。在 common source set 中定义一个空的模块类，然后在每个平台上定义你的实现。

:::info
如果你在通用端定义一个空模块，每个原生模块实现将从各自的原生目标生成，例如，这允许扫描仅限原生的组件。
:::

在 commonMain 中：
```kotlin
// commonMain

@Module
expect class NativeModuleC()
```

在原生 source sets 中：

```kotlin
// androidMain
@Module
@ComponentScan("com.jetbrains.kmpapp.other.android")
actual class NativeModuleC

//com.jetbrains.kmpapp.other.android
@Factory
class PlatformComponentC(val context: Context) {
    fun sayHello() : String = "I'm Android - C - $context"
}

// iOSMain
// do nothing on iOS
@Module
actual class NativeModuleC
```