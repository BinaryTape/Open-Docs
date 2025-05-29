[//]: # (title: KSP 퀵스타트)

빠른 시작을 위해 자신만의 프로세서를 생성하거나 [샘플 프로세서](https://github.com/google/ksp/tree/main/examples/playground)를 얻을 수 있습니다.

## 프로세서 추가

프로세서를 추가하려면 KSP Gradle 플러그인을 포함하고 프로세서에 대한 의존성을 추가해야 합니다.

1. KSP Gradle 플러그인 `com.google.devtools.ksp`을 `build.gradle(.kts)` 파일에 추가합니다.

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
   }
   ```
   
   </tab>
   </tabs>

2. 프로세서에 대한 의존성을 추가합니다.
이 예제는 [Dagger](https://dagger.dev/dev-guide/ksp.html)를 사용합니다. 추가하려는 프로세서로 대체하십시오.

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   dependencies {
       implementation("com.google.dagger:dagger-compiler:2.51.1")
       ksp("com.google.dagger:dagger-compiler:2.51.1")
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   dependencies {
       implementation 'com.google.dagger:dagger-compiler:2.51.1'
       ksp 'com.google.dagger:dagger-compiler:2.51.1'
   }
   ```
   
   </tab>
   </tabs>

3. `./gradlew build`를 실행합니다. 생성된 코드는 `build/generated/ksp` 디렉터리에서 찾을 수 있습니다.

전체 예제는 다음과 같습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%'
    implementation 'com.google.dagger:dagger-compiler:2.51.1'
    ksp 'com.google.dagger:dagger-compiler:2.51.1'
}
```

</tab>
</tabs>

## 자신만의 프로세서 생성

1. 빈 Gradle 프로젝트를 생성합니다.
2. 다른 프로젝트 모듈에서 사용하기 위해 루트 프로젝트에 Kotlin 플러그인의 `%kspSupportedKotlinVersion%` 버전을 지정합니다.

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       kotlin("jvm") version "%kspSupportedKotlinVersion%" apply false
   }
   
   buildscript {
       dependencies {
           classpath(kotlin("gradle-plugin", version = "%kspSupportedKotlinVersion%"))
       }
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id 'org.jetbrains.kotlin.jvm' version '%kspSupportedKotlinVersion%' apply false
   }
   
   buildscript {
       dependencies {
           classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:%kspSupportedKotlinVersion%'
       }
   }
   ```
   
   </tab>
   </tabs>

3. 프로세서를 호스팅할 모듈을 추가합니다.

4. 모듈의 빌드 스크립트에서 Kotlin 플러그인을 적용하고 `dependencies` 블록에 KSP API를 추가합니다.

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       kotlin("jvm")
   }
   
   repositories {
       mavenCentral()
   }
   
   dependencies {
       implementation("com.google.devtools.ksp:symbol-processing-api:%kspSupportedKotlinVersion%-%kspVersion%")
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
   }
   
   repositories {
       mavenCentral()
   }
   
   dependencies {
       implementation 'com.google.devtools.ksp:symbol-processing-api:%kspSupportedKotlinVersion%-%kspVersion%'
   }
   ```
   
   </tab>
   </tabs>

5. [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)와 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)를 구현해야 합니다.
구현한 `SymbolProcessorProvider`는 서비스로 로드되어 구현한 `SymbolProcessor`를 인스턴스화합니다.
다음 사항에 유의하십시오.
    * `SymbolProcessor`를 생성하기 위해 [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)를 구현합니다. 프로세서에 필요한 의존성(예: `CodeGenerator`, 프로세서 옵션)을 `SymbolProcessorProvider.create()`의 매개변수를 통해 전달합니다.
    * 주요 로직은 [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 메서드에 있어야 합니다.
    * 주석의 완전한 정규화된 이름을 지정하여 처리하려는 심볼을 가져오려면 `resolver.getSymbolsWithAnnotation()`을 사용합니다.
    * KSP의 일반적인 사용 사례는 심볼에서 작업을 수행하기 위해 커스터마이징된 방문자(인터페이스 `com.google.devtools.ksp.symbol.KSVisitor`)를 구현하는 것입니다. 간단한 템플릿 방문자는 `com.google.devtools.ksp.symbol.KSDefaultVisitor`입니다.
    * `SymbolProcessorProvider` 및 `SymbolProcessor` 인터페이스의 샘플 구현은 샘플 프로젝트의 다음 파일을 참조하십시오.
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 자신만의 프로세서를 작성한 후, 해당 완전한 정규화된 이름을 `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider`에 포함하여 프로세서 프로바이더를 패키지에 등록합니다.

## 프로젝트에서 자신만의 프로세서 사용

1. 프로세서를 시험해 볼 워크로드를 포함하는 다른 모듈을 생성합니다.

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   pluginManagement { 
       repositories { 
           gradlePluginPortal()
       }
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   pluginManagement {
       repositories {
           gradlePluginPortal()
       }
   }
    ```
   
   </tab>
   </tabs>

2. 모듈의 빌드 스크립트에서 지정된 버전으로 `com.google.devtools.ksp` 플러그인을 적용하고 의존성 목록에 프로세서를 추가합니다.

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
   }
   
   dependencies {
       implementation(kotlin("stdlib-jdk8"))
       implementation(project(":test-processor"))
       ksp(project(":test-processor"))
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
   }
   
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%'
       implementation project(':test-processor')
       ksp project(':test-processor')
   }
   ```
   
   </tab>
   </tabs>

3. `./gradlew build`를 실행합니다. 생성된 코드는 `build/generated/ksp`에서 찾을 수 있습니다.

워크로드에 KSP 플러그인을 적용하는 샘플 빌드 스크립트는 다음과 같습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%'
    implementation project(':test-processor')
    ksp project(':test-processor')
}
```

</tab>
</tabs>

## 프로세서에 옵션 전달

`SymbolProcessorEnvironment.options`의 프로세서 옵션은 Gradle 빌드 스크립트에 지정됩니다.

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## IDE가 생성된 코드를 인식하도록 하기

> KSP 1.8.0-1.0.9부터 생성된 소스 파일은 자동으로 등록됩니다.
> KSP 1.0.9 이상 버전을 사용하고 있고 IDE가 생성된 리소스를 인식할 필요가 없는 경우,
> 이 섹션을 건너뛰셔도 좋습니다.
>
{style="note"}

기본적으로 IntelliJ IDEA 또는 다른 IDE는 생성된 코드를 알지 못합니다. 따라서 생성된 심볼에 대한 참조를 확인할 수 없는 것으로 표시할 것입니다. IDE가 생성된 심볼을 추론할 수 있도록 하려면 다음 경로를 생성된 소스 루트로 표시하십시오.

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

IDE가 리소스 디렉터리를 지원하는 경우 다음 경로도 표시하십시오.

```text
build/generated/ksp/main/resources/
```

KSP 소비자 모듈의 빌드 스크립트에서 이 디렉터리들을 구성해야 할 수도 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'build/generated/ksp/main/kotlin'
        test.kotlin.srcDirs += 'build/generated/ksp/test/kotlin'
    }
}
```

</tab>
</tabs>

Gradle 플러그인에서 IntelliJ IDEA와 KSP를 사용하는 경우 위의 스니펫은 다음 경고를 발생시킬 것입니다.
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

이 경우 다음 스크립트를 대신 사용하십시오.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>