---
title: "Kotlin Gradle 플러그인의 컴파일러 옵션"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin의 각 릴리스에는 지원되는 대상에 대한 컴파일러가 포함되어 있습니다.
[지원되는 플랫폼](native-overview#target-platforms)을 위한 JVM, JavaScript 및 네이티브 바이너리.

이러한 컴파일러는 다음에 의해 사용됩니다.
* Kotlin 프로젝트에서 __Compile__ 또는 __Run__ 버튼을 클릭할 때 IDE에서 사용됩니다.
* 콘솔 또는 IDE에서 `gradle build`를 호출할 때 Gradle에서 사용됩니다.
* 콘솔 또는 IDE에서 `mvn compile` 또는 `mvn test-compile`을 호출할 때 Maven에서 사용됩니다.

[명령줄 컴파일러 작업](command-line) 튜토리얼에 설명된 대로 명령줄에서 Kotlin 컴파일러를 수동으로 실행할 수도 있습니다.

## 옵션 정의 방법

Kotlin 컴파일러에는 컴파일 프로세스를 맞춤화하기 위한 여러 가지 옵션이 있습니다.

Gradle DSL을 사용하면 컴파일러 옵션을 포괄적으로 구성할 수 있습니다. 이는 [Kotlin Multiplatform](multiplatform-dsl-reference) 및 [JVM/Android](#target-the-jvm) 프로젝트에서 사용할 수 있습니다.

Gradle DSL을 사용하면 빌드 스크립트 내에서 세 가지 수준으로 컴파일러 옵션을 구성할 수 있습니다.
* 모든 대상 및 공유 소스 세트에 대한 `kotlin {}` 블록의 **[확장 수준](#extension-level)**입니다.
* 특정 대상에 대한 블록의 **[대상 수준](#target-level)**입니다.
* 일반적으로 특정 컴파일 작업의 **[컴파일 단위 수준](#compilation-unit-level)**입니다.

<img src="/img/compiler-options-levels.svg" alt="Kotlin compiler options levels" width="700" style={{verticalAlign: 'middle'}}/>

더 높은 수준의 설정은 더 낮은 수준의 규칙(기본값)으로 사용됩니다.

* 확장 수준에서 설정된 컴파일러 옵션은 `commonMain`, `nativeMain` 및 `commonTest`와 같은 공유 소스 세트를 포함하여 대상 수준 옵션의 기본값입니다.
* 대상 수준에서 설정된 컴파일러 옵션은 `compileKotlinJvm` 및 `compileTestKotlinJvm` 작업과 같은 컴파일 단위(작업) 수준 옵션의 기본값입니다.

결과적으로 더 낮은 수준에서 이루어진 구성은 더 높은 수준의 관련 설정을 재정의합니다.

* 작업 수준 컴파일러 옵션은 대상 또는 확장 수준에서 관련된 구성을 재정의합니다.
* 대상 수준 컴파일러 옵션은 확장 수준에서 관련된 구성을 재정의합니다.

컴파일에 적용되는 컴파일러 인수의 수준을 확인하려면 Gradle [로깅](https://docs.gradle.org/current/userguide/logging.html)의 `DEBUG` 수준을 사용하십시오.
JVM 및 JS/WASM 작업의 경우 로그 내에서 `"Kotlin compiler args:"` 문자열을 검색하고, 네이티브 작업의 경우
`"Arguments ="` 문자열을 검색합니다.

:::tip
타사 플러그인 작성자인 경우 재정의 문제를 방지하려면 프로젝트 수준에서 구성을 적용하는 것이 가장 좋습니다. 이를 위해 새로운 [Kotlin 플러그인 DSL 확장 유형](whatsnew21#new-api-for-kotlin-gradle-plugin-extensions)을 사용할 수 있습니다. 귀하 측에서 이 구성을 명시적으로 문서화하는 것이 좋습니다.

:::

### 확장 수준

`compilerOptions {}` 블록에서 모든 대상 및 공유 소스 세트에 대한 공통 컴파일러 옵션을 구성할 수 있습니다.
최상위 수준에서:

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### 대상 수준

`target {}` 블록 내부의 `compilerOptions {}` 블록에서 JVM/Android 대상에 대한 컴파일러 옵션을 구성할 수 있습니다.

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

Kotlin Multiplatform 프로젝트에서는 특정 대상 내에서 컴파일러 옵션을 구성할 수 있습니다. 예를 들어 `jvm { compilerOptions {}}`과 같습니다. 자세한 내용은 [Multiplatform Gradle DSL reference](multiplatform-dsl-reference)를 참조하십시오.

### 컴파일 단위 수준

작업 구성 내의 `compilerOptions {}` 블록에서 특정 컴파일 단위 또는 작업에 대한 컴파일러 옵션을 구성할 수 있습니다.

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

`KotlinCompilation`을 통해 컴파일 단위 수준에서 컴파일러 옵션에 액세스하고 구성할 수도 있습니다.

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

JVM/Android 및 [Kotlin Multiplatform](multiplatform-dsl-reference)과 다른 대상의 플러그인을 구성하려면
해당 Kotlin 컴파일 작업의 `compilerOptions {}` 속성을 사용합니다. 다음 예제에서는
Kotlin 및 Groovy DSL 모두에서 이 구성을 설정하는 방법을 보여줍니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</TabItem>
</Tabs>

## JVM 대상

[앞서 설명한 대로](#how-to-define-options) 확장, 대상 및 컴파일 단위 수준(작업)에서 JVM/Android 프로젝트에 대한 컴파일러 옵션을 정의할 수 있습니다.

기본 JVM 컴파일 작업은 프로덕션 코드의 경우 `compileKotlin`, 테스트 코드의 경우 `compileTestKotlin`이라고 합니다. 사용자 지정 소스 세트에 대한 작업은 `compile<Name>Kotlin` 패턴에 따라 이름이 지정됩니다.

터미널에서 `gradlew tasks --all` 명령을 실행하고
`Other tasks` 그룹에서 `compile*Kotlin` 작업 이름을 검색하여 Android 컴파일 작업 목록을 볼 수 있습니다.

알아야 할 몇 가지 중요한 세부 정보는 다음과 같습니다.

* `android.kotlinOptions` 및 `kotlin.compilerOptions` 구성 블록은 서로를 재정의합니다. 마지막(가장 낮은) 블록이 적용됩니다.
* `kotlin.compilerOptions`는 프로젝트의 모든 Kotlin 컴파일 작업을 구성합니다.
* `tasks.named<KotlinJvmCompile>("compileKotlin") { }`를 사용하여 `kotlin.compilerOptions` DSL에서 적용한 구성을 재정의할 수 있습니다.
  (`tasks.withType<KotlinJvmCompile>().configureEach { }`) 접근 방식입니다.

## JavaScript 대상

JavaScript 컴파일 작업은 프로덕션 코드의 경우 `compileKotlinJs`, 테스트 코드의 경우 `compileTestKotlinJs`, 사용자 지정 소스 세트의 경우 `compile<Name>KotlinJs`라고 합니다.

단일 작업을 구성하려면 해당 이름을 사용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings = true
    }
}
```

</TabItem>
</Tabs>

Gradle Kotlin DSL을 사용하는 경우 먼저 프로젝트의 `tasks`에서 작업을 가져와야 합니다.

JS 및 공통 대상의 경우 각각 `Kotlin2JsCompile` 및 `KotlinCompileCommon` 유형을 사용합니다.

터미널에서 `gradlew tasks --all` 명령을 실행하고
`Other tasks` 그룹에서 `compile*KotlinJS` 작업 이름을 검색하여 JavaScript 컴파일 작업 목록을 볼 수 있습니다.

## 모든 Kotlin 컴파일 작업

프로젝트의 모든 Kotlin 컴파일 작업을 구성할 수도 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</TabItem>
</Tabs>

## 모든 컴파일러 옵션

다음은 Gradle 컴파일러에 대한 전체 옵션 목록입니다.

### 공통 속성

| 이름              | 설명                                                                                                                              | 가능한 값           | 기본값 |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | [옵트인 컴파일러 인수](opt-in-requirements) 목록을 구성하기 위한 속성                                                 | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | [프로그레시브 컴파일러 모드](whatsnew13#progressive-mode) 활성화                                                                  | `true`, `false`           | `false`       |
| `extraWarnings`   | 경고를 발생시키는 경우 [추가 선언, 식 및 유형 컴파일러 검사](whatsnew21#extra-compiler-checks) 활성화 | `true`, `false`           | `false`       |

### JVM에 특정한 속성

| 이름                      | 설명                                                                                                                                                                                                                                   | 가능한 값                                                                                         | 기본값               |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | 메서드 매개변수에 대한 Java 1.8 리플렉션의 메타데이터 생성                                                                                                                                                                                |                                                                                                         | false                       |
| `jvmTarget`               | 생성된 JVM 바이트코드의 대상 버전                                                                                                                                                                                                  | "1.8", "9", "10", ...,  "22", "23". [컴파일러 옵션 유형](#types-for-compiler-options)도 참조하십시오. | "1.8" |
| `noJdk`                   | Java 런타임을 클래스 경로에 자동으로 포함하지 않음                                                                                                                                                                               |                                                                                                         | false                       |
| `jvmTargetValidationMode` | <list><li>Kotlin과 Java 간의 [JVM 대상 호환성](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks) 검증</li><li>`KotlinCompile` 유형의 작업에 대한 속성입니다.</li></list> | `WARNING`, `ERROR`, `IGNORE`                                                                              | `ERROR`                     |

### JVM 및 JavaScript에 공통적인 속성

| 이름 | 설명 | 가능한 값                                                |기본값 |
|------|-------------|----------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | 경고가 있는 경우 오류 보고 |                                                                | false |
| `suppressWarnings` | 경고를 생성하지 않음 |                                                                | false |
| `verbose` | 자세한 로깅 출력을 활성화합니다. [Gradle 디버그 로그 수준을 활성화한 경우](https://docs.gradle.org/current/userguide/logging.html)에만 작동합니다. |                                                                | false |
| `freeCompilerArgs` | 추가 컴파일러 인수 목록입니다. 여기서 실험적인 `-X` 인수를 사용할 수도 있습니다. [예제](#example-of-additional-arguments-usage-via-freecompilerargs)를 참조하십시오. |                                                                | [] |
| `apiVersion`      | 선언 사용을 지정된 버전의 번들 라이브러리 선언으로 제한합니다. | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |               |
| `languageVersion` | 지정된 버전의 Kotlin과의 소스 호환성을 제공합니다.                         | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL)  |               |
:::tip
향후 릴리스에서는 `freeCompilerArgs` 속성을 더 이상 사용하지 않을 예정입니다. Kotlin Gradle DSL에서 일부 옵션이 누락된 경우
[이슈를 제출](https://youtrack.jetbrains.com/newissue?project=kt)하십시오.

#### freeCompilerArgs를 통한 추가 인수 사용 예시

`freeCompilerArgs` 속성을 사용하여 추가(실험적 포함) 컴파일러 인수를 제공합니다.
이 속성에 단일 인수 또는 인수 목록을 추가할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // Kotlin API 및 JVM 대상의 버전을 지정합니다.
        apiVersion.set(KotlinVersion.KOTLIN_2_1)
        jvmTarget.set(JvmTarget.JVM_1_8)
        
        // 단일 실험적 인수
        freeCompilerArgs.add("-Xexport-kdoc")

        // 단일 추가 인수
        freeCompilerArgs.add("-Xno-param-assertions")

        // 인수 목록
        freeCompilerArgs.addAll(
            listOf(
                "-Xno-receiver-assertions",
                "-Xno-call-assertions"
            )
        ) 
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Kotlin API 및 JVM 대상의 버전을 지정합니다.
        apiVersion = KotlinVersion.KOTLIN_2_1
        jvmTarget = JvmTarget.JVM_1_8
        
        // 단일 실험적 인수
        freeCompilerArgs.add("-Xexport-kdoc")
        
        // 단일 추가 인수, 키-값 쌍이 될 수 있음
        freeCompilerArgs.add("-Xno-param-assertions")
        
        // 인수 목록
        freeCompilerArgs.addAll(["-Xno-receiver-assertions", "-Xno-call-assertions"])
    }
}
```

</TabItem>
</Tabs>

`freeCompilerArgs` 속성은 [확장](#extension-level), [대상](#target-level) 및 [컴파일 단위(작업)](#compilation-unit-level) 수준에서 사용할 수 있습니다.

::: 

#### languageVersion 설정 예시

언어 버전을 설정하려면 다음 구문을 사용하십시오.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
    }
```

</TabItem>
</Tabs>

[컴파일러 옵션 유형](#types-for-compiler-options)도 참조하십시오.

### JavaScript에 특정한 속성

| 이름 | 설명                                                                                                                                                                                                                              | 가능한 값                                                                                                                                                            | 기본값                      |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `friendModulesDisabled` | 내부 선언 내보내기 비활성화                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `main` | 실행 시 `main` 함수를 호출해야 하는지 여부를 지정합니다.                                                                                                                                                                       | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL`                                                                                                  | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind` | 컴파일러에서 생성된 JS 모듈의 종류                                                                                                                                                                                          | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD`                                | `null`                               |
| `sourceMap` | 소스 맵 생성                                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `sourceMapEmbedSources` | 소스 파일을 소스 맵에 포함                                                                                                                                                                                                   | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null`                               |
| `sourceMapNamesPolicy` | Kotlin 코드에서 선언한 변수 및 함수 이름을 소스 맵에 추가합니다. 동작에 대한 자세한 내용은 [컴파일러 참조](compiler-reference#source-map-names-policy-simple-names-fully-qualified-names-no)를 참조하십시오. | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                               |
| `sourceMapPrefix` | 소스 맵의 경로에 지정된 접두사를 추가합니다.                                                                                                                                                                                      |                                                                                                                                                                            | `null`                               |
| `target` | 특정 ECMA 버전에 대한 JS 파일 생성                                                                                                                                                                                              | `"es5"`, `"es2015"`                                                                                                                                                            | `"es5"`                              |
| `useEsClasses` | 생성된 JavaScript 코드에서 ES2015 클래스를 사용하도록 합니다. ES2015 대상 사용의 경우 기본적으로 활성화됩니다.                                                                                                                                                                                              |                                                                                                                                                                            | `null`                               |

### 컴파일러 옵션 유형

일부 `compilerOptions`는 `String` 유형 대신 새로운 유형을 사용합니다.

| 옵션                             | 유형                                                                                                                                                                                                              | 예시                                                                                              |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` 및 `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.KOTLIN_2_1)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 다음은 무엇일까요?

다음에 대해 자세히 알아보십시오.
* [Kotlin Multiplatform DSL reference](multiplatform-dsl-reference).
* [점진적 컴파일, 캐시 지원, 빌드 보고서 및 Kotlin 데몬](gradle-compilation-and-caches).
* [Gradle 기본 사항 및 세부 사항](https://docs.gradle.org/current/userguide/userguide.html).
* [Gradle 플러그인 변형에 대한 지원](gradle-plugin-variants).