---
title: Kotlin Multiplatform - 定義（Definitions）とモジュールの注釈（Annotations）
---

## KSPのセットアップ

公式ドキュメントの説明に従ってKSPのセットアップを行ってください: [KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

また、Koin Annotationsの基本的なセットアップについては、[Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) プロジェクトも確認できます。

KSPプラグインを追加します：

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

common APIで注釈ライブラリを使用します：

```kotlin
sourceSets {
    commonMain.dependencies {
        implementation(libs.koin.core)
        api(libs.koin.annotations)
        // ...
    }
}
```

そして、適切な sourceSet で KSP を設定することを忘れないでください：

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## 共通コードでの定義とモジュールの宣言

`commonMain` sourceSet で、Module を宣言し、定義をスキャンするか、通常の Kotlin Koin 宣言として関数を定義します。[Definitions](./definitions.md) および [Modules](./modules.md) を参照してください。

## 共有パターン

このセクションでは、定義とモジュールを使用してコンポーネントを共有するためのいくつかの方法を一緒に見ていきます。

Kotlin Multiplatform アプリケーションでは、一部のコンポーネントをプラットフォームごとに具体的に実装する必要があります。これらのコンポーネントは、特定のクラス（定義またはモジュール）に対して expect/actual を使用することで、定義レベルで共有できます。
expect/actual 実装を持つ定義、または expect/actual を持つモジュールを共有できます。

:::info
一般的な Kotlin のガイダンスについては、[Multiplatform Expect & Actual Rules](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) ドキュメントを参照してください。
:::

:::warning
Expect/Actual クラスは、プラットフォームごとに異なるコンストラクタを持つことはできません。共通スペース（common space）で設計された現在のコンストラクタのコントラクトを尊重する必要があります。
:::

### ネイティブ実装のための定義の共有

:::info
共通モジュール（Common Module） + Expect/Actual クラス定義による共有を対象とします。
:::

この最初の古典的なパターンでは、`@ComponentScan` による定義のスキャンと、モジュールクラスの関数としての定義の宣言の両方を使用できます。

expect/actual 定義を使用するには、同じコンストラクタ（デフォルトまたはカスタムのもの）を使用することに注意してください。このコンストラクタはすべてのプラットフォームで同じである必要があります。

#### Expect/Actual 定義のスキャン

commonMain の場合:
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

ネイティブソースで actual クラスを実装します：

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

#### Expect/Actual 関数定義の宣言

commonMain の場合:
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

ネイティブソースで actual クラスを実装します：

```kotlin
// androidMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentB {
    actual fun sayHello() : String = "I'm Android - B"
}

// iOSMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentB {
    actual fun sayHello() : String = "I'm iOS - B"
}
```

### 異なるネイティブコントラクトを持つ定義の共有

:::info
Expect/Actual 共通モジュール + 共通インターフェース + ネイティブ実装を対象とします。
:::

ネイティブ実装ごとに異なるコンストラクタ引数が必要な場合があります。その場合、Expect/Actual クラスは解決策になりません。
各プラットフォームで実装する `interface` と、モジュールが適切なプラットフォーム実装を定義できるようにするための Expect/Actual クラスモジュールを使用する必要があります。

commonMain の場合:
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

ネイティブソースで actual クラスを実装します：

```kotlin
// androidMain

@Module
actual class NativeModuleD {
    @Factory
    actual fun providesPlatformComponentD(scope : org.koin.core.scope.Scope) : PlatformComponentD = PlatformComponentDAndroid(scope)
}

class PlatformComponentDAndroid(scope : org.koin.core.scope.Scope) : PlatformComponentD{
    val context : Context = scope.get()
    override fun sayHello() : String = "I'm Android - D - with ${context}"
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
Koin スコープへの手動アクセスを使用するたびに、ダイナミックワイヤリング（dynamic wiring）を行っていることになります。コンパイル時の安全性は、このようなワイヤリングをカバーしません。
:::

### プラットフォームラッパーによるプラットフォーム間での安全な共有

:::info
特定のプラットフォームコンポーネントを「プラットフォームラッパー（platform wrapper）」としてラップします。
:::

特定のプラットフォームコンポーネントを「プラットフォームラッパー」としてラップすることで、ダイナミックインジェクション（dynamic injection）を最小限に抑えることができます。

例えば、必要に応じて Android の `Context` を注入でき、iOS 側には影響を与えない `ContextWrapper` を作成できます。

commonMain の場合:
```kotlin
// commonMain

expect class ContextWrapper

@Module
expect class ContextModule() {

    @Single
    fun providesContextWrapper(scope : Scope) : ContextWrapper
}
```

ネイティブソースで actual クラスを実装します：

```kotlin
// androidMain
actual class ContextWrapper(val context: Context)

@Module
actual class ContextModule {
    
    // 起動時に androidContext() のセットアップが必要
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
これにより、プラットフォーム固有のダイナミックワイヤリングを1つの定義に最小限に抑え、システム全体で安全に注入できるようになります。
:::

これで、共通コードから `ContextWrapper` を使用し、Expect/Actual クラスに簡単に渡すことができます。

commonMain の場合:
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

ネイティブソースで actual クラスを実装します：

```kotlin
// androidMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA actual constructor(val ctx : ContextWrapper) {
    actual fun sayHello() : String = "I'm Android - A - with context: ${ctx.context}"
}

// iOSMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA actual constructor(val ctx : ContextWrapper) {
    actual fun sayHello() : String = "I'm iOS - A"
}
```

### Expect/Actual モジュールの共有 - ネイティブモジュールスキャンへの依存

:::info
共通モジュールからネイティブモジュールに依存します。
:::

制約を持たせず、各ネイティブ側でコンポーネントをスキャンしたい場合があります。共通ソースセットで空のモジュールクラスを定義し、各プラットフォームでその実装を定義します。

:::info
共通側で空のモジュールを定義すると、各ネイティブターゲットから各ネイティブモジュールの実装が生成され、例えばネイティブのみのコンポーネントをスキャンできるようになります。
:::

commonMain の場合:
```kotlin
// commonMain

@Module
expect class NativeModuleC()
```

ネイティブソースセットの場合:

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
// iOSでは何もしない
@Module
actual class NativeModuleC