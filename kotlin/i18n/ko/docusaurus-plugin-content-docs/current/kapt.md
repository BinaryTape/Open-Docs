---
title: "kapt 컴파일러 플러그인"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip
kapt는 유지 관리 모드에 있습니다. 최신 Kotlin 및 Java 릴리스로 계속 업데이트하고 있지만, 새로운 기능을 구현할 계획은 없습니다. 어노테이션 처리를 위해 [Kotlin Symbol Processing API (KSP)](ksp-overview)를 사용하세요.
[KSP에서 지원하는 라이브러리 목록을 확인하세요](ksp-overview#supported-libraries).

:::

어노테이션 프로세서(Annotation processors, [JSR 269](https://jcp.org/en/jsr/detail?id=269) 참조)는 _kapt_ 컴파일러 플러그인을 통해 Kotlin에서 지원됩니다.

간단히 말해, Kotlin 프로젝트에서 [Dagger](https://google.github.io/dagger/) 또는
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html)과 같은 라이브러리를 사용할 수 있습니다.

*kapt* 플러그인을 Gradle/Maven 빌드에 적용하는 방법은 아래를 참조하세요.

## Gradle에서 사용

다음 단계를 따르세요:
1. `kotlin-kapt` Gradle 플러그인을 적용합니다:

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   plugins {
       kotlin("kapt") version "2.1.20"
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "2.1.20"
   }
   ```

   </TabItem>
   </Tabs>

2. `dependencies` 블록에서 `kapt` 설정을 사용하여 해당 종속성을 추가합니다:

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       kapt("groupId:artifactId:version")
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:version'
   }
   ```

   </TabItem>
   </Tabs>

3. 이전에 어노테이션 프로세서에 대한 [Android 지원](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)을 사용한 경우, `annotationProcessor` 설정의 사용을 `kapt`로 대체합니다. 프로젝트에 Java 클래스가 포함된 경우, `kapt`가 이를 처리합니다.

   `androidTest` 또는 `test` 소스에 대해 어노테이션 프로세서를 사용하는 경우, 해당 `kapt` 구성의 이름은
   `kaptAndroidTest` 및 `kaptTest`입니다. `kaptAndroidTest` 및 `kaptTest`는 `kapt`를 확장하므로 `kapt` 종속성만 제공하면 프로덕션 소스 및 테스트 모두에서 사용할 수 있습니다.

## Kotlin K2 컴파일러 사용해 보기

kapt 컴파일러 플러그인의 K2 지원은 [Experimental](components-stability)입니다. 옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.

Kotlin 1.9.20부터 [K2 컴파일러](https://blog.jetbrains.com/kotlin/2021/10/the-road-to-the-k2-compiler/)와 함께 kapt 컴파일러 플러그인을 사용해 볼 수 있습니다. K2 컴파일러는 성능 향상 및 기타 많은 이점을 제공합니다. Gradle 프로젝트에서 K2 컴파일러를 사용하려면 다음 옵션을 `gradle.properties` 파일에 추가하세요:

```kotlin
kapt.use.k2=true
```

Maven 빌드 시스템을 사용하는 경우, `pom.xml` 파일을 업데이트하세요:

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

Maven 프로젝트에서 kapt 플러그인을 활성화하려면 [](#use-in-maven)을 참조하세요.

:::

K2 컴파일러와 함께 kapt를 사용하는 동안 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

## 어노테이션 프로세서 인자

어노테이션 프로세서에 인자를 전달하려면 `arguments {}` 블록을 사용하세요:

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle 빌드 캐시 지원

kapt 어노테이션 처리 작업은 기본적으로 [Gradle에 캐시됩니다](https://guides.gradle.org/using-build-cache/).
그러나 어노테이션 프로세서는 작업 입력을 출력으로 변환하지 않을 수 있는 임의의 코드를 실행하고, Gradle에서 추적하지 않는 파일에 액세스하고 수정할 수 있습니다. 빌드에 사용된 어노테이션 프로세서를 제대로 캐시할 수 없는 경우, kapt 작업에 대한 가양성 캐시 히트를 피하기 위해 다음 줄을 빌드 스크립트에 추가하여 kapt에 대한 캐싱을 완전히 비활성화할 수 있습니다:

```groovy
kapt {
    useBuildCache = false
}
```

## kapt를 사용하는 빌드 속도 향상

### kapt 작업을 병렬로 실행

kapt를 사용하는 빌드 속도를 향상시키려면 kapt 작업에 대해 [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)를 활성화할 수 있습니다. Worker API를 사용하면 Gradle이 단일 프로젝트에서 독립적인 어노테이션 처리 작업을 병렬로 실행할 수 있으므로 경우에 따라 실행 시간이 크게 줄어듭니다.

Kotlin Gradle 플러그인에서 [사용자 정의 JDK 홈](gradle-configure-project#gradle-java-toolchains-support) 기능을 사용하는 경우, kapt 작업 워커는 [프로세스 격리 모드](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)만 사용합니다. `kapt.workers.isolation` 속성은 무시됩니다.

kapt 워커 프로세스에 추가 JVM 인자를 제공하려면 `KaptWithoutKotlincTask`의 입력 `kaptProcessJvmArgs`를 사용하세요:

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</TabItem>
</Tabs>

### 어노테이션 프로세서의 클래스 로더에 대한 캐싱

:::caution
kapt에서 어노테이션 프로세서의 클래스 로더에 대한 캐싱은 [Experimental](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-28901)에서 피드백을 보내주시면 감사하겠습니다.

:::

어노테이션 프로세서의 클래스 로더에 대한 캐싱은 여러 Gradle 작업을 연속적으로 실행하는 경우 kapt의 성능을 향상시키는 데 도움이 됩니다.

이 기능을 활성화하려면 `gradle.properties` 파일에서 다음 속성을 사용하세요:

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

어노테이션 프로세서에 대한 캐싱에 문제가 발생하는 경우, 해당 캐싱을 비활성화하세요:

```none
# specify annotation processors' full names to disable caching for them
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

### 어노테이션 프로세서의 성능 측정

`-Kapt-show-processor-timings` 플러그인 옵션을 사용하여 어노테이션 프로세서 실행에 대한 성능 통계를 가져옵니다.
출력 예시:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

플러그인 옵션 [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280)을 사용하여 이 보고서를 파일에 덤프할 수 있습니다.
다음 명령은 kapt를 실행하고 통계를 `ap-perf-report.file` 파일에 덤프합니다:

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

`kotlin-kapt` Gradle 플러그인은 각 어노테이션 프로세서에 대해 생성된 파일 수에 대한 통계를 보고할 수 있습니다.

이는 빌드의 일부로 사용되지 않는 어노테이션 프로세서가 있는지 추적하는 데 유용합니다.
생성된 보고서를 사용하여 불필요한 어노테이션 프로세서를 트리거하는 모듈을 찾고 모듈을 업데이트하여 이를 방지할 수 있습니다.

다음 두 단계로 통계를 활성화합니다:
* `build.gradle(.kts)`에서 `showProcessorStats` 플래그를 `true`로 설정합니다:

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* `gradle.properties`에서 `kapt.verbose` Gradle 속성을 `true`로 설정합니다:

  ```none
  kapt.verbose=true
  ```

> [명령줄 옵션 `verbose`](#use-in-cli)를 통해 자세한 출력을 활성화할 수도 있습니다.
>
>

통계는 `info` 레벨로 로그에 나타납니다. `Annotation processor stats:` 줄 다음에
각 어노테이션 프로세서의 실행 시간에 대한 통계가 표시됩니다. 이러한 줄 뒤에는 `Generated files report:` 줄 다음에
각 어노테이션 프로세서에 대해 생성된 파일 수에 대한 통계가 표시됩니다. 예시:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt에 대한 컴파일 회피

kapt를 사용하는 증분 빌드 시간을 개선하기 위해 Gradle [컴파일 회피](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)를 사용할 수 있습니다.
컴파일 회피를 활성화하면 Gradle은 프로젝트를 다시 빌드할 때 어노테이션 처리를 건너뛸 수 있습니다. 특히 어노테이션
처리는 다음과 같은 경우에 건너뜁니다.

* 프로젝트의 소스 파일이 변경되지 않은 경우.
* 종속성의 변경 사항이 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 호환되는 경우.
   예를 들어, 변경 사항이 메서드 본문에만 있는 경우.

그러나 컴파일 클래스 경로에서 검색된 어노테이션 프로세서의 경우 _모든 변경 사항_이
어노테이션 처리 작업을 실행해야 하므로 컴파일 회피를 사용할 수 없습니다.

컴파일 회피를 사용하여 kapt를 실행하려면:
* [위](#use-in-gradle)에 설명된 대로 어노테이션 프로세서 종속성을 `kapt*` 구성에 수동으로 추가합니다.
* `gradle.properties` 파일에 다음 줄을 추가하여 컴파일 클래스 경로에서 어노테이션 프로세서의 검색을 끕니다.

```none
kapt.include.compile.classpath=false
```

## 증분 어노테이션 처리

kapt는 기본적으로 활성화된 증분 어노테이션 처리를 지원합니다.
현재 사용 중인 모든 어노테이션 프로세서가 증분식인 경우에만 어노테이션 처리가 증분식일 수 있습니다.

증분 어노테이션 처리를 비활성화하려면 `gradle.properties` 파일에 다음 줄을 추가합니다:

```none
kapt.incremental.apt=false
```

증분 어노테이션 처리는 [증분 컴파일](gradle-compilation-and-caches#incremental-compilation)도 활성화해야 합니다.

## 슈퍼 구성에서 어노테이션 프로세서 상속

별도의 Gradle 구성에서 어노테이션 프로세서의 공통 집합을 슈퍼 구성으로 정의하고 하위 프로젝트의 kapt 관련 구성에서 이를 추가로 확장할 수 있습니다.

예를 들어, [Dagger](https://dagger.dev/)를 사용하는 하위 프로젝트의 경우 `build.gradle(.kts)` 파일에서 다음 구성을 사용합니다.

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

이 예제에서 `commonAnnotationProcessors` Gradle 구성은 모든 프로젝트에 사용하려는 어노테이션 처리를 위한 공통 슈퍼 구성입니다. [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
메서드를 사용하여 `commonAnnotationProcessors`를 슈퍼 구성으로 추가합니다. kapt는 `commonAnnotationProcessors`
Gradle 구성이 Dagger 어노테이션 프로세서에 대한 종속성을 가지고 있음을 확인합니다. 따라서 kapt는 어노테이션 처리를 위한 구성에 Dagger 어노테이션 프로세서를 포함합니다.

## Java 컴파일러 옵션

kapt는 Java 컴파일러를 사용하여 어노테이션 프로세서를 실행합니다.
다음은 javac에 임의의 옵션을 전달하는 방법입니다.

```groovy
kapt {
    javacOptions {
        // Increase the max count of errors from annotation processors.
        // Default is 100.
        option("-Xmaxerrs", 500)
    }
}
```

## 존재하지 않는 유형 수정

일부 어노테이션 프로세서(`AutoFactory`와 같은)는 선언 서명에서 정확한 유형에 의존합니다.
기본적으로 kapt는 알 수 없는 모든 유형(생성된 클래스의 유형 포함)을 `NonExistentClass`로 바꾸지만, 이 동작을 변경할 수 있습니다. 스텁에서 오류 유형 추론을 활성화하려면 `build.gradle(.kts)` 파일에 옵션을 추가합니다:

```groovy
kapt {
    correctErrorTypes = true
}
```

## Maven에서 사용

`compile` 전에 kotlin-maven-plugin에서 `kapt` 목표의 실행을 추가합니다:

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

어노테이션 처리 수준을 구성하려면 `<configuration>` 블록에서 다음 중 하나를 `aptMode`로 설정합니다:

   * `stubs` – 어노테이션 처리에 필요한 스텁만 생성합니다.
   * `apt` – 어노테이션 처리만 실행합니다.
   * `stubsAndApt` – (기본값) 스텁을 생성하고 어노테이션 처리를 실행합니다.

예시:

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

K2 컴파일러를 사용하여 kapt 플러그인을 활성화하려면 `-Xuse-k2-kapt` 컴파일러 옵션을 추가합니다:

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

## IntelliJ 빌드 시스템에서 사용

kapt는 IntelliJ IDEA 자체 빌드 시스템에서 지원되지 않습니다. 어노테이션 처리를 다시 실행하려면 언제든지 "Maven Projects"
툴바에서 빌드를 시작하세요.

## CLI에서 사용

kapt 컴파일러 플러그인은 Kotlin 컴파일러의 바이너리 배포판에서 사용할 수 있습니다.

`Xplugin` kotlinc 옵션을 사용하여 JAR 파일의 경로를 제공하여 플러그인을 연결할 수 있습니다:

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

사용 가능한 옵션 목록은 다음과 같습니다.

* `sources` (*필수*): 생성된 파일의 출력 경로입니다.
* `classes` (*필수*): 생성된 클래스 파일 및 리소스의 출력 경로입니다.
* `stubs` (*필수*): 스텁 파일의 출력 경로입니다. 즉, 일부 임시 디렉토리입니다.
* `incrementalData`: 바이너리 스텁의 출력 경로입니다.
* `apclasspath` (*반복 가능*): 어노테이션 프로세서 JAR의 경로입니다. 가지고 있는 JAR 수만큼 `apclasspath` 옵션을 전달합니다.
* `apoptions`: 어노테이션 프로세서 옵션의 base64로 인코딩된 목록입니다. 자세한 내용은 [AP/javac 옵션 인코딩](#ap-javac-options-encoding)을 참조하세요.
* `javacArguments`: javac에 전달된 옵션의 base64로 인코딩된 목록입니다. 자세한 내용은 [AP/javac 옵션 인코딩](#ap-javac-options-encoding)을 참조하세요.
* `processors`: 쉼표로 구분된 어노테이션 프로세서 정규화된 클래스 이름 목록입니다. 지정된 경우 kapt는 `apclasspath`에서 어노테이션 프로세서를 찾으려고 하지 않습니다.
* `verbose`: 자세한 출력을 활성화합니다.
* `aptMode` (*필수*)
    * `stubs` – 어노테이션 처리에 필요한 스텁만 생성합니다.
    * `apt` – 어노테이션 처리만 실행합니다.
    * `stubsAndApt` – 스텁을 생성하고 어노테이션 처리를 실행합니다.
* `correctErrorTypes`: 자세한 내용은 [존재하지 않는 유형 수정](#non-existent-type-correction)을 참조하세요. 기본적으로 비활성화되어 있습니다.
* `dumpFileReadHistory`: 어노테이션 처리 중에 사용된 클래스 목록을 각 파일에 대해 덤프할 출력 경로입니다.

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

kapt는 Kotlin 소스를 생성할 수 있습니다. 생성된 Kotlin 소스 파일을 `processingEnv.options["kapt.kotlin.generated"]`에 지정된 디렉토리에 작성하기만 하면 이러한 파일이 기본 소스와 함께 컴파일됩니다.

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

기본적으로 kapt는 모든 어노테이션 프로세서를 실행하고 javac에 의한 어노테이션 처리를 비활성화합니다.
그러나 javac의 일부 어노테이션 프로세서(예: [Lombok](https://projectlombok.org/))를 작동시켜야 할 수도 있습니다.

Gradle 빌드 파일에서 `keepJavacAnnotationProcessors` 옵션을 사용합니다:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Maven을 사용하는 경우 구체적인 플러그인 설정을 지정해야 합니다.
[Lombok 컴파일러 플러그인에 대한 설정 예](lombok#using-with-kapt)를 참조하세요.
```