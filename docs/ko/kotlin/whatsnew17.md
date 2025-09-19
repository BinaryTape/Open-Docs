[//]: # (title: Kotlin 1.7.0의 새로운 기능)

<tldr>
   <p>Kotlin 1.7.0용 IDE 지원은 IntelliJ IDEA 2021.2, 2021.3 및 2022.1에서 사용할 수 있습니다.</p>
</tldr>

_[릴리스됨: 2022년 6월 9일](releases.md#release-details)_

Kotlin 1.7.0이 릴리스되었습니다. 이 버전은 새로운 Kotlin/JVM K2 컴파일러의 알파 (Alpha) 버전을 공개하고, 언어 기능을 안정화하며, JVM, JS 및 Native 플랫폼에 대한 성능 개선을 제공합니다.

이번 버전의 주요 업데이트 목록은 다음과 같습니다.

*   [새로운 Kotlin K2 컴파일러는 현재 알파 버전입니다](#new-kotlin-k2-compiler-for-the-jvm-in-alpha). 이 컴파일러는 상당한 성능 개선을 제공합니다. JVM에서만 사용할 수 있으며, kapt를 포함한 어떤 컴파일러 플러그인도 이와 함께 작동하지 않습니다.
*   [Gradle에서 점진적 컴파일에 대한 새로운 접근 방식](#a-new-approach-to-incremental-compilation). 이제 종속된 비-Kotlin 모듈 내의 변경 사항에 대해서도 점진적 컴파일이 지원되며 Gradle과 호환됩니다.
*   [옵트인 (opt-in) 요구 사항 어노테이션](#stable-opt-in-requirements), [명확히 null을 허용하지 않는 타입](#stable-definitely-non-nullable-types), [빌더 추론](#stable-builder-inference)을 안정화했습니다.
*   [이제 타입 인자에 대한 언더스코어 연산자가 있습니다](#underscore-operator-for-type-arguments). 다른 타입이 지정되었을 때 인자의 타입을 자동으로 추론하는 데 사용할 수 있습니다.
*   [이번 릴리스에서는 인라인 클래스의 인라인된 값에 대한 위임을 통한 구현을 허용합니다](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class). 이제 대부분의 경우 메모리를 할당하지 않는 경량 래퍼를 생성할 수 있습니다.

이 비디오에서 변경 사항에 대한 간략한 개요를 확인할 수도 있습니다.

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="What's new in Kotlin 1.7.0"/>

## JVM용 새로운 Kotlin K2 컴파일러(알파 버전)

이번 Kotlin 릴리스는 새로운 Kotlin K2 컴파일러의 **알파 (Alpha)** 버전을 소개합니다. 새로운 컴파일러는 새로운 언어 기능 개발 속도를 높이고, Kotlin이 지원하는 모든 플랫폼을 통합하며, 성능 개선을 가져오고, 컴파일러 확장을 위한 API를 제공하는 것을 목표로 합니다.

저희는 이미 새로운 컴파일러와 그 장점에 대한 자세한 설명을 게시했습니다.

*   [새로운 Kotlin 컴파일러를 향한 여정 (The Road to the New Kotlin Compiler)](https://www.youtube.com/watch?v=iTdJJq_LyoY)
*   [K2 컴파일러: 탑다운 뷰 (K2 Compiler: a Top-Down View)](https://www.youtube.com/watch?v=db19VFLZqJM)

새로운 K2 컴파일러의 알파 버전은 주로 성능 개선에 중점을 두었으며 JVM 프로젝트에서만 작동한다는 점을 강조하는 것이 중요합니다. Kotlin/JS, Kotlin/Native 또는 다른 멀티플랫폼 프로젝트를 지원하지 않으며, [kapt](kapt.md)를 포함한 어떤 컴파일러 플러그인도 함께 작동하지 않습니다.

저희 벤치마크는 내부 프로젝트에서 뛰어난 결과를 보여줍니다.

| 프로젝트       | 현재 Kotlin 컴파일러 성능 | 새로운 K2 Kotlin 컴파일러 성능 | 성능 향상 |
|---------------|-------------------------------------|------------------------------------|-------------------|
| Kotlin        | 2.2 KLOC/s                          | 4.8 KLOC/s                         | ~ x2.2            |
| YouTrack      | 1.8 KLOC/s                          | 4.2 KLOC/s                         | ~ x2.3            |
| IntelliJ IDEA | 1.8 KLOC/s                          | 3.9 KLOC/s                         | ~ x2.2            |
| Space         | 1.2 KLOC/s                          | 2.8 KLOC/s                         | ~ x2.3            |

> KLOC/s 성능 수치는 컴파일러가 초당 처리하는 코드의 천 단위 라인 수를 의미합니다.
>
> {style="tip"}

JVM 프로젝트에서 성능 향상을 확인하고 이전 컴파일러의 결과와 비교할 수 있습니다. Kotlin K2 컴파일러를 활성화하려면 다음 컴파일러 옵션을 사용하십시오.

```bash
-Xuse-k2
```

또한 K2 컴파일러에는 [여러 버그 수정 사항이 포함되어 있습니다](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved). 이 목록에서 **State: Open** 상태인 문제도 K2에서는 실제로 수정되었으니 참고하십시오.

다음 Kotlin 릴리스에서는 K2 컴파일러의 안정성을 개선하고 더 많은 기능을 제공할 예정이니, 계속 지켜봐 주십시오!

Kotlin K2 컴파일러에서 성능 문제가 발생하는 경우 [이슈 트래커에 보고해 주십시오](https://kotl.in/issue).

## 언어

Kotlin 1.7.0은 위임을 통한 구현 (implementation by delegation) 지원과 타입 인자를 위한 새로운 언더스코어 연산자를 도입합니다. 또한 이전 릴리스에서 프리뷰 (preview)로 소개되었던 여러 언어 기능을 안정화합니다.

*   [인라인 클래스의 인라인된 값에 대한 위임을 통한 구현](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
*   [타입 인자를 위한 언더스코어 연산자](#underscore-operator-for-type-arguments)
*   [안정적인 빌더 추론](#stable-builder-inference)
*   [안정적인 옵트인 (opt-in) 요구 사항](#stable-opt-in-requirements)
*   [안정적인 명확히 null을 허용하지 않는 타입](#stable-definitely-non-nullable-types)

### 인라인 클래스의 인라인된 값에 위임을 통한 구현 허용

값이나 클래스 인스턴스를 위한 경량 래퍼를 생성하려면 모든 인터페이스 메서드를 직접 구현해야 합니다. 위임을 통한 구현 (Implementation by delegation)은 이 문제를 해결하지만, 1.7.0 이전에는 인라인 클래스와 함께 작동하지 않았습니다. 이 제한이 제거되어 이제 대부분의 경우 메모리를 할당하지 않는 경량 래퍼를 생성할 수 있습니다.

```kotlin
interface Bar {
    fun foo() = "foo"
}

@JvmInline
value class BarWrapper(val bar: Bar): Bar by bar

fun main() {
    val bw = BarWrapper(object: Bar {})
    println(bw.foo())
}
```

### 타입 인자를 위한 언더스코어 연산자

Kotlin 1.7.0은 타입 인자를 위한 언더스코어 연산자 `_`를 도입합니다. 다른 타입이 지정되었을 때 타입 인자를 자동으로 추론하는 데 사용할 수 있습니다.

```kotlin
abstract class SomeClass<T> {
    abstract fun execute(): T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run(): T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // SomeImplementation이 SomeClass<String>에서 파생되었으므로 T는 String으로 추론됩니다.
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // OtherImplementation이 SomeClass<Int>에서 파생되었으므로 T는 Int로 추론됩니다.
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

> 변수 목록의 어느 위치에서든 언더스코어 연산자를 사용하여 타입 인자를 추론할 수 있습니다.
>
{style="note"}

### 안정적인 빌더 추론

빌더 추론 (Builder inference)은 제네릭 빌더 함수를 호출할 때 유용한 특별한 타입 추론 방식입니다. 람다 인자 내의 다른 호출에 대한 타입 정보를 사용하여 호출의 타입 인자를 컴파일러가 추론하도록 돕습니다.

1.7.0부터 빌더 추론은 일반적인 타입 추론이 타입에 대한 충분한 정보를 얻을 수 없을 때, 즉 [1.6.0에 도입된](whatsnew16.md#changes-to-builder-inference) `-Xenable-builder-inference` 컴파일러 옵션을 지정하지 않아도 자동으로 활성화됩니다.

[커스텀 제네릭 빌더 작성 방법](using-builders-with-builder-inference.md)에 대해 자세히 알아보세요.

### 안정적인 옵트인 (opt-in) 요구 사항

[옵트인 (Opt-in) 요구 사항](opt-in-requirements.md)은 이제 [Stable](components-stability.md)이며 추가적인 컴파일러 구성이 필요하지 않습니다.

1.7.0 이전에는 옵트인 기능 자체에 경고를 피하기 위해 `-opt-in=kotlin.RequiresOptIn` 인자가 필요했습니다. 이제는 더 이상 필요하지 않지만, 다른 어노테이션이나 [모듈](opt-in-requirements.md#opt-in-a-module)에 옵트인하기 위해 `-opt-in` 컴파일러 인자를 계속 사용할 수 있습니다.

### 안정적인 명확히 null을 허용하지 않는 타입

Kotlin 1.7.0에서는 명확히 null을 허용하지 않는 타입 (definitely non-nullable types)이 [Stable](components-stability.md)로 승격되었습니다. 이는 제네릭 Java 클래스 및 인터페이스를 확장할 때 더 나은 상호 운용성을 제공합니다.

새로운 구문 `T & Any`를 사용하여 사용 위치에서 제네릭 타입 파라미터를 명확히 null을 허용하지 않는 것으로 표시할 수 있습니다. 이 구문 형식은 [교차 타입 (intersection types)](https://en.wikipedia.org/wiki/Intersection_type) 표기법에서 유래했으며, 이제 `&`의 왼쪽에 nullable 상위 바운드 (upper bound)가 있는 타입 파라미터와 오른쪽에 non-nullable `Any`로 제한됩니다.

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // Error: 'null' cannot be a value of a non-null type
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // Error: 'null' cannot be a value of a non-null type
    elvisLike<String?>(null, null).length
}
```

명확히 null을 허용하지 않는 타입에 대해 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)에서 자세히 알아보세요.

## Kotlin/JVM

이번 릴리스는 Kotlin/JVM 컴파일러의 성능 개선과 새로운 컴파일러 옵션을 제공합니다. 또한 함수형 인터페이스 생성자에 대한 호출 가능한 참조 (callable references)가 Stable이 되었습니다. 1.7.0부터 Kotlin/JVM 컴파일의 기본 타겟 버전은 `1.8`입니다.

*   [컴파일러 성능 최적화](#compiler-performance-optimizations)
*   [새로운 컴파일러 옵션 `-Xjdk-release`](#new-compiler-option-xjdk-release)
*   [함수형 인터페이스 생성자에 대한 안정적인 호출 가능한 참조](#stable-callable-references-to-functional-interface-constructors)
*   [JVM 타겟 버전 1.6 제거](#removed-jvm-target-version-1-6)

### 컴파일러 성능 최적화

Kotlin 1.7.0은 Kotlin/JVM 컴파일러의 성능 개선을 도입합니다. 저희 벤치마크에 따르면 Kotlin 1.6.0에 비해 컴파일 시간이 [평균 10% 단축](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0)되었습니다. 예를 들어, [kotlinx.html을 사용하는 프로젝트](https://youtrack.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster)와 같이 인라인 함수를 많이 사용하는 프로젝트는 바이트코드 후처리 개선 덕분에 더 빠르게 컴파일될 것입니다.

### 새로운 컴파일러 옵션: -Xjdk-release

Kotlin 1.7.0은 새로운 컴파일러 옵션 `-Xjdk-release`를 제공합니다. 이 옵션은 [javac의 커맨드라인 `--release` 옵션](http://openjdk.java.net/jeps/247)과 유사합니다. `-Xjdk-release` 옵션은 타겟 바이트코드 버전을 제어하고, 클래스패스에 있는 JDK의 API를 지정된 Java 버전으로 제한합니다. 예를 들어, `kotlinc -Xjdk-release=1.8`은 종속성에 있는 JDK 버전이 9 이상이라도 `java.lang.Module`을 참조할 수 없도록 합니다.

> 이 옵션은 각 JDK 배포판에 대해 [효과가 보장되지 않습니다](https://youtrack.jetbrains.com/issue/KT-29974).
>
{style="note"}

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to)에 피드백을 남겨주십시오.

### 함수형 인터페이스 생성자에 대한 안정적인 호출 가능한 참조

함수형 인터페이스 생성자에 대한 [호출 가능한 참조 (Callable references)](reflection.md#callable-references)는 이제 [Stable](components-stability.md)입니다. 호출 가능한 참조를 사용하여 생성자 함수가 있는 인터페이스에서 함수형 인터페이스로 [마이그레이션하는 방법](fun-interfaces.md#migration-from-an-interface-with-constructor-function-to-a-functional-interface)을 알아보십시오.

발견한 모든 문제는 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)에 보고해 주십시오.

### JVM 타겟 버전 1.6 제거

Kotlin/JVM 컴파일의 기본 타겟 버전은 `1.8`입니다. `1.6` 타겟은 제거되었습니다.

JVM 타겟 1.8 이상으로 마이그레이션하십시오. 다음 환경에서 JVM 타겟 버전을 업데이트하는 방법을 알아보세요.

*   [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
*   [Maven](maven.md#attributes-specific-to-jvm)
*   [커맨드라인 컴파일러](compiler-reference.md#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0에는 Objective-C 및 Swift 상호 운용성에 대한 변경 사항이 포함되어 있으며, 이전 릴리스에서 도입된 기능을 안정화합니다. 또한 새로운 메모리 관리자에 대한 성능 개선 및 기타 업데이트를 제공합니다.

*   [새로운 메모리 관리자 성능 개선](#performance-improvements-for-the-new-memory-manager)
*   [JVM 및 JS IR 백엔드와 통합된 컴파일러 플러그인 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
*   [독립형 Android 실행 파일 지원](#support-for-standalone-android-executables)
*   [Swift async/await와의 상호 운용성: KotlinUnit 대신 Void 반환](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
*   [Objective-C 브리지를 통한 선언되지 않은 예외 금지](#prohibited-undeclared-exceptions-through-objective-c-bridges)
*   [향상된 CocoaPods 통합](#improved-cocoapods-integration)
*   [Kotlin/Native 컴파일러 다운로드 URL 재정의](#overriding-the-kotlin-native-compiler-download-url)

### 새로운 메모리 관리자 성능 개선

> 새로운 Kotlin/Native 메모리 관리자는 [알파 (Alpha) 버전](components-stability.md)입니다.
> 향후 호환되지 않게 변경될 수 있으며 수동 마이그레이션이 필요할 수 있습니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에 피드백을 주시면 감사하겠습니다.
>
{style="note"}

새로운 메모리 관리자는 아직 알파 버전이지만, [Stable](components-stability.md)로 향하는 길에 있습니다. 이번 릴리스에서는 새로운 메모리 관리자에 대한 상당한 성능 개선, 특히 가비지 컬렉션 (GC)에서 이루어졌습니다. 특히 [1.6.20에 도입된](whatsnew1620.md) 스윕 (sweep) 단계의 동시 구현이 이제 기본적으로 활성화됩니다. 이는 애플리케이션이 GC를 위해 일시 중지되는 시간을 줄이는 데 도움이 됩니다. 새로운 GC 스케줄러는 특히 더 큰 힙 (heap)에서 GC 빈도를 더 잘 선택합니다.

또한, 디버그 바이너리 (debug binary)를 특별히 최적화하여 메모리 관리자의 구현 코드에서 적절한 최적화 수준과 링크 타임 (link-time) 최적화가 사용되도록 했습니다. 이는 벤치마크에서 디버그 바이너리의 실행 시간을 약 30% 개선하는 데 도움이 되었습니다.

프로젝트에서 새로운 메모리 관리자를 사용해 보고 어떻게 작동하는지 확인한 후 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에 피드백을 공유해 주십시오.

### JVM 및 JS IR 백엔드와 통합된 컴파일러 플러그인 ABI

Kotlin 1.7.0부터 Kotlin Multiplatform Gradle 플러그인은 기본적으로 Kotlin/Native용 임베더블 (embeddable) 컴파일러 JAR를 사용합니다. 이 [기능은 1.6.0에 실험적으로 발표되었으며](whatsnew16.md#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends), 이제 Stable이며 사용할 준비가 되었습니다.

이 개선 사항은 라이브러리 작성자에게 매우 유용하며, 컴파일러 플러그인 개발 경험을 향상시킵니다. 이 릴리스 이전에는 Kotlin/Native용 별도 아티팩트 (artifact)를 제공해야 했지만, 이제는 Native 및 다른 지원되는 플랫폼에 동일한 컴파일러 플러그인 아티팩트를 사용할 수 있습니다.

> 이 기능은 플러그인 개발자가 기존 플러그인에 대한 마이그레이션 단계를 수행해야 할 수도 있습니다.
>
> [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-48595)에서 플러그인 업데이트를 준비하는 방법을 알아보세요.
>
{style="warning"}

### 독립형 Android 실행 파일 지원

Kotlin 1.7.0은 Android Native 타겟용 표준 실행 파일을 생성하는 것을 완전히 지원합니다. 이 [기능은 1.6.20에 도입되었으며](whatsnew1620.md#support-for-standalone-android-executables), 이제 기본적으로 활성화됩니다.

Kotlin/Native가 공유 라이브러리를 생성하던 이전 동작으로 되돌리려면 다음 설정을 사용하십시오.

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### Swift async/await와의 상호 운용성: KotlinUnit 대신 Void 반환

Kotlin `suspend` 함수는 이제 Swift에서 `KotlinUnit` 타입 대신 `Void` 타입을 반환합니다. 이는 Swift의 `async`/`await`와의 상호 운용성 개선의 결과입니다. 이 [기능은 1.6.20에 도입되었으며](whatsnew1620.md#interop-with-swift-async-await-returning-void-instead-of-kotlinunit), 이번 릴리스에서는 이 동작이 기본적으로 활성화됩니다.

더 이상 `kotlin.native.binary.unitSuspendFunctionObjCExport=proper` 속성을 사용하여 이러한 함수에 대한 올바른 타입을 반환할 필요가 없습니다.

### Objective-C 브리지를 통한 선언되지 않은 예외 금지

Kotlin 코드를 Swift/Objective-C 코드에서 호출하거나(또는 그 반대) 이 코드가 예외를 던지는 경우, 예외가 발생한 코드에서 처리되어야 합니다. 단, 적절한 변환(예: `@Throws` 어노테이션 사용)을 통해 언어 간에 예외 전달을 명시적으로 허용한 경우는 제외합니다.

이전에는 Kotlin에 선언되지 않은 예외가 일부 경우 한 언어에서 다른 언어로 "누출"될 수 있는 의도치 않은 동작이 있었습니다. Kotlin 1.7.0은 해당 문제를 수정했으며, 이제 그러한 경우는 프로그램 종료로 이어집니다.

따라서 예를 들어 Kotlin에 `{ throw Exception() }` 람다가 있고 이를 Swift에서 호출하는 경우, Kotlin 1.7.0에서는 예외가 Swift 코드에 도달하는 즉시 종료됩니다. 이전 Kotlin 버전에서는 그러한 예외가 Swift 코드로 누출될 수 있었습니다.

`@Throws` 어노테이션은 이전과 동일하게 작동합니다.

### 향상된 CocoaPods 통합

Kotlin 1.7.0부터 프로젝트에 CocoaPods를 통합하려면 더 이상 `cocoapods-generate` 플러그인을 설치할 필요가 없습니다.

이전에는 Kotlin Multiplatform Mobile 프로젝트에서 [iOS 종속성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-dependencies.html#with-cocoapods)을 처리하는 등 CocoaPods를 사용하려면 CocoaPods 종속성 관리자와 `cocoapods-generate` 플러그인을 모두 설치해야 했습니다.

이제 CocoaPods 통합 설정이 더 쉬워졌으며, Ruby 3 이상에서 `cocoapods-generate`가 설치되지 않던 문제를 해결했습니다. 이제 Apple M1에서 더 잘 작동하는 최신 Ruby 버전도 지원합니다.

[초기 CocoaPods 통합 설정 방법](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html#set-up-an-environment-to-work-with-cocoapods)을 참조하십시오.

### Kotlin/Native 컴파일러 다운로드 URL 재정의

Kotlin 1.7.0부터 Kotlin/Native 컴파일러의 다운로드 URL을 사용자 지정할 수 있습니다. 이는 CI에서 외부 링크가 금지된 경우에 유용합니다.

기본 기본 URL `https://download.jetbrains.com/kotlin/native/builds`를 재정의하려면 다음 Gradle 속성을 사용하십시오.

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

> 다운로더는 실제 컴파일러 배포판을 다운로드하도록 이 기본 URL에 네이티브 버전과 타겟 OS를 추가합니다.
>
{style="note"}

## Kotlin/JS

Kotlin/JS는 [JS IR 컴파일러 백엔드](js-ir-compiler.md)에 대한 추가 개선 사항과 개발 경험을 향상시킬 수 있는 다른 업데이트를 제공합니다.

*   [새로운 IR 백엔드 성능 개선](#performance-improvements-for-the-new-ir-backend)
*   [IR 사용 시 멤버 이름 최소화 (Minification)](#minification-for-member-names-when-using-ir)
*   [IR 백엔드에서 폴리필 (polyfills)을 통한 이전 브라우저 지원](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
*   [JS 표현식에서 JavaScript 모듈 동적 로드](#dynamically-load-javascript-modules-from-js-expressions)
*   [JavaScript 테스트 러너용 환경 변수 지정](#specify-environment-variables-for-javascript-test-runners)

### 새로운 IR 백엔드 성능 개선

이번 릴리스에는 개발 경험을 향상시킬 주요 업데이트가 있습니다.

*   Kotlin/JS의 점진적 컴파일 성능이 크게 향상되었습니다. JS 프로젝트를 빌드하는 데 시간이 덜 걸립니다. 점진적 리빌드는 이제 많은 경우 레거시 백엔드와 거의 동등한 수준이 되어야 합니다.
*   Kotlin/JS 최종 번들의 공간이 덜 필요합니다. 최종 아티팩트 (artifact) 크기를 크게 줄였기 때문입니다. 일부 대형 프로젝트의 경우 프로덕션 번들 크기가 레거시 백엔드에 비해 최대 20% 감소한 것으로 측정되었습니다.
*   인터페이스에 대한 타입 검사가 몇 배 더 향상되었습니다.
*   Kotlin이 더 고품질의 JS 코드를 생성합니다.

### IR 사용 시 멤버 이름 최소화 (Minification)

Kotlin/JS IR 컴파일러는 이제 Kotlin 클래스와 함수의 관계에 대한 내부 정보를 사용하여 더 효율적인 최소화 (minification)를 적용하여 함수, 속성 및 클래스의 이름을 단축합니다. 이는 결과 번들된 애플리케이션의 크기를 줄입니다.

이러한 유형의 최소화는 프로덕션 모드에서 Kotlin/JS 애플리케이션을 빌드할 때 자동으로 적용되며 기본적으로 활성화되어 있습니다. 멤버 이름 최소화를 비활성화하려면 `-Xir-minimized-member-names` 컴파일러 플래그를 사용하십시오.

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### IR 백엔드에서 폴리필 (polyfills)을 통한 이전 브라우저 지원

Kotlin/JS용 IR 컴파일러 백엔드는 이제 레거시 백엔드와 동일한 폴리필 (polyfills)을 포함합니다. 이를 통해 새로운 컴파일러로 컴파일된 코드가 Kotlin 표준 라이브러리에서 사용하는 모든 ES2015 메서드를 지원하지 않는 이전 브라우저에서 실행될 수 있습니다. 프로젝트에서 실제로 사용되는 폴리필만 최종 번들에 포함되어 번들 크기에 미치는 잠재적 영향을 최소화합니다.

이 기능은 IR 컴파일러를 사용할 때 기본적으로 활성화되어 있으며, 별도로 구성할 필요가 없습니다.

### JS 표현식에서 JavaScript 모듈 동적 로드

JavaScript 모듈을 사용할 때 대부분의 애플리케이션은 정적 임포트 (import)를 사용하며, 이는 [JavaScript 모듈 통합](js-modules.md)에서 다룹니다. 그러나 Kotlin/JS는 애플리케이션에서 런타임에 JavaScript 모듈을 동적으로 로드하는 메커니즘이 부족했습니다.

Kotlin 1.7.0부터 JavaScript의 `import` 문이 `js` 블록에서 지원되어 런타임에 패키지를 애플리케이션으로 동적으로 가져올 수 있습니다.

```kotlin
val myPackage = js("import('my-package')")
```

### JavaScript 테스트 러너용 환경 변수 지정

Node.js 패키지 해상도 (resolution)를 조정하거나 Node.js 테스트에 외부 정보를 전달하기 위해 이제 JavaScript 테스트 러너에서 사용하는 환경 변수를 지정할 수 있습니다. 환경 변수를 정의하려면 빌드 스크립트의 `testTask` 블록 내에서 키-값 쌍과 함께 `environment()` 함수를 사용하십시오.

```kotlin
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}
```

## 표준 라이브러리

Kotlin 1.7.0에서는 표준 라이브러리에 다양한 변경 사항과 개선 사항이 적용되었습니다. 새로운 기능을 도입하고, 실험적인 기능을 안정화하며, Native, JS, JVM에서 명명된 캡처 그룹 (named capturing groups) 지원을 통합합니다.

*   [min() 및 max() 컬렉션 함수가 null을 허용하지 않는 형태로 반환](#min-and-max-collection-functions-return-as-non-nullable)
*   [특정 인덱스에서의 정규 표현식 매칭](#regular-expression-matching-at-specific-indices)
*   [이전 언어 및 API 버전 확장 지원](#extended-support-for-previous-language-and-api-versions)
*   [리플렉션을 통한 어노테이션 접근](#access-to-annotations-via-reflection)
*   [안정적인 깊은 재귀 함수](#stable-deep-recursive-functions)
*   [기본 타임 소스에 대한 인라인 클래스 기반 타임 마크](#time-marks-based-on-inline-classes-for-default-time-source)
*   [Java Optional을 위한 새로운 실험적인 확장 함수](#new-experimental-extension-functions-for-java-optionals)
*   [JS 및 Native에서 명명된 캡처 그룹 지원](#support-for-named-capturing-groups-in-js-and-native)

### min() 및 max() 컬렉션 함수가 null을 허용하지 않는 형태로 반환

[Kotlin 1.4.0](whatsnew14.md)에서 `min()` 및 `max()` 컬렉션 함수의 이름을 `minOrNull()` 및 `maxOrNull()`로 변경했습니다. 이 새로운 이름은 수신 컬렉션이 비어 있을 경우 null을 반환하는 동작을 더 잘 반영합니다. 또한 Kotlin 컬렉션 API 전체에서 사용되는 명명 규칙과 함수의 동작을 일치시키는 데 도움이 되었습니다.

`minBy()`, `maxBy()`, `minWith()`, `maxWith()`도 마찬가지였으며, 모두 Kotlin 1.4.0에서 `*OrNull()` 동의어를 얻었습니다. 이 변경의 영향을 받은 이전 함수들은 점진적으로 지원 중단되었습니다.

Kotlin 1.7.0은 원래 함수 이름을 다시 도입하지만, null을 허용하지 않는 반환 타입을 가집니다. 새로운 `min()`, `max()`, `minBy()`, `maxBy()`, `minWith()`, `maxWith()` 함수는 이제 컬렉션 요소를 엄격하게 반환하거나 예외를 던집니다.

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### 특정 인덱스에서의 정규 표현식 매칭

[1.5.30에 도입된](whatsnew1530.md#matching-with-regex-at-a-particular-position) `Regex.matchAt()` 및 `Regex.matchesAt()` 함수는 이제 Stable입니다. 이 함수들은 `String` 또는 `CharSequence` 내의 특정 위치에서 정규 표현식이 정확히 일치하는지 확인하는 방법을 제공합니다.

`matchesAt()`은 일치 여부를 확인하고 boolean 결과를 반환합니다.

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // 정규 표현식: 한 자리 숫자, 점, 한 자리 숫자, 점, 한 자리 이상 숫자
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()`은 일치하는 경우 일치 항목을 반환하고, 그렇지 않으면 `null`을 반환합니다.

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-34021)에 대한 피드백에 감사드립니다.

### 이전 언어 및 API 버전 확장 지원

광범위한 이전 Kotlin 버전에서 소비될 수 있는 라이브러리를 개발하는 라이브러리 작성자를 지원하고, 주요 Kotlin 릴리스의 증가하는 빈도에 대처하기 위해 이전 언어 및 API 버전에 대한 지원을 확장했습니다.

Kotlin 1.7.0부터는 이전 언어 및 API 버전을 두 개가 아닌 세 개를 지원합니다. 즉, Kotlin 1.7.0은 Kotlin 버전 1.4.0까지의 라이브러리 개발을 지원합니다. 하위 호환성에 대한 자세한 내용은 [호환성 모드](compatibility-modes.md)를 참조하십시오.

### 리플렉션을 통한 어노테이션 접근

[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 확장 함수는 [1.6.0에 처음 도입되었으며](whatsnew16.md#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target), 이제 [Stable](components-stability.md)입니다. 이 [리플렉션](reflection.md) 함수는 개별적으로 적용되었거나 반복된 어노테이션을 포함하여 요소에 있는 지정된 타입의 모든 어노테이션을 반환합니다.

```kotlin
@Repeatable
annotation class Tag(val name: String)

@Tag("First Tag")
@Tag("Second Tag")
fun taggedFunction() {
    println("I'm a tagged function!")
}

fun main() {
    val x = ::taggedFunction
    val foo = x as KAnnotatedElement
    println(foo.findAnnotations<Tag>()) // [@Tag(name=First Tag), @Tag(name=Second Tag)]
}
```

### 안정적인 깊은 재귀 함수

깊은 재귀 함수는 [Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines)부터 실험적인 기능으로 제공되었으며, Kotlin 1.7.0에서 이제 [Stable](components-stability.md)입니다. `DeepRecursiveFunction`을 사용하면 실제 호출 스택 대신 힙 (heap)에 스택을 유지하는 함수를 정의할 수 있습니다. 이를 통해 매우 깊은 재귀 계산을 실행할 수 있습니다. 깊은 재귀 함수를 호출하려면 `invoke`합니다.

이 예제에서는 깊은 재귀 함수를 사용하여 이진 트리의 깊이를 재귀적으로 계산합니다. 이 샘플 함수는 재귀적으로 100,000번 호출되지만 `StackOverflowError`는 발생하지 않습니다.

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t ->
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // 깊이가 100,000인 트리를 생성합니다.
    val deepTree = generateSequence(Tree(null, null)) { prev ->
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

재귀 깊이가 1000번 호출을 초과하는 코드에서는 깊은 재귀 함수를 사용하는 것을 고려하십시오.

### 기본 타임 소스에 대한 인라인 클래스 기반 타임 마크

Kotlin 1.7.0은 `TimeSource.Monotonic`이 반환하는 타임 마크 (time mark)를 인라인 값 클래스 (inline value classes)로 변경하여 시간 측정 기능의 성능을 향상시킵니다. 이는 `markNow()`, `elapsedNow()`, `measureTime()`, `measureTimedValue()`와 같은 함수를 호출할 때 `TimeMark` 인스턴스에 대한 래퍼 클래스를 할당하지 않는다는 것을 의미합니다. 특히 핫 패스 (hot path)의 일부인 코드 조각을 측정할 때, 이는 측정의 성능 영향을 최소화하는 데 도움이 될 수 있습니다.

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // 반환된 `TimeMark`는 인라인 클래스입니다.
    val elapsedDuration = mark.elapsedNow()
}
```

> 이 최적화는 `TimeMark`가 얻어진 타임 소스가 정적으로 `TimeSource.Monotonic`으로 알려진 경우에만 사용할 수 있습니다.
>
{style="note"}

### Java Optional을 위한 새로운 실험적인 확장 함수

Kotlin 1.7.0은 Java의 `Optional` 클래스 작업을 단순화하는 새로운 편의 함수들을 제공합니다. 이 새로운 함수들은 JVM에서 Optional 객체를 언래핑 (unwrap)하고 변환하는 데 사용될 수 있으며, Java API 작업의 간결성을 높이는 데 도움이 됩니다.

`getOrNull()`, `getOrDefault()`, `getOrElse()` 확장 함수는 `Optional`이 존재할 경우 값을 가져올 수 있게 합니다. 그렇지 않으면 각각 `null`, 기본 값, 또는 함수가 반환하는 값을 얻게 됩니다.

```kotlin
val presentOptional = Optional.of("I'm here!")

println(presentOptional.getOrNull())
// "I'm here!"

val absentOptional = Optional.empty<String>()

println(absentOptional.getOrNull())
// null
println(absentOptional.getOrDefault("Nobody here!"))
// "Nobody here!"
println(absentOptional.getOrElse {
    println("Optional was absent!")
    "Default value!"
})
// "Optional was absent!"
// "Default value!"
```

`toList()`, `toSet()`, `asSequence()` 확장 함수는 존재하는 `Optional`의 값을 리스트, 세트 또는 시퀀스로 변환하거나, 그렇지 않으면 빈 컬렉션을 반환합니다. `toCollection()` 확장 함수는 `Optional` 값을 이미 존재하는 대상 컬렉션에 추가합니다.

```kotlin
val presentOptional = Optional.of("I'm here!")
val absentOptional = Optional.empty<String>()
println(presentOptional.toList() + "," + absentOptional.toList())
// ["I'm here!"], []
println(presentOptional.toSet() + "," + absentOptional.toSet())
// ["I'm here!"], []
val myCollection = mutableListOf<String>()
absentOptional.toCollection(myCollection)
println(myCollection)
// []
presentOptional.toCollection(myCollection)
println(myCollection)
// ["I'm here!"]
val list = listOf(presentOptional, absentOptional).flatMap { it.asSequence() }
println(list)
// ["I'm here!"]
```

이러한 확장 함수는 Kotlin 1.7.0에서 실험적으로 도입되었습니다. `Optional` 확장에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/pull/291)에서 확인할 수 있습니다. 언제나처럼, [Kotlin 이슈 트래커](https://kotl.in/issue)에 피드백을 환영합니다.

### JS 및 Native에서 명명된 캡처 그룹 지원

Kotlin 1.7.0부터는 명명된 캡처 그룹 (named capturing groups)이 JVM뿐만 아니라 JS 및 Native 플랫폼에서도 지원됩니다.

캡처 그룹에 이름을 부여하려면 정규 표현식에서 (`?<name>group`) 구문을 사용하십시오. 그룹에 의해 일치된 텍스트를 얻으려면 새로 도입된 [`MatchGroupCollection.get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/get.html) 함수를 호출하고 그룹 이름을 전달하십시오.

#### 이름으로 일치된 그룹 값 검색

도시 좌표를 매칭하는 이 예제를 고려해 보십시오. 정규 표현식과 일치하는 그룹 컬렉션을 얻으려면 [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)를 사용하십시오. 그룹의 내용을 번호(인덱스)와 `value`를 사용한 이름으로 검색하는 것을 비교하십시오.

```kotlin
fun main() {
    val regex = "\\b(?<city>[A-Za-z\\s]+),\\s(?<state>[A-Z]{2}):\\s(?<areaCode>[0-9]{3})\\b".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    val match = regex.find(input)!!
    println(match.groups["city"]?.value) // "Austin" — 이름으로
    println(match.groups[2]?.value) // "TX" — 번호로
}
```

#### 명명된 역참조 (backreferencing)

이제 그룹을 역참조 (backreferencing)할 때 그룹 이름을 사용할 수도 있습니다. 역참조는 이전에 캡처 그룹에 의해 일치된 동일한 텍스트를 일치시킵니다. 이를 위해 정규 표현식에서 `\k<name>` 구문을 사용하십시오.

```kotlin
fun backRef() {
    val regex = "(?<title>\\w+), yes \\k<title>".toRegex()
    val match = regex.find("Do you copy? Sir, yes Sir!")!!
    println(match.value) // "Sir, yes Sir"
    println(match.groups["title"]?.value) // "Sir"
}
```

#### 대체 표현식의 명명된 그룹

명명된 그룹 참조는 대체 표현식 (replacement expression)과 함께 사용될 수 있습니다. 입력의 지정된 정규 표현식의 모든 발생을 대체 표현식으로 대체하는 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 함수와 첫 번째 일치만 교환하는 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) 함수를 고려해 보십시오.

대체 문자열에서 `${name}`의 발생은 지정된 이름의 캡처된 그룹에 해당하는 서브시퀀스로 대체됩니다. 그룹 참조에서 이름과 인덱스로 대체하는 것을 비교할 수 있습니다.

```kotlin
fun dateReplace() {
    val dateRegex = Regex("(?<dd>\\d{2})-(?<mm>\\d{2})-(?<yyyy>\\d{4})")
    val input = "Date of birth: 27-04-2022"
    println(dateRegex.replace(input, "\${yyyy}-\${mm}-\${dd}")) // "Date of birth: 2022-04-27" — 이름으로
    println(dateRegex.replace(input, "\$3-\$2-\$1")) // "Date of birth: 2022-04-27" — 번호로
}
```

## Gradle

이번 릴리스는 새로운 빌드 보고서, Gradle 플러그인 변형 (variants) 지원, kapt의 새로운 통계 등 다양한 기능을 제공합니다.

*   [점진적 컴파일에 대한 새로운 접근 방식](#a-new-approach-to-incremental-compilation)
*   [컴파일러 성능 추적을 위한 새로운 빌드 보고서](#build-reports-for-kotlin-compiler-tasks)
*   [Gradle 및 Android Gradle 플러그인의 최소 지원 버전 변경](#bumping-minimum-supported-versions)
*   [Gradle 플러그인 변형 지원](#support-for-gradle-plugin-variants)
*   [Kotlin Gradle 플러그인 API의 업데이트](#updates-in-the-kotlin-gradle-plugin-api)
*   [plugins API를 통한 sam-with-receiver 플러그인 사용 가능](#the-sam-with-receiver-plugin-is-available-via-the-plugins-api)
*   [컴파일 태스크의 변경 사항](#changes-in-compile-tasks)
*   [kapt에서 각 어노테이션 프로세서에 의해 생성된 파일의 새로운 통계](#statistics-of-generated-files-by-each-annotation-processor-in-kapt)
*   [kotlin.compiler.execution.strategy 시스템 속성 지원 중단](#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)
*   [지원 중단된 옵션, 메서드 및 플러그인 제거](#removal-of-deprecated-options-methods-and-plugins)

### 점진적 컴파일에 대한 새로운 접근 방식

> 점진적 컴파일의 새로운 접근 방식은 [실험적 (Experimental) 기능](components-stability.md)입니다. 언제든지 변경되거나 제거될 수 있습니다.
> 옵트인 (Opt-in)이 필요합니다 (자세한 내용은 아래 참조). 평가 목적으로만 사용하시길 권장하며, [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.7.0에서는 모듈 간 변경 사항에 대한 점진적 컴파일을 재작업했습니다. 이제 종속된 비-Kotlin 모듈 내의 변경 사항에 대해서도 점진적 컴파일이 지원되며, [Gradle 빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)와 호환됩니다. 컴파일 회피 (compilation avoidance)에 대한 지원도 향상되었습니다.

빌드 캐시를 사용하거나 비-Kotlin Gradle 모듈에서 자주 변경하는 경우 새로운 접근 방식의 가장 큰 이점을 보게 될 것으로 예상합니다. `kotlin-gradle-plugin` 모듈의 Kotlin 프로젝트에 대한 저희 테스트에서는 캐시 적중 후 변경 사항에 대해 80% 이상의 개선을 보여줍니다.

이 새로운 접근 방식을 사용해 보려면 `gradle.properties`에 다음 옵션을 설정하십시오.

```none
kotlin.incremental.useClasspathSnapshot=true
```

> 점진적 컴파일의 새로운 접근 방식은 현재 Gradle 빌드 시스템의 JVM 백엔드에서만 사용할 수 있습니다.
>
{style="note"}

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)에서 점진적 컴파일의 새로운 접근 방식이 내부적으로 어떻게 구현되었는지 알아보세요.

저희의 계획은 이 기술을 안정화하고 다른 백엔드(예: JS) 및 빌드 시스템에 대한 지원을 추가하는 것입니다. 이 컴파일 스키마에서 발생하는 모든 문제나 이상한 동작에 대해 [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 보고해 주시면 감사하겠습니다. 감사합니다!

Kotlin 팀은 [Ivan Gavrilovic](https://github.com/gavra0), [Hung Nguyen](https://github.com/hungvietnguyen), [Cédric Champeau](https://github.com/melix) 및 다른 외부 기여자들의 도움에 매우 감사드립니다.

### Kotlin 컴파일러 태스크를 위한 빌드 보고서

> Kotlin 빌드 보고서는 [실험적 (Experimental) 기능](components-stability.md)입니다. 언제든지 변경되거나 제거될 수 있습니다.
> 옵트인 (Opt-in)이 필요합니다 (자세한 내용은 아래 참조). 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.7.0은 컴파일러 성능을 추적하는 데 도움이 되는 빌드 보고서를 도입합니다. 보고서에는 다양한 컴파일 단계의 지속 시간과 컴파일이 점진적일 수 없었던 이유가 포함됩니다.

빌드 보고서는 다음과 같은 컴파일러 태스크 문제를 조사할 때 유용합니다.

*   Gradle 빌드가 너무 오래 걸리고 성능 저하의 근본 원인을 파악하고 싶을 때.
*   동일한 프로젝트의 컴파일 시간이 다를 때(때로는 몇 초, 때로는 몇 분).

빌드 보고서를 활성화하려면 `gradle.properties`에 빌드 보고서 출력 저장 위치를 선언하십시오.

```none
kotlin.build.report.output=file
```

다음 값(및 조합)을 사용할 수 있습니다.

*   `file`은 빌드 보고서를 로컬 파일에 저장합니다.
*   `build_scan`은 [빌드 스캔](https://scans.gradle.com/)의 `custom values` 섹션에 빌드 보고서를 저장합니다.

    > Gradle Enterprise 플러그인은 사용자 정의 값의 수와 길이를 제한합니다. 대규모 프로젝트에서는 일부 값이 손실될 수 있습니다.
    >
    {style="note"}

*   `http`는 HTTP(S)를 사용하여 빌드 보고서를 POST합니다. POST 메서드는 JSON 형식으로 메트릭 (metric)을 보냅니다. 데이터는 버전마다 변경될 수 있습니다. 전송된 데이터의 현재 버전은 [Kotlin 저장소](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)에서 확인할 수 있습니다.

오래 실행되는 컴파일에 대한 빌드 보고서 분석이 해결하는 데 도움이 될 수 있는 두 가지 일반적인 경우가 있습니다.

*   빌드가 점진적이지 않았습니다. 원인을 분석하고 근본적인 문제를 해결하십시오.
*   빌드는 점진적이었지만 너무 오래 걸렸습니다. 소스 파일을 재구성해 보십시오. 즉, 큰 파일을 분할하고, 별도의 클래스를 다른 파일에 저장하고, 큰 클래스를 리팩터링하고, 최상위 함수를 다른 파일에 선언하는 등입니다.

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/)에서 새로운 빌드 보고서에 대해 자세히 알아보세요.

인프라에서 빌드 보고서를 사용해 보는 것을 환영합니다. 피드백이 있거나, 문제가 발생하거나, 개선 사항을 제안하고 싶다면 주저하지 말고 [이슈 트래커](https://youtrack.jetbrains.com/newIssue)에 보고해 주십시오. 감사합니다!

### 최소 지원 버전 올리기

Kotlin 1.7.0부터 최소 지원 Gradle 버전은 6.7.1입니다. 저희는 [Gradle 플러그인 변형](#support-for-gradle-plugin-variants)과 새로운 Gradle API를 지원하기 위해 [버전을 올려야 했습니다](https://youtrack.jetbrains.com/issue/KT-49733/Bump-minimal-supported-Gradle-version-to-6-7-1). 앞으로는 Gradle 플러그인 변형 기능 덕분에 최소 지원 버전을 자주 올릴 필요가 없을 것입니다.

또한, 최소 지원 Android Gradle 플러그인 버전은 이제 3.6.4입니다.

### Gradle 플러그인 변형 지원

Gradle 7.0은 Gradle 플러그인 작성자를 위한 새로운 기능인 [플러그인 변형 (plugins with variants)](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)을 도입했습니다. 이 기능은 Gradle 버전 7.1 미만과의 호환성을 유지하면서 새로운 Gradle 기능에 대한 지원을 더 쉽게 추가할 수 있도록 합니다. [Gradle의 변형 선택](https://docs.gradle.org/current/userguide/variant_model.html)에 대해 자세히 알아보십시오.

Gradle 플러그인 변형을 통해 다양한 Gradle 버전에 대해 다양한 Kotlin Gradle 플러그인 변형을 제공할 수 있습니다. 목표는 가장 오래된 지원 Gradle 버전에 해당하는 `main` 변형에서 기본 Kotlin 컴파일을 지원하는 것입니다. 각 변형은 해당 릴리스의 Gradle 기능에 대한 구현을 가질 것입니다. 최신 변형은 가장 넓은 Gradle 기능 세트를 지원할 것입니다. 이 접근 방식을 통해 제한된 기능으로 이전 Gradle 버전에 대한 지원을 확장할 수 있습니다.

현재 Kotlin Gradle 플러그인의 변형은 두 가지뿐입니다.

*   Gradle 버전 6.7.1–6.9.3용 `main`
*   Gradle 버전 7.0 이상용 `gradle70`

향후 Kotlin 릴리스에서는 더 많은 변형을 추가할 수 있습니다.

빌드에서 사용하는 변형을 확인하려면 [`--info` 로그 레벨](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)을 활성화하고 출력에서 `Using Kotlin Gradle plugin`으로 시작하는 문자열(예: `Using Kotlin Gradle plugin main variant`)을 찾으십시오.

> Gradle의 변형 선택과 관련된 몇 가지 알려진 문제에 대한 해결 방법은 다음과 같습니다.
> *   [pluginManagement의 ResolutionStrategy가 멀티 변형 플러그인에서 작동하지 않음](https://github.com/gradle/gradle/issues/20545)
> *   [`buildSrc` 공통 종속성으로 플러그인을 추가할 때 플러그인 변형이 무시됨](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-49227/Support-Gradle-plugins-variants)에 피드백을 남겨주십시오.

### Kotlin Gradle 플러그인 API의 업데이트

Kotlin Gradle 플러그인 API 아티팩트 (artifact)에 여러 개선 사항이 적용되었습니다.

*   사용자가 구성할 수 있는 입력을 가진 Kotlin/JVM 및 Kotlin/kapt 태스크를 위한 새로운 인터페이스가 있습니다.
*   모든 Kotlin 플러그인이 상속하는 새로운 `KotlinBasePlugin` 인터페이스가 있습니다. 이 인터페이스는 Kotlin Gradle 플러그인(JVM, JS, Multiplatform, Native 및 기타 플랫폼)이 적용될 때마다 일부 구성 작업을 트리거하려는 경우에 사용합니다.

    ```kotlin
    project.plugins.withType<org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin>() {
        // 여기에 작업을 구성합니다.
    }
    ```
    `KotlinBasePlugin`에 대한 피드백은 [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-48008/Consider-offering-a-KotlinBasePlugin)에 남겨주십시오.

*   Android Gradle 플러그인이 자체적으로 Kotlin 컴파일을 구성할 수 있도록 기반을 마련했습니다. 즉, 빌드에 Kotlin Android Gradle 플러그인을 추가할 필요가 없습니다.
    [Android Gradle Plugin 릴리스 공지](https://developer.android.com/studio/releases/gradle-plugin)를 확인하여 추가된 지원에 대해 알아보고 사용해 보십시오!

### plugins API를 통한 sam-with-receiver 플러그인 사용 가능

[sam-with-receiver 컴파일러 플러그인](sam-with-receiver-plugin.md)은 이제 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)을 통해 사용할 수 있습니다.

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.sam.with.receiver") version "$kotlin_version"
}
```

### 컴파일 태스크의 변경 사항

이번 릴리스에서 컴파일 태스크에 많은 변경 사항이 있었습니다.

*   Kotlin 컴파일 태스크는 더 이상 Gradle `AbstractCompile` 태스크를 상속하지 않습니다. 이제 `DefaultTask`만 상속합니다.
*   `AbstractCompile` 태스크에는 `sourceCompatibility` 및 `targetCompatibility` 입력이 있습니다. `AbstractCompile` 태스크가 더 이상 상속되지 않으므로 이러한 입력은 Kotlin 사용자 스크립트에서 더 이상 사용할 수 없습니다.
*   `SourceTask.stableSources` 입력은 더 이상 사용할 수 없으며, `sources` 입력을 사용해야 합니다. `setSource(...)` 메서드는 여전히 사용할 수 있습니다.
*   모든 컴파일 태스크는 이제 컴파일에 필요한 라이브러리 목록에 `libraries` 입력을 사용합니다. `KotlinCompile` 태스크는 여전히 지원 중단된 Kotlin 속성 `classpath`를 가지고 있으며, 이는 향후 릴리스에서 제거될 예정입니다.
*   컴파일 태스크는 여전히 `PatternFilterable` 인터페이스를 구현하며, 이는 Kotlin 소스의 필터링을 허용합니다. `sourceFilesExtensions` 입력은 `PatternFilterable` 메서드를 사용하는 것을 선호하여 제거되었습니다.
*   지원 중단된 `Gradle destinationDir: File` 출력은 `destinationDirectory: DirectoryProperty` 출력으로 대체되었습니다.
*   Kotlin/Native `AbstractNativeCompile` 태스크는 이제 `AbstractKotlinCompileTool` 기본 클래스를 상속합니다. 이는 Kotlin/Native 빌드 도구를 다른 모든 도구에 통합하기 위한 초기 단계입니다.

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-32805)에 피드백을 남겨주십시오.

### kapt에서 각 어노테이션 프로세서에 의해 생성된 파일의 새로운 통계

`kotlin-kapt` Gradle 플러그인은 이미 [각 프로세서에 대한 성능 통계를 보고](https://github.com/JetBrains/kotlin/pull/4280)합니다. Kotlin 1.7.0부터는 각 어노테이션 프로세서에 의해 생성된 파일 수에 대한 통계도 보고할 수 있습니다.

이는 빌드의 일부로 사용되지 않는 어노테이션 프로세서가 있는지 추적하는 데 유용합니다. 생성된 보고서를 사용하여 불필요한 어노테이션 프로세서를 트리거하는 모듈을 찾아 업데이트하여 이를 방지할 수 있습니다.

두 단계로 통계를 활성화하십시오.

*   `build.gradle.kts`에서 `showProcessorStats` 플래그를 `true`로 설정하십시오.

    ```kotlin
    kapt {
        showProcessorStats = true
    }
    ```

*   `gradle.properties`에서 `kapt.verbose` Gradle 속성을 `true`로 설정하십시오.
    
    ```none
    kapt.verbose=true
    ```

> [커맨드 라인 옵션 `verbose`](kapt.md#use-in-cli)를 통해서도 상세 출력을 활성화할 수 있습니다.
>
{style="note"}

통계는 `info` 레벨로 로그에 나타납니다. `Annotation processor stats:` 줄 뒤에 각 어노테이션 프로세서의 실행 시간에 대한 통계가 표시됩니다. 이 줄 뒤에는 `Generated files report:` 줄이 나오고 각 어노테이션 프로세서에 의해 생성된 파일 수에 대한 통계가 표시됩니다. 예:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-51132/KAPT-Support-reporting-the-number-of-generated-files-by-each-ann)에 피드백을 남겨주십시오.

### kotlin.compiler.execution.strategy 시스템 속성 지원 중단

Kotlin 1.6.20은 [Kotlin 컴파일러 실행 전략을 정의하기 위한 새로운 속성](whatsnew1620.md#properties-for-defining-kotlin-compiler-execution-strategy)을 도입했습니다. Kotlin 1.7.0에서는 이전 시스템 속성 `kotlin.compiler.execution.strategy`에 대한 지원 중단 주기가 시작되었으며, 새로운 속성들이 이를 대체합니다.

`kotlin.compiler.execution.strategy` 시스템 속성을 사용하면 경고 메시지가 표시됩니다. 이 속성은 향후 릴리스에서 삭제될 예정입니다. 이전 동작을 유지하려면 시스템 속성을 동일한 이름의 Gradle 속성으로 교체하십시오. 예를 들어, `gradle.properties`에서 다음과 같이 할 수 있습니다.

```none
kotlin.compiler.execution.strategy=out-of-process
```

컴파일 태스크 속성 `compilerExecutionStrategy`도 사용할 수 있습니다. [Gradle 페이지](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)에서 이에 대해 자세히 알아보십시오.

### 지원 중단된 옵션, 메서드 및 플러그인 제거

#### useExperimentalAnnotation 메서드 제거

Kotlin 1.7.0에서는 `useExperimentalAnnotation` Gradle 메서드에 대한 지원 중단 주기를 완료했습니다. 대신 모듈에서 API를 사용하기 위해 옵트인 (opt-in)하려면 `optIn()`을 사용하십시오.

예를 들어 Gradle 모듈이 멀티플랫폼인 경우:

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

Kotlin의 [옵트인 (opt-in) 요구 사항](opt-in-requirements.md)에 대해 자세히 알아보십시오.

#### 지원 중단된 컴파일러 옵션 제거

여러 컴파일러 옵션에 대한 지원 중단 주기를 완료했습니다.

*   `kotlinOptions.jdkHome` 컴파일러 옵션은 1.5.30에서 지원 중단되었으며 현재 릴리스에서 제거되었습니다. 이 옵션을 포함하는 Gradle 빌드는 이제 실패합니다. Kotlin 1.5.30부터 지원되는 [Java 툴체인 (toolchains)](whatsnew1530.md#support-for-java-toolchains)을 사용하는 것을 권장합니다.
*   지원 중단된 `noStdlib` 컴파일러 옵션도 제거되었습니다. Gradle 플러그인은 Kotlin 표준 라이브러리가 있는지 여부를 제어하기 위해 `kotlin.stdlib.default.dependency=true` 속성을 사용합니다.

> 컴파일러 인자 `-jdkHome` 및 `-no-stdlib`는 여전히 사용할 수 있습니다.
>
{style="note"}

#### 지원 중단된 플러그인 제거

Kotlin 1.4.0에서 `kotlin2js` 및 `kotlin-dce-plugin` 플러그인은 지원 중단되었으며, 이 릴리스에서 제거되었습니다. `kotlin2js` 대신 새로운 `org.jetbrains.kotlin.js` 플러그인을 사용하십시오. 데드 코드 제거 (DCE)는 Kotlin/JS Gradle 플러그인이 올바르게 구성된 경우 작동합니다.

Kotlin 1.6.0에서는 `KotlinGradleSubplugin` 클래스의 지원 중단 수준을 `ERROR`로 변경했습니다. 개발자들은 이 클래스를 컴파일러 플러그인 작성을 위해 사용했습니다. 이 릴리스에서는 [이 클래스가 제거되었습니다](https://youtrack.jetbrains.com/issue/KT-48831/). 대신 `KotlinCompilerPluginSupportPlugin` 클래스를 사용하십시오.

> 가장 좋은 방법은 프로젝트 전체에서 Kotlin 플러그인을 1.7.0 이상 버전으로 사용하는 것입니다.
>
{style="tip"}

#### 지원 중단된 코루틴 DSL 옵션 및 속성 제거

지원 중단된 `kotlin.experimental.coroutines` Gradle DSL 옵션과 `gradle.properties`에서 사용되던 `kotlin.coroutines` 속성을 제거했습니다. 이제 [일시 중단 함수 (suspending functions)](coroutines-basics.md#extract-function-refactoring)를 사용하거나 빌드 스크립트에 [`kotlinx.coroutines` 종속성](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)을 추가하기만 하면 됩니다.

[코루틴 가이드](coroutines-guide.md)에서 코루틴에 대해 자세히 알아보세요.

#### 툴체인 (toolchain) 확장 메서드의 타입 캐스트 제거

Kotlin 1.7.0 이전에는 Kotlin DSL로 Gradle 툴체인 (toolchain)을 구성할 때 `JavaToolchainSpec` 클래스로 타입 캐스트 (type cast)를 수행해야 했습니다.

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

이제 `(this as JavaToolchainSpec)` 부분을 생략할 수 있습니다.

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

## Kotlin 1.7.0으로 마이그레이션

### Kotlin 1.7.0 설치

IntelliJ IDEA 2022.1 및 Android Studio Chipmunk (212)는 Kotlin 플러그인을 1.7.0으로 자동으로 업데이트하도록 제안합니다.

> IntelliJ IDEA 2022.2, Android Studio Dolphin (213) 또는 Android Studio Electric Eel (221)의 경우, Kotlin 플러그인 1.7.0은 향후 IntelliJ IDEA 및 Android Studio 업데이트와 함께 제공될 예정입니다.
> 
{style="note"}

새로운 커맨드라인 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.7.0)에서 다운로드할 수 있습니다.

### 기존 프로젝트 마이그레이션 또는 Kotlin 1.7.0으로 새 프로젝트 시작

*   기존 프로젝트를 Kotlin 1.7.0으로 마이그레이션하려면 Kotlin 버전을 `1.7.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 임포트하십시오. [Kotlin 1.7.0으로 업데이트하는 방법](releases.md#update-to-a-new-kotlin-version)을 알아보세요.

*   Kotlin 1.7.0으로 새 프로젝트를 시작하려면 Kotlin 플러그인을 업데이트하고 **File** | **New** | **Project**에서 프로젝트 마법사를 실행하십시오.

### Kotlin 1.7.0 호환성 가이드

Kotlin 1.7.0은 [기능 릴리스](kotlin-evolution-principles.md#language-and-tooling-releases)이므로, 이전 버전의 언어로 작성된 코드와 호환되지 않는 변경 사항을 가져올 수 있습니다.
그러한 변경 사항에 대한 자세한 목록은 [Kotlin 1.7.0 호환성 가이드](compatibility-guide-17.md)에서 확인할 수 있습니다.