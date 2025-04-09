---
title: "Kotlin 多平台應用程式中定義與模組的註解 (Annotations)"
---
## KSP 設定

請依照官方文檔中的 KSP 設定進行操作：[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

您也可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 專案，其中包含 Koin Annotations 的基本設定。

新增 KSP Plugin (外掛)

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

在 common API 中使用 annotations (註解) 函式庫：

```kotlin
sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            api(libs.koin.annotations)
            // ...
        }
}
```

別忘了在正確的 sourceSet 設定 KSP：

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## 宣告 Common Modules & KMP Expect Components

在您的 `commonMain` sourceSet 中，您只需要宣告一個 Module (模組)，來掃描將擁有您的 expect class (預期類別) 或 function (函數) 的原生實作的 package (包)。

下方我們有一個 `PlatformModule`，在 `com.jetbrains.kmpapp.platform` package 中掃描，該 package 中有 `PlatformHelper` expect class。該 module class 使用 `@Module` 和 `@ComponentScan` annotations 進行註解。

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
產生的程式碼在每個 platform (平台) 實作中完成。模組 package 掃描將收集正確的平台實作。
:::

## 註解原生 Components

在每個實作 sourceSet 中，您現在可以定義正確的平台實作。這些實作使用 `@Single` 進行註解（可以是另一個定義 annotation）：

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