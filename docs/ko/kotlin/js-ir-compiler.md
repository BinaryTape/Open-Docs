[//]: # (title: Kotlin/JS IR 컴파일러)

Kotlin/JS IR 컴파일러 백엔드는 Kotlin/JS 혁신의 주요 초점이며, 이 기술의 미래를 위한 길을 열어줍니다.

Kotlin/JS IR 컴파일러 백엔드는 Kotlin 소스 코드에서 JavaScript 코드를 직접 생성하는 대신 새로운 접근 방식을 활용합니다. Kotlin 소스 코드는 먼저 [Kotlin 중간 표현 (IR)](whatsnew14.md#unified-backends-and-extensibility)으로 변환된 다음, JavaScript로 컴파일됩니다. Kotlin/JS의 경우, 이는 적극적인 최적화를 가능하게 하며, [데드 코드 제거](#dead-code-elimination)를 통한 생성된 코드 크기 축소, JavaScript 및 TypeScript 생태계 상호 운용성 등 이전 컴파일러에 존재했던 문제점을 개선할 수 있도록 합니다.

IR 컴파일러 백엔드는 Kotlin 1.4.0부터 Kotlin 멀티플랫폼 Gradle 플러그인을 통해 사용할 수 있습니다. 프로젝트에서 이를 활성화하려면 Gradle 빌드 스크립트에서 `js` 함수에 컴파일러 타입을 전달하세요:

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
        binaries.executable() // not applicable to BOTH, see details below
    }
}
```

*   `IR`은 Kotlin/JS용 새 IR 컴파일러 백엔드를 사용합니다.
*   `LEGACY`는 이전 컴파일러 백엔드를 사용합니다.
*   `BOTH`는 새 IR 컴파일러와 기본 컴파일러 백엔드 모두로 프로젝트를 컴파일합니다. [두 백엔드와 호환되는 라이브러리 작성](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)을 위해 이 모드를 사용하세요.

> 이전 컴파일러 백엔드는 Kotlin 1.8.0부터 더 이상 사용되지 않습니다. Kotlin 1.9.0부터는 `LEGACY` 또는 `BOTH` 컴파일러 타입을 사용하면 오류가 발생합니다.
>
{style="warning"}

컴파일러 타입은 `gradle.properties` 파일에서도 `kotlin.js.compiler=ir` 키로 설정할 수 있습니다. 하지만 이 동작은 `build.gradle(.kts)`의 어떤 설정으로든 덮어쓰기됩니다.

## 최상위 프로퍼티 지연 초기화

더 나은 애플리케이션 시작 성능을 위해 Kotlin/JS IR 컴파일러는 최상위 프로퍼티를 지연 초기화합니다. 이 방법을 통해 애플리케이션은 코드에 사용된 모든 최상위 프로퍼티를 초기화하지 않고 로드됩니다. 시작 시 필요한 프로퍼티만 초기화하며, 다른 프로퍼티는 해당 프로퍼티를 사용하는 코드가 실제로 실행될 때 나중에 값을 받습니다.

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

어떤 이유로든 프로퍼티를 즉시(애플리케이션 시작 시) 초기화해야 하는 경우, [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 어노테이션을 지정하세요.

## 개발 바이너리를 위한 증분 컴파일

JS IR 컴파일러는 개발 프로세스 속도를 높이는 _개발 바이너리를 위한 증분 컴파일 모드_를 제공합니다. 이 모드에서 컴파일러는 `compileDevelopmentExecutableKotlinJs` Gradle 작업의 결과를 모듈 수준에서 캐싱합니다. 변경되지 않은 소스 파일에 대해서는 캐시된 컴파일 결과를 후속 컴파일에 사용함으로써 컴파일 완료 시간을 단축하며, 특히 작은 변경이 있을 때 더욱 그렇습니다.

증분 컴파일은 기본적으로 활성화되어 있습니다. 개발 바이너리에 대한 증분 컴파일을 비활성화하려면 프로젝트의 `gradle.properties` 또는 `local.properties`에 다음 줄을 추가하세요:

```none
kotlin.incremental.js.ir=false // true by default
```

> 증분 컴파일 모드에서 클린 빌드는 캐시를 생성하고 채워야 하므로 일반적으로 더 느립니다.
>
{style="note"}

## 출력 모드

JS IR 컴파일러가 프로젝트에서 `.js` 파일을 출력하는 방식을 선택할 수 있습니다.

*   **모듈별 하나**. 기본적으로 JS 컴파일러는 프로젝트의 각 모듈에 대해 별도의 `.js` 파일을 컴파일 결과로 출력합니다.
*   **프로젝트별 하나**. `gradle.properties`에 다음 줄을 추가하여 전체 프로젝트를 단일 `.js` 파일로 컴파일할 수 있습니다:

    ```none
    kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
    ```

*   **파일별 하나**. 각 Kotlin 파일당 하나(또는 파일에 내보낸 선언이 포함된 경우 두 개)의 JavaScript 파일을 생성하는 더 세분화된 출력을 설정할 수 있습니다. 파일별 컴파일 모드를 활성화하려면:

    1.  빌드 파일에 `useEsModules()` 함수를 추가하여 ECMAScript 모듈을 지원합니다:

        ```kotlin
        // build.gradle.kts
        kotlin {
            js(IR) {
                useEsModules() // Enables ES2015 modules
                browser()
            }
        }
        ```

        또는 프로젝트에서 ES2015 기능을 지원하기 위해 `es2015` [컴파일 대상](js-project-setup.md#support-for-es2015-features)을 사용할 수 있습니다.

    2.  `-Xir-per-file` 컴파일러 옵션을 적용하거나 `gradle.properties` 파일을 다음으로 업데이트합니다:

        ```none
        # gradle.properties
        kotlin.js.ir.output.granularity=per-file // 'per-module' is the default
        ```

## 프로덕션 환경에서 멤버 이름 최소화

Kotlin/JS IR 컴파일러는 Kotlin 클래스 및 함수의 관계에 대한 내부 정보를 사용하여 더 효율적인 최소화를 적용하고 함수, 프로퍼티 및 클래스의 이름을 단축합니다. 이는 결과 번들 애플리케이션의 크기를 줄여줍니다.

이러한 유형의 최소화는 Kotlin/JS 애플리케이션을 [프로덕션](js-project-setup.md#building-executables) 모드로 빌드할 때 자동으로 적용되며, 기본적으로 활성화되어 있습니다. 멤버 이름 최소화를 비활성화하려면 `-Xir-minimized-member-names` 컴파일러 옵션을 사용하세요:

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## 데드 코드 제거

[데드 코드 제거](https://wikipedia.org/wiki/Dead_code_elimination)(DCE)는 사용되지 않는 프로퍼티, 함수 및 클래스를 제거하여 결과 JavaScript 코드의 크기를 줄입니다.

사용되지 않는 선언은 다음과 같은 경우에 나타날 수 있습니다:

*   함수가 인라인되었고 직접 호출되지 않는 경우 (몇 가지 경우를 제외하고는 항상 발생합니다).
*   모듈이 공유 라이브러리를 사용하는 경우. DCE가 없으면 사용하지 않는 라이브러리의 부분이 결과 번들에 여전히 포함됩니다. 예를 들어, Kotlin 표준 라이브러리에는 리스트, 배열, 문자 시퀀스 조작을 위한 함수, DOM용 어댑터 등이 포함되어 있습니다. 이 모든 기능은 JavaScript 파일로 약 1.3MB가 필요합니다. 간단한 "Hello, world" 애플리케이션은 콘솔 루틴만 필요하며, 이는 전체 파일에서 몇 킬로바이트에 불과합니다.

Kotlin/JS 컴파일러에서 DCE는 자동으로 처리됩니다:

*   DCE는 다음 Gradle 작업에 해당하는 _개발_ 번들링 작업에서 비활성화됩니다:

    *   `jsBrowserDevelopmentRun`
    *   `jsBrowserDevelopmentWebpack`
    *   `jsNodeDevelopmentRun`
    *   `compileDevelopmentExecutableKotlinJs`
    *   `compileDevelopmentLibraryKotlinJs`
    *   이름에 "development"가 포함된 다른 Gradle 작업

*   DCE는 다음 Gradle 작업에 해당하는 _프로덕션_ 번들을 빌드할 때 활성화됩니다:

    *   `jsBrowserProductionRun`
    *   `jsBrowserProductionWebpack`
    *   `compileProductionExecutableKotlinJs`
    *   `compileProductionLibraryKotlinJs`
    *   이름에 "production"이 포함된 다른 Gradle 작업

[`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 어노테이션을 사용하여 DCE가 루트로 처리하려는 선언을 지정할 수 있습니다.

