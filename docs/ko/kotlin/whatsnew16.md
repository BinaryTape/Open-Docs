---
title: "Kotlin 1.6.0의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[릴리스 날짜: 2021년 11월 16일](releases#release-details)_

Kotlin 1.6.0은 새로운 언어 기능, 기존 기능에 대한 최적화 및 개선 사항, Kotlin 표준 라이브러리에 대한 많은 개선 사항을 도입합니다.

[릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)에서 변경 사항에 대한 개요를 확인할 수도 있습니다.

## 언어

Kotlin 1.6.0은 이전 1.5.30 릴리스에서 미리 보기로 도입된 여러 언어 기능에 대한 안정화를 제공합니다.
* [enum, sealed, Boolean 대상에 대한 안정적인 완전 when 문](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [슈퍼타입으로서의 안정적인 suspending function](#stable-suspending-functions-as-supertypes)
* [안정적인 suspend 변환](#stable-suspend-conversions)
* [annotation 클래스의 안정적인 인스턴스화](#stable-instantiation-of-annotation-classes)

또한 다양한 타입 추론 개선 사항과 클래스 타입 파라미터에 대한 annotation 지원도 포함합니다.
* [재귀적 제네릭 타입에 대한 개선된 타입 추론](#improved-type-inference-for-recursive-generic-types)
* [빌더 추론 변경 사항](#changes-to-builder-inference)
* [클래스 타입 파라미터에 대한 annotation 지원](#support-for-annotations-on-class-type-parameters)

### enum, sealed, Boolean 대상에 대한 안정적인 완전 when 문

_완전한_ [`when`](control-flow#when-expressions-and-statements) 문은 해당 대상의 모든 가능한 타입 또는 값에 대한 분기 또는 일부 타입에 `else` 분기를 포함합니다.
이는 가능한 모든 경우를 다루어 코드를 더 안전하게 만듭니다.

`when` 표현식과 일관성을 유지하기 위해 곧 완전하지 않은 `when` 문을 금지할 예정입니다.
원활한 마이그레이션을 위해 Kotlin 1.6.0은 enum, sealed 또는 Boolean 대상이 있는 완전하지 않은 `when` 문에 대한 경고를 보고합니다.
이러한 경고는 향후 릴리스에서 오류가 됩니다.

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // Error: 'when' expression must be exhaustive
        is Contact.PhoneCall `->` 42
    }

fun sendMessage(contact: Contact, message: String) {
    // Starting with 1.6.0

    // Warning: Non exhaustive 'when' statements on Boolean will be
    // prohibited in 1.7, add 'false' branch or 'else' branch instead 
    when(message.isEmpty()) {
        true `->` return
    }
    // Warning: Non exhaustive 'when' statements on sealed class/interface will be
    // prohibited in 1.7, add 'is TextMessage' branch or 'else' branch instead
    when(contact) {
        is Contact.PhoneCall `->` TODO()
    }
}
```

변경 사항 및 그 영향에 대한 자세한 설명은 [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-47709)을 참조하십시오.

### 슈퍼타입으로서의 안정적인 suspending function

Kotlin 1.6.0에서 suspending function 타입의 구현이 [안정화](components-stability)되었습니다.
[1.5.30에서 미리 보기](whatsnew1530#suspending-functions-as-supertypes)를 사용할 수 있었습니다.

이 기능은 Kotlin 코루틴을 사용하고 suspending function 타입을 허용하는 API를 설계할 때 유용할 수 있습니다.
이제 원하는 동작을 suspending function 타입을 구현하는 별도의 클래스에 묶어 코드를 간소화할 수 있습니다.

```kotlin
class MyClickAction : suspend () `->` Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () `->` Unit) {}
```

이 클래스의 인스턴스는 람다 및 suspending function 참조만 허용되었던 위치에서 사용할 수 있습니다: `launchOnClick(MyClickAction())`.

현재 구현 세부 사항에서 오는 두 가지 제한 사항이 있습니다.
* 일반 functional 타입과 suspending functional 타입을 슈퍼타입 목록에서 혼합할 수 없습니다.
* 여러 suspending functional 슈퍼타입을 사용할 수 없습니다.

### 안정적인 suspend 변환

Kotlin 1.6.0은 일반 functional 타입에서 suspending functional 타입으로의 [안정적인](components-stability) 변환을 도입합니다.
1.4.0부터 이 기능은 functional 리터럴 및 호출 가능 참조를 지원했습니다.
1.6.0에서는 모든 형태의 표현식에서 작동합니다. 호출 인자로서 suspending이 예상되는 적합한 일반 functional 타입의 모든 표현식을 전달할 수 있습니다.
컴파일러가 자동으로 암시적 변환을 수행합니다.

```kotlin
fun getSuspending(suspending: suspend () `->` Unit) {}

fun suspending() {}

fun test(regular: () `->` Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### annotation 클래스의 안정적인 인스턴스화

Kotlin 1.5.30은 JVM 플랫폼에서 annotation 클래스의 인스턴스화에 대한 실험적 지원을 [도입했습니다](whatsnew1530#instantiation-of-annotation-classes).
1.6.0에서는 Kotlin/JVM 및 Kotlin/JS 모두에서 기본적으로 이 기능을 사용할 수 있습니다.

[이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation)에서 annotation 클래스의 인스턴스화에 대해 자세히 알아보십시오.

### 재귀적 제네릭 타입에 대한 개선된 타입 추론

Kotlin 1.5.30은 재귀적 제네릭 타입에 대한 타입 추론 개선 사항을 도입하여 해당 타입 파라미터의 상한에만 기반하여 타입 인수를 추론할 수 있도록 했습니다.
이 개선 사항은 컴파일러 옵션으로 사용할 수 있었습니다. 1.6.0 이상에서는 기본적으로 활성화됩니다.

```kotlin
// Before 1.5.30
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
  withDatabaseName("db")
  withUsername("user")
  withPassword("password")
  withInitScript("sql/schema.sql")
}

// With compiler option in 1.5.30 or by default starting with 1.6.0
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
  .withDatabaseName("db")
  .withUsername("user")
  .withPassword("password")
  .withInitScript("sql/schema.sql")
```

### 빌더 추론 변경 사항

빌더 추론은 제네릭 빌더 함수를 호출할 때 유용한 타입 추론의 한 형태입니다. 이는 람다 인수 내부의 호출에서 타입 정보를 사용하여 호출의 타입 인수를 추론할 수 있습니다.

완전히 안정적인 빌더 추론에 더 가까워지도록 여러 가지 변경 사항을 적용하고 있습니다. 1.6.0부터 시작:
* [1.5.30에서 도입된](whatsnew1530#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` 컴파일러 옵션을 지정하지 않고도 빌더 람다 내에서 아직 추론되지 않은 타입의 인스턴스를 반환하는 호출을 할 수 있습니다.
* `-Xenable-builder-inference`를 사용하면 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) annotation을 적용하지 않고도 자신의 빌더를 작성할 수 있습니다.

    > 이러한 빌더의 클라이언트는 동일한 `-Xenable-builder-inference` 컴파일러 옵션을 지정해야 합니다.
    >
    

* `-Xenable-builder-inference`를 사용하면 일반 타입 추론이 타입에 대한 충분한 정보를 얻을 수 없는 경우 빌더 추론이 자동으로 활성화됩니다.

[사용자 지정 제네릭 빌더를 작성하는 방법](using-builders-with-builder-inference)을 알아보십시오.

### 클래스 타입 파라미터에 대한 annotation 지원

클래스 타입 파라미터에 대한 annotation 지원은 다음과 같습니다.

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

모든 타입 파라미터에 대한 annotation은 JVM 바이트 코드로 방출되므로 annotation 프로세서가 이를 사용할 수 있습니다.

동기 부여 사용 사례는 [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-43714)을 참조하십시오.

[annotation](annotations)에 대해 자세히 알아보십시오.

## 이전 API 버전의 더 긴 기간 지원

Kotlin 1.6.0부터 현재 안정적인 버전과 함께 이전 API 버전 2개가 아닌 3개를 지원할 것입니다. 현재 버전 1.3, 1.4, 1.5 및 1.6을 지원합니다.

## Kotlin/JVM

Kotlin/JVM의 경우 1.6.0부터 컴파일러는 JVM 17에 해당하는 바이트 코드 버전의 클래스를 생성할 수 있습니다. 새로운 언어 버전에는 최적화된 위임된 속성 및 반복 가능한 annotation도 포함되어 있으며 이는 로드맵에 있었습니다.
* [1.8 JVM 대상에 대한 런타임 보존이 있는 반복 가능한 annotation](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* 주어진 KProperty 인스턴스에서 get/set을 호출하는 최적화된 위임된 속성](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 1.8 JVM 대상에 대한 런타임 보존이 있는 반복 가능한 annotation

Java 8은 단일 코드 요소에 여러 번 적용할 수 있는 [반복 가능한 annotation](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)을 도입했습니다.
이 기능에는 Java 코드에 두 개의 선언이 있어야 합니다. 즉, [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html)로 표시된 반복 가능한 annotation 자체와 해당 값을 보유하는 포함 annotation입니다.

Kotlin에는 반복 가능한 annotation도 있지만 이를 반복 가능하게 만들려면 annotation 선언에 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)만 있으면 됩니다.
1.6.0 이전에는 이 기능은 `SOURCE` 보존만 지원하고 Java의 반복 가능한 annotation과 호환되지 않았습니다.
Kotlin 1.6.0은 이러한 제한 사항을 제거합니다. `@kotlin.annotation.Repeatable`은 이제 모든 보존을 허용하고 Kotlin과 Java 모두에서 annotation을 반복 가능하게 만듭니다.
이제 Kotlin 측에서 Java의 반복 가능한 annotation도 지원됩니다.

포함 annotation을 선언할 수 있지만 필수는 아닙니다. 예를 들어:
* annotation `@Tag`가 `@kotlin.annotation.Repeatable`로 표시되면 Kotlin 컴파일러는 `@Tag.Container` 이름으로 포함 annotation 클래스를 자동으로 생성합니다.

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // The compiler generates @Tag.Container containing annotation
    ```

* 포함 annotation에 대한 사용자 지정 이름을 설정하려면 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 메타 annotation을 적용하고 명시적으로 선언된 포함 annotation 클래스를 인수로 전달합니다.

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

이제 Kotlin 리플렉션은 새로운 함수인 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)를 통해 Kotlin과 Java의 반복 가능한 annotation을 모두 지원합니다.

[이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations)에서 Kotlin 반복 가능한 annotation에 대해 자세히 알아보십시오.

### 주어진 KProperty 인스턴스에서 get/set을 호출하는 최적화된 위임된 속성

`$delegate` 필드를 생략하고 참조된 속성에 대한 즉각적인 액세스를 생성하여 생성된 JVM 바이트 코드를 최적화했습니다.

예를 들어 다음 코드에서

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin은 더 이상 필드 `content$delegate`를 생성하지 않습니다.
`content` 변수의 속성 접근자는 위임된 속성의 `getValue`/`setValue` 연산자를 건너뛰고 따라서 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 타입의 속성 참조 객체가 필요하지 않도록 `impl` 변수를 직접 호출합니다.

구현해 주신 Google 동료들에게 감사합니다!

[위임된 속성](delegated-properties)에 대해 자세히 알아보십시오.

## Kotlin/Native

Kotlin/Native는 여러 개선 사항 및 구성 요소 업데이트를 받고 있으며, 그 중 일부는 미리 보기 상태입니다.
* [새 메모리 관리자 미리 보기](#preview-of-the-new-memory-manager)
* [Xcode 13 지원](#support-for-xcode-13)
* [모든 호스트에서 Windows 대상 컴파일](#compilation-of-windows-targets-on-any-host)
* [LLVM 및 링커 업데이트](#llvm-and-linker-updates)
* [성능 향상](#performance-improvements)
* [JVM 및 JS IR 백엔드와 통합된 컴파일러 플러그인 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klib 링크 실패에 대한 자세한 오류 메시지](#detailed-error-messages-for-klib-linkage-failures)
* [재작업된 처리되지 않은 예외 처리 API](#reworked-unhandled-exception-handling-api)

### 새 메모리 관리자 미리 보기

:::note
새로운 Kotlin/Native 메모리 관리자는 [실험적](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요하며(자세한 내용은 아래 참조) 평가 목적으로만 사용해야 합니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

Kotlin 1.6.0을 사용하면 새로운 Kotlin/Native 메모리 관리자의 개발 미리 보기를 사용해 볼 수 있습니다.
이를 통해 JVM과 Native 플랫폼 간의 차이점을 없애고 멀티 플랫폼 프로젝트에서 일관된 개발자 경험을 제공할 수 있습니다.

주목할 만한 변경 사항 중 하나는 Kotlin/JVM과 같은 최상위 속성의 지연 초기화입니다. 최상위 속성은 동일한 파일의 최상위 속성 또는 함수에 처음 액세스할 때 초기화됩니다.
이 모드에는 중복 초기화 검사를 제거하는 전역 프로시저 간 최적화(릴리스 바이너리에만 활성화됨)도 포함됩니다.

최근에 새로운 메모리 관리자에 대한 [블로그 게시물](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)을 게시했습니다.
새로운 메모리 관리자의 현재 상태에 대해 알아보고 몇 가지 데모 프로젝트를 찾거나 [마이그레이션 지침](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM)으로 바로 이동하여 직접 사용해 보십시오.
새로운 메모리 관리자가 프로젝트에서 어떻게 작동하는지 확인하고 문제 추적기인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)에서 피드백을 공유하십시오.

### Xcode 13 지원

Kotlin/Native 1.6.0은 최신 버전의 Xcode인 Xcode 13을 지원합니다. Xcode를 업데이트하고 Apple 운영 체제용 Kotlin 프로젝트 작업을 계속할 수 있습니다.

Xcode 13에 추가된 새로운 라이브러리는 Kotlin 1.6.0에서 사용할 수 없지만 향후 버전에서 지원을 추가할 예정입니다.

:::

### 모든 호스트에서 Windows 대상 컴파일

1.6.0부터 Windows 대상 `mingwX64` 및 `mingwX86`을 컴파일하는 데 Windows 호스트가 필요하지 않습니다. Kotlin/Native를 지원하는 모든 호스트에서 컴파일할 수 있습니다.

### LLVM 및 링커 업데이트

Kotlin/Native가 내부적으로 사용하는 LLVM 종속성을 재작업했습니다. 이로 인해 다음과 같은 다양한 이점이 있습니다.
* LLVM 버전을 11.1.0으로 업데이트했습니다.
* 종속성 크기를 줄였습니다. 예를 들어 macOS에서는 이전 버전의 1200MB 대신 약 300MB입니다.
* 최신 Linux 배포판에서 사용할 수 없는 [`ncurses5` 라이브러리에 대한 종속성 제외](https://youtrack.jetbrains.com/issue/KT-42693).

LLVM 업데이트 외에도 Kotlin/Native는 이제 MingGW 대상에 대해 [LLD](https://lld.llvm.org/) 링커(LLVM 프로젝트의 링커)를 사용합니다.
이는 이전에 사용된 ld.bfd 링커에 비해 다양한 이점을 제공하며 생성된 바이너리의 런타임 성능을 개선하고 MinGW 대상에 대한 컴파일러 캐시를 지원할 수 있습니다.
LLD는 [DLL 링크에 대한 임포트 라이브러리가 필요합니다](whatsnew1530#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets).
자세한 내용은 [이 Stack Overflow 스레드](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)를 참조하십시오.

### 성능 향상

Kotlin/Native 1.6.0은 다음과 같은 성능 향상을 제공합니다.

* 컴파일 시간: 컴파일러 캐시는 `linuxX64` 및 `iosArm64` 대상에 대해 기본적으로 활성화됩니다.
이렇게 하면 디버그 모드에서 대부분의 컴파일 속도가 빨라집니다(첫 번째 컴파일 제외). 측정 결과 테스트 프로젝트에서 약 200%의 속도 향상을 보였습니다.
컴파일러 캐시는 [추가 Gradle 속성](whatsnew15#performance-improvements)과 함께 Kotlin 1.5.0 이후 이러한 대상에서 사용할 수 있었습니다. 이제 이러한 속성을 제거할 수 있습니다.
* 런타임: 생성된 LLVM 코드의 최적화 덕분에 `for` 루프를 사용하여 배열을 반복하는 속도가 최대 12% 빨라졌습니다.

### JVM 및 JS IR 백엔드와 통합된 컴파일러 플러그인 ABI

:::note
Kotlin/Native에 대한 공통 IR 컴파일러 플러그인 ABI를 사용하는 옵션은 [실험적](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요하며(자세한 내용은 아래 참조) 평가 목적으로만 사용해야 합니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-48595)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

이전 버전에서는 컴파일러 플러그인 작성자가 ABI의 차이로 인해 Kotlin/Native에 대한 별도의 아티팩트를 제공해야 했습니다.

1.6.0부터 Kotlin Multiplatform Gradle 플러그인은 JVM 및 JS IR 백엔드에 사용되는 포함 가능한 컴파일러 jar를 Kotlin/Native에 사용할 수 있습니다.
이제 Native 및 기타 지원되는 플랫폼에 대해 동일한 컴파일러 플러그인 아티팩트를 사용할 수 있으므로 이는 컴파일러 플러그인 개발 경험을 통합하기 위한 단계입니다.

이는 이러한 지원의 미리 보기 버전이며 옵트인이 필요합니다.
Kotlin/Native에 대한 일반 컴파일러 플러그인 아티팩트 사용을 시작하려면 `gradle.properties`에 다음 줄을 추가하십시오: `kotlin.native.useEmbeddableCompilerJar=true`.

향후 Kotlin/Native에 대해 포함 가능한 컴파일러 jar를 기본적으로 사용할 계획이므로 미리 보기가 어떻게 작동하는지 듣는 것이 중요합니다.

컴파일러 플러그인 작성자인 경우 이 모드를 사용해 보고 플러그인에서 작동하는지 확인하십시오.
플러그인의 구조에 따라 마이그레이션 단계가 필요할 수 있습니다. 마이그레이션 지침은 [이 YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-48595)를 참조하고 의견에 피드백을 남겨주십시오.

### klib 링크 실패에 대한 자세한 오류 메시지

이제 Kotlin/Native 컴파일러는 klib 링크 오류에 대한 자세한 오류 메시지를 제공합니다.
이제 메시지에는 명확한 오류 설명이 있으며 가능한 원인과 수정 방법에 대한 정보도 포함됩니다.

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

### 재작업된 처리되지 않은 예외 처리 API

Kotlin/Native 런타임 전체에서 처리되지 않은 예외 처리를 통합했으며 사용자 지정 실행 환경(예: `kotlinx.coroutines`)에서 사용할 수 있도록 기본 처리를 함수 `processUnhandledException(throwable: Throwable)`로 노출했습니다.
이 처리는 `Worker.executeAfter()`의 작업에서 벗어나는 예외에도 적용되지만 새로운 [메모리 관리자](#preview-of-the-new-memory-manager)에만 적용됩니다.

API 개선 사항은 `setUnhandledExceptionHook()`으로 설정된 후크에도 영향을 미쳤습니다. 이전에는 Kotlin/Native 런타임이 처리되지 않은 예외가 있는 후크를 호출한 후 이러한 후크가 재설정되었으며 프로그램은 바로 종료되었습니다.
이제 이러한 후크를 두 번 이상 사용할 수 있으며 처리되지 않은 예외에서 프로그램이 항상 종료되도록 하려면 처리되지 않은 예외 후크(`setUnhandledExceptionHook()`)를 설정하지 않거나 후크 끝에서 `terminateWithUnhandledException()`을 호출해야 합니다.
이렇게 하면 예외를 타사 크래시 보고 서비스(예: Firebase Crashlytics)로 보내고 프로그램을 종료할 수 있습니다.
`main()`에서 벗어나는 예외와 interop 경계를 넘는 예외는 후크가 `terminateWithUnhandledException()`을 호출하지 않은 경우에도 항상 프로그램을 종료합니다.

## Kotlin/JS

Kotlin/JS 컴파일러에 대한 IR 백엔드를 안정화하기 위해 계속 노력하고 있습니다.
Kotlin/JS에는 이제 [Node.js 및 Yarn 다운로드를 비활성화하는 옵션](#option-to-use-pre-installed-node-js-and-yarn)이 있습니다.

### 사전 설치된 Node.js 및 Yarn을 사용하는 옵션

이제 Kotlin/JS 프로젝트를 빌드할 때 Node.js 및 Yarn 다운로드를 비활성화하고 호스트에 이미 설치된 인스턴스를 사용할 수 있습니다.
이는 CI 서버와 같이 인터넷 연결이 없는 서버에서 빌드하는 데 유용합니다.

외부 구성 요소 다운로드를 비활성화하려면 `build.gradle(.kts)`에 다음 줄을 추가하십시오.

* Yarn:

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // or true for default behavior
    }
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```
    
    </TabItem>
    </Tabs>

* Node.js:

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // or true for default behavior
    }
     
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```
    
    </TabItem>
    </Tabs>

## Kotlin Gradle 플러그인

Kotlin 1.6.0에서는 `KotlinGradleSubplugin` 클래스의 더 이상 사용되지 않는 수준을 'ERROR'로 변경했습니다.
이 클래스는 컴파일러 플러그인을 작성하는 데 사용되었습니다. 다음 릴리스에서는 이 클래스를 제거할 예정입니다. 대신 `KotlinCompilerPluginSupportPlugin` 클래스를 사용하십시오.

`kotlin.useFallbackCompilerSearch` 빌드 옵션과 `noReflect` 및 `includeRuntime` 컴파일러 옵션을 제거했습니다.
`useIR` 컴파일러 옵션은 숨겨졌으며 향후 릴리스에서 제거될 예정입니다.

Kotlin Gradle 플러그인에서 [현재 지원되는 컴파일러 옵션](gradle-compiler-options)에 대해 자세히 알아보십시오.

## 표준 라이브러리

새로운 1.6.0 버전의 표준 라이브러리는 실험적 기능을 안정화하고 새로운 기능을 도입하며 플랫폼 간의 동작을 통합합니다.

* [새 readline 함수](#new-readline-functions)
* [안정적인 typeOf()](#stable-typeof)
* [안정적인 컬렉션 빌더](#stable-collection-builders)
* [안정적인 Duration API](#stable-duration-api)
* [Regex를 시퀀스로 분할](#splitting-regex-into-a-sequence)
* [정수에 대한 비트 회전 연산](#bit-rotation-operations-on-integers)
* [JS에서 replace() 및 replaceFirst()에 대한 변경 사항](#changes-for-replace-and-replacefirst-in-js)
* [기존 API 개선 사항](#improvements-to-the-existing-api)
* [더 이상 사용되지 않음](#deprecations)

### 새 readline 함수

Kotlin 1.6.0은 표준 입력을 처리하기 위한 새로운 함수를 제공합니다. [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 및 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html).

현재 새로운 함수는 JVM 및 Native 대상 플랫폼에서만 사용할 수 있습니다.

:::

|**이전 버전**|**1.6.0 대체**|**사용법**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| stdin에서 한 줄을 읽고 반환하거나 EOF에 도달한 경우 `RuntimeException`을 throw합니다. |
|`readLine()`|`readlnOrNull()`| stdin에서 한 줄을 읽고 반환하거나 EOF에 도달한 경우 `null`을 반환합니다. |

한 줄을 읽을 때 `!!`을 사용할 필요가 없어져서 Kotlin을 처음 접하는 사람들의 경험을 개선하고 Kotlin 교육을 단순화할 수 있다고 생각합니다.
읽기 줄 작업 이름을 해당 `println()`과 일관되게 만들기 위해 새 함수 이름을 'ln'으로 단축하기로 결정했습니다.

```kotlin
println("What is your nickname?")
val nickname = readln()
println("Hello, $nickname!")
```

```kotlin
fun main() {

    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless { 
            it.isNullOrEmpty() 
        } ?: break
        sum += nextLine.toInt()
    }
    println(sum)

}
```

기존 `readLine()` 함수는 IDE 코드 완성에서 `readln()` 및 `readlnOrNull()`보다 우선 순위가 낮아집니다.
IDE 검사에서는 레거시 `readLine()` 대신 새 함수를 사용하는 것이 좋습니다.

향후 릴리스에서 `readLine()` 함수를 점진적으로 더 이상 사용하지 않을 계획입니다.

### 안정적인 typeOf()

버전 1.6.0은 [안정적인](components-stability) [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 함수를 제공하여 [주요 로드맵 항목](https://youtrack.jetbrains.com/issue/KT-45396) 중 하나를 완료합니다.

[1.3.40 이후](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/), `typeOf()`는 JVM 플랫폼에서 실험적 API로 사용할 수 있었습니다.
이제 모든 Kotlin 플랫폼에서 이를 사용하고 컴파일러가 추론할 수 있는 모든 Kotlin 타입의 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 표현을 얻을 수 있습니다.

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

Kotlin 1.6.0에서는 컬렉션 빌더 함수가 [안정](components-stability)으로 승격되었습니다. 컬렉션 빌더에서 반환된 컬렉션은 이제 읽기 전용 상태에서 직렬화할 수 있습니다.

이제 옵트인 annotation 없이 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html),
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 및 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)을 사용할 수 있습니다.

```kotlin
fun main() {

    val x = listOf('b', 'c')
    val y = buildList {
        add('a')
        addAll(x)
        add('d')
    }
    println(y)  // [a, b, c, d]

}
```

### 안정적인 Duration API

다양한 시간 단위로 duration 양을 나타내는 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 클래스가 [안정](components-stability)으로 승격되었습니다. 1.6.0에서는 Duration API에 다음과 같은 변경 사항이 적용되었습니다.

* duration을 일, 시, 분, 초 및 나노초로 분해하는 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 함수의 첫 번째 구성 요소는 이제 `Int` 타입 대신 `Long` 타입을 가집니다.
  이전에는 값이 `Int` 범위에 맞지 않으면 해당 범위로 강제 변환되었습니다. `Long` 타입을 사용하면 `Int`에 맞지 않는 값을 잘라내지 않고도 duration 범위의 모든 값을 분해할 수 있습니다.

* `DurationUnit` enum은 이제 독립 실행형이며 JVM에서 `java.util.concurrent.TimeUnit`의 타입 별칭이 아닙니다.
  `typealias DurationUnit = TimeUnit`이 유용할 수 있는 설득력 있는 사례를 찾지 못했습니다. 또한 타입 별칭을 통해 `TimeUnit` API를 노출하면 `DurationUnit` 사용자가 혼동될 수 있습니다.

* 커뮤니티 피드백에 응답하여 `Int.seconds`와 같은 확장 속성을 다시 가져오고 있습니다. 그러나 적용 가능성을 제한하고 싶으므로 `Duration` 클래스의 동반자에 넣었습니다.
  IDE는 여전히 완료 시 확장을 제안하고 동반자에서 가져오기를 자동으로 삽입할 수 있지만 향후에는 `Duration` 타입이 예상되는 경우로 이 동작을 제한할 계획입니다.

  ```kotlin
  import kotlin.time.Duration.Companion.seconds
  
  fun main() {

      val duration = 10000
      println("There are ${duration.seconds.inWholeMinutes} minutes in $duration seconds")
      // There are 166 minutes in 10000 seconds

  }
  ```
  
  
  이전에 도입된 동반 함수(예: `Duration.seconds(Int)`)와 더 이상 사용되지 않는 최상위 확장을 새 `Duration.Companion`의 확장으로 대체하는 것이 좋습니다.

  > 이러한 대체는 이전 최상위 확장과 새로운 동반 확장 간의 모호성을 유발할 수 있습니다.
  > 자동 마이그레이션을 수행하기 전에 kotlin.time 패키지의 와일드카드 가져오기(`import kotlin.time.*`)를 사용해야 합니다.
  >
  

### Regex를 시퀀스로 분할

`Regex.splitToSequence(CharSequence)` 및 `CharSequence.splitToSequence(Regex)` 함수가 [안정](components-stability)으로 승격되었습니다.
지정된 정규식의 일치 항목을 중심으로 문자열을 분할하지만 결과를 [시퀀스](sequences)로 반환하므로 이 결과에 대한 모든 작업이 지연 실행됩니다.

```kotlin
fun main() {

    val colorsText = "green, red, brown&blue