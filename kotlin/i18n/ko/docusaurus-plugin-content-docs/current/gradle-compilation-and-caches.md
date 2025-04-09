---
title: "Kotlin Gradle 플러그인의 컴파일 및 캐시"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

이 페이지에서는 다음 주제에 대해 알아볼 수 있습니다.
* [점진적 컴파일](#incremental-compilation)
* [Gradle 빌드 캐시 지원](#gradle-build-cache-support)
* [Gradle 구성 캐시 지원](#gradle-configuration-cache-support)
* [Kotlin 데몬 및 Gradle과 함께 사용하는 방법](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [이전 컴파일러로 롤백](#rolling-back-to-the-previous-compiler)
* [Kotlin 컴파일러 실행 전략 정의](#defining-kotlin-compiler-execution-strategy)
* [Kotlin 컴파일러 폴백 전략](#kotlin-compiler-fallback-strategy)
* [최신 언어 버전 사용해 보기](#trying-the-latest-language-version)
* [빌드 보고서](#build-reports)

## 점진적 컴파일

Kotlin Gradle 플러그인은 Kotlin/JVM 및 Kotlin/JS 프로젝트에 대해 기본적으로 활성화되어 있는 점진적 컴파일을 지원합니다.
점진적 컴파일은 빌드 간의 클래스 경로에 있는 파일 변경 사항을 추적하여 이러한 변경 사항의 영향을 받는 파일만
컴파일되도록 합니다.
이 방법은 [Gradle의 빌드 캐시](#gradle-build-cache-support)와 함께 작동하며 [컴파일 회피](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)를 지원합니다.

Kotlin/JVM의 경우 점진적 컴파일은 재컴파일이 필요한 시기를 결정하기 위해 모듈의 API 구조를 캡처하는 클래스 경로 스냅샷을 사용합니다.
전체 파이프라인을 최적화하기 위해 Kotlin 컴파일러는 두 가지 유형의 클래스 경로 스냅샷을 사용합니다.

* **세분화된 스냅샷:** 속성 또는 함수와 같은 클래스 멤버에 대한 자세한 정보를 포함합니다.
멤버 수준 변경 사항이 감지되면 Kotlin 컴파일러는 수정된 멤버에 종속된 클래스만 다시 컴파일합니다.
성능 유지를 위해 Kotlin Gradle 플러그인은 Gradle 캐시에서 `.jar` 파일에 대한 대략적인 스냅샷을 생성합니다.
* **대략적인 스냅샷:** 클래스 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 해시만 포함합니다.
ABI의 일부가 변경되면 Kotlin 컴파일러는 변경된 클래스에 종속된 모든 클래스를 다시 컴파일합니다.
이는 외부 라이브러리와 같이 변경 빈도가 낮은 클래스에 유용합니다.

:::note
Kotlin/JS 프로젝트는 히스토리 파일을 기반으로 하는 다른 점진적 컴파일 방법을 사용합니다.

:::

점진적 컴파일을 비활성화하는 방법에는 여러 가지가 있습니다.

* Kotlin/JVM의 경우 `kotlin.incremental=false`를 설정합니다.
* Kotlin/JS 프로젝트의 경우 `kotlin.incremental.js=false`를 설정합니다.
* `-Pkotlin.incremental=false` 또는 `-Pkotlin.incremental.js=false`를 명령줄 매개변수로 사용합니다.

  매개변수는 각 후속 빌드에 추가해야 합니다.

점진적 컴파일을 비활성화하면 점진적 캐시는 빌드 후에 유효하지 않게 됩니다. 첫 번째 빌드는 점진적 빌드가 아닙니다.

:::note
점진적 컴파일 문제는 실패가 발생한 후 몇 번의 라운드 후에 나타나는 경우가 있습니다. [빌드 보고서](#build-reports)를 사용하여
변경 사항 및 컴파일 기록을 추적합니다. 이는 재현 가능한 버그 보고서를 제공하는 데 도움이 될 수 있습니다.

현재 점진적 컴파일 방법이 작동하고 이전 방법과 비교하는 방법에 대한 자세한 내용은
[블로그 게시물](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)을 참조하십시오.

## Gradle 빌드 캐시 지원

Kotlin 플러그인은 향후 빌드에서 재사용하기 위해 빌드 출력을 저장하는 [Gradle 빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)를 사용합니다.

모든 Kotlin 작업에 대한 캐싱을 비활성화하려면 시스템 속성 `kotlin.caching.enabled`를 `false`로 설정합니다
(`-Dkotlin.caching.enabled=false` 인수를 사용하여 빌드를 실행합니다).

## Gradle 구성 캐시 지원

Kotlin 플러그인은 후속 빌드에 대한 구성 단계의 결과를 재사용하여 빌드 프로세스 속도를 높이는 [Gradle 구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)를 사용합니다.

구성 캐시를 활성화하는 방법은 [Gradle 설명서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)를 참조하십시오. 이 기능을 활성화하면 Kotlin Gradle 플러그인이 자동으로
사용을 시작합니다.

## Kotlin 데몬 및 Gradle과 함께 사용하는 방법

Kotlin 데몬:
* Gradle 데몬과 함께 실행되어 프로젝트를 컴파일합니다.
* IntelliJ IDEA 내장 빌드 시스템으로 프로젝트를 컴파일할 때 Gradle 데몬과 별도로 실행됩니다.

Kotlin 데몬은 Kotlin 컴파일 작업 중 하나가 소스 컴파일을 시작할 때 Gradle [실행 단계](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases)에서 시작됩니다.
Kotlin 데몬은 Gradle 데몬과 함께 또는 Kotlin 컴파일 없이 2시간 유휴 시간 후에 중지됩니다.

Kotlin 데몬은 Gradle 데몬과 동일한 JDK를 사용합니다.

### Kotlin 데몬의 JVM 인수 설정

인수를 설정하는 다음 각 방법은 그 앞에 오는 방법을 재정의합니다.
* [Gradle 데몬 인수 상속](#gradle-daemon-arguments-inheritance)
* [`kotlin.daemon.jvm.options` 시스템 속성](#kotlin-daemon-jvm-options-system-property)
* [`kotlin.daemon.jvmargs` 속성](#kotlin-daemon-jvmargs-property)
* [`kotlin` 확장](#kotlin-extension)
* [특정 작업 정의](#specific-task-definition)

#### Gradle 데몬 인수 상속

기본적으로 Kotlin 데몬은 Gradle 데몬에서 특정 인수 집합을 상속하지만 Kotlin 데몬에 직접 지정된 JVM 인수로 덮어씁니다. 예를 들어 `gradle.properties` 파일에 다음 JVM 인수를 추가하는 경우:

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

이러한 인수는 Kotlin 데몬의 JVM 인수에 추가됩니다.

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

JVM 인수를 사용하는 Kotlin 데몬의 기본 동작에 대한 자세한 내용은 [JVM 인수를 사용하는 Kotlin 데몬의 동작](#kotlin-daemon-s-behavior-with-jvm-arguments)을 참조하십시오.

:::

#### kotlin.daemon.jvm.options 시스템 속성

Gradle 데몬의 JVM 인수에 `kotlin.daemon.jvm.options` 시스템 속성이 있는 경우 `gradle.properties` 파일에서 사용합니다.

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

인수를 전달할 때는 다음 규칙을 따르십시오.
* `Xmx`, `XX:MaxMetaspaceSize` 및 `XX:ReservedCodeCacheSize` 인수 **앞에만** 빼기 기호 `-`를 사용합니다.
* 공백 _없이_ 쉼표(`,`)로 인수를 구분합니다. 공백 뒤에 오는 인수는 Kotlin 데몬이 아닌 Gradle 데몬에 사용됩니다.

:::note
Gradle은 다음 조건이 모두 충족되면 이러한 속성을 무시합니다.
* Gradle이 JDK 1.9 이상을 사용하고 있습니다.
* Gradle 버전이 7.0에서 7.1.1 사이에 있습니다.
* Gradle이 Kotlin DSL 스크립트를 컴파일하고 있습니다.
* Kotlin 데몬이 실행되고 있지 않습니다.

이를 극복하려면 Gradle을 버전 7.2(이상)로 업그레이드하거나 `kotlin.daemon.jvmargs` 속성을 사용하십시오(다음 섹션 참조).

#### kotlin.daemon.jvmargs 속성

`gradle.properties` 파일에 `kotlin.daemon.jvmargs` 속성을 추가할 수 있습니다.

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

여기 또는 Gradle의 JVM 인수에 `ReservedCodeCacheSize` 인수를 지정하지 않으면 Kotlin Gradle 플러그인이 기본값 `320m`을 적용합니다.

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlin 확장

`kotlin` 확장에서 인수를 지정할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</TabItem>
</Tabs>

#### 특정 작업 정의

특정 작업에 대한 인수를 지정할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(CompileUsingKotlinDaemon).configureEach { task `->`
    task.kotlinDaemonJvmArguments = ["-Xmx1g", "-Xms512m"]
}
```

</TabItem>
</Tabs>

이 경우 작업 실행 시 새 Kotlin 데몬 인스턴스가 시작될 수 있습니다. [JVM 인수를 사용하는 Kotlin 데몬의 동작](#kotlin-daemon-s-behavior-with-jvm-arguments)에 대해 자세히 알아보십시오.

:::

### JVM 인수를 사용하는 Kotlin 데몬의 동작

Kotlin 데몬의 JVM 인수를 구성할 때 다음 사항에 유의하십시오.

* 서로 다른 하위 프로젝트 또는 작업에 서로 다른 JVM 인수 집합이 있는 경우 동시에 실행되는 Kotlin 데몬의 여러 인스턴스가 있을 것으로 예상됩니다.
* 새 Kotlin 데몬 인스턴스는 Gradle이 관련 컴파일 작업을 실행하고 기존 Kotlin 데몬에 동일한 JVM 인수 집합이 없는 경우에만 시작됩니다.
  프로젝트에 많은 하위 프로젝트가 있다고 가정해 보겠습니다. 대부분은 Kotlin 데몬에 대한 일부 힙 메모리가 필요하지만 한 모듈은 많은 양을 필요로 합니다(드물게 컴파일되지만).
  이 경우 해당 모듈에 대해 다른 JVM 인수 집합을 제공해야 하므로 더 큰 힙 크기를 가진 Kotlin 데몬은 이 특정 모듈을 건드리는 개발자에게만 시작됩니다.
  > 컴파일 요청을 처리할 수 있을 만큼 충분한 힙 크기를 가진 Kotlin 데몬을 이미 실행 중인 경우,
  > 다른 요청된 JVM 인수가 다르더라도 새 데몬을 시작하는 대신 이 데몬이 재사용됩니다.
  >
  

다음 인수가 지정되지 않은 경우 Kotlin 데몬은 Gradle 데몬에서 상속합니다.

* `-Xmx`
* `-XX:MaxMetaspaceSize`
* `-XX:ReservedCodeCacheSize`. 지정되지 않거나 상속되지 않은 경우 기본값은 `320m`입니다.

Kotlin 데몬에는 다음과 같은 기본 JVM 인수가 있습니다.
* `-XX:UseParallelGC`. 이 인수는 다른 가비지 수집기가 지정되지 않은 경우에만 적용됩니다.
* `-ea`
* `-XX:+UseCodeCacheFlushing`
* `-Djava.awt.headless=true`
* `-D{java.servername.property}={localhostip}`
* `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`. 이 인수는 JDK 버전 16 이상에서만 적용됩니다.

:::note
Kotlin 데몬에 대한 기본 JVM 인수 목록은 버전에 따라 다를 수 있습니다. [VisualVM](https://visualvm.github.io/)과 같은 도구를 사용하여 Kotlin 데몬과 같은 실행 중인 JVM 프로세스의 실제 설정을 확인할 수 있습니다.

:::

## 이전 컴파일러로 롤백

Kotlin 2.0.0부터 K2 컴파일러가 기본적으로 사용됩니다.

Kotlin 2.0.0부터 이전 컴파일러를 사용하려면 다음 중 하나를 수행하십시오.

* `build.gradle.kts` 파일에서 [언어 버전 설정](gradle-compiler-options#example-of-setting-languageversion)을 `1.9`로 설정합니다.

  또는
* 다음 컴파일러 옵션을 사용하십시오. `-language-version 1.9`.

K2 컴파일러의 이점에 대한 자세한 내용은 [K2 컴파일러 마이그레이션 가이드](k2-compiler-migration-guide)를 참조하십시오.

## Kotlin 컴파일러 실행 전략 정의

_Kotlin 컴파일러 실행 전략_은 Kotlin 컴파일러가 실행되는 위치와 각 경우에 점진적 컴파일이 지원되는지 여부를 정의합니다.

세 가지 컴파일러 실행 전략이 있습니다.

| 전략       | Kotlin 컴파일러가 실행되는 위치          | 점진적 컴파일 | 기타 특성 및 참고 사항                                                                                                                                                                                                                                                |
|----------------|--------------------------------------------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 데몬         | 자체 데몬 프로세스 내부              | 예                     | _기본 전략이자 가장 빠른 전략입니다_. 다른 Gradle 데몬과 여러 병렬 컴파일 간에 공유할 수 있습니다.                                                                                                                                                         |
| 프로세스 내부     | Gradle 데몬 프로세스 내부           | 아니요                      | Gradle 데몬과 힙을 공유할 수 있습니다. "프로세스 내부" 실행 전략은 "데몬" 실행 전략보다 _느립니다_. 각 [워커](https://docs.gradle.org/current/userguide/worker_api.html)는 각 컴파일에 대해 별도의 Kotlin 컴파일러 클래스 로더를 생성합니다. |
| 프로세스 외부 | 각 컴파일에 대해 별도의 프로세스에서 | 아니요                      | 가장 느린 실행 전략입니다. "프로세스 내부"와 유사하지만 각 컴파일에 대해 Gradle 워커 내에서 별도의 Java 프로세스를 추가로 생성합니다.                                                                                                                     |

Kotlin 컴파일러 실행 전략을 정의하려면 다음 속성 중 하나를 사용할 수 있습니다.
* `kotlin.compiler.execution.strategy` Gradle 속성.
* `compilerExecutionStrategy` 컴파일 작업 속성.

작업 속성 `compilerExecutionStrategy`는 Gradle 속성 `kotlin.compiler.execution.strategy`보다 우선합니다.

`kotlin.compiler.execution.strategy` 속성에 사용할 수 있는 값은 다음과 같습니다.
1. `daemon` (기본값)
2. `in-process`
3. `out-of-process`

`gradle.properties`에서 Gradle 속성 `kotlin.compiler.execution.strategy`를 사용합니다.

```none
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 작업 속성에 사용할 수 있는 값은 다음과 같습니다.
1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (기본값)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

빌드 스크립트에서 작업 속성 `compilerExecutionStrategy`를 사용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
} 
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
    .configureEach {
        compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
    }
```

</TabItem>
</Tabs>

## Kotlin 컴파일러 폴백 전략

Kotlin 컴파일러의 폴백 전략은 데몬이 어떤 이유로 실패할 경우 Kotlin 데몬 외부에서 컴파일을 실행하는 것입니다.
Gradle 데몬이 켜져 있으면 컴파일러는 ["프로세스 내부 전략"](#defining-kotlin-compiler-execution-strategy)을 사용합니다.
Gradle 데몬이 꺼져 있으면 컴파일러는 "프로세스 외부" 전략을 사용합니다.

이 폴백이 발생하면 Gradle의 빌드 출력에 다음과 같은 경고 줄이 표시됩니다.

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

그러나 다른 전략으로의 자동 폴백은 많은 시스템 리소스를 소비하거나 비결정적 빌드로 이어질 수 있습니다.
자세한 내용은 [YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)에서 자세히 알아보십시오.
이를 방지하기 위해 기본값이 `true`인 Gradle 속성 `kotlin.daemon.useFallbackStrategy`가 있습니다.
값이 `false`이면 데몬의 시작 또는 통신에 문제가 발생하면 빌드가 실패합니다.
`gradle.properties`에서 이 속성을 선언합니다.

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlin 컴파일 작업에도 `useDaemonFallbackStrategy` 속성이 있으며, 둘 다 사용하는 경우 Gradle 속성보다 우선합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }   
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```
</TabItem>
</Tabs>

컴파일을 실행할 메모리가 부족하면 로그에 관련 메시지가 표시될 수 있습니다.

## 최신 언어 버전 사용해 보기

Kotlin 2.0.0부터 최신 언어 버전을 사용하려면 `gradle.properties` 파일에서 `kotlin.experimental.tryNext` 속성을 설정하십시오.
이 속성을 사용하면 Kotlin Gradle 플러그인이 언어 버전을 Kotlin 버전의 기본값보다 1만큼 증가시킵니다.
예를 들어 Kotlin 2.0.0에서 기본 언어 버전은 2.0이므로 속성은 언어 버전 2.1을 구성합니다.

또는 다음 명령을 실행할 수 있습니다.

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
``` 

[빌드 보고서](#build-reports)에서 각 작업을 컴파일하는 데 사용된 언어 버전을 찾을 수 있습니다.

## 빌드 보고서

빌드 보고서에는 다양한 컴파일 단계의 지속 시간과 컴파일을 점진적으로 수행할 수 없는 이유가 포함되어 있습니다.
컴파일 시간이 너무 오래 걸리거나 동일한 프로젝트에서 컴파일 시간이 다른 경우 빌드 보고서를 사용하여 성능 문제를 조사하십시오.

Kotlin 빌드 보고서는 세분성 단위로 단일 Gradle 작업을 갖는 [Gradle 빌드 스캔](https://scans.gradle.com/)보다 빌드 성능 문제를 더 효율적으로 조사하는 데 도움이 됩니다.

장기 실행 컴파일에 대한 빌드 보고서를 분석하면 해결하는 데 도움이 될 수 있는 두 가지 일반적인 경우가 있습니다.
* 빌드가 점진적이지 않았습니다. 이유를 분석하고 근본적인 문제를 해결합니다.
* 빌드가 점진적이었지만 시간이 너무 오래 걸렸습니다. 소스 파일을 재구성해 보십시오. 큰 파일을 분할하고,
  별도의 클래스를 다른 파일에 저장하고, 큰 클래스를 리팩터링하고, 최상위 함수를 다른 파일에 선언하는 등의 작업을 수행합니다.

빌드 보고서는 프로젝트에서 사용된 Kotlin 버전도 보여줍니다. 또한 Kotlin 1.9.0부터는
[Gradle 빌드 스캔](https://scans.gradle.com/)에서 코드를 컴파일하는 데 사용된 컴파일러를 확인할 수 있습니다.

[빌드 보고서를 읽는 방법](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports)
및 [JetBrains가 빌드 보고서를 사용하는 방법](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains)에 대해 알아보십시오.

### 빌드 보고서 활성화

빌드 보고서를 활성화하려면 `gradle.properties`에서 빌드 보고서 출력을 저장할 위치를 선언합니다.

```none
kotlin.build.report.output=file
```

출력에 사용할 수 있는 값과 그 조합은 다음과 같습니다.

| 옵션 | 설명 |
|---|---|
| `file` | 사람이 읽을 수 있는 형식으로 빌드 보고서를 로컬 파일에 저장합니다. 기본적으로 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`입니다. |
| `single_file` | 객체 형식으로 빌드 보고서를 지정된 로컬 파일에 저장합니다. |
| `build_scan` | [빌드 스캔](https://scans.gradle.com/)의 `custom values` 섹션에 빌드 보고서를 저장합니다. Gradle Enterprise 플러그인은 사용자 지정 값의 수와 길이를 제한합니다. 큰 프로젝트에서는 일부 값이 손실될 수 있습니다. |
| `http` | HTTP(S)를 사용하여 빌드 보고서를 게시합니다. POST 메서드는 JSON 형식으로 메트릭을 보냅니다. 보낸 데이터의 현재 버전은 [Kotlin 리포지토리](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)에서 확인할 수 있습니다. HTTP 엔드포인트의 샘플은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)에서 찾을 수 있습니다. |
| `json` | 빌드 보고서를 JSON 형식으로 로컬 파일에 저장합니다. `kotlin.build.report.json.directory`에서 빌드 보고서의 위치를 설정합니다(아래 참조). 기본적으로 이름은 `${project_name}-build-<date-time>-<index>.json`입니다. |

다음은 `kotlin.build.report`에 사용할 수 있는 옵션 목록입니다.

```none
# 필수 출력입니다. 모든 조합이 허용됩니다.
kotlin.build.report.output=file,single_file,http,build_scan,json

# single_file 출력이 사용되는 경우 필수입니다. 보고서를 저장할 위치
# 더 이상 사용되지 않는 `kotlin.internal.single.build.metrics.file` 속성 대신 사용하십시오.
kotlin.build.report.single_file=some_filename

# json 출력이 사용되는 경우 필수입니다. 보고서를 저장할 위치
kotlin.build.report.json.directory=my/directory/path

# 선택 사항. 파일 기반 보고서의 출력 디렉터리입니다. 기본값: build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# 선택 사항. 빌드 보고서를 표시하는 레이블(예: 디버그 매개변수)
kotlin.build.report.label=some_label
```

HTTP에만 적용 가능한 옵션:

```none
# 필수 항목입니다. HTTP(S) 기반 보고서를 게시할 위치
kotlin.build.report.http.url=http://127.0.0.1:8080

# 선택 사항. HTTP 엔드포인트에 인증이 필요한 경우 사용자 및 암호
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# 선택 사항. 빌드의 Git 브랜치 이름을 빌드 보고서에 추가합니다.
kotlin.build.report.http.include_git_branch.name=true|false

# 선택 사항. 컴파일러 인수를 빌드 보고서에 추가합니다.
# 프로젝트에 여러 모듈이 포함되어 있는 경우 보고서의 컴파일러 인수가 매우 클 수 있으며 도움이 되지 않을 수 있습니다.
kotlin.build.report.include_compiler_arguments=true|false
```

### 사용자 지정 값 제한

빌드 스캔 통계를 수집하기 위해 Kotlin 빌드 보고서는 [Gradle의 사용자 지정 값](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/)을 사용합니다.
사용자와 다양한 Gradle 플러그인이 모두 사용자 지정 값에 데이터를 쓸 수 있습니다. 사용자 지정 값의 수에는 제한이 있습니다.
[빌드 스캔 플러그인 문서](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values)에서 현재 최대 사용자 지정 값 수를 참조하십시오.

프로젝트가 큰 경우 이러한 사용자 지정 값의 수가 상당히 클 수 있습니다. 이 수가 제한을 초과하면
로그에 다음 메시지가 표시될 수 있습니다.

```text
Maximum number of custom values (1,000) exceeded
```

Kotlin 플러그인이 생성하는 사용자 지정 값 수를 줄이려면 `gradle.properties`에서 다음 속성을 사용할 수 있습니다.

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### 프로젝트 및 시스템 속성 수집 끄기

HTTP 빌드 통계 로그에는 일부 프로젝트 및 시스템 속성이 포함될 수 있습니다. 이러한 속성은 빌드 동작을 변경할 수 있으므로
빌드 통계에 기록하는 것이 유용합니다.
이러한 속성은 암호 또는 프로젝트의 전체 경로와 같은 중요한 데이터를 저장할 수 있습니다.

`kotlin.build.report.http.verbose_environment` 속성을
`gradle.properties`에 추가하여 이러한 통계 수집을 비활성화할 수 있습니다.

:::note
JetBrains는 이러한 통계를 수집하지 않습니다. [보고서를 저장할 위치](#enabling-build-reports)를 선택합니다.

:::

## 다음 단계

다음 항목에 대해 자세히 알아보십시오.
* [Gradle 기본 사항 및 특정 사항](https://docs.gradle.org/current/userguide/userguide.html).
* [Gradle 플러그인 변형 지원](gradle-plugin-variants).

  ```