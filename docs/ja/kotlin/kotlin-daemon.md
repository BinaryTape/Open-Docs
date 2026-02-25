[//]: # (title: Kotlinデーモン)

Kotlinデーモンは、コンパイラとその環境をコンパイル可能な状態に維持することで、ビルドシステムがビルド時間を短縮するために使用できるバックグラウンドプロセスです。このアプローチにより、コンパイルのたびに新しいJava仮想マシン（JVM）インスタンスを起動してコンパイラを再初期化することを回避でき、インクリメンタルビルド（incremental builds）や頻繁な小さな変更におけるビルド時間が短縮されます。

[Gradleデーモン](https://docs.gradle.org/current/userguide/gradle_daemon.html)や[Mavenデーモン](https://maven.apache.org/tools/mvnd.html)のように、起動コストを削減するのに役立つ独自のデーモンを持つビルドシステムもあります。代わりにKotlinデーモンを使用すると、起動コストを削減しながら、ビルドシステムのプロセスをコンパイラから完全に分離できます。この分離は、実行時にシステム設定が変更される可能性がある動的な環境において有用です。

Kotlinデーモンにはユーザーが直接操作するインターフェースはありませんが、ビルドシステムや[build tools API](build-tools-api.md)を介して使用できます。

## Kotlinデーモンの設定

GradleやMavenにおいて、Kotlinデーモンのいくつかの設定を構成する方法があります。

### メモリ管理

Kotlinデーモンは、クライアントから分離された独自のメモリ空間を持つ独立したプロセスです。デフォルトでは、Kotlinデーモンは起動元のJVMプロセスのヒープサイズ（`-Xmx`）を継承しようとします。

`-Xmx`や`-XX:MaxMetaspaceSize`などの特定のメモリ制限を構成するには、以下のプロパティを使用します。

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

Kotlinデーモンには、主に2つのライフタイム戦略があります。

* **アタッチされたデーモン（Attached daemon）**: クライアントプロセスが終了した後すぐ、またはデーモンがしばらく使用されていない場合にデーモンを終了します。クライアントが長時間実行される場合に使用します。 
* **デタッチされたデーモン（Detached daemon）**: 今後のリクエストを待機するために、デーモンをより長く存続させます。クライアントが短命な場合に使用します。 

ライフタイム戦略を構成するには、以下のオプションを使用できます。

| オプション                      | 説明                                                                                        | デフォルト値 |
|-----------------------------|-------------------------------------------------------------------------------------------|---------------|
| `autoshutdownIdleSeconds`   | クライアントが接続されている状態で、最後のコンパイル後にデーモンが存続する時間。                             | 2時間       |
| `autoshutdownUnusedSeconds` | 新しく起動したデーモンが、未使用の場合に最初のクライアントを待ってから終了するまでの時間。                 | 1分      |
| `shutdownDelayMilliseconds` | すべてのクライアントが切断された後、デーモンが終了するまで待機する時間。                                   | 1秒      |

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