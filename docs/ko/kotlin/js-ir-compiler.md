[//]: # (title: Kotlin/JS 컴파일러 기능)

Kotlin/JS는 성능, 크기 및 개발 속도를 위해 코드를 최적화하는 컴파일러 기능을 포함합니다. 이는 JavaScript 코드를 생성하기 전에 Kotlin 코드를 중간 표현(IR)으로 변환하는 컴파일 프로세스를 통해 이루어집니다.

## 최상위 프로퍼티 지연 초기화

더 나은 애플리케이션 시작 성능을 위해 Kotlin/JS 컴파일러는 최상위 프로퍼티를 지연 초기화합니다. 이러한 방식으로 애플리케이션은 코드에 사용된 모든 최상위 프로퍼티를 초기화하지 않고 로드됩니다. 시작 시 필요한 프로퍼티만 초기화하며, 다른 프로퍼티는 해당 프로퍼티를 사용하는 코드가 실제로 실행될 때 나중에 값을 받습니다.

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

어떤 이유로든 프로퍼티를 즉시(애플리케이션 시작 시) 초기화해야 하는 경우, [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 어노테이션을 지정하세요.

## 개발 바이너리를 위한 증분 컴파일

Kotlin/JS 컴파일러는 개발 프로세스 속도를 높이는 _개발 바이너리를 위한 증분 컴파일 모드_를 제공합니다. 이 모드에서 컴파일러는 `compileDevelopmentExecutableKotlinJs` Gradle 작업의 결과를 모듈 수준에서 캐싱합니다. 변경되지 않은 소스 파일에 대해서는 캐시된 컴파일 결과를 후속 컴파일에 사용함으로써 컴파일 완료 시간을 단축하며, 특히 작은 변경이 있을 때 더욱 그렇습니다.

증분 컴파일은 기본적으로 활성화되어 있습니다. 개발 바이너리에 대한 증분 컴파일을 비활성화하려면 프로젝트의 `gradle.properties` 또는 `local.properties`에 다음 줄을 추가하세요:

```none
kotlin.incremental.js.ir=false // true by default
```

> 증분 컴파일 모드에서 클린 빌드는 캐시를 생성하고 채워야 하므로 일반적으로 더 느립니다.
>
{style="note"}

## 프로덕션 환경에서 멤버 이름 최소화

Kotlin/JS 컴파일러는 Kotlin 클래스 및 함수의 관계에 대한 내부 정보를 사용하여 더 효율적인 최소화를 적용하고 함수, 프로퍼티 및 클래스의 이름을 단축합니다. 이는 결과 번들 애플리케이션의 크기를 줄여줍니다.

이러한 유형의 최소화는 Kotlin/JS 애플리케이션을 [프로덕션](js-project-setup.md#building-executables) 모드로 빌드할 때 자동으로 적용되며, 기본적으로 활성화되어 있습니다. 멤버 이름 최소화를 비활성화하려면 `-Xir-minimized-member-names` 컴파일러 옵션을 사용하세요:

```kotlin
kotlin {
    js {
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