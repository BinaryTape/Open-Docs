---
title: Kotlinコンポーネントの安定性
---
Kotlinの言語およびツールセットは、JVM、JS、およびNativeターゲット用のコンパイラ、標準ライブラリ、さまざまな付属ツールなど、多くのコンポーネントに分かれています。これらのコンポーネントの多くは、**Stable**として正式にリリースされています。これは、[「_快適なアップデート_」と「_言語の現代性の維持_」の原則](kotlin-evolution-principles)に従って、下位互換性を維持しながら進化していることを意味します。

_フィードバックループ_の原則に従い、コミュニティが試せるように多くのものを早期にリリースしているため、多くのコンポーネントはまだ**Stable**としてリリースされていません。それらの中には非常に初期段階のものもあれば、より成熟したものもあります。各コンポーネントの進化の速さと、ユーザーが採用する際のリスクのレベルに応じて、**Experimental**、**Alpha**、または**Beta**としてマークします。

## 安定性レベルの説明

これらの安定性レベルとその意味に関する簡単なガイドを次に示します。

**Experimental**は、「おもちゃのプロジェクトでのみ試してください」を意味します。
  * アイデアを試しているだけで、一部のユーザーに試してもらってフィードバックを得たいと考えています。うまくいかない場合は、すぐに削除する可能性があります。

**Alpha**は、「自己責任で使用してください。移行の問題が発生する可能性があります」を意味します。
  * このアイデアを製品化する予定ですが、まだ最終的な形にはなっていません。

**Beta**は、「使用できます。移行の問題を最小限に抑えるよう最善を尽くします」を意味します。
  * ほぼ完了しており、ユーザーからのフィードバックは特に重要です。
  * それでも、100％完了しているわけではないため、（あなた自身のフィードバックに基づいて）変更される可能性があります。
  * 最高のアップデート体験のために、事前に非推奨の警告に注意してください。

_Experimental_、_Alpha_、および_Beta_をまとめて**pre-stable**レベルと呼びます。

<a name="stable"/>

