---
title: Kotlin 多平台 - 定義與模組註解
---

## KSP 設定

請依照官方文件中的 KSP 設定說明操作：[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

您也可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 專案，其中包含 Koin 註解 (Annotations) 的基本設定。

新增 KSP 外掛程式

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

在共同 API 中使用註解程式庫：

```kotlin
sourceSets {
    commonMain.dependencies {
        implementation(libs.koin.core)
        api(libs.koin.annotations)
        // ...
    }
}
```

並且別忘了在正確的 sourceSet 上配置 KSP：

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## 在共同程式碼中定義定義與模組

在您的 `commonMain` sourceSet 中，宣告您的模組，掃描定義，或將函式定義為常規的 Kotlin Koin 宣告。請參閱 [定義](definitions.md) 和 [模組](./modules.md)。

## 共享模式

在本節中，我們將一起探討使用定義和模組共享元件的幾種方式。

在 Kotlin 多平台應用程式中，某些元件必須針對每個平台具體實作。您可以在定義層級共享這些元件，並在給定類別（定義或模組）上使用 expected/actual。您可以共享具有 expect/actual 實作的定義，或共享具有 expect/actual 的模組。

請參閱 [多平台 Expect & Actual 規則](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) 文件以獲取通用的 Kotlin 指導。

### 共享用於原生實作的定義

:::info
我們旨在透過共同模組 + Expect/Actual 類別定義進行共享
:::

對於這種第一個經典模式，您可以將定義掃描與 `@ComponentScan` 一起使用，或者將定義宣告為模組類別函式。

請注意，若要使用 `expect/actual` 定義，您將使用相同的建構函式（無論是預設的還是自訂的）。此建構函式在所有平台上都必須相同。

#### 掃描 Expect/Actual 定義

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

在原生原始碼中，實作我們的 actual 類別：

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

#### 宣告 Expect/Actual 函式定義

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

在原生原始碼中，實作我們的 actual 類別：

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

### 共享具有不同原生合約的定義

:::info
我們旨在透過 Expect/Actual 共同模組 + 共同介面 + 原生實作
:::

在某些情況下，您需要每個原生實作上具有不同的建構函式參數。那麼 Expect/Actual 類別就不是您的解決方案。您需要使用一個 `interface` 在每個平台上實作，以及一個 Expect/Actual 類別模組，以允許模組定義您正確的平台實作：

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

在原生原始碼中，實作我們的 actual 類別：

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
每次您手動存取 Koin scope 時，您都在進行動態連接 (dynamic wiring)。編譯安全性無法涵蓋此類連接。
:::

### 使用平台包裝器安全地跨平台共享

:::info
將特定平台元件包裝為「平台包裝器 (platform wrapper)」
:::

您可以將特定的平台元件包裝成一個「平台包裝器 (platform wrapper)」，以幫助您最小化動態注入。

例如，我們可以建立一個 `ContextWrapper`，它允許我們在需要時注入 Android `Context`，但不會影響 iOS 端。

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

在原生原始碼中，實作我們的 actual 類別：

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
透過這種方式，您可以將動態平台連接最小化到一個定義，並在整個系統中安全地注入。
:::

您現在可以從共同程式碼中使用您的 `ContextWrapper`，並輕鬆地將其傳遞到您的 Expect/Actual 類別中：

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

在原生原始碼中，實作我們的 actual 類別：

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

### 共享 Expect/Actual 模組 - 依賴原生模組掃描

:::info
依賴共同模組中的原生模組
:::

在某些情況下，您不希望有約束，並在每個原生端掃描元件。在 common source set 中定義一個空的模組類別，並在每個平台上定義您的實作。

:::info
如果您在 common 側定義一個空的模組，則每個原生模組實作將從每個原生目標生成，例如，允許僅掃描原生元件。
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