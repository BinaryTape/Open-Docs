---
title: コンパイラプラグインオプション
---

Koin コンパイラプラグインは、その動作をカスタマイズするための設定オプションをサポートしています。

## 設定

`build.gradle.kts` でコンパイラプラグインを構成します：

```kotlin
koinCompiler {
    userLogs = true
    debugLogs = false
    dslSafetyChecks = true
}
```

## 利用可能なオプション

### userLogs

- **型**: Boolean
- **デフォルト**: `false`
- **説明**: コンポーネント検出および DSL/アノテーション処理のログを有効にします。プラグインによってどのコンポーネントが検出され、処理されたかを表示します。
- **用途**: コンポーネント検出の問題をデバッグするために、開発中に有効にします。

```kotlin
koinCompiler {
    userLogs = true
}
```

### debugLogs

- **型**: Boolean
- **デフォルト**: `false`
- **説明**: 内部プラグイン処理（FIR/IR フェーズ、モジュール検出）の詳細なデバッグログを有効にします。
- **用途**: プラグインの問題をトラブルシューティングする場合や、バグを報告する場合に有効にします。

```kotlin
koinCompiler {
    debugLogs = true
}
```

### dslSafetyChecks

- **型**: Boolean
- **デフォルト**: `true`
- **説明**: ラムダ内の DSL 関数呼び出し（`create()` など）が唯一の命令であることを検証します。よくある間違いを防ぐのに役立ちます。
- **用途**: 必要に応じて、従来の DSL からの移行中に一時的に無効にします。

```kotlin
koinCompiler {
    dslSafetyChecks = false  // 移行中に無効にする
}
```

## 完全な例

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

koinCompiler {
    userLogs = true        // コンポーネント検出をログ出力
    debugLogs = false      // 詳細ログ（デフォルトはオフ）
    dslSafetyChecks = true // DSL の使用法を検証
}
```

## ベストプラクティス

- どのコンポーネントが検出されているかを確認するために、開発中は **`userLogs` を有効**にする。
- より安全な DSL の使用のために、**`dslSafetyChecks` を有効**（デフォルト）のままにする。
- **`debugLogs` はプラグインの問題をトラブルシューティングする場合のみ**使用する。

## 関連項目

- **[コンパイラプラグインのセットアップ](/docs/setup/compiler-plugin)** - 完全なセットアップガイド
- **[アノテーションの使用開始](/docs/reference/koin-annotations/start)** - クイックスタートガイド