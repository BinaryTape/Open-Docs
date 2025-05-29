[//]: # (title: Kotlin Gradle 플러그인의 컴파일러 옵션)

각 Kotlin 릴리스에는 지원되는 타겟을 위한 컴파일러가 포함되어 있습니다.
JVM, JavaScript, 그리고 [지원되는 플랫폼](native-overview.md#target-platforms)을 위한 네이티브 바이너리.

이 컴파일러는 다음 경우에 사용됩니다:
*   Kotlin 프로젝트에서 __Compile__ 또는 __Run__ 버튼을 클릭할 때 IDE.
*   콘솔 또는 IDE에서 `gradle build`를 호출할 때 Gradle.
*   콘솔 또는 IDE에서 `mvn compile` 또는 `mvn test-compile`을 호출할 때 Maven.

또한 [명령줄 컴파일러 작업](command-line.md) 튜토리얼에 설명된 대로
명령줄에서 Kotlin 컴파일러를 수동으로 실행할 수도 있습니다.

## 옵션 정의 방법

Kotlin 컴파일러는 컴파일 프로세스를 조정하기 위한 다양한 옵션을 제공합니다.

Gradle DSL은 컴파일러 옵션에 대한 포괄적인
구성을 허용합니다. 이는 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) 및 [JVM/Android](#target-the-jvm) 프로젝트에서 사용할 수 있습니다.

Gradle DSL을 사용하면 빌드 스크립트 내에서 세 가지 수준에서 컴파일러 옵션을 구성할 수 있습니다:
*   **[확장 수준 (Extension level)](#extension-level)**: 모든 타겟과 공유 소스 세트에 대한 `kotlin {}` 블록 내에서.
*   **[타겟 수준 (Target level)](#target-level)**: 특정 타겟을 위한 블록 내에서.
*   **[컴파일 단위 수준 (Compilation unit level)](#compilation-unit-level)**: 일반적으로 특정 컴파일 작업에서.

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

상위 수준의 설정은 하위 수준의 규칙(기본값)으로 사용됩니다:

*   확장 수준에서 설정된 컴파일러 옵션은 `commonMain`, `nativeMain`, `commonTest`와 같은 공유 소스 세트를 포함하여 타겟 수준 옵션의 기본값입니다.
*   타겟 수준에서 설정된 컴파일러 옵션은 `compileKotlinJvm` 및 `compileTestKotlinJvm` 작업과 같은 컴파일 단위(작업) 수준 옵션의 기본값입니다.

이와 반대로, 하위 수준에서 이루어진 구성은 상위 수준의 관련 설정을 재정의합니다:

*   작업(Task) 수준 컴파일러 옵션은 타겟 또는 확장 수준의 관련 구성을 재정의합니다.
*   타겟(Target) 수준 컴파일러 옵션은 확장 수준의 관련 구성을 재정의합니다.

컴파일에 어떤 수준의 컴파일러 인수가 적용되는지 알아보려면 Gradle [로깅](https://docs.gradle.org/current/userguide/logging.html)의 `DEBUG` 수준을 사용하세요.
JVM 및 JS/WASM 작업의 경우 로그 내에서 `"Kotlin compiler args:"` 문자열을 검색하고, 네이티브 작업의 경우
`"Arguments ="` 문자열을 검색합니다.

> 타사 플러그인 작성자인 경우, 재정의 문제를 피하기 위해 프로젝트 수준에서 구성을 적용하는 것이 가장 좋습니다.
> 이를 위해 새로운 [Kotlin 플러그인 DSL 확장 유형](whatsnew21.md#new-api-for-kotlin-gradle-plugin-extensions)을 사용할 수 있습니다. 이 구성을 명시적으로 문서화하는 것이 좋습니다.
>
{style="tip"}

### 확장 수준

최상위의 `compilerOptions {}` 블록에서 모든 타겟 및 공유 소스 세트에 대한 공통 컴파일러 옵션을 구성할 수 있습니다:

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### 타겟 수준

`target {}` 블록 내의 `compilerOptions {}` 블록에서 JVM/Android 타겟에 대한 컴파일러 옵션을 구성할 수 있습니다:

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

Kotlin Multiplatform 프로젝트에서는 특정 타겟 내에서 컴파일러 옵션을 구성할 수 있습니다. 예를 들어, `jvm { compilerOptions {}}`와 같습니다. 자세한 내용은 [Multiplatform Gradle DSL 참조](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)를 참조하세요.

### 컴파일 단위 수준

`compilerOptions {}` 블록에서 특정 컴파일 단위 또는 작업에 대한 컴파일러 옵션을 구성할 수 있습니다.
작업 구성 내에서:

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

`KotlinCompilation`을 통해 컴파일 단위 수준에서 컴파일러 옵션에 액세스하고 구성할 수도 있습니다:

```Kotlin
kotlin {
    target {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {

                }
            }
        }
    }
}
```

JVM/Android 및 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)와 다른 타겟의 플러그인을 구성하려는 경우,
해당 Kotlin 컴파일 작업의 `compilerOptions {}` 속성을 사용하세요. 다음 예시는
Kotlin 및 Groovy DSL 모두에서 이 구성을 설정하는 방법을 보여줍니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
</tabs>

## JVM 타겟팅

[이전에 설명했듯이](#how-to-define-options), JVM/Android 프로젝트에 대한 컴파일러 옵션을 확장, 타겟 및 컴파일 단위 수준(작업)에서 정의할 수 있습니다.

기본 JVM 컴파일 작업은 프로덕션 코드의 경우 `compileKotlin`, 테스트 코드의 경우 `compileTestKotlin`입니다.
사용자 지정 소스 세트의 작업은 `compile<Name>Kotlin` 패턴에 따라 명명됩니다.

터미널에서 `gradlew tasks --all` 명령을 실행하여 `Other tasks` 그룹에서 `compile*Kotlin` 작업 이름을 검색하면 Android 컴파일 작업 목록을 볼 수 있습니다.

알아두어야 할 몇 가지 중요한 세부 사항:

*   `android.kotlinOptions` 및 `kotlin.compilerOptions` 구성 블록은 서로를 재정의합니다. 가장 마지막(하위) 블록이 적용됩니다.
*   `kotlin.compilerOptions`는 프로젝트의 모든 Kotlin 컴파일 작업을 구성합니다.
*   `kotlin.compilerOptions` DSL에 의해 적용된 구성을 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`
    (또는 `tasks.withType<KotlinJvmCompile>().configureEach { }`) 접근 방식을 사용하여 재정의할 수 있습니다.

## JavaScript 타겟팅

JavaScript 컴파일 작업은 프로덕션 코드의 경우 `compileKotlinJs`, 테스트 코드의 경우 `compileTestKotlinJs`, 사용자 지정 소스 세트의 경우 `compile<Name>KotlinJs`로 불립니다.

단일 작업을 구성하려면 해당 이름을 사용하세요:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings = true
    }
}
```

</tab>
</tabs>

Gradle Kotlin DSL을 사용하는 경우 프로젝트의 `tasks`에서 먼저 작업을 가져와야 합니다.

JS 및 공통 타겟의 경우 각각 `Kotlin2JsCompile` 및 `KotlinCompileCommon` 유형을 사용하세요.

터미널에서 `gradlew tasks --all` 명령을 실행하여 `Other tasks` 그룹에서 `compile*KotlinJS` 작업 이름을 검색하면 JavaScript 컴파일 작업 목록을 볼 수 있습니다.

## 모든 Kotlin 컴파일 작업

프로젝트의 모든 Kotlin 컴파일 작업을 구성하는 것도 가능합니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</tab>
</tabs>

## 모든 컴파일러 옵션

Gradle 컴파일러에 대한 옵션 전체 목록은 다음과 같습니다:

### 공통 속성

| Name              | Description                                                                                                                              | Possible values           | Default value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | [opt-in 컴파일러 인수](opt-in-requirements.md) 목록을 구성하기 위한 속성입니다.                                                                       | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | [점진적 컴파일러 모드](whatsnew13.md#progressive-mode)를 활성화합니다.                                                                                             | `true`, `false`           | `false`       |
| `extraWarnings`   | true일 경우 경고를 발생시키는 [추가 선언, 표현식 및 유형 컴파일러 검사](whatsnew21.md#extra-compiler-checks)를 활성화합니다. | `true`, `false`           | `false`       |

### JVM에 특화된 속성

| Name                      | Description                                                                                                                                                                                                                                   | Possible values                                                                                         | Default value               |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | 메서드 매개변수에 대한 Java 1.8 리플렉션용 메타데이터를 생성합니다.                                                                                                                                                                                                                                                                    |                                                                                                         | false                       |
| `jvmTarget`               | 생성된 JVM 바이트코드의 대상 버전입니다.                                                                                                                                                                                                  | "1.8", "9", "10", ...,  "22", "23". 또한, [컴파일러 옵션 유형](#types-for-compiler-options)을 참조하세요. | "%defaultJvmTargetVersion%" |
| `noJdk`                   | 클래스패스에 Java 런타임을 자동으로 포함하지 않습니다.                                                                                                                                                                                                                                                            |                                                                                                         | false                       |
| `jvmTargetValidationMode` | <list><li>Kotlin과 Java 간의 [JVM 타겟 호환성](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks) 유효성 검사</li><li>`KotlinCompile` 유형의 작업에 대한 속성입니다.</li></list> | `WARNING`, `ERROR`, `IGNORE`                                                                              | `ERROR`                     |

### JVM 및 JavaScript에 공통적인 속성

| Name | Description | Possible values |Default value |
|------|-------------|----------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | 경고가 하나라도 있으면 오류로 보고합니다. | | false |
| `suppressWarnings` | 경고를 생성하지 않습니다. | | false |
| `verbose` | 상세 로깅 출력을 활성화합니다. [Gradle 디버그 로그 수준이 활성화된](https://docs.gradle.org/current/userguide/logging.html) 경우에만 작동합니다. | | false |
| `freeCompilerArgs` | 추가 컴파일러 인수 목록입니다. 여기에 실험적인 `-X` 인수도 사용할 수 있습니다. [추가 인수 `freeCompilerArgs` 사용 예시](#example-of-additional-arguments-usage-via-freecompilerargs)를 참조하세요. | | [] |
| `apiVersion`      | 번들 라이브러리에서 지정된 버전의 선언만 사용하도록 제한합니다. | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |               |
| `languageVersion` | 지정된 Kotlin 버전과의 소스 호환성을 제공합니다. | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL)  |               |

> `freeCompilerArgs` 속성은 향후 릴리스에서 사용 중단될 예정입니다. Kotlin Gradle DSL에 누락된 옵션이 있다면,
> [이슈를 제출](https://youtrack.jetbrains.com/newissue?project=kt)해 주시기 바랍니다.
>
{style="warning"}

#### `freeCompilerArgs`를 통한 추가 인수 사용 예시 {initial-collapse-state="collapsed" collapsible="true"}

`freeCompilerArgs` 속성을 사용하여 추가 (실험적인 포함) 컴파일러 인수를 제공할 수 있습니다.
이 속성에 단일 인수 또는 인수 목록을 추가할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion.set(KotlinVersion.%gradleLanguageVersion%)
        jvmTarget.set(JvmTarget.JVM_1_8)
        
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")

        // Single additional argument
        freeCompilerArgs.add("-Xno-param-assertions")

        // List of arguments
        freeCompilerArgs.addAll(
            listOf(
                "-Xno-receiver-assertions",
                "-Xno-call-assertions"
            )
        ) 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion = KotlinVersion.%gradleLanguageVersion%
        jvmTarget = JvmTarget.JVM_1_8
        
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")
        
        // Single additional argument, can be a key-value pair
        freeCompilerArgs.add("-Xno-param-assertions")
        
        // List of arguments
        freeCompilerArgs.addAll(["-Xno-receiver-assertions", "-Xno-call-assertions"])
    }
}
```

</tab>
</tabs>

> `freeCompilerArgs` 속성은 [확장](#extension-level), [타겟](#target-level), 그리고 [컴파일 단위(작업)](#compilation-unit-level) 수준에서 사용할 수 있습니다.
>
{style="tip"}

#### `languageVersion` 설정 예시 {initial-collapse-state="collapsed" collapsible="true"}

언어 버전을 설정하려면 다음 구문을 사용하세요:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%
    }
```

</tab>
</tabs>

또한, [컴파일러 옵션 유형](#types-for-compiler-options)을 참조하세요.

### JavaScript에 특화된 속성

| Name | Description | Possible values | Default value |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `friendModulesDisabled` | 내부 선언 내보내기를 비활성화합니다. | | `false` |
| `main` | 실행 시 `main` 함수를 호출해야 하는지 여부를 지정합니다. | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL` | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind` | 컴파일러가 생성하는 JS 모듈의 종류입니다. | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD` | `null` |
| `sourceMap` | 소스 맵을 생성합니다. | | `false` |
| `sourceMapEmbedSources` | 소스 파일을 소스 맵에 포함합니다. | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null` |
| `sourceMapNamesPolicy` | Kotlin 코드에 선언한 변수 및 함수 이름을 소스 맵에 추가합니다. 동작에 대한 자세한 내용은 [컴파일러 참조](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no)를 참조하세요. | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null` |
| `sourceMapPrefix` | 소스 맵의 경로에 지정된 접두사를 추가합니다. | | `null` |
| `target` | 특정 ECMA 버전용 JS 파일을 생성합니다. | `"es5"`, `"es2015"` | `"es5"` |
| `useEsClasses` | 생성된 JavaScript 코드가 ES2015 클래스를 사용하도록 합니다. ES2015 타겟 사용 시 기본적으로 활성화됩니다. | | `null` |

### 컴파일러 옵션 유형

일부 `compilerOptions`는 `String` 유형 대신 새 유형을 사용합니다:

| Option                             | Type                                                                                                                                                                                                              | Example                                                                                              |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 다음 단계

더 자세히 알아보기:
*   [Kotlin Multiplatform DSL 참조](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html).
*   [점진적 컴파일, 캐시 지원, 빌드 보고서, 그리고 Kotlin 데몬](gradle-compilation-and-caches.md).
*   [Gradle 기본 사항 및 특징](https://docs.gradle.org/current/userguide/userguide.html).
*   [Gradle 플러그인 변형 지원](gradle-plugin-variants.md).