## 미리 보기: TypeScript 선언 파일 (d.ts) 생성

> TypeScript 선언 파일(`d.ts`)의 생성은 [실험적](components-stability.md) 기능입니다. 언제든지 중단되거나 변경될 수 있습니다. 옵트인이 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D)에 대한 여러분의 피드백을 환영합니다.
>
{style="warning"}

Kotlin/JS IR 컴파일러는 Kotlin 코드에서 TypeScript 정의를 생성할 수 있습니다. 이러한 정의는 하이브리드 앱에서 작업할 때 JavaScript 도구 및 IDE에서 자동 완성을 제공하고, 정적 분석기를 지원하며, Kotlin 코드를 JavaScript 및 TypeScript 프로젝트에 더 쉽게 포함하는 데 사용될 수 있습니다.

프로젝트가 실행 파일(`binaries.executable()`)을 생성하는 경우, Kotlin/JS IR 컴파일러는 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation)로 표시된 모든 최상위 선언을 수집하고 `.d.ts` 파일에 TypeScript 정의를 자동으로 생성합니다.

TypeScript 정의를 생성하려면 Gradle 빌드 파일에서 이를 명시적으로 구성해야 합니다. [`js` 섹션](js-project-setup.md#execution-environments)의 `build.gradle.kts` 파일에 `generateTypeScriptDefinitions()`를 추가하세요. 예를 들면 다음과 같습니다:

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

정의는 `build/js/packages/<package_name>/kotlin`에서 해당 웹팩되지 않은 JavaScript 코드와 함께 찾을 수 있습니다.

## IR 컴파일러의 현재 제한 사항

새 IR 컴파일러 백엔드의 주요 변경 사항은 기본 백엔드와의 **바이너리 호환성 부재**입니다. 새 IR 컴파일러로 생성된 라이브러리는 [`klib` 형식](native-libraries.md#library-format)을 사용하며 기본 백엔드에서는 사용할 수 없습니다. 반면, 이전 컴파일러로 생성된 라이브러리는 `js` 파일이 포함된 `jar`이며 IR 백엔드에서는 사용할 수 없습니다.

프로젝트에서 IR 컴파일러 백엔드를 사용하려면 **모든 Kotlin 의존성을 새 백엔드를 지원하는 버전으로 업데이트**해야 합니다. Kotlin/JS를 대상으로 하는 Kotlin 1.4+용 JetBrains에서 게시한 라이브러리에는 새 IR 컴파일러 백엔드 사용에 필요한 모든 아티팩트가 이미 포함되어 있습니다.

**라이브러리 작성자**로서 현재 컴파일러 백엔드와 새 IR 컴파일러 백엔드 모두에 대한 호환성을 제공하려는 경우, [IR 컴파일러용 라이브러리 작성 섹션](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)도 추가로 확인하세요.

IR 컴파일러 백엔드는 기본 백엔드와 비교할 때 몇 가지 불일치도 있습니다. 새 백엔드를 시도할 때 발생 가능한 이러한 문제점을 염두에 두는 것이 좋습니다.

*   `kotlin-wrappers`와 같이 기본 백엔드의 **특정 특성에 의존하는 일부 라이브러리**는 일부 문제를 표시할 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-40525)에서 조사 및 진행 상황을 확인할 수 있습니다.
*   IR 백엔드는 **기본적으로 Kotlin 선언을 JavaScript에서 전혀 사용할 수 없도록 합니다**. Kotlin 선언을 JavaScript에서 볼 수 있도록 하려면 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 어노테이션을 **반드시** 지정해야 합니다.

## 기존 프로젝트를 IR 컴파일러로 마이그레이션

두 Kotlin/JS 컴파일러 간의 상당한 차이로 인해 Kotlin/JS 코드를 IR 컴파일러와 함께 사용하려면 일부 조정이 필요할 수 있습니다. [Kotlin/JS IR 컴파일러 마이그레이션 가이드](js-ir-migration.md)에서 기존 Kotlin/JS 프로젝트를 IR 컴파일러로 마이그레이션하는 방법을 알아보세요.

## 하위 호환성을 갖춘 IR 컴파일러용 라이브러리 작성

기본 백엔드와 새 IR 컴파일러 백엔드 모두에 대한 호환성을 제공하려는 라이브러리 관리자라면, 컴파일러 선택 설정이 제공되어 두 백엔드 모두에 대한 아티팩트를 생성할 수 있습니다. 이를 통해 기존 사용자를 위한 호환성을 유지하면서 다음 세대의 Kotlin 컴파일러에 대한 지원을 제공할 수 있습니다. 이른바 `both` 모드는 `gradle.properties` 파일에 `kotlin.js.compiler=both` 설정을 사용하거나 `build.gradle(.kts)` 파일 내의 `js` 블록 안에 프로젝트별 옵션 중 하나로 설정할 수 있습니다:

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

`both` 모드에서는 소스에서 라이브러리를 빌드할 때 IR 컴파일러 백엔드와 기본 컴파일러 백엔드가 모두 사용됩니다(이름에서 알 수 있듯이). 이는 Kotlin IR이 포함된 `klib` 파일과 기본 컴파일러용 `jar` 파일이 모두 생성됨을 의미합니다. 동일한 Maven 좌표로 게시될 때 Gradle은 사용 사례에 따라 올바른 아티팩트를 자동으로 선택합니다 – 이전 컴파일러의 경우 `js`, 새 컴파일러의 경우 `klib`입니다. 이를 통해 두 컴파일러 백엔드 중 하나를 사용하는 프로젝트용으로 라이브러리를 컴파일하고 게시할 수 있습니다.