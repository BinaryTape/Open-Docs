---
title: "KSP 퀵스타트"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

빠른 시작을 위해 직접 processor를 만들거나 [샘플](https://github.com/google/ksp/tree/main/examples/playground)을 가져올 수 있습니다.

## processor 추가

processor를 추가하려면 KSP Gradle Plugin을 포함하고 processor에 대한 종속성을 추가해야 합니다.

1. KSP Gradle Plugin `com.google.devtools.ksp`를 `build.gradle(.kts)` 파일에 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.1.10-1.0.31"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'com.google.devtools.ksp' version '2.1.10-1.0.31'
}
```

</TabItem>
</Tabs>

2. processor에 대한 종속성을 추가합니다.
이 예제에서는 [Dagger](https://dagger.dev/dev-guide/ksp.html)를 사용합니다. 추가하려는 processor로 대체하십시오.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation("com.google.dagger:dagger-compiler:2.51.1")
    ksp("com.google.dagger:dagger-compiler:2.51.1")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation 'com.google.dagger:dagger-compiler:2.51.1'
    ksp 'com.google.dagger:dagger-compiler:2.51.1'
}
```

</TabItem>
</Tabs>

3. `./gradlew build`를 실행합니다. 생성된 코드는 `build/generated/ksp` 디렉토리에서 찾을 수 있습니다.

다음은 전체 예제입니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.1.10-1.0.31"
    kotlin("jvm")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation("com.google.dagger:dagger-compiler:2.51.1")
    ksp("com.google.dagger:dagger-compiler:2.51.1")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'com.google.devtools.ksp' version '2.1.10-1.0.31'
    id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:2.1.20'
    implementation 'com.google.dagger:dagger-compiler:2.51.1'
    ksp 'com.google.dagger:dagger-compiler:2.51.1'
}
```

</TabItem>
</Tabs>

## 자신만의 processor 만들기

1. 빈 gradle 프로젝트를 만듭니다.
2. 다른 프로젝트 모듈에서 사용할 루트 프로젝트에서 Kotlin 플러그인의 버전 `2.1.10`을 지정합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.10" apply false
}

buildscript {
    dependencies {
        classpath(kotlin("gradle-plugin", version = "2.1.10"))
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.jvm' version '2.1.10' apply false
}

buildscript {
    dependencies {
        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.10'
    }
}
```

</TabItem>
</Tabs>

3. processor를 호스팅하기 위한 모듈을 추가합니다.

4. 모듈의 빌드 스크립트에서 Kotlin 플러그인을 적용하고 `dependencies` 블록에 KSP API를 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.devtools.ksp:symbol-processing-api:2.1.10-1.0.31")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.google.devtools.ksp:symbol-processing-api:2.1.10-1.0.31'
}
```

</TabItem>
</Tabs>

5. [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)
   및 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)를 구현해야 합니다.
   `SymbolProcessorProvider`의 구현은 서비스를 로드하여 구현하는 `SymbolProcessor`를 인스턴스화합니다.
   다음 사항에 유의하십시오.
    * [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)를 구현하여 `SymbolProcessor`를 만듭니다.
      `SymbolProcessorProvider.create()`의 매개 변수를 통해 processor에 필요한 종속성(`CodeGenerator`, processor 옵션 등)을 전달합니다.
    * 기본 로직은 [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 메서드에 있어야 합니다.
    * `resolver.getSymbolsWithAnnotation()`을 사용하여 annotation의 정규화된 이름을 지정하여 처리하려는 기호를 가져옵니다.
    * KSP의 일반적인 사용 사례는 기호에 대해 작동하기 위해 사용자 지정 visitor(인터페이스 `com.google.devtools.ksp.symbol.KSVisitor`)를 구현하는 것입니다. 간단한 템플릿 visitor는 `com.google.devtools.ksp.symbol.KSDefaultVisitor`입니다.
    * `SymbolProcessorProvider` 및 `SymbolProcessor` 인터페이스의 샘플 구현은 다음 파일의 샘플 프로젝트를 참조하십시오.
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 자신만의 processor를 작성한 후 `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider`에 정규화된 이름을 포함하여 패키지에 processor provider를 등록합니다.

## 프로젝트에서 자신의 processor 사용

1. processor를 사용해 보려는 workload가 포함된 다른 모듈을 만듭니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
pluginManagement { 
    repositories { 
        gradlePluginPortal()
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
pluginManagement {
    repositories {
        gradlePluginPortal()
    }
}
 ```

