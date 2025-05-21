---
title: "Kotlin 1.7.0의 새로운 기능"
---
:::info
<p>
   Kotlin 1.7.0에 대한 [IDE (통합 개발 환경)](https://ko.wikipedia.org/wiki/%ED% 통합_%개발_%환경) 지원은 IntelliJ IDEA 2021.2, 2021.3, 2022.1에서 사용할 수 있습니다.
</p>

:::

_[릴리스 날짜: 2022년 6월 9일](releases#release-details)_

Kotlin 1.7.0이 릴리스되었습니다. 새로운 Kotlin/JVM K2 컴파일러의 알파 버전을 공개하고 언어 기능을 안정화하며 JVM, JS 및 Native 플랫폼에 대한 성능 개선을 제공합니다.

이 버전의 주요 업데이트 목록은 다음과 같습니다.

* [새로운 Kotlin K2 컴파일러가 현재 알파 버전입니다.](#new-kotlin-k2-compiler-for-the-jvm-in-alpha) 이는 상당한 성능 향상을 제공합니다. JVM에서만 사용할 수 있으며 [kapt](kapt)를 포함한 컴파일러 플러그인은 함께 작동하지 않습니다.
* [Gradle에서 점진적 컴파일에 대한 새로운 접근 방식입니다.](#a-new-approach-to-incremental-compilation) 이제 점진적 컴파일은 종속적인 비 Kotlin 모듈 내부에서 이루어진 변경 사항에 대해서도 지원되며 Gradle과 호환됩니다.
* [Opt-in 요구 사항 어노테이션](#stable-opt-in-requirements), [확실히 널이 될 수 없는 유형](#stable-definitely-non-nullable-types) 및 [빌더 추론](#stable-builder-inference)이 안정화되었습니다.
* [이제 유형 인수에 밑줄 연산자가 있습니다.](#underscore-operator-for-type-arguments) 다른 유형이 지정된 경우 인수의 유형을 자동으로 추론하는 데 사용할 수 있습니다.
* [이 릴리스에서는 인라인 클래스의 인라인된 값에 대한 위임을 통한 구현을 허용합니다.](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class) 이제 대부분의 경우 메모리를 할당하지 않는 경량 래퍼를 만들 수 있습니다.

다음 비디오에서 변경 사항에 대한 간단한 개요를 확인할 수도 있습니다.

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="What's new in Kotlin 1.7.0"/>

## JVM용 새로운 Kotlin K2 컴파일러(알파)

이 Kotlin 릴리스는 새로운 Kotlin K2 컴파일러의 **알파** 버전을 소개합니다. 새로운 컴파일러는 새로운 언어 기능 개발 속도를 높이고, Kotlin이 지원하는 모든 플랫폼을 통합하고, 성능을 개선하고, 컴파일러 확장에 대한 API를 제공하는 것을 목표로 합니다.

새로운 컴파일러와 그 이점에 대한 자세한 설명이 이미 게시되었습니다.

* [새로운 Kotlin 컴파일러로 가는 길](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 컴파일러: 하향식 보기](https://www.youtube.com/watch?v=db19VFLZqJM)

새로운 K2 컴파일러의 알파 버전에서는 주로 성능 개선에 중점을 두었으며 JVM 프로젝트에서만 작동한다는 점을 지적하는 것이 중요합니다. Kotlin/JS, Kotlin/Native 또는 기타 멀티 플랫폼 프로젝트를 지원하지 않으며 [kapt](kapt)를 포함한 컴파일러 플러그인은 함께 작동하지 않습니다.

내부 프로젝트에서 일부 뛰어난 결과를 보여주는 벤치마크는 다음과 같습니다.

| 프로젝트       | 현재 Kotlin 컴파일러 성능 | 새로운 K2 Kotlin 컴파일러 성능 | 성능 향상 |
|---------------|-------------------------------------|------------------------------------|-------------------|
| Kotlin        | 2.2 KLOC/s                          | 4.8 KLOC/s                         | ~ x2.2            |
| YouTrack      | 1.8 KLOC/s                          | 4.2 KLOC/s                         | ~ x2.3            |
| IntelliJ IDEA | 1.8 KLOC/s                          | 3.9 KLOC/s                         | ~ x2.2            |
| Space         | 1.2 KLOC/s                          | 2.8 KLOC/s                         | ~ x2.3            |
:::note
KLOC/s 성능 수치는 컴파일러가 초당 처리하는 코드 줄 수(천 줄)를 나타냅니다.

JVM 프로젝트에서 성능 향상을 확인하고 이전 컴파일러의 결과와 비교할 수 있습니다. Kotlin K2 컴파일러를 활성화하려면 다음 컴파일러 옵션을 사용하십시오.

```bash
-Xuse-k2
```

또한 K2 컴파일러에는 [여러 버그 수정 사항이 포함되어 있습니다.](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved) 이 목록에서 **상태: 열기**가 있는 문제도 실제로 K2에서 수정되었습니다.

다음 Kotlin 릴리스에서는 K2 컴파일러의 안정성을 개선하고 더 많은 기능을 제공할 예정이니 계속 지켜봐 주세요!

Kotlin K2 컴파일러에 성능 문제가 있는 경우 [문제 추적기에 보고해 주세요.](https://kotl.in/issue)

## 언어

Kotlin 1.7.0에서는 위임을 통한 구현과 유형 인수에 대한 새로운 밑줄 연산자를 지원합니다. 또한 이전 릴리스에서 미리 보기로 도입된 여러 언어 기능을 안정화합니다.

* [인라인 클래스의 인라인된 값에 대한 위임을 통한 구현](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
* [유형 인수에 대한 밑줄 연산자](#underscore-operator-for-type-arguments)
* [안정적인 빌더 추론](#stable-builder-inference)
* [안정적인 Opt-in 요구 사항](#stable-opt-in-requirements)
* [안정적인 확실히 널이 될 수 없는 유형](#stable-definitely-non-nullable-types)

### 인라인 클래스의 인라인된 값에 대한 위임을 통한 구현 허용

값 또는 클래스 인스턴스에 대한 경량 래퍼를 만들려면 모든 인터페이스 메서드를 직접 구현해야 합니다. 위임을 통한 구현은 이 문제를 해결하지만 1.7.0 이전에는 인라인 클래스에서 작동하지 않았습니다. 이 제한 사항이 제거되어 이제 대부분의 경우 메모리를 할당하지 않는 경량 래퍼를 만들 수 있습니다.

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

### 유형 인수에 대한 밑줄 연산자

Kotlin 1.7.0에서는 유형 인수에 대한 밑줄 연산자 `_`를 도입합니다. 다른 유형이 지정된 경우 이를 사용하여 유형 인수를 자동으로 추론할 수 있습니다.

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
    // T는 SomeImplementation이 SomeClass<String>에서 파생되었기 때문에 String으로 추론됩니다.
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T는 OtherImplementation이 SomeClass<Int>에서 파생되었기 때문에 Int로 추론됩니다.
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

변수 목록의 모든 위치에서 밑줄 연산자를 사용하여 유형 인수를 추론할 수 있습니다.

:::

### 안정적인 빌더 추론

빌더 추론은 일반 빌더 함수를 호출할 때 유용한 특수한 종류의 유형 추론입니다. 컴파일러가 람다 인수 내부의 다른 호출에 대한 유형 정보를 사용하여 호출의 유형 인수를 추론하는 데 도움이 됩니다.

1.7.0부터 일반 유형 추론이 `-Xenable-builder-inference` 컴파일러 옵션을 지정하지 않고는 유형에 대한 충분한 정보를 얻을 수 없는 경우 빌더 추론이 자동으로 활성화됩니다. 이 옵션은 [1.6.0에서 도입되었습니다.](whatsnew16#changes-to-builder-inference)

[사용자 지정 일반 빌더를 작성하는 방법을 알아보세요.](using-builders-with-builder-inference)

### 안정적인 Opt-in 요구 사항

[Opt-in 요구 사항](opt-in-requirements)이 이제 [안정적](components-stability)이며 추가 컴파일러 구성이 필요하지 않습니다.

1.7.0 이전에는 경고를 피하기 위해 opt-in 기능 자체에 인수 `-opt-in=kotlin.RequiresOptIn`이 필요했습니다. 더 이상 필요하지 않지만 컴파일러 인수 `-opt-in`을 사용하여 다른 어노테이션([모듈](opt-in-requirements#opt-in-a-module))에 대해 opt-in할 수 있습니다.

### 안정적인 확실히 널이 될 수 없는 유형

Kotlin 1.7.0에서 확실히 널이 될 수 없는 유형이 [안정](components-stability)으로 승격되었습니다. 일반 Java 클래스 및 인터페이스를 확장할 때 더 나은 상호 운용성을 제공합니다.

새로운 구문 `T & Any`를 사용하여 사용 사이트에서 일반 유형 매개변수를 확실히 널이 될 수 없는 것으로 표시할 수 있습니다. 구문 형식은 [교차 유형](https://en.wikipedia.org/wiki/Intersection_type)에 대한 표기법에서 비롯되었으며 이제 `&`의 왼쪽에 있는 널이 될 수 있는 상한이 있는 유형 매개변수와 오른쪽에 있는 널이 될 수 없는 `Any`로 제한됩니다.

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // 오류: 'null'은 널이 아닌 유형의 값이 될 수 없습니다.
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // 오류: 'null'은 널이 아닌 유형의 값이 될 수 없습니다.
    elvisLike<String?>(null, null).length
}
```

확실히 널이 될 수 없는 유형에 대해 자세히 알아보세요.
[이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types)에서 확인하세요.

## Kotlin/JVM

이 릴리스는 Kotlin/JVM 컴파일러 및 새로운 컴파일러 옵션에 대한 성능 개선을 제공합니다. 또한 함수형 인터페이스 생성자에 대한 호출 가능한 참조가 안정화되었습니다. 1.7.0부터 Kotlin/JVM 컴파일의 기본 대상 버전은 `1.8`입니다.

* [컴파일러 성능 최적화](#compiler-performance-optimizations)
* [새로운 컴파일러 옵션 `-Xjdk-release`](#new-compiler-option-xjdk-release)
* [함수형 인터페이스 생성자에 대한 안정적인 호출 가능한 참조](#stable-callable-references-to-functional-interface-constructors)
* [JVM 대상 버전 1.6 제거](#removed-jvm-target-version-1-6)

### 컴파일러 성능 최적화

Kotlin 1.7.0에서는 Kotlin/JVM 컴파일러에 대한 성능 개선을 도입합니다. 벤치마크에 따르면 컴파일 시간이 Kotlin 1.6.0에 비해 [평균 10% 감소했습니다.](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0) 예를 들어 인라인 함수를 많이 사용하는 프로젝트([`kotlinx.html`을 사용하는 프로젝트](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster))는 바이트코드 후처리가 개선되어 더 빠르게 컴파일됩니다.

### 새로운 컴파일러 옵션: -Xjdk-release

Kotlin 1.7.0에서는 새로운 컴파일러 옵션 `-Xjdk-release`를 제공합니다. 이 옵션은 [javac의 명령줄 `--release` 옵션](http://openjdk.java.net/jeps/247)과 유사합니다. `-Xjdk-release` 옵션은 대상 바이트코드 버전을 제어하고 클래스 경로에 있는 JDK의 API를 지정된 Java 버전으로 제한합니다. 예를 들어 `kotlinc -Xjdk-release=1.8`은 종속성에 있는 JDK가 버전 9 이상이더라도 `java.lang.Module`을 참조할 수 없습니다.

:::note
이 옵션은 각 JDK 배포판에 대해 효과가 [보장되지 않습니다.](https://youtrack.jetbrains.com/issue/KT-29974)

:::

[이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to)에 의견을 남겨주세요.

### 함수형 인터페이스 생성자에 대한 안정적인 호출 가능한 참조

함수형 인터페이스 생성자에 대한 [호출 가능한 참조](reflection#callable-references)가 이제 [안정](components-stability)적입니다. [생성자 함수가 있는 인터페이스에서 호출 가능한 참조를 사용하는 함수형 인터페이스로 마이그레이션하는 방법](fun-interfaces#migration-from-an-interface-with-constructor-function-to-a-functional-interface)을 알아보세요.

[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)에서 발견한 문제를 보고해주세요.

### JVM 대상 버전 1.6 제거

Kotlin/JVM 컴파일의 기본 대상 버전은 `1.8`입니다. `1.6` 대상이 제거되었습니다.

JVM 대상 1.8 이상으로 마이그레이션하세요. JVM 대상 버전을 업데이트하는 방법은 다음과 같습니다.

* [Gradle](gradle-compiler-options#attributes-specific-to-jvm)
* [Maven](maven#attributes-specific-to-jvm)
* [명령줄 컴파일러](compiler-reference#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0에는 Objective-C 및 Swift 상호 운용성에 대한 변경 사항과 이전 릴리스에서 도입된 기능을 안정화하는 기능이 포함되어 있습니다. 또한 새로운 메모리 관리자에 대한 성능 개선과 기타 업데이트가 제공됩니다.

* [새로운 메모리 관리자에 대한 성능 개선](#performance-improvements-for-the-new-memory-manager)
* [JVM 및 JS IR 백엔드를 사용한 통합 컴파일러 플러그인 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [독립 실행형 Android 실행 파일 지원](#support-for-standalone-android-executables)
* [Swift async/await와의 상호 운용성: `KotlinUnit` 대신 `Void` 반환](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [Objective-C 브리지를 통한 선언되지 않은 예외 금지](#prohibited-undeclared-exceptions-through-objective-c-bridges)
* [개선된 CocoaPods 통합](#improved-cocoapods-integration)
* [Kotlin/Native 컴파일러 다운로드 URL 재정의](#overriding-the-kotlin-native-compiler-download-url)

### 새로운 메모리 관리자에 대한 성능 개선

:::note
새로운 Kotlin/Native 메모리 관리자는 [알파](components-stability) 단계입니다.
호환되지 않게 변경될 수 있으며 나중에 수동 마이그레이션이 필요할 수 있습니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에서 의견을 보내주시면 감사하겠습니다.

:::

새로운 메모리 관리자는 여전히 알파 단계에 있지만 [안정](components-stability)화되고 있습니다.
이 릴리스는 특히 가비지 수집(GC)에서 새로운 메모리 관리자에 대한 상당한 성능 개선을 제공합니다. 특히 스윕 단계의 동시 구현은 [1.6.20에서 도입되었으며](whatsnew1620)
이제 기본적으로 활성화됩니다. 이를 통해 애플리케이션이 GC를 위해 일시 중지되는 시간을 줄일 수 있습니다. 새로운 GC 스케줄러는 특히 더 큰 힙에 대해 GC 빈도를 선택하는 데 더 능숙합니다.

또한 메모리 관리자의 구현 코드에서 적절한 최적화 수준과 링크 시간 최적화가 사용되도록 디버그 바이너리를 특별히 최적화했습니다. 이를 통해 벤치마크에서 디버그 바이너리의 실행 시간을 약 30% 단축할 수 있었습니다.

프로젝트에서 새로운 메모리 관리자를 사용하여 작동 방식을 확인하고 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에서 의견을 공유해주세요.

### JVM 및 JS IR 백엔드를 사용한 통합 컴파일러 플러그인 ABI

Kotlin 1.7.0부터 Kotlin Multiplatform Gradle 플러그인은 기본적으로 Kotlin/Native에 대한 포함 가능한 컴파일러 jar를 사용합니다. 이 [기능은 1.6.0에서 발표되었으며](whatsnew16#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
실험적이었지만 이제 안정적이고 사용할 준비가 되었습니다.

이 개선 사항은 컴파일러 플러그인 개발 경험을 개선하므로 라이브러리 작성자에게 매우 유용합니다. 이 릴리스 이전에는 Kotlin/Native에 대해 별도의 아티팩트를 제공해야 했지만 이제 Native 및 기타 지원되는 플랫폼에 대해 동일한 컴파일러 플러그인 아티팩트를 사용할 수 있습니다.

:::note
이 기능은 플러그인 개발자가 기존 플러그인에 대해 마이그레이션 단계를 수행해야 할 수 있습니다.

이 [YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-48595)에서 업데이트를 위해 플러그인을 준비하는 방법을 알아보세요.

### 독립 실행형 Android 실행 파일 지원

Kotlin 1.7.0은 Android Native 대상에 대한 표준 실행 파일 생성을 완벽하게 지원합니다.
[1.6.20에서 도입되었으며](whatsnew1620#support-for-standalone-android-executables) 이제 기본적으로 활성화됩니다.

Kotlin/Native가 공유 라이브러리를 생성할 때 이전 동작으로 롤백하려면 다음 설정을 사용하세요.

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### Swift async/await와의 상호 운용성: `KotlinUnit` 대신 `Void` 반환

Kotlin `suspend` 함수는 이제 Swift에서 `KotlinUnit` 대신 `Void` 유형을 반환합니다. 이는 Swift의 `async`/`await`와의 상호 운용성이 향상된 결과입니다. 이 기능은
[1.6.20에서 도입되었으며](whatsnew1620#interop-with-swift-async-await-returning-void-instead-of-kotlinunit) 이번 릴리스에서는 이 동작이 기본적으로 활성화됩니다.

더 이상 `kotlin.native.binary.unitSuspendFunctionObjCExport=proper` 속성을 사용하여 이러한 함수에 대한 적절한 유형을 반환할 필요가 없습니다.

### Objective-C 브리지를 통한 선언되지 않은 예외 금지

Swift/Objective-C 코드에서 Kotlin 코드를 호출하고(또는 그 반대로) 이 코드가 예외를 throw하는 경우 `@Throws` 어노테이션을 사용하여 언어 간 예외 전달을 명시적으로 허용하지 않는 한 예외가 발생한 코드에서 처리해야 합니다.

이전에는 Kotlin에 선언되지 않은 예외가 일부 경우에 한 언어에서 다른 언어로 "누출"될 수 있는 또 다른 의도하지 않은 동작이 있었습니다. Kotlin 1.7.0에서는 이 문제를 수정했으며 이제 이러한 경우 프로그램이 종료됩니다.

예를 들어 Kotlin에 `{ throw Exception() }` 람다가 있고 Swift에서 호출하는 경우 Kotlin 1.7.0에서는 예외가 Swift 코드에 도달하는 즉시 종료됩니다. 이전 Kotlin 버전에서는 이러한 예외가 Swift 코드로 누출될 수 있습니다.

`@Throws` 어노테이션은 이전과 같이 계속 작동합니다.

### 개선된 CocoaPods 통합

Kotlin 1.7.0부터 프로젝트에서 CocoaPods를 통합하려면 더 이상 `cocoapods-generate` 플러그인을 설치할 필요가 없습니다.

이전에는 예를 들어 Kotlin Multiplatform Mobile 프로젝트에서 [iOS 종속성](multiplatform-ios-dependencies#with-cocoapods)을 처리하기 위해 CocoaPods 종속성 관리자와 `cocoapods-generate` 플러그인을 모두 설치해야 했습니다.

이제 CocoaPods 통합 설정이 더 쉬워졌으며 Ruby 3 이상에서 `cocoapods-generate`를 설치할 수 없는 문제가 해결되었습니다. 이제 Apple M1에서 더 잘 작동하는 최신 Ruby 버전도 지원됩니다.

[초기 CocoaPods 통합](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)을 설정하는 방법을 알아보세요.

### Kotlin/Native 컴파일러 다운로드 URL 재정의

Kotlin 1.7.0부터 Kotlin/Native 컴파일러에 대한 다운로드 URL을 사용자 지정할 수 있습니다. 이는 CI에서 외부 링크가 금지된 경우에 유용합니다.

기본 기본 URL `https://download.jetbrains.com/kotlin/native/builds`를 재정의하려면 다음 Gradle 속성을 사용하세요.

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

다운로더는 네이티브 버전과 대상 OS를 이 기본 URL에 추가하여 실제 컴파일러 배포를 다운로드하는지 확인합니다.

:::

## Kotlin/JS

Kotlin/JS는 [JS IR 컴파일러 백엔드](js-ir-compiler)와 함께 개발 경험을 향상시킬 수 있는 다른 업데이트를 받고 있습니다.

* [새로운 IR 백엔드에 대한 성능 개선](#performance-improvements-for-the-new-ir-backend)
* [IR을 사용할 때 멤버 이름에 대한 축소](#minification-for-member-names-when-using-ir)
* [IR 백엔드에서 폴리필을 통한 이전 브라우저 지원](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
* [js 표현식에서 JavaScript 모듈을 동적으로 로드](#dynamically-load-javascript-modules-from-js-expressions)
* [JavaScript 테스트 러너에 대한 환경 변수 지정](#specify-environment-variables-for-javascript-test-runners)

### 새로운 IR 백엔드에 대한 성능 개선

이 릴리스에는 개발 경험을 개선해야 하는 몇 가지 주요 업데이트가 있습니다.

* Kotlin/JS의 점진적 컴파일 성능이 크게 향상되었습니다. JS 프로젝트를 빌드하는 데 시간이 덜 걸립니다. 이제 점진적 재빌드는 많은 경우에서 레거시 백엔드와 거의 동일해야 합니다.
* Kotlin/JS 최종 번들은 최종 아티팩트의 크기를 크게 줄였기 때문에 더 적은 공간을 필요로 합니다. 일부 대규모 프로젝트의 경우 프로덕션 번들 크기가 레거시 백엔드에 비해 최대 20%까지 감소했습니다.
* 인터페이스에 대한 유형 검사가 몇 배나 개선되었습니다.
* Kotlin은 더 높은 품질의 JS 코드를 생성합니다.

### IR을 사용할 때 멤버 이름에 대한 축소

Kotlin/JS IR 컴파일러는 이제 Kotlin 클래스 및 함수의 관계에 대한 내부 정보를 사용하여 함수, 속성 및 클래스의 이름을 단축하여 더 효율적인 축소를 적용합니다. 이렇게 하면 결과적으로 번들된 애플리케이션이 축소됩니다.

이러한 유형의 축소는 Kotlin/JS 애플리케이션을 프로덕션 모드로 빌드할 때 자동으로 적용되며 기본적으로 활성화됩니다. 멤버 이름 축소를 비활성화하려면 `-Xir-minimized-member-names` 컴파일러 플래그를 사용하세요.

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### IR 백엔드에서 폴리필을 통한 이전 브라우저 지원

Kotlin/JS의 IR 컴파일러 백엔드에는 이제 레거시 백엔드와 동일한 폴리필이 포함되어 있습니다. 이를 통해 새 컴파일러로 컴파일된 코드가 Kotlin 표준 라이브러리에서 사용되는 ES2015의 모든 메서드를 지원하지 않는 이전 브라우저에서 실행될 수 있습니다. 프로젝트에서 실제로 사용되는 폴리필만 최종 번들에 포함되어 번들 크기에 대한 잠재적 영향을 최소화합니다.

이 기능은 IR 컴파일러를 사용할 때 기본적으로 활성화되며 구성할 필요가 없습니다.

### js 표현식에서 JavaScript 모듈을 동적으로 로드

JavaScript 모듈로 작업할 때 대부분의 애플리케이션은 [JavaScript 모듈 통합](js-modules)으로 덮여 있는 정적 가져오기를 사용합니다. 그러나 Kotlin/JS에는 애플리케이션에서 런타임 시 JavaScript 모듈을 동적으로 로드하는 메커니즘이 누락되었습니다.

Kotlin 1.7.0부터 JavaScript의 `import` 문이 `js` 블록에서 지원되므로 런타임 시 애플리케이션에 패키지를 동적으로 가져올 수 있습니다.

```kotlin
val myPackage = js("import('my-package')")
```

### JavaScript 테스트 러너에 대한 환경 변수 지정

Node.js 패키지 해결을 조정하거나 외부 정보를 Node.js 테스트에 전달하려면 이제 JavaScript 테스트 러너에서 사용하는 환경 변수를 지정할 수 있습니다. 환경 변수를 정의하려면 빌드 스크립트의 `testTask` 블록 내에서 키-값 쌍과 함께 `environment()` 함수를 사용합니다.

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

Kotlin 1.7.0에서 표준 라이브러리는 다양한 변경 및 개선을 받았습니다. 새로운 기능을 도입하고, 실험적 기능을 안정화하고, Native, JS 및 JVM에 대한 명명된 캡처 그룹에 대한 지원을 통합합니다.

* [`min()` 및 `max()` 컬렉션 함수는 널이 될 수 없는 것으로 반환](#min-and-max-collection-functions-return-as-non-nullable)
* [특정 인덱스에서 정규 표현식 일치](#regular-expression-matching-at-specific-indices)
* [이전 언어 및 API 버전에 대한 확장된 지원](#extended-support-for-previous-language-and-api-versions)
* [리플렉션을 통한 어노테이션 액세스](#access-to-annotations-via-reflection)
* [안정적인 딥 재귀 함수](#stable-deep-recursive-functions)
* [기본 시간 소스에 대한 인라인 클래스를 기반으로 하는 시간 표시](#time-marks-based-on-inline-classes-for-default-time-source)
* [Java Optionals에 대한 새로운 실험적 확장 함수](#new-experimental-extension-functions-for-java-optionals)
* [JS 및 Native에서 명명된 캡처 그룹 지원](#support-for-named-capturing-groups-in-js-and-native)

### `min()` 및 `max()` 컬렉션 함수는 널이 될 수 없는 것으로 반환

[Kotlin 1.4.0](whatsnew14)에서 `min()` 및 `max()` 컬렉션 함수의 이름을 `minOrNull()` 및 `maxOrNull()`로 변경했습니다. 이러한 새로운 이름은 수신자 컬렉션이 비어 있는 경우 null을 반환하는 동작을 더 잘 반영합니다. 또한 Kotlin 컬렉션 API 전체에서 사용되는 명명 규칙과 함수의 동작을 일치시키는 데 도움이 되었습니다.

`minBy()`, `maxBy()`, `minWith()` 및 `maxWith()`도 마찬가지였으며 모두 Kotlin 1.4.0에서 *OrNull() 동의어를 얻었습니다. 이 변경의 영향을 받는 이전 함수는 점차적으로 더 이상 사용되지 않았습니다.

Kotlin 1.7.0에서는 원래 함수 이름을 다시 도입했지만 널이 될 수 없는 반환 유형을 사용합니다. 이제 새로운 `min()`, `max()` , `minBy()`, `maxBy()`, `minWith()` 및 `maxWith()` 함수는 컬렉션 요소를 엄격하게 반환하거나 예외를 throw합니다.

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### 특정 인덱스에서 정규 표현식 일치

[1.5.30에서 도입된](whatsnew1530#matching-with-regex-at-a-particular-position) `Regex.matchAt()` 및 `Regex.matchesAt()` 함수가 이제 안정적입니다. 이 함수는 `String` 또는 `CharSequence`에서 특정 위치에 정규 표현식과 정확히 일치하는지 확인하는 방법을 제공합니다.

`matchesAt()`는 일치하는 항목을 확인하고 부울 결과를 반환합니다.

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // 정규 표현식: 숫자 1개, 점, 숫자 1개, 점, 숫자 1개 이상
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()`는 일치하는 항목을 찾으면 반환하고, 그렇지 않으면 `null`을 반환합니다.

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

이 [YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-34021)에 대한 의견을 보내주시면 감사하겠습니다.

### 이전 언어 및 API 버전에 대한 확장된 지원

광범위한 이전 Kotlin 버전에서 사용할 수 있도록 라이브러리를 개발하는 라이브러리 작성자를 지원하고 주요 Kotlin 릴리스의 빈도가 증가하는 문제를 해결하기 위해 이전 언어 및 API에 대한 지원을 확장했습니다.

Kotlin 1.7.0에서는 2개가 아닌 3개의 이전 언어 및 API 버전을 지원합니다. 즉, Kotlin 1.7.0은 Kotlin 버전 1.4.0까지의 라이브러리 개발을 지원합니다. 이전 버전과의 호환성에 대한 자세한 내용은 [호환성 모드](compatibility-modes)를 참조하세요.

### 리플렉션을 통한 어노테이션 액세스

처음 [1.6.0에서 도입된](whatsnew16#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target) [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 확장 함수가 이제 [안정적](components-stability)입니다. 이 [리플렉션](reflection) 함수는 개별적으로 적용되고 반복되는 어노테이션을 포함하여 요소의 지정된 유형에 대한 모든 어노테이션을 반환합니다.

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

### 안정적인 딥 재귀 함수

딥 재귀 함수는 [Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines)부터 실험적 기능으로 제공되었으며 Kotlin 1.7.0에서는 이제 [안정적](components-stability)입니다. `DeepRecursiveFunction`을 사용하면 실제 호출 스택을 사용하는 대신 힙에 스택을 유지하는 함수를 정의할 수 있습니다. 이를 통해 매우 깊은 재귀 계산을 실행할 수 있습니다. 딥 재귀 함수를 호출하려면 `invoke`하세요.

이 예에서는 딥 재귀 함수를 사용하여 이진 트리의 깊이를 재귀적으로 계산합니다. 이 샘플 함수는 100,000번 재귀적으로 호출하지만 `StackOverflowError`가 throw되지 않습니다.

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t `->`
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // 깊이가 100,000인 트리 생성
    val deepTree = generateSequence(Tree(null, null)) { prev `->`
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

재귀 깊이가 1000번 호출을 초과하는 코드에서 딥 재귀 함수를 사용하는 것을 고려하세요.

### 기본 시간 소스에 대한 인라인 클래스를 기반으로 하는 시간 표시

Kotlin 1.7.0에서는 `TimeSource.Monotonic`에서 반환된 시간 표시를 인라인 값 클래스로 변경하여 시간 측정 기능의 성능을 개선합니다. 즉, `markNow()`, `elapsedNow()` , `measureTime()` 및 `measureTimedValue()`와 같은 함수를 호출하면 `TimeMark` 인스턴스에 대한 래퍼 클래스가 할당되지 않습니다. 특히 핫 경로의 일부인 코드 조각을 측정할 때 측정의 성능 영향을 최소화하는 데 도움이 될 수 있습니다.

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // 반환된 `TimeMark`는 인라인 클래스입니다.
    val elapsedDuration = mark.elapsedNow()
}
```

:::note
이 최적화는 `TimeMark`를 얻은 시간 소스가 `TimeSource.Monotonic`인 것으로 정적으로 알려진 경우에만 사용할 수 있습니다.

:::

### Java Optionals에 대한 새로운 실험적 확장 함수

Kotlin 1.7.0에는 Java에서 `Optional` 클래스 작업을 간소화하는 새로운 편의 함수가 제공됩니다. 이러한 새로운 함수를 사용하여 JVM에서 선택적 객체를 래핑 해제하고 변환하고 Java API 작업을 더 간결하게 만들 수 있습니다.

`getOrNull()`, `getOrDefault()` 및 `get