**Stable**は、「最も保守的なシナリオでも使用できます」を意味します。
  * 完了しています。厳格な[下位互換性ルール](https://kotlinfoundation.org/language-committee-guidelines/)に従って進化させていきます。

安定性レベルは、コンポーネントがStableとしていつリリースされるかについては何も示していないことに注意してください。同様に、コンポーネントがリリース前にどれだけ変更されるかを示すものでもありません。コンポーネントがどれだけ速く変化しているか、およびユーザーがアップデートの問題にどれだけリスクを冒しているかを示すだけです。

## KotlinコンポーネントのGitHubバッジ

[Kotlin GitHub organization](https://github.com/Kotlin)は、Kotlin関連のさまざまなプロジェクトをホストしています。そのうちのいくつかはフルタイムで開発し、他のものはサイドプロジェクトです。

各Kotlinプロジェクトには、その安定性とサポートステータスを示す2つのGitHubバッジがあります。

* **Stability**ステータス。これは、各プロジェクトがどれだけ速く進化しているか、およびユーザーが採用する際にどれだけリスクを冒しているかを示します。
  安定性ステータスは、[Kotlin言語の機能とそのコンポーネントの安定性レベル](#stability-levels-explained)と完全に一致します。
    * <img src="https://kotl.in/badges/experimental.svg" alt="Experimental stability level" style={{verticalAlign: 'middle'}}/> は**Experimental**を表します
    * <img src="https://kotl.in/badges/alpha.svg" alt="Alpha stability level" style={{verticalAlign: 'middle'}}/> は**Alpha**を表します
    * <img src="https://kotl.in/badges/beta.svg" alt="Beta stability level" style={{verticalAlign: 'middle'}}/> は**Beta**を表します
    * <img src="https://kotl.in/badges/stable.svg" alt="Stable stability level" style={{verticalAlign: 'middle'}}/> は**Stable**を表します

* **Support**ステータス。これは、プロジェクトの維持とユーザーの問題解決を支援することに対する私たちのコミットメントを示します。
  サポートのレベルは、すべてのJetBrains製品で統一されています。
  [詳細については、JetBrains Open Sourceドキュメントを参照してください](https://github.com/JetBrains#jetbrains-on-github)。

## サブコンポーネントの安定性

安定したコンポーネントには、実験的なサブコンポーネントが含まれている場合があります。たとえば、次のようになります。
* 安定したコンパイラには、実験的な機能がある場合があります。
* 安定したAPIには、実験的なクラスまたは関数が含まれている場合があります。
* 安定したコマンドラインツールには、実験的なオプションがある場合があります。

どのサブコンポーネントが**Stable**でないかを正確に文書化するようにしています。また、可能な限りユーザーに警告し、安定版としてリリースされていない機能の誤用を避けるために、明示的にオプトインするように依頼するように最善を尽くします。

## Kotlinコンポーネントの現在の安定性

:::note
デフォルトでは、すべての新しいコンポーネントはExperimentalステータスを持ちます。

:::

### Kotlinコンパイラ

| **Component**                                                       | **Status** | **Status since version** | **Comments** |
|---------------------------------------------------------------------|------------|--------------------------|--------------|
| Kotlin/JVM                                                          | Stable     | 1.0.0                    |              |
| Kotlin/Native                                                       | Stable     | 1.9.0                    |              |
| Kotlin/JS                                                           | Stable     | 1.3.0                    |              |
| Kotlin/Wasm                                                         | Alpha      | 1.9.20                   |              |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable     |                          |              |

### コアコンパイラプラグイン

| **Component**                                    | **Status**   | **Status since version** | **Comments** |
|--------------------------------------------------|--------------|--------------------------|--------------|
| [All-open](all-open-plugin)                   | Stable       | 1.3.0                    |              |
| [No-arg](no-arg-plugin)                       | Stable       | 1.3.0                    |              |
| [SAM-with-receiver](sam-with-receiver-plugin) | Stable       | 1.3.0                    |              |
| [kapt](kapt)                                  | Stable       | 1.3.0                    |              |
| [Lombok](lombok)                              | Experimental | 1.5.20                   |              |
| [Power-assert](power-assert)                  | Experimental | 2.0.0                    |              |

### Kotlinライブラリ

| **Component**         | **Status** | **Status since version** | **Comments** |
|-----------------------|------------|--------------------------|--------------|
| kotlin-stdlib (JVM)   | Stable     | 1.0.0                    |              |
| kotlinx-coroutines    | Stable     | 1.3.0                    |              |
| kotlinx-serialization | Stable     | 1.0.0                    |              |
| kotlin-metadata-jvm   | Stable     | 2.0.0                    |              |
| kotlin-reflect (JVM)  | Beta       | 1.0.0                    |              |
| kotlinx-datetime      | Alpha      | 0.2.0                    |              |
| kotlinx-io            | Alpha      | 0.2.0                    |              |

### Kotlin Multiplatform

| **Component**                                    | **Status**   | **Status since version** | **Comments**                                                               |
|--------------------------------------------------|--------------|--------------------------|----------------------------------------------------------------------------|
| Kotlin Multiplatform                             | Stable       | 1.9.20                   |                                                                            |
| Kotlin Multiplatform plugin for Android Studio   | Beta         | 0.8.0                    | [Versioned separately from the language](multiplatform-plugin-releases) |

### Kotlin/Native

| **Component**                                | **Status** | **Status since version** | **Comments**                            |
|----------------------------------------------|------------|--------------------------|-----------------------------------------|
| Kotlin/Native Runtime                        | Stable     | 1.9.20                   |                                         |
| Kotlin/Native interop with C and Objective-C | Beta       | 1.3.0                    |                                         |
| klib binaries                                | Stable     | 1.9.20                   | Not including cinterop klibs, see below |
| cinterop klib binaries                       | Beta       | 1.3.0                    |                                         |
| CocoaPods integration                        | Stable     | 1.9.20                   |                                         |

> Kotlin/Nativeターゲットのサポートの詳細については、[](native-target-support)を参照してください。

### 言語ツール

| **Component**                         | **Status**   | **Status since version** | **Comments**                                   |
|---------------------------------------|--------------|--------------------------|------------------------------------------------|
| Scripting syntax and semantics        | Alpha        | 1.2.0                    |                                                |
| Scripting embedding and extension API | Beta         | 1.5.0                    |                                                |
| Scripting IDE support                 | Beta         |                          | Available since IntelliJ IDEA 2023.1 and later |
| CLI scripting                         | Alpha        | 1.2.0                    |                                                |

## 言語機能と設計提案

言語機能と新しい設計提案については、[](kotlin-language-features-and-proposals)を参照してください。