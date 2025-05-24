---
title: "Kotlin/JS 데드 코드 제거"
---
:::note
Dead Code Elimination (DCE, 데드 코드 제거) 도구가 더 이상 사용되지 않습니다. DCE 도구는 현재 더 이상 사용되지 않는 레거시 JS 백엔드용으로 설계되었습니다. 현재 [JS IR 백엔드](#dce-and-javascript-ir-compiler)는 DCE를 기본적으로 지원하며, [@JsExport annotation](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/)을 사용하면 DCE 중에 유지할 Kotlin 함수 및 클래스를 지정할 수 있습니다.

Kotlin Multiplatform Gradle 플러그인에는 _[dead code elimination](https://wikipedia.org/wiki/Dead_code_elimination)_(데드 코드 제거, _DCE_) 도구가 포함되어 있습니다. 데드 코드 제거는 종종 _tree shaking_이라고도 합니다. 이는 사용되지 않는 속성, 함수 및 클래스를 제거하여 결과 JavaScript 코드의 크기를 줄입니다.

사용되지 않는 선언은 다음과 같은 경우에 나타날 수 있습니다.

* 함수가 인라인되고 직접 호출되지 않는 경우(몇 가지 경우를 제외하고 항상 발생합니다).
* 모듈이 공유 라이브러리를 사용하는 경우. DCE가 없으면 사용하지 않는 라이브러리 부분도 결과 번들에 포함됩니다.
  예를 들어, Kotlin 표준 라이브러리에는 목록, 배열, 문자 시퀀스, DOM용 어댑터 등을 조작하는 함수가 포함되어 있습니다.
  이러한 모든 기능은 JavaScript 파일로 약 1.3MB가 필요합니다. 간단한 "Hello, world" 애플리케이션은 콘솔 루틴만 필요하며, 전체 파일 크기는 몇 킬로바이트에 불과합니다.

Kotlin Multiplatform Gradle 플러그인은 `browserProductionWebpack` 작업 사용과 같이 **production bundle**을 빌드할 때 DCE를 자동으로 처리합니다. **Development bundling** 작업(`browserDevelopmentWebpack` 등)에는 DCE가 포함되지 않습니다.

## DCE and JavaScript IR compiler

IR 컴파일러를 사용한 DCE 적용은 다음과 같습니다.

* 개발용으로 컴파일할 때는 DCE가 비활성화되며, 이는 다음 Gradle 작업에 해당합니다.
  * `browserDevelopmentRun`
  * `browserDevelopmentWebpack`
  * `nodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * 이름에 "development"가 포함된 기타 Gradle 작업
* 프로덕션용으로 컴파일할 때는 DCE가 활성화되며, 이는 다음 Gradle 작업에 해당합니다.
  * `browserProductionRun`
  * `browserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  * 이름에 "production"이 포함된 기타 Gradle 작업

@JsExport annotation을 사용하면 DCE가 루트로 처리할 선언을 지정할 수 있습니다.

## Exclude declarations from DCE

모듈에서 사용하지 않더라도 결과 JavaScript 코드에서 함수 또는 클래스를 유지해야 할 수 있습니다.
예를 들어 클라이언트 JavaScript 코드에서 사용할 예정인 경우입니다.

특정 선언이 제거되지 않도록 하려면 `dceTask` 블록을 Gradle 빌드 스크립트에 추가하고
`keep` 함수의 인수로 선언을 나열합니다. 인수는 모듈 이름을 접두사로 사용하는 선언의 정규화된 이름이어야 합니다.
`moduleName.dot.separated.package.name.declarationName`

달리 지정하지 않는 한, 함수 및 모듈 이름은 생성된 JavaScript 코드에서 [mangled](js-to-kotlin-interop#jsname-annotation)될 수 있습니다.
이러한 함수가 제거되지 않도록 하려면 `keep` 인수에 생성된 JavaScript 코드에 나타나는 망글링된 이름을 사용하십시오.

:::

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

전체 패키지 또는 모듈이 제거되지 않도록 하려면 생성된 JavaScript 코드에 나타나는 정규화된 이름을 사용할 수 있습니다.

:::note
전체 패키지 또는 모듈이 제거되지 않도록 하면 DCE가 사용되지 않는 많은 선언을 제거하지 못할 수 있습니다. 이 때문에 DCE에서 제외해야 하는 개별 선언을 하나씩 선택하는 것이 좋습니다.

:::

## Disable DCE

DCE를 완전히 끄려면 `dceTask`에서 `devMode` 옵션을 사용하십시오.

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
```