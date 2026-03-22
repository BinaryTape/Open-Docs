[//]: # (title: コンパイラの実行戦略)

「Kotlinコンパイラの実行戦略（Kotlin compiler execution strategy）」は、Kotlinコンパイラがどこで実行されるかを定義します。
[Gradle](gradle.md) や [Maven](maven.md) などのビルドツールがこの戦略を設定します。

コンパイラの実行戦略には以下の2つがあります：

| 戦略 | Kotlinコンパイラの実行場所 | その他の特徴と注意点 |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Kotlinデーモン](kotlin-daemon.md) | 独自のデーモンプロセス内 | GradleおよびMavenにおける**デフォルトで最速の戦略**です。デーモンプロセスは、異なるビルドシステムプロセス間や複数の並列コンパイル間で共有できます。 |
| インプロセス（In process） | ビルドツールのプロセス内 | メモリ管理の観点からは最もシンプルな戦略ですが、JVMシステムプロパティなどの状態を共有するため、同じプロセス内で実行されている他のロジックからの分離性は低くなります。 |

## Gradleでの設定

Kotlinコンパイラの実行戦略は、以下のいずれかのプロパティを使用して定義できます：

* `kotlin.compiler.execution.strategy` Gradleプロパティ。
* `compilerExecutionStrategy` コンパイルタスクプロパティ。

### Gradleプロパティを使用する

`kotlin.compiler.execution.strategy` プロパティに指定可能な値は以下の通りです：

* `daemon`（デフォルト）
* `in-process`

`gradle.properties` で `kotlin.compiler.execution.strategy` プロパティを設定します：

```none
kotlin.compiler.execution.strategy=in-process
```

### コンパイルタスクプロパティを使用する

`compilerExecutionStrategy` タスクプロパティは、`kotlin.compiler.execution.strategy` Gradleプロパティよりも優先されます。

`compilerExecutionStrategy` タスクプロパティに指定可能な値は以下の通りです：

* [`DAEMON`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-d-a-e-m-o-n/)（デフォルト）
* [`IN_PROCESS`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-i-n_-p-r-o-c-e-s-s/)

ビルドスクリプトで `compilerExecutionStrategy` タスクプロパティを設定します：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
} 
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
        .configureEach {
            compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
        }
```

</tab>
</tabs>

### フォールバック戦略

Kotlinデーモンとの通信に失敗した場合、コンパイラは「インプロセス（In process）」戦略にフォールバックします。

このフォールバックが発生すると、Gradleはビルド出力に以下の警告を表示します：

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

サイレントなフォールバックは、多くのシステムリソースを消費したり、非決定的なビルドにつながったりする可能性があります。
詳細については、こちらの [YouTrackの課題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy) を参照してください。

フォールバックを防止するには、`kotlin.daemon.useFallbackStrategy` Gradleプロパティを使用します。デフォルト値は `true` です。
`false` に設定すると、デーモンの起動や通信に問題がある場合にビルドが失敗します。
`gradle.properties` でこのプロパティを宣言します：

```none
kotlin.daemon.useFallbackStrategy=false
```

また、Kotlinコンパイルタスクには `useDaemonFallbackStrategy` プロパティもあります。両方のプロパティを使用した場合、`useDaemonFallbackStrategy` プロパティが優先されます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```

</tab>
</tabs>

コンパイルを実行するためのメモリが不足している場合、ログに関連するメッセージが表示されます。

## Mavenでの設定

<include from ="maven-compile-package.md" element-id="maven-configure-execution-strategy"/>