---
title: "Gradle 프로젝트 구성"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Gradle](https://docs.gradle.org/current/userguide/userguide.html)로 Kotlin 프로젝트를 빌드하려면 빌드 스크립트 파일인 `build.gradle(.kts)`에 [Kotlin Gradle plugin](#apply-the-plugin)을 추가하고 프로젝트의 [dependencies](#configure-dependencies)를 구성해야 합니다.

:::note
빌드 스크립트의 내용에 대해 더 자세히 알아보려면 [빌드 스크립트 살펴보기](get-started-with-jvm-gradle-project#explore-the-build-script) 섹션을 참조하세요.

:::

## Apply the plugin

Kotlin Gradle plugin을 적용하려면 Gradle plugins DSL에서 [`plugins{}` block](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)을 사용하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    // `<...>`를 대상 환경에 적합한 플러그인 이름으로 바꾸세요.
    kotlin("<...>") version "2.1.20"
    // 예를 들어 대상 환경이 JVM인 경우:
    // kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    // `<...>`를 대상 환경에 적합한 플러그인 이름으로 바꾸세요.
    id 'org.jetbrains.kotlin.<...>' version '2.1.20'
    // 예를 들어 대상 환경이 JVM인 경우: 
    // id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}
```

</TabItem>
</Tabs>

:::note
Kotlin Gradle plugin (KGP)과 Kotlin은 동일한 버전 번호를 공유합니다.

:::

프로젝트를 구성할 때 사용 가능한 Gradle 버전과의 Kotlin Gradle plugin (KGP) 호환성을 확인하세요.
다음 표에는 Gradle 및 Android Gradle plugin (AGP)의 최소 및 최대 **완전 지원** 버전이 나와 있습니다.

| KGP version   | Gradle min and max versions           | AGP min and max versions                            |
|---------------|---------------------------------------|-----------------------------------------------------|
| 2.1.20        | 7.6.3–8.11 | 7.3.1–8.7.2 |
| 2.1.0–2.1.10  | 7.6.3–8.10*                           | 7.3.1–8.7.2                                         |
| 2.0.20–2.0.21 | 6.8.3–8.8*                            | 7.1.3–8.5                                           |
| 2.0.0         | 6.8.3–8.5                             | 7.1.3–8.3.1                                         |
| 1.9.20–1.9.25 | 6.8.3–8.1.1                           | 4.2.2–8.1.0                                         |
| 1.9.0–1.9.10  | 6.8.3–7.6.0                           | 4.2.2–7.4.0                                         |
| 1.8.20–1.8.22 | 6.8.3–7.6.0                           | 4.1.3–7.4.0                                         |      
| 1.8.0–1.8.11  | 6.8.3–7.3.3                           | 4.1.3–7.2.1                                         |   
| 1.7.20–1.7.22 | 6.7.1–7.1.1                           | 3.6.4–7.0.4                                         |
| 1.7.0–1.7.10  | 6.7.1–7.0.2                           | 3.4.3–7.0.2                                         |
| 1.6.20–1.6.21 | 6.1.1–7.0.2                           | 3.4.3–7.0.2                                         |
:::note
*Kotlin 2.0.20–2.0.21 및 Kotlin 2.1.0–2.1.10은 Gradle 8.6까지 완벽하게 호환됩니다.
Gradle 버전 8.7–8.10도 지원되지만 한 가지 예외가 있습니다. Kotlin Multiplatform Gradle plugin을 사용하는 경우,
멀티플랫폼 프로젝트에서 JVM 대상에서 `withJava()` 함수를 호출할 때 더 이상 사용되지 않는다는 경고가 표시될 수 있습니다.
자세한 내용은 [기본적으로 생성되는 Java 소스 세트](multiplatform-compatibility-guide#java-source-sets-created-by-default)를 참조하세요.

최신 릴리스까지 Gradle 및 AGP 버전을 사용할 수도 있지만, 이 경우 더 이상 사용되지 않는다는 경고가 발생하거나 일부 새로운 기능이 작동하지 않을 수 있다는 점을 명심하세요.

예를 들어, Kotlin Gradle plugin과 `kotlin-multiplatform` plugin 2.1.20은 프로젝트를 컴파일하려면 최소 Gradle 버전 7.6.3이 필요합니다.

마찬가지로, 최대 완전 지원 버전은 8.11입니다. 더 이상 사용되지 않는 Gradle 메서드 및 속성이 없으며 현재의 모든 Gradle 기능을 지원합니다.

### Kotlin Gradle plugin data in a project

기본적으로 Kotlin Gradle plugin은 프로젝트 루트의 `.kotlin` 디렉터리에 영구적인 프로젝트별 데이터를 저장합니다.

`.kotlin` 디렉터리를 버전 관리에 커밋하지 마세요.
예를 들어 Git을 사용하는 경우 프로젝트의 `.gitignore` 파일에 `.kotlin`을 추가하세요.

프로젝트의 `gradle.properties` 파일에 이 동작을 구성하기 위해 추가할 수 있는 속성이 있습니다.

| Gradle property                                     | Description                                                                                                                                       |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 프로젝트 수준 데이터가 저장되는 위치를 구성합니다. 기본값: `<project-root-directory>/.kotlin`                                      |
| `kotlin.project.persistent.dir.gradle.disableWrite` | `.gradle` 디렉터리에 Kotlin 데이터를 쓰는 것을 비활성화할지 여부를 제어합니다 (구형 IDEA 버전과의 이전 버전 호환성을 위해). 기본값: false |

## Targeting the JVM

JVM을 대상으로 하려면 Kotlin JVM plugin을 적용하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "2.1.20"
}
```

</TabItem>
</Tabs>

`version`은 이 블록에서 리터럴이어야 하며 다른 빌드 스크립트에서 적용할 수 없습니다.

### Kotlin and Java sources

Kotlin 소스 및 Java 소스는 동일한 디렉터리에 저장하거나 다른 디렉터리에 배치할 수 있습니다.

기본 규칙은 다른 디렉터리를 사용하는 것입니다.

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

Java `.java` 파일을 `src/*/kotlin` 디렉터리에 저장하지 마세요. `.java` 파일은 컴파일되지 않습니다.

대신 `src/main/java`를 사용할 수 있습니다.

 

기본 규칙을 사용하지 않는 경우 해당 `sourceSets` 속성을 업데이트해야 합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</TabItem>
</Tabs>

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### Check for JVM target compatibility of related compile tasks

빌드 모듈에는 다음과 같은 관련 컴파일 작업이 있을 수 있습니다.
* `compileKotlin` and `compileJava`
* `compileTestKotlin` and `compileTestJava`

`main` 및 `test` 소스 세트 컴파일 작업은 관련이 없습니다.

:::

이러한 관련 작업의 경우 Kotlin Gradle plugin은 JVM 대상 호환성을 확인합니다. `kotlin` extension 또는 작업의 [`jvmTarget` attribute](gradle-compiler-options#attributes-specific-to-jvm) 및 `java` extension 또는 작업의 [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)의 서로 다른 값은 JVM 대상 비호환성을 유발합니다. 예를 들어:
`compileKotlin` 작업은 `jvmTarget=1.8`이고,
`compileJava` 작업은 `targetCompatibility=15`를 갖습니다 ([상속](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)).

`build.gradle(.kts)` 파일에서 `kotlin.jvm.target.validation.mode` 속성을 설정하여 전체 프로젝트에 대한 이 검사의 동작을 구성합니다.

* `error` – plugin은 빌드를 실패합니다. Gradle 8.0+의 프로젝트에 대한 기본값입니다.
* `warning` – plugin은 경고 메시지를 출력합니다. Gradle 8.0 미만의 프로젝트에 대한 기본값입니다.
* `ignore` – plugin은 검사를 건너뛰고 메시지를 생성하지 않습니다.

`build.gradle(.kts)` 파일의 작업 수준에서 구성할 수도 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>().configureEach {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</TabItem>
</Tabs>

JVM 대상 비호환성을 방지하려면 [toolchain](#gradle-java-toolchains-support)을 구성하거나 JVM 버전을 수동으로 정렬하세요.

#### What can go wrong if targets are incompatible 

Kotlin 및 Java 소스 세트에 대해 JVM 대상을 수동으로 설정하는 방법에는 두 가지가 있습니다.
* [Java toolchain 설정](#gradle-java-toolchains-support)을 통한 암시적 방법.
* `kotlin` extension 또는 작업의 `jvmTarget` attribute 및 `java` extension 또는 작업의 `targetCompatibility`를 통한 명시적 방법.

다음과 같은 경우 JVM 대상 비호환성이 발생합니다.
* `jvmTarget` 및 `targetCompatibility`의 다른 값을 명시적으로 설정합니다.
* 기본 구성이 있고 JDK가 `1.8`과 같지 않습니다.

빌드 스크립트에 Kotlin JVM plugin만 있고 JVM 대상에 대한 추가 설정이 없는 경우 JVM 대상의 기본 구성을 고려해 보겠습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "2.1.20"
}
```

</TabItem>
</Tabs>

빌드 스크립트에 `jvmTarget` 값에 대한 명시적 정보가 없으면 기본값은 `null`이며 컴파일러는 이를 기본값 `1.8`로 변환합니다. `targetCompatibility`는 현재 Gradle의 JDK 버전과 동일하며, 이는 [Java toolchain 접근 방식](gradle-configure-project#gradle-java-toolchains-support)을 사용하지 않는 한 JDK 버전과 같습니다. JDK 버전이 `17`이라고 가정하면, 게시된 라이브러리 아티팩트는 JDK 17+와 [호환된다고 선언](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)합니다. `org.gradle.jvm.version=17`, 이는 잘못되었습니다.
이 경우 바이트코드 버전이 `1.8`이더라도 이 라이브러리를 추가하려면 주 프로젝트에서 Java 17을 사용해야 합니다. 이 문제를 해결하려면 [toolchain을 구성하세요](gradle-configure-project#gradle-java-toolchains-support).

### Gradle Java toolchains support

:::note
Android 사용자에 대한 경고입니다. Gradle toolchain 지원을 사용하려면 Android Gradle plugin (AGP) 버전 8.1.0-alpha09 이상을 사용하세요.

Gradle Java toolchain 지원은 AGP 7.4.0부터 [사용 가능합니다](https://issuetracker.google.com/issues/194113162).
그럼에도 불구하고 [이 문제](https://issuetracker.google.com/issues/260059413) 때문에 AGP는 버전 8.1.0-alpha09까지 toolchain의 JDK와 같도록 `targetCompatibility`를 설정하지 않았습니다.
8.1.0-alpha09보다 낮은 버전을 사용하는 경우 `compileOptions`를 통해 `targetCompatibility`를 수동으로 구성해야 합니다.
자리 표시자 `<MAJOR_JDK_VERSION>`을 사용하려는 JDK 버전으로 바꾸세요.

```kotlin
android {
    compileOptions {
        sourceCompatibility = <MAJOR_JDK_VERSION>
        targetCompatibility = <MAJOR_JDK_VERSION>
    }
}
```

 

Gradle 6.7은 [Java toolchains 지원](https://docs.gradle.org/current/userguide/toolchains.html)을 도입했습니다.
이 기능을 사용하면 다음을 수행할 수 있습니다.
* 컴파일, 테스트 및 실행 파일을 실행하기 위해 Gradle의 JDK 및 JRE와 다른 JDK 및 JRE를 사용합니다.
* 아직 릴리스되지 않은 언어 버전으로 코드를 컴파일하고 테스트합니다.

Toolchains 지원을 통해 Gradle은 로컬 JDK를 자동 감지하고 Gradle이 빌드에 필요한 누락된 JDK를 설치할 수 있습니다.
이제 Gradle 자체는 모든 JDK에서 실행할 수 있으며 주요 JDK 버전에 종속된 작업에 대해 [원격 빌드 캐시 기능](gradle-compilation-and-caches#gradle-build-cache-support)을 계속 재사용할 수 있습니다.

Kotlin Gradle plugin은 Kotlin/JVM 컴파일 작업에 대한 Java toolchains를 지원합니다. JS 및 Native 작업은 toolchains를 사용하지 않습니다.
Kotlin 컴파일러는 항상 Gradle 데몬이 실행 중인 JDK에서 실행됩니다.
Java toolchain:
* JVM 대상에 사용할 수 있는 [`-jdk-home` 옵션](compiler-reference#jdk-home-path)을 설정합니다.
* 사용자가 `jvmTarget` 옵션을 명시적으로 설정하지 않으면 [`compilerOptions.jvmTarget`](gradle-compiler-options#attributes-specific-to-jvm)을 toolchain의 JDK 버전으로 설정합니다.
  사용자가 toolchain을 구성하지 않으면 `jvmTarget` 필드는 기본값을 사용합니다.
  [JVM 대상 호환성](#check-for-jvm-target-compatibility-of-related-compile-tasks)에 대해 자세히 알아보세요.
* 모든 Java 컴파일, 테스트 및 javadoc 작업에서 사용할 toolchain을 설정합니다.
* [`kapt` workers](kapt#run-kapt-tasks-in-parallel)가 실행되는 JDK에 영향을 줍니다.

다음 코드를 사용하여 toolchain을 설정합니다. 자리 표시자 `<MAJOR_JDK_VERSION>`을 사용하려는 JDK 버전으로 바꾸세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(17)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvmToolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(17)
}
```

</TabItem>
</Tabs>

`kotlin` extension을 통해 toolchain을 설정하면 Java 컴파일 작업에 대한 toolchain도 업데이트됩니다.

`java` extension을 통해 toolchain을 설정할 수 있으며, Kotlin 컴파일 작업에서 이를 사용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) 
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

</TabItem>
</Tabs>

Gradle 8.0.2 이상을 사용하는 경우 [toolchain resolver plugin](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)도 추가해야 합니다.
이러한 유형의 plugin은 toolchain을 다운로드할 리포지토리를 관리합니다. 예를 들어 `settings.gradle(.kts)`에 다음 plugin을 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("0.9.0")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '0.9.0'
}
```

</TabItem>
</Tabs>

`foojay-resolver-convention` 버전이 [Gradle 사이트](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)의 Gradle 버전과 일치하는지 확인하세요.

Gradle이 사용하는 toolchain을 이해하려면 [로그 수준 `--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)으로 Gradle 빌드를 실행하고
`[KOTLIN] Kotlin compilation 'jdkHome' argument:`로 시작하는 출력을 찾습니다.
콜론 뒤의 부분은 toolchain의 JDK 버전입니다.

:::

특정 작업에 대해 모든 JDK (로컬 포함)를 설정하려면 [Task DSL](#set-jdk-version-with-the-task-dsl)을 사용하세요.

[Kotlin plugin의 Gradle JVM toolchain 지원](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/)에 대해 자세히 알아보세요.

### Set JDK version with the Task DSL

Task DSL을 사용하면 `UsesKotlinJavaToolchain` 인터페이스를 구현하는 모든 작업에 대해 모든 JDK 버전을 설정할 수 있습니다.
현재 이러한 작업은 `KotlinCompile` 및 `KaptTask`입니다.
Gradle이 주요 JDK 버전을 검색하도록 하려면 빌드 스크립트에서 `<MAJOR_JDK_VERSION>` 자리 표시자를 바꾸세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
}
tasks.withType(UsesKotlinJavaToolchain::class).configureEach { task `->`
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</TabItem>
</Tabs>

또는 로컬 JDK에 대한 경로를 지정하고 자리 표시자 `<LOCAL_JDK_VERSION>`을 이 JDK 버전으로 바꿀 수 있습니다.

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // Put a path to your JDK
        JavaVersion.<LOCAL_JDK_VERSION> // For example, JavaVersion.17
    )
}
```

### Associate compiler tasks

컴파일을 _연결_하려면 한 컴파일이 다른 컴파일의 컴파일된 출력을 사용하도록 컴파일 간에 관계를 설정하세요. 컴파일을 연결하면 컴파일 간에 `internal` 가시성이 설정됩니다.

Kotlin 컴파일러는 각 대상의 `test` 및 `main` 컴파일과 같이 일부 컴파일을 기본적으로 연결합니다.
사용자 지정 컴파일 중 하나가 다른 컴파일에 연결되어 있음을 표현해야 하는 경우 자체 연결된 컴파일을 만드세요.

소스 세트 간의 가시성을 추론하기 위해 IDE가 연결된 컴파일을 지원하도록 하려면 `build.gradle(.kts)`에 다음 코드를 추가하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
val integrationTestCompilation = kotlin.target.compilations.create("integrationTest") {
    associateWith(kotlin.target.compilations.getByName("main"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
integrationTestCompilation {
    kotlin.target.compilations.create("integrationTest") {
        associateWith(kotlin.target.compilations.getByName("main"))
    }
}
```

</TabItem>
</Tabs>

여기서 `integrationTest` 컴파일은 기능 테스트에서 `internal` 객체에 대한 액세스를 제공하는 `main` 컴파일과 연결됩니다.

### Configure with Java Modules (JPMS) enabled

Kotlin Gradle plugin이 [Java Modules](https://www.oracle.com/corporate/features/understanding-java-9-modules.html)와 함께 작동하도록 하려면 빌드 스크립트에 다음 줄을 추가하고 `YOUR_MODULE_NAME`을 JPMS 모듈에 대한 참조 (예: `org.company.module`)로 바꾸세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>
        
```kotlin
// Add the following three lines if you use a Gradle version less than 7.0
java {
    modularity.inferModulePath.set(true)
}

tasks.named("compileJava", JavaCompile::class.java) {
    options.compilerArgumentProviders.add(CommandLineArgumentProvider {
        // Provide compiled Kotlin classes to javac – needed for Java/Kotlin mixed sources to work
        listOf("--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}")
    })
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// Add the following three lines if you use a Gradle version less than 7.0
java {
    modularity.inferModulePath = true
}

tasks.named("compileJava", JavaCompile.class) {
    options.compilerArgumentProviders.add(new CommandLineArgumentProvider() {
        @Override
        Iterable<String> asArguments() {
            // Provide compiled Kotlin classes to javac – needed for Java/Kotlin mixed sources to work
            return ["--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}"]
        }
    })
}
```

</TabItem>
</Tabs>

:::note
`module-info.java`를 평소처럼 `src/main/java` 디렉터리에 넣으세요.

모듈의 경우 Kotlin 파일의 패키지 이름은 "패키지가 비어 있거나 존재하지 않음" 빌드 실패를 방지하기 위해 `module-info.java`의 패키지 이름과 같아야 합니다.

:::

자세히 알아보세요.
* [Java 모듈 시스템용 모듈 빌드](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [Java 모듈 시스템을 사용하여 애플리케이션 빌드](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* [Kotlin에서 "모듈"이 의미하는 것](visibility-modifiers#modules)

### Other details

[Kotlin/JVM](jvm-get-started)에 대해 자세히 알아보세요.

#### Disable use of artifact in compilation task

드문 시나리오에서는 순환 종속성 오류로 인해 빌드 실패가 발생할 수 있습니다. 예를 들어, 한 컴파일이 다른 컴파일의 모든 내부 선언을 볼 수 있고 생성된 아티팩트가 두 컴파일 작업의 출력에 의존하는 여러 컴파일이 있는 경우:

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

이 순환 종속성 오류를 수정하기 위해 Gradle 속성 `archivesTaskOutputAsFriendModule`을 추가했습니다.
이 속성은 컴파일 작업에서 아티팩트 입력의 사용을 제어하고 결과적으로 작업 종속성이 생성되는지 여부를 결정합니다.

기본적으로 이 속성은 작업 종속성을 추적하기 위해 `true`로 설정됩니다. 순환 종속성 오류가 발생하는 경우
컴파일 작업에서 아티팩트 사용을 비활성화하여 작업 종속성을 제거하고 순환을 방지할 수 있습니다.
종속성 오류.

컴파일 작업에서 아티팩트 사용을 비활성화하려면 `gradle.properties` 파일에 다음을 추가하세요.

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

#### Lazy Kotlin/JVM task creation

Kotlin 1.8.20부터 Kotlin Gradle plugin은 모든 작업을 등록하고 드라이 런 시에는 작업을 구성하지 않습니다.

#### Non-default location of compile tasks' destinationDirectory

Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 작업의 `destinationDirectory` 위치를 재정의하는 경우 빌드 스크립트를 업데이트하세요. JAR 파일에서 `sourceSets.main.kotlin.classesDirectories`를 `sourceSets.main.outputs`에 명시적으로 추가해야 합니다.

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## Targeting multiple platforms

[multiplatform projects](multiplatform-intro)라고 하는 [여러 플랫폼](multiplatform-dsl-reference#targets)을 대상으로 하는 프로젝트에는 `kotlin-multiplatform` plugin이 필요합니다.

:::note
`kotlin-multiplatform` plugin은 Gradle 7.6.3 이상에서 작동합니다.

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

[다양한 플랫폼에 대한 Kotlin Multiplatform](multiplatform-intro) 및
[iOS 및 Android용 Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html)에 대해 자세히 알아보세요.

## Targeting Android

Android 애플리케이션을 만드는 데 Android Studio를 사용하는 것이 좋습니다. [Android Gradle plugin을 사용하는 방법 알아보기](https://developer.android.com/studio/releases/gradle-plugin).

## Targeting JavaScript

JavaScript를 대상으로 하는 경우 `kotlin-multiplatform` plugin도 사용하세요. [Kotlin/JS 프로젝트 설정에 대해 자세히 알아보기](js-project-setup)

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

### Kotlin and Java sources for JavaScript

이 plugin은 Kotlin 파일에만 작동하므로 Kotlin 파일과 Java 파일을 분리하는 것이 좋습니다 (프로젝트에 Java 파일이 포함된 경우). 분리하여 저장하지 않는 경우 `sourceSets{}` 블록에서 소스 폴더를 지정하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("src/main/myKotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</TabItem>
</Tabs>

## Triggering configuration actions with the KotlinBasePlugin interface

Kotlin Gradle plugin (JVM, JS, Multiplatform, Native 등)이 적용될 때마다 일부 구성 작업을 트리거하려면 모든 Kotlin plugin이 상속하는 `KotlinBasePlugin` 인터페이스를 사용하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
    // Configure your action here
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
    // Configure your action here
}
```

</TabItem>
</Tabs>

## Configure dependencies

라이브러리에 대한 종속성을 추가하려면 소스 세트 DSL의 `dependencies{}` 블록에서 필요한 [유형](#dependency-types) (예: `implementation`)의 종속성을 설정하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</TabItem>
</Tabs>

또는 [최상위 수준에서 종속성을 설정](#set-dependencies-at-top-level)할 수 있습니다.

### Dependency types

요구 사항에 따라 종속성 유형을 선택하세요.
<table>
<tr>
        <th>Type</th>
        <th>Description</th>
        <th>When to use</th>
</tr>
<tr>
<td>
`api`
</td>
<td>
컴파일 및 런타임 모두에서 사용되며 라이브러리 소비자에게 내보내집니다.
</td>
<td>
종속성의 모든 유형이 현재 모듈의 공용 API에서 사용되는 경우 `api` 종속성을 사용합니다.
</td>
</tr>
<tr>
<td>
`implementation`
</td>
<td>
현재 모듈에 대한 컴파일 및 런타임 중에 사용되지만 `implementation` 종속성이 있는 모듈에 따라 달라지는 다른 모듈의 컴파일에는 노출되지 않습니다.
</td>
<td>

<p>
   모듈의 내부 로직에 필요한 종속성에 사용합니다.
</p>
<p>
   모듈이 게시되지 않은 엔드포인트 애플리케이션인 경우 `api` 종속성 대신 `implementation` 종속성을 사용합니다.
</p>
</td>
</tr>
<tr>
<td>
`compileOnly`
</td>
<td>
현재 모듈의 컴파일에 사용되며 런타임 또는 다른 모듈의 컴파일 중에는 사용할 수 없습니다.
</td>
<td>
런타임에 사용할 수 있는 타사 구현이 있는 API에 사용합니다.
</td>
</tr>
<tr>
<td>
`runtimeOnly`
</td>
<td>
런타임에 사용할 수 있지만 모듈 컴파일 중에는 보이지 않습니다.
</td>
<td>
</td>
</tr>
</table>

### Dependency on the standard library

표준 라이브러리 (`stdlib`)에 대한 종속성은 각 소스 세트에 자동으로 추가됩니다. 사용되는 표준 라이브러리 버전은 Kotlin Gradle plugin의 버전과 동일합니다.

플랫폼별 소스 세트의 경우 해당 플랫폼별 라이브러리 변형이 사용되는 반면, 공통 표준
라이브러리가 나머지에 추가됩니다. Kotlin Gradle plugin은 Gradle 빌드 스크립트의 `compilerOptions.jvmTarget` [컴파일러 옵션](gradle-compiler-options)에 따라 적절한 JVM 표준 라이브러리를 선택합니다.

표준 라이브러리 종속성을 명시적으로 선언하는 경우 (예: 다른 버전이 필요한 경우) Kotlin Gradle
plugin은 이를 재정의하거나 두 번째 표준 라이브러리를 추가하지 않습니다.

표준 라이브러리가 전혀 필요하지 않은 경우 `gradle.properties` 파일에 다음 Gradle 속성을 추가할 수 있습니다.

```none
kotlin.stdlib.default.dependency=false
```

#### Versions alignment of transitive dependencies

Kotlin 표준 라이브러리 버전 1.9.20부터 Gradle은 표준 라이브러리에 포함된 메타데이터를 사용하여 전이적 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8` 종속성을 자동으로 정렬합니다.

예를 들어 1.8.0 – 1.9.10 사이의 Kotlin 표준 라이브러리 버전에 대한 종속성을 추가하는 경우: `implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`, Kotlin Gradle Plugin은 전이적 `kotlin-stdlib-jdk7` 및 `kotlin-stdlib-jdk8` 종속성에 대해 이 Kotlin