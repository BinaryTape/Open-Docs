[//]: # (title: KSP가 Kotlin 코드를 모델링하는 방법)

API 정의는 [KSP GitHub 저장소](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)에서 확인할 수 있습니다.
다음 다이어그램은 KSP에서 Kotlin이 어떻게 [모델링](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)되는지에 대한 개요를 보여줍니다.

![class diagram](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [전체 크기 다이어그램 보기](https://kotlinlang.org/docs/images/ksp-class-diagram.svg).
>
{style="note"}

## 타입 및 해소 (Type and resolution)

해소(resolution)는 기본 API 구현 비용의 대부분을 차지합니다. 따라서 타입 참조(type reference)는 (몇 가지 예외를 제외하고) 프로세서에 의해 명시적으로 해소되도록 설계되었습니다. `KSFunctionDeclaration.returnType`이나 `KSAnnotation.annotationType`과 같이 _타입(type)_이 참조될 때, 이는 항상 애노테이션과 수정자(modifier)를 가진 `KSReferenceElement`인 `KSTypeReference`가 됩니다.

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference`는 Kotlin 타입 시스템의 타입을 참조하는 `KSType`으로 해소될 수 있습니다.

`KSTypeReference`는 Kotlin 프로그램 구조, 즉 참조가 작성된 방식을 모델링하는 `KSReferenceElement`를 가집니다. 이는 Kotlin 문법의 [`type`](https://kotlinlang.org/grammar/#type) 요소에 대응합니다.

`KSReferenceElement`는 `KSClassifierReference` 또는 `KSCallableReference`가 될 수 있으며, 해소할 필요 없이 많은 유용한 정보를 포함하고 있습니다. 예를 들어, `KSClassifierReference`는 `referencedName`을 가지며, `KSCallableReference`는 `receiverType`, `functionArguments`, `returnType`을 가집니다.

`KSTypeReference`가 참조하는 원본 선언(original declaration)이 필요한 경우, 일반적으로 `KSType`으로 해소한 후 `KSType.declaration`을 통해 접근하여 찾을 수 있습니다. 타입이 언급된 위치에서 해당 클래스가 정의된 위치로 이동하는 과정은 다음과 같습니다.

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

타입 해소는 비용이 많이 들기 때문에 명시적인 형태를 가집니다. 해소를 통해 얻을 수 있는 정보 중 일부는 이미 `KSReferenceElement`에서 사용 가능합니다. 예를 들어, `KSClassifierReference.referencedName`을 사용하면 관심 없는 많은 요소들을 걸러낼 수 있습니다. `KSDeclaration` 또는 `KSType`의 특정 정보가 필요한 경우에만 타입을 해소해야 합니다.

함수 타입을 가리키는 `KSTypeReference`는 대부분의 정보를 해당 요소에 담고 있습니다. 비록 `Function0`, `Function1` 등의 계열로 해소될 수는 있지만, 이러한 해소가 `KSCallableReference`보다 더 많은 정보를 제공하지는 않습니다. 함수 타입 참조를 해소하는 한 가지 사용 사례는 함수 프로토타입의 식별성(identity)을 다루는 경우입니다.