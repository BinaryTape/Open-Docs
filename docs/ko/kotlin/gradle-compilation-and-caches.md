[//]: # (title: Kotlin Gradle 플러그인의 컴파일 및 캐시)

이 페이지에서는 다음 주제에 대해 알아볼 수 있습니다:
* [증분 컴파일(Incremental compilation)](#incremental-compilation)
* [Gradle 빌드 캐시 지원](#gradle-build-cache-support)
* [Gradle 구성(Configuration) 캐시 지원](#gradle-configuration-cache-support)
* [Kotlin 데몬 및 Gradle에서의 사용 방법](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [이전 컴파일러로 되돌리기](#rolling-back-to-the-previous-compiler)
* [Kotlin 컴파일러 실행 전략 정의](compiler-execution-strategy.md)
* [Kotlin 컴파일러 폴백(Fallback) 전략](compiler-execution-strategy.md#fallback-strategy)
* [최신 언어 버전 시도하기](#trying-the-latest-language-version)
* [빌드 보고서](#build-reports)

## 증분 컴파일

Kotlin Gradle 플러그인은 증분 컴파일을 지원하며, 이는 Kotlin/JVM 및 Kotlin/JS 프로젝트에서 기본적으로 활성화되어 있습니다.
증분 컴파일은 빌드 간의 클래스패스(classpath) 파일 변경 사항을 추적하여 이러한 변경 사항의 영향을 받는 파일만 컴파일합니다.
이 방식은 [Gradle 빌드 캐시](#gradle-build-cache-support)와 함께 작동하며 [컴파일 회피(compilation avoidance)](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)를 지원합니다.

Kotlin/JVM의 경우, 증분 컴파일은 클래스패스 스냅샷(classpath snapshots)에 의존합니다.
이 스냅샷은 모듈의 API 구조를 캡처하여 재컴파일이 필요한 시점을 결정합니다.
전체 파이프라인을 최적화하기 위해 Kotlin 컴파일러는 두 가지 유형의 클래스패스 스냅샷을 사용합니다:

* **세밀한 스냅샷(Fine-grained snapshots):** 프로퍼티나 함수와 같은 클래스 멤버에 대한 상세 정보를 포함합니다.
멤버 수준의 변경이 감지되면, Kotlin 컴파일러는 수정된 멤버에 의존하는 클래스만 재컴파일합니다.
성능 유지를 위해 Kotlin Gradle 플러그인은 Gradle 캐시에 있는 `.jar` 파일에 대해 대략적인 스냅샷을 생성합니다.
* **대략적인 스냅샷(Coarse-grained snapshots):** 클래스 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 해시만 포함합니다.
ABI의 일부가 변경되면, Kotlin 컴파일러는 변경된 클래스에 의존하는 모든 클래스를 재컴파일합니다.
이는 외부 라이브러리와 같이 자주 변경되지 않는 클래스에 유용합니다.

> Kotlin/JS 프로젝트는 히스토리 파일을 기반으로 하는 다른 증분 컴파일 방식을 사용합니다. 
>
{style="note"}

증분 컴파일을 비활성화하는 몇 가지 방법은 다음과 같습니다:

* Kotlin/JVM의 경우 `kotlin.incremental=false`를 설정합니다.
* Kotlin/JS 프로젝트의 경우 `kotlin.incremental.js=false`를 설정합니다.
* 명령줄 파라미터로 `-Pkotlin.incremental=false` 또는 `-Pkotlin.incremental.js=false`를 사용합니다.

  이 파라미터는 이후의 각 빌드에 추가되어야 합니다.

증분 컴파일을 비활성화하면 빌드 후 증분 캐시가 무효화됩니다. 첫 번째 빌드는 절대 증분 방식으로 이루어지지 않습니다.

> 때로는 증분 컴파일 문제가 실패가 발생한 후 몇 차례가 지나서야 나타날 수 있습니다. 변경 및 컴파일 기록을 추적하려면 [빌드 보고서](#build-reports)를 사용하세요. 이는 재현 가능한 버그 보고서를 제공하는 데 도움이 될 수 있습니다.
>
{style="tip"}

현재 증분 컴파일 방식이 어떻게 작동하며 이전 방식과 어떻게 비교되는지 자세히 알아보려면 [블로그 포스트](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)를 참조하세요.

## Gradle 빌드 캐시 지원

Kotlin 플러그인은 향후 빌드에서 재사용하기 위해 빌드 출력을 저장하는 [Gradle 빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)를 사용합니다.

모든 Kotlin 태스크에 대해 캐싱을 비활성화하려면 시스템 프로퍼티 `kotlin.caching.enabled`를 `false`로 설정합니다(빌드 실행 시 `-Dkotlin.caching.enabled=false` 인자 추가).

## Gradle 구성 캐시 지원

Kotlin 플러그인은 [Gradle 구성(Configuration) 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)를 사용합니다.
이는 후속 빌드에서 구성 단계의 결과를 재사용하여 빌드 프로세스 속도를 높입니다.

구성 캐시를 활성화하는 방법은 [Gradle 문서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)를 참조하세요. 이 기능을 활성화하면 Kotlin Gradle 플러그인이 자동으로 이를 사용하기 시작합니다.

## Kotlin 데몬 및 Gradle에서의 사용 방법

[Kotlin 데몬](kotlin-daemon.md):
* 프로젝트를 컴파일하기 위해 Gradle 데몬과 함께 실행됩니다.
* IntelliJ IDEA 내장 빌드 시스템으로 프로젝트를 컴파일할 때는 Gradle 데몬과 별개로 실행됩니다.

Kotlin 데몬은 Kotlin 컴파일 태스크 중 하나가 소스를 컴파일하기 시작할 때 Gradle [실행 단계(execution stage)](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases)에서 시작됩니다.
Kotlin 데몬은 Gradle 데몬과 함께 종료되거나, Kotlin 컴파일 없이 2시간 동안 유휴 상태(idle)가 지속되면 종료됩니다.

Kotlin 데몬은 Gradle 데몬과 동일한 JDK를 사용합니다.

### Kotlin 데몬의 JVM 인자 설정하기

인자를 설정하는 다음 각 방법은 이전에 설정된 내용을 덮어씁니다:
* [Gradle 데몬 인자 상속](#gradle-daemon-arguments-inheritance)
* [`kotlin.daemon.jvm.options` 시스템 프로퍼티](#kotlin-daemon-jvm-options-system-property)
* [`kotlin.daemon.jvmargs` 프로퍼티](#kotlin-daemon-jvmargs-property)
* [`kotlin` 확장(extension)](#kotlin-extension)
* [특정 태스크 정의](#specific-task-definition)

#### Gradle 데몬 인자 상속

기본적으로 Kotlin 데몬은 Gradle 데몬으로부터 특정 인자 세트를 상속받지만, Kotlin 데몬에 직접 지정된 JVM 인자가 있으면 이를 덮어씁니다. 예를 들어, `gradle.properties` 파일에 다음과 같은 JVM 인자를 추가한 경우:

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

이 인자들은 Kotlin 데몬의 JVM 인자에 다음과 같이 추가됩니다:

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

> JVM 인자에 대한 Kotlin 데몬의 기본 동작에 대해 자세히 알아보려면 [JVM 인자에 따른 Kotlin 데몬의 동작](#kotlin-daemon-s-behavior-with-jvm-arguments)을 참조하세요.
>
{style="note"}

#### kotlin.daemon.jvm.options 시스템 프로퍼티

Gradle 데몬의 JVM 인자에 `kotlin.daemon.jvm.options` 시스템 프로퍼티가 있는 경우, `gradle.properties` 파일에서 이를 사용하세요:

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

인자를 전달할 때 다음 규칙을 따르세요:
* 마이너스 기호 `-`는 `Xmx`, `XX:MaxMetaspaceSize`, `XX:ReservedCodeCacheSize` 인자 앞에**만** 사용합니다.
* 인자는 공백 _없이_ 쉼표(`,`)로 구분합니다. 공백 뒤에 오는 인자는 Kotlin 데몬이 아닌 Gradle 데몬에 사용됩니다.

> 다음 조건이 모두 충족되는 경우 Gradle은 이러한 프로퍼티를 무시합니다:
> * Gradle이 JDK 1.9 이상을 사용 중입니다.
> * Gradle 버전이 7.0에서 7.1.1 사이입니다.
> * Gradle이 Kotlin DSL 스크립트를 컴파일 중입니다.
> * Kotlin 데몬이 실행 중이지 않습니다.
>
> 이를 해결하려면 Gradle을 7.2 버전 이상으로 업그레이드하거나 다음 섹션에 설명된 `kotlin.daemon.jvmargs` 프로퍼티를 사용하세요.
>
{style="warning"}

#### kotlin.daemon.jvmargs 프로퍼티

`gradle.properties` 파일에 `kotlin.daemon.jvmargs` 프로퍼티를 추가할 수 있습니다:

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

여기서 또는 Gradle의 JVM 인자에서 `ReservedCodeCacheSize` 인자를 지정하지 않으면, Kotlin Gradle 플러그인은 기본값인 `320m`을 적용합니다:

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlin 확장

`kotlin` 확장(extension)에서 인자를 지정할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</tab>
</tabs>

#### 특정 태스크 정의

특정 태스크에 대해 인자를 지정할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(CompileUsingKotlinDaemon).configureEach { task ->
    task.kotlinDaemonJvmArguments = ["-Xmx1g", "-Xms512m"]
}
```

</tab>
</tabs>

> 이 경우 태스크 실행 시 새로운 Kotlin 데몬 인스턴스가 시작될 수 있습니다. 자세한 내용은 [JVM 인자에 따른 Kotlin 데몬의 동작](#kotlin-daemon-s-behavior-with-jvm-arguments)을 참조하세요.
>
{style="note"}

### JVM 인자에 따른 Kotlin 데몬의 동작

Kotlin 데몬의 JVM 인자를 구성할 때 다음 사항에 유의하세요:

* 서로 다른 서브프로젝트나 태스크가 서로 다른 JVM 인자 세트를 가질 경우, 여러 개의 Kotlin 데몬 인스턴스가 동시에 실행될 수 있습니다.
* 새로운 Kotlin 데몬 인스턴스는 Gradle이 관련 컴파일 태스크를 실행하고 기존 Kotlin 데몬들이 동일한 JVM 인자 세트를 가지고 있지 않을 때만 시작됩니다.
  프로젝트에 많은 서브프로젝트가 있다고 가정해 봅시다. 대부분은 Kotlin 데몬을 위해 약간의 힙 메모리만 필요하지만, 한 모듈은 대용량 메모리가 필요합니다(자주 컴파일되지는 않음).
  이 경우 해당 모듈에 대해 다른 JVM 인자 세트를 제공하면, 큰 힙 크기를 가진 Kotlin 데몬은 해당 특정 모듈을 다루는 개발자에게만 시작됩니다.
  > 요청된 다른 JVM 인자들이 다르더라도, 컴파일 요청을 처리하기에 충분한 힙 크기를 가진 Kotlin 데몬이 이미 실행 중이라면 새 데몬을 시작하는 대신 해당 데몬이 재사용됩니다.
  >
  {style="note"}

다음 인자들이 지정되지 않은 경우, Kotlin 데몬은 이를 Gradle 데몬으로부터 상속받습니다:

* `-Xmx`
* `-XX:MaxMetaspaceSize`
* `-XX:ReservedCodeCacheSize`. 지정되거나 상속되지 않은 경우 기본값은 `320m`입니다.

Kotlin 데몬은 다음과 같은 기본 JVM 인자를 가집니다:
* `-XX:UseParallelGC`. 이 인자는 다른 가비지 컬렉터가 지정되지 않은 경우에만 적용됩니다.
* `-ea`
* `-XX:+UseCodeCacheFlushing`
* `-Djava.awt.headless=true`
* `-D{java.servername.property}={localhostip}`
* `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`. 이 인자는 JDK 16 이상 버전에만 적용됩니다.

> Kotlin 데몬의 기본 JVM 인자 목록은 버전에 따라 다를 수 있습니다. [VisualVM](https://visualvm.github.io/)과 같은 도구를 사용하여 Kotlin 데몬과 같이 실행 중인 JVM 프로세스의 실제 설정을 확인할 수 있습니다.
>
{style="note"}

## 이전 컴파일러로 되돌리기

Kotlin 2.0.0부터 K2 컴파일러가 기본으로 사용됩니다.

Kotlin 2.0.0 이상에서 이전 컴파일러를 사용하려면 다음 중 하나를 수행하세요:

* `build.gradle.kts` 파일에서 [언어 버전(language version)을 `1.9`로 설정](gradle-compiler-options.md#example-of-setting-languageversion)합니다.

  또는
* 다음 컴파일러 옵션을 사용합니다: `-language-version 1.9`.

K2 컴파일러의 이점에 대해 자세히 알아보려면 [K2 컴파일러 마이그레이션 가이드](k2-compiler-migration-guide.md)를 참조하세요.

## 최신 언어 버전 시도하기

Kotlin 2.0.0부터 최신 언어 버전을 시도해 보려면 `gradle.properties` 파일에 `kotlin.experimental.tryNext` 프로퍼티를 설정하세요. 이 프로퍼티를 사용하면 Kotlin Gradle 플러그인이 언어 버전을 현재 Kotlin 버전의 기본값보다 하나 높은 버전으로 올립니다. 예를 들어 Kotlin 2.0.0에서 기본 언어 버전은 2.0이므로, 이 프로퍼티는 언어 버전을 2.1로 구성합니다.

또는 다음 명령을 실행할 수 있습니다:

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
``` 

[빌드 보고서](#build-reports)에서 각 태스크를 컴파일하는 데 사용된 언어 버전을 확인할 수 있습니다.

## 빌드 보고서

빌드 보고서에는 다양한 컴파일 단계의 소요 시간과 컴파일이 증분 방식으로 이루어지지 못한 이유가 포함됩니다.
컴파일 시간이 너무 길거나 동일한 프로젝트임에도 시간이 다를 때 성능 문제를 조사하기 위해 빌드 보고서를 사용하세요.

Kotlin 빌드 보고서는 단일 Gradle 태스크를 세분화 단위로 하는 [Gradle 빌드 스캔(Gradle build scans)](https://scans.gradle.com/)보다 빌드 성능 문제를 더 효율적으로 조사할 수 있게 도와줍니다.

컴파일 시간이 오래 걸리는 빌드 보고서를 분석하여 해결할 수 있는 두 가지 일반적인 경우는 다음과 같습니다:
* 빌드가 증분 방식이 아니었습니다. 이유를 분석하고 근본적인 문제를 해결하세요.
* 빌드가 증분 방식이었지만 시간이 너무 많이 걸렸습니다. 소스 파일을 재구성해 보세요. 큰 파일을 분할하고, 별도의 클래스를 다른 파일에 저장하고, 큰 클래스를 리팩터링하고, 최상위 함수를 다른 파일에 선언하는 등의 방법이 있습니다.

빌드 보고서에는 프로젝트에 사용된 Kotlin 버전도 표시됩니다. 또한 Kotlin 1.9.0부터는 [Gradle 빌드 스캔](https://scans.gradle.com/)에서 코드를 컴파일하는 데 어떤 컴파일러가 사용되었는지 확인할 수 있습니다.

[빌드 보고서를 읽는 방법](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports)과 [JetBrains가 빌드 보고서를 사용하는 방법](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains)에 대해 알아보세요.

### 빌드 보고서 활성화하기

빌드 보고서를 활성화하려면 `gradle.properties`에 빌드 보고서 출력을 저장할 위치를 선언하세요:

```none
kotlin.build.report.output=file
```

출력에 사용할 수 있는 값과 조합은 다음과 같습니다:

| 옵션 | 설명 |
|---|---|
| `file` | 빌드 보고서를 사람이 읽을 수 있는 형식으로 로컬 파일에 저장합니다. 기본값은 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`입니다. |
| `single_file` | 빌드 보고서를 객체 형식으로 지정된 로컬 파일에 저장합니다. |
| `build_scan` | 빌드 보고서를 [빌드 스캔](https://scans.gradle.com/)의 `custom values` 섹션에 저장합니다. Gradle Enterprise 플러그인은 커스텀 값의 수와 길이를 제한한다는 점에 유의하세요. 대규모 프로젝트에서는 일부 값이 누락될 수 있습니다. |
| `http` | HTTP(S)를 사용하여 빌드 보고서를 게시합니다. POST 메서드는 지표를 JSON 형식으로 전송합니다. 전송되는 데이터의 현재 버전은 [Kotlin 리포지토리](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)에서 확인할 수 있습니다. HTTP 엔드포인트 샘플은 [이 블로그 포스트](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#enable_build_reports)에서 찾을 수 있습니다. |
| `json` | 빌드 보고서를 JSON 형식으로 로컬 파일에 저장합니다. `kotlin.build.report.json.directory`에 빌드 보고서 위치를 설정하세요(아래 참조). 기본 이름은 `${project_name}-build-<date-time>-<index>.json`입니다. |

`kotlin.build.report`에 사용할 수 있는 옵션 목록은 다음과 같습니다:

```none
# 필수 출력 방식. 어떤 조합이든 가능합니다.
kotlin.build.report.output=file,single_file,http,build_scan,json

# single_file 출력을 사용하는 경우 필수입니다. 보고서를 저장할 위치를 지정합니다.
# 더 이상 사용되지 않는 `kotlin.internal.single.build.metrics.file` 프로퍼티 대신 사용하세요.
kotlin.build.report.single_file=some_filename

# json 출력을 사용하는 경우 필수입니다. 보고서를 저장할 위치를 지정합니다.
kotlin.build.report.json.directory=my/directory/path

# 선택 사항. 파일 기반 보고서의 출력 디렉터리입니다. 기본값: build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# 선택 사항. 빌드 보고서에 표시를 위한 라벨(예: 디버그 파라미터)
kotlin.build.report.label=some_label
```

HTTP에만 적용되는 옵션:

```none
# 필수. HTTP(S) 기반 보고서를 게시할 위치
kotlin.build.report.http.url=http://127.0.0.1:8080

# 선택 사항. HTTP 엔드포인트에 인증이 필요한 경우의 사용자 및 비밀번호
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# 선택 사항. 빌드 보고서에 빌드의 Git 브랜치 이름을 추가합니다.
kotlin.build.report.http.include_git_branch.name=true|false

# 선택 사항. 빌드 보고서에 컴파일러 인자를 추가합니다.
# 프로젝트에 모듈이 많은 경우 보고서의 컴파일러 인자가 매우 방대해져 도움이 되지 않을 수 있습니다.
kotlin.build.report.include_compiler_arguments=true|false
```

### 커스텀 값 제한

빌드 스캔 통계를 수집하기 위해 Kotlin 빌드 보고서는 [Gradle의 커스텀 값(custom values)](https://docs.gradle.org/enterprise/tutorials/extending-build-scans/)을 사용합니다. 
사용자와 다양한 Gradle 플러그인 모두 커스텀 값에 데이터를 기록할 수 있습니다. 커스텀 값의 수에는 제한이 있습니다.
현재 최대 커스텀 값 개수는 [빌드 스캔 플러그인 문서](https://docs.gradle.org/enterprise/gradle-plugin/#adding_custom_values)를 참조하세요.

대규모 프로젝트의 경우 이러한 커스텀 값의 수가 상당히 많을 수 있습니다. 이 숫자가 제한을 초과하면 로그에 다음과 같은 메시지가 표시될 수 있습니다:

```text
Maximum number of custom values (1,000) exceeded
```

Kotlin 플러그인이 생성하는 커스텀 값의 수를 줄이려면 `gradle.properties`에서 다음 프로퍼티를 사용할 수 있습니다:

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### 프로젝트 및 시스템 프로퍼티 수집 중단하기

HTTP 빌드 통계 로그에는 일부 프로젝트 및 시스템 프로퍼티가 포함될 수 있습니다. 이러한 프로퍼티는 빌드 동작을 변경할 수 있으므로 빌드 통계에 기록하는 것이 유용합니다. 
그러나 이러한 프로퍼티에는 비밀번호나 프로젝트의 전체 경로와 같은 민감한 데이터가 포함될 수 있습니다.

`gradle.properties`에 `kotlin.build.report.http.verbose_environment` 프로퍼티를 추가하여 이러한 통계 수집을 비활성화할 수 있습니다.

> JetBrains는 이러한 통계를 수집하지 않습니다. 사용자가 [보고서를 저장할 위치](#enabling-build-reports)를 직접 선택합니다.
> 
{style="note"}

## 다음 단계는?

다음에 대해 자세히 알아보세요:
* [Gradle 기본 사항 및 세부 사항](https://docs.gradle.org/current/userguide/userguide.html).
* [Gradle 플러그인 변체(variants) 지원](gradle-plugin-variants.md).
* [컴파일러 실행 전략](compiler-execution-strategy.md)