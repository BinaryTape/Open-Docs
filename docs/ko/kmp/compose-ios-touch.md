[//]: # (title: iOS에서 상호 운용성을 통한 터치 이벤트 처리)

iOS에서 Compose Multiplatform은 네이티브 UIKit 및 SwiftUI 프레임워크와 통합할 수 있습니다. 이러한 통합의 한 가지 과제는 터치 처리입니다. Compose Multiplatform 앱이 네이티브 UI 요소를 포함할 때, 앱은 컨텍스트에 따라 상호 운용 영역의 터치에 다르게 반응해야 할 수 있습니다.

현재 Compose Multiplatform은 네이티브 뷰에서 터치 이벤트를 처리하는 한 가지 전략만 가지고 있습니다. 모든 터치는 네이티브 UI에 의해 전적으로 처리되며, Compose는 터치 발생 여부를 전혀 알지 못합니다.

## 상호 운용 스크롤에서의 터치

상호 운용 영역의 각 터치가 기본 네이티브 UI 요소로 즉시 전송될 때, 컨테이너 컴포저블은 동일한 터치에 반응할 수 없습니다. 이로 인해 발생하는 가장 명확한 문제는 스크롤입니다. 상호 운용 영역이 스크롤 가능한 컨테이너 내에 있는 경우, 사용자는 해당 영역이 다음처럼 동작하기를 기대할 수 있습니다:

*   사용자가 상호 작용하기를 원할 때 터치에 반응합니다.
*   사용자가 부모 컨테이너를 스크롤하기를 원할 때 터치에 반응하지 않습니다.

이를 해결하기 위해 Compose Multiplatform은 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview)에 의해 영감을 받은 동작을 구현합니다. 터치가 처음 감지되면, 앱이 컨테이너에 터치 인식을 허용할지 여부를 결정하게 하는 짧은 지연(150ms)이 있습니다:

*   Compose 컴포넌트가 이 지연 시간 동안 터치 이벤트를 소비하면, Compose Multiplatform은 네이티브 UI 요소에 이 터치 시퀀스를 알리지 않습니다.
*   지연 시간 동안 이벤트가 소비되지 않으면, 나머지 터치 시퀀스에 대해 Compose Multiplatform은 네이티브 UI에 제어권을 넘겨줍니다.

따라서 스크롤 가능한 콘텐츠에서 사용자가 터치를 길게 누르면, UI는 이를 네이티브 요소와 상호 작용하려는 의도로 해석합니다. 터치 시퀀스가 빠르면, 사용자는 부모 요소와 상호 작용하기를 원할 가능성이 높습니다.

상호 운용 뷰가 상호 작용을 위한 것이 아니라면, 모든 터치 처리를 미리 비활성화할 수 있습니다. 그렇게 하려면 `UIKitView` 또는 `UIKitViewController`의 생성자를 `isInteractive` 매개변수를 `false`로 설정하여 호출하세요.

> 상호 운용 뷰 내에서 제스처를 처리하는 더 복잡한 시나리오의 경우,
> `UIGestureRecognizer` 클래스 또는 그 다양한 서브클래스를 사용하세요.
> 이는 네이티브 상호 운용 뷰에서 원하는 제스처를 감지하고 Compose의 터치 시퀀스를 취소할 수 있게 해줍니다.
>
{style="note"}

## 터치 처리 전략 선택
<primary-label ref="Experimental"/>

Compose Multiplatform %org.jetbrains.compose%를 사용하면 상호 운용 UI에 대한 더 세밀한 제어를 위한 실험적인 API도 사용해 볼 수 있습니다.

`UIKitView` 또는 `UIKitViewController`의 새로운 생성자는 `UIKitInteropProperties` 객체를 인수로 허용합니다. 이 객체는 다음을 설정할 수 있게 합니다:

*   주어진 상호 운용 뷰에 대한 `interactionMode` 매개변수로, 터치 처리 전략을 선택할 수 있게 합니다.
*   상호 운용 뷰의 접근성 동작을 변경하는 `isNativeAccessibilityEnabled` 옵션입니다.

`interactionMode` 매개변수는 `Cooperative` 또는 `NonCooperative`로 설정할 수 있습니다:

*   `Cooperative` 모드는 위에 설명된 새로운 기본값입니다: Compose Multiplatform은 터치 처리에 지연을 도입합니다. 실험적인 API를 사용하면 기본 150ms 대신 다른 값을 시도하여 이 지연을 세밀하게 조정할 수 있습니다.
*   NonCooperative 모드는 이전 전략을 사용하며, Compose Multiplatform은 상호 운용 뷰에서 어떠한 터치 이벤트도 처리하지 않습니다. 위에 나열된 일반적인 문제에도 불구하고, 이 모드는 상호 운용 터치가 Compose 수준에서 처리될 필요가 전혀 없다고 확신하는 경우 유용할 수 있습니다.
*   네이티브 UI와의 상호 작용을 비활성화하려면, 생성자에 `interactionMode = null`을 전달하세요.

## 다음 단계는 무엇인가요?

Compose Multiplatform의 [UIKit](compose-uikit-integration.md) 및 [SwiftUI](compose-swiftui-integration.md) 통합에 대해 자세히 알아보세요.