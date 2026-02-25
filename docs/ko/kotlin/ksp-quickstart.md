[//]: # (title: KSP 퀵스타트)

빠른 시작을 위해 직접 프로세서를 만들거나 [샘플 프로세서](https://github.com/google/ksp/tree/main/examples/playground)를 가져올 수 있습니다.

## 프로세서 추가하기

프로세서를 추가하려면 KSP Gradle 플러그인을 포함하고 프로세서에 대한 의존성을 추가해야 합니다:

1. KSP Gradle 플러그인 `com.google.devtools.ksp`를 `build.gradle(.kts)` 파일에 추가합니다:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       id("com.google.devtools.ksp") version "%kspVersion%"
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id 'com.google.devtools.ksp' version '%kspVersion%'
   }
   ```
   
   </tab>
   </tabs>

2. 프로세서에 대한 의존성을 추가합니다.
이 예제에서는 [Dagger](https://dagger.dev/dev-guide/ksp.html)를 사용합니다. 이를 추가하려는 프로세서로 교체하세요.

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

3. `./gradlew build`를 실행합니다. 생성된 코드는 `build/generated/ksp` 디렉터리에서 확인할 수 있습니다.

전체 예제는 다음과 같습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%"
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
    id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%%'
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

## 직접 프로세서 만들기

1. 빈 Gradle 프로젝트를 생성합니다.
2. 다른 프로젝트 모듈에서 사용할 수 있도록 루트 프로젝트에 Kotlin 플러그인 버전 `%kspSupportedKotlinVersion%`을 지정합니다:

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
       implementation("com.google.devtools.ksp:symbol-processing-api:%kspVersion%")
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
       implementation 'com.google.devtools.ksp:symbol-processing-api:%kspVersion%'
   }
   ```
   
   </tab>
   </tabs>

5. [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)와 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)를 구현해야 합니다.
   구현한 `SymbolProcessorProvider`는 사용자가 구현한 `SymbolProcessor`를 인스턴스화하기 위한 서비스로 로드됩니다.
   다음 사항에 유의하세요:
    * `SymbolProcessor`를 생성하려면 [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)를 구현하세요. `SymbolProcessorProvider.create()`의 파라미터를 통해 프로세서에 필요한 의존성(`CodeGenerator`, 프로세서 옵션 등)을 전달합니다.
    * 주요 로직은 [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 메서드에 있어야 합니다.
    * 어노테이션의 정규화된 이름(fully-qualified name)이 주어졌을 때 처리하고자 하는 심볼을 가져오려면 `resolver.getSymbolsWithAnnotation()`을 사용하세요.
    * KSP의 일반적인 사용 사례는 심볼 작업을 위해 맞춤형 비지터(visitor, `com.google.devtools.ksp.symbol.KSVisitor` 인터페이스)를 구현하는 것입니다. 단순한 템플릿 비지터로 `com.google.devtools.ksp.symbol.KSDefaultVisitor`가 있습니다.
    * `SymbolProcessorProvider` 및 `SymbolProcessor` 인터페이스의 구현 샘플은 샘플 프로젝트의 다음 파일들을 참조하세요.
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 프로세서를 작성한 후, `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider`에 프로세서 프로바이더의 정규화된 이름을 포함하여 패키지에 등록하세요.

## 프로젝트에서 직접 만든 프로세서 사용하기

1. 프로세서를 테스트해 볼 워크로드가 포함된 다른 모듈을 생성합니다.

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

2. 모듈의 빌드 스크립트에서 지정된 버전의 `com.google.devtools.ksp` 플러그인을 적용하고 의존성 목록에 직접 만든 프로세서를 추가합니다.

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       id("com.google.devtools.ksp") version "%kspVersion%"
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
       id 'com.google.devtools.ksp' version '%kspVersion%'
   }
   
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%'
       implementation project(':test-processor')
       ksp project(':test-processor')
   }
   ```
   
   </tab>
   </tabs>

3. `./gradlew build`를 실행합니다. 생성된 코드는 `build/generated/ksp` 아래에서 확인할 수 있습니다.

다음은 워크로드에 KSP 플러그인을 적용하는 샘플 빌드 스크립트입니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%"
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
    id 'com.google.devtools.ksp' version '%kspVersion%'
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

## 프로세서에 옵션 전달하기

`SymbolProcessorEnvironment.options`의 프로세서 옵션은 Gradle 빌드 스크립트에서 지정합니다:

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## IDE가 생성된 코드를 인식하도록 설정하기

> 생성된 소스 파일은 KSP 1.8.0-1.0.9부터 자동으로 등록됩니다.
> KSP 1.0.9 이상 버전을 사용 중이고 생성된 리소스를 IDE에 인식시킬 필요가 없다면 이 섹션은 건너뛰어도 됩니다.
>
{style="note"}

기본적으로 IntelliJ IDEA 또는 다른 IDE는 생성된 코드를 인식하지 못합니다. 따라서 생성된 심볼에 대한 참조를 해결할 수 없는 것으로 표시합니다. IDE가 생성된 심볼을 분석할 수 있도록 다음 경로를 생성된 소스 루트(generated source roots)로 표시하세요:

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

IDE가 리소스 디렉터리를 지원하는 경우 다음 경로도 표시하세요:

```text
build/generated/ksp/main/resources/
```

또한 KSP 소비(consumer) 모듈의 빌드 스크립트에서 이러한 디렉터리를 구성해야 할 수도 있습니다:

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

IntelliJ IDEA를 사용 중이고 Gradle 플러그인 내에서 KSP를 사용하는 경우, 위 코드 조각은 다음과 같은 경고를 발생시킵니다:
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

이 경우 대신 다음 스크립트를 사용하세요:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // ...
    idea
}

idea {
    module {
        // https://github.com/gradle/gradle/issues/8749 로 인해 += 를 사용하지 않음
        sourceDirs = sourceDirs + file("build/generated/ksp/main/kotlin") // 또는 tasks["kspKotlin"].destination
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
        // https://github.com/gradle/gradle/issues/8749 로 인해 += 를 사용하지 않음
        sourceDirs = sourceDirs + file('build/generated/ksp/main/kotlin') // 또는 tasks["kspKotlin"].destination
        testSourceDirs = testSourceDirs + file('build/generated/ksp/test/kotlin')
        generatedSourceDirs = generatedSourceDirs + file('build/generated/ksp/main/kotlin') + file('build/generated/ksp/test/kotlin')
    }
}
```

</tab>
</tabs>