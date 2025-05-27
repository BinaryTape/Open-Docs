---
title: Kotlin 多平台應用程式中的定義與模組註解
---

## KSP 設定

請依照官方文件中的 KSP 設定說明操作：[KSP 與 Kotlin 多平台](https://kotlinlang.org/docs/ksp-multiplatform.html)

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

## 宣告共同模組與 KMP Expect 元件

在您的 `commonMain` sourceSet 中，您只需要宣告一個模組 (Module) 以掃描將包含您的 expect 類別或函式原生實作的套件。

下方我們有一個 `PlatformModule`，掃描 `com.jetbrains.kmpapp.platform` 套件，其中包含 `PlatformHelper` expect 類別。該模組類別使用 `@Module` 和 `@ComponentScan` 註解進行標註。

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
產生的程式碼是在每個平台實作中完成的。模組套件掃描將會收集正確的平台實作。
:::

## 註解原生元件

在每個實作的 sourceSet 中，您現在可以定義正確的平台實作。這些實作都使用 `@Single` 進行標註 (也可以是其他定義註解)：

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