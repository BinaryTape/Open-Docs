[//]: # (title: iOS 마이그레이션 가이드)

이 페이지에서는 프로젝트의 Compose Multiplatform 라이브러리를 1.7.0 버전부터 최신 버전으로 업그레이드할 때 iOS 관련 고려 사항을 안내합니다.

## Compose Multiplatform 1.6.11에서 1.7.0으로

### UIKitView 및 UIKitViewController에서 background 매개변수 제거됨

지원 중단된(deprecated) `UIKitView` 및 `UIKitViewController` API에는 `background` 매개변수가 있었지만, 새로운 API에는 없습니다. 해당 매개변수는 불필요하다고 판단되어 제거되었습니다.

*   새 인스턴스의 인터롭 뷰(interop view) 배경을 설정해야 하는 경우, `factory` 매개변수를 사용하여 설정할 수 있습니다.
*   배경을 업데이트할 수 있어야 하는 경우, 해당 코드를 `update` 람다에 넣으세요.

### 터치 또는 제스처가 예상대로 작동하지 않을 수 있음

새로운 기본 [터치 동작](compose-ios-touch.md)은 터치가 인터롭 뷰를 위한 것인지 해당 뷰의 Compose 컨테이너를 위한 것인지 판단하기 위해 지연을 사용합니다. 사용자는 인터롭 뷰가 터치를 받기 전에 최소 150ms 동안 움직이지 않고 있어야 합니다.

Compose Multiplatform이 이전처럼 터치를 처리하도록 하려면, 새로운 실험적인(experimental) `UIKitInteropProperties` 생성자를 고려해 보세요.
이 생성자에는 `interactionMode` 매개변수가 있으며, 이를 `UIKitInteropInteractionMode.NonCooperative`로 설정하여 Compose가 터치를 인터롭 뷰로 직접 전달하도록 만들 수 있습니다.

이 생성자는 궁극적으로 인터롭 뷰의 상호 작용성(interactability)을 단일 불리언 플래그로 유지하려고 하기 때문에 실험적(experimental)으로 표시되어 있습니다. `interactionMode` 매개변수에 명시된 동작은 앞으로 자동으로 파생될 가능성이 높습니다.

### accessibilityEnabled가 isNativeAccessibilityEnabled로 대체되고 기본적으로 비활성화됨

이전 `UIKitView` 및 `UIKitViewController` 생성자의 `accessibilityEnabled` 매개변수는 `UIKitInteropProperties.isNativeAccessibilityEnabled` 속성으로 이동 및 이름이 변경되어 사용할 수 있게 되었습니다. 또한 기본적으로 `false`로 설정됩니다.

`isNativeAccessibilityEnabled` 속성은 병합된 Compose 서브트리를 네이티브 접근성 해결(native accessibility resolution)로 오염시킵니다. 따라서 웹 뷰(web views)와 같은 인터롭 뷰의 풍부한 접근성 기능이 필요하지 않는 한, `true`로 설정하는 것은 권장되지 않습니다.

이 속성과 기본값에 대한 근거는 [`UIKitInteropProperties` 클래스의 코드 내 문서](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)를 참조하세요.

### onResize 매개변수 제거됨

이전 `UIKitView` 및 `UIKitViewController` 생성자의 `onResize` 매개변수는 `rect` 인자를 기반으로 사용자 지정 프레임을 설정했지만 Compose 레이아웃 자체에는 영향을 미치지 않아 사용하기 직관적이지 않았습니다. 게다가 `onResize` 매개변수의 기본 구현은 인터롭 뷰의 프레임을 올바르게 설정하고 뷰를 적절히 클리핑하는 일부 구현 세부 사항을 포함해야 했습니다. <!-- TODO: what's wrong with that exactly? -->

`onResize` 없이 작업하는 방법:

*   인터롭 뷰 프레임 변경에 반응해야 하는 경우 다음을 수행할 수 있습니다.
    *   인터롭 `UIView`의 [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)를 재정의하거나,
    *   인터롭 `UIViewController`의 [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)를 재정의하거나,
    *   `Modifier` 체인에 `onGloballyPositioned`를 추가합니다.
*   인터롭 뷰의 프레임을 설정해야 하는 경우 해당 Compose 모디파이어(`size`, `fillMaxSize` 등)를 사용하세요.

### 일부 onReset 사용 패턴이 무효화됨

null이 아닌 `onReset` 람다를 `remember { UIView() }`와 함께 사용하는 것은 올바르지 않습니다.

다음 코드를 고려해 보세요.

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

`UIKitView`가 컴포지션에 진입할 때 `factory` 또는 `onReset` 둘 중 하나가 호출되며, 둘 다 동시에 호출되지는 않습니다. 따라서 `onReset`이 null이 아니면, 기억된 `view`가 화면에 표시되는 뷰와 다를 수 있습니다. 컴포저블(composable)이 컴포지션을 떠나 뷰의 인스턴스를 남겨두면, `factory`를 사용하여 새 인스턴스를 할당하는 대신 `onReset`에서 재설정된 후 해당 인스턴스가 재사용될 수 있습니다.

이러한 실수를 피하려면 생성자에서 `onReset` 값을 지정하지 마세요.
함수를 방출하는 컨텍스트가 컴포지션에 진입하는 방식에 따라 인터롭 뷰 내부에서 콜백을 수행해야 할 수도 있습니다. 이 경우 `update`를 사용하여 뷰 내부에 콜백을 저장하는 것을 고려해 보세요.