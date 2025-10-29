---
title: KSPコンパイラオプション
---

Koin Annotations KSPプロセッサは、コンパイル時に渡すことができるいくつかの設定オプションをサポートしており、コード生成の動作をカスタマイズできます。

## 利用可能なオプション

### `KOIN_CONFIG_CHECK`
- **型**: Boolean
- **デフォルト**: `false`
- **説明**: Koin定義のコンパイル時設定チェックを有効にします。有効にすると、コンパイラはコンパイル時にすべてのKoin設定を検証し、安全性を確保し、潜在的な問題を早期に発見します。
- **使用法**: 実行時よりも前に設定の問題を検出することで、コンパイル時の安全性に貢献します。

### `KOIN_LOG_TIMES`
- **型**: Boolean
- **デフォルト**: `false`
- **説明**: コンパイル中のモジュール生成のタイミングログを表示します。これにより、コード生成のパフォーマンスを監視し、潜在的なボトルネックを特定するのに役立ちます。
- **使用法**: デバッグやビルド時間の最適化に役立ちます。

### `KOIN_DEFAULT_MODULE`
- **型**: Boolean
- **デフォルト**: `false`
- **ステータス**: ⚠️ **バージョン1.3.0以降非推奨**
- **説明**: 指定された定義に対して明示的なモジュールが見つからない場合に、デフォルトモジュールを自動的に生成します。**このオプションはAnnotations 1.3.0以降非推奨であり、使用は推奨されません。** 代わりに、`@Configuration`アノテーションと`@KoinApplication`を使用して、アプリケーションを自動的にブートストラップしてください。
- **使用法**: このオプションの使用は避けてください。コードの明確さと保守性を高めるために、`@Configuration`と`@KoinApplication`による明示的なモジュール構成を推奨します。

### `KOIN_GENERATION_PACKAGE`
- **型**: String
- **デフォルト**: `"org.koin.ksp.generated"`
- **説明**: 生成されたKoinクラスが配置されるパッケージ名を指定します。パッケージ名は有効なKotlinパッケージ識別子である必要があります。**重要**: このオプションを設定する場合、すべてのモジュールで同じ値を一貫して使用する必要があります。
- **使用法**: プロジェクトがデフォルトとは異なるパスにコードを生成する必要がある場合（例: 特定のコーディング規則やプロジェクト構造の要件のため）にのみ、このオプションを使用してください。すべてのモジュールで同じパッケージ名を使用するようにしてください。

### `KOIN_USE_COMPOSE_VIEWMODEL`
- **型**: Boolean
- **デフォルト**: `true`
- **説明**: Android固有のViewModelではなく、`koin-core-viewmodel`の主要なDSLを使用してViewModel定義を生成します。これは、Kotlin Multiplatformの互換性を提供し、統一されたViewModel APIを使用するためにデフォルトで有効になっています。
- **使用法**: すべてのプロジェクトで有効にしておくことを推奨します。複数のプラットフォームでViewModelサポートが必要なKMPプロジェクトにとって不可欠です。

### `KOIN_EXPORT_DEFINITIONS`
- **型**: Boolean
- **デフォルト**: `true`
- **説明**: モジュールにアセンブルされた定義に加えて、エクスポートされた定義が生成されるかどうかを制御します。無効にすると、モジュールにアセンブルされた定義のみが生成され、スタンドアロンでエクスポートされた定義は除外されます。
- **使用法**: 明示的にモジュールにアセンブルされた定義のみを生成し、スタンドアロンでエクスポートされた定義を除外したい場合は、`false`に設定してください。より厳格なモジュール構成に役立ちます。

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

- 開発ビルドで`**KOIN_CONFIG_CHECK**`を有効にし、設定の問題を早期に発見する
- ビルドの最適化中に`**KOIN_LOG_TIMES**`を使用して、パフォーマンスのボトルネックを特定する
- コーディング規則への準拠が必要な場合にのみ`**KOIN_GENERATION_PACKAGE**`を使用する — すべてのモジュールで一貫した使用を保証する
- 複数のプラットフォームで統一されたViewModel APIのために`**KOIN_USE_COMPOSE_VIEWMODEL**`を有効のままにする（デフォルト）
- `**KOIN_DEFAULT_MODULE**`の使用を避ける — 適切なアプリケーションのブートストラップには`@Configuration`と`@KoinApplication`を使用する

## パッケージ名の検証

`KOIN_GENERATION_PACKAGE`を使用する場合、提供されるパッケージ名は次の要件を満たす必要があります。
- 空でないこと
- ドットで区切られた有効なKotlin識別子のみを含むこと
- Kotlinのキーワードや予約語を使用しないこと
- 標準的なJava/Kotlinのパッケージ命名規則に従うこと

無効なパッケージ名を使用すると、詳細なメッセージと共にコンパイルエラーが発生します。