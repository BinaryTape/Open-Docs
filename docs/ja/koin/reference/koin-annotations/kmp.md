---
title: "Kotlin Multiplatform Appにおける定義とモジュールのアノテーション"
---
## KSP のセットアップ

公式ドキュメントに記載されている KSP のセットアップに従ってください: [KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

[Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) プロジェクトで、Koin Annotations の基本的なセットアップを確認することもできます。

KSP プラグインの追加

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

common API で annotations ライブラリを使用する:

```kotlin
sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            api(libs.koin.annotations)
            // ...
        }
}
```

適切な sourceSet で KSP を構成することを忘れないでください:

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## Common Modules と KMP Expect Components の宣言

commonMain sourceSet では、expect クラスまたは関数のネイティブ実装を持つパッケージをスキャンするために、Module を宣言するだけです。

下記は `PlatformModule` で、`PlatformHelper` expect クラスを持つ `com.jetbrains.kmpapp.platform` パッケージをスキャンしています。モジュールクラスは `@Module` および `@ComponentScan` アノテーションでアノテートされています。

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
生成されたコードは、各プラットフォーム実装で行われます。モジュールパッケージのスキャンは、適切なプラットフォーム実装を収集します。
:::

## ネイティブコンポーネントのアノテート

各実装 sourceSet で、適切なプラットフォーム実装を定義できるようになりました。これらの実装は `@Single` でアノテートされています (他の定義アノテーションでもかまいません)。

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