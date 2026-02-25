---
title: Koin Annotations を使い始める
---

Koin Annotations プロジェクトの目標は、Koin の定義を迅速かつ直感的な方法で宣言できるようにし、基盤となるすべての Koin DSL を自動生成することです。Kotlin コンパイラのおかげで、開発者がスケーリングを体験し、迅速に開発を進められるようにすることを目指しています 🚀。

## はじめに (Getting Started)

Koin に詳しくない場合は、まず [Koin Getting Started](https://insert-koin.io/docs/quickstart/kotlin/) をご覧ください。

コンポーネントに定義（definition）およびモジュール（module）のアノテーションを付与し、通常の Koin API を使用します。

```kotlin
// 定義を宣言するためにコンポーネントにタグを付ける
@Single
class MyComponent
```

### 基本的なモジュールのセットアップ

```kotlin
// モジュールを宣言し、アノテーションをスキャンする
@Module
class MyModule
```

これで、`@KoinApplication` を使用して Koin アプリケーションを開始し、使用するモジュールを明示的に指定できるようになります。

```kotlin
// 以下のインポートにより、MyModule.module や MyApp.startKoin() のような
// 生成された拡張関数にアクセスできるようになります
import org.koin.ksp.generated.*

@KoinApplication(modules = [MyModule::class])
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 通常通り Koin API を使用するだけです
    KoinPlatform.getKoin().get<MyComponent>()
}
```

### 設定ベースのモジュールセットアップ

あるいは、`@Configuration` を使用して、自動的にロードされるモジュールを作成することもできます。

```kotlin
// 設定（Configuration）付きのモジュール - デフォルト設定に自動的に含まれる
@Module
@Configuration
class MyModule
```

設定を使用すると、モジュールを明示的に指定する必要はありません。

```kotlin
// 以下のインポートにより、生成された拡張関数にアクセスできるようになります
// このアプローチでは、@Configuration がマークされたすべてのモジュールを自動的にロードします
import org.koin.ksp.generated.*

@KoinApplication
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 通常通り Koin API を使用するだけです
    KoinPlatform.getKoin().get<MyComponent>()
}
```

以上です。[通常の Koin API](https://insert-koin.io/docs/reference/introduction) を使用して、Koin で新しい定義を使用できます。

## KSP オプション

Koin コンパイラには、いくつか設定可能なオプションがあります。公式ドキュメントに従って、プロジェクトに以下のオプションを追加できます：[Ksp Quickstart Doc](https://kotlinlang.org/docs/ksp-quickstart.html#pass-options-to-processors)

### コンパイル時の安全性 - コンパイル時に Koin 設定をチェックする（1.3.0 以降）

Koin Annotations では、コンパイラプラグインがコンパイル時に Koin 設定を検証できます。これは、Gradle モジュールに以下の Ksp オプションを追加することで有効化できます。

```groovy
// build.gradle または build.gradle.kts 内

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

コンパイラは、設定で使用されているすべての依存関係が宣言されているか、および使用されているすべてのモジュールにアクセス可能であるかをチェックします。

### @Provided によるコンパイル時の安全性のバイパス（1.4.0 以降）

コンパイラによって無視される型（Android の一般的な型など）を除き、コンパイラプラグインはコンパイル時に Koin 設定を検証できます。チェック対象からパラメータを除外したい場合は、パラメータに `@Provided` を使用することで、その型が現在の Koin Annotations 設定の外部から提供されていることを示すことができます。

以下は、`MyProvidedComponent` がすでに Koin で宣言されていることを示しています。

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### デフォルトモジュール（1.3.0 以降は非推奨）

:::warning
デフォルトモジュール（default module）のアプローチは、Annotations 1.3.0 以降非推奨です。整理と明確化のために、`@Module` および `@Configuration` アノテーションを使用した明示的なモジュールの使用をお勧めします。
:::

以前は、Koin コンパイラはモジュールにバインドされていない定義をすべて検出し、「デフォルトモジュール」に配置していました。このアプローチは現在非推奨となり、代わりに `@Configuration` および `@KoinApplication` アノテーションを使用することが推奨されています。

**非推奨のアプローチ**（使用を避けてください）:
```groovy
// build.gradle または build.gradle.kts 内

ksp {
    arg("KOIN_DEFAULT_MODULE","true")
}
```

**推奨されるアプローチ**: 上記の例で示したように、`@Configuration` と `@KoinApplication` を使用して明示的なモジュール構成を使用してください。

### Kotlin KMP のセットアップ

公式ドキュメントの説明に従って、KSP のセットアップを行ってください：[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

また、Koin Annotations の基本的なセットアップが含まれている [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) プロジェクトも確認できます。

### Pro-Guard

Koin Annotations アプリケーションを SDK として埋め込む予定がある場合は、以下の Pro-Guard ルールを確認してください。

```
# アノテーション定義を保持する
-keep class org.koin.core.annotation.** { *; }

# Koin アノテーションが付与されたクラスを保持する
-keep @org.koin.core.annotation.* class * { *; }