[//]: # (title: Kotlinコンポーネントの安定性)

Kotlin言語とツールセットは、JVM、JS、Nativeターゲット用のコンパイラ、標準ライブラリ、その他さまざまな付属ツールなど、多くのコンポーネントに分かれています。これらのコンポーネントの多くは、公式に**Stable**としてリリースされており、これは[快適なアップデートとモダンな言語を維持する](kotlin-evolution-principles.md)という原則に従い、後方互換性のある方法で進化してきたことを意味します。

_フィードバックループ_の原則に従い、コミュニティが試せるように多くのものを早期にリリースしているため、まだ**Stable**としてリリースされていないコンポーネントが多数あります。その中には非常に初期段階のものもあれば、より成熟しているものもあります。各コンポーネントがどれだけ速く進化するか、およびユーザーが採用する際に負うリスクのレベルに応じて、それらを**Experimental**、**Alpha**、または**Beta**としてマークしています。

## 安定性レベルの説明

これらの安定性レベルとその意味に関する簡単なガイドです。

**Experimental**は「おもちゃのプロジェクトでのみ試してください」を意味します。
* 私たちは単にアイデアを試しており、一部のユーザーに試用してもらってフィードバックを得たいと考えています。うまくいかない場合は、いつでも破棄する可能性があります。

**Alpha**は「自己責任で使用し、移行の問題を覚悟してください」を意味します。
* このアイデアを製品化するつもりですが、まだ最終的な形には達していません。

**Beta**は「使用できます。移行の問題を最小限に抑えるために最善を尽くします」を意味します。
* ほぼ完了しており、現在、ユーザーからのフィードバックが特に重要です。
* しかし、100%完了したわけではないため、変更の可能性があります（あなたのフィードバックに基づくものも含む）。
* 最高のアップデート体験のために、事前に非推奨警告に注意してください。

_Experimental_、_Alpha_、_Beta_を総称して**プレ安定版**レベルと呼びます。

<a name="stable"/>

**Stable**は「最も保守的なシナリオでも使用できます」を意味します。
* 完了しています。厳格な[後方互換性ルール](https://kotlinfoundation.org/language-committee-guidelines/)に従って進化させていきます。

安定性レベルは、コンポーネントがどれくらい早くStableとしてリリースされるかを示すものではありません。同様に、リリース前にコンポーネントがどれだけ変更されるかを示すものでもありません。それらは、コンポーネントがどれだけ速く変化しているか、およびユーザーが抱えるアップデート問題のリスクの大きさのみを示します。

## KotlinコンポーネントのGitHubバッジ

[Kotlin GitHub organization](https://github.com/Kotlin)は、さまざまなKotlin関連プロジェクトをホストしています。その中にはフルタイムで開発しているものもあれば、サイドプロジェクトであるものもあります。

各Kotlinプロジェクトには、その安定性およびサポートステータスを説明する2つのGitHubバッジがあります。

*   **安定性**ステータス。これは、各プロジェクトがどれだけ速く進化しているか、およびユーザーが採用する際にどれだけのリスクを負っているかを示します。
    安定性ステータスは、Kotlin言語の機能とそのコンポーネントの[安定性レベル](#stability-levels-explained)と完全に一致します。
    *   ![Experimental stability level](https://kotl.in/badges/experimental.svg){type="joined"} は**Experimental**を表します
    *   ![Alpha stability level](https://kotl.in/badges/alpha.svg){type="joined"} は**Alpha**を表します
    *   ![Beta stability level](https://kotl.in/badges/beta.svg){type="joined"} は**Beta**を表します
    *   ![Stable stability level](https://kotl.in/badges/stable.svg){type="joined"} は**Stable**を表します

*   **サポート**ステータス。これは、プロジェクトを維持し、ユーザーが問題を解決するのを支援するという私たちのコミットメントを示します。
    サポートレベルはすべてのJetBrains製品で統一されています。[詳細についてはJetBrainsオープンソースドキュメントを参照してください](https://github.com/JetBrains#jetbrains-on-github)。

## サブコンポーネントの安定性

安定したコンポーネントが、実験的なサブコンポーネントを持つ場合があります。例えば：
* 安定したコンパイラが実験的な機能を持つ場合があります。
* 安定したAPIが実験的なクラスまたは関数を含む場合があります。
* 安定したコマンドラインツールが実験的なオプションを持つ場合があります。

どのサブコンポーネントが**Stable**ではないかを正確に文書化するようにしています。また、可能な限りユーザーに警告し、安定版としてリリースされていない機能の意図しない使用を避けるために、明示的なオプトインを求めるように最善を尽くしています。

## Kotlinコンポーネントの現在の安定性

> デフォルトでは、すべての新しいコンポーネントはExperimentalステータスを持ちます。
>
{style="note"}

### Kotlinコンパイラ

| **コンポーネント**                                                  | **ステータス** | **バージョンからのステータス** | **コメント** |
|---------------------------------------------------------------------|------------|--------------------------|--------------|
| Kotlin/JVM                                                          | Stable     | 1.0.0                    |              |
| Kotlin/Native                                                       | Stable     | 1.9.0                    |              |
| Kotlin/JS                                                           | Stable     | 1.3.0                    |              |
| Kotlin/Wasm                                                         | Beta       | 2.2.20                   |              |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable     |                          |              |

### Core compiler plugins

| **コンポーネント**                                    | **ステータス**   | **バージョンからのステータス** | **コメント** |
|--------------------------------------------------|--------------|--------------------------|--------------|
| [All-open](all-open-plugin.md)                   | Stable       | 1.3.0                    |              |
| [No-arg](no-arg-plugin.md)                       | Stable       | 1.3.0                    |              |
| [SAM-with-receiver](sam-with-receiver-plugin.md) | Stable       | 1.3.0                    |              |
| [kapt](kapt.md)                                  | Stable       | 1.3.0                    |              |
| [Lombok](lombok.md)                              | Experimental | 1.5.20                   |              |
| [Power-assert](power-assert.md)                  | Experimental | 2.0.0                    |              |

### Kotlin libraries

| **コンポーネント**         | **ステータス** | **バージョンからのステータス** | **コメント** |
|-----------------------|------------|--------------------------|--------------|
| kotlin-stdlib (JVM)   | Stable     | 1.0.0                    |              |
| kotlinx-coroutines    | Stable     | 1.3.0                    |              |
| kotlinx-serialization | Stable     | 1.0.0                    |              |
| kotlin-metadata-jvm   | Stable     | 2.0.0                    |              |
| kotlin-reflect (JVM)  | Beta       | 1.0.0                    |              |
| kotlinx-datetime      | Alpha      | 0.2.0                    |              |
| kotlinx-io            | Alpha      | 0.2.0                    |              |

### Kotlin Multiplatform

| **コンポーネント**                                  | **ステータス** | **バージョンからのステータス** | **コメント**                                                              |
|------------------------------------------------|------------|--------------------------|---------------------------------------------------------------------------|
| Kotlin Multiplatform                           | Stable     | 1.9.20                   |                                                                           |
| Kotlin Multiplatform plugin for Android Studio | Beta       | 0.8.0                    | [言語とは別にバージョン管理されています](https://kotlinlang.org/docs/multiplatform/multiplatform-plugin-releases.html) |

### Kotlin/Native

| **コンポーネント**                               | **ステータス** | **バージョンからのステータス** | **コメント**                                                 |
|----------------------------------------------|------------|--------------------------|--------------------------------------------------------------|
| Kotlin/Native Runtime                        | Stable     | 1.9.20                   |                                                              |
| Kotlin/Native interop with C and Objective-C | Beta       | 1.3.0                    | [CおよびObjective-Cライブラリインポートの安定性](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) |
| klib binaries                                | Stable     | 1.9.20                   | cinterop klibsは含まれません。以下を参照してください             |
| cinterop klib binaries                       | Beta       | 1.3.0                    | [CおよびObjective-Cライブラリインポートの安定性](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) |
| CocoaPods integration                        | Stable     | 1.9.20                   |                                                              |

異なるターゲットのサポートレベルに関する詳細については、[](native-target-support.md)を参照してください。

### Language tools

| **コンポーネント**                         | **ステータス**   | **バージョンからのステータス** | **コメント**                       |
|---------------------------------------|--------------|--------------------------|------------------------------------|
| Scripting syntax and semantics        | Alpha        | 1.2.0                    |                                    |
| Scripting embedding and extension API | Beta         | 1.5.0                    |                                    |
| Scripting IDE support                 | Beta         |                          | IntelliJ IDEA 2023.1以降で利用可能 |
| CLI scripting                         | Alpha        | 1.2.0                    |                                    |

## 言語機能および設計提案

言語機能および新しい設計提案については、[](kotlin-language-features-and-proposals.md)を参照してください。