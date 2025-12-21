[//]: # (title: Dokka Gradle トラブルシューティング)

このページでは、GradleビルドでDokkaを使用してドキュメントを生成する際に遭遇する可能性のある一般的な問題について説明します。

ここに記載されていない問題がある場合は、[イシュートラッカー](https://kotl.in/dokka-issues)でフィードバックや問題をご報告いただくか、公式の[Kotlin Slack](https://kotlinlang.slack.com/)でDokkaコミュニティとチャットしてください。Slackの招待は[こちら](https://kotl.in/slack)から入手できます。

## メモリの問題

大規模なプロジェクトでは、Dokkaはドキュメントを生成するために大量のメモリを消費する可能性があります。これは、特に大量のデータを処理する場合に、Gradleのメモリ制限を超えることがあります。

Dokkaの生成がメモリ不足になると、ビルドは失敗し、Gradleは`java.lang.OutOfMemoryError: Metaspace`のような例外をスローする可能性があります。

Dokkaのパフォーマンスを改善するための取り組みが積極的に進行中ですが、一部の制限はGradleに起因します。

メモリの問題が発生した場合は、これらの回避策を試してください:

*   [ヒープスペースの増加](#increase-heap-space)
*   [Gradleプロセス内でDokkaを実行](#run-dokka-within-the-gradle-process)

### ヒープスペースの増加

メモリの問題を解決する1つの方法は、Dokkaジェネレータープロセスに対してJavaヒープメモリの量を増やすことです。`build.gradle.kts`ファイルで、以下の設定オプションを調整します。

```kotlin
    dokka {
        // Dokka generates a new process managed by Gradle
        dokkaGeneratorIsolation = ProcessIsolation {
            // Configures heap size
            maxHeapSize = "4g"
        }
    }
```

この例では、最大ヒープサイズは4 GB (`"4g"`) に設定されています。ビルドに最適な設定を見つけるために、値を調整してテストしてください。

Dokkaがかなり拡張されたヒープサイズを必要とすることが判明した場合（例えば、Gradle自身のメモリ使用量よりも大幅に高い場合）は、[DokkaのGitHubリポジトリでイシューを作成してください](https://kotl.in/dokka-issues)。

> この設定は各サブプロジェクトに適用する必要があります。すべてのサブプロジェクトに適用される規約プラグインでDokkaを設定することをお勧めします。
>
{style="note"}

### Gradleプロセス内でDokkaを実行

GradleビルドとDokka生成の両方が大量のメモリを必要とする場合、それらは別々のプロセスとして実行され、単一のマシンでかなりのメモリを消費する可能性があります。

メモリ使用量を最適化するために、Dokkaを別々のプロセスとしてではなく、同じGradleプロセス内で実行できます。これにより、各プロセスに個別にメモリを割り当てる代わりに、Gradleのメモリを一度だけ設定できます。

Dokkaを同じGradleプロセス内で実行するには、`build.gradle.kts`ファイルで以下の設定オプションを調整します。

```kotlin
    dokka {
        // Runs Dokka in the current Gradle process
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

[ヒープスペースの増加](#increase-heap-space)と同様に、この設定をテストしてプロジェクトでうまく機能することを確認してください。

GradleのJVMメモリの設定に関する詳細については、[Gradleドキュメント](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)を参照してください。

> GradleのJavaオプションを変更すると、新しいGradleデーモンが起動し、これは長時間アクティブなままになる可能性があります。[他のGradleプロセスを手動で停止する](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)ことができます。
>
> さらに、`ClassLoaderIsolation()`設定に関連するGradleのイシューが[メモリリークを引き起こす可能性があります](https://github.com/gradle/gradle/issues/18313)。
>
{style="note"}