[//]: # (title: 가독성)

API를 읽기 쉽게 만드는 것은 단순히 깔끔한 코드를 작성하는 것 이상입니다. 통합 및 사용을 간소화하는 사려 깊은 디자인이 필요합니다. 이 섹션에서는 컴포저빌리티(composability)를 염두에 두고 라이브러리를 구성하고, 간결하고 표현력 있는 설정을 위해 도메인 특정 언어(DSL: Domain-Specific Language)를 활용하며, 명확하고 유지보수 가능한 코드를 위해 확장 함수(extension function) 및 프로퍼티(property)를 사용하여 API 가독성을 높이는 방법을 살펴봅니다.

## 명시적 컴포저빌리티 선호

라이브러리는 종종 사용자 지정(customization)을 허용하는 고급 연산자(operator)를 제공합니다. 예를 들어, 어떤 연산은 사용자가 고유한 데이터 구조, 네트워킹 채널, 타이머 또는 라이프사이클 옵저버를 제공하도록 허용할 수 있습니다. 그러나 추가 함수 파라미터를 통해 이러한 사용자 지정 옵션을 도입하면 API의 복잡성을 크게 증가시킬 수 있습니다.

사용자 지정을 위한 더 많은 파라미터를 추가하는 대신, 다른 동작들을 함께 구성할 수 있는 API를 설계하는 것이 더 효과적입니다. 예를 들어, 코루틴 Flow API에서는 [버퍼링(buffering)](flow.md#buffering)과 [컨플레이션(conflation)](flow.md#conflation)이 모두 별도의 함수로 구현됩니다. 이는 각 기본 연산이 버퍼링 및 컨플레이션을 제어하기 위한 파라미터를 받는 대신, [`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 및 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html)과 같은 더 기본적인 연산과 함께 연결될 수 있습니다.

또 다른 예시는 [Jetpack Compose의 Modifier API](https://developer.android.com/develop/ui/compose/modifiers)입니다. 이는 컴포저블(Composable) 컴포넌트가 패딩(padding), 크기 조절(sizing), 배경색(background color)과 같은 일반적인 사용자 지정 옵션을 처리하는 단일 `Modifier` 파라미터를 허용하도록 합니다. 이 접근 방식은 각 컴포저블이 이러한 사용자 지정을 위해 별도의 파라미터를 받을 필요를 없애주어, API를 간소화하고 복잡성을 줄입니다.

```kotlin
Box(
    modifier = Modifier
        .padding(10.dp)
        .onClick { println("Box clicked!") }
        .fillMaxWidth()
        .fillMaxHeight()
        .verticalScroll(rememberScrollState())
        .horizontalScroll(rememberScrollState())
) {
    // Box content goes here
}
```

## DSL 사용

Kotlin 라이브러리는 빌더 DSL(Domain-Specific Language)을 제공하여 가독성을 크게 향상시킬 수 있습니다. DSL을 사용하면 도메인 특정 데이터 선언을 간결하게 반복할 수 있습니다. 예를 들어, Ktor 기반 서버 애플리케이션의 다음 예시를 살펴보세요.

```kotlin
fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
    routing {
        post("/article") {
            call.respond<String>(HttpStatusCode.Created, ...)
        }
        get("/article/list") {
            call.respond<List<CreateArticle>>(...)
        }
        get("/article/{id}") {
            call.respond<Article>(...)
        }
    }
}
```

이는 애플리케이션을 설정하고, Json 직렬화를 사용하도록 구성된 `ContentNegotiation` 플러그인을 설치하며, 애플리케이션이 다양한 `/article` 엔드포인트의 요청에 응답하도록 라우팅을 설정합니다.

DSL 생성에 대한 자세한 설명은 [타입-세이프 빌더(Type-safe builders)](type-safe-builders.md)를 참조하세요. 라이브러리 생성과 관련하여 다음 사항들을 주목할 가치가 있습니다.

*   DSL에 사용되는 함수는 빌더 함수(builder function)이며, 최종 파라미터로 수신자(receiver)가 있는 람다(lambda)를 받습니다. 이 설계는 이러한 함수를 괄호 없이 호출할 수 있게 하여 구문을 더 명확하게 만듭니다. 전달되는 람다는 생성되는 엔티티를 구성하는 데 사용될 수 있습니다. 위 예시에서 `routing` 함수에 전달된 람다는 라우팅의 세부 사항을 구성하는 데 사용됩니다.
*   클래스 인스턴스를 생성하는 팩토리 함수(factory function)는 반환 타입과 이름이 같아야 하며 대문자로 시작해야 합니다. 위 예시에서 `Json` 인스턴스 생성에서 이를 확인할 수 있습니다. 이러한 함수는 구성(configuration)을 위해 람다 파라미터를 계속 받을 수 있습니다. 자세한 내용은 [코딩 컨벤션(Coding conventions)](coding-conventions.md#function-names)을 참조하세요.
*   빌더 함수에 제공된 람다 내에서 필수 프로퍼티가 설정되었는지 컴파일 타임에 보장할 수 없으므로, 필수 값은 함수 파라미터로 전달하는 것을 권장합니다.

DSL을 사용하여 객체를 빌드하는 것은 가독성을 향상시킬 뿐만 아니라 하위 호환성(backward compatibility)을 개선하고 문서화 프로세스를 간소화합니다. 예를 들어, 다음 함수를 살펴보세요.

```kotlin
fun Json(prettyPrint: Boolean, isLenient: Boolean): Json
```

이 함수는 `Json{}` DSL 빌더를 대체할 수 있습니다. 그러나 DSL 접근 방식은 다음과 같은 명확한 이점을 가집니다.

*   기존 함수의 파라미터 목록을 변경하는 것과 달리, 새로운 설정 옵션을 추가하는 것이 단순히 새로운 프로퍼티(또는 다른 예시에서는 새로운 함수)를 추가하는 것을 의미하므로, DSL 빌더를 사용하면 이 함수보다 하위 호환성을 유지하기가 더 쉽습니다. 이는 하위 호환 가능한 변경입니다.
*   또한 문서 생성 및 유지보수를 더 쉽게 만듭니다. 함수에 대한 많은 파라미터를 한곳에 모두 문서화할 필요 없이, 각 프로퍼티를 선언 지점에서 개별적으로 문서화할 수 있습니다.

## 확장 함수 및 프로퍼티 사용

가독성 향상을 위해 [확장 함수(extension function) 및 프로퍼티(property)](extensions.md)를 사용하는 것을 권장합니다.

클래스(class)와 인터페이스(interface)는 타입의 핵심 개념을 정의해야 합니다. 추가적인 기능과 정보는 확장 함수 및 프로퍼티로 작성되어야 합니다. 이는 독자에게 추가 기능이 핵심 개념 위에 구현될 수 있으며, 추가 정보는 타입의 데이터로부터 계산될 수 있음을 명확히 합니다.

예를 들어, `String`도 구현하는 [`CharSequence`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-sequence/) 타입은 내용에 접근하기 위한 가장 기본적인 정보와 연산자만 포함합니다.

```kotlin
interface CharSequence {
    val length: Int
    operator fun get(index: Int): Char
    fun subSequence(startIndex: Int, endIndex: Int): CharSequence
}
```

문자열과 일반적으로 연관된 기능은 대부분 확장 함수로 정의되며, 이들은 모두 타입의 핵심 개념과 기본 API 위에 구현될 수 있습니다.

```kotlin
inline fun CharSequence.isEmpty(): Boolean = length == 0
inline fun CharSequence.isNotEmpty(): Boolean = length > 0

inline fun CharSequence.trimStart(predicate: (Char) -> Boolean): CharSequence {
    for (index in this.indices)
        if (!predicate(this[index]))
           return subSequence(index, length)
    return ""
}
```

계산된 프로퍼티(computed property)와 일반 메서드(method)는 확장으로 선언하는 것을 고려하세요. 기본적으로 일반 프로퍼티, 오버라이드(override) 및 오버로드된 연산자(overloaded operator)만 멤버로 선언되어야 합니다.

## 불리언 타입을 인자로 사용하는 것을 피하세요

다음 함수를 고려해보세요.

```kotlin
fun doWork(optimizeForSpeed: Boolean) { ... }
```

이 함수를 API에서 제공한다면 다음과 같이 호출될 수 있습니다.

```kotlin
doWork(true)
doWork(optimizeForSpeed=true)
```

첫 번째 호출에서는 IDE에서 파라미터 이름 힌트(Parameter Name Hints)가 활성화되어 있지 않는 한, 불리언 인자가 무엇을 위한 것인지 추론하기 불가능합니다. 명명된 인자(named argument)를 사용하면 의도가 명확해지지만, 사용자에게 이 스타일을 강제할 방법은 없습니다. 따라서 가독성 향상을 위해 코드에서 불리언 타입을 인자로 사용해서는 안 됩니다.

대안으로, API는 불리언 인자에 의해 제어되는 작업을 위한 별도의 함수를 생성할 수 있습니다. 이 함수는 그 기능이 무엇인지 나타내는 설명적인 이름을 가져야 합니다.

예를 들어, [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/) 인터페이스에는 다음 확장(extension)들이 있습니다.

```kotlin
fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R>
fun <T, R : Any> Iterable<T>.mapNotNull(
    transform: (T) -> R?
): List<R>
```

단일 메서드 대신:

```kotlin
fun <T, R> Iterable<T>.map(
    includeNullResults: Boolean = true, 
    transform: (T) -> R
): List<R>
```

또 다른 좋은 접근 방식은 `enum` 클래스를 사용하여 다른 동작 모드(operation mode)를 정의하는 것입니다. 이 접근 방식은 여러 동작 모드가 있거나 시간이 지남에 따라 이러한 모드가 변경될 것으로 예상되는 경우 유용합니다.

## 숫자 타입을 적절하게 사용하세요

Kotlin은 API의 일부로 사용할 수 있는 숫자 타입 세트를 정의합니다. 다음은 이를 적절하게 사용하는 방법입니다.

*   `Int`, `Long`, `Double` 타입을 산술 타입(arithmetic type)으로 사용하세요. 이들은 계산이 수행되는 값을 나타냅니다.
*   비산술적 엔티티(non-arithmetic entity)에 산술 타입을 사용하는 것을 피하세요. 예를 들어, ID를 `Long`으로 표현하면, 사용자들이 ID가 순서대로 할당된다는 가정하에 ID를 비교하려는 유혹을 받을 수 있습니다. 이는 신뢰할 수 없거나 무의미한 결과로 이어지거나, 경고 없이 변경될 수 있는 구현에 대한 종속성을 생성할 수 있습니다. 더 나은 전략은 ID 추상화(abstraction)를 위한 특수화된 클래스를 정의하는 것입니다. 성능에 영향을 주지 않고 이러한 추상화를 구축하기 위해 [인라인 값 클래스(Inline value class)](inline-classes.md)를 사용할 수 있습니다. [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 클래스 예시를 참조하세요.
*   `Byte`, `Float`, `Short` 타입은 메모리 레이아웃 타입(memory layout type)입니다. 이들은 캐시나 네트워크를 통해 데이터를 전송할 때와 같이 값을 저장하는 데 사용할 수 있는 메모리 양을 제한하는 데 사용됩니다. 이 타입들은 기본 데이터가 해당 타입 내에 안정적으로 맞고 계산이 필요하지 않을 때만 사용해야 합니다.
*   부호 없는 정수 타입(`UByte`, `UShort`, `UInt`, `ULong`)은 주어진 형식에서 사용 가능한 양수 값의 전체 범위를 활용하기 위해 사용해야 합니다. 이들은 부호 있는 타입의 범위를 넘어서는 값이 필요하거나 네이티브 라이브러리와의 상호 운용성(interoperability)을 위한 시나리오에 적합합니다. 그러나 도메인이 [음이 아닌 정수(non-negative integers)](unsigned-integer-types.md#non-goals)만 요구하는 상황에서는 사용을 피하세요.

## 다음 단계

가이드의 다음 부분에서는 일관성(consistency)에 대해 배울 것입니다.

[다음 부분으로 진행](api-guidelines-consistency.md)