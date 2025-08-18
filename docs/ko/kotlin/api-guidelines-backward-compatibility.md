[//]: # (title: 라이브러리 작성자를 위한 하위 호환성 가이드라인)

라이브러리를 만드는 가장 흔한 동기는 더 넓은 커뮤니티에 기능을 노출하는 것입니다.
이 커뮤니티는 단일 팀, 회사, 특정 산업 또는 기술 플랫폼일 수 있습니다.
모든 경우에 하위 호환성은 중요한 고려 사항이 될 것입니다.
커뮤니티가 넓을수록 사용자가 누구인지, 어떤 제약 조건 내에서 작업하는지 알기 어렵기 때문에 하위 호환성이 더욱 중요해집니다.

하위 호환성은 단일 용어가 아니라 바이너리, 소스 및 동작 수준에서 정의될 수 있습니다.
이러한 유형에 대한 자세한 정보는 이 섹션에서 제공됩니다.

참고:

* 소스 호환성을 깨지 않고도 바이너리 호환성을 깰 수 있으며, 그 반대의 경우도 가능합니다.
* 소스 호환성을 보장하는 것은 바람직하지만 매우 어렵습니다. 라이브러리 작성자는 라이브러리 사용자가 함수나 타입을 호출하거나 인스턴스화할 수 있는 모든 가능한 방법을 고려해야 합니다.
소스 호환성은 일반적으로 염원이지 약속이 아닙니다.

이 섹션의 나머지 부분에서는 다양한 종류의 호환성을 보장하는 데 도움이 되는 조치와 도구에 대해 설명합니다.

## 호환성 유형 {initial-collapse-state="collapsed" collapsible="true"}

**바이너리 호환성**은 새 버전의 라이브러리가 이전에 컴파일된 라이브러리 버전을 대체할 수 있음을 의미합니다.
이전 버전의 라이브러리에 대해 컴파일된 모든 소프트웨어는 계속해서 올바르게 작동해야 합니다.

> 바이너리 호환성에 대한 자세한 내용은 [바이너리 호환성 검증 도구의 README](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#what-makes-an-incompatible-change-to-the-public-binary-api) 또는 [자바 기반 API 발전](https://github.com/eclipse-platform/eclipse.platform/blob/master/docs/Evolving-Java-based-APIs-2.md) 문서를 참조하십시오.
>
{style="tip"}

**소스 호환성**은 새 버전의 라이브러리가 라이브러리를 사용하는 소스 코드를 전혀 수정하지 않고 이전 버전을 대체할 수 있음을 의미합니다. 그러나 이 클라이언트 코드를 컴파일한 결과물은 라이브러리를 컴파일한 결과물과 더 이상 호환되지 않을 수 있으므로, 호환성을 보장하려면 클라이언트 코드를 새 버전의 라이브러리에 대해 다시 빌드해야 합니다.

**동작 호환성**은 새 버전의 라이브러리가 버그 수정을 제외하고 기존 기능을 수정하지 않음을 의미합니다. 동일한 기능이 포함되며 동일한 의미론을 가집니다.

## 바이너리 호환성 검증 도구 사용

JetBrains는 API의 여러 버전 간에 바이너리 호환성을 보장하는 데 사용할 수 있는 [바이너리 호환성 검증 도구](https://github.com/Kotlin/binary-compatibility-validator)를 제공합니다.

이 도구는 Gradle 플러그인으로 구현되어 빌드에 두 가지 태스크를 추가합니다.

* `apiDump` 태스크는 API를 설명하는 사람이 읽을 수 있는 `.api` 파일을 생성합니다.
* `apiCheck` 태스크는 저장된 API 설명과 현재 빌드에서 컴파일된 클래스를 비교합니다.

`apiCheck` 태스크는 표준 Gradle `check` 태스크에 의해 빌드 시 호출됩니다.
호환성이 깨지면 빌드가 실패합니다. 이 시점에서 `apiDump` 태스크를 수동으로 실행하고 이전 버전과 새 버전 간의 차이점을 비교해야 합니다.
변경 사항에 만족하면 VCS 내에 있는 기존 `.api` 파일을 업데이트할 수 있습니다.

이 검증 도구는 멀티플랫폼 라이브러리에서 생성된 [KLib 검증에 대한 실험적 지원](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#experimental-klib-abi-validation-support)을 제공합니다.

### Kotlin Gradle 플러그인의 바이너리 호환성 검증

<primary-label ref="experimental-general"/>

버전 2.2.0부터 Kotlin Gradle 플러그인은 바이너리 호환성 검증을 지원합니다. 자세한 내용은 [Kotlin Gradle 플러그인의 바이너리 호환성 검증](gradle-binary-compatibility-validation.md)을 참조하십시오.

## 반환 타입을 명시적으로 지정

[코틀린 코딩 가이드라인](coding-conventions.md#coding-conventions-for-libraries)에서 논의된 바와 같이, API 내에서 함수 반환 타입과 프로퍼티 타입을 항상 명시적으로 지정해야 합니다. [명시적 API 모드](api-guidelines-simplicity.md#use-explicit-api-mode) 섹션도 참조하십시오.

라이브러리 작성자가 `JsonDeserializer`를 생성하고, 편의를 위해 확장 함수를 사용하여 `Int` 타입과 연결하는 다음 예시를 고려해 보십시오.

```kotlin
class JsonDeserializer<T>(private val fromJson: (String) -> T) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonDeserializer { ... }
```

작성자가 이 구현을 `JsonOrXmlDeserializer`로 대체한다고 가정해 봅시다.

```kotlin
class JsonOrXmlDeserializer<T>(
    private val fromJson: (String) -> T,
    private val fromXML: (String) -> T
) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonOrXmlDeserializer({ ... }, { ... })
```

기존 기능은 XML을 역직렬화하는 기능이 추가되어 계속 작동할 것입니다. 그러나 이는 바이너리 호환성을 깨뜨립니다.

## 기존 API 함수에 인자 추가 피하기

공개 API에 기본값이 아닌 인자를 추가하면 이전보다 더 많은 호출 정보를 제공해야 하므로 바이너리 및 소스 호환성 모두 깨집니다.
그러나 [기본 인자](functions.md#parameters-with-default-values)를 추가하는 것만으로도 호환성을 깨뜨릴 수 있습니다.

예를 들어, `lib.kt` 파일에 다음 함수가 있다고 상상해 보십시오.

```kotlin
fun fib() = … // Returns zero
```

그리고 `client.kt` 파일에 다음 함수가 있습니다.

```kotlin
fun main() {
    println(fib()) // Prints zero
}
```
JVM에서 이 두 파일을 컴파일하면 `LibKt.class`와 `ClientKt.class` 결과물이 생성됩니다.

`fib` 함수를 피보나치 수열을 나타내도록 다시 구현하고 컴파일하여 `fib(3)`이 2를 반환하고, `fib(4)`가 3을 반환하는 식으로 만든다고 가정해 봅시다.
기존 동작을 유지하기 위해 파라미터를 추가하고 기본값으로 0을 부여합니다.

```kotlin
fun fib(input: Int = 0) = … // Returns Fibonacci member
```

이제 `lib.kt` 파일을 다시 컴파일해야 합니다. `client.kt` 파일은 다시 컴파일할 필요가 없으며, 관련 클래스 파일은 다음과 같이 호출될 수 있다고 예상할 수 있습니다.

```shell
$ kotlin ClientKt.class
```

하지만 이렇게 시도하면 `NoSuchMethodError`가 발생합니다.

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'int LibKt.fib()'
       at LibKt.main(fib.kt:2)
       at LibKt.main(fib.kt)
       …
```

이는 Kotlin/JVM 컴파일러가 생성한 바이트코드에서 메서드의 시그니처가 변경되어 바이너리 호환성을 깨뜨리기 때문입니다.

그러나 소스 호환성은 유지됩니다. 두 파일을 모두 다시 컴파일하면 프로그램은 이전과 같이 실행될 것입니다.

### 오버로드를 사용하여 호환성 유지 {initial-collapse-state="collapsed" collapsible="true"}

JVM용 Kotlin 코드를 작성할 때, 기본 인자를 가진 함수에 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/) 어노테이션을 사용할 수 있습니다.
이것은 함수 오버로드를 생성하는데, 파라미터 목록의 끝에서 생략될 수 있는 기본 인자를 가진 각 파라미터에 대해 하나씩 생성됩니다.
이렇게 개별적으로 생성된 함수들을 사용하면, 파라미터 목록 끝에 새 파라미터를 추가해도 출력에 기존 함수를 변경하지 않고 새로운 함수만 추가하기 때문에 바이너리 호환성이 유지됩니다.

예를 들어, 위 함수는 다음과 같이 어노테이션이 지정될 수 있습니다.

```kotlin
@JvmOverloads
fun fib(input: Int = 0) = …
```

이것은 출력 바이트코드에서 두 개의 메서드를 생성하는데, 하나는 파라미터가 없고 다른 하나는 `Int` 파라미터를 가집니다.

```kotlin
public final static fib()I
public final static fib(I)I
```

모든 Kotlin 타겟의 경우, 바이너리 호환성을 유지하기 위해 기본 인자를 받는 단일 함수 대신 여러 오버로드를 수동으로 생성할 수 있습니다. 위 예시에서, 이는 `Int` 파라미터를 받기를 원하는 경우 별도의 `fib` 함수를 생성하는 것을 의미합니다.

```kotlin
fun fib() = … 
fun fib(input: Int) = …
```

## 반환 타입 확장 또는 축소 피하기

API를 발전시킬 때, 함수의 반환 타입을 확장하거나 축소하려는 경우가 흔합니다.
예를 들어, API의 다음 버전에서 반환 타입을 `List`에서 `Collection`으로 또는 `Collection`에서 `List`로 변경하고 싶을 수 있습니다.

인덱싱 지원에 대한 사용자 요청을 충족하기 위해 타입을 `List`로 좁히고 싶을 수 있습니다.
반대로, 작업 중인 데이터에 자연적인 순서가 없다는 것을 깨달았기 때문에 타입을 `Collection`으로 확장하고 싶을 수 있습니다.

반환 타입을 확장하는 것이 왜 호환성을 깨뜨리는지 쉽게 알 수 있습니다. 예를 들어, `List`에서 `Collection`으로 변환하면 인덱싱을 사용하는 모든 코드가 깨집니다.

반환 타입을 좁히는 것, 예를 들어 `Collection`에서 `List`로 변경하는 것이 호환성을 유지할 것이라고 생각할 수 있습니다.
안타깝게도 소스 호환성은 유지되지만 바이너리 호환성은 깨집니다.

`Library.kt` 파일에 데모 함수가 있다고 가정해 봅시다.

```kotlin
public fun demo(): Number = 3
```

그리고 `Client.kt` 파일에 이 함수의 클라이언트가 있습니다.

```kotlin
fun main() {
    println(demo()) // Prints 3
}
```

데모 함수의 반환 타입을 변경하고 `Library.kt`만 다시 컴파일하는 시나리오를 상상해 봅시다.

```kotlin
fun demo(): Int = 3
```

클라이언트를 다시 실행하면 다음 오류가 발생합니다 (JVM에서):

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'java.lang.Number Library.demo()'
        at ClientKt.main(call.kt:2)
        at ClientKt.main(call.kt)
        …
```

이는 `main` 메서드에서 생성된 바이트코드의 다음 명령어 때문에 발생합니다.

```text
0: invokestatic  #12 // Method Library.demo:()Ljava/lang/Number;
```

JVM은 `Number`를 반환하는 `demo`라는 정적 메서드를 호출하려고 시도합니다.
그러나 이 메서드가 더 이상 존재하지 않으므로 바이너리 호환성을 깨뜨렸습니다.

## API에서 데이터 클래스 사용 피하기

일반적인 개발에서 데이터 클래스의 강점은 자동으로 생성되는 추가 함수들입니다.
API 설계에서는 이러한 강점이 약점이 됩니다.

예를 들어, API에서 다음 데이터 클래스를 사용한다고 가정해 봅시다.

```kotlin
data class User(
    val name: String,
    val email: String
)
```

나중에 `active`라는 프로퍼티를 추가하고 싶을 수 있습니다.

```kotlin
data class User(
    val name: String,
    val email: String,
    val active: Boolean = true
)
```

이는 두 가지 방식으로 바이너리 호환성을 깨뜨릴 것입니다. 첫째, 생성된 생성자는 다른 시그니처를 가질 것입니다.
또한, 생성된 `copy` 메서드의 시그니처가 변경됩니다.

원본 시그니처(Kotlin/JVM에서)는 다음과 같을 것입니다.

```text
public final User copy(java.lang.String, java.lang.String)
```

`active` 프로퍼티를 추가한 후 시그니처는 다음과 같이 됩니다.

```text
public final User copy(java.lang.String, java.lang.String, boolean)
```

생성자와 마찬가지로 이는 바이너리 호환성을 깨뜨립니다.

이러한 문제를 해결하기 위해 보조 생성자를 수동으로 작성하고 `copy` 메서드를 오버라이드할 수 있습니다.
그러나 관련된 노력은 데이터 클래스 사용의 편리함을 상쇄합니다.

데이터 클래스의 또 다른 문제는 생성자 인자의 순서를 변경하면 구조 분해(destructuring)에 사용되는 생성된 `componentX` 메서드에 영향을 미친다는 것입니다.
바이너리 호환성을 깨뜨리지 않더라도 순서를 변경하면 확실히 동작 호환성이 깨집니다.

## `PublishedApi` 어노테이션 사용 시 고려 사항

Kotlin은 인라인 함수가 라이브러리 API의 일부가 될 수 있도록 허용합니다. 이러한 함수에 대한 호출은 사용자 작성 클라이언트 코드에 인라인될 것입니다.
이는 호환성 문제를 야기할 수 있으므로, 이 함수들은 공개 API가 아닌 선언을 호출할 수 없습니다.

인라인된 공개 함수에서 라이브러리의 내부 API를 호출해야 하는 경우, [`@PublishedApi`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-published-api/) 어노테이션을 사용하여 그렇게 할 수 있습니다.
이는 내부 선언을 사실상 공개 상태로 만드는데, 그에 대한 참조가 컴파일된 클라이언트 코드에 포함되기 때문입니다.
따라서 변경 사항이 바이너리 호환성에 영향을 미칠 수 있으므로 변경 시 공개 선언과 동일하게 취급해야 합니다.

## API 실용적으로 발전시키기

시간이 지남에 따라 기존 선언을 제거하거나 변경하여 라이브러리 API에 호환성이 깨지는 변경(breaking changes)을 해야 하는 경우가 있습니다.
이 섹션에서는 이러한 경우를 실용적으로 처리하는 방법을 논의할 것입니다.

사용자가 라이브러리의 최신 버전으로 업그레이드할 때, 프로젝트의 소스 코드에서 라이브러리 API에 대한 미해결 참조가 발생해서는 안 됩니다.
라이브러리의 공개 API에서 즉시 무언가를 제거하는 대신, 사용 중단(deprecation) 주기를 따라야 합니다. 이렇게 하면 사용자에게 대안으로 마이그레이션할 시간을 줄 수 있습니다.

이전 선언에 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 어노테이션을 사용하여 대체되고 있음을 나타냅니다. 이 어노테이션의 파라미터는 사용 중단에 대한 중요한 세부 정보를 제공합니다.

* `message`는 무엇이 변경되고 왜 변경되는지 설명해야 합니다.
* `replaceWith` 파라미터는 가능한 경우 새 API로의 자동 마이그레이션을 제공하는 데 사용되어야 합니다.
* 사용 중단의 수준은 API를 점진적으로 사용 중단하는 데 사용되어야 합니다. 자세한 내용은 [Kotlin 문서의 Deprecated 페이지](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)를 참조하십시오.

일반적으로 사용 중단은 먼저 경고를 생성한 다음 오류를 생성하고, 그 다음 선언을 숨겨야 합니다.
이 과정은 여러 마이너 릴리스에 걸쳐 발생해야 하며, 사용자가 프로젝트에서 필요한 변경 사항을 적용할 시간을 제공해야 합니다.
API 제거와 같은 호환성이 깨지는 변경은 메이저 릴리스에서만 발생해야 합니다.
라이브러리는 다른 버전 관리 및 사용 중단 전략을 채택할 수 있지만, 이는 사용자에게 올바른 기대치를 설정하기 위해 반드시 전달되어야 합니다.

[코틀린 발전 원칙 문서](kotlin-evolution-principles.md#libraries) 또는 KotlinConf 2023에서 Leonid Startsev의 [클라이언트를 위해 Kotlin API를 고통 없이 발전시키기](https://www.youtube.com/watch?v=cCgXtpVPO-o&t=1468s) 강연에서 더 많은 정보를 얻을 수 있습니다.

## `RequiresOptIn` 메커니즘 사용

Kotlin 표준 라이브러리는 사용자가 API의 일부를 사용하기 전에 명시적인 동의를 요구하는 [옵트인(opt-in) 메커니즘](opt-in-requirements.md)을 제공합니다.
이는 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/)으로 어노테이션이 지정된 마커 어노테이션을 생성하는 것을 기반으로 합니다.
이 메커니즘을 사용하여 소스 및 동작 호환성에 대한 기대치를 관리해야 하며, 특히 라이브러리에 새 API를 도입할 때 더욱 그렇습니다.

이 메커니즘을 사용하기로 결정했다면, 다음 모범 사례를 따르는 것이 좋습니다.

* 옵트인 메커니즘을 사용하여 API의 다른 부분에 다른 보증을 제공하십시오. 예를 들어, 기능을 _미리 보기_, _실험적_, _세심함_으로 표시할 수 있습니다. 각 범주는 문서와 [KDoc 주석](kotlin-doc.md)에 적절한 경고 메시지와 함께 명확하게 설명되어야 합니다.
* 라이브러리가 실험적인 API를 사용하는 경우, [어노테이션을 사용자에게 전파](opt-in-requirements.md#propagate-opt-in-requirements)하십시오. 이는 사용자가 아직 발전 중인 종속성이 있음을 인지하도록 보장합니다.
* 라이브러리에 이미 존재하는 선언을 사용 중단하는 데 옵트인 메커니즘을 사용하지 마십시오. 대신 [API 실용적으로 발전시키기](#evolve-apis-pragmatically) 섹션에서 설명된 대로 `@Deprecated`를 사용하십시오.

## 다음 단계

아직 확인하지 않았다면 다음 페이지를 살펴보세요.

* [정신적 복잡성 최소화](api-guidelines-minimizing-mental-complexity.md) 페이지에서 정신적 복잡성을 최소화하는 전략을 살펴보십시오.
* 효과적인 문서화 관행에 대한 광범위한 개요는 [정보성 문서](api-guidelines-informative-documentation.md)를 참조하십시오.