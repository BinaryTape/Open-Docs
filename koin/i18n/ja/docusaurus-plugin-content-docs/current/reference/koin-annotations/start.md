---
title: "Koin Annotationsを始める"
---
Koin Annotationsプロジェクトの目標は、非常に高速かつ直感的な方法でKoinの定義を宣言し、すべての基盤となるKoin DSLを生成することです。Kotlinコンパイラーのおかげで、開発者のエクスペリエンスを拡張し、高速化🚀することを目標としています。

## はじめに (Getting Started)

Koinに慣れていない場合は、まず[Koin Getting Started](https://insert-koin.io/docs/quickstart/kotlin)をご覧ください。

定義とモジュールのアノテーションでコンポーネントをタグ付けし、通常のKoin APIを使用します。

```kotlin
// 定義を宣言するためにコンポーネントをタグ付けします
@Single
class MyComponent
```

```kotlin
// モジュールを宣言し、アノテーションをスキャンします
@Module
@ComponentScan
class MyModule
```

生成されたコードを使用できるように、次のように`org.koin.ksp.generated.*`インポートを使用します。

```kotlin
// Koin Generationを使用
import org.koin.ksp.generated.*

fun main() {
    val koin = startKoin {
        printLogger()
        modules(
          // ここでモジュールを使用します。Moduleクラスで生成された".module"拡張子を使用します
          MyModule().module
        )
    }

    // 通常どおりKoin APIを使用するだけです
    koin.get<MyComponent>()
}
```

これで、[通常のKoin API](https://insert-koin.io/docs/reference/introduction)を使用して、Koinで新しい定義を使用できます。

## KSPオプション (KSP Options)

Koinコンパイラーは、構成するためのいくつかのオプションを提供します。公式ドキュメントに従って、次のオプションをプロジェクトに追加できます。[Ksp Quickstart Doc](https://kotlinlang.org/docs/ksp-quickstart.html)

### コンパイル時の安全性 - コンパイル時にKoin構成を確認します（1.3.0以降）(Compile Safety - check your Koin config at compile time (since 1.3.0))

Koin Annotationsを使用すると、コンパイラープラグインでコンパイル時にKoin構成を検証できます。これは、次のKspオプションでアクティブ化できます。Gradleモジュールに追加します。

```groovy
// build.gradle または build.gradle.kts 内

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

コンパイラーは、構成で使用されているすべての依存関係が宣言されており、使用されているすべてのモジュールにアクセスできることを確認します。

### @Providedでコンパイル時の安全性をバイパスする (Bypass Compile Safety with @Provided)（1.4.0以降）

コンパイラーから無視されるタイプ（Androidの一般的なタイプ）の中で、コンパイラープラグインはコンパイル時にKoin構成を検証できます。チェック対象からパラメーターを除外する場合は、パラメーターで`@Provided`を使用して、このタイプが現在のKoin Annotations構成の外部で提供されることを示すことができます。

次は、`MyProvidedComponent`がKoinですでに宣言されていることを示します。

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### デフォルトモジュールの無効化 (Disabling Default Module)（1.3.0以降）

デフォルトでは、Koinコンパイラーはモジュールにバインドされていない定義を検出し、「デフォルトモジュール」（プロジェクトのルートで生成されるKoinモジュール）に配置します。次のオプションを使用して、デフォルトモジュールの使用と生成を無効にすることができます。

```groovy
// build.gradle または build.gradle.kts 内

ksp {
    arg("KOIN_DEFAULT_MODULE","false")
}
```

### Kotlin KMPの設定 (Kotlin KMP Setup)

公式ドキュメントの説明に従って、KSPの設定に従ってください。[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

Koin Annotationsの基本的な設定については、[Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations)プロジェクトも確認してください。