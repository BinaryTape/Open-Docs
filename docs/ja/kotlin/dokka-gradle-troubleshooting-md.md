[//]: # (title: Dokka Gradle のトラブルシューティング)

このページでは、Gradle ビルドで Dokka を使用してドキュメントを生成する際に発生する可能性のある一般的な問題について説明します。

もし問題がここに記載されていない場合は、[issue トラッカー](https://kotl.in/dokka-issues)でフィードバックや問題を報告するか、公式の [Kotlin Slack](https://kotlinlang.slack.com/) にある Dokka コミュニティでチャットしてください。Slack への招待は[こちら](https://kotl.in/slack)から取得できます。

## メモリの問題

大規模なプロジェクトでは、Dokka はドキュメント生成のためにかなりのメモリを消費することがあります。これは、特に大量のデータを処理する場合に Gradle のメモリ制限を超える可能性があります。

Dokka の生成がメモリ不足になると、ビルドが失敗し、Gradle は `java.lang.OutOfMemoryError: Metaspace` のような例外をスローすることがあります。

Dokka のパフォーマンス向上のための取り組みが進行中ですが、一部の制限は Gradle に起因しています。

メモリの問題が発生した場合は、以下の回避策を試してください。

* [ヒープ領域の増加](#increase-heap-space)
* [Gradle プロセス内での Dokka の実行](#run-dokka-within-the-gradle-process)

### ヒープ領域の増加

メモリの問題を解決する一つの方法は、Dokka ジェネレータープロセスの Java ヒープメモリの量を増やすことです。`build.gradle.kts` ファイルで、以下の設定オプションを調整します。

```kotlin
    dokka {
        // Dokka は Gradle によって管理される新しいプロセスを生成します
        dokkaGeneratorIsolation = ProcessIsolation {
            // ヒープサイズを設定します
            maxHeapSize = "4g"
        }
    }
```

この例では、最大ヒープサイズは 4 GB (`"4g"`) に設定されています。ビルドに最適な設定を見つけるために、値を調整してテストしてください。

もし Dokka が Gradle 自身のメモリ使用量よりも大幅に多いヒープサイズを必要とする場合（例えば、Gradle 自体よりも大幅に高い場合）は、[Dokka の GitHub リポジトリで Issue を作成](https://kotl.in/dokka-issues)してください。

> この設定は各サブプロジェクトに適用する必要があります。すべてのサブプロジェクトに適用されるコンベンションプラグイン（convention plugin）で Dokka を設定することをお勧めします。
>
{style="note"}

### Gradle プロセス内での Dokka の実行

Gradle のビルドと Dokka の生成の両方が大量のメモリを必要とする場合、それらが別々のプロセスとして実行され、1 台のマシンで大きなメモリを消費することがあります。

メモリの使用量を最適化するために、別々のプロセスではなく、同じ Gradle プロセス内で Dokka を実行できます。これにより、各プロセスごとに個別にメモリを割り当てるのではなく、Gradle のメモリを一度設定するだけで済みます。

同じ Gradle プロセス内で Dokka を実行するには、`build.gradle.kts` ファイルで以下の設定オプションを調整します。

```kotlin
    dokka {
        // 現在の Gradle プロセスで Dokka を実行します
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

[ヒープ領域の増加](#increase-heap-space)と同様に、この設定がプロジェクトでうまく機能することを確認するためにテストしてください。

Gradle の JVM メモリの設定に関する詳細は、[Gradle のドキュメント](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)を参照してください。

> Gradle の Java オプションを変更すると新しい Gradle デーモンが起動し、それが長時間残り続ける可能性があります。[他の Gradle プロセスを手動で停止](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)することもできます。
>
> また、`ClassLoaderIsolation()` 設定に関する Gradle の問題により、[メモリリークが発生する](https://github.com/gradle/gradle/issues/18313)可能性があります。
>
{style="note"}