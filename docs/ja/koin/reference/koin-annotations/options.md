---
title: KSP コンパイラオプション
---

Koin Annotations KSP プロセッサは、コード生成の動作をカスタマイズするために、コンパイル中に渡すことができるいくつかの設定オプションをサポートしています。

## 利用可能なオプション

### KOIN_CONFIG_CHECK
- **型**: Boolean
- **デフォルト**: `false`
- **説明**: Koin 定義のコンパイル時設定チェックを有効にします。有効にすると、コンパイラはコンパイル時にすべての Koin 設定を検証し、安全性を確保して潜在的な問題を早期に発見します。
- **用途**: 実行前に設定の問題を検出することで、コンパイル時の安全性向上に役立ちます。

### KOIN_LOG_TIMES
- **型**: Boolean
- **デフォルト**: `false`
- **説明**: コンパイル中のモジュール生成のタイミングログを表示します。これにより、コード生成のパフォーマンスを監視し、潜在的なボトルネックを特定するのに役立ちます。
- **用途**: デバッグやビルド時間の最適化に有用です。

### KOIN_DEFAULT_MODULE
- **型**: Boolean
- **デフォルト**: `false`
- **ステータス**: ⚠️ **1.3.0 以降は非推奨**
- **説明**: 特定の定義に対して明示的なモジュールが見つからない場合に、デフォルトのモジュールを自動的に生成します。**このオプションは Annotations 1.3.0 以降非推奨であり、使用は推奨されません。** 代わりに `@Configuration` アノテーションと `@KoinApplication` を使用して、アプリケーションを自動的にブートストラップしてください。
- **用途**: このオプションの使用は避けてください。コードの明瞭性とメンテナンス性を高めるため、`@Configuration` と `@KoinApplication` による明示的なモジュール構成を推奨します。

### KOIN_GENERATION_PACKAGE
- **型**: String
- **デフォルト**: `"org.koin.ksp.generated"`
- **説明**: 生成された Koin クラスが配置されるパッケージ名を指定します。パッケージ名は、有効な Kotlin パッケージ識別子である必要があります。**重要**: このオプションを設定する場合、すべてのモジュールで同じ値を一貫して使用する必要があります。
- **用途**: 特定のコーディング規則やプロジェクト構造の要件などにより、プロジェクトでデフォルト以外のパスにコードを生成する必要がある場合にのみ、このオプションを使用してください。すべてのモジュールで同じパッケージ名を使用していることを確認してください。

### KOIN_USE_COMPOSE_VIEWMODEL
- **型**: Boolean
- **デフォルト**: `true`
- **説明**: Android 特有の ViewModel ではなく、`koin-core-viewmodel` のメイン DSL を使用して ViewModel 定義を生成します。これは、Kotlin Multiplatform (KMP) の互換性を提供し、統一された ViewModel API を使用するためにデフォルトで有効になっています。
- **用途**: すべてのプロジェクトで有効のままにすることを推奨します。プラットフォーム間で ViewModel のサポートが必要な KMP プロジェクトには不可欠です。

### KOIN_EXPORT_DEFINITIONS
- **型**: Boolean
- **デフォルト**: `true`
- **説明**: モジュールにまとめられた定義に加えて、エクスポートされた定義（exported definitions）を生成するかどうかを制御します。無効にすると、モジュールにまとめられた定義のみが生成され、スタンドアロンのエクスポートされた定義は除外されます。
- **用途**: モジュールで明示的にまとめられた定義のみを生成し、スタンドアロンのエクスポートされた定義を除外したい場合に `false` に設定します。より厳格なモジュール管理に役立ちます。

## 設定例

### Gradle Kotlin DSL

```kotlin
ksp {
    arg("KOIN_CONFIG_CHECK", "true")
    arg("KOIN_LOG_TIMES", "true")
    arg("KOIN_DEFAULT_MODULE", "false")
    arg("KOIN_GENERATION_PACKAGE", "com.mycompany.koin.generated")
    arg("KOIN_USE_COMPOSE_VIEWMODEL", "true")
    arg("KOIN_EXPORT_DEFINITIONS", "true")
}
```

### Gradle Groovy DSL

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK", "true")
    arg("KOIN_LOG_TIMES", "true")
    arg("KOIN_DEFAULT_MODULE", "false")
    arg("KOIN_GENERATION_PACKAGE", "com.mycompany.koin.generated")
    arg("KOIN_USE_COMPOSE_VIEWMODEL", "true")
    arg("KOIN_EXPORT_DEFINITIONS", "true")
}
```

## ベストプラクティス

- 設定の問題を早期に発見するため、開発ビルドでは **KOIN_CONFIG_CHECK を有効**にする。
- ビルドの最適化中に **KOIN_LOG_TIMES を使用**して、パフォーマンスのボトルネックを特定する。
- **KOIN_GENERATION_PACKAGE は、コーディング規則の遵守に必要な場合にのみ使用**する。その際、すべてのモジュールで一貫して使用されていることを確認する。
- プラットフォーム間で統一された ViewModel API を使用するため、**KOIN_USE_COMPOSE_VIEWMODEL は有効（デフォルト）のまま**にする。
- **KOIN_DEFAULT_MODULE を避ける**。適切なアプリケーションのブートストラップには `@Configuration` と `@KoinApplication` を使用する。

## パッケージ名の検証

`KOIN_GENERATION_PACKAGE` を使用する場合、指定するパッケージ名は以下の条件を満たす必要があります：
- 空ではないこと
- ドットで区切られた有効な Kotlin 識別子のみが含まれていること
- Kotlin のキーワードや予約語を使用していないこと
- 標準的な Java/Kotlin のパッケージ命名規則に従っていること

無効なパッケージ名が指定された場合、詳細なメッセージとともにコンパイルエラーが発生します。