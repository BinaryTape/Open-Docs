[//]: # (title: Kotlinデーモン)

Kotlinデーモンはバックグラウンドプロセスであり、ビルドシステムがコンパイラとその環境をコンパイル可能な状態に保つことでビルド時間を改善するために使用できます。このアプローチにより、新しいJava仮想マシン (JVM) インスタンスの起動や、コンパイルごとのコンパイラの再初期化が回避され、インクリメンタルビルドや頻繁な小規模な変更におけるビルド時間の短縮につながります。

一部のビルドシステムには、[Gradleデーモン](https://docs.gradle.org/current/userguide/gradle_daemon.html)や[Mavenデーモン](https://maven.apache.org/tools/mvnd.html)のように、起動コストの削減に役立つ独自のデーモンがあります。代わりにKotlinデーモンを使用すると、起動コストが削減されるだけでなく、ビルドシステムプロセスをコンパイラから完全に分離できます。この分離は、システム設定が実行時に変更される可能性がある動的な環境で役立ちます。

Kotlinデーモンに直接ユーザーが操作するインターフェースはありませんが、ビルドシステムまたは[ビルドツールAPI](build-tools-api.md)を介して使用できます。

## Kotlinデーモンの構成

GradleまたはMavenでKotlinデーモンのいくつかの設定を構成する方法があります。

### メモリ管理

Kotlinデーモンは、クライアントから分離された独自のメモリ空間を持つ独立したプロセスです。デフォルトでは、Kotlinデーモンは起動元のJVMプロセスのヒープサイズ (`-Xmx`) を継承しようとします。

`-Xmx`や`-XX:MaxMetaspaceSize`のような特定のメモリ制限を構成するには、以下のプロパティを使用します。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin.daemon.jvmargs=-Xmx1500m
```

詳細については、[`kotlin.daemon.jvmargs`プロパティ](gradle-compilation-and-caches.md#kotlin-daemon-jvmargs-property)を参照してください。

</tab>
<tab title="Maven" group-key="maven">

```xml
<kotlin.compiler.daemon.jvmArgs>-Xmx1500m</kotlin.compiler.daemon.jvmArgs>
```

</tab>
</tabs>

### ライフタイム

Kotlinデーモンには、一般的なライフタイム戦略が2つあります。

*   **アタッチされたデーモン**: クライアントプロセスがシャットダウンした後、またはデーモンがしばらく使用されていない場合に、デーモンを短時間でシャットダウンします。クライアントが長時間実行される場合に使用します。
*   **デタッチされたデーモン**: 後続のリクエストを待つために、デーモンをより長く存続させます。クライアントが短時間で終了する場合に使用します。

ライフタイム戦略を構成するには、以下のオプションを使用できます。

| オプション                      | 説明                                                                                        | デフォルト値 |
|-----------------------------|----------------------------------------------------------------------------------------------------|---------------|
| `autoshutdownIdleSeconds`   | クライアントが接続されている状態で、最後のコンパイル後、デーモンがどれだけ長く存続すべきか。 | 2時間       |
| `autoshutdownUnusedSeconds` | 新しく起動されたデーモンが、未使用の場合にシャットダウンする前に最初のクライアントを待つ期間。           | 1分      |
| `shutdownDelayMilliseconds` | すべてのクライアントが切断された後、デーモンがシャットダウンするまで待機する期間。                               | 1秒       |

アタッチされたデーモンのライフタイム戦略を構成するには、`autoshutdownIdleSeconds`を**高い**値に、`shutdownDelayMilliseconds`を**低い**値に設定します。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

`gradle.properties`ファイルに以下を追加します。

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
<tab title="Maven" group-key="maven">

以下のコマンドを使用します。

```bash
 mvn package -Dkotlin.daemon.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
</tabs>

デタッチされたデーモンのライフタイム戦略を構成するには、`shutdownDelayMilliseconds`を**高い**値に設定します。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

`gradle.properties`ファイルに以下を追加します。

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=shutdownDelayMilliseconds=7200
```

</tab>
<tab title="Maven" group-key="maven">

`pom.xml`ファイルに以下のプロパティを追加します。

```xml
<kotlin.compiler.daemon.shutdownDelayMs>7200</kotlin.compiler.daemon.shutdownDelayMs>
```

</tab>
</tabs>