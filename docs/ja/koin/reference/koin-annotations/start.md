---
title: Koin Annotationsを始める
---

Koin Annotationsプロジェクトの目的は、Koinの定義を非常に高速かつ直感的な方法で宣言できるよう支援し、基盤となるすべてのKoin DSLを自動生成することです。これは、Kotlinコンパイラのおかげで、開発者エクスペリエンスを拡大し、迅速な開発を可能にすることを目的としています 🚀。

## はじめに

Koinに馴染みがないですか？まずは[Koin入門](https://insert-koin.io/docs/quickstart/kotlin)をご覧ください。

コンポーネントを定義（definition）およびモジュール（module）アノテーションでタグ付けし、通常のKoin APIを使用します。

```kotlin
// コンポーネントにタグを付けて定義を宣言します
@Single
class MyComponent
```

```kotlin
// モジュールを宣言し、アノテーションをスキャンします
@Module
@ComponentScan
class MyModule
```

生成されたコードを使用できるように、`org.koin.ksp.generated.*`のインポートを次のように使用してください。

```kotlin
// Koin Generationを使用
import org.koin.ksp.generated.*

fun main() {
    val koin = startKoin {
        printLogger()
        modules(
          // モジュールクラスに生成された「.module」拡張子を付けて、ここでモジュールを使用します
          MyModule().module
        )
    }

    // 通常のKoin APIとして使用するだけです
    koin.get<MyComponent>()
}
```

これで完了です。通常のKoin APIを使って、Koinで新しい定義を使用できます。

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

### デフォルトモジュールの無効化（バージョン1.3.0以降）

デフォルトでは、Koinコンパイラはモジュールにバインドされていない定義を検出し、プロジェクトのルートに生成される「デフォルトモジュール」と呼ばれるKoinモジュールに配置します。次のオプションを使用すると、デフォルトモジュールの使用と生成を無効にできます。

```groovy
// build.gradleまたはbuild.gradle.kts内

ksp {
    arg("KOIN_DEFAULT_MODULE","false")
}
```

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