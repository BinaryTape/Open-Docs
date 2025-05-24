---
title: "KSP는 Kotlin 코드를 어떻게 모델링하는가"
---
[KSP GitHub 저장소](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)에서 API 정의를 찾을 수 있습니다.
다음 다이어그램은 Kotlin이 KSP에서 어떻게 [모델링](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)되는지에 대한 개요를 보여줍니다.

<img src="/img/ksp-class-diagram.svg" alt="class diagram" width="800" style={{verticalAlign: 'middle'}}/>
:::note
[전체 크기 다이어그램 보기](https://kotlinlang.org/docs/images/ksp-class-diagram.svg).

:::

## 타입 및 확인(resolution)

확인(resolution)은 기본 API 구현 비용의 대부분을 차지합니다. 따라서 타입 참조는 프로세서가 명시적으로 확인(resolve)하도록 설계되었습니다(몇 가지 예외는 있음). `KSFunctionDeclaration.returnType` 또는 `KSAnnotation.annotationType`과 같은 _타입_이 참조되면 항상 `KSTypeReference`이며, 이는 어노테이션 및 수정자가 있는 `KSReferenceElement`입니다.

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference`는 Kotlin의 타입 시스템에서 타입을 참조하는 `KSType`으로 확인(resolve)될 수 있습니다.

`KSTypeReference`에는 Kotlin의 프로그램 구조, 즉 참조가 작성되는 방식을 모델링하는 `KSReferenceElement`가 있습니다. 이는 Kotlin 문법의 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 요소에 해당합니다.

`KSReferenceElement`는 `KSClassifierReference` 또는 `KSCallableReference`가 될 수 있으며, 여기에는 확인(resolution) 없이도 유용한 정보가 많이 포함되어 있습니다. 예를 들어 `KSClassifierReference`에는 `referencedName`이 있고 `KSCallableReference`에는 `receiverType`, `functionArguments` 및 `returnType`이 있습니다.

`KSTypeReference`가 참조하는 원래 선언이 필요한 경우 일반적으로 `KSType`으로 확인(resolve)하고 `KSType.declaration`을 통해 액세스하여 찾을 수 있습니다. 타입이 언급된 위치에서 해당 클래스가 정의된 위치로 이동하는 것은 다음과 같습니다.

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

타입 확인(resolution)은 비용이 많이 들기 때문에 명시적인 형태를 갖습니다. 확인(resolution)에서 얻은 정보 중 일부는 이미 `KSReferenceElement`에 있습니다. 예를 들어 `KSClassifierReference.referencedName`은 흥미롭지 않은 많은 요소를 필터링할 수 있습니다. `KSDeclaration` 또는 `KSType`에서 특정 정보가 필요한 경우에만 타입을 확인(resolve)해야 합니다.

함수 타입을 가리키는 `KSTypeReference`는 해당 요소에 대부분의 정보를 가지고 있습니다.
`Function0`, `Function1` 등의 패밀리로 확인(resolve)될 수 있지만 이러한 확인(resolution)은 `KSCallableReference`보다 더 많은 정보를 제공하지 않습니다. 함수 타입 참조를 확인(resolve)하는 한 가지 사용 사례는 함수의 프로토타입의 아이덴티티를 처리하는 것입니다.