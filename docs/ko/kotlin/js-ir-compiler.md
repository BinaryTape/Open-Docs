[//]: # (title: Kotlin/JS 컴파일러 기능)

Kotlin/JS에는 성능, 크기 및 개발 속도를 위해 코드를 최적화하는 컴파일러 기능이 포함되어 있습니다.
이 기능은 Kotlin 코드를 JavaScript 코드로 생성하기 전 중간 표현(IR)으로 변환하는 컴파일 과정을 통해 작동합니다.

## 최상위 프로퍼티의 지연 초기화

애플리케이션 시작 성능을 높이기 위해 Kotlin/JS 컴파일러는 최상위 프로퍼티(top-level properties)를 지연 초기화(lazy initialization)합니다. 이 방식을 통해 애플리케이션은 코드에 사용된 모든 최상위 프로퍼티를 초기화하지 않고도 로드될 수 있습니다. 시작 시점에 필요한 프로퍼티만 초기화하며, 다른 프로퍼티는 해당 프로퍼티를 사용하는 코드가 실제로 실행될 때 값을 할당받습니다.

```kotlin
val a = run {
    val result = // 복잡한 연산
    println(result)
    result
} // 처음 사용할 때 값이 계산됩니다.
```

어떤 이유로든 프로퍼티를 즉시(애플리케이션 시작 시) 초기화해야 하는 경우, 해당 프로퍼티에 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 어노테이션을 표시하세요.

## 개발용 바이너리를 위한 증분 컴파일

Kotlin/JS 컴파일러는 개발 프로세스 속도를 높여주는 _개발용 바이너리 증분 컴파일(incremental compilation) 모드_를 제공합니다.
이 모드에서 컴파일러는 모듈 레벨에서 `compileDevelopmentExecutableKotlinJs` Gradle 태스크의 결과를 캐시합니다.
이후 컴파일 시 변경되지 않은 소스 파일에 대해서는 캐시된 컴파일 결과를 사용하여, 특히 작은 변경 사항이 있을 때 컴파일을 더 빠르게 완료합니다.

증분 컴파일은 기본적으로 활성화되어 있습니다. 개발용 바이너리에 대한 증분 컴파일을 비활성화하려면 프로젝트의 `gradle.properties` 또는 `local.properties`에 다음 라인을 추가하세요.

```none
kotlin.incremental.js.ir=false // 기본값은 true
```

> 증분 컴파일 모드에서의 클린 빌드(clean build)는 캐시를 생성하고 채워야 하므로 평소보다 느릴 수 있습니다.
>
{style="note"}

## 프로덕션 환경에서의 멤버 이름 축소

Kotlin/JS 컴파일러는 Kotlin 클래스와 함수 간의 관계에 대한 내부 정보를 사용하여 함수, 프로퍼티 및 클래스의 이름을 단축하는 보다 효율적인 축소(Minification)를 적용합니다. 이는 결과물인 번들 애플리케이션의 크기를 줄여줍니다.

이러한 유형의 축소는 Kotlin/JS 애플리케이션을 [프로덕션](js-project-setup.md#building-executables) 모드로 빌드할 때 자동으로 적용되며 기본적으로 활성화되어 있습니다. 멤버 이름 축소를 비활성화하려면 `-Xir-minimized-member-names` 컴파일러 옵션을 사용하세요.

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

[데드 코드 제거](https://wikipedia.org/wiki/Dead_code_elimination)(Dead code elimination, DCE)는 사용되지 않는 프로퍼티, 함수 및 클래스를 제거하여 생성된 JavaScript 코드의 크기를 줄입니다.

사용되지 않는 선언은 다음과 같은 경우에 발생할 수 있습니다.

* 함수가 인라인화되어 직접 호출되지 않는 경우(드문 경우를 제외하고 항상 발생함).
* 모듈이 공유 라이브러리를 사용하는 경우. DCE가 없으면 사용하지 않는 라이브러리의 일부도 결과 번들에 포함됩니다.
  예를 들어, Kotlin 표준 라이브러리에는 리스트, 배열, 문자 시퀀스 조작을 위한 함수, DOM용 어댑터 등이 포함되어 있습니다. 이 모든 기능은 JavaScript 파일로 약 1.3MB를 차지합니다. 하지만 간단한 "Hello, world" 애플리케이션은 전체 파일에서 몇 킬로바이트에 불과한 콘솔 루틴만 필요합니다.

Kotlin/JS 컴파일러에서 DCE는 자동으로 처리됩니다.

* 다음 Gradle 태스크에 해당하는 _개발용(development)_ 번들링 태스크에서는 DCE가 비활성화됩니다.

  * `jsBrowserDevelopmentRun`
  * `jsBrowserDevelopmentWebpack`
  * `jsNodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * 이름에 "development"가 포함된 기타 Gradle 태스크

* _프로덕션(production)_ 번들을 빌드하는 경우 DCE가 활성화되며, 이는 다음 Gradle 태스크에 해당합니다.

  * `jsBrowserProductionRun`
  * `jsBrowserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  * 이름에 "production"이 포함된 기타 Gradle 태스크

[`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 어노테이션을 사용하여 DCE가 루트(root)로 취급할 선언을 지정할 수 있습니다.