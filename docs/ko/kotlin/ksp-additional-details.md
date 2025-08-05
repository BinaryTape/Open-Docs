[//]: # (title: KSP가 Kotlin 코드를 모델링하는 방법)

API 정의는 [KSP GitHub 리포지토리](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)에서 찾을 수 있습니다.
다음 다이어그램은 KSP에서 Kotlin이 [모델링되는](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/) 방식에 대한 개요를 보여줍니다.

![클래스 다이어그램](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [전체 크기 다이어그램 보기](https://kotlinlang.org/docs/images/ksp-class-diagram.svg).
>
{style="note"}

## 타입 및 해석

해석(resolution)은 기본 API 구현의 비용 대부분을 차지합니다. 따라서 타입 참조는 (몇 가지 예외는 있지만) 프로세서에 의해 명시적으로 해석되도록 설계되었습니다. `_타입_`(`KSFunctionDeclaration.returnType` 또는 `KSAnnotation.annotationType` 등)이 참조될 때, 항상 `KSTypeReference`이며, 이는 어노테이션과 수정자를 포함하는 `KSReferenceElement`입니다.

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference`는 `KSType`으로 해석될 수 있으며, 이는 Kotlin의 타입 시스템에 있는 타입을 나타냅니다.

`KSTypeReference`는 `KSReferenceElement`를 가지고 있는데, 이는 Kotlin의 프로그램 구조, 즉 참조가 작성되는 방식을 모델링합니다. 이는 Kotlin 문법의 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 요소에 해당합니다.

`KSReferenceElement`는 `KSClassifierReference` 또는 `KSCallableReference`가 될 수 있으며, 해석 없이도 많은 유용한 정보를 포함합니다. 예를 들어, `KSClassifierReference`는 `referencedName`을 가지고 있고, `KSCallableReference`는 `receiverType`, `functionArguments`, `returnType`을 가집니다.

`KSTypeReference`에 의해 참조되는 원본 선언이 필요한 경우, 일반적으로 `KSType`으로 해석하고 `KSType.declaration`을 통해 접근하여 찾을 수 있습니다. 타입이 언급된 곳에서 해당 클래스가 정의된 곳으로 이동하는 방식은 다음과 같습니다.

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

타입 해석은 비용이 많이 들며 따라서 명시적인 형태를 가집니다. 해석을 통해 얻을 수 있는 정보 중 일부는 이미 `KSReferenceElement`에서 사용 가능합니다. 예를 들어, `KSClassifierReference.referencedName`은 관심 없는 많은 요소를 걸러낼 수 있습니다. `KSDeclaration` 또는 `KSType`에서 특정 정보가 필요한 경우에만 타입을 해석해야 합니다.

함수 타입을 가리키는 `KSTypeReference`는 대부분의 정보를 자체 요소에 가지고 있습니다. `Function0`, `Function1` 등의 패밀리로 해석될 수 있지만, 이러한 해석은 `KSCallableReference`보다 더 많은 정보를 제공하지 않습니다. 함수 타입 참조를 해석하는 한 가지 사용 사례는 함수 프로토타입의 동일성(identity)을 다루는 것입니다.