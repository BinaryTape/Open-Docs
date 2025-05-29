[//]: # (title: Kotlin 1.7.0의 새로운 기능)

<tldr>
   <p>Kotlin 1.7.0용 IDE 지원은 IntelliJ IDEA 2021.2, 2021.3 및 2022.1에서 사용할 수 있습니다.</p>
</tldr>

_[출시일: 2022년 6월 9일](releases.md#release-details)_

Kotlin 1.7.0이 출시되었습니다. 이 버전에서는 새로운 Kotlin/JVM K2 컴파일러의 알파 버전을 공개하고, 언어 기능을 안정화하며, JVM, JS 및 Native 플랫폼의 성능을 개선합니다.

이번 버전의 주요 업데이트 목록은 다음과 같습니다.

*   [새로운 Kotlin K2 컴파일러가 이제 알파(Alpha) 상태](#new-kotlin-k2-compiler-for-the-jvm-in-alpha)이며, 상당한 성능 개선을 제공합니다. 이는 JVM에서만 사용 가능하며, kapt를 포함한 어떤 컴파일러 플러그인도 함께 작동하지 않습니다.
*   [Gradle의 점진적 컴파일(incremental compilation)에 대한 새로운 접근 방식](#a-new-approach-to-incremental-compilation)이 도입되었습니다. 이제 의존하는 비-Kotlin 모듈 내의 변경 사항에 대해서도 점진적 컴파일이 지원되며 Gradle과 호환됩니다.
*   [옵트인(opt-in) 요구 사항 어노테이션](#stable-opt-in-requirements), [확실히 Non-Nullable 타입](#stable-definitely-non-nullable-types),
    그리고 [빌더 추론](#stable-builder-inference)이 안정화되었습니다.
*   [이제 타입 인수에 언더스코어(underscore) 연산자가 생겼습니다](#underscore-operator-for-type-arguments). 이를 사용하여 다른 타입이 지정되었을 때 인수의 타입을 자동으로 추론할 수 있습니다.
*   [이번 릴리스에서는 인라인 클래스의 인라인된 값에 대한 위임을 통한 구현이 허용됩니다](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class). 이제 대부분의 경우 메모리를 할당하지 않는 경량 래퍼를 생성할 수 있습니다.

이 영상에서 변경 사항에 대한 간략한 개요를 확인할 수도 있습니다.

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="What's new in Kotlin 1.7.0"/>

## JVM용 새로운 Kotlin K2 컴파일러 (알파 버전)

이번 Kotlin 릴리스에서는 새로운 Kotlin K2 컴파일러의 **알파(Alpha)** 버전을 소개합니다. 새로운 컴파일러는 새로운 언어 기능 개발 속도를 높이고, Kotlin이 지원하는 모든 플랫폼을 통합하며, 성능 개선을 가져오고, 컴파일러 확장을 위한 API를 제공하는 것을 목표로 합니다.

새로운 컴파일러와 그 이점에 대한 자세한 설명은 이미 게시했습니다.

*   [새로운 Kotlin 컴파일러로 가는 길 (The Road to the New Kotlin Compiler)](https://www.youtube.com/watch?v=iTdJJq_LyoY)
*   [K2 컴파일러: Top-Down 뷰 (K2 Compiler: a Top-Down View)](https://www.youtube.com/watch?v=db19VFLZqJM)

새로운 K2 컴파일러의 알파 버전에서는 주로 성능 개선에 중점을 두었으며, JVM 프로젝트에서만 작동한다는 점을 지적하는 것이 중요합니다. Kotlin/JS, Kotlin/Native 또는 다른 멀티플랫폼 프로젝트를 지원하지 않으며, [kapt](kapt.md)를 포함한 어떤 컴파일러 플러그인도 함께 작동하지 않습니다.

내부 프로젝트에 대한 벤치마크 결과는 놀라운 성능을 보여줍니다.

| 프로젝트       | 현재 Kotlin 컴파일러 성능 | 새 K2 Kotlin 컴파일러 성능 | 성능 향상 |
|---------------|---------------------------|----------------------------|-------------|
| Kotlin        | 2.2 KLOC/s                | 4.8 KLOC/s                 | ~ x2.2      |
| YouTrack      | 1.8 KLOC/s                | 4.2 KLOC/s                 | ~ x2.3      |
| IntelliJ IDEA | 1.8 KLOC/s                | 3.9 KLOC/s                 | ~ x2.2      |
| Space         | 1.2 KLOC/s                | 2.8 KLOC/s                 | ~ x2.3      |

> KLOC/s 성능 수치는 컴파일러가 초당 처리하는 코드의 천 단위 줄 수를 의미합니다.
>
> {style="tip"}

JVM 프로젝트에서 성능 향상을 확인하고 이전 컴파일러의 결과와 비교해 볼 수 있습니다. Kotlin K2 컴파일러를 활성화하려면 다음 컴파일러 옵션을 사용하세요.

```bash
-Xuse-k2
```

또한, K2 컴파일러는 [다수의 버그 수정을 포함합니다](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved). 이 목록에 있는 **State: Open** 상태의 문제들도 실제로는 K2에서 해결되었음을 참고하세요.

다음 Kotlin 릴리스에서는 K2 컴파일러의 안정성을 개선하고 더 많은 기능을 제공할 예정이므로 계속 지켜봐 주세요!

Kotlin K2 컴파일러에서 성능 문제가 발생하면 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요.

## 언어

Kotlin 1.7.0은 위임을 통한 구현 지원과 타입 인수에 대한 새로운 언더스코어 연산자를 도입합니다. 또한 이전 릴리스에서 미리보기로 도입된 여러 언어 기능을 안정화합니다.

*   [인라인 클래스의 인라인된 값에 대한 위임을 통한 구현](#allow-implementation-by-deegation-to-an-inlined-value-of-an-inline-class)
*   [타입 인수에 대한 언더스코어 연산자](#underscore-operator-for-type-arguments)
*   [빌더 추론 안정화](#stable-builder-inference)
*   [옵트인(opt-in) 요구 사항 안정화](#stable-opt-in-requirements)
*   [확실히 Non-Nullable 타입 안정화](#stable-definitely-non-nullable-types)

### 인라인 클래스의 인라인된 값에 대한 위임을 통한 구현 허용

값 또는 클래스 인스턴스를 위한 경량 래퍼를 생성하려면 모든 인터페이스 메서드를 수동으로 구현해야 합니다. 위임을 통한 구현은 이 문제를 해결하지만, 1.7.0 이전에는 인라인 클래스와 함께 작동하지 않았습니다. 이 제한이 제거되어 이제 대부분의 경우 메모리를 할당하지 않는 경량 래퍼를 생성할 수 있습니다.

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

### 타입 인수에 대한 언더스코어 연산자

Kotlin 1.7.0은 타입 인수에 대한 언더스코어(`_`) 연산자를 도입합니다. 이를 사용하여 다른 타입이 지정되었을 때 타입 인수를 자동으로 추론할 수 있습니다.

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
    // T is inferred as String because SomeImplementation derives from SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T is inferred as Int because OtherImplementation derives from SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

> 타입 인수를 추론하기 위해 변수 목록의 어떤 위치에서도 언더스코어 연산자를 사용할 수 있습니다.
>
{style="note"}

### 빌더 추론 안정화

빌더 추론(builder inference)은 제네릭 빌더 함수를 호출할 때 유용한 특별한 종류의 타입 추론입니다. 이는 람다 인수 내부의 다른 호출에 대한 타입 정보를 사용하여 호출의 타입 인수를 컴파일러가 추론하도록 돕습니다.

1.7.0부터 빌더 추론은 `-Xenable-builder-inference` 컴파일러 옵션을 지정하지 않아도 일반적인 타입 추론이 타입에 대한 충분한 정보를 얻을 수 없는 경우 자동으로 활성화됩니다. 이 옵션은 [1.6.0에 도입되었습니다](whatsnew16.md#changes-to-builder-inference).

[커스텀 제네릭 빌더를 작성하는 방법](using-builders-with-builder-inference.md)을 알아보세요.

### 옵트인(opt-in) 요구 사항 안정화

[옵트인 요구 사항](opt-in-requirements.md)은 이제 [안정화(Stable)](components-stability.md)되었으며 추가적인 컴파일러 구성이 필요하지 않습니다.

1.7.0 이전에는 옵트인 기능 자체에 경고를 피하기 위해 `-opt-in=kotlin.RequiresOptIn` 인수가 필요했습니다. 더 이상 이 인수가 필요하지 않지만, 다른 어노테이션, [모듈](opt-in-requirements.md#opt-in-a-module)에 옵트인하려면 여전히 `-opt-in` 컴파일러 인수를 사용할 수 있습니다.

### 확실히 Non-Nullable 타입 안정화

Kotlin 1.7.0에서는 확실히 Non-Nullable 타입이 [안정화(Stable)](components-stability.md)되었습니다. 이는 제네릭 Java 클래스 및 인터페이스를 확장할 때 더 나은 상호 운용성을 제공합니다.

새로운 구문 `T & Any`를 사용하여 사용 지점에서 제네릭 타입 파라미터를 확실히 Non-Nullable로 표시할 수 있습니다. 이 구문 형식은 [교차 타입(intersection types)](https://en.wikipedia.org/wiki/Intersection_type) 표기법에서 유래했으며, 이제 `&` 왼쪽에는 Nullable 상위 바운드가 있는 타입 파라미터로, 오른쪽에는 Non-Nullable `Any`로 제한됩니다.

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

확실히 Non-Nullable 타입에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)에서 확인할 수 있습니다.

## Kotlin/JVM

이번 릴리스는 Kotlin/JVM 컴파일러의 성능 개선과 새로운 컴파일러 옵션을 제공합니다. 또한, 함수형 인터페이스 생성자에 대한 호출 가능 참조(callable references)가 안정화되었습니다. 1.7.0부터 Kotlin/JVM 컴파일의 기본 대상 버전은 `1.8`입니다.

*   [컴파일러 성능 최적화](#compiler-performance-optimizations)
*   [새로운 컴파일러 옵션 `-Xjdk-release`](#new-compiler-option-xjdk-release)
*   [함수형 인터페이스 생성자에 대한 안정적인 호출 가능 참조](#stable-callable-references-to-functional-interface-constructors)
*   [JVM 대상 버전 1.6 제거](#removed-jvm-target-version-1-6)

### 컴파일러 성능 최적화

Kotlin 1.7.0은 Kotlin/JVM 컴파일러의 성능을 개선합니다. 벤치마크에 따르면, 컴파일 시간이 Kotlin 1.6.0에 비해 [평균 10% 감소했습니다](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0). 예를 들어, 인라인 함수를 많이 사용하는 프로젝트([`kotlinx.html`을 사용하는 프로젝트](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster))는 바이트코드 후처리 개선 덕분에 더 빠르게 컴파일됩니다.

### 새로운 컴파일러 옵션: -Xjdk-release

Kotlin 1.7.0은 새로운 컴파일러 옵션인 `-Xjdk-release`를 제공합니다. 이 옵션은 [javac의 명령줄 `--release` 옵션](http://openjdk.java.net/jeps/247)과 유사합니다. `-Xjdk-release` 옵션은 대상 바이트코드 버전을 제어하고 클래스패스에 있는 JDK API를 지정된 Java 버전으로 제한합니다. 예를 들어, `kotlinc -Xjdk-release=1.8`은 종속성에 있는 JDK 버전이 9 이상이더라도 `java.lang.Module`을 참조할 수 없게 합니다.

> 이 옵션은 각 JDK 배포판에 대해 유효하다고 [보장되지 않습니다](https://youtrack.jetbrains.com/issue/KT-29974).
>
{style="note"}

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to)에 피드백을 남겨주세요.

### 함수형 인터페이스 생성자에 대한 안정적인 호출 가능 참조

함수형 인터페이스 생성자에 대한 [호출 가능 참조(callable references)](reflection.md#callable-references)는 이제 [안정화(Stable)](components-stability.md)되었습니다. 호출 가능 참조를 사용하여 생성자 함수가 있는 인터페이스에서 함수형 인터페이스로 [마이그레이션하는 방법](fun-interfaces.md#migration-from-an-interface-with-constructor-function-to-a-functional-interface)을 알아보세요.

발견하는 모든 문제는 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)에 보고해 주세요.

### JVM 대상 버전 1.6 제거

Kotlin/JVM 컴파일의 기본 대상 버전은 `1.8`입니다. `1.6` 대상은 제거되었습니다.

JVM 대상 1.8 이상으로 마이그레이션하세요. JVM 대상 버전을 업데이트하는 방법은 다음에서 확인할 수 있습니다.

*   [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
*   [Maven](maven.md#attributes-specific-to-jvm)
*   [명령줄 컴파일러](compiler-reference.md#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0은 Objective-C 및 Swift 상호 운용성(interoperability) 변경 사항을 포함하고, 이전 릴리스에서 도입된 기능을 안정화합니다. 또한, 새로운 메모리 관리자의 성능 개선과 기타 업데이트를 제공합니다.

*   [새로운 메모리 관리자 성능 개선](#performance-improvements-for-the-new-memory-manager)
*   [JVM 및 JS IR 백엔드와의 통합 컴파일러 플러그인 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
*   [독립형 Android 실행 파일 지원](#support-for-standalone-android-executables)
*   [Swift async/await와의 상호 운용성: `KotlinUnit` 대신 `Void` 반환](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
*   [Objective-C 브리지를 통한 미선언 예외 금지](#prohibited-undeclared-exceptions-through-objective-c-bridges)
*   [향상된 CocoaPods 통합](#improved-cocoapods-integration)
*   [Kotlin/Native 컴파일러 다운로드 URL 재정의](#overriding-the-kotlin-native-compiler-download-url)

### 새로운 메모리 관리자 성능 개선

> 새로운 Kotlin/Native 메모리 관리자는 [알파(Alpha)](components-stability.md) 상태입니다.
> 향후 호환되지 않게 변경될 수 있으며 수동 마이그레이션이 필요할 수 있습니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에 피드백을 주시면 감사하겠습니다.
>
{style="note"}

새로운 메모리 관리자는 여전히 알파 상태이지만, [안정화(Stable)](components-stability.md) 단계로 나아가고 있습니다.
이번 릴리스는 새로운 메모리 관리자, 특히 가비지 컬렉션(GC)에서 상당한 성능 개선을 제공합니다. 특히, [1.6.20에 도입된](whatsnew1620.md) 스윕(sweep) 단계의 동시 구현이 이제 기본적으로 활성화됩니다. 이는 애플리케이션이 GC를 위해 일시 중지되는 시간을 줄이는 데 도움이 됩니다. 새로운 GC 스케줄러는 특히 더 큰 힙의 경우 GC 빈도를 더 잘 선택합니다.

또한, 메모리 관리자의 구현 코드에서 적절한 최적화 수준 및 링크 타임 최적화가 사용되도록 디버그 바이너리를 특별히 최적화했습니다. 이는 벤치마크에서 디버그 바이너리의 실행 시간을 약 30% 향상시키는 데 도움이 되었습니다.

프로젝트에서 새로운 메모리 관리자를 사용하여 어떻게 작동하는지 확인하고, [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에 피드백을 공유해 주세요.

### JVM 및 JS IR 백엔드와의 통합 컴파일러 플러그인 ABI

Kotlin 1.7.0부터 Kotlin Multiplatform Gradle 플러그인은 기본적으로 Kotlin/Native용 임베디드 컴파일러 JAR을 사용합니다. 이 [기능은 1.6.0에서](whatsnew16.md#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends) 실험적으로 발표되었으며, 이제 안정화되어 사용할 준비가 되었습니다.

이 개선 사항은 컴파일러 플러그인 개발 경험을 향상시켜 라이브러리 작성자에게 매우 유용합니다. 이번 릴리스 이전에는 Kotlin/Native용 별도의 아티팩트를 제공해야 했지만, 이제 Native 및 기타 지원되는 플랫폼에 동일한 컴파일러 플러그인 아티팩트를 사용할 수 있습니다.

> 이 기능은 플러그인 개발자에게 기존 플러그인에 대한 마이그레이션 단계를 요구할 수 있습니다.
>
> [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-48595)에서 업데이트를 위해 플러그인을 준비하는 방법을 알아보세요.
>
{style="warning"}

### 독립형 Android 실행 파일 지원

Kotlin 1.7.0은 Android Native 대상을 위한 표준 실행 파일 생성을 완벽하게 지원합니다.
이 기능은 [1.6.20에 도입되었으며](whatsnew1620.md#support-for-standalone-android-executables), 이제 기본적으로 활성화됩니다.

Kotlin/Native가 공유 라이브러리를 생성하던 이전 동작으로 되돌리려면 다음 설정을 사용하세요.

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### Swift async/await와의 상호 운용성: `KotlinUnit` 대신 `Void` 반환

Kotlin `suspend` 함수는 이제 Swift에서 `KotlinUnit` 대신 `Void` 타입을 반환합니다. 이는 Swift의 `async`/`await`와의 향상된 상호 운용성의 결과입니다. 이 기능은 [1.6.20에 도입되었으며](whatsnew1620.md#interop-with-swift-async-await-returning-void-instead-of-kotlinunit), 이번 릴리스에서는 이 동작을 기본적으로 활성화합니다.

이러한 함수에 대해 적절한 타입을 반환하기 위해 더 이상 `kotlin.native.binary.unitSuspendFunctionObjCExport=proper` 속성을 사용할 필요가 없습니다.

### Objective-C 브리지를 통한 미선언 예외 금지

Kotlin 코드를 Swift/Objective-C 코드에서 호출하거나 그 반대의 경우, 이 코드가 예외를 던지면, 적절한 변환(예: `@Throws` 어노테이션 사용)을 통해 언어 간 예외 전달을 특별히 허용하지 않는 한 예외가 발생한 코드에서 처리되어야 합니다.

이전에는 Kotlin이 의도하지 않은 다른 동작을 가졌는데, 일부 경우 미선언 예외가 한 언어에서 다른 언어로 "누설(leak)"될 수 있었습니다. Kotlin 1.7.0은 이 문제를 수정했으며, 이제 그러한 경우는 프로그램 종료로 이어집니다.

따라서, 예를 들어 Kotlin에 `{ throw Exception() }` 람다가 있고 Swift에서 이를 호출하면, Kotlin 1.7.0에서는 예외가 Swift 코드에 도달하는 즉시 종료됩니다. 이전 Kotlin 버전에서는 이러한 예외가 Swift 코드로 누설될 수 있었습니다.

`@Throws` 어노테이션은 이전과 동일하게 계속 작동합니다.

### 향상된 CocoaPods 통합

Kotlin 1.7.0부터는 프로젝트에 CocoaPods를 통합하려는 경우 더 이상 `cocoapods-generate` 플러그인을 설치할 필요가 없습니다.

이전에는 Kotlin 멀티플랫폼 모바일 프로젝트에서 [iOS 종속성을](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-dependencies.html#with-cocoapods) 처리하는 등 CocoaPods를 사용하려면 CocoaPods 의존성 관리자와 `cocoapods-generate` 플러그인을 모두 설치해야 했습니다.

이제 CocoaPods 통합 설정이 더 쉬워졌으며, Ruby 3 이상에서 `cocoapods-generate`가 설치되지 않던 문제가 해결되었습니다. 이제 Apple M1에서 더 잘 작동하는 최신 Ruby 버전도 지원됩니다.

[초기 CocoaPods 통합 설정 방법](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html#set-up-an-environment-to-work-with-cocoapods)을 확인하세요.

### Kotlin/Native 컴파일러 다운로드 URL 재정의

Kotlin 1.7.0부터 Kotlin/Native 컴파일러의 다운로드 URL을 사용자 정의할 수 있습니다. 이는 CI에서 외부 링크가 금지된 경우에 유용합니다.

기본 URL인 `https://download.jetbrains.com/kotlin/native/builds`를 재정의하려면 다음 Gradle 속성을 사용하세요.

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

> 다운로더는 실제 컴파일러 배포판을 다운로드하기 위해 이 기본 URL에 네이티브 버전과 대상 OS를 추가합니다.
>
{style="note"}

## Kotlin/JS

Kotlin/JS는 [JS IR 컴파일러 백엔드](js-ir-compiler.md)에 대한 추가 개선 사항과 개발 경험을 향상시킬 수 있는 다른 업데이트를 받고 있습니다.

*   [새로운 IR 백엔드 성능 개선](#performance-improvements-for-the-new-ir-backend)
*   [IR 사용 시 멤버 이름 최소화](#minification-for-member-names-when-using-ir)
*   [IR 백엔드에서 폴리필(polyfills)을 통한 이전 브라우저 지원](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
*   [js 표현식에서 JavaScript 모듈 동적으로 로드](#dynamically-load-javascript-modules-from-js-expressions)
*   [JavaScript 테스트 러너용 환경 변수 지정](#specify-environment-variables-for-javascript-test-runners)

### 새로운 IR 백엔드 성능 개선

이번 릴리스에는 개발 경험을 향상시킬 몇 가지 주요 업데이트가 있습니다.

*   Kotlin/JS의 점진적 컴파일 성능이 크게 향상되었습니다. JS 프로젝트를 빌드하는 데 시간이 덜 걸립니다. 이제 점진적 재빌드는 많은 경우에서 레거시 백엔드와 거의 동등한 수준이 될 것입니다.
*   Kotlin/JS 최종 번들이 더 적은 공간을 요구합니다. 최종 아티팩트 크기를 크게 줄였습니다.
    일부 대규모 프로젝트의 경우 프로덕션 번들 크기가 레거시 백엔드에 비해 최대 20% 감소한 것으로 측정되었습니다.
*   인터페이스에 대한 타입 검사가 훨씬 향상되었습니다.
*   Kotlin이 더 고품질의 JS 코드를 생성합니다.

### IR 사용 시 멤버 이름 최소화

Kotlin/JS IR 컴파일러는 이제 Kotlin 클래스 및 함수의 관계에 대한 내부 정보를 사용하여 함수, 속성, 클래스 이름을 단축시키는 등 더 효율적인 최소화(minification)를 적용합니다. 이는 결과로 생성되는 번들 애플리케이션의 크기를 줄입니다.

이러한 유형의 최소화는 프로덕션 모드에서 Kotlin/JS 애플리케이션을 빌드할 때 자동으로 적용되며 기본적으로 활성화됩니다. 멤버 이름 최소화를 비활성화하려면 `-Xir-minimized-member-names` 컴파일러 플래그를 사용하세요.

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### IR 백엔드에서 폴리필(polyfills)을 통한 이전 브라우저 지원

Kotlin/JS용 IR 컴파일러 백엔드는 이제 레거시 백엔드와 동일한 폴리필(polyfill)을 포함합니다. 이를 통해 새로운 컴파일러로 컴파일된 코드가 Kotlin 표준 라이브러리에서 사용되는 ES2015의 모든 메서드를 지원하지 않는 이전 브라우저에서도 실행될 수 있습니다. 프로젝트에서 실제로 사용되는 폴리필만 최종 번들에 포함되어 번들 크기에 미치는 잠재적 영향을 최소화합니다.

이 기능은 IR 컴파일러를 사용할 때 기본적으로 활성화되며, 별도로 구성할 필요가 없습니다.

### js 표현식에서 JavaScript 모듈 동적으로 로드

JavaScript 모듈을 사용할 때 대부분의 애플리케이션은 정적 임포트를 사용하며, 이는 [JavaScript 모듈 통합](js-modules.md)에서 다룹니다. 그러나 Kotlin/JS에는 런타임에 애플리케이션에서 JavaScript 모듈을 동적으로 로드하는 메커니즘이 없었습니다.

Kotlin 1.7.0부터 `js` 블록에서 JavaScript의 `import` 문이 지원되어 런타임에 패키지를 애플리케이션으로 동적으로 가져올 수 있습니다.

```kotlin
val myPackage = js("import('my-package')")
```

### JavaScript 테스트 러너용 환경 변수 지정

Node.js 패키지 해결을 조정하거나 Node.js 테스트에 외부 정보를 전달하려면, 이제 JavaScript 테스트 러너가 사용하는 환경 변수를 지정할 수 있습니다. 환경 변수를 정의하려면 빌드 스크립트의 `testTask` 블록 내에서 키-값 쌍과 함께 `environment()` 함수를 사용하세요.

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

Kotlin 1.7.0에서 표준 라이브러리는 다양한 변경 사항과 개선 사항을 받았습니다. 새로운 기능을 도입하고, 실험적인 기능을 안정화하며, Native, JS, JVM에서 이름 있는 캡처 그룹(named capturing groups) 지원을 통합합니다.

*   [`min()` 및 `max()` 컬렉션 함수가 Non-Nullable을 반환](#min-and-max-collection-functions-return-as-non-nullable)
*   [특정 인덱스에서 정규 표현식 매칭](#regular-expression-matching-at-specific-indices)
*   [이전 언어 및 API 버전 지원 확장](#extended-support-for-previous-language-and-api-versions)
*   [리플렉션을 통한 어노테이션 접근](#access-to-annotations-via-reflection)
*   [안정적인 깊은 재귀 함수](#stable-deep-recursive-functions)
*   [기본 시간 소스에 대한 인라인 클래스 기반 시간 마크](#time-marks-based-on-inline-classes-for-default-time-source)
*   [Java `Optional`에 대한 새로운 실험적 확장 함수](#new-experimental-extension-functions-for-java-optionals)
*   [JS 및 Native에서 이름 있는 캡처 그룹 지원](#support-for-named-capturing-groups-in-js-and-native)

### `min()` 및 `max()` 컬렉션 함수가 Non-Nullable을 반환

[Kotlin 1.4.0](whatsnew14.md)에서는 `min()` 및 `max()` 컬렉션 함수를 `minOrNull()` 및 `maxOrNull()`로 이름을 변경했습니다. 이 새로운 이름들은 수신 컬렉션이 비어 있는 경우 null을 반환하는 동작을 더 잘 반영합니다. 또한, Kotlin 컬렉션 API 전반에 사용되는 명명 규칙과 함수의 동작을 일치시키는 데 도움이 되었습니다.

`minBy()`, `maxBy()`, `minWith()`, `maxWith()`도 마찬가지였으며, 이들 모두 Kotlin 1.4.0에서 *OrNull() 동의어를 얻었습니다. 이 변경의 영향을 받은 이전 함수들은 점진적으로 지원이 중단되었습니다.

Kotlin 1.7.0은 원래 함수 이름을 Non-Nullable 반환 타입으로 다시 도입합니다. 새로운 `min()`, `max()`, `minBy()`, `maxBy()`, `minWith()`, `maxWith()` 함수는 이제 컬렉션 요소를 엄격하게 반환하거나 예외를 던집니다.

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### 특정 인덱스에서 정규 표현식 매칭

[`Regex.matchAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/match-at.html) 및 [`Regex.matchesAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/matches-at.html) 함수는 [1.5.30에 도입되었으며](whatsnew1530.md#matching-with-regex-at-a-particular-position), 이제 안정화(Stable)되었습니다. 이 함수들은 `String` 또는 `CharSequence`의 특정 위치에서 정규 표현식이 정확히 일치하는지 확인할 수 있는 방법을 제공합니다.

`matchesAt()`는 일치 여부를 확인하고 boolean 결과를 반환합니다.

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()`는 일치하는 항목이 발견되면 반환하고, 그렇지 않으면 `null`을 반환합니다.

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

이 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-34021)에 대한 여러분의 피드백을 주시면 감사하겠습니다.

### 이전 언어 및 API 버전 지원 확장

광범위한 이전 Kotlin 버전에서 소비될 수 있는 라이브러리를 개발하는 라이브러리 작성자를 지원하고, Kotlin 주요 릴리스의 증가하는 빈도에 대처하기 위해 이전 언어 및 API 버전에 대한 지원을 확장했습니다.

Kotlin 1.7.0부터는 이전 언어 및 API 버전 두 개가 아닌 세 개를 지원합니다. 이는 Kotlin 1.7.0이 Kotlin 1.4.0 버전까지의 라이브러리 개발을 지원한다는 의미입니다. 하위 호환성에 대한 자세한 내용은 [호환성 모드](compatibility-modes.md)를 참조하세요.

### 리플렉션을 통한 어노테이션 접근

[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 확장 함수는 [1.6.0에 처음 도입되었으며](whatsnew16.md#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target), 이제 [안정화(Stable)](components-stability.md)되었습니다. 이 [리플렉션](reflection.md) 함수는 개별적으로 적용된 어노테이션과 반복된 어노테이션을 포함하여 주어진 타입의 모든 어노테이션을 요소에서 반환합니다.

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

깊은 재귀 함수는 [Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines)부터 실험적 기능으로 제공되었으며, 이제 Kotlin 1.7.0에서 [안정화(Stable)](components-stability.md)되었습니다. `DeepRecursiveFunction`을 사용하면 실제 호출 스택 대신 힙에 스택을 유지하는 함수를 정의할 수 있습니다. 이를 통해 매우 깊은 재귀 계산을 실행할 수 있습니다. 깊은 재귀 함수를 호출하려면 `invoke`합니다.

이 예제에서는 이진 트리의 깊이를 재귀적으로 계산하기 위해 깊은 재귀 함수가 사용됩니다. 이 샘플 함수가 100,000번 재귀적으로 자신을 호출하더라도 `StackOverflowError`는 발생하지 않습니다.

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t ->
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // Generate a tree with a depth of 100_000
    val deepTree = generateSequence(Tree(null, null)) { prev ->
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

재귀 깊이가 1000회를 초과하는 코드에서는 깊은 재귀 함수를 사용하는 것을 고려해 보세요.

### 기본 시간 소스에 대한 인라인 클래스 기반 시간 마크

Kotlin 1.7.0은 `TimeSource.Monotonic`이 반환하는 시간 마크를 인라인 값 클래스로 변경하여 시간 측정 기능의 성능을 개선합니다. 이는 `markNow()`, `elapsedNow()`, `measureTime()`, `measureTimedValue()`와 같은 함수를 호출할 때 `TimeMark` 인스턴스에 대한 래퍼 클래스를 할당하지 않음을 의미합니다. 특히 핫 패스(hot path)의 일부인 코드를 측정할 때, 이는 측정의 성능 영향을 최소화하는 데 도움이 될 수 있습니다.

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // Returned `TimeMark` is inline class
    val elapsedDuration = mark.elapsedNow()
}
```

> 이 최적화는 `TimeMark`를 얻는 시간 소스가 정적으로 `TimeSource.Monotonic`인 경우에만 사용할 수 있습니다.
>
{style="note"}

### Java `Optional`에 대한 새로운 실험적 확장 함수

Kotlin 1.7.0에는 Java의 `Optional` 클래스와 작업하는 것을 단순화하는 새로운 편의 함수가 함께 제공됩니다. 이 새로운 함수들은 JVM에서 `Optional` 객체를 언랩(unwrap)하고 변환하는 데 사용될 수 있으며, Java API를 보다 간결하게 작업하는 데 도움이 됩니다.

`getOrNull()`, `getOrDefault()`, `getOrElse()` 확장 함수는 `Optional`이 존재할 경우 값을 가져올 수 있게 해줍니다. 그렇지 않으면 각각 `null`, 기본값 또는 함수가 반환하는 값을 얻게 됩니다.

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

`toList()`, `toSet()`, `asSequence()` 확장 함수는 현재 `Optional`의 값을 리스트, 집합 또는 시퀀스로 변환하거나, 그렇지 않으면 빈 컬렉션을 반환합니다. `toCollection()` 확장 함수는 `Optional` 값을 이미 존재하는 대상 컬렉션에 추가합니다.

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

이러한 확장 함수들은 Kotlin 1.7.0에서 실험적 기능으로 도입됩니다. `Optional` 확장에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/pull/291)에서 확인할 수 있습니다. 언제나처럼, [Kotlin 이슈 트래커](https://kotl.in/issue)에 여러분의 피드백을 환영합니다.

### JS 및 Native에서 이름 있는 캡처 그룹 지원

Kotlin 1.7.0부터는 이름 있는 캡처 그룹(named capturing groups)이 JVM뿐만 아니라 JS 및 Native 플랫폼에서도 지원됩니다.

캡처 그룹에 이름을 지정하려면 정규 표현식에서 (`?<name>group`) 구문을 사용하세요. 그룹에 의해 일치하는 텍스트를 얻으려면 새로 도입된 [`MatchGroupCollection.get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/get.html) 함수를 호출하고 그룹 이름을 전달하세요.

#### 이름으로 일치하는 그룹 값 검색

도시 좌표를 일치시키는 다음 예제를 고려해 보세요. 정규 표현식과 일치하는 그룹 컬렉션을 얻으려면 [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)를 사용하세요. `value`를 사용하여 그룹의 내용을 번호(인덱스)로 검색하는 것과 이름으로 검색하는 것을 비교해 보세요.

```kotlin
fun main() {
    val regex = "\\b(?<city>[A-Za-z\\s]+),\\s(?<state>[A-Z]{2}):\\s(?<areaCode>[0-9]{3})\\b".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    val match = regex.find(input)!!
    println(match.groups["city"]?.value) // "Austin" — by name
    println(match.groups[2]?.value) // "TX" — by number
}
```

#### 이름 있는 역참조(Backreferencing)

이제 그룹을 역참조할 때 그룹 이름을 사용할 수도 있습니다. 역참조는 이전에 캡처 그룹에 의해 일치된 동일한 텍스트를 일치시킵니다. 이를 위해 정규 표현식에서 `\k<name>` 구문을 사용하세요.

```kotlin
fun backRef() {
    val regex = "(?<title>\\w+), yes \\k<title>".toRegex()
    val match = regex.find("Do you copy? Sir, yes Sir!")!!
    println(match.value) // "Sir, yes Sir"
    println(match.groups["title"]?.value) // "Sir"
}
```

#### 대체 표현식의 이름 있는 그룹

이름 있는 그룹 참조는 대체 표현식과 함께 사용할 수 있습니다. 입력에서 지정된 정규 표현식의 모든 발생을 대체 표현식으로 대체하는 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 함수와 첫 번째 일치만 교체하는 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) 함수를 고려해 보세요.

대체 문자열에서 `${name}`의 발생은 지정된 이름의 캡처된 그룹에 해당하는 부분 문자열로 대체됩니다. 그룹 참조에서 이름 및 인덱스를 사용하여 대체 값을 비교할 수 있습니다.

```kotlin
fun dateReplace() {
    val dateRegex = Regex("(?<dd>\\d{2})-(?<mm>\\d{2})-(?<yyyy>\\d{4})")
    val input = "Date of birth: 27-04-2022"
    println(dateRegex.replace(input, "\${yyyy}-\${mm}-\${dd}")) // "Date of birth: 2022-04-27" — by name
    println(dateRegex.replace(input, "\$3-\$2-\$1")) // "Date of birth: 2022-04-27" — by number
}
```

## Gradle

이번 릴리스에서는 새로운 빌드 보고서, Gradle 플러그인 변형 지원, kapt의 새로운 통계 등 다양한 기능을 소개합니다.

*   [점진적 컴파일에 대한 새로운 접근 방식](#a-new-approach-to-incremental-compilation)
*   [컴파일러 성능 추적을 위한 새로운 빌드 보고서](#build-reports-for-kotlin-compiler-tasks)
*   [Gradle 및 Android Gradle 플러그인의 최소 지원 버전 변경](#bumping-minimum-supported-versions)
*   [Gradle 플러그인 변형 지원](#support-for-gradle-plugin-variants)
*   [Kotlin Gradle 플러그인 API 업데이트](#updates-in-the-kotlin-gradle-plugin-api)
*   [플러그인 API를 통한 `sam-with-receiver` 플러그인 사용 가능](#the-sam-with-receiver-plugin-is-available-via-the-plugins-api)
*   [컴파일 작업 변경 사항](#changes-in-compile-tasks)
*   [kapt의 각 어노테이션 프로세서별 생성 파일에 대한 새로운 통계](#statistics-of-generated-files-by-each-annotation-processor-in-kapt)
*   [`kotlin.compiler.execution.strategy` 시스템 속성 지원 중단](#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)
*   [지원 중단된 옵션, 메서드 및 플러그인 제거](#removal-of-deprecated-options-methods-and-plugins)

### 점진적 컴파일에 대한 새로운 접근 방식

> 점진적 컴파일에 대한 새로운 접근 방식은 [실험적(Experimental)](components-stability.md)입니다. 언제든지 중단되거나 변경될 수 있습니다.
> 옵트인(opt-in)이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용하는 것을 권장하며, [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.7.0에서는 모듈 간 변경에 대한 점진적 컴파일을 재작업했습니다. 이제 점진적 컴파일은 종속된 비-Kotlin 모듈 내부에서 변경된 사항에 대해서도 지원되며, [Gradle 빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)와 호환됩니다. 컴파일 회피(compilation avoidance) 지원도 개선되었습니다.

빌드 캐시를 사용하거나 비-Kotlin Gradle 모듈에서 자주 변경하는 경우 새로운 접근 방식의 가장 큰 이점을 보게 될 것입니다. `kotlin-gradle-plugin` 모듈의 Kotlin 프로젝트에 대한 테스트에서는 캐시 히트 후 변경에 대해 80% 이상의 개선을 보여줍니다.

이 새로운 접근 방식을 시도하려면 `gradle.properties`에 다음 옵션을 설정하세요.

```none
kotlin.incremental.useClasspathSnapshot=true
```

> 점진적 컴파일에 대한 새로운 접근 방식은 현재 Gradle 빌드 시스템의 JVM 백엔드에서만 사용할 수 있습니다.
>
{style="note"}

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)에서 점진적 컴파일에 대한 새로운 접근 방식이 내부적으로 어떻게 구현되었는지 알아보세요.

우리의 계획은 이 기술을 안정화하고 다른 백엔드(예: JS) 및 빌드 시스템에 대한 지원을 추가하는 것입니다. 이 컴파일 방식에서 발생하는 모든 문제나 이상한 동작에 대해 [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 보고해주시면 감사하겠습니다. 감사합니다!

Kotlin 팀은 [Ivan Gavrilovic](https://github.com/gavra0), [Hung Nguyen](https://github.com/hungvietnguyen),
[Cédric Champeau](https://github.com/melix) 및 기타 외부 기여자들의 도움에 매우 감사드립니다.

### Kotlin 컴파일러 작업에 대한 빌드 보고서

> Kotlin 빌드 보고서는 [실험적(Experimental)](components-stability.md)입니다. 언제든지 중단되거나 변경될 수 있습니다.
> 옵트인(opt-in)이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 여러분의 피드백을 감사히 받겠습니다.
>
{style="warning"}

Kotlin 1.7.0은 컴파일러 성능을 추적하는 데 도움이 되는 빌드 보고서를 도입합니다. 보고서에는 다양한 컴파일 단계의 지속 시간과 컴파일이 점진적으로 이루어질 수 없었던 이유가 포함됩니다.

빌드 보고서는 다음과 같은 컴파일러 작업 문제를 조사할 때 유용합니다.

*   Gradle 빌드가 너무 오래 걸리고 성능 저하의 근본 원인을 파악하려는 경우.
*   동일한 프로젝트의 컴파일 시간이 다르게 나타나, 때로는 몇 초, 때로는 몇 분이 걸리는 경우.

빌드 보고서를 활성화하려면 `gradle.properties`에서 빌드 보고서 출력을 저장할 위치를 선언하세요.

```none
kotlin.build.report.output=file
```

다음 값(및 조합)을 사용할 수 있습니다.

*   `file`은 빌드 보고서를 로컬 파일에 저장합니다.
*   `build_scan`은 [빌드 스캔](https://scans.gradle.com/)의 `custom values` 섹션에 빌드 보고서를 저장합니다.

  > Gradle Enterprise 플러그인은 커스텀 값의 수와 길이를 제한합니다. 큰 프로젝트에서는 일부 값이 손실될 수 있습니다.
  >
  {style="note"}

*   `http`는 HTTP(S)를 사용하여 빌드 보고서를 게시합니다. POST 메서드는 JSON 형식으로 메트릭을 보냅니다. 데이터는 버전마다 변경될 수 있습니다. 전송되는 데이터의 현재 버전은 [Kotlin 저장소](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)에서 확인할 수 있습니다.

오래 실행되는 컴파일에 대한 빌드 보고서를 분석하여 해결할 수 있는 두 가지 일반적인 경우가 있습니다.

*   빌드가 점진적으로 이루어지지 않았습니다. 원인을 분석하고 근본적인 문제를 해결하세요.
*   빌드는 점진적이었지만 너무 오래 걸렸습니다. 소스 파일을 재구성해 보세요. 큰 파일을 분할하고, 개별 클래스를 다른 파일에 저장하고, 큰 클래스를 리팩토링하고, 최상위 함수를 다른 파일에 선언하는 등.

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/)에서 새로운 빌드 보고서에 대해 자세히 알아보세요.

여러분은 인프라에서 빌드 보고서를 사용해 볼 수 있습니다. 피드백이 있거나, 문제가 발생하거나, 개선 사항을 제안하고 싶다면 주저하지 말고 [이슈 트래커](https://youtrack.jetbrains.com/newIssue)에 보고해 주세요. 감사합니다!

### 최소 지원 버전 상향 조정

Kotlin 1.7.0부터 최소 지원 Gradle 버전은 6.7.1입니다. [Gradle 플러그인 변형](#support-for-gradle-plugin-variants) 및 새로운 Gradle API를 지원하기 위해 [버전을 높여야 했습니다](https://youtrack.jetbrains.com/issue/KT-49733/Bump-minimal-supported-Gradle-version-to-6-7-1). 앞으로는 Gradle 플러그인 변형 기능 덕분에 최소 지원 버전을 자주 올릴 필요가 없을 것입니다.

또한, 최소 지원 Android Gradle 플러그인 버전은 이제 3.6.4입니다.

### Gradle 플러그인 변형 지원

Gradle 7.0은 Gradle 플러그인 작성자를 위한 새로운 기능인 [변형(variants)을 가진 플러그인](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)을 도입했습니다. 이 기능은 7.1 미만의 Gradle 버전과의 호환성을 유지하면서 새로운 Gradle 기능에 대한 지원을 더 쉽게 추가할 수 있게 합니다. [Gradle의 변형 선택](https://docs.gradle.org/current/userguide/variant_model.html)에 대해 자세히 알아보세요.

Gradle 플러그인 변형을 통해 다양한 Gradle 버전에 대해 다른 Kotlin Gradle 플러그인 변형을 제공할 수 있습니다. 목표는 가장 오래된 지원 Gradle 버전에 해당하는 `main` 변형에서 기본 Kotlin 컴파일을 지원하는 것입니다. 각 변형은 해당 릴리스의 Gradle 기능에 대한 구현을 가질 것입니다. 최신 변형은 가장 넓은 Gradle 기능 세트를 지원할 것입니다. 이 접근 방식을 통해 제한된 기능으로 이전 Gradle 버전에 대한 지원을 확장할 수 있습니다.

현재 Kotlin Gradle 플러그인의 변형은 두 가지만 있습니다.

*   `main`은 Gradle 버전 6.7.1–6.9.3용
*   `gradle70`은 Gradle 버전 7.0 이상용

향후 Kotlin 릴리스에서는 더 추가될 수 있습니다.

빌드가 어떤 변형을 사용하는지 확인하려면 [`--info` 로그 레벨](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)을 활성화하고 `Using Kotlin Gradle plugin`으로 시작하는 출력 문자열(예: `Using Kotlin Gradle plugin main variant`)을 찾으세요.

> 다음은 Gradle의 변형 선택과 관련된 일부 알려진 문제에 대한 해결 방법입니다.
> *   [pluginManagement의 ResolutionStrategy가 멀티 변형 플러그인에서 작동하지 않음](https://github.com/gradle/gradle/issues/20545)
> *   [플러그인이 `buildSrc` 공통 종속성으로 추가될 때 플러그인 변형이 무시됨](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-49227/Support-Gradle-plugins-variants)에 피드백을 남겨주세요.

### Kotlin Gradle 플러그인 API 업데이트

Kotlin Gradle 플러그인 API 아티팩트에는 여러 개선 사항이 있습니다.

*   사용자가 구성 가능한 입력을 가진 Kotlin/JVM 및 Kotlin/kapt 작업에 대한 새로운 인터페이스가 있습니다.
*   모든 Kotlin 플러그인이 상속하는 새로운 `KotlinBasePlugin` 인터페이스가 있습니다. 어떤 Kotlin Gradle 플러그인(JVM, JS, 멀티플랫폼, Native 및 기타 플랫폼)이 적용될 때마다 일부 구성 작업을 트리거하려면 이 인터페이스를 사용하세요.

  ```kotlin
  project.plugins.withType<org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin>() {
      // Configure your action here
  }
  ```
  `KotlinBasePlugin`에 대한 피드백은 [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-48008/Consider-offering-a-KotlinBasePlugin)에 남길 수 있습니다.

*   Android Gradle 플러그인이 Kotlin 컴파일을 자체적으로 구성할 수 있도록 기반을 마련했습니다. 즉, 빌드에 Kotlin Android Gradle 플러그인을 추가할 필요가 없습니다.
  추가된 지원에 대해 알아보고 사용해 보려면 [Android Gradle 플러그인 릴리스 공지](https://developer.android.com/studio/releases/gradle-plugin)를 따르세요!

### `sam-with-receiver` 플러그인, 플러그인 API를 통해 사용 가능

[sam-with-receiver 컴파일러 플러그인](sam-with-receiver-plugin.md)은 이제 [Gradle 플러그인 DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)을 통해 사용할 수 있습니다.

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.sam.with.receiver") version "$kotlin_version"
}
```

### 컴파일 작업 변경 사항

이번 릴리스에서 컴파일 작업에 많은 변경 사항이 있었습니다.

*   Kotlin 컴파일 작업은 더 이상 Gradle `AbstractCompile` 작업을 상속하지 않습니다. 이제 `DefaultTask`만 상속합니다.
*   `AbstractCompile` 작업에는 `sourceCompatibility` 및 `targetCompatibility` 입력이 있습니다. `AbstractCompile` 작업이 더 이상 상속되지 않으므로, 이러한 입력은 Kotlin 사용자 스크립트에서 더 이상 사용할 수 없습니다.
*   `SourceTask.stableSources` 입력은 더 이상 사용할 수 없으며, `sources` 입력을 사용해야 합니다. `setSource(...)` 메서드는 여전히 사용할 수 있습니다.
*   모든 컴파일 작업은 이제 컴파일에 필요한 라이브러리 목록에 `libraries` 입력을 사용합니다. `KotlinCompile` 작업은 여전히 지원 중단된 Kotlin 속성 `classpath`를 가지고 있으며, 이는 향후 릴리스에서 제거될 것입니다.
*   컴파일 작업은 여전히 `PatternFilterable` 인터페이스를 구현하며, 이는 Kotlin 소스의 필터링을 허용합니다. `sourceFilesExtensions` 입력은 `PatternFilterable` 메서드를 사용하는 방식이 선호되어 제거되었습니다.
*   지원 중단된 `Gradle destinationDir: File` 출력은 `destinationDirectory: DirectoryProperty` 출력으로 대체되었습니다.
*   Kotlin/Native `AbstractNativeCompile` 작업은 이제 `AbstractKotlinCompileTool` 기본 클래스를 상속합니다. 이는 Kotlin/Native 빌드 도구를 다른 모든 도구에 통합하기 위한 초기 단계입니다.

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-32805)에 피드백을 남겨주세요.

### kapt의 각 어노테이션 프로세서별 생성 파일에 대한 새로운 통계

`kotlin-kapt` Gradle 플러그인은 이미 [각 프로세서에 대한 성능 통계를 보고합니다](https://github.com/JetBrains/kotlin/pull/4280). Kotlin 1.7.0부터는 각 어노테이션 프로세서별 생성된 파일 수에 대한 통계도 보고할 수 있습니다.

이는 빌드의 일부로 사용되지 않는 어노테이션 프로세서가 있는지 추적하는 데 유용합니다. 생성된 보고서를 사용하여 불필요한 어노테이션 프로세서를 트리거하는 모듈을 찾아 해당 모듈을 업데이트하여 이를 방지할 수 있습니다.

두 단계로 통계를 활성화하세요.

*   `build.gradle.kts`에서 `showProcessorStats` 플래그를 `true`로 설정하세요.

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

*   `gradle.properties`에서 `kapt.verbose` Gradle 속성을 `true`로 설정하세요.
  
  ```none
  kapt.verbose=true
  ```

> [명령줄 옵션 `verbose`](kapt.md#use-in-cli)를 통해서도 상세 출력을 활성화할 수 있습니다.
>
{style="note"}

통계는 `info` 레벨로 로그에 나타납니다. `Annotation processor stats:` 줄 뒤에 각 어노테이션 프로세서의 실행 시간에 대한 통계가 표시됩니다. 이 줄들 뒤에는 `Generated files report:` 줄이 이어지며 각 어노테이션 프로세서의 생성 파일 수에 대한 통계가 표시됩니다. 예를 들면 다음과 같습니다.

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-51132/KAPT-Support-reporting-the-number-of-generated-files-by-each-ann)에 피드백을 남겨주세요.

### `kotlin.compiler.execution.strategy` 시스템 속성 지원 중단

Kotlin 1.6.20은 [Kotlin 컴파일러 실행 전략을 정의하기 위한 새로운 속성을 도입했습니다](whatsnew1620.md#properties-for-defining-kotlin-compiler-execution-strategy). Kotlin 1.7.0에서는 이전 시스템 속성 `kotlin.compiler.execution.strategy`에 대한 지원 중단 주기(deprecation cycle)가 새로운 속성을 선호하며 시작되었습니다.

`kotlin.compiler.execution.strategy` 시스템 속성을 사용하면 경고를 받게 됩니다. 이 속성은 향후 릴리스에서 삭제될 것입니다. 이전 동작을 유지하려면 시스템 속성을 동일한 이름의 Gradle 속성으로 대체하세요. 예를 들어, `gradle.properties`에서 다음과 같이 할 수 있습니다.

```none
kotlin.compiler.execution.strategy=out-of-process
```

컴파일 작업 속성 `compilerExecutionStrategy`를 사용할 수도 있습니다. 이에 대한 자세한 내용은 [Gradle 페이지](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)에서 알아보세요.

### 지원 중단된 옵션, 메서드 및 플러그인 제거

#### `useExperimentalAnnotation` 메서드 제거

Kotlin 1.7.0에서는 `useExperimentalAnnotation` Gradle 메서드에 대한 지원 중단 주기(deprecation cycle)를 완료했습니다. 모듈에서 API 사용을 옵트인하려면 대신 `optIn()`을 사용하세요.

예를 들어, Gradle 모듈이 멀티플랫폼인 경우:

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

Kotlin의 [옵트인 요구 사항](opt-in-requirements.md)에 대해 자세히 알아보세요.

#### 지원 중단된 컴파일러 옵션 제거

몇 가지 컴파일러 옵션에 대한 지원 중단 주기를 완료했습니다.

*   `kotlinOptions.jdkHome` 컴파일러 옵션은 1.5.30에서 지원 중단되었으며 현재 릴리스에서 제거되었습니다.
    이 옵션을 포함하는 Gradle 빌드는 이제 실패합니다. Kotlin 1.5.30부터 지원되는 [Java 툴체인](whatsnew1530.md#support-for-java-toolchains)을 사용하는 것을 권장합니다.
*   지원 중단된 `noStdlib` 컴파일러 옵션도 제거되었습니다. Gradle 플러그인은 `kotlin.stdlib.default.dependency=true` 속성을 사용하여 Kotlin 표준 라이브러리의 존재 여부를 제어합니다.

> 컴파일러 인수 `-jdkHome` 및 `-no-stdlib`는 여전히 사용할 수 있습니다.
>
{style="note"}

#### 지원 중단된 플러그인 제거

Kotlin 1.4.0에서 `kotlin2js` 및 `kotlin-dce-plugin` 플러그인은 지원 중단되었으며 이 릴리스에서 제거되었습니다. `kotlin2js` 대신 새로운 `org.jetbrains.kotlin.js` 플러그인을 사용하세요. 데드 코드 제거(DCE)는 Kotlin/JS Gradle 플러그인이 [적절하게 구성된](javascript-dce.md) 경우 작동합니다.

Kotlin 1.6.0에서 `KotlinGradleSubplugin` 클래스의 지원 중단 레벨을 `ERROR`로 변경했습니다. 개발자들은 이 클래스를 사용하여 컴파일러 플러그인을 작성했습니다. 이 릴리스에서는 [이 클래스가 제거되었습니다](https://youtrack.jetbrains.com/issue/KT-48831/). 대신 `KotlinCompilerPluginSupportPlugin` 클래스를 사용하세요.

> 프로젝트 전체에서 1.7.0 이상 버전의 Kotlin 플러그인을 사용하는 것이 가장 좋습니다.
>
{style="tip"}

#### 지원 중단된 코루틴 DSL 옵션 및 속성 제거

지원 중단된 `kotlin.experimental.coroutines` Gradle DSL 옵션과 `gradle.properties`에서 사용되던 `kotlin.coroutines` 속성을 제거했습니다. 이제 [일시 중단 함수(suspending functions)](coroutines-basics.md#extract-function-refactoring)를 사용하거나 빌드 스크립트에 [`kotlinx.coroutines` 종속성을 추가](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)하기만 하면 됩니다.

[코루틴 가이드](coroutines-guide.md)에서 코루틴에 대해 자세히 알아보세요.

#### 툴체인 확장 메서드의 타입 캐스트 제거

Kotlin 1.7.0 이전에는 Kotlin DSL로 Gradle 툴체인을 구성할 때 `JavaToolchainSpec` 클래스로 타입 캐스트를 수행해야 했습니다.

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

IntelliJ IDEA 2022.1 및 Android Studio Chipmunk (212)는 Kotlin 플러그인을 1.7.0으로 자동 업데이트하도록 제안합니다.

> IntelliJ IDEA 2022.2, Android Studio Dolphin (213) 또는 Android Studio Electric Eel (221)의 경우, Kotlin 플러그인 1.7.0은 향후 IntelliJ IDEA 및 Android Studio 업데이트와 함께 제공될 예정입니다.
> 
{style="note"}

새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.7.0)에서 다운로드할 수 있습니다.

### 기존 프로젝트 마이그레이션 또는 Kotlin 1.7.0으로 새 프로젝트 시작

*   기존 프로젝트를 Kotlin 1.7.0으로 마이그레이션하려면 Kotlin 버전을 `1.7.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 임포트하세요. [Kotlin 1.7.0으로 업데이트하는 방법](releases.md#update-to-a-new-kotlin-version)을 알아보세요.

*   Kotlin 1.7.0으로 새 프로젝트를 시작하려면 Kotlin 플러그인을 업데이트하고 **File** | **New** | **Project**에서 프로젝트 마법사(Project Wizard)를 실행하세요.

### Kotlin 1.7.0 호환성 가이드

Kotlin 1.7.0은 [기능 릴리스(feature release)](kotlin-evolution-principles.md#language-and-tooling-releases)이므로, 이전 버전의 언어로 작성된 코드와 호환되지 않는 변경 사항을 가져올 수 있습니다.
그러한 변경 사항에 대한 자세한 목록은 [Kotlin 1.7.0 호환성 가이드](compatibility-guide-17.md)에서 확인할 수 있습니다.