</TabItem>
</Tabs>

2. 모듈의 빌드 스크립트에서 지정된 버전으로 `com.google.devtools.ksp` 플러그인을 적용하고
   processor를 종속성 목록에 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.1.10-1.0.31"
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation(project(":test-processor"))
    ksp(project(":test-processor"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'com.google.devtools.ksp' version '2.1.10-1.0.31'
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version'
    implementation project(':test-processor')
    ksp project(':test-processor')
}
```

</TabItem>
</Tabs>

3. `./gradlew build`를 실행합니다. 생성된 코드는
   `build/generated/ksp`에서 찾을 수 있습니다.

다음은 KSP 플러그인을 workload에 적용하기 위한 샘플 빌드 스크립트입니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.1.10-1.0.31"
    kotlin("jvm") 
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation(project(":test-processor"))
    ksp(project(":test-processor"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'com.google.devtools.ksp' version '2.1.10-1.0.31'
    id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:2.1.20'
    implementation project(':test-processor')
    ksp project(':test-processor')
}
```

</TabItem>
</Tabs>

## processor에 옵션 전달

`SymbolProcessorEnvironment.options`의 Processor 옵션은 gradle 빌드 스크립트에 지정됩니다.

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## IDE가 생성된 코드를 인식하도록 만들기

:::note
생성된 소스 파일은 KSP 1.8.0-1.0.9부터 자동으로 등록됩니다.
KSP 1.0.9 이상을 사용하고 있고 생성된 리소스를 IDE가 인식하도록 할 필요가 없는 경우
이 섹션을 건너뛰어도 됩니다.

:::

기본적으로 IntelliJ IDEA 또는 기타 IDE는 생성된 코드에 대해 알지 못합니다. 따라서 생성된 기호에 대한 참조를 해결할 수 없는 것으로 표시합니다. IDE가 생성된 기호에 대해 추론할 수 있도록 하려면
다음 경로를 생성된 소스 루트로 표시합니다.

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

IDE가 리소스 디렉토리를 지원하는 경우 다음 디렉토리도 표시합니다.

```text
build/generated/ksp/main/resources/
```

KSP 소비자 모듈의 빌드 스크립트에서 이러한 디렉토리를 구성해야 할 수도 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets.main {
        kotlin.srcDir("build/generated/ksp/main/kotlin")
    }
    sourceSets.test {
        kotlin.srcDir("build/generated/ksp/test/kotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'build/generated/ksp/main/kotlin'
        test.kotlin.srcDirs += 'build/generated/ksp/test/kotlin'
    }
}
```

</TabItem>
</Tabs>

Gradle 플러그인에서 IntelliJ IDEA 및 KSP를 사용하는 경우 위의 스니펫은 다음과 같은 경고를 표시합니다.
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

이 경우 다음 스크립트를 대신 사용하십시오.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    // ...
    idea
}

idea {
    module {
        // Not using += due to https://github.com/gradle/gradle/issues/8749
        sourceDirs = sourceDirs + file("build/generated/ksp/main/kotlin") // or tasks["kspKotlin"].destination
        testSourceDirs = testSourceDirs + file("build/generated/ksp/test/kotlin")
        generatedSourceDirs = generatedSourceDirs + file("build/generated/ksp/main/kotlin") + file("build/generated/ksp/test/kotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    // ...
    id 'idea'
}

idea {
    module {
        // Not using += due to https://github.com/gradle/gradle/issues/8749
        sourceDirs = sourceDirs + file('build/generated/ksp/main/kotlin') // or tasks["kspKotlin"].destination
        testSourceDirs = testSourceDirs + file('build/generated/ksp/test/kotlin')
        generatedSourceDirs = generatedSourceDirs + file('build/generated/ksp/main/kotlin') + file('build/generated/ksp/test/kotlin')
    }
}
```

</TabItem>
</Tabs>