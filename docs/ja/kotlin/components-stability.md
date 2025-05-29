[//]: # (title: Kotlinコンポーネントの安定性)

Kotlin言語とツールセットは、JVM、JS、Nativeターゲット向けのコンパイラ、標準ライブラリ、様々な付属ツールなど、多くのコンポーネントに分けられています。
これらのコンポーネントの多くは、公式に**Stable**としてリリースされています。これは、[_Comfortable Updates_と_Keeping the Language Modern_の原則](kotlin-evolution-principles.md)に従って、後方互換性のある方法で進化してきたことを意味します。

_フィードバックループ_の原則に従い、コミュニティが試せるように、多くのものを早期にリリースしています。そのため、多くのコンポーネントはまだ**Stable**としてリリースされていません。
そのうちいくつかは非常に初期段階にあり、いくつかはより成熟しています。
私たちは、各コンポーネントがどれだけ速く進化するか、そしてユーザーが導入時に負うリスクのレベルに応じて、これらを**Experimental**、**Alpha**、または**Beta**とマークしています。

## 安定性レベルの説明

これらの安定性レベルとその意味について簡単に説明します。

**Experimental** は「おもちゃのプロジェクトでのみ試してください」という意味です。
  * アイデアを試している段階であり、何人かのユーザーに試してもらってフィードバックを求めています。うまくいかなければ、いつでも中止する可能性があります。

**Alpha** は「自己責任で使用し、移行の問題を覚悟してください」という意味です。
  * このアイデアを製品化する意向ですが、まだ最終的な形には達していません。

**Beta** は「使用できますが、移行の問題を最小限に抑えるよう最善を尽くします」という意味です。
  * ほぼ完成しており、ユーザーからのフィードバックが特に重要です。
  * まだ100%完成しているわけではないため、変更の可能性があります（自身のフィードバックに基づくものも含む）。
  * 最良のアップデートエクスペリエンスのために、非推奨の警告に事前に注意してください。

_Experimental_、_Alpha_、_Beta_ を総称して**pre-stable**レベルと呼びます。

<a name="stable"/>

**Stable** は「最も保守的なシナリオでも使用できます」という意味です。
  * 完成しています。厳格な[後方互換性ルール](https://kotlinfoundation.org/language-committee-guidelines/)に従って進化させていきます。

安定性レベルは、コンポーネントがいつStableとしてリリースされるかについては何も述べていないことに注意してください。同様に、リリース前にコンポーネントがどれだけ変更されるかを示すものでもありません。これらは、コンポーネントがどれだけ速く変化しているか、そしてユーザーがどれだけ更新の問題を抱えるリスクがあるかのみを示しています。

## KotlinコンポーネントのGitHubバッジ

[KotlinのGitHub組織](https://github.com/Kotlin)は、様々なKotlin関連プロジェクトをホストしています。
そのうちいくつかは専任で開発しており、その他はサイドプロジェクトです。

各Kotlinプロジェクトには、その安定性とサポートステータスを示す2つのGitHubバッジがあります。

* **Stability** ステータス。これは、各プロジェクトがどれだけ速く進化しているか、そしてユーザーが採用時にどれだけのリスクを負っているかを示します。
  この安定性ステータスは、[Kotlin言語機能とそのコンポーネントの安定性レベル](#stability-levels-explained)と完全に一致します。
    * ![Experimental stability level](https://kotl.in/badges/experimental.svg){type="joined"} は **Experimental** を表します
    * ![Alpha stability level](https://kotl.in/badges/alpha.svg){type="joined"} は **Alpha** を表します
    * ![Beta stability level](https://kotl.in/badges/beta.svg){type="joined"} は **Beta** を表します
    * ![Stable stability level](https://kotl.in/badges/stable.svg){type="joined"} は **Stable** を表します

* **Support** ステータス。これは、プロジェクトを維持し、ユーザーが問題を解決するのを支援するという私たちのコミットメントを示します。
  サポートレベルは、すべてのJetBrains製品で統一されています。
  詳細については、[JetBrainsのオープンソースドキュメント](https://github.com/JetBrains#jetbrains-on-github)を参照してください。

## サブコンポーネントの安定性

安定したコンポーネントにも実験的なサブコンポーネントが含まれる場合があります。例えば、
* 安定したコンパイラに実験的な機能が含まれることがあります。
* 安定したAPIに実験的なクラスや関数が含まれることがあります。
* 安定したコマンドラインツールに実験的なオプションが含まれることがあります。

私たちは、どのサブコンポーネントが**Stable**ではないかを正確に文書化するようにしています。
また、可能な限りユーザーに警告し、安定版としてリリースされていない機能を意図せずに使用することを避けるため、明示的にオプトインするように求めています。

## Kotlinコンポーネントの現在の安定性

> デフォルトでは、すべての新しいコンポーネントはExperimentalステータスです。
> 
{style="note"}

### Kotlinコンパイラ

| **コンポーネント**                                                      | **ステータス** | **ステータスが適用されたバージョン** | **コメント** |
|---------------------------------------------------------------------|------------|--------------------------|--------------|
| Kotlin/JVM                                                          | Stable     | 1.0.0                    |              |
| Kotlin/Native                                                       | Stable     | 1.9.0                    |              |
| Kotlin/JS                                                           | Stable     | 1.3.0                    |              |
| Kotlin/Wasm                                                         | Alpha      | 1.9.20                   |              |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable     |                          |              |

### コアコンパイラプラグイン

| **コンポーネント**                                   | **ステータス** | **ステータスが適用されたバージョン** | **コメント** |
|--------------------------------------------------|--------------|--------------------------|--------------|
| [All-open](all-open-plugin.md)                   | Stable       | 1.3.0                    |              |
| [No-arg](no-arg-plugin.md)                       | Stable       | 1.3.0                    |              |
| [SAM-with-receiver](sam-with-receiver-plugin.md) | Stable       | 1.3.0                    |              |
| [kapt](kapt.md)                                  | Stable       | 1.3.0                    |              |
| [Lombok](lombok.md)                              | Experimental | 1.5.20                   |              |
| [Power-assert](power-assert.md)                  | Experimental | 2.0.0                    |              |

### Kotlinライブラリ

| **コンポーネント**         | **ステータス** | **ステータスが適用されたバージョン** | **コメント** |
|-----------------------|------------|--------------------------|--------------|
| kotlin-stdlib (JVM)   | Stable     | 1.0.0                    |              |
| kotlinx-coroutines    | Stable     | 1.3.0                    |              |
| kotlinx-serialization | Stable     | 1.0.0                    |              |
| kotlin-metadata-jvm   | Stable     | 2.0.0                    |              |
| kotlin-reflect (JVM)  | Beta       | 1.0.0                    |              |
| kotlinx-datetime      | Alpha      | 0.2.0                    |              |
| kotlinx-io            | Alpha      | 0.2.0                    |              |

### Kotlin Multiplatform

| **コンポーネント**                                 | **ステータス** | **ステータスが適用されたバージョン** | **コメント**                                                                                                                               |
|------------------------------------------------|------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Kotlin Multiplatform                           | Stable     | 1.9.20                   |                                                                                                                                      |
| Kotlin Multiplatform plugin for Android Studio | Beta       | 0.8.0                    | [言語とは別にバージョン管理されています](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-plugin-releases.html) |

### Kotlin/Native

| **コンポーネント**                               | **ステータス** | **ステータスが適用されたバージョン** | **コメント**                            |
|----------------------------------------------|------------|--------------------------|-----------------------------------------|
| Kotlin/Native Runtime                        | Stable     | 1.9.20                   |                                         |
| Kotlin/NativeのCおよびObjective-Cとの相互運用 | Beta       | 1.3.0                    |                                         |
| klibバイナリ                                 | Stable     | 1.9.20                   | cinterop klibは含まれません。以下を参照してください |
| cinterop klibバイナリ                        | Beta       | 1.3.0                    |                                         |
| CocoaPodsとの統合                            | Stable     | 1.9.20                   |                                         |

> Kotlin/Nativeターゲットのサポートに関する詳細は、[](native-target-support.md)を参照してください。

### 言語ツール

| **コンポーネント**                          | **ステータス** | **ステータスが適用されたバージョン** | **コメント**                                   |
|----------------------------------------|--------------|--------------------------|------------------------------------------------|
| スクリプトの構文とセマンティクス           | Alpha        | 1.2.0                    |                                                |
| スクリプトの埋め込みと拡張API              | Beta         | 1.5.0                    |                                                |
| スクリプトのIDEサポート                    | Beta         |                          | IntelliJ IDEA 2023.1以降で利用可能           |
| CLIスクリプト                              | Alpha        | 1.2.0                    |                                                |

## 言語機能と設計提案

言語機能と新しい設計提案については、[](kotlin-language-features-and-proposals.md)を参照してください。