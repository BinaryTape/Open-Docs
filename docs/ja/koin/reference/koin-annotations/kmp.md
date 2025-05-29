---
title: Kotlin Multiplatformアプリにおける定義とモジュールのためのアノテーション
---

## KSPのセットアップ

KSPのセットアップは、公式ドキュメント「[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)」に記載されている手順に従ってください。

また、Koin Annotationsの基本的なセットアップが記載されている[Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations)プロジェクトも確認できます。

KSPプラグインを追加

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

共通APIでアノテーションライブラリを使用します。

```kotlin
sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            api(libs.koin.annotations)
            // ...
        }
}
```

そして、適切な`sourceSet`でKSPを設定するのを忘れないでください。

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## 共通モジュールとKMP Expectコンポーネントの宣言

`commonMain`の`sourceSet`では、`expect`クラスや関数のネイティブな実装が含まれるパッケージをスキャンするためのモジュールを宣言するだけです。

以下に`PlatformModule`があります。これは`PlatformHelper` `expect`クラスを持つ`com.jetbrains.kmpapp.platform`パッケージをスキャンします。このモジュールクラスには`@Module`と`@ComponentScan`アノテーションが付与されています。

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
生成されるコードは各プラットフォームの実装で行われます。モジュールによるパッケージスキャンが適切なプラットフォームの実装を収集します。
:::

## ネイティブコンポーネントのアノテーション

各実装の`sourceSet`で、適切なプラットフォームの実装を定義できるようになりました。これらの実装には`@Single`アノテーションが付与されています（他の定義アノテーションでも可能です）。

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