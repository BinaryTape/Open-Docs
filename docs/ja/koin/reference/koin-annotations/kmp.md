---
title: Kotlin Multiplatform - 定義とモジュールのためのアノテーション
---

## KSPのセットアップ

KSPのセットアップについては、公式ドキュメント「[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)」に記載されている手順に従ってください。

Koin Annotationsの基本的なセットアップについては、「[Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations)」プロジェクトも確認できます。

KSPプラグインを追加する

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

## 共通コードでの定義とモジュールの宣言

`commonMain`の`sourceSet`では、モジュールを宣言したり、定義をスキャンしたり、通常のKotlin Koinの宣言として関数を定義したりします。「[Definitions](./definitions.md)」と「[Modules](./modules.md)」を参照してください。

## 共有パターン

このセクションでは、定義とモジュールを使ってコンポーネントを共有するいくつかの方法を一緒に見ていきます。

Kotlin Multiplatformアプリケーションでは、一部のコンポーネントはプラットフォームごとに固有に実装する必要があります。これらのコンポーネントは、定義レベルで、特定のクラス（定義またはモジュール）に対して`expect`/`actual`を使用することで共有できます。
`expect`/`actual`の実装を持つ定義を共有することも、`expect`/`actual`を持つモジュールを共有することもできます。

:::info
Kotlinの一般的なガイダンスについては、「[Multiplatform Expect & Actual Rules](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)」ドキュメントを参照してください。
:::

:::warning
Expect/Actualクラスはプラットフォームごとに異なるコンストラクタを持つことはできません。共通スペースで設計された現在のコンストラクタ契約を尊重する必要があります。
:::

### ネイティブ実装のための定義の共有

:::info
「共通モジュール + Expect/Actualクラス定義」を用いた共有を対象とします
:::

この最初の典型的なパターンでは、`@ComponentScan`による定義のスキャンと、モジュールクラス関数としての定義の宣言の両方を使用できます。

`expect`/`actual`定義を使用するには、同じコンストラクタ（デフォルトまたはカスタムのいずれか）を使用する必要があることに注意してください。このコンストラクタは、すべてのプラットフォームで同じでなければなりません。

#### Expect/Actual定義のスキャン

commonMainにて：
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

ネイティブソースで、`actual`クラスを実装します。

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

#### Expect/Actual関数定義の宣言

commonMainにて：
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

ネイティブソースで、`actual`クラスを実装します。

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
「Expect/Actual共通モジュール + 共通インターフェース + ネイティブ実装」を対象とします
:::

場合によっては、各ネイティブ実装で異なるコンストラクタ引数が必要になることがあります。その場合、Expect/Actualクラスは解決策にはなりません。
各プラットフォームで実装する`interface`を使用し、モジュールが適切なプラットフォームの実装を定義できるようにするためのExpect/Actualクラスモジュールが必要です。

commonMainにて：
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

ネイティブソースで、`actual`クラスを実装します。

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
Koinスコープに手動でアクセスするたびに、動的なワイヤリングを行っていることになります。コンパイル時の安全性は、このようなワイヤリングをカバーしません。
:::

### プラットフォームラッパーによるプラットフォーム間の安全な共有

:::info
特定のプラットフォームコンポーネントを「プラットフォームラッパー」としてラップします
:::

特定のプラットフォームコンポーネントを「プラットフォームラッパー」としてラップし、動的なインジェクションを最小限に抑えるのに役立てることができます。

例えば、Androidの`Context`が必要なときにインジェクトできるが、iOS側には影響を与えない`ContextWrapper`を作成できます。

commonMainにて：
```kotlin
// commonMain

expect class ContextWrapper

@Module
expect class ContextModule() {

    @Single
    fun providesContextWrapper(scope : Scope) : ContextWrapper
}
```

ネイティブソースで、`actual`クラスを実装します。

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
この方法により、動的なプラットフォームのワイヤリングを1つの定義に最小限に抑え、システム全体で安全にインジェクションできます。
:::

これで、共通コードから`ContextWrapper`を使用し、Expect/Actualクラスに簡単に渡すことができます。

commonMainにて：
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

ネイティブソースで、`actual`クラスを実装します。

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

### Expect/Actualモジュールの共有 - ネイティブモジュールスキャンに依存

:::info
共通モジュールからネイティブモジュールに依存します
:::

場合によっては、制約を持ちたくなく、各ネイティブ側でコンポーネントをスキャンしたいことがあります。その場合、共通のソースセットで空のモジュールクラスを定義し、各プラットフォームでその実装を定義します。

:::info
共通側で空のモジュールを定義した場合、各ネイティブモジュールの実装は各ネイティブターゲットから生成され、例えばネイティブ専用のコンポーネントをスキャンできるようになります。
:::

commonMainにて：
```kotlin
// commonMain

@Module
expect class NativeModuleC()
```

ネイティブソースセットにて：

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