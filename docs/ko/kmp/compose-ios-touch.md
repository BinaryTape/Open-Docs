[//]: # (title: iOS에서 상호 운용(interop) 시 터치 이벤트 처리)

iOS에서 Compose Multiplatform은 네이티브 UIKit 및 SwiftUI 프레임워크와 통합될 수 있습니다.
이러한 통합의 한 가지 과제는 터치를 처리하는 것입니다. Compose Multiplatform 앱에 네이티브 UI 요소가 포함되어 있는 경우,
앱은 컨텍스트에 따라 상호 운용(interop) 영역에서의 터치에 다르게 반응해야 할 수도 있습니다.

현재 Compose Multiplatform은 네이티브 뷰의 터치 이벤트를 처리하기 위한 단 한 가지 전략만 제공합니다.
모든 터치는 네이티브 UI에 의해 전적으로 처리되며, Compose는 터치가 발생했다는 사실조차 인식하지 못합니다.

## 상호 운용 스크롤에서의 터치

상호 운용 영역의 각 터치가 즉시 기본 네이티브 UI 요소로 전송되면,
컨테이너 컴포저블(container composable)은 동일한 터치에 반응할 수 없습니다.
이로 인해 발생하는 가장 명백한 문제는 스크롤입니다. 상호 운용 영역이 스크롤 가능한 컨테이너 안에 있는 경우, 사용자는 해당 영역이 다음과 같이 동작하기를 기대할 수 있습니다:

*   해당 영역과 상호 작용하고 싶을 때는 터치에 반응합니다.
*   부모 컨테이너를 스크롤하고 싶을 때는 터치에 반응하지 않습니다.

이를 해결하기 위해 Compose Multiplatform은 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview)에서 영감을 얻은 동작을 구현합니다.
터치가 처음 감지되면 짧은 지연 시간(150ms)이 발생하며, 이 시간 동안 앱은 컨테이너가 터치를 인식하게 할지 여부를 결정할 수 있습니다:

*   이 지연 시간 동안 Compose 컴포넌트가 터치 이벤트를 소비(consume)하면, Compose Multiplatform은 네이티브 UI 요소가
    이 터치 시퀀스를 인식하지 못하게 합니다.
*   지연 시간 동안 소비되는 이벤트가 없으면, 나머지 터치 시퀀스에 대해 Compose Multiplatform은
    제어권을 네이티브 UI에 넘깁니다.

따라서 스크롤 가능한 콘텐츠의 경우, 사용자가 터치를 유지하면 UI는 이를 네이티브 요소와 상호 작용하려는 의도로 해석합니다.
터치 시퀀스가 빠르면 사용자가 부모 요소와 상호 작용하기를 원하는 것으로 간주합니다.

상호 운용 뷰가 상호 작용을 위한 것이 아니라면, 사전에 모든 터치 처리를 비활성화할 수 있습니다.
이를 위해 `isInteractive` 매개변수를 `false`로 설정하여 `UIKitView` 또는 `UIKitViewController`의 생성자를 호출하십시오.

> 상호 운용 뷰 내부에서 제스처를 처리하는 더 복잡한 시나리오의 경우,
> `UIGestureRecognizer` 클래스 또는 그 다양한 하위 클래스를 사용하십시오.
> 이를 통해 네이티브 상호 운용 뷰에서 원하는 제스처를 감지할 뿐만 아니라 Compose에서의 터치 시퀀스를 취소할 수 있습니다.
>
{style="note"}

## 터치 처리 전략 선택
<primary-label ref="Experimental"/>

Compose Multiplatform %org.jetbrains.compose%에서는 상호 운용 UI를 더 세밀하게 제어할 수 있는 실험적(experimental) API를 사용해 볼 수도 있습니다.

`UIKitView` 또는 `UIKitViewController`의 새 생성자는 `UIKitInteropProperties` 객체를 인수로 받습니다.
이 객체를 통해 다음을 설정할 수 있습니다:

*   지정된 상호 운용 뷰에 대한 `interactionMode` 매개변수: 터치 처리 전략을 선택할 수 있습니다.
*   `isNativeAccessibilityEnabled` 옵션: 상호 운용 뷰의 접근성(accessibility) 동작을 변경합니다.

`interactionMode` 매개변수는 `Cooperative` 또는 `NonCooperative`로 설정할 수 있습니다:

*   `Cooperative` 모드는 위에서 설명한 대로 새로운 기본값입니다. Compose Multiplatform은 터치 처리에 지연을 도입합니다.
    실험적 API를 사용하면 기본값인 150ms 대신 다른 값을 시도하여 이 지연 시간을 미세 조정할 수 있습니다.
*   `NonCooperative` 모드는 이전 전략을 사용하며, Compose Multiplatform은 상호 운용 뷰에서 어떠한 터치 이벤트도 처리하지 않습니다.
    위에 나열된 일반적인 문제에도 불구하고, 상호 운용 터치를 Compose 수준에서 처리할 필요가 없다고 확신하는 경우
    이 모드가 유용할 수 있습니다.
*   네이티브 UI와의 모든 상호 작용을 비활성화하려면 생성자에 `interactionMode = null`을 전달하십시오.

## 다음 단계

Compose Multiplatform의 [UIKit](compose-uikit-integration.md) 및 [SwiftUI](compose-swiftui-integration.md) 통합에 대해 자세히 알아보세요.