[//]: # (title: 編譯器執行策略)

_Kotlin 編譯器執行策略_定義了 Kotlin 編譯器執行的位置。
[Gradle](gradle.md) 或 [Maven](maven.md) 等建置工具可配置此策略。

共有兩種編譯器執行策略：

| 策略 | Kotlin 編譯器執行的位置 | 其他特性與說明 |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Kotlin daemon](kotlin-daemon.md) | 在其自身的 daemon 處理序內 | 這是 Gradle 與 Maven 中*預設且最快的策略*。此 daemon 處理序可以在不同的建置系統處理序以及多個平行編譯之間共享。 |
| In process | 在建置工具的處理序內 | 從記憶體管理的角度來看，這是最簡單的策略，但它與在同一處理序中執行的其他邏輯的隔離性較低，因為它會共享狀態，例如 JVM 系統屬性。 |

## 在 Gradle 中配置

您可以使用以下其中一個屬性來定義 Kotlin 編譯器執行策略：

* `kotlin.compiler.execution.strategy` Gradle 屬性。
* `compilerExecutionStrategy` 編譯任務屬性。

### 使用 Gradle 屬性

`kotlin.compiler.execution.strategy` 屬性的可能值為：

* `daemon`（預設）
* `in-process`

在 `gradle.properties` 中設定 `kotlin.compiler.execution.strategy` 屬性：

```none
kotlin.compiler.execution.strategy=in-process
```

### 使用編譯任務屬性

`compilerExecutionStrategy` 任務屬性的優先級高於 `kotlin.compiler.execution.strategy` Gradle 屬性。

`compilerExecutionStrategy` 任務屬性的可能值為：

* [`DAEMON`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-d-a-e-m-o-n/)（預設）
* [`IN_PROCESS`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-i-n_-p-r-o-c-e-s-s/)

在您的建置指令碼中設定 `compilerExecutionStrategy` 任務屬性：

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

### 備援策略

如果與 Kotlin daemon 的通訊失敗，編譯器將備援至「In process」策略。

發生此備援時，Gradle 會在建置輸出中列印以下警告：

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

靜默備援可能會消耗大量系統資源，或導致非確定性的組建。
若要了解更多資訊，請參閱
此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。

若要防止備援，請使用 `kotlin.daemon.useFallbackStrategy` Gradle 屬性。預設值為 `true`。
當設定為 `false` 時，如果 daemon 的啟動或通訊出現問題，組建將會失敗。
在 `gradle.properties` 中宣告此屬性：

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlin 編譯任務中也有一個 `useDaemonFallbackStrategy` 屬性。如果您同時使用這兩個
屬性，則以 `useDaemonFallbackStrategy` 屬性
優先。

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

如果沒有足夠的記憶體來執行編譯，記錄中會顯示相關訊息。

## 在 Maven 中配置

<include from ="maven-compile-package.md" element-id="maven-configure-execution-strategy"/>