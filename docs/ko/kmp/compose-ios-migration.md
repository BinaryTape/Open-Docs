[//]: # (title: iOS 마이그레이션 가이드)

이 페이지에서는 프로젝트의 Compose Multiplatform 라이브러리를 1.7.0 이후의 최신 버전으로 업그레이드할 때 고려해야 할 iOS 관련 사항들을 안내합니다.

## Compose Multiplatform 1.6.11에서 1.7.0으로

### UIKitView 및 UIKitViewController에서 background 파라미터 제거

기존의 (Deprecated) `UIKitView` 및 `UIKitViewController` API에는 `background` 파라미터가 있었으나, 새로운 API에는 포함되지 않습니다. 이 파라미터는 불필요한 것으로 판단되어 제거되었습니다.

* 새로운 인스턴스의 상호운용성 뷰(interop view) 배경을 설정해야 하는 경우, `factory` 파라미터를 사용하여 설정할 수 있습니다.
* 배경을 업데이트 가능하게 하려면 해당 코드를 `update` 람다에 작성하십시오.

### 터치 또는 제스처가 예상대로 작동하지 않을 수 있음

새로운 기본 [터치 동작](compose-ios-touch.md)은 지연 시간을 사용하여 터치가 상호운용성 뷰를 위한 것인지, 아니면 해당 뷰의 Compose 컨테이너를 위한 것인지 결정합니다. 사용자가 최소 150ms 동안 가만히 터치를 유지해야 상호운용성 뷰가 터치를 수신합니다.

Compose Multiplatform이 이전처럼 터치를 처리하도록 하려면 새로운 실험적 `UIKitInteropProperties` 생성자를 고려해 보십시오.
여기에는 `interactionMode` 파라미터가 있으며, 이를 `UIKitInteropInteractionMode.NonCooperative`로 설정하면 Compose가 터치를 상호운용성 뷰로 직접 전달하도록 만들 수 있습니다.

이 생성자는 실험적(experimental)으로 표시되어 있는데, 이는 최종적으로 상호운용성 뷰의 상호작용 가능 여부를 단일 불리언(bool) 플래그로 유지할 계획이기 때문입니다. `interactionMode` 파라미터에서 명시적으로 설명된 동작은 향후 자동으로 유추될 가능성이 높습니다.

### accessibilityEnabled가 isNativeAccessibilityEnabled로 교체되었으며, 기본적으로 비활성화됨

이전 `UIKitView` 및 `UIKitViewController` 생성자의 `accessibilityEnabled` 파라미터는 `UIKitInteropProperties.isNativeAccessibilityEnabled` 속성으로 이동 및 이름이 변경되었습니다. 또한 기본적으로 `false`로 설정됩니다.

`isNativeAccessibilityEnabled` 속성은 병합된 Compose 하위 트리에 네이티브 접근성 분석(native accessibility resolution)을 적용합니다. 웹 뷰와 같이 상호운용성 뷰의 풍부한 접근성 기능이 필요한 경우가 아니라면 이 값을 true로 설정하지 않는 것이 좋습니다.

이 속성과 기본값에 대한 근거는 [`UIKitInteropProperties` 클래스의 인코드(in-code) 문서](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)를 참조하십시오.

### onResize 파라미터 제거

이전 `UIKitView` 및 `UIKitViewController` 생성자의 `onResize` 파라미터는 `rect` 인자를 기반으로 커스텀 프레임을 설정했지만, Compose 레이아웃 자체에는 영향을 주지 않아 사용하기 직관적이지 않았습니다. 게다가 `onResize` 파라미터의 기본 구현은 상호운용성 뷰의 프레임을 적절히 설정해야 했으며, 뷰를 적절히 클리핑하는 것에 대한 일부 구현 세부 사항을 포함하고 있었습니다. <!-- TODO: what's wrong with that exactly? -->

`onResize` 없이 처리하는 방법:

* 상호운용성 뷰의 프레임 변경에 대응해야 하는 경우 다음을 수행할 수 있습니다.
    * 상호운용 `UIView`의 [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)를 오버라이드합니다.
    * 상호운용 `UIViewController`의 [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)를 오버라이드합니다.
    * 또는 `Modifier` 체인에 `onGloballyPositioned`를 추가합니다.
* 상호운용성 뷰의 프레임을 설정해야 하는 경우 `size`, `fillMaxSize` 등과 같은 해당 Compose 수정자(modifier)를 사용하십시오.

### 일부 onReset 사용 패턴이 무효화됨

`remember { UIView() }`와 함께 null이 아닌 `onReset` 람다를 사용하는 것은 올바르지 않습니다.

다음 코드를 참고하십시오.

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

`UIKitView`가 컴포지션(composition)에 진입할 때 `factory` 또는 `onReset` 중 하나만 호출되며, 둘 다 호출되지는 않습니다.
따라서 `onReset`이 null이 아니면, 기억된(remembered) `view`는 화면에 표시되는 뷰와 다를 수 있습니다.
컴포저블(composable)이 컴포지션을 떠나면서 뷰 인스턴스를 남길 수 있고, 이 뷰는 `factory`를 사용해 새로 할당하는 대신 `onReset`에서 초기화된 후 재사용될 수 있기 때문입니다.

이러한 실수를 방지하려면 생성자에서 `onReset` 값을 지정하지 마십시오.
함수를 방출하는 컨텍스트가 컴포지션에 진입한 맥락에 따라 상호운용성 뷰 내에서 콜백을 수행해야 할 수도 있습니다.
이 경우 `update` 또는 `onReset` 시점에 뷰 내부에 콜백을 저장하는 것을 고려하십시오.