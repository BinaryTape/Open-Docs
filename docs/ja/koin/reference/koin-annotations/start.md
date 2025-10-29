---
title: Koin Annotationsを始める
---

Koin Annotationsプロジェクトの目的は、Koinの定義を高速かつ直感的な方法で宣言できるよう支援し、基盤となるすべてのKoin DSLを自動生成することです。Kotlinコンパイラのおかげで、開発者エクスペリエンスを拡大し、迅速な開発を可能にすることを目指しています 🚀。

## はじめに

Koinに馴染みがないですか？まずは[Koin入門](https://insert-koin.io/docs/quickstart/kotlin/)をご覧ください。

コンポーネントを定義（definition）およびモジュール（module）アノテーションでタグ付けし、通常のKoin APIを使用します。

```kotlin
// コンポーネントにタグを付けて定義を宣言します
@Single
class MyComponent
```

### 基本的なモジュールの設定

```kotlin
// モジュールを宣言し、アノテーションをスキャンします
@Module
class MyModule
```

これで、`@KoinApplication`を使用してKoinアプリケーションを開始し、使用するモジュールを明示的に指定できます。

```kotlin
// 以下のimportにより、生成された拡張関数にアクセスできます
// 例: MyModule.moduleやMyApp.startKoin() 
import org.koin.ksp.generated.*

@KoinApplication(modules = [MyModule::class])
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 通常どおりKoin APIを使用するだけです
    KoinPlatform.getKoin().get<MyComponent>()
}
```

### 設定ベースのモジュール設定

別の方法として、`@Configuration`を使用して自動的にロードされるモジュールを作成できます。

```kotlin
// 設定付きモジュール - デフォルト設定に自動的に含まれる
@Module
@Configuration
class MyModule
```

設定を使用すると、モジュールを明示的に指定する必要はありません。

```kotlin
// 以下のimportにより、生成された拡張関数にアクセスできます
// このアプローチでは、@Configurationでマークされたすべてのモジュールが自動的にロードされます
import org.koin.ksp.generated.*

@KoinApplication
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 通常どおりKoin APIを使用するだけです
    KoinPlatform.getKoin().get<MyComponent>()
}
```

これで完了です。Koinで新しい定義を[通常のKoin API](https://insert-koin.io/docs/reference/introduction)とともに使用できます。

## KSPオプション

Koinコンパイラにはいくつかの設定オプションがあります。公式ドキュメントに従い、次のオプションをプロジェクトに追加できます：[Ksp Quickstart Doc](https://kotlinlang.org/docs/ksp-quickstart.html#pass-options-to-processors)

### コンパイル時の安全性 - コンパイル時にKoin設定をチェックする（バージョン1.3.0以降）

Koin Annotationsを使用すると、コンパイラプラグインがコンパイル時にKoin設定を検証できます。これは、Gradleモジュールに追加する次のKSPオプションで有効にできます。

```groovy
// build.gradleまたはbuild.gradle.kts内

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

コンパイラは、設定で使用されているすべての依存関係が宣言されていること、および使用されているすべてのモジュールがアクセス可能であることを確認します。

### @Providedによるコンパイル時の安全性バイパス（バージョン1.4.0以降）

コンパイラが無視する型（Androidの一般的な型など）を除き、コンパイラプラグインはコンパイル時にKoin設定を検証できます。パラメータをチェック対象から除外したい場合は、そのパラメータに`@Provided`を使用することで、その型が現在のKoin Annotations設定の外部から提供されていることを示すことができます。

以下は、`MyProvidedComponent`がKoinですでに宣言されていることを示します。

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### デフォルトモジュール（バージョン1.3.0以降非推奨）

:::warning
デフォルトモジュールのアプローチは、Annotations 1.3.0以降非推奨です。より良い構成と明確化のために、`@Module`および`@Configuration`アノテーションを使用した明示的なモジュールを使用することをお勧めします。
:::

以前は、Koinコンパイラはモジュールにバインドされていない定義を検出し、「デフォルトモジュール」に配置していました。このアプローチは現在、`@Configuration`と`@KoinApplication`アノテーションの使用が推奨されるため、非推奨となっています。

**非推奨のアプローチ**（使用を避ける）：
```groovy
// build.gradleまたはbuild.gradle.kts内

ksp {
    arg("KOIN_DEFAULT_MODULE","true")
}
```

**推奨されるアプローチ**：`@Configuration`と`@KoinApplication`を使用した上記の例に示すように、明示的なモジュール構成を使用してください。

### Kotlin KMPのセットアップ

公式ドキュメントに記載されているKSPのセットアップに従ってください：[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

Koin Annotationsの基本的なセットアップが施された[Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations)プロジェクトも参照できます。

### Pro-Guard

Koin AnnotationsアプリケーションをSDKとして組み込む場合は、次のPro-Guardルールを参照してください。

```
# アノテーション定義を保持
-keep class org.koin.core.annotation.** { *; }

# Koinアノテーションが付与されたクラスを保持  
-keep @org.koin.core.annotation.* class * { *; }
```