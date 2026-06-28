[//]: # (title: Kotlin %kotlinEapVersion%의 새로운 기능)

<primary-label ref="eap"/>

<web-summary>Kotlin EAP(Early Access Preview) 릴리스 노트를 읽고 최신 실험적 Kotlin 기능을 공식 출시 전에 미리 사용해 보세요.</web-summary>

_[출시일: %kotlinEapReleaseDate%](eap.md#build-details)_

> 이 문서는 EAP(Early Access Preview) 릴리스의 모든 기능을 다루지는 않지만, 주요 개선 사항을 중점적으로 설명합니다.
>
> 전체 변경 사항 목록은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)에서 확인하세요.
>
{style="note"}

Kotlin %kotlinEapVersion% 버전이 출시되었습니다! 이번 EAP 릴리스의 주요 내용은 다음과 같습니다:

* **표준 라이브러리**: [코루틴 스택 추적 복구(Coroutine stack trace recovery) 지원](#standard-library-support-for-coroutine-stack-trace-recovery)
* **Kotlin/Native**: [.klib 아티팩트의 증분 컴파일(Incremental compilation) 기본 활성화](#kotlin-native-incremental-compilation-enabled-by-default)
* **Kotlin/Wasm**: [최상위 require() 호출 변경 및 컴패니언 객체(Companion object) 초기화 순서 개선](#kotlin-wasm)
* **Kotlin/JS**: [브라우저 테스트를 위한 새로운 DSL](#kotlin-js-new-dsl-for-browser-testing)
* **빌드 도구 API**: [새로운 타겟 지원: Kotlin/JS, Kotlin/Wasm 및 Kotlin 메타데이터](#build-tools-api-support-for-kotlin-js-kotlin-wasm-and-kotlin-metadata)

> Kotlin 릴리스 주기에 대한 정보는 [Kotlin 릴리스 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## Kotlin %kotlinEapVersion%으로 업데이트

최신 버전의 Kotlin은 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 및 [Android Studio](https://developer.android.com/studio)에 포함되어 있습니다.

새로운 Kotlin 버전으로 업데이트하려면 IDE가 최신 버전인지 확인하고, 빌드 스크립트에서 [Kotlin 버전을 %kotlinEapVersion%으로 변경](releases.md#update-to-a-new-kotlin-version)하세요.

## 표준 라이브러리: 코루틴 스택 추적 복구 지원
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion%은 표준 라이브러리에 `StackTraceRecoverable` 인터페이스를 추가합니다. 이는 `kotlinx.coroutines` 라이브러리에 대한 의존성을 추가하지 않고도 스택 추적 복구(stack trace recovery)를 위해 새로운 예외 인스턴스를 생성하는 방법을 정의할 수 있게 함으로써 `kotlinx.coroutines` 라이브러리와의 통합을 개선합니다.

스택 추적 복구는 한 코루틴이 예외를 던지고 다른 코루틴이 이를 다시 던질(rethrow) 때 디버깅을 도와줍니다. 이를 통해 예외가 어디에서 시작되었는지, 그리고 다른 코루틴이 어디에서 이를 다시 던졌는지 확인할 수 있습니다.

`kotlinx.coroutines` 라이브러리는 추가적인 코루틴 스택 추적 정보를 포함하는 새로운 예외 인스턴스를 생성하여 스택 추적 복구를 수행합니다. 이는 예외 메시지, 원인(cause), 혹은 둘 다를 받거나 인자가 없는 생성자를 가진 예외에 대해 자동으로 이루어집니다.

만약 예외 생성자에 줄 번호나 에러 코드와 같은 추가적인 필수 인자가 있다면, `StackTraceRecoverable` 인터페이스를 구현하여 `kotlinx.coroutines` 라이브러리가 해당 예외의 새 인스턴스를 생성하는 방법을 정의하세요.

이를 위해 `copyForStackTraceRecovery()` 함수를 오버라이드하세요. 이 함수는 스택 추적 복구를 위한 새로운 예외 인스턴스를 반환하거나, `kotlinx.coroutines` 라이브러리가 예외를 복사하지 않기를 원한다면 `null`을 반환합니다.

> `StackTraceRecoverable` 인터페이스는 모든 타겟에서 사용할 수 있지만, `kotlinx.coroutines` 라이브러리는 현재 JVM에서만 이를 스택 추적 복구에 사용합니다.
>
{style="note"}

이 API들은 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계이며 `@OptIn(ExperimentalStdlibCoroutineSupportApi::class)` 어노테이션을 통한 옵트인이 필요합니다.

다음은 스택 추적 복구를 위해 새 인스턴스를 생성할 때 `line` 프로퍼티를 유지하는 커스텀 예외의 예시입니다:

```kotlin
import kotlin.coroutines.ExperimentalStdlibCoroutineSupportApi
import kotlin.coroutines.StackTraceRecoverable

@OptIn(ExperimentalStdlibCoroutineSupportApi::class)
class FileEditException
// 원인(cause)을 IllegalStateException 생성자에 전달하기 위해 
// 프라이빗 생성자가 필요합니다.
private constructor(
    val line: Int,
    private val detail: String,
    cause: Throwable?,
) : IllegalStateException("When editing line $line: $detail", cause),
    // 스택 추적 복구를 위해 StackTraceRecoverable을 구현합니다.
    StackTraceRecoverable<FileEditException> {

    constructor(line: Int, detail: String) : this(line, detail, null)

    // 줄 번호와 메시지 상세 내용을 복사합니다.
    override fun copyForStackTraceRecovery(): FileEditException =
        FileEditException(line, detail, this)
}

@OptIn(ExperimentalStdlibCoroutineSupportApi::class) 
fun main() {
    val original = FileEditException(15, "Unexpected token")
    val copy = original.copyForStackTraceRecovery()

    println(copy.message)
    // When editing line 15: Unexpected token

    println(copy.cause == original)
    // true
}
```

자세한 내용은 해당 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0461-stacktrace-recoverable.md)을 참조하세요. 의견이 있으시면 [YouTrack](https://youtrack.jetbrains.com/issue/KT-86595)을 통해 공유해 주세요.

## Kotlin/Native: 증분 컴파일 기본 활성화

%kotlinEapVersion%부터 `.klib` 아티팩트의 증분 컴파일(Incremental compilation)이 기본적으로 활성화됩니다.

증분 컴파일을 사용하면 프로젝트 모듈에서 생성된 `.klib` 아티팩트의 일부만 변경된 경우, `.klib`의 영향을 받는 부분만 바이너리로 다시 컴파일됩니다.

이 최적화는 [Kotlin 1.9.20](whatsnew1920.md#incremental-compilation-of-klib-artifacts)에서 처음 도입되었으며, 디버그 빌드의 컴파일 시간을 대폭 단축하는 것으로 입증되었습니다.

경우에 따라 이 최적화로 인해 클린 빌드(clean builds) 시 성능 비용이 발생할 수 있음에 유의하세요.

이 기능과 관련하여 예상치 못한 문제가 발생하는 경우 수동으로 비활성화할 수 있습니다. 비활성화하려면 `gradle.properties` 파일에 다음 옵션을 설정하세요:

```none
kotlin.incremental.native=false
```

문제 발생 시 [YouTrack](https://kotl.in/issue)에 보고해 주세요. 컴파일 시간 개선에 대한 더 많은 팁은 [문서](native-improving-compilation-time.md)를 참조하세요.

## Kotlin/Wasm

Kotlin %kotlinEapVersion%은 Kotlin/Wasm의 `@JsFun` 선언 내 최상위 `require()` 호출 처리 방식을 변경하고 컴패니언 객체 초기화 순서를 JVM 동작과 정렬합니다.

### @JsFun 선언 내 최상위 require() 호출 변경

Kotlin/Wasm은 이제 `@JsFun` 선언에서 최상위 `require()` 함수를 사용할 때 에러를 보고합니다.

이전에는 컴파일러가 `import-object.mjs` 파일에 `require` 변수를 생성하여 `@JsFun` 선언이 `require()`를 호출할 수 있도록 했습니다.

이 동작은 의도치 않게 컴파일러의 구현 세부 사항을 노출했습니다. 이 방식에서 벗어날 수 있도록 Kotlin/Wasm은 생성된 `require` 선언을 제거하며, 이제 컴파일러는 이러한 호출에 대해 에러를 보고합니다. 예를 들어:

```kotlin
// 에러를 보고합니다
@JsFun("(mod) => require(mod)")
external fun loadModule(mod: String): JsAny
```

이 변경에 대비하려면 `@JsFun` 선언의 최상위 `require()` 호출을 `@JsModule` 어노테이션으로 교체하세요:

```kotlin
@JsModule("module")
external val module: Module

external interface Module {
    // 예상되는 모듈 멤버를 정의합니다
}
```

동적 모듈 로딩의 경우 `import()` 표현식을 대신 사용하세요. webpack이 동적 임포트를 파싱하지 못하도록 `/* webpackIgnore: true */` 매직 주석을 추가하세요:

```kotlin
@JsFun(
    """
    ((module) => () => module)(
        await import(/* webpackIgnore: true */ "module")
    )
"""
)
private external fun loadModuleDynamically(): JsAny?
```

또한 조건부로 `import()` 표현식을 사용할 수도 있습니다. 예를 들어, Node.js에서 실행될 때만 모듈을 로드하도록 할 수 있습니다:

```kotlin
@JsFun(
    """
    ((module) => () => module)(
        ((typeof process !== "undefined") && (process.release.name === "node"))
            ? await import(/* webpackIgnore: true */ "module")
            : null
    )
"""
)
private external fun loadNodeModule(): JsAny?
```

프로젝트가 최상위 `require()` 함수를 필요로 하는 의존성에 의존하고 있다면, 임시 방편으로 `globalThis`의 프로퍼티로 추가할 수 있습니다:

```kotlin
@JsFun(
    """
    ((module) => {
        globalThis.require = module.default.createRequire(import.meta.url)
        return () => {}
    })(await import("node:module"))
"""
)
external fun defineRequire()
```

문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/projects/KT/issues/KT-86192)를 통해 의견을 공유해 주세요.

### 컴패니언 객체 초기화 순서 개선

Kotlin/Wasm은 이제 JVM 동작과 일치하도록 하위 클래스 컴패니언 객체보다 상위 클래스 컴패니언 객체를 먼저 초기화합니다. 이전에는 초기화 순서가 반대로 될 수 있어 플랫폼 간에 일관되지 않은 동작이 발생할 수 있었습니다.

이 업데이트는 플랫폼 간 일관성을 향상시키고 클래스 초기화 동작의 플랫폼별 차이를 줄여줍니다. 또한 중간 클래스가 컴패니언 객체를 선언하지 않은 경우를 포함하여, 더 깊은 상속 계층 구조에서도 컴패니언 객체 초기화를 올바르게 처리할 수 있게 합니다.

## Kotlin/JS: 브라우저 테스트를 위한 새로운 DSL
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion%은 브라우저 환경에서 Kotlin/JS 테스트를 실행하기 위한 새로운 실험적 DSL을 도입합니다.

현재 Kotlin Gradle 플러그인은 [Karma](https://github.com/karma-runner/karma)를 브라우저 런처로 사용하여 다양한 브라우저에서 JavaScript 테스트를 실행합니다. Karma 프로젝트는 이미 2년 동안 지원 중단(deprecated) 상태였으며, 이로 인해 브라우저 테스트를 지원하는 대안적인 방법을 모색하게 되었습니다.

새로운 DSL은 내부적으로 다양한 도구를 관리하는 Karma를 대체하기 위해 고안되었으며 다음을 포함합니다:

* 테스트 러너로서의 [Mocha](https://mochajs.org/).
* 번들러로서의 [Webpack](https://webpack.js.org/) (향후 릴리스에서 [Vite](https://vite.dev/)로 [교체될 예정](https://youtrack.jetbrains.com/issue/KT-48308/)입니다).
* Chromium, Firefox 및 WebKit(Safari) 브라우저 엔진을 지원하는 브라우저 드라이버 및 배포 관리자로서의 [Playwright](https://playwright.dev/).

새로운 테스트 DSL을 사용해 보려면 Kotlin/JS 타겟의 `browser{}` 블록 안에 옵트인이 필요한 `test{}` 블록을 추가하세요:

```kotlin
kotlin {
    js {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            // 새로운 test{} 블록 추가 및 구성
            test {
                // 모든 브라우저에 공통적인 옵션 설정
                browserDefaults {
                    timeout = Duration.ofSeconds(2)
                    headless = true
                }
                // Chromium 테스트 러너 활성화
                chromium {
                    // 공통 타임아웃 옵션 오버라이드
                    timeout = Duration.ofSeconds(5)
                    launchArgs.add("--no-sandbox")
                }
                // Firefox 테스트 러너 활성화
                firefox()
                // WebKit 테스트 러너 활성화
                webkit { }
                // 추가적인 WebKit 테스트 러너 활성화 및 구성
                webkit("noheadless") {
                    // 커스텀 옵션 설정
                    headless = false
                }
            }
        }
    }
}
```

새로운 DSL은 활발히 개발 중입니다. 의견이 있으시면 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66897)을 통해 공유해 주세요.

## 빌드 도구 API: Kotlin/JS, Kotlin/Wasm 및 Kotlin 메타데이터 지원
<primary-label ref="experimental-general"/>

[Kotlin 2.2.0](whatsnew22.md#new-experimental-build-tools-api)에서 빌드 도구 API(Build Tools API, BTA)가 Kotlin/JVM에서 사용 가능해졌습니다. Kotlin 2.4.20-Beta1은 Kotlin/JS, Kotlin/Wasm 및 Kotlin 메타데이터라는 새로운 타겟에 대한 지원을 추가함으로써 BTA 안정화를 향한 다음 단계를 밟습니다.

이를 통해 Kotlin Gradle 플러그인이 컴파일러와 더욱 일관되게 상호작용할 수 있게 됩니다. 일부 경우 더 빠르고 안정적인 컴파일의 혜택을 누릴 수도 있습니다.

BTA는 빌드 시스템과 Kotlin 컴파일러 에코시스템 사이의 추상화 계층 역할을 하는 범용 API입니다. 이는 사용 가능한 빌드 도구에서 Kotlin 기능 지원 및 Kotlin 컴파일러와의 호환성을 유지하는 데 도움을 줍니다.

저희는 Kotlin Gradle 플러그인에서 새로운 타겟에 대한 BTA 지원을 점진적으로 배포할 계획입니다:

* Kotlin 2.4.20-Beta1에서는 피드백을 수집하기 위해 Kotlin/JS, Kotlin/Wasm 및 Kotlin 메타데이터에서 BTA가 기본적으로 활성화됩니다. 프로젝트에서 추가적인 변경은 필요하지 않습니다.
* Kotlin 2.4.20-Beta2와 최종 Kotlin 2.4.20 릴리스 사이에는 새로운 타겟의 BTA를 옵트인 방식으로 사용할 수 있습니다. 사용해 보려면 `gradle.properties` 파일에 해당하는 프로퍼티를 추가하세요:

  ```kotlin
  kotlin.wasm.runViaBuildToolsApi = true
  kotlin.js.runViaBuildToolsApi = true
  kotlin.metadata.runViaBuildToolsApi = true
  ```

* Kotlin 2.5.0부터는 Kotlin/JS, Kotlin/Wasm 및 Kotlin 메타데이터에서 BTA가 다시 기본적으로 활성화될 예정입니다.

BTA 제안에 대해 궁금하거나 의견을 공유하고 싶다면 이 [KEEP](https://github.com/Kotlin/KEEP/blob/build-tools-api/proposals/extensions/build-tools-api.md)을 참조하세요.