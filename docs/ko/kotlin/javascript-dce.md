[//]: # (title: Kotlin/JS 데드 코드 제거)

> 데드 코드 제거(DCE) 도구는 더 이상 사용되지 않습니다. DCE 도구는 현재는 더 이상 사용되지 않는 레거시 JS 백엔드를 위해 설계되었습니다. 현재
> [JS IR 백엔드](#dce-and-javascript-ir-compiler)는 기본적으로 DCE를 지원하며, [`@JsExport` 어노테이션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/)을
> 통해 DCE 시 유지할 코틀린 함수와 클래스를 지정할 수 있습니다.
>
{style="warning"}

코틀린 멀티플랫폼 Gradle 플러그인에는 _[데드 코드 제거](https://wikipedia.org/wiki/Dead_code_elimination)_ (_DCE_) 도구가 포함되어 있습니다.
데드 코드 제거는 종종 _트리 쉐이킹_이라고도 불립니다. 이것은 사용되지 않는 속성, 함수 및 클래스를 제거하여 결과 JavaScript 코드의 크기를 줄입니다.

사용되지 않는 선언은 다음과 같은 경우에 나타날 수 있습니다:

*   함수가 인라인되어 직접 호출되지 않는 경우 (이는 몇 가지 상황을 제외하고 항상 발생합니다).
*   모듈이 공유 라이브러리를 사용하는 경우. DCE가 없으면 사용하지 않는 라이브러리 부분이 결과 번들에 여전히 포함됩니다.
    예를 들어, 코틀린 표준 라이브러리에는 목록, 배열, 문자 시퀀스, DOM용 어댑터 등을 조작하는 함수가 포함되어 있습니다.
    이 모든 기능은 JavaScript 파일로 약 1.3MB를 필요로 합니다. 간단한 "Hello, world" 애플리케이션은 콘솔 루틴만 필요하며,
    전체 파일에 대해 몇 킬로바이트에 불과합니다.

코틀린 멀티플랫폼 Gradle 플러그인은 `browserProductionWebpack` 작업 등을 사용하여 **프로덕션 번들**을 빌드할 때 DCE를 자동으로 처리합니다.
**개발 번들링** 작업(`browserDevelopmentWebpack` 등)에는 DCE가 포함되지 않습니다.

## DCE 및 JavaScript IR 컴파일러

IR 컴파일러와 함께 DCE를 적용하는 방법은 다음과 같습니다:

*   개발용으로 컴파일할 때는 DCE가 비활성화되며, 다음 Gradle 작업에 해당합니다:
    *   `browserDevelopmentRun`
    *   `browserDevelopmentWebpack`
    *   `nodeDevelopmentRun`
    *   `compileDevelopmentExecutableKotlinJs`
    *   `compileDevelopmentLibraryKotlinJs`
    *   이름에 "development"가 포함된 기타 Gradle 작업
*   프로덕션용으로 컴파일할 때는 DCE가 활성화되며, 다음 Gradle 작업에 해당합니다:
    *   `browserProductionRun`
    *   `browserProductionWebpack`
    *   `compileProductionExecutableKotlinJs`
    *   `compileProductionLibraryKotlinJs`
    *   이름에 "production"이 포함된 기타 Gradle 작업

`@JsExport` 어노테이션을 사용하여 DCE가 루트로 처리하려는 선언을 지정할 수 있습니다.

## DCE에서 선언 제외하기

때로는 모듈에서 사용하지 않더라도 함수나 클래스를 결과 JavaScript 코드에 유지해야 할 수도 있습니다. 예를 들어, 클라이언트 JavaScript 코드에서 이를 사용할 경우입니다.

특정 선언이 제거되지 않도록 하려면, Gradle 빌드 스크립트에 `dceTask` 블록을 추가하고 `keep` 함수의 인수로 해당 선언을 나열하십시오. 인수는 모듈 이름을 접두사로 포함하는 선언의 정규화된 이름이어야 합니다: `moduleName.dot.separated.package.name.declarationName`

> 특별히 지정하지 않는 한, 생성된 JavaScript 코드에서 함수와 모듈의 이름은 [망글링될 수 있습니다](js-to-kotlin-interop.md#jsname-annotation).
> 이러한 함수가 제거되지 않도록 하려면, 생성된 JavaScript 코드에 나타나는 망글링된 이름을 `keep` 인수로 사용하십시오.
>
{style="note"}

```groovy
kotlin {
    js {
        browser {
            dceTask {
                keep("myKotlinJSModule.org.example.getName", "myKotlinJSModule.org.example.User" )
            }
            binaries.executable()
        }
    }
}
```

전체 패키지 또는 모듈이 제거되지 않도록 하려면, 생성된 JavaScript 코드에 나타나는 정규화된 이름을 사용할 수 있습니다.

> 전체 패키지나 모듈을 제거되지 않도록 하는 것은 DCE가 많은 사용되지 않는 선언을 제거하는 것을 막을 수 있습니다. 이 때문에,
> DCE에서 제외되어야 하는 개별 선언을 하나씩 선택하는 것이 좋습니다.
>
{style="note"}

## DCE 비활성화하기

DCE를 완전히 끄려면, `dceTask`에서 `devMode` 옵션을 사용하십시오:

```groovy
kotlin {
    js {
        browser {
            dceTask {
                dceOptions.devMode = true
            }
        }
        binaries.executable()
    }
}