[//]: # (title: Kotlin 1.6.0의 새로운 기능)

<web-summary>새로운 언어 기능, Kotlin Multiplatform, JVM, Native, JS에 대한 업데이트, 그리고 Gradle 및 Maven 빌드 도구 지원을 포함한 Kotlin 1.6.0 출시 노트를 읽어보세요.</web-summary>

_[출시: 2021년 11월 16일](releases.md#release-history)_

Kotlin 1.6.0은 새로운 언어 기능, 기존 기능의 최적화 및 개선, 그리고 Kotlin 표준 라이브러리에 대한 수많은 개선 사항을 도입합니다.

[출시 블로그 포스트](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)에서 변경 사항에 대한 개요를 확인할 수도 있습니다.

> Kotlin 출시 주기에 대한 정보는 [Kotlin 출시 프로세스](releases.md)를 참고하세요.
>
{style="tip"}

## 언어

Kotlin 1.6.0은 이전 1.5.30 릴리스에서 미리보기로 도입된 몇 가지 언어 기능을 안정화했습니다.
* [enum, sealed 및 Boolean 대상을 위한 안정적인 철저한(exhaustive) when 문](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [안정적인 상위 타입으로서의 일시 중단 함수](#stable-suspending-functions-as-supertypes)
* [안정적인 일시 중단 변환(suspend conversions)](#stable-suspend-conversions)
* [안정적인 애노테이션 클래스 인스턴스화](#stable-instantiation-of-annotation-classes)

또한 다양한 타입 추론 개선 사항과 클래스 타입 파라미터에 대한 애노테이션 지원이 포함되었습니다.
* [재귀적 제네릭 타입에 대한 개선된 타입 추론](#improved-type-inference-for-recursive-generic-types)
* [빌더 추론(builder inference) 변경 사항](#changes-to-builder-inference)
* [클래스 타입 파라미터에 대한 애노테이션 지원](#support-for-annotations-on-class-type-parameters)

### enum, sealed 및 Boolean 대상을 위한 안정적인 철저한 when 문

_철저한(exhaustive)_ [`when`](control-flow.md#when-expressions-and-statements) 문은 대상의 가능한 모든 타입이나 값에 대한 브랜치를 포함하거나, 일부 타입과 `else` 브랜치를 포함합니다. 이는 가능한 모든 경우를 다루어 코드를 더 안전하게 만듭니다.

곧 `when` 표현식과 동작을 일관되게 맞추기 위해 철저하지 않은 `when` 문을 금지할 예정입니다. 원활한 마이그레이션을 위해 Kotlin 1.6.0은 enum, sealed 또는 Boolean 대상을 사용하는 철저하지 않은 `when` 문에 대해 경고를 보고합니다. 이러한 경고는 향후 릴리스에서 에러가 될 예정입니다.

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // 에러: 'when' 표현식은 반드시 철저해야 함
        is Contact.PhoneCall -> 42
    }

fun sendMessage(contact: Contact, message: String) {
    // 1.6.0부터 시작

    // 경고: Boolean에 대한 철저하지 않은 'when' 문은 1.7에서 금지될 예정입니다.
    // 대신 'false' 브랜치나 'else' 브랜치를 추가하세요.
    when(message.isEmpty()) {
        true -> return
    }
    // 경고: sealed 클래스/인터페이스에 대한 철저하지 않은 'when' 문은 1.7에서 금지될 예정입니다.
    // 대신 'is TextMessage' 브랜치나 'else' 브랜치를 추가하세요.
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

이 변경 사항과 그 영향에 대한 자세한 설명은 [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-47709)을 참조하세요.

### 안정적인 상위 타입으로서의 일시 중단 함수

일시 중단 함수 타입(suspending functional types)의 구현이 Kotlin 1.6.0에서 [안정화(Stable)](components-stability.md)되었습니다. 미리보기는 [1.5.30](whatsnew1530.md#suspending-functions-as-supertypes)에서 제공되었습니다.

이 기능은 Kotlin 코루틴을 사용하고 일시 중단 함수 타입을 받는 API를 설계할 때 유용할 수 있습니다. 이제 일시 중단 함수 타입을 구현하는 별도의 클래스에 원하는 동작을 감싸서 코드를 간소화할 수 있습니다.

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

이전에는 람다와 일시 중단 함수 참조만 허용되었던 곳에 이 클래스의 인스턴스를 사용할 수 있습니다: `launchOnClick(MyClickAction())`.

현재 구현 세부 사항으로 인한 두 가지 제한 사항이 있습니다.
* 상위 타입 목록에서 일반 함수 타입과 일시 중단 함수 타입을 혼합해서 사용할 수 없습니다.
* 여러 개의 일시 중단 함수 상위 타입을 사용할 수 없습니다.

### 안정적인 일시 중단 변환

Kotlin 1.6.0은 일반 함수 타입에서 일시 중단 함수 타입으로의 [안정적인(Stable)](components-stability.md) 변환을 도입합니다. 1.4.0 버전부터 이 기능은 함수 리터럴과 호출 가능 참조를 지원해 왔습니다. 1.6.0부터는 모든 형태의 표현식에서 작동합니다. 이제 일시 중단이 기대되는 호출 인자로 적절한 일반 함수 타입의 모든 표현식을 전달할 수 있습니다. 컴파일러가 암시적 변환을 자동으로 수행합니다.

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### 안정적인 애노테이션 클래스 인스턴스화

Kotlin 1.5.30은 JVM 플랫폼에서 애노테이션 클래스의 인스턴스화에 대한 실험적 지원을 [도입](whatsnew1530.md#instantiation-of-annotation-classes)했습니다. 1.6.0부터 이 기능은 Kotlin/JVM과 Kotlin/JS 모두에서 기본적으로 사용 가능합니다.

애노테이션 클래스 인스턴스화에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)에서 확인할 수 있습니다.

### 재귀적 제네릭 타입에 대한 개선된 타입 추론

Kotlin 1.5.30은 재귀적 제네릭 타입에 대한 타입 추론 개선 사항을 도입하여, 해당 타입 파라미터의 상한(upper bounds)만을 기반으로 타입 인자를 추론할 수 있게 했습니다. 이 개선 사항은 컴파일러 옵션으로 사용 가능했습니다. 1.6.0 버전 이후부터는 기본적으로 활성화됩니다.

```kotlin
// 1.5.30 이전
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
  withDatabaseName("db")
  withUsername("user")
  withPassword("password")
  withInitScript("sql/schema.sql")
}

// 1.5.30에서 컴파일러 옵션을 사용하거나 1.6.0부터 기본값
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
  .withDatabaseName("db")
  .withUsername("user")
  .withPassword("password")
  .withInitScript("sql/schema.sql")
```

### 빌더 추론 변경 사항

빌더 추론(Builder inference)은 제네릭 빌더 함수를 호출할 때 유용한 타입 추론의 한 종류입니다. 람다 인자 내부의 호출에서 얻은 타입 정보를 활용해 호출의 타입 인자를 추론할 수 있습니다.

우리는 완전히 안정적인 빌더 추론에 다가가기 위해 여러 가지 변경을 진행하고 있습니다. 1.6.0부터는 다음과 같습니다.
* [1.5.30에서 도입된](whatsnew1530.md#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` 컴파일러 옵션을 지정하지 않고도 빌더 람다 내부에서 아직 추론되지 않은 타입의 인스턴스를 반환하는 호출을 할 수 있습니다.
* `-Xenable-builder-inference` 옵션을 사용하면 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 애노테이션을 적용하지 않고도 자신만의 빌더를 작성할 수 있습니다.

    > 이러한 빌더의 클라이언트는 동일한 `-Xenable-builder-inference` 컴파일러 옵션을 지정해야 합니다.
    >
    {style="warning"}

* `-Xenable-builder-inference` 옵션을 사용하면 일반 타입 추론이 타입에 대해 충분한 정보를 얻을 수 없을 때 빌더 추론이 자동으로 활성화됩니다.

[커스텀 제네릭 빌더를 작성하는 방법](using-builders-with-builder-inference.md)을 알아보세요.

### 클래스 타입 파라미터에 대한 애노테이션 지원

클래스 타입 파라미터에 대한 애노테이션 지원은 다음과 같습니다.

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

모든 타입 파라미터에 대한 애노테이션은 JVM 바이트코드로 출력되어 애노테이션 프로세서가 이를 사용할 수 있습니다.

동기부여가 된 유즈케이스에 대해서는 이 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-43714)을 읽어보세요.

[애노테이션](annotations.md)에 대해 더 자세히 알아보세요.

## 이전 API 버전을 더 오래 지원

Kotlin 1.6.0부터는 현재 안정 버전을 포함하여 기존 2개가 아닌 3개의 이전 API 버전에 대한 개발을 지원합니다. 현재는 1.3, 1.4, 1.5, 1.6 버전을 지원합니다.

## Kotlin/JVM

Kotlin/JVM의 경우 1.6.0부터 컴파일러가 JVM 17에 해당하는 바이트코드 버전을 가진 클래스를 생성할 수 있습니다. 새로운 언어 버전에는 로드맵에 있었던 최적화된 위임된 프로퍼티(delegated properties)와 반복 가능한 애노테이션도 포함됩니다.
* [1.8 JVM 타겟을 위한 런타임 유지를 지원하는 반복 가능한 애노테이션](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [지정된 KProperty 인스턴스에서 get/set을 호출하는 위임된 프로퍼티 최적화](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 1.8 JVM 타겟을 위한 런타임 유지를 지원하는 반복 가능한 애노테이션

Java 8은 단일 코드 요소에 여러 번 적용할 수 있는 [반복 가능한(repeatable) 애노테이션](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)을 도입했습니다.
이 기능을 사용하려면 Java 코드에 두 개의 선언이 있어야 합니다. [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html)로 표시된 반복 가능한 애노테이션 자체와 그 값을 담는 컨테이너 애노테이션입니다.

Kotlin도 반복 가능한 애노테이션을 가지고 있지만, 애노테이션 선언에 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)만 있으면 반복 가능하게 만들 수 있습니다.
1.6.0 이전에는 이 기능이 `SOURCE` 유지(retention)만 지원했으며 Java의 반복 가능한 애노테이션과 호환되지 않았습니다.
Kotlin 1.6.0은 이러한 제한을 제거합니다. `@kotlin.annotation.Repeatable`은 모든 유지를 허용하며 Kotlin과 Java 모두에서 애노테이션을 반복 가능하게 만듭니다. 이제 Java 측의 반복 가능한 애노테이션도 Kotlin 쪽에서 지원됩니다.

컨테이너 애노테이션을 선언할 수도 있지만, 반드시 필요한 것은 아닙니다. 예를 들어:
* 애노테이션 `@Tag`가 `@kotlin.annotation.Repeatable`로 표시되면, Kotlin 컴파일러는 자동으로 `@Tag.Container`라는 이름 아래에 컨테이너 애노테이션 클래스를 생성합니다.

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // 컴파일러가 @Tag.Container 컨테이너 애노테이션을 생성함
    ```

* 컨테이너 애노테이션에 커스텀 이름을 설정하려면, [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 메타 애노테이션을 적용하고 명시적으로 선언된 컨테이너 애노테이션 클래스를 인자로 전달하세요.

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

이제 Kotlin 리플렉션은 새로운 함수인 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)를 통해 Kotlin과 Java의 반복 가능한 애노테이션을 모두 지원합니다.

Kotlin 반복 가능한 애노테이션에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md)에서 확인할 수 있습니다.

### 지정된 KProperty 인스턴스에서 get/set을 호출하는 위임된 프로퍼티 최적화

`$delegate` 필드를 생략하고 참조된 프로퍼티에 즉시 액세스하도록 생성하여 생성된 JVM 바이트코드를 최적화했습니다.

예를 들어, 다음 코드에서

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin은 더 이상 `content$delegate` 필드를 생성하지 않습니다.
`content` 변수의 프로퍼티 액세서(accessor)는 `impl` 변수를 직접 호출하며, 위임된 프로퍼티의 `getValue`/`setValue` 연산자를 건너뛰어 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 타입의 프로퍼티 참조 객체가 필요하지 않게 됩니다.

구현을 도와준 Google 동료들에게 감사를 표합니다!

[위임된 프로퍼티](delegated-properties.md)에 대해 더 자세히 알아보세요.

## Kotlin/Native

Kotlin/Native는 몇 가지 개선 사항과 컴포넌트 업데이트를 받고 있으며, 그중 일부는 미리보기 상태입니다.
* [새로운 메모리 매니저 미리보기](#preview-of-the-new-memory-manager)
* [Xcode 13 지원](#support-for-xcode-13)
* [모든 호스트에서 Windows 타겟 컴파일 가능](#compilation-of-windows-targets-on-any-host)
* [LLVM 및 링커 업데이트](#llvm-and-linker-updates)
* [성능 개선](#performance-improvements)
* [JVM 및 JS IR 백엔드와 통합된 컴파일러 플러그인 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klib 링킹 실패에 대한 상세한 에러 메시지](#detailed-error-messages-for-klib-linkage-failures)
* [재설계된 처리되지 않은 예외 처리 API](#reworked-unhandled-exception-handling-api)

### 새로운 메모리 매니저 미리보기

> 새로운 Kotlin/Native 메모리 매니저는 [실험적(Experimental)](components-stability.md)입니다.
> 언제든지 중단되거나 변경될 수 있습니다. 옵트인(Opt-in)이 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에서 이에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.6.0을 사용하면 새로운 Kotlin/Native 메모리 매니저의 개발 미리보기를 사용해 볼 수 있습니다.
이는 JVM과 Native 플랫폼 간의 차이를 없애 멀티플랫폼 프로젝트에서 일관된 개발자 경험을 제공하기 위한 단계입니다.

주목할 만한 변경 사항 중 하나는 Kotlin/JVM과 같은 최상위(top-level) 프로퍼티의 지연 초기화(lazy initialization)입니다. 최상위 프로퍼티는 같은 파일의 최상위 프로퍼티나 함수에 처음 액세스할 때 초기화됩니다.
이 모드에는 릴리스 바이너리에만 활성화되는 글로벌 절차 간 최적화(interprocedural optimization)도 포함되어 있어 불필요한 초기화 검사를 제거합니다.

최근 새로운 메모리 매니저에 대한 [블로그 포스트](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)를 게시했습니다.
포스트를 읽고 새로운 메모리 매니저의 현재 상태와 데모 프로젝트를 확인하거나, [마이그레이션 가이드](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)로 바로 이동하여 직접 시도해 보세요.
프로젝트에서 새로운 메모리 매니저가 어떻게 작동하는지 확인하고 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에 피드백을 공유해 주세요.

### Xcode 13 지원

Kotlin/Native 1.6.0은 최신 버전의 Xcode인 Xcode 13을 지원합니다. 자유롭게 Xcode를 업데이트하고 Apple 운영 체제용 Kotlin 프로젝트 작업을 계속하세요.

> Xcode 13에 추가된 새로운 라이브러리는 Kotlin 1.6.0에서 사용할 수 없지만, 다음 버전에서 지원을 추가할 예정입니다.
>
{style="note"}

### 모든 호스트에서 Windows 타겟 컴파일 가능

1.6.0부터 Windows 타겟인 `mingwX64` 및 `mingwX86`을 컴파일하기 위해 Windows 호스트가 필요하지 않습니다. 이들은 Kotlin/Native를 지원하는 모든 호스트에서 컴파일할 수 있습니다.

### LLVM 및 링커 업데이트

Kotlin/Native가 내부적으로 사용하는 LLVM 의존성을 재설계했습니다. 이를 통해 다음과 같은 다양한 이점을 얻었습니다.
* LLVM 버전을 11.1.0으로 업데이트했습니다.
* 의존성 크기가 줄어들었습니다. 예를 들어, macOS에서는 이전 버전의 약 1200MB에서 약 300MB로 줄었습니다.
* 최신 Linux 배포판에서 사용할 수 없는 [`ncurses5` 라이브러리에 대한 의존성을 제외](https://youtrack.jetbrains.com/issue/KT-42693)했습니다.

LLVM 업데이트 외에도, Kotlin/Native는 이제 MingGW 타겟을 위해 [LLD](https://lld.llvm.org/) 링커(LLVM 프로젝트의 링커)를 사용합니다.
이전의 ld.bfd 링커보다 다양한 이점을 제공하며, 생성된 바이너리의 런타임 성능을 개선하고 MinGW 타겟에 대한 컴파일러 캐시를 지원할 수 있게 해줍니다.
LLD는 [DLL 링킹을 위해 임포트 라이브러리가 필요함](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)에 유의하세요.
자세한 내용은 [이 Stack Overflow 스레드](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)에서 확인할 수 있습니다.

### 성능 개선

Kotlin/Native 1.6.0은 다음과 같은 성능 개선 사항을 제공합니다.

* 컴파일 시간: `linuxX64` 및 `iosArm64` 타겟에 대해 컴파일러 캐시가 기본적으로 활성화됩니다.
이로 인해 디버그 모드에서 대부분의 컴파일 속도가 빨라집니다(첫 번째 컴파일 제외). 테스트 프로젝트에서 측정 결과 약 200%의 속도 향상을 보였습니다.
컴파일러 캐시는 Kotlin 1.5.0부터 [추가 Gradle 속성](whatsnew15.md#performance-improvements)으로 사용할 수 있었으나 이제는 제거해도 됩니다.
* 런타임: 생성된 LLVM 코드의 최적화 덕분에 `for` 루프를 통한 배열 이터레이션 속도가 최대 12% 빨라졌습니다.

### JVM 및 JS IR 백엔드와 통합된 컴파일러 플러그인 ABI

> Kotlin/Native를 위한 공통 IR 컴파일러 플러그인 ABI 사용 옵션은 [실험적(Experimental)](components-stability.md)입니다.
> 언제든지 중단되거나 변경될 수 있습니다. 옵트인이 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595)에서 이에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

이전 버전에서 컴파일러 플러그인 제작자들은 ABI 차이 때문에 Kotlin/Native용으로 별도의 아티팩트를 제공해야 했습니다.

1.6.0부터 Kotlin Multiplatform Gradle 플러그인은 JVM 및 JS IR 백엔드에 사용되는 것과 동일한 임베더블(embeddable) 컴파일러 jar를 Kotlin/Native에 사용할 수 있습니다.
이는 Native와 다른 지원 플랫폼에 대해 동일한 컴파일러 플러그인 아티팩트를 사용할 수 있게 하므로 컴파일러 플러그인 개발 경험을 통합하는 단계입니다.

이는 미리보기 버전이며 옵트인이 필요합니다.
Kotlin/Native용 일반 컴파일러 플러그인 아티팩트를 사용하려면 `gradle.properties`에 `kotlin.native.useEmbeddableCompilerJar=true` 라인을 추가하세요.

향후 Kotlin/Native에 임베더블 컴파일러 jar를 기본으로 사용할 계획이므로, 이 미리보기가 어떻게 작동하는지 알려주시는 것이 매우 중요합니다.

컴파일러 플러그인 제작자라면 이 모드를 시도해보고 플러그인에서 잘 작동하는지 확인해 주세요.
플러그인의 구조에 따라 마이그레이션 단계가 필요할 수 있습니다. 마이그레이션 지침은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-48595)를 참조하고 댓글로 피드백을 남겨주세요.

### klib 링킹 실패에 대한 상세한 에러 메시지

Kotlin/Native 컴파일러는 이제 klib 링킹(linkage) 에러에 대해 상세한 에러 메시지를 제공합니다.
메시지에는 명확한 에러 설명과 함께 가능한 원인 및 해결 방법이 포함됩니다.

예를 들어:
* 1.5.30:

    ```text
    e: java.lang.IllegalStateException: IrTypeAliasSymbol expected: Unbound public symbol for public kotlinx.coroutines/CancellationException|null[0]
    <stack trace>
    ```

* 1.6.0:

    ```text
    e: The symbol of unexpected type encountered during IR deserialization: IrClassPublicSymbolImpl, kotlinx.coroutines/CancellationException|null[0].
    IrTypeAliasSymbol is expected.
    
    This could happen if there are two libraries, where one library was compiled against the different version of the other library than the one currently used in the project.
    Please check that the project configuration is correct and has consistent versions of dependencies.
    
    The list of libraries that depend on "org.jetbrains.kotlinx:kotlinx-coroutines-core (org.jetbrains.kotlinx:kotlinx-coroutines-core-macosx64)" and may lead to conflicts:
    <list of libraries and potential version mismatches>
    
    Project dependencies:
    <dependencies tree>
    ```

### 재설계된 처리되지 않은 예외 처리 API

Kotlin/Native 런타임 전반에서 처리되지 않은 예외(unhandled exception)의 처리를 통합했으며, 기본 처리를 `processUnhandledException(throwable: Throwable)` 함수로 노출하여 `kotlinx.coroutines`와 같은 커스텀 실행 환경에서 사용할 수 있도록 했습니다.
이 처리는 `Worker.executeAfter()`에서 연산을 벗어나는 예외에도 적용되지만, 새로운 [메모리 매니저](#preview-of-the-new-memory-manager)에서만 해당됩니다.

API 개선 사항은 `setUnhandledExceptionHook()`으로 설정된 후크(hook)에도 영향을 미쳤습니다. 이전에는 Kotlin/Native 런타임이 처리되지 않은 예외와 함께 후크를 호출한 후 후크가 초기화되었고 프로그램이 항상 즉시 종료되었습니다.
이제 이러한 후크는 두 번 이상 사용할 수 있으며, 프로그램이 항상 처리되지 않은 예외로 종료되기를 원한다면 처리되지 않은 예외 후크를 설정하지 않거나(`setUnhandledExceptionHook()`), 후크 끝에서 `terminateWithUnhandledException()`을 호출해야 합니다.
이렇게 하면 예외를 서드파티 크래시 리포팅 서비스(예: Firebase Crashlytics)로 보내고 나서 프로그램을 종료할 수 있습니다.
`main()`에서 벗어나는 예외와 상호운용성(interop) 경계를 넘는 예외는 후크가 `terminateWithUnhandledException()`을 호출하지 않더라도 항상 프로그램을 종료시킵니다.

## Kotlin/JS

Kotlin/JS 컴파일러의 IR 백엔드를 안정화하기 위한 작업을 계속하고 있습니다.
Kotlin/JS에는 이제 [Node.js 및 Yarn 다운로드를 비활성화하는 옵션](#option-to-use-pre-installed-node-js-and-yarn)이 추가되었습니다.

### 사전 설치된 Node.js 및 Yarn 사용 옵션

이제 Kotlin/JS 프로젝트를 빌드할 때 Node.js 및 Yarn 다운로드를 비활성화하고 호스트에 이미 설치된 인스턴스를 사용할 수 있습니다.
이는 CI 서버와 같이 인터넷 연결이 없는 서버에서 빌드할 때 유용합니다.

외부 컴포넌트 다운로드를 비활성화하려면 `build.gradle(.kts)`에 다음 라인을 추가하세요.

* Yarn:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // 또는 기본 동작을 위해 true
    }
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```
    
    </tab>
    </tabs>

* Node.js:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // 또는 기본 동작을 위해 true
    }
     
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```
    
    </tab>
    </tabs>

## Kotlin Gradle 플러그인

Kotlin 1.6.0에서 `KotlinGradleSubplugin` 클래스의 지원 중단 수준을 'ERROR'로 변경했습니다.
이 클래스는 컴파일러 플러그인을 작성하는 데 사용되었습니다. 향후 릴리스에서는 이 클래스를 제거할 예정입니다. 대신 `KotlinCompilerPluginSupportPlugin` 클래스를 사용하세요.

`kotlin.useFallbackCompilerSearch` 빌드 옵션과 `noReflect`, `includeRuntime` 컴파일러 옵션을 제거했습니다.
`useIR` 컴파일러 옵션은 숨겨졌으며 향후 릴리스에서 제거될 예정입니다.

Kotlin Gradle 플러그인에서 [현재 지원되는 컴파일러 옵션](gradle-compiler-options.md)에 대해 더 자세히 알아보세요.

## 표준 라이브러리

표준 라이브러리의 새로운 1.6.0 버전은 실험적 기능을 안정화하고, 새로운 기능을 도입하며, 플랫폼 전반의 동작을 통합합니다.

* [새로운 readline 함수](#new-readline-functions)
* [안정적인 typeOf()](#stable-typeof)
* [안정적인 컬렉션 빌더](#stable-collection-builders)
* [안정적인 Duration API](#stable-duration-api)
* [Regex를 시퀀스로 분할](#splitting-regex-into-a-sequence)
* [정수에 대한 비트 회전 연산](#bit-rotation-operations-on-integers)
* [JS의 replace() 및 replaceFirst() 변경 사항](#changes-for-replace-and-replacefirst-in-js)
* [기존 API 개선 사항](#improvements-to-the-existing-api)
* [지원 중단 사항(Deprecations)](#deprecations)

### 새로운 readline 함수

Kotlin 1.6.0은 표준 입력을 처리하기 위한 새로운 함수인 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)과 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)을 제공합니다.

> 현재 새로운 함수는 JVM 및 Native 타겟 플랫폼에서만 사용할 수 있습니다.
>
{style="note"}

|**이전 버전**|**1.6.0 대안**|**사용법**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| stdin에서 한 줄을 읽어 반환하거나, EOF에 도달하면 `RuntimeException`을 던집니다. |
|`readLine()`|`readlnOrNull()`| stdin에서 한 줄을 읽어 반환하거나, EOF에 도달하면 `null`을 반환합니다. |

한 줄을 읽을 때 `!!`를 사용할 필요가 없어지면서 입문자들의 경험이 개선되고 Kotlin 교육이 더 간단해질 것이라고 믿습니다.
줄 읽기 작업의 이름을 `println()`과 일관되게 맞추기 위해 새로운 함수의 이름을 'ln'으로 줄이기로 했습니다.

```kotlin
println("닉네임이 무엇인가요?")
val nickname = readln()
println("안녕하세요, $nickname 님!")
```

```kotlin
fun main() {
//sampleStart
    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless { 
            it.isNullOrEmpty() 
        } ?: break
        sum += nextLine.toInt()
    }
    println(sum)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

기존의 `readLine()` 함수는 IDE 코드 완성에서 `readln()` 및 `readlnOrNull()`보다 낮은 우선순위를 갖게 됩니다.
IDE 검사는 레거시 `readLine()` 대신 새로운 함수를 사용하도록 권장할 것입니다.

향후 릴리스에서 `readLine()` 함수를 점진적으로 지원 중단할 계획입니다.

### 안정적인 typeOf()

1.6.0 버전은 [안정적인(Stable)](components-stability.md) [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 함수를 도입하여 [주요 로드맵 항목](https://youtrack.jetbrains.com/issue/KT-45396) 중 하나를 완료했습니다.

[1.3.40부터](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/) `typeOf()`는 JVM 플랫폼에서 실험적 API로 사용 가능했습니다.
이제 모든 Kotlin 플랫폼에서 컴파일러가 추론할 수 있는 모든 Kotlin 타입의 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 표현을 얻을 수 있습니다.

```kotlin
inline fun <reified T> renderType(): String {
    val type = typeOf<T>()
    return type.toString()
}

fun main() {
    val fromExplicitType = typeOf<Int>()
    val fromReifiedType = renderType<List<Int>>()
}
```

### 안정적인 컬렉션 빌더

Kotlin 1.6.0에서 컬렉션 빌더 함수가 [안정(Stable)](components-stability.md) 상태로 승격되었습니다. 컬렉션 빌더가 반환하는 컬렉션은 이제 읽기 전용 상태에서 직렬화가 가능합니다.

이제 옵트인 애노테이션 없이 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html), [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html), [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)을 사용할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val x = listOf('b', 'c')
    val y = buildList {
        add('a')
        addAll(x)
        add('d')
    }
    println(y)  // [a, b, c, d]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 안정적인 Duration API

서로 다른 시간 단위로 기간을 나타내는 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 클래스가 [안정(Stable)](components-stability.md) 상태로 승격되었습니다. 1.6.0에서 Duration API는 다음과 같은 변경 사항이 있었습니다.

* 기간을 일, 시, 분, 초, 나노초로 분해하는 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 함수의 첫 번째 컴포넌트가 이제 `Int` 대신 `Long` 타입을 갖습니다.
  이전에는 값이 `Int` 범위를 벗어나면 해당 범위로 강제 조정되었습니다. `Long` 타입을 사용하면 `Int`에 맞지 않는 값을 잘라내지 않고도 기간 범위 내의 모든 값을 분해할 수 있습니다.

* `DurationUnit` enum은 이제 독립적인 클래스이며 JVM에서 `java.util.concurrent.TimeUnit`의 타입 별칭(type alias)이 아닙니다.
  `typealias DurationUnit = TimeUnit`이 유용할 수 있는 설득력 있는 사례를 찾지 못했습니다. 또한 타입 별칭을 통해 `TimeUnit` API를 노출하는 것이 `DurationUnit` 사용자들을 혼란스럽게 할 수 있습니다.

* 커뮤니티 피드백에 따라 `Int.seconds`와 같은 확장 프로퍼티를 다시 도입합니다. 하지만 적용 범위를 제한하기 위해 이들을 `Duration` 클래스의 companion 객체에 넣었습니다.
  IDE는 여전히 자동 완성에서 확장을 제안하고 companion에서의 임포트를 자동으로 삽입할 수 있지만, 향후에는 `Duration` 타입이 기대되는 경우로 이 동작을 제한할 계획입니다.

  ```kotlin
  import kotlin.time.Duration.Companion.seconds
  
  fun main() {
  //sampleStart
      val duration = 10000
      println("$duration 초에는 ${duration.seconds.inWholeMinutes} 분이 있습니다")
      // 10000 초에는 166 분이 있습니다
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}
  
  이전에 도입된 `Duration.seconds(Int)`와 같은 companion 함수 및 `Int.seconds`와 같은 지원 중단된 최상위 확장을 `Duration.Companion`의 새로운 확장으로 교체하는 것을 권장합니다.

  > 이러한 교체는 이전의 최상위 확장과 새로운 companion 확장 사이에서 모호성을 유발할 수 있습니다.
  > 자동 마이그레이션을 수행하기 전에 `kotlin.time` 패키지의 와일드카드 임포트(`import kotlin.time.*`)를 사용하고 있는지 확인하세요.
  >
  {style="note"}

### Regex를 시퀀스로 분할

`Regex.splitToSequence(CharSequence)` 및 `CharSequence.splitToSequence(Regex)` 함수가 [안정(Stable)](components-stability.md) 상태로 승격되었습니다.
이 함수들은 주어진 정규식 일치 항목을 기준으로 문자열을 분할하지만, 결과를 [시퀀스(Sequence)](sequences.md)로 반환하여 결과에 대한 모든 연산이 지연 실행되도록 합니다.

```kotlin
fun main() {
//sampleStart
    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // 또는
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 정수에 대한 비트 회전 연산

Kotlin 1.6.0에서 비트 조작을 위한 `rotateLeft()` 및 `rotateRight()` 함수가 [안정(Stable)](components-stability.md) 상태가 되었습니다.
이 함수들은 숫자의 이진 표현을 지정된 비트 수만큼 왼쪽이나 오른쪽으로 회전합니다.

```kotlin
fun main() {
//sampleStart
    val number: Short = 0b10001
    println(number
        .rotateRight(2)
        .toString(radix = 2)) // 100000000000100
    println(number
        .rotateLeft(2)
        .toString(radix = 2))  // 1000100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

### JS의 replace() 및 replaceFirst() 변경 사항

Kotlin 1.6.0 이전에는 치환 문자열에 그룹 참조가 포함된 경우 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 및 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex 함수가 Java와 JS에서 다르게 동작했습니다. 모든 타겟 플랫폼에서 동작을 일관되게 맞추기 위해 JS의 구현을 변경했습니다.

치환 문자열에서 `${name}` 또는 `$index`가 나타나면 지정된 인덱스나 이름을 가진 캡처된 그룹에 해당하는 부분 문자열로 대체됩니다.
* `$index` – '` 뒤의 첫 번째 숫자는 항상 그룹 참조의 일부로 처리됩니다. 후속 숫자는 유효한 그룹 참조를 형성하는 경우에만 `index`에 포함됩니다. '0'-'9' 숫자만 그룹 참조의 잠재적 구성 요소로 간주됩니다. 캡처된 그룹의 인덱스는 '1'부터 시작함에 유의하세요. 인덱스 '0'을 가진 그룹은 전체 일치 항목을 나타냅니다.
* `${name}` – `name`은 라틴 문자 'a'–'z', 'A'–'Z' 또는 숫자 '0'–'9'로 구성될 수 있습니다. 첫 번째 문자는 반드시 문자여야 합니다.

    > 치환 패턴에서의 이름 지정된 그룹은 현재 JVM에서만 지원됩니다.
    >
    {style="note"}

* 이어지는 문자를 치환 문자열에서 리터럴로 포함하려면 백슬래시 문자 `\`를 사용하세요.

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    치환 문자열을 리터럴 문자열로 처리해야 하는 경우 [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)를 사용할 수 있습니다.

### 기존 API 개선 사항

* 1.6.0 버전은 `Comparable.compareTo()`에 대한 infix 확장 함수를 추가했습니다. 이제 두 객체의 순서를 비교할 때 infix 형태를 사용할 수 있습니다.

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS의 `Regex.replace()`도 이제 인라인(inline)이 아니게 되어 모든 플랫폼에서 구현이 통일되었습니다.
* `compareTo()` 및 `equals()` String 함수와 `isBlank()` CharSequence 함수는 이제 JS에서 JVM과 똑같이 동작합니다. 이전에는 비 ASCII 문자와 관련하여 차이가 있었습니다.

### 지원 중단 사항

Kotlin 1.6.0에서는 일부 JS 전용 stdlib API에 대해 경고와 함께 지원 중단 주기를 시작합니다.

#### concat(), match(), matches() 문자열 함수

* 문자열을 주어진 다른 객체의 문자열 표현과 결합하려면 `concat()` 대신 `plus()`를 사용하세요.
* 입력 내에서 정규식의 모든 일치 항목을 찾으려면 `String.match(regex: String)` 대신 Regex 클래스의 `findAll()`을 사용하세요.
* 정규식이 전체 입력과 일치하는지 확인하려면 `String.matches(regex: String)` 대신 Regex 클래스의 `matches()`를 사용하세요.

#### 비교 함수를 받는 배열의 sort()

비교 함수에 의해 전달된 순서에 따라 배열을 정렬하는 `Array<out T>.sort()` 함수와 인라인 함수 `ByteArray.sort()`, `ShortArray.sort()`, `IntArray.sort()`, `LongArray.sort()`, `FloatArray.sort()`, `DoubleArray.sort()`, `CharArray.sort()`를 지원 중단했습니다. 배열 정렬에는 다른 표준 라이브러리 함수를 사용하세요.

참고를 위해 [컬렉션 정렬](collection-ordering.md) 섹션을 확인하세요.

## 도구

### Kover – Kotlin용 코드 커버리지 도구

> Kover Gradle 플러그인은 실험적입니다. [GitHub](https://github.com/Kotlin/kotlinx-kover/issues)에서 이에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.6.0과 함께 [IntelliJ](https://github.com/JetBrains/intellij-coverage) 및 [JaCoCo](https://github.com/jacoco/jacoco) Kotlin 코드 커버리지 에이전트를 위한 Gradle 플러그인인 Kover를 도입합니다.
인라인 함수를 포함한 모든 언어 구문에서 작동합니다.

Kover에 대해 더 자세히 알아보려면 [GitHub 저장소](https://github.com/Kotlin/kotlinx-kover)를 확인하거나 이 영상을 시청하세요.

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – 코드 커버리지 플러그인"/>

## Coroutines 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC)가 여러 기능과 개선 사항과 함께 출시되었습니다.

* [새로운 Kotlin/Native 메모리 매니저](#preview-of-the-new-memory-manager) 지원
* 추가 스레드를 생성하지 않고 병렬성을 제한할 수 있는 디스패처 _뷰(views)_ API 도입
* Java 6에서 Java 8 타겟으로 마이그레이션
* 새롭게 재설계된 API와 멀티플랫폼 지원을 갖춘 `kotlinx-coroutines-test`
* 코루틴에 [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 변수에 대한 스레드 안전한 쓰기 액세스를 제공하는 [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html) 도입

[변경 로그](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC)에서 더 자세히 알아보세요.

## Kotlin 1.6.0으로 마이그레이션

IntelliJ IDEA 및 Android Studio는 Kotlin 플러그인이 출시되면 1.6.0으로 업데이트하도록 제안할 것입니다.

기존 프로젝트를 Kotlin 1.6.0으로 마이그레이션하려면 Kotlin 버전을 `1.6.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 임포트하세요. [Kotlin 1.6.0으로 업데이트하는 방법](releases.md#update-to-a-new-kotlin-version)을 알아보세요.

Kotlin 1.6.0으로 새 프로젝트를 시작하려면 Kotlin 플러그인을 업데이트하고 **File** | **New** | **Project**에서 프로젝트 마법사를 실행하세요.

새로운 커맨드라인 컴파일러는 [GitHub 출시 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0)에서 다운로드할 수 있습니다.

Kotlin 1.6.0은 기능 릴리스이므로 이전 버전의 언어로 작성된 코드와 호환되지 않는 변경 사항이 발생할 수 있습니다. 이러한 변경 사항에 대한 자세한 목록은 [Kotlin 1.6 호환성 가이드](compatibility-guide-16.md)에서 확인하세요.