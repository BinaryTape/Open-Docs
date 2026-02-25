[//]: # (title: Java와의 비교)

## Kotlin에서 해결된 Java의 문제점들

Kotlin은 Java가 겪고 있는 일련의 문제들을 해결합니다:

* Null 참조는 [타입 시스템에 의해 제어됩니다](null-safety.md).
* [로 타입(raw types)이 없습니다](java-interop.md#java-generics-in-kotlin).
* Kotlin의 배열은 [무변(invariant)입니다](arrays.md).
* Kotlin은 Java의 SAM 변환과 달리, 제대로 된 [함수 타입(function types)](lambdas.md#function-types)을 갖습니다.
* 와일드카드 없는 [사용 지점 변성(use-site variance)](generics.md#use-site-variance-type-projections).
* Kotlin에는 체크드 [예외(exceptions)](exceptions.md)가 없습니다.
* [읽기 전용 컬렉션과 가변 컬렉션을 위한 인터페이스가 분리되어 있습니다](collections-overview.md).

## Java에는 있지만 Kotlin에는 없는 것

* [체크드 예외(Checked exceptions)](exceptions.md)
* 클래스가 아닌 [기본 타입(Primitive types)](types-overview.md). 바이트코드에서는 가능한 경우 기본 타입을 사용하지만, 명시적으로 사용할 수는 없습니다.
* [정적 멤버(Static members)](classes.md)는 [컴패니언 객체(companion objects)](object-declarations.md#companion-objects), [최상위 함수(top-level functions)](functions.md), [확장 함수(extension functions)](extensions.md#extension-functions), 또는 [@JvmStatic](java-to-kotlin-interop.md#static-methods)으로 대체됩니다.
* [와일드카드 타입(Wildcard-types)](generics.md)은 [선언 지점 변성(declaration-site variance)](generics.md#declaration-site-variance) 및 [타입 프로젝션(type projections)](generics.md#type-projections)으로 대체됩니다.
* [삼항 연산자 `a ? b : c`](control-flow.md#if-expression)는 [if 식(if expression)](control-flow.md#if-expression)으로 대체됩니다.
* [레코드(Records)](https://openjdk.org/jeps/395)
* 패키지 수준의 [가시성 수정자(visibility modifier)](visibility-modifiers.md)

> Kotlin에는 패턴 매칭(pattern matching)이 없지만, [Kotlin의 스마트 캐스트(smart casts)](typecasts.md#smart-casts)는 [Java의 패턴 매칭](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)과 유사한 기능을 제공합니다.
>
> 자세한 내용은 [JetBrains의 공식 Kotlin 채널 동영상](https://www.youtube.com/watch?v=yJDoa42X-wQ)에서 확인하세요.
>
{style="note"}

## Kotlin에는 있지만 Java에는 없는 것

* [람다 식(Lambda expressions)](lambdas.md) + [인라인 함수(Inline functions)](inline-functions.md) = 성능이 뛰어난 사용자 정의 제어 구조
* [확장 함수(Extension functions)](extensions.md)
* [Null 안전성(Null-safety)](null-safety.md)
* [문자열 템플릿(String templates)](strings.md)
* [프로퍼티(Properties)](properties.md)
* [기본 생성자(Primary constructors)](classes.md)
* [일급 위임(First-class delegation)](delegation.md)
* [변수 및 프로퍼티 타입에 대한 타입 추론](types-overview.md) (**Java 10**: [로컬 변수 타입 추론](https://openjdk.org/jeps/286))
* [싱글톤(Singletons)](object-declarations.md)
* [선언 지점 변성 및 타입 프로젝션(Declaration-site variance & Type projections)](generics.md)
* [범위 식(Range expressions)](ranges.md)
* [연산자 오버로딩(Operator overloading)](operator-overloading.md)
* [컴패니언 객체(Companion objects)](classes.md#companion-objects)
* [데이터 클래스(Data classes)](data-classes.md)
* [코루틴(Coroutines)](coroutines-overview.md)
* [최상위 함수(Top-level functions)](functions.md)
* [디폴트 값을 가진 파라미터(Parameters with default values)](functions.md#parameters-with-default-values)
* [이름이 있는 파라미터(Named parameters)](functions.md#named-arguments)
* [중위 함수(Infix functions)](functions.md#infix-notation)
* [Expect 및 actual 선언](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)
* [명시적 API 모드(Explicit API mode)](whatsnew14.md#explicit-api-mode-for-library-authors) 및 [API 노출의 향상된 제어](opt-in-requirements.md)

> Java에는 스마트 캐스트가 없지만, [패턴 매칭](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)이 [Kotlin의 스마트 캐스트(smart casts)](typecasts.md#smart-casts)와 유사한 기능을 제공합니다.
>
> 자세한 내용은 [JetBrains의 공식 Kotlin 채널 동영상](https://www.youtube.com/watch?v=yJDoa42X-wQ)에서 확인하세요.
>
{style="note"}

## 다음 단계는?

다음 방법들을 알아보세요:
* [Java와 Kotlin의 문자열을 활용한 일반적인 작업](java-to-kotlin-idioms-strings.md) 수행 방법.
* [Java와 Kotlin의 컬렉션을 활용한 일반적인 작업](java-to-kotlin-collections-guide.md) 수행 방법.
* [Java와 Kotlin의 Null 허용 여부(nullability) 처리](java-to-kotlin-nullability-guide.md) 방법.