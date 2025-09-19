[//]: # (title: 자바와 코틀린 비교)

## 코틀린에서 해결된 자바의 일부 문제점

코틀린은 자바가 겪는 여러 문제점을 해결합니다:

*   널 참조는 [타입 시스템으로 제어](null-safety.md)됩니다.
*   [원시 타입 없음](java-interop.md#java-generics-in-kotlin)
*   코틀린의 배열은 [불변](arrays.md)입니다.
*   코틀린은 자바의 SAM 변환과 달리 제대로 된 [함수 타입](lambdas.md#function-types)을 가집니다.
*   와일드카드 없이 [사용-지점 변성](generics.md#use-site-variance-type-projections)을 지원합니다.
*   코틀린은 검사 [예외](exceptions.md)를 지원하지 않습니다.
*   [읽기 전용 및 가변 컬렉션을 위한 별도의 인터페이스](collections-overview.md)를 제공합니다.

## 자바에 있지만 코틀린에 없는 기능

*   [검사 예외](exceptions.md)
*   클래스가 아닌 [원시 타입](basic-types.md). 바이트코드는 가능한 경우 원시 타입을 사용하지만, 명시적으로 사용할 수는 없습니다.
*   [정적 멤버](classes.md)는 [동반 객체](object-declarations.md#companion-objects), [최상위 함수](functions.md), [확장 함수](extensions.md#extension-functions) 또는 [`@JvmStatic`](java-to-kotlin-interop.md#static-methods)로 대체됩니다.
*   [와일드카드 타입](generics.md)은 [선언-지점 변성](generics.md#declaration-site-variance) 및 [타입 프로젝션](generics.md#type-projections)으로 대체됩니다.
*   [삼항 연산자 `a ? b : c`](control-flow.md#if-expression)는 [if 표현식](control-flow.md#if-expression)으로 대체됩니다.
*   [레코드](https://openjdk.org/jeps/395)
*   [패턴 매칭](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
*   패키지 전용 [가시성 한정자](visibility-modifiers.md)

## 코틀린에 있지만 자바에 없는 기능

*   [람다 식](lambdas.md) + [인라인 함수](inline-functions.md) = 고성능 사용자 정의 제어 구조
*   [확장 함수](extensions.md)
*   [널 안정성](null-safety.md)
*   [스마트 캐스트](typecasts.md) (**Java 16**: [Pattern Matching for instanceof](https://openjdk.org/jeps/394))
*   [문자열 템플릿](strings.md)
*   [프로퍼티](properties.md)
*   [주 생성자](classes.md)
*   [일급 위임](delegation.md)
*   [변수 및 프로퍼티 타입 추론](basic-types.md) (**Java 10**: [Local-Variable Type Inference](https://openjdk.org/jeps/286))
*   [싱글톤](object-declarations.md)
*   [선언-지점 변성 및 타입 프로젝션](generics.md)
*   [범위 표현식](ranges.md)
*   [연산자 오버로딩](operator-overloading.md)
*   [동반 객체](classes.md#companion-objects)
*   [데이터 클래스](data-classes.md)
*   [코루틴](coroutines-overview.md)
*   [최상위 함수](functions.md)
*   [기본값이 있는 파라미터](functions.md#parameters-with-default-values)
*   [이름이 있는 파라미터](functions.md#named-arguments)
*   [중위 함수](functions.md#infix-notation)
*   [expect 및 actual 선언](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)
*   [명시적 API 모드](whatsnew14.md#explicit-api-mode-for-library-authors) 및 [API 표면에 대한 더 나은 제어](opt-in-requirements.md)

## 다음 단계는?

다음 방법을 알아보세요:
*   [자바 및 코틀린에서 문자열을 사용하여 일반적인 작업 수행](java-to-kotlin-idioms-strings.md).
*   [자바 및 코틀린에서 컬렉션을 사용하여 일반적인 작업 수행](java-to-kotlin-collections-guide.md).
*   [자바 및 코틀린에서 널러블 처리](java-to-kotlin-nullability-guide.md).