[//]: # (title: KSP의 Kotlin 코드 모델링 방식)

[KSP GitHub 저장소](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)에서 API 정의를 찾을 수 있습니다.
다음 다이어그램은 KSP에서 Kotlin이 어떻게 [모델링](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)되는지 개요를 보여줍니다.

![class diagram](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [전체 크기 다이어그램 보기](https://kotlinlang.org/docs/images/ksp-class-diagram.svg).
>
{style="note"}

## 타입 및 해석 (Resolution)

해석(Resolution)은 기반 API 구현에서 대부분의 비용을 차지합니다. 따라서 타입 참조는 (몇 가지 예외를 제외하고) 프로세서에 의해 명시적으로 해석되도록 설계되었습니다. `KSFunctionDeclaration.returnType` 또는 `KSAnnotation.annotationType`과 같은 _타입_이 참조될 때, 이는 항상 어노테이션과 수정자를 포함하는 `KSReferenceElement`인 `KSTypeReference`입니다.

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference`는 Kotlin의 타입 시스템에 있는 타입을 참조하는 `KSType`으로 해석될 수 있습니다.

`KSTypeReference`는 `KSReferenceElement`를 가지며, 이는 Kotlin의 프로그램 구조, 즉 참조가 작성된 방식을 모델링합니다. 이는 Kotlin 문법의 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 요소에 해당합니다.

`KSReferenceElement`는 `KSClassifierReference` 또는 `KSCallableReference`가 될 수 있으며, 이들은 해석할 필요 없이 많은 유용한 정보를 포함합니다. 예를 들어, `KSClassifierReference`는 `referencedName`을 가지며, 반면에 `KSCallableReference`는 `receiverType`, `functionArguments`, `returnType`을 가집니다.

`KSTypeReference`가 참조하는 원래 선언이 필요한 경우, 일반적으로 `KSType`으로 해석한 다음 `KSType.declaration`을 통해 접근하여 찾을 수 있습니다. 타입이 언급된 위치에서 해당 클래스가 정의된 위치로 이동하는 과정은 다음과 같습니다.

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

타입 해석은 비용이 많이 들며 따라서 명시적인 형태를 가집니다. 해석을 통해 얻을 수 있는 정보 중 일부는 이미 `KSReferenceElement`에서 사용 가능합니다. 예를 들어, `KSClassifierReference.referencedName`은 흥미롭지 않은 많은 요소를 걸러낼 수 있습니다. `KSDeclaration` 또는 `KSType`에서 특정 정보가 필요한 경우에만 타입을 해석해야 합니다.

함수 타입을 가리키는 `KSTypeReference`는 대부분의 정보를 자체 요소 내에 가지고 있습니다. 비록 `Function0`, `Function1` 등과 같은 함수 패밀리로 해석될 수 있지만, 이러한 해석들은 `KSCallableReference`보다 더 많은 정보를 제공하지 않습니다. 함수 타입 참조를 해석하는 한 가지 사용 사례는 함수의 프로토타입의 정체성(identity)을 다루는 것입니다.