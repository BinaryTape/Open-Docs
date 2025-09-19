[//]: # (title: kapt 컴파일러 플러그인)

> kapt는 유지보수 모드입니다. 최신 Kotlin 및 Java 릴리스에 맞춰 업데이트를 지속하고 있지만, 새로운 기능을 구현할 계획은 없습니다. 어노테이션 프로세싱에는 [Kotlin Symbol Processing API (KSP)](ksp-overview.md)를 사용해 주세요.
> [KSP가 지원하는 라이브러리 목록](ksp-overview.md#supported-libraries)을 참조하세요.
>
{style="warning"}

어노테이션 프로세서([JSR 269](https://jcp.org/en/jsr/detail?id=269) 참조)는 _kapt_ 컴파일러 플러그인을 사용하여 Kotlin에서 지원됩니다.

간단히 말해, kapt는 Java 기반 어노테이션 프로세싱을 활성화하여 Kotlin 프로젝트에서 [Dagger](https://google.github.io/dagger/) 및 [Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html)과 같은 라이브러리를 사용할 수 있도록 돕습니다.

## Gradle에서 사용

Gradle에서 kapt를 사용하려면 다음 단계를 따르세요.

1.  빌드 스크립트 파일 `build.gradle(.kts)`에 `kapt` Gradle 플러그인을 적용합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        kotlin("kapt") version "%kotlinVersion%"
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id "org.jetbrains.kotlin.kapt" version "%kotlinVersion%"
    }
    ```

    </tab>
    </tabs>

2.  `dependencies {}` 블록에서 `kapt` 구성을 사용하여 해당 종속성을 추가합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        kapt("groupId:artifactId:version")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        kapt 'groupId:artifactId:version'
    }
    ```

    </tab>
    </tabs>

3.  이전에 어노테이션 프로세서에 [Android 지원](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)을 사용했다면, `annotationProcessor` 구성 사용을 `kapt`로 대체하세요. 프로젝트에 Java 클래스가 포함되어 있다면, `kapt`가 해당 클래스도 처리합니다.

    `androidTest` 또는 `test` 소스에 어노테이션 프로세서를 사용하는 경우, 해당 `kapt` 구성은 `kaptAndroidTest` 및 `kaptTest`로 명명됩니다. `kaptAndroidTest`와 `kaptTest`가 `kapt`를 확장하므로, `kapt` 종속성을 제공하면 프로덕션 소스와 테스트 모두에서 사용할 수 있습니다.

## 어노테이션 프로세서 인수

어노테이션 프로세서에 인수를 전달하려면 빌드 스크립트 파일 `build.gradle(.kts)`의 `arguments {}` 블록을 사용하세요.

```kotlin
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle 빌드 캐시 지원

kapt 어노테이션 프로세싱 작업은 기본적으로 [Gradle에서 캐시됩니다](https://guides.gradle.org/using-build-cache/).
하지만 어노테이션 프로세서는 임의의 코드를 실행할 수 있으며, 이는 작업 입력을 출력으로 안정적으로 변환하지 못하거나 Gradle이 추적하지 않는 파일에 접근하고 수정할 수 있습니다.
빌드에 사용된 어노테이션 프로세서를 올바르게 캐시할 수 없는 경우, 빌드 스크립트에서 `useBuildCache` 속성을 지정하여 kapt에 대한 캐싱을 완전히 비활성화할 수 있습니다.
이는 kapt 작업에 대한 오탐 캐시 히트를 방지하는 데 도움이 됩니다.

```groovy
kapt {
    useBuildCache = false
}
```

## `kapt`를 사용하는 빌드 속도 개선

### `kapt` 작업 병렬 실행

kapt를 사용하는 빌드 속도를 개선하려면 `kapt` 작업에 [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)를 활성화할 수 있습니다. Worker API를 사용하면 Gradle이 단일 프로젝트에서 독립적인 어노테이션 프로세싱 작업을 병렬로 실행할 수 있으며, 이는 경우에 따라 실행 시간을 크게 단축시킵니다.

Kotlin Gradle 플러그인에서 [커스텀 JDK 홈](gradle-configure-project.md#gradle-java-toolchains-support) 기능을 사용할 때, kapt 작업 워커는 [프로세스 격리 모드](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)만 사용합니다. `kapt.workers.isolation` 속성은 무시됩니다.

kapt 워커 프로세스에 추가 JVM 인수를 제공하려면 `KaptWithoutKotlincTask`의 입력 `kaptProcessJvmArgs`를 사용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</tab>
</tabs>

### 어노테이션 프로세서 클래스 로더 캐싱

<primary-label ref="experimental-general"/>

어노테이션 프로세서 클래스 로더 캐싱은 여러 Gradle 작업을 연속적으로 실행할 때 kapt의 성능을 향상시키는 데 도움이 됩니다.

이 기능을 활성화하려면 `gradle.properties` 파일에 다음 속성을 사용하세요.

```none
# gradle.properties
#
# Any positive value enables caching
# Use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# Disable for caching to work
kapt.include.compile.classpath=false
```

어노테이션 프로세서 캐싱에 문제가 발생하면 다음과 같이 캐싱을 비활성화하세요.

```none
# Specify annotation processors' full names to disable caching for them
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

> 이 기능에 문제가 발생하면 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901)에 피드백을 주시면 감사하겠습니다.
>
{style="note"}

### 어노테이션 프로세서 성능 측정

어노테이션 프로세서 실행에 대한 성능 통계를 얻으려면 `-Kapt-show-processor-timings` 플러그인 옵션을 사용하세요.
예시 출력:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

플러그인 옵션 [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280)를 사용하여 이 보고서를 파일로 덤프할 수 있습니다.
다음 명령은 kapt를 실행하고 통계를 `ap-perf-report.file` 파일로 덤프합니다.

```bash
kotlinc -cp $MY_CLASSPATH \
-Xplugin=kotlin-annotation-processing-SNAPSHOT.jar -P \
plugin:org.jetbrains.kotlin.kapt3:aptMode=stubsAndApt,\
plugin:org.jetbrains.kotlin.kapt3:apclasspath=processor/build/libs/processor.jar,\
plugin:org.jetbrains.kotlin.kapt3:dumpProcessorTimings=ap-perf-report.file \
-Xplugin=$JAVA_HOME/lib/tools.jar \
-d cli-tests/out \
-no-jdk -no-reflect -no-stdlib -verbose \
sample/src/main/
```

### 어노테이션 프로세서로 생성된 파일 수 측정

`kapt` Gradle 플러그인은 각 어노테이션 프로세서에 대해 생성된 파일 수에 대한 통계를 보고할 수 있습니다.

이는 사용되지 않는 어노테이션 프로세서가 빌드에 포함되어 있는지 추적하는 데 도움이 됩니다.
생성된 보고서를 사용하여 불필요한 어노테이션 프로세서를 트리거하는 모듈을 찾아 해당 모듈을 업데이트하여 이를 방지할 수 있습니다.

통계 보고를 활성화하려면:

1.  `build.gradle(.kts)`에서 `showProcessorStats` 속성 값을 `true`로 설정합니다.

    ```kotlin
    // build.gradle.kts
    kapt {
        showProcessorStats = true
    }
    ```

2.  `gradle.properties`에서 `kapt.verbose` Gradle 속성을 `true`로 설정합니다.

    ```none
    # gradle.properties
    kapt.verbose=true
    ```

> [명령줄 옵션 `verbose`](#use-in-cli)를 사용하여 자세한(verbose) 출력을 활성화할 수도 있습니다.
>
{style="note"}

통계는 `info` 레벨로 로그에 나타납니다.
`Annotation processor stats:` 라인과 그 뒤에 각 어노테이션 프로세서의 실행 시간에 대한 통계를 볼 수 있습니다.
이 라인들 다음에는 `Generated files report:` 라인과 그 뒤에 각 어노테이션 프로세서에 대해 생성된 파일 수에 대한 통계가 나타납니다. 예시:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## `kapt`의 컴파일 회피

kapt를 사용하는 증분 빌드 시간을 개선하기 위해 Gradle의 [컴파일 회피](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance) 기능을 사용할 수 있습니다.
컴파일 회피가 활성화되면 Gradle은 프로젝트를 재빌드할 때 어노테이션 프로세싱을 건너뛸 수 있습니다. 특히, 어노테이션 프로세싱은 다음 경우에 건너뜁니다.

*   프로젝트의 소스 파일이 변경되지 않았을 때.
*   종속성의 변경 사항이 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 호환될 때. 예를 들어, 변경 사항이 메서드 본문에만 있을 때.

그러나 컴파일 클래스패스에서 발견된 어노테이션 프로세서에는 컴파일 회피를 사용할 수 없습니다. 이들은 _어떤 변경이든_ 어노테이션 프로세싱 작업을 실행해야 하기 때문입니다.

kapt를 컴파일 회피와 함께 실행하려면:
*   [어노테이션 프로세서 종속성을 `kapt*` 구성에 수동으로 추가](#use-in-gradle)합니다.
*   `gradle.properties` 파일에서 컴파일 클래스패스 내 어노테이션 프로세서 검색을 끕니다.

    ```none
    # gradle.properties
    kapt.include.compile.classpath=false
    ```

## 증분 어노테이션 프로세싱

kapt는 기본적으로 증분 어노테이션 프로세싱을 지원합니다.
현재, 사용 중인 모든 어노테이션 프로세서가 증분형인 경우에만 어노테이션 프로세싱을 증분형으로 할 수 있습니다.

증분 어노테이션 프로세싱을 비활성화하려면 `gradle.properties` 파일에 다음 줄을 추가하세요.

```none
kapt.incremental.apt=false
```

증분 어노테이션 프로세싱은 [증분 컴파일](gradle-compilation-and-caches.md#incremental-compilation)도 활성화되어 있어야 합니다.

## 상위 구성으로부터 어노테이션 프로세서 상속

별도의 Gradle 구성에 어노테이션 프로세서의 공통 집합을 상위 구성으로 정의하고, 이를 서브프로젝트의 kapt 특정 구성에서 확장할 수 있습니다.

예를 들어, [Dagger](https://dagger.dev/)를 사용하는 서브프로젝트의 경우 `build.gradle(.kts)` 파일에서 다음 구성을 사용하세요.

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

이 예시에서 `commonAnnotationProcessors` Gradle 구성은 모든 프로젝트에 사용하고자 하는 어노테이션 프로세싱을 위한 공통 상위 구성입니다. [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) 메서드를 사용하여 `commonAnnotationProcessors`를 상위 구성으로 추가합니다. kapt는 `commonAnnotationProcessors` Gradle 구성이 Dagger 어노테이션 프로세서에 대한 종속성을 가지고 있음을 감지합니다. 따라서 kapt는 Dagger 어노테이션 프로세서를 어노테이션 프로세싱을 위한 구성에 포함합니다.

## Java 컴파일러 옵션

kapt는 어노테이션 프로세서를 실행하기 위해 Java 컴파일러를 사용합니다.
`javac`에 임의의 옵션을 전달하는 방법은 다음과 같습니다.

```groovy
kapt {
    javacOptions {
        // Increase the max count of errors from annotation processors.
        // Default is 100.
        option("-Xmaxerrs", 500)
    }
}
```

## 존재하지 않는 타입 보정

일부 어노테이션 프로세서(`AutoFactory`와 같은)는 선언 시그니처에서 정확한 타입에 의존합니다.
기본적으로 kapt는 모든 알 수 없는 타입(생성된 클래스의 타입 포함)을 `NonExistentClass`로 대체하지만, 이 동작을 변경할 수 있습니다. 스텁에서 오류 타입 추론을 활성화하려면 `build.gradle(.kts)` 파일에 다음 옵션을 추가하세요.

```groovy
kapt {
    correctErrorTypes = true
}
```

## Maven에서 사용

`compile` 전에 kotlin-maven-plugin에서 `kapt` 골(goal) 실행을 추가하세요.

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- You can skip the <goals> element
        if you enable extensions for the plugin -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- Specify your annotation processors here -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

어노테이션 프로세싱 레벨을 구성하려면 `<configuration>` 블록에 다음 중 하나를 `aptMode`로 설정하세요.

*   `stubs` – 어노테이션 프로세싱에 필요한 스텁만 생성합니다.
*   `apt` – 어노테이션 프로세싱만 실행합니다.
*   `stubsAndApt` – (기본값) 스텁을 생성하고 어노테이션 프로세싱을 실행합니다.

예시:

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

## IntelliJ 빌드 시스템에서 사용

kapt는 IntelliJ IDEA 자체 빌드 시스템에서는 지원되지 않습니다. 어노테이션 프로세싱을 다시 실행하고 싶을 때마다 "Maven Projects" 툴바에서 빌드를 시작하세요.

## CLI에서 사용

kapt 컴파일러 플러그인은 Kotlin 컴파일러의 바이너리 배포판에서 사용할 수 있습니다.

`Xplugin` `kotlinc` 옵션을 사용하여 플러그인의 JAR 파일 경로를 제공함으로써 플러그인을 첨부할 수 있습니다.

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

사용 가능한 옵션 목록은 다음과 같습니다.

*   `sources` (*필수*): 생성된 파일의 출력 경로입니다.
*   `classes` (*필수*): 생성된 클래스 파일 및 리소스의 출력 경로입니다.
*   `stubs` (*필수*): 스텁 파일의 출력 경로입니다. 즉, 임시 디렉터리입니다.
*   `incrementalData`: 바이너리 스텁의 출력 경로입니다.
*   `apclasspath` (*반복 가능*): 어노테이션 프로세서 JAR 파일의 경로입니다. 보유한 JAR 파일 수만큼 `apclasspath` 옵션을 전달하세요.
*   `apoptions`: base64로 인코딩된 어노테이션 프로세서 옵션 목록입니다. 자세한 내용은 [AP/Javac 옵션 인코딩](#ap-javac-options-encoding)을 참조하세요.
*   `javacArguments`: `javac`에 전달되는 옵션의 base64로 인코딩된 목록입니다. 자세한 내용은 [AP/Javac 옵션 인코딩](#ap-javac-options-encoding)을 참조하세요.
*   `processors`: 쉼표로 구분된 어노테이션 프로세서의 정규화된 클래스 이름 목록입니다. 지정된 경우, kapt는 `apclasspath`에서 어노테이션 프로세서를 찾으려고 시도하지 않습니다.
*   `verbose`: 자세한(verbose) 출력을 활성화합니다.
*   `aptMode` (*필수*)
    *   `stubs` – 어노테이션 프로세싱에 필요한 스텁만 생성합니다.
    *   `apt` – 어노테이션 프로세싱만 실행합니다.
    *   `stubsAndApt` – 스텁을 생성하고 어노테이션 프로세싱을 실행합니다.
*   `correctErrorTypes`: 자세한 내용은 [존재하지 않는 타입 보정](#non-existent-type-correction)을 참조하세요. 기본적으로 비활성화되어 있습니다.
*   `dumpFileReadHistory`: 각 파일에 대해 어노테이션 프로세싱 중에 사용된 클래스 목록을 덤프할 출력 경로입니다.

플러그인 옵션 형식은 `-P plugin:<plugin id>:<key>=<value>`입니다. 옵션은 반복될 수 있습니다.

예시:

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## Kotlin 소스 생성

kapt는 Kotlin 소스를 생성할 수 있습니다. 생성된 Kotlin 소스 파일을 `processingEnv.options["kapt.kotlin.generated"]`로 지정된 디렉터리에 작성하면, 이 파일들은 메인 소스와 함께 컴파일됩니다.

kapt는 생성된 Kotlin 파일에 대한 다중 라운드를 지원하지 않습니다.

## AP/Javac 옵션 인코딩

`apoptions` 및 `javacArguments` CLI 옵션은 인코딩된 옵션 맵을 허용합니다.
다음은 직접 옵션을 인코딩하는 방법입니다.

```kotlin
fun encodeList(options: Map<String, String>): String {
    val os = ByteArrayOutputStream()
    val oos = ObjectOutputStream(os)

    oos.writeInt(options.size)
    for ((key, value) in options.entries) {
        oos.writeUTF(key)
        oos.writeUTF(value)
    }

    oos.flush()
    return Base64.getEncoder().encodeToString(os.toByteArray())
}
```

## Java 컴파일러의 어노테이션 프로세서 유지

기본적으로 kapt는 모든 어노테이션 프로세서를 실행하고 `javac`에 의한 어노테이션 프로세싱을 비활성화합니다.
하지만 `javac`의 일부 어노테이션 프로세서가 작동해야 할 수도 있습니다(예: [Lombok](https://projectlombok.org/)).

Gradle 빌드 파일에서 `keepJavacAnnotationProcessors` 옵션을 사용하세요.

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Maven을 사용하는 경우, 구체적인 플러그인 설정을 지정해야 합니다.
[Lombok 컴파일러 플러그인 설정 예시](lombok.md#using-with-kapt)를 참조하세요.