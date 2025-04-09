---
title: "Java와 비교"
---
## Kotlin에서 해결된 일부 Java 문제

Kotlin은 Java가 겪는 일련의 문제들을 해결합니다.

* Null 참조는 [타입 시스템에 의해 제어됩니다](null-safety).
* [Raw 타입이 없습니다](java-interop#java-generics-in-kotlin)
* Kotlin의 배열은 [불변입니다](arrays)
* Kotlin은 Java의 SAM-conversion과 달리 적절한 [함수 타입](lambdas#function-types)을 가지고 있습니다.
* 와일드카드 없는 [Use-site variance](generics#use-site-variance-type-projections)
* Kotlin은 checked [예외](exceptions)를 가지고 있지 않습니다.
* [읽기 전용 및 변경 가능한 컬렉션을 위한 별도의 인터페이스](collections-overview)

## Kotlin에 없는 Java의 기능

* [Checked 예외](exceptions)
* 클래스가 아닌 [Primitive 타입](basic-types). 바이트 코드는 가능한 경우 primitive 타입을 사용하지만 명시적으로 사용할 수는 없습니다.
* [Static 멤버](classes)는 [companion objects](object-declarations#companion-objects), [top-level functions](functions), [extension functions](extensions#extension-functions) 또는 [@JvmStatic](java-to-kotlin-interop#static-methods)으로 대체됩니다.
* [Wildcard-types](generics)는 [declaration-site variance](generics#declaration-site-variance) 및 [type projections](generics#type-projections)로 대체됩니다.
* [삼항 연산자 `a ? b : c`](control-flow#if-expression)는 [if expression](control-flow#if-expression)으로 대체됩니다.
* [Records](https://openjdk.org/jeps/395)
* [Pattern Matching](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
* package-private [visibility modifier](visibility-modifiers)

## Java에 없는 Kotlin의 기능

* [Lambda expressions](lambdas) + [Inline functions](inline-functions) = 성능이 뛰어난 사용자 정의 제어 구조
* [Extension functions](extensions)
* [Null-safety](null-safety)
* [Smart casts](typecasts) (**Java 16**: [Pattern Matching for instanceof](https://openjdk.org/jeps/394))
* [String templates](strings) (**Java 21**: [String Templates (Preview)](https://openjdk.org/jeps/430))
* [Properties](properties)
* [Primary constructors](classes)
* [First-class delegation](delegation)
* [변수 및 프로퍼티 타입에 대한 타입 추론](basic-types) (**Java 10**: [Local-Variable Type Inference](https://openjdk.org/jeps/286))
* [Singletons](object-declarations)
* [Declaration-site variance & Type projections](generics)
* [Range expressions](ranges)
* [Operator overloading](operator-overloading)
* [Companion objects](classes#companion-objects)
* [Data classes](data-classes)
* [Coroutines](coroutines-overview)
* [Top-level functions](functions)
* [Default arguments](functions#default-arguments)
* [Named parameters](functions#named-arguments)
* [Infix functions](functions#infix-notation)
* [Expect and actual declarations](multiplatform-expect-actual)
* [Explicit API mode](whatsnew14#explicit-api-mode-for-library-authors) 및 [API 표면에 대한 더 나은 제어](opt-in-requirements)

## 다음 단계는?

다음 방법을 알아보세요.
* [Java 및 Kotlin에서 문자열로 일반적인 작업 수행](java-to-kotlin-idioms-strings).
* [Java 및 Kotlin에서 컬렉션으로 일반적인 작업 수행](java-to-kotlin-collections-guide).
* [Java 및 Kotlin에서 Nullability 처리](java-to-kotlin-nullability-